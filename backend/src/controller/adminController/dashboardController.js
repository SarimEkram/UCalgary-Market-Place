import db from "../../config/db.js";

export const getDashboardStats = (req, res) => {
    const queries = {
        totalUsers: "SELECT COUNT(*) AS count FROM users",
        totalAdmins: "SELECT COUNT(*) AS count FROM admins",
        totalMarketPosts: "SELECT COUNT(*) AS count FROM posts WHERE post_type = 'market'",
        totalEventPosts: "SELECT COUNT(*) AS count FROM posts WHERE post_type = 'event'",
        pendingReports: "SELECT COUNT(*) AS count FROM reports WHERE status = 'pending'",
        dismissedReports: "SELECT COUNT(*) AS count FROM reports WHERE status = 'dismissed'",
        totalBans: "SELECT COUNT(*) AS count FROM banned_users",
        postsThisWeek: `
            SELECT COUNT(*) AS count FROM posts 
            WHERE posted_date >= DATE_SUB(NOW(), INTERVAL 7 DAY)
        `,
        reportsThisWeek: `
            SELECT COUNT(*) AS count FROM reports 
            WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
        `,
        recentActions: `
            SELECT a.action, a.action_timestamp, ad.fname, ad.lname
            FROM admin_actions a
            JOIN admins ad ON ad.admin_id = a.admin_id
            ORDER BY a.action_timestamp DESC
            LIMIT 5
        `,
        topReportedPosts: `
            SELECT p.post_id, p.name, COUNT(r.report_id) AS report_count
            FROM posts p
            JOIN post_report pr ON pr.post_id = p.post_id
            JOIN reports r ON r.report_id = pr.report_id AND r.status = 'pending'
            GROUP BY p.post_id, p.name
            ORDER BY report_count DESC
            LIMIT 5
        `,
    };

    const keys = Object.keys(queries);
    const results = {};
    let completed = 0;
    let hasErrored = false;

    keys.forEach((key) => {
        db.query(queries[key], (err, rows) => {
            if (hasErrored) return;

            if (err) {
                hasErrored = true;
                console.error(`Dashboard query error (${key}):`, err);
                return res.status(500).json({ error: "Failed to load dashboard stats" });
            }

            if (key === "recentActions" || key === "topReportedPosts") {
                results[key] = rows;
            } else {
                results[key] = rows[0].count;
            }

            completed++;
            if (completed === keys.length) {
                return res.json(results);
            }
        });
    });
};