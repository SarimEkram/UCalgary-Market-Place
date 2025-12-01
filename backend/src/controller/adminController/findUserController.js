import db from "../../config/db.js";

export const searchUsers = (req, res) => {
    const { q } = req.query;

    if (!q || q.trim() === "") {
        return res.status(400).json({ error: "Search query is required" });
    }

    const like = `%${q.trim()}%`;

    const sql = `
        SELECT user_id, fname, lname, email
        FROM users
        WHERE fname LIKE ? OR lname LIKE ? OR email LIKE ?
        ORDER BY fname, lname
    `;

    db.query(sql, [like, like, like], (err, rows) => {
        if (err) {

            return res.status(500).json({ error: "Failed to search users" });
        }

        return res.status(200).json({ users: rows });
    });
};

export const getUserProfileForAdmin = (req, res) => {
    const { id } = req.params;

    const userSql = `
    SELECT user_id, fname, lname, email
    FROM users
    WHERE user_id = ?
  `;

    db.query(userSql, [id], (userErr, userRows) => {
        if (userErr) {

            return res.status(500).json({ error: "Database error" });
        }

        if (userRows.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }

        const user = userRows[0];

        const eventPostsSql = `
      SELECT
        p.post_id,
        p.name,
        p.description,
        p.posted_date,
        p.price,
        p.postal_code,
        ep.organization_name,
        ep.event_start,
        ep.event_end,
        COUNT(pr.report_id) AS reportCount
      FROM posts p
      JOIN event_posts ep ON ep.event_id = p.post_id
      LEFT JOIN post_report pr ON pr.post_id = p.post_id
      LEFT JOIN reports r ON r.report_id = pr.report_id AND r.report_type = 'post'
      WHERE p.user_id = ? AND p.post_type = 'event'
      GROUP BY p.post_id
      ORDER BY p.posted_date DESC
    `;

        const marketPostsSql = `
      SELECT
        p.post_id,
        p.name,
        p.description,
        p.posted_date,
        p.price,
        p.postal_code,
        mp.item_condition,
        COUNT(pr.report_id) AS reportCount
      FROM posts p
      JOIN market_posts mp ON mp.market_id = p.post_id
      LEFT JOIN post_report pr ON pr.post_id = p.post_id
      LEFT JOIN reports r ON r.report_id = pr.report_id AND r.report_type = 'post'
      WHERE p.user_id = ? AND p.post_type = 'market'
      GROUP BY p.post_id
      ORDER BY p.posted_date DESC
    `;

        db.query(eventPostsSql, [id], (eventErr, eventRows) => {
            if (eventErr) {

                return res.status(500).json({ error: "Failed to load event posts" });
            }

            db.query(marketPostsSql, [id], (marketErr, marketRows) => {
                if (marketErr) {

                    return res.status(500).json({ error: "Failed to load market posts" });
                }

                return res.status(200).json({
                    user,
                    eventPosts: eventRows,
                    marketPosts: marketRows,
                });
            });
        });
    });
};
