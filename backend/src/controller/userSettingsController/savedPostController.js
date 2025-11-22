import db from "../../config/db.js";

export const getSavedPost = (req, res) => {
    const { userId } = req.body;

    if (!userId) {
        return res.status(400).json({ error: "userId is required" });
    }

    const sql = "SELECT * FROM saved_posts WHERE user_id = ?";

    db.query(sql, [userId], (err, results) => {
        if (err) {
            return res.status(500).json({ error: "Database error" });
        }

        return res.status(200).json({ savedPosts: results });
    });
};
