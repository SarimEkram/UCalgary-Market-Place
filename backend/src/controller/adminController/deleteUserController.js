import db from "../../config/db.js";
import { sendBanNotificationEmail } from "./adminEmailHelpers.js";

export const adminBanUser = (req, res) => {
    const { adminId, email } = req.body;

    if (!adminId || !email) {
        return res
            .status(400)
            .json({ success: false, error: "adminId and email are required" });
    }

    const adminIdNum = parseInt(adminId, 10);
    if (Number.isNaN(adminIdNum)) {
        return res
            .status(400)
            .json({ success: false, error: "adminId must be a number" });
    }

    // 1) Make sure the user exists
    const findUserSql = "SELECT user_id FROM users WHERE email = ?";
    db.query(findUserSql, [email], (findErr, userRows) => {
        if (findErr) {

            return res
                .status(500)
                .json({ success: false, error: "Database error (find user)" });
        }

        if (userRows.length === 0) {
            return res
                .status(404)
                .json({ success: false, error: "User with this email does not exist" });
        }

        // 2) Insert into admin_actions
        const actionText = `Banned user: ${email}`;
        const insertActionSql =
            "INSERT INTO admin_actions (admin_id, action) VALUES (?, ?)";

        db.query(
            insertActionSql,
            [adminIdNum, actionText],
            (actionErr, actionResult) => {
                if (actionErr) {

                    return res.status(500).json({
                        success: false,
                        error: "Failed to log admin action for ban",
                    });
                }

                const actionId = actionResult.insertId;

                // 3) Insert into banned_users using that actionId
                const insertBanSql =
                    "INSERT INTO banned_users (action_id, user_email) VALUES (?, ?)";
                db.query(insertBanSql, [actionId, email], (banErr) => {
                    if (banErr) {

                        return res.status(500).json({
                            success: false,
                            error: "Failed to insert into banned_users",
                        });
                    }

                    // 4) Delete the user (ON DELETE CASCADE will clean up related rows)
                    const deleteUserSql = "DELETE FROM users WHERE email = ?";
                    db.query(deleteUserSql, [email], (delErr, delResult) => {
                        if (delErr) {

                            return res
                                .status(500)
                                .json({ success: false, error: "Failed to delete user" });
                        }

                        if (delResult.affectedRows === 0) {
                            return res.status(404).json({
                                success: false,
                                error: "User not found when deleting",
                            });
                        }

                        // 5) Send ban notification email
                        sendBanNotificationEmail(email)
                            .then(() => {
                                return res.status(200).json({
                                    success: true,
                                    message: "User banned and deleted successfully",
                                    actionId,
                                    emailStatus: "sent",
                                });
                            })
                            .catch((emailErr) => {

                                return res.status(200).json({
                                    success: true,
                                    message:
                                        "User banned and deleted successfully (ban email failed to send)",
                                    actionId,
                                    emailStatus: "failed",
                                });
                            });
                    });
                });
            }
        );
    });
};
