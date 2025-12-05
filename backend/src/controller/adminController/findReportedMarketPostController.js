import db from "../../config/db.js";

/**
 * GET /api/admin/reported-market-posts
 * Fetches all reported market posts with their report counts and details
 */
export const getReportedMarketPosts = (req, res) => {
    const sql = `
    SELECT
      p.post_id AS id,
      p.name AS title,
      p.price,
      p.post_type,
      p.postal_code,
      p.posted_date,
      p.description,
      mp.item_condition,
      COUNT(DISTINCT pr.report_id) AS report_count,
      MIN(i.image_id) AS thumbnail_image_id
    FROM posts p
    INNER JOIN post_report pr ON pr.post_id = p.post_id
    INNER JOIN reports r ON r.report_id = pr.report_id
    LEFT JOIN market_posts mp ON mp.market_id = p.post_id
    LEFT JOIN images i ON i.post_id = p.post_id
    WHERE p.post_type = 'market'
    GROUP BY
      p.post_id,
      p.name,
      p.price,
      p.post_type,
      p.postal_code,
      p.posted_date,
      p.description,
      mp.item_condition
    ORDER BY MAX(r.report_id) DESC
  `;

    db.query(sql, [], (err, rows) => {
        if (err) {
            console.error("[getReportedMarketPosts] DB error", err);
            return res.status(500).json({ error: "Database error" });
        }

        if (!rows.length) {
            return res.status(200).json({ posts: [] });
        }

        const imageIds = rows
            .map((r) => r.thumbnail_image_id)
            .filter((id) => id != null);

        const mapRows = (rowsToMap, imgMap = {}) =>
            rowsToMap.map((row) => {
                const blob =
                    row.thumbnail_image_id != null
                        ? imgMap[row.thumbnail_image_id] || null
                        : null;

                const thumb =
                    blob != null
                        ? {
                            image_id: row.thumbnail_image_id,
                            data: Buffer.isBuffer(blob) ? blob.toString("base64") : null,
                        }
                        : null;

                return {
                    id: row.id,
                    title: row.title,
                    price: row.price,
                    post_type: row.post_type,
                    postal_code: row.postal_code,
                    posted_date: row.posted_date,
                    report_count: row.report_count,
                    report_date: row.posted_date,
                    item_condition: row.item_condition,
                    thumbnail: thumb,
                };
            });

        // no thumbnails, just return posts without images
        if (!imageIds.length) {
            const mapped = mapRows(rows, {});
            return res.status(200).json({ posts: mapped });
        }

        const imgSql = `
      SELECT image_id, image_text_data
      FROM images
      WHERE image_id IN (?)
    `;

        db.query(imgSql, [imageIds], (imgErr, imgRows) => {
            if (imgErr) {
                console.error("[getReportedMarketPosts] DB img error", imgErr);
                const mapped = mapRows(rows, {});
                return res.status(200).json({ posts: mapped });
            }

            const imgMap = {};
            imgRows.forEach((row) => {
                imgMap[row.image_id] = row.image_text_data;
            });

            const mapped = mapRows(rows, imgMap);
            return res.status(200).json({ posts: mapped });
        });
    });
};
