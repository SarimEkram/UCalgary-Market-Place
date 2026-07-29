import db from "../../config/db.js";
import { promisePool } from "../../config/db.js";

// 1) Get all MARKET posts created by this user (for "My Posts" page)
// POST /api/my-posts/list
// Body: { userId }
export const getUserMarketPosts = (req, res) => {
    const userId = req.user.id;

    if (!userId) {
        return res.status(400).json({ error: "userId is required" });
    }

    const sql = `
        SELECT
            p.post_id,
            p.name,
            p.description,
            p.price,
            p.postal_code,
            p.posted_date,
            mp.item_condition,
            i.image_text_data AS thumbnail_blob
        FROM posts p
                 JOIN market_posts mp
                      ON mp.market_id = p.post_id
                 LEFT JOIN images i
                           ON i.image_id = (
                               SELECT MIN(image_id)
                               FROM images
                               WHERE post_id = p.post_id
                           )
        WHERE p.user_id = ? AND p.post_type = 'market'
        ORDER BY p.posted_date DESC
    `;

    db.query(sql, [userId], (err, rows) => {
        if (err) {
            console.error("DB error (getUserMarketPosts):", err);
            return res.status(500).json({ error: "Database error" });
        }

        const myPosts = rows.map((row) => ({
            post_id: row.post_id,
            name: row.name,
            description: row.description,
            price: row.price,
            postal_code: row.postal_code,
            posted_date: row.posted_date,
            item_condition: row.item_condition,
            thumbnail: row.thumbnail_blob
                ? Buffer.isBuffer(row.thumbnail_blob)
                    ? row.thumbnail_blob.toString("base64")
                    : row.thumbnail_blob
                : null,
        }));

        return res.status(200).json({ myPosts });
    });
};

// 2) Delete a MARKET post created by this user
// DELETE /api/my-posts/delete
// Body: { userId, postId }
export const deleteMarketPost = (req, res) => {
    const userId = req.user.id;
    const { postId } = req.body;

    if (!userId || !postId) {
        return res
            .status(400)
            .json({ error: "userId and postId are required to delete a post" });
    }

    const pid = Number(postId);
    if (!Number.isInteger(pid) || pid <= 0) {
        return res.status(400).json({ error: "Invalid postId" });
    }

    const deletePostSql = `
        DELETE FROM posts
        WHERE post_id = ? AND user_id = ? AND post_type = 'market'
    `;

    db.query(deletePostSql, [pid, userId], (err, result) => {
        if (err) {
            console.error("DB error (deleteMarketPost/posts):", err);
            return res.status(500).json({ error: "Failed to delete post" });
        }

        if (result.affectedRows === 0) {
            return res
                .status(404)
                .json({ error: "Market post not found for this user" });
        }

        return res.status(200).json({
            message: "Market post deleted successfully",
            postId: pid,
        });
    });
};


// 3) Create a new MARKET post
// POST /api/my-posts/create-market
//
// Request: multipart/form-data
// Fields (req.body):
//   - userId       (required)
//   - title        (required)
//   - description  (required)
//   - location     (required) : postal code
//   - price        (required) : numeric >= 0
//   - condition    (required) : "new" | "good" | "fair"
//
// Files (req.files via Multer):
//   - images[]     (optional) : image files to store in `images.image_text_data`.

export const createMarketPost = async (req, res) => {
    const { title, description, location, price, condition } = req.body;
    const userId = req.user.id;

    if (!userId || !title || !description || !location || typeof price === "undefined") {
        return res.status(400).json({
            error: "userId, title, description, location, and price are required",
        });
    }

    const priceNum = Number(price);
    if (!Number.isFinite(priceNum) || priceNum < 0) {
        return res.status(400).json({ error: "Invalid price" });
    }

    const normalizedCondition = String(condition || "").toLowerCase();
    if (!["new", "good", "fair"].includes(normalizedCondition)) {
        return res.status(400).json({ error: "Invalid item condition" });
    }

    const files = Array.isArray(req.files) ? req.files : [];
    const conn = await promisePool.getConnection();

    try {
        await conn.beginTransaction();

        const [postResult] = await conn.query(
            "INSERT INTO posts (user_id, post_type, postal_code, price, name, description) VALUES (?, 'market', ?, ?, ?, ?)",
            [userId, location, priceNum, title, description]
        );
        const newPostId = postResult.insertId;

        await conn.query(
            "INSERT INTO market_posts (market_id, item_condition) VALUES (?, ?)",
            [newPostId, normalizedCondition]
        );

        for (const file of files) {
            await conn.query(
                "INSERT INTO images (post_id, image_text_data) VALUES (?, ?)",
                [newPostId, file.buffer]
            );
        }

        await conn.commit();
        return res.status(201).json({ message: "Market post created successfully", postId: newPostId });
    } catch (err) {
        await conn.rollback();
        console.error("DB error (createMarketPost):", err);
        return res.status(500).json({ error: "Failed to create post" });
    } finally {
        conn.release();
    }
};


// 4) Edit a MARKET post
// PUT /api/my-posts/edit-market
//
// Request: multipart/form-data (handled by Multer in myPostsRoute.js)
// Fields (req.body):
//   - userId          (required) : ID of the user who owns the post
//   - postId          (required) : ID of the market post to update
//   - title           (required) : New post title (maps to posts.name)
//   - description     (required) : New post description
//   - location        (required) : Postal code (maps to posts.postal_code)
//   - price           (required) : New price (numeric, >= 0)
//   - condition       (required) : "new" | "good" | "fair" (maps to market_posts.item_condition)
//   - deleted_images  (optional) : JSON string or array of image_ids to delete
//
// Files (req.files via Multer):
//   - new_images[]    (optional) : One or more image files to append to this post
export const updateMarketPost = async (req, res) => {
    const { postId, title, description, location, price, condition, deleted_images } = req.body;
    const userId = req.user.id;

    if (!userId || !postId) {
        return res.status(400).json({ error: "userId and postId are required to update a post" });
    }
    if (!title || !description || !location || typeof price === "undefined") {
        return res.status(400).json({ error: "title, description, location, and price are required" });
    }

    const pid = Number(postId);
    if (!Number.isInteger(pid) || pid <= 0) {
        return res.status(400).json({ error: "Invalid postId" });
    }

    const priceNum = Number(price);
    if (!Number.isFinite(priceNum) || priceNum < 0) {
        return res.status(400).json({ error: "Invalid price" });
    }

    const normalizedCondition = String(condition || "").toLowerCase();
    if (!["new", "good", "fair"].includes(normalizedCondition)) {
        return res.status(400).json({ error: "Invalid item condition" });
    }

    let deletedIds = [];
    if (deleted_images) {
        try {
            const parsed = Array.isArray(deleted_images) ? deleted_images : JSON.parse(deleted_images);
            if (Array.isArray(parsed)) {
                deletedIds = parsed.map((id) => Number(id)).filter((id) => Number.isInteger(id) && id > 0);
            }
        } catch (e) {
            console.warn("Failed to parse deleted_images:", e);
        }
    }

    const newImages = Array.isArray(req.files) ? req.files : [];
    const conn = await promisePool.getConnection();

    try {
        await conn.beginTransaction();

        const [updateResult] = await conn.query(
            "UPDATE posts SET name = ?, description = ?, postal_code = ?, price = ? WHERE post_id = ? AND user_id = ? AND post_type = 'market'",
            [title, description, location, priceNum, pid, userId]
        );

        if (updateResult.affectedRows === 0) {
            await conn.rollback();
            return res.status(404).json({ error: "Market post not found for this user" });
        }

        await conn.query(
            "UPDATE market_posts SET item_condition = ? WHERE market_id = ?",
            [normalizedCondition, pid]
        );

        if (deletedIds.length) {
            const placeholders = deletedIds.map(() => "?").join(",");
            await conn.query(
                `DELETE FROM images WHERE post_id = ? AND image_id IN (${placeholders})`,
                [pid, ...deletedIds]
            );
        }

        for (const file of newImages) {
            await conn.query(
                "INSERT INTO images (post_id, image_text_data) VALUES (?, ?)",
                [pid, file.buffer]
            );
        }

        await conn.commit();
        return res.status(200).json({ message: "Market post updated successfully", postId: pid });
    } catch (err) {
        await conn.rollback();
        console.error("DB error (updateMarketPost):", err);
        return res.status(500).json({ error: "Failed to update post" });
    } finally {
        conn.release();
    }
};