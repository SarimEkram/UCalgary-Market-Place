import db from "../../config/db.js";

// 1) Get all EVENT posts created by this user
// POST /api/my-events/list
// Body: { userId }
export const getUserEventPosts = (req, res) => {
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
            e.organization_name,
            e.event_start,
            e.event_end,
            i.image_text_data AS thumbnail_blob
        FROM posts p
        JOIN event_posts e
            ON e.event_id = p.post_id
        LEFT JOIN images i
            ON i.image_id = (
                SELECT MIN(image_id)
                FROM images
                WHERE post_id = p.post_id
            )
        WHERE p.user_id = ? AND p.post_type = 'event'
        ORDER BY p.posted_date DESC
    `;

    db.query(sql, [userId], (err, rows) => {
        if (err) {
            console.error("DB error (getUserEventPosts):", err);
            return res.status(500).json({ error: "Database error" });
        }

        const myEvents = rows.map((row) => ({
            post_id: row.post_id,
            name: row.name,
            description: row.description,
            price: row.price,
            postal_code: row.postal_code,
            posted_date: row.posted_date,
            organization_name: row.organization_name,
            event_start: row.event_start,
            event_end: row.event_end,
            thumbnail: row.thumbnail_blob
                ? Buffer.isBuffer(row.thumbnail_blob)
                    ? row.thumbnail_blob.toString("base64")
                    : row.thumbnail_blob
                : null,
        }));

        return res.status(200).json({ myEvents });
    });
};

// 2) Delete an EVENT post created by this user
// DELETE /api/my-events/delete
// Body: { userId, postId }
export const deleteEventPost = (req, res) => {
    const { userId, postId } = req.body;

    if (!userId || !postId) {
        return res
            .status(400)
            .json({ error: "userId and postId are required to delete an event" });
    }

    const pid = Number(postId);
    if (!Number.isInteger(pid) || pid <= 0) {
        return res.status(400).json({ error: "Invalid postId" });
    }

    const deletePostSql = `
        DELETE FROM posts
        WHERE post_id = ? AND user_id = ? AND post_type = 'event'
    `;

    db.query(deletePostSql, [pid, userId], (err, result) => {
        if (err) {
            console.error("DB error (deleteEventPost/posts):", err);
            return res.status(500).json({ error: "Failed to delete event" });
        }

        if (result.affectedRows === 0) {
            return res
                .status(404)
                .json({ error: "Event post not found for this user" });
        }

        return res.status(200).json({
            message: "Event post deleted successfully",
            postId: pid,
        });
    });
};
