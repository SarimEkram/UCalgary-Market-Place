import db from "../../config/db.js";

export const adminDeletePost = (req, res) => {
    const { postId } = req.params;
    const { adminId } = req.body;

    if (!postId || !adminId) {
        return res
            .status(400)
            .json({ error: "postId (param) and adminId (body) are required" });
    }

    const postIdNum = parseInt(postId, 10);
    const adminIdNum = parseInt(adminId, 10);

    if (Number.isNaN(postIdNum) || Number.isNaN(adminIdNum)) {
        return res.status(400).json({ error: "postId and adminId must be numbers" });
    }

    const selectQuery = `
        SELECT p.post_id, p.post_type, u.email AS user_email
        FROM posts p
        JOIN users u ON p.user_id = u.user_id
        WHERE p.post_id = ?
    `;

    db.query(selectQuery, [postIdNum], (selectErr, rows) => {
        if (selectErr) {
            console.error("Error fetching post:", selectErr);
            return res.status(500).json({ error: "Database error while fetching post" });
        }

        if (rows.length === 0) {
            return res.status(404).json({ error: "Post not found" });
        }

        const post = rows[0];
        const deleteQuery = "DELETE FROM posts WHERE post_id = ?";

        db.query(deleteQuery, [postIdNum], (deleteErr, result) => {
            if (deleteErr) {
                console.error("Error deleting post:", deleteErr);
                return res.status(500).json({ error: "Failed to delete post" });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({ error: "Post not found" });
            }

            let actionText;
            if (post.post_type === "event") {
                actionText = `Deleted an event post for ${post.user_email}`;
            } else if (post.post_type === "market") {
                actionText = `Deleted a market post for ${post.user_email}`;
            } else {
                actionText = `Deleted a post for ${post.user_email}`;
            }

            const logQuery =
                "INSERT INTO admin_actions (admin_id, action) VALUES (?, ?)";

            db.query(logQuery, [adminIdNum, actionText], (logErr) => {
                if (logErr) {
                    console.error("Error logging admin action:", logErr);
                    return res.status(200).json({
                        message: "Post deleted, but admin action could not be logged",
                        logStatus: "failed",
                    });
                }

                return res.status(200).json({
                    message: "Post deleted successfully",
                    logStatus: "ok",
                });
            });
        });
    });
};
