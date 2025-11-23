// src/controller/userSettingsController/savedPostController.js
import db from "../../config/db.js";

// 1) Get all saved posts for a user, with first image as thumbnail
export const getSavedPosts = (req, res) => {
    const { userId } = req.body;

    if (!userId) {
        return res.status(400).json({ error: "userId is required" });
    }

    const sql = `
        SELECT
            sp.user_id,
            p.post_id,
            p.name,
            p.price,
            p.post_type,
            p.postal_code,
            p.posted_date,
            p.description,
            i.image_text_data AS thumbnail_blob
        FROM saved_posts sp
                 JOIN posts p
                      ON sp.post_id = p.post_id
                 LEFT JOIN images i
                           ON i.image_id = (
                               SELECT MIN(image_id)
                               FROM images
                               WHERE post_id = p.post_id
                           )
        WHERE sp.user_id = ?
        ORDER BY sp.post_id DESC
    `;

    db.query(sql, [userId], (err, rows) => {
        if (err) {
            console.error("DB error (getSavedPosts):", err);
            return res.status(500).json({ error: "Database error" });
        }

        const savedPosts = rows.map((row) => ({
            user_id: row.user_id,
            post_id: row.post_id,
            name: row.name,
            price: row.price,
            post_type: row.post_type,
            postal_code: row.postal_code,
            posted_date: row.posted_date,
            description: row.description,
            thumbnail: row.thumbnail_blob
                ? row.thumbnail_blob.toString("base64")
                : null,
        }));

        return res.status(200).json({ savedPosts });
    });
};

// 2) Unsave (remove) a post for this user
export const unsavePost = (req, res) => {
    const { userId, postId } = req.body;

    if (!userId || !postId) {
        return res
            .status(400)
            .json({ error: "userId and postId are required" });
    }

    const sql = `
        DELETE FROM saved_posts
        WHERE user_id = ? AND post_id = ?
    `;

    db.query(sql, [userId, postId], (err, result) => {
        if (err) {
            console.error("DB error (unsavePost):", err);
            return res.status(500).json({ error: "Database error" });
        }

        if (result.affectedRows === 0) {
            return res
                .status(404)
                .json({ error: "Saved post not found for this user" });
        }

        return res.status(200).json({
            success: true,
            message: "Post removed from saved posts",
        });
    });
};
