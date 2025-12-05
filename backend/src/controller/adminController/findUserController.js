import db from "../../config/db.js";

export const searchUsers = (req, res) => {
    let { q, limit, offset } = req.query;

    const pageSize = 6;

    limit = parseInt(limit, 10);
    offset = parseInt(offset, 10);

    if (Number.isNaN(limit) || limit <= 0 || limit > pageSize) {
        limit = pageSize;
    }

    if (Number.isNaN(offset) || offset < 0) {
        offset = 0;
    }

    if (q && q.trim() !== "") {
        const like = `%${q.trim()}%`;

        const sql = `
      SELECT user_id, fname, lname, email
      FROM users
      WHERE fname LIKE ? OR lname LIKE ? OR email LIKE ?
      ORDER BY fname, lname
      LIMIT ? OFFSET ?
    `;

        return db.query(sql, [like, like, like, limit, offset], (err, rows) => {
            if (err) {

                return res.status(500).json({ error: "Failed to search users" });
            }

            return res.status(200).json({ users: rows });
        });
    }

    const sql = `
    SELECT user_id, fname, lname, email
    FROM users
    ORDER BY fname, lname
    LIMIT ? OFFSET ?
  `;

    db.query(sql, [limit, offset], (err, rows) => {
        if (err) {

            return res.status(500).json({ error: "Failed to load users" });
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
                COUNT(pr.report_id)        AS report_count,
                p.posted_date              AS report_date,
                i.image_text_data          AS thumbnail_blob
            FROM posts p
                     JOIN event_posts ep ON ep.event_id = p.post_id
                     LEFT JOIN post_report pr ON pr.post_id = p.post_id
                     LEFT JOIN reports r ON r.report_id = pr.report_id
                AND r.report_type = 'post'
                     LEFT JOIN images i
                               ON i.image_id = (
                                   SELECT MIN(image_id)
                                   FROM images
                                   WHERE post_id = p.post_id
                               )
            WHERE p.user_id = ? AND p.post_type = 'event'
            GROUP BY
                p.post_id,
                p.name,
                p.description,
                p.posted_date,
                p.price,
                p.postal_code,
                ep.organization_name,
                ep.event_start,
                ep.event_end,
                i.image_text_data
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
                COUNT(pr.report_id)        AS report_count,
                p.posted_date              AS report_date,
                i.image_text_data          AS thumbnail_blob
            FROM posts p
                     JOIN market_posts mp ON mp.market_id = p.post_id
                     LEFT JOIN post_report pr ON pr.post_id = p.post_id
                     LEFT JOIN reports r ON r.report_id = pr.report_id
                AND r.report_type = 'post'
                     LEFT JOIN images i
                               ON i.image_id = (
                                   SELECT MIN(image_id)
                                   FROM images
                                   WHERE post_id = p.post_id
                               )
            WHERE p.user_id = ? AND p.post_type = 'market'
            GROUP BY
                p.post_id,
                p.name,
                p.description,
                p.posted_date,
                p.price,
                p.postal_code,
                mp.item_condition,
                i.image_text_data
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

                const mapWithThumbnail = (row) => ({
                    ...row,
                    thumbnail: row.thumbnail_blob
                        ? (Buffer.isBuffer(row.thumbnail_blob)
                            ? row.thumbnail_blob.toString("base64")
                            : row.thumbnail_blob)
                        : null,
                });

                const eventPosts = eventRows.map(mapWithThumbnail);
                const marketPosts = marketRows.map(mapWithThumbnail);

                return res.status(200).json({
                    user,
                    eventPosts,
                    marketPosts,
                });
            });
        });
    });
};
