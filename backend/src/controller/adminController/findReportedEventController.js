import db from "../../config/db.js";

/**
 * GET /api/admin/reported-events
 * Fetches all reported event posts with their report counts and details
 */
export const getReportedEvents = (req, res) => {
    const sql = `
        SELECT
            p.post_id AS id,
            p.name AS title,
            p.price,
            p.post_type,
            p.postal_code,
            p.posted_date,
            p.description,
            ep.organization_name,
            ep.event_start,
            ep.event_end,
            COUNT(DISTINCT pr.report_id) AS report_count,
            i.image_id AS thumbnail_image_id,
            i.image_text_data AS thumbnail_data
        FROM posts p
        INNER JOIN post_report pr ON pr.post_id = p.post_id
        INNER JOIN reports r ON r.report_id = pr.report_id
        LEFT JOIN event_posts ep ON ep.event_id = p.post_id
        LEFT JOIN images i ON i.post_id = p.post_id
            AND i.image_id = (
                SELECT MIN(i2.image_id)
                FROM images i2
                WHERE i2.post_id = p.post_id
            )
        WHERE p.post_type = 'event'
        GROUP BY p.post_id, p.name, p.price, p.post_type, p.postal_code, p.posted_date, p.description,
                 ep.organization_name, ep.event_start, ep.event_end, i.image_id, i.image_text_data
        ORDER BY MAX(r.report_id) DESC
    `;

    db.query(sql, [], (err, rows) => {
        if (err) {
            console.error("[getReportedEvents] DB error", err);
            return res.status(500).json({ error: "Database error" });
        }

        // Map the results to the expected format
        const mapped = rows.map((row) => {
            // Use the latest report_id as a proxy for report_date
            // Since reports table doesn't have a timestamp, we'll use posted_date as fallback
            // The frontend can use report_count and latest_report_id to determine recency
            return {
                id: row.id,
                title: row.title,
                price: row.price,
                post_type: row.post_type,
                postal_code: row.postal_code,
                posted_date: row.posted_date,
                report_count: row.report_count,
                report_date: row.posted_date, // Can be improved if reports table gets a timestamp column
                organization_name: row.organization_name,
                event_start: row.event_start,
                event_end: row.event_end,
                thumbnail: row.thumbnail_image_id
                    ? {
                        image_id: row.thumbnail_image_id,
                        data: row.thumbnail_data && Buffer.isBuffer(row.thumbnail_data)
                            ? row.thumbnail_data.toString("base64")
                            : null,
                    }
                    : null,
            };
        });

        res.status(200).json({ events: mapped });
    });
};