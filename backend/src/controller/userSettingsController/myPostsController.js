import db from "../../config/db.js";

// 1) Get all MARKET posts created by this user (for "My Posts" page)
// POST /api/my-posts/list
// Body: { userId }
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

// 2) Delete a MARKET post created by this user
// DELETE /api/my-posts/delete
// Body: { userId, postId }
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
