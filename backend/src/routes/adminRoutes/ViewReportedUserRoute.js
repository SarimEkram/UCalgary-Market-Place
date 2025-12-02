import db from "../../config/db.js";

// GET /api/admin/reported-users
// Returns all users who have been reported at least once
export const viewReportedUsers = (req, res) => {
    const sql = `
    SELECT 
      u.user_id,
      u.fname,
      u.lname,
      u.email,
      COUNT(r.report_id) AS reportCount,
      MAX(r.reason)      AS latestReason
    FROM user_report ur
    JOIN reports r 
      ON r.report_id = ur.report_id
     AND r.report_type = 'user'
    JOIN users u 
      ON u.user_id = ur.reported_user_id
    GROUP BY u.user_id, u.fname, u.lname, u.email
    ORDER BY reportCount DESC, u.fname, u.lname;
  `;

    db.query(sql, (err, rows) => {
        if (err) {
            return res.status(500).json({ error: "Failed to load reported users" });
        }

        return res.status(200).json({ reportedUsers: rows });
    });
};
