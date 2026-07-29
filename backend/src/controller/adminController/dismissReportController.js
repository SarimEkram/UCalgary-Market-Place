import db from "../../config/db.js";

export const dismissReportsByPost = (req, res) => {
    const { postId } = req.params;
    const adminId = req.user.id;

    const postIdNum = parseInt(postId, 10);
    if (Number.isNaN(postIdNum)) {
        return res.status(400).json({ success: false, error: "postId must be a number" });
    }

    const updateSql = `
        UPDATE reports r
        JOIN post_report pr ON pr.report_id = r.report_id
        SET r.status = 'dismissed'
        WHERE pr.post_id = ? AND r.status = 'pending'
    `;

    db.query(updateSql, [postIdNum], (err, result) => {
        if (err) {
            console.error("DB error (dismissReportsByPost):", err);
            return res.status(500).json({ success: false, error: "Failed to dismiss reports" });
        }

        const logSql = "INSERT INTO admin_actions (admin_id, action) VALUES (?, ?)";
        const actionText = `Dismissed all reports for post #${postIdNum}`;

        db.query(logSql, [adminId, actionText], (logErr) => {
            if (logErr) {
                console.error("Failed to log dismiss action:", logErr);
            }
        });

        return res.status(200).json({
            success: true,
            message: "Reports dismissed successfully",
            dismissed: result.affectedRows,
        });
    });
};

export const dismissReportsByUser = (req, res) => {
    const { userId } = req.params;
    const adminId = req.user.id;

    const userIdNum = parseInt(userId, 10);
    if (Number.isNaN(userIdNum)) {
        return res.status(400).json({ success: false, error: "userId must be a number" });
    }

    const updateSql = `
        UPDATE reports r
        JOIN user_report ur ON ur.report_id = r.report_id
        SET r.status = 'dismissed'
        WHERE ur.reported_user_id = ? AND r.status = 'pending'
    `;

    db.query(updateSql, [userIdNum], (err, result) => {
        if (err) {
            console.error("DB error (dismissReportsByUser):", err);
            return res.status(500).json({ success: false, error: "Failed to dismiss reports" });
        }

        const logSql = "INSERT INTO admin_actions (admin_id, action) VALUES (?, ?)";
        const actionText = `Dismissed all reports for user #${userIdNum}`;

        db.query(logSql, [adminId, actionText], (logErr) => {
            if (logErr) {
                console.error("Failed to log dismiss action:", logErr);
            }
        });

        return res.status(200).json({
            success: true,
            message: "Reports dismissed successfully",
            dismissed: result.affectedRows,
        });
    });
};