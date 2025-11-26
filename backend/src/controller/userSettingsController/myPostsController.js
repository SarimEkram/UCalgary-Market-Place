// src/controller/userPostsController/myPostsController.js
import db from "../../config/db.js";

/**
 * Helper: basic sanity check for base64 image strings
 */
function validateBase64Image(str) {
    if (typeof str !== "string") return false;
    const trimmed = str.trim();
    if (!trimmed) return false;

    // Optional light check – don't over-validate
    const base64Regex = /^[0-9A-Za-z+/=]+$/;
    if (!base64Regex.test(trimmed)) return false;

    return true;
}

/**
 * Helper: insert up to 7 images for a given post_id
 *  - images: array of base64 strings
 *  - callback(err) called when done
 */
function insertImagesForPost(postId, images, callback) {
    if (!images || !Array.isArray(images) || images.length === 0) {
        return callback(null); // nothing to insert
    }

    const validImages = images
        .filter((img) => validateBase64Image(img))
        .slice(0, 7); // hard cap at 7

    if (!validImages.length) {
        return callback(null);
    }

    const values = validImages.map((img) => [
        postId,
        Buffer.from(img.trim(), "base64"),
    ]);

    const sql = "INSERT INTO images (post_id, image_text_data) VALUES ?";

    db.query(sql, [values], (err) => {
        if (err) {
            console.error("DB error (insertImagesForPost):", err);
            return callback(err);
        }
        callback(null);
    });
}

/**
 * 1) Get all MARKET posts created by this user (for "My Posts" page)
 * POST /api/my-posts/list
 * Body: { userId }
 */
export const getUserMarketPosts = (req, res) => {
    const { userId } = req.body;

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

/**
 * 2) Create a new MARKET post (My Posts – Create Post)
 * POST /api/my-posts/create
 * Body: {
 *   userId,
 *   name,
 *   description,
 *   postal_code,
 *   price,
 *   item_condition,
 *   images?: [base64String]  // max 7
 * }
 *  - All fields except images are required and cannot be empty/null.
 */
export const createMarketPost = (req, res) => {
    const {
        userId,
        name,
        description,
        postal_code,
        price,
        item_condition,
        images,
    } = req.body;

    // ---- 1) Validate required fields ----
    const trimmedName = typeof name === "string" ? name.trim() : "";
    const trimmedDesc = typeof description === "string" ? description.trim() : "";
    const trimmedPostal =
        typeof postal_code === "string" ? postal_code.trim() : "";

    if (
        !userId ||
        !trimmedName ||
        !trimmedDesc ||
        !trimmedPostal ||
        item_condition === undefined ||
        item_condition === null ||
        price === undefined ||
        price === null ||
        String(price).trim() === ""
    ) {
        return res.status(400).json({
            error:
                "userId, name, description, postal_code, price, and item_condition are all required and cannot be empty",
        });
    }

    const numericPrice = Number(price);
    if (!Number.isFinite(numericPrice) || numericPrice < 0) {
        return res
            .status(400)
            .json({ error: "price must be a valid non-negative number" });
    }

    // ---- 2) Enforce max 7 images ----
    if (images && Array.isArray(images) && images.length > 7) {
        return res
            .status(400)
            .json({ error: "You can upload a maximum of 7 images per post" });
    }

    // ---- 3) Insert into posts ----
    const insertPostSql = `
        INSERT INTO posts (user_id, post_type, postal_code, price, name, description)
        VALUES (?, 'market', ?, ?, ?, ?)
    `;

    db.query(
        insertPostSql,
        [userId, trimmedPostal, numericPrice, trimmedName, trimmedDesc],
        (err, result) => {
            if (err) {
                console.error("DB error (createMarketPost/insert posts):", err);
                return res
                    .status(500)
                    .json({ error: "Failed to create market post (posts table)" });
            }

            const postId = result.insertId;

            // ---- 4) Insert into market_posts ----
            const insertMarketSql = `
                INSERT INTO market_posts (market_id, item_condition)
                VALUES (?, ?)
            `;

            db.query(insertMarketSql, [postId, item_condition], (err2) => {
                if (err2) {
                    console.error(
                        "DB error (createMarketPost/insert market_posts):",
                        err2
                    );
                    return res
                        .status(500)
                        .json({ error: "Failed to create market post (market_posts)" });
                }

                // ---- 5) Insert images if any ----
                insertImagesForPost(postId, images, (imgErr) => {
                    if (imgErr) {
                        // We already have the post; just warn
                        console.error(
                            "Warning: post created but failed to insert some images",
                            imgErr
                        );
                    }

                    return res.status(201).json({
                        message: "Market post created successfully",
                        postId,
                    });
                });
            });
        }
    );
};

/**
 * 3) Update an existing MARKET post (My Posts – Edit Post)
 * PUT /api/my-posts/update
 * Body: {
 *   userId,
 *   postId,
 *   name,
 *   description,
 *   postal_code,
 *   price,
 *   item_condition,
 *   images?: [base64String]  // replaces previous images, max 7
 * }
 *  - We expect all editable fields to be sent and non-empty (except images).
 */
export const updateMarketPost = (req, res) => {
    const {
        userId,
        postId,
        name,
        description,
        postal_code,
        price,
        item_condition,
        images,
    } = req.body;

    const trimmedName = typeof name === "string" ? name.trim() : "";
    const trimmedDesc = typeof description === "string" ? description.trim() : "";
    const trimmedPostal =
        typeof postal_code === "string" ? postal_code.trim() : "";

    if (
        !userId ||
        !postId ||
        !trimmedName ||
        !trimmedDesc ||
        !trimmedPostal ||
        price === undefined ||
        price === null ||
        String(price).trim() === "" ||
        item_condition === undefined ||
        item_condition === null
    ) {
        return res.status(400).json({
            error:
                "userId, postId, name, description, postal_code, price, and item_condition are all required and cannot be empty",
        });
    }

    const numericPrice = Number(price);
    if (!Number.isFinite(numericPrice) || numericPrice < 0) {
        return res
            .status(400)
            .json({ error: "price must be a valid non-negative number" });
    }

    // enforce max 7 images
    if (images && Array.isArray(images) && images.length > 7) {
        return res
            .status(400)
            .json({ error: "You can upload a maximum of 7 images per post" });
    }

    // ---- 1) Update posts row (ensuring this user owns it & it's a market post) ----
    const updatePostSql = `
        UPDATE posts
        SET name = ?, description = ?, postal_code = ?, price = ?
        WHERE post_id = ? AND user_id = ? AND post_type = 'market'
    `;

    db.query(
        updatePostSql,
        [trimmedName, trimmedDesc, trimmedPostal, numericPrice, postId, userId],
        (err, result) => {
            if (err) {
                console.error("DB error (updateMarketPost/update posts):", err);
                return res
                    .status(500)
                    .json({ error: "Failed to update market post (posts table)" });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    error: "Market post not found for this user",
                });
            }

            // ---- 2) Update market_posts condition ----
            const updateMarketSql = `
                UPDATE market_posts
                SET item_condition = ?
                WHERE market_id = ?
            `;

            db.query(updateMarketSql, [item_condition, postId], (err2) => {
                if (err2) {
                    console.error(
                        "DB error (updateMarketPost/update market_posts):",
                        err2
                    );
                    return res.status(500).json({
                        error: "Failed to update market post (market_posts)",
                    });
                }

                // ---- 3) Replace images: delete old, insert new ----
                const deleteImagesSql = "DELETE FROM images WHERE post_id = ?";
                db.query(deleteImagesSql, [postId], (err3) => {
                    if (err3) {
                        console.error(
                            "DB error (updateMarketPost/delete images):",
                            err3
                        );
                        return res
                            .status(500)
                            .json({ error: "Failed to update images for this post" });
                    }

                    insertImagesForPost(postId, images, (imgErr) => {
                        if (imgErr) {
                            console.error(
                                "Warning: post updated but failed to insert some images",
                                imgErr
                            );
                        }

                        return res.status(200).json({
                            message: "Market post updated successfully",
                            postId,
                        });
                    });
                });
            });
        }
    );
};

/**
 * 4) Delete a MARKET post created by this user
 * DELETE /api/my-posts/delete
 * Body: { userId, postId }
 *
 * With ON DELETE CASCADE in the database:
 *  - deleting from posts will automatically delete related rows in
 *    market_posts, images, saved_posts, contacted_seller, post_report
 */
export const deleteMarketPost = (req, res) => {
    const { userId, postId } = req.body;

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
