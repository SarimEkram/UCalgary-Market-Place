import { promisePool } from "../../config/db.js";
import { sendBanNotificationEmail } from "./adminEmailHelpers.js";

export const adminBanUser = async (req, res) => {
    const adminId = req.user.id;
    const { email } = req.body;

    if (!adminId || !email) {
        return res.status(400).json({ success: false, error: "adminId and email are required" });
    }

    const adminIdNum = parseInt(adminId, 10);
    if (Number.isNaN(adminIdNum)) {
        return res.status(400).json({ success: false, error: "adminId must be a number" });
    }

    const [userRows] = await promisePool.query("SELECT user_id FROM users WHERE email = ?", [email]);
    if (userRows.length === 0) {
        return res.status(404).json({ success: false, error: "User with this email does not exist" });
    }

    const conn = await promisePool.getConnection();

    try {
        await conn.beginTransaction();

        const actionText = `Banned user: ${email}`;
        const [actionResult] = await conn.query(
            "INSERT INTO admin_actions (admin_id, action, action_type, target_type, target_id) VALUES (?, ?, 'ban', 'user', ?)",
            [adminIdNum, actionText, email]
        );
        const actionId = actionResult.insertId;

        await conn.query(
            "INSERT INTO banned_users (action_id, user_email) VALUES (?, ?)",
            [actionId, email]
        );

        await conn.query("DELETE FROM users WHERE email = ?", [email]);

        await conn.commit();

        sendBanNotificationEmail(email).catch((err) => {
            console.error("Failed to send ban email:", err);
        });

        return res.status(200).json({
            success: true,
            message: "User banned and deleted successfully",
            actionId,
        });
    } catch (err) {
        await conn.rollback();
        console.error("DB error (adminBanUser):", err);
        return res.status(500).json({ success: false, error: "Failed to ban user" });
    } finally {
        conn.release();
    }
};