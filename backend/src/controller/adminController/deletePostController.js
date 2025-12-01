import db from "../../config/db.js";
import { sendPostRemovalEmail } from "./adminEmailHelpers.js";

export const adminDeletePost = (req, res) => {
    const { postId } = req.params;
    const { adminId } = req.body;

    if (!postId || !adminId) {
        return res
            .status(400)
            .json({ success: false, error: "postId (param) and adminId (body) are required" });
    }

    const postIdNum = parseInt(postId, 10);
    const adminIdNum = parseInt(adminId, 10);

    if (Number.isNaN(postIdNum) || Number.isNaN(adminIdNum)) {
        return res
            .status(400)
            .json({ success: false, error: "postId and adminId must be numbers" });
    }

    // Grab post info + owner email so we can log and email
    const selectQuery = `
        SELECT
            p.post_id,
            p.post_type,
            p.name      AS post_name,
            u.email     AS user_email
        FROM posts p
                 JOIN users u ON p.user_id = u.user_id
        WHERE p.post_id = ?
    `;

    db.query(selectQuery, [postIdNum], (selectErr, rows) => {
        if (selectErr) {
            console.error("Error fetching post:", selectErr);
            return res
                .status(500)
                .json({ success: false, error: "Database error while fetching post" });
        }

        if (rows.length === 0) {
            return res.status(404).json({ success: false, error: "Post not found" });
        }

        const post = rows[0];
        const userEmail = post.user_email;
        const postName = post.post_name;
        const postType = post.post_type;

        // 1) Delete the post (ON DELETE CASCADE cleans up event_posts/market_posts/images/etc.)
        const deleteQuery = "DELETE FROM posts WHERE post_id = ?";

        db.query(deleteQuery, [postIdNum], (deleteErr, result) => {
            if (deleteErr) {
                console.error("Error deleting post:", deleteErr);
                return res
                    .status(500)
                    .json({ success: false, error: "Failed to delete post" });
            }

            if (result.affectedRows === 0) {
                return res
                    .status(404)
                    .json({ success: false, error: "Post not found" });
            }

            // 2) Build log message for admin_actions
            let actionText;
            if (postType === "event") {
                actionText = `Deleted an event post "${postName}" for ${userEmail}`;
            } else if (postType === "market") {
                actionText = `Deleted a market post "${postName}" for ${userEmail}`;
            } else {
                actionText = `Deleted a post "${postName}" for ${userEmail}`;
            }

            const logQuery =
                "INSERT INTO admin_actions (admin_id, action) VALUES (?, ?)";

            db.query(logQuery, [adminIdNum, actionText], (logErr) => {
                let logStatus = "ok";

                if (logErr) {
                    logStatus = "failed";
                    console.error("Error logging admin action (delete post):", logErr);
                }

                // 3) Send email to the user – do NOT fail the whole request if this breaks
                sendPostRemovalEmail(userEmail, postName, postType)
                    .then(() => {
                        return res.status(200).json({
                            success: true,
                            message: "Post deleted successfully",
                            logStatus,
                            emailStatus: "sent",
                        });
                    })
                    .catch((emailErr) => {
                        console.error("Error sending post removal email:", emailErr);
                        return res.status(200).json({
                            success: true,
                            message: "Post deleted successfully",
                            logStatus,
                            emailStatus: "failed",
                        });
                    });
            });
        });
    });
};
