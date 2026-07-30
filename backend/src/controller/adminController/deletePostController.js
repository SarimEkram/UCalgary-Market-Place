import { promisePool } from "../../config/db.js";
import { sendPostRemovalEmail } from "./adminEmailHelpers.js";

export const adminDeletePost = async (req, res) => {
    const { postId } = req.params;
    const adminId = req.user.id;

    if (!postId || !adminId) {
        return res.status(400).json({ success: false, error: "postId and adminId are required" });
    }

    const postIdNum = parseInt(postId, 10);
    const adminIdNum = parseInt(adminId, 10);
    if (Number.isNaN(postIdNum) || Number.isNaN(adminIdNum)) {
        return res.status(400).json({ success: false, error: "postId and adminId must be numbers" });
    }

    const [rows] = await promisePool.query(
        "SELECT p.post_id, p.post_type, p.name AS post_name, u.email AS user_email FROM posts p JOIN users u ON p.user_id = u.user_id WHERE p.post_id = ?",
        [postIdNum]
    );

    if (rows.length === 0) {
        return res.status(404).json({ success: false, error: "Post not found" });
    }

    const post = rows[0];
    const conn = await promisePool.getConnection();

    try {
        await conn.beginTransaction();

        await conn.query("DELETE FROM posts WHERE post_id = ?", [postIdNum]);

        const actionText = post.post_type === "event"
            ? `Deleted an event post "${post.post_name}" for ${post.user_email}`
            : `Deleted a market post "${post.post_name}" for ${post.user_email}`;

        await conn.query(
            "INSERT INTO admin_actions (admin_id, action, action_type, target_type, target_id) VALUES (?, ?, 'delete_post', 'post', ?)",
            [adminIdNum, actionText, post.user_email]
        );

        await conn.commit();

        sendPostRemovalEmail(post.user_email, post.post_name, post.post_type).catch((err) => {
            console.error("Failed to send post removal email:", err);
        });

        return res.status(200).json({ success: true, message: "Post deleted successfully" });
    } catch (err) {
        await conn.rollback();
        console.error("DB error (adminDeletePost):", err);
        return res.status(500).json({ success: false, error: "Failed to delete post" });
    } finally {
        conn.release();
    }
};