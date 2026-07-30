import db from "../../config/db.js";

export const unbanUser = (req, res) => {
    const { email } = req.body;
    const adminId = req.user.id;

    if (!email) {
        return res.status(400).json({ success: false, error: "Email is required" });
    }

    const checkSql = "SELECT user_email FROM banned_users WHERE user_email = ?";

    db.query(checkSql, [email], (err, rows) => {
        if (err) {
            console.error("DB error (unbanUser check):", err);
            return res.status(500).json({ success: false, error: "Database error" });
        }

        if (rows.length === 0) {
            return res.status(404).json({ success: false, error: "This email is not banned" });
        }

        const deleteSql = "DELETE FROM banned_users WHERE user_email = ?";

        db.query(deleteSql, [email], (delErr) => {
            if (delErr) {
                console.error("DB error (unbanUser delete):", delErr);
                return res.status(500).json({ success: false, error: "Failed to unban user" });
            }

            const logSql = "INSERT INTO admin_actions (admin_id, action, action_type, target_type, target_id) VALUES (?, ?, 'ban', 'user', ?)";
            const actionText = `Unbanned user: ${email}`;

            db.query(logSql, [adminId, actionText, email], (logErr) => {
                if (logErr) {
                    console.error("Failed to log unban action:", logErr);
                }
            });

            return res.status(200).json({
                success: true,
                message: "User unbanned successfully. They can now re-register.",
            });
        });
    });
};

export const getBannedUsers = (req, res) => {
    const sql = `
        SELECT 
            bu.user_email AS email,
            a.action_timestamp AS banned_at,
            ad.fname AS banned_by_fname,
            ad.lname AS banned_by_lname
        FROM banned_users bu
        JOIN admin_actions a ON a.action_id = bu.action_id
        JOIN admins ad ON ad.admin_id = a.admin_id
        ORDER BY a.action_timestamp DESC
    `;

    db.query(sql, (err, rows) => {
        if (err) {
            console.error("DB error (getBannedUsers):", err);
            return res.status(500).json({ error: "Failed to load banned users" });
        }

        return res.json({ bannedUsers: rows });
    });
};