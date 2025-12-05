import db from "../../config/db.js";

/**
 * GET /api/admin/reported-events
 * Fetch all reported event posts with report counts and optional thumbnails.
 */
export const getReportedEvents = (req, res) => {
    // 1) Get all reported event posts + MIN(image_id) as thumbnail candidate
    const baseSql = `
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
            MIN(i.image_id) AS thumbnail_image_id
        FROM posts p
                 INNER JOIN post_report pr ON pr.post_id = p.post_id
                 INNER JOIN reports r ON r.report_id = pr.report_id
                 LEFT JOIN event_posts ep ON ep.event_id = p.post_id
                 LEFT JOIN images i ON i.post_id = p.post_id
        WHERE p.post_type = 'event'
        GROUP BY
            p.post_id,
            p.name,
            p.price,
            p.post_type,
            p.postal_code,
            p.posted_date,
            p.description,
            ep.organization_name,
            ep.event_start,
            ep.event_end
        ORDER BY MAX(r.report_id) DESC
    `;

    db.query(baseSql, [], (err, rows) => {
        if (err) {
            console.error("[getReportedEvents] DB error", err);
            return res.status(500).json({ error: "Database error" });
        }

        // No reported events at all
        if (!rows.length) {
            return res.status(200).json({ events: [] });
        }

        // Helper to map rows into the final JSON shape
        const mapRows = (rowsToMap, imgMap = {}) => {
            return rowsToMap.map((row) => {
                const blob = row.thumbnail_image_id
                    ? imgMap[row.thumbnail_image_id] || null
                    : null;

                const thumb = blob
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
                    report_date: row.posted_date, // fallback until reports have timestamps
                    organization_name: row.organization_name,
                    event_start: row.event_start,
                    event_end: row.event_end,
                    thumbnail: thumb,
                };
            });
        };

        // Collect all non-null thumbnail image IDs
        const imageIds = rows
            .map((r) => r.thumbnail_image_id)
            .filter((id) => id != null);

        // If no thumbnails at all, just return events without images
        if (!imageIds.length) {
            const mappedNoImages = mapRows(rows, {});
            return res.status(200).json({ events: mappedNoImages });
        }

        // 2) Fetch the blobs for those thumbnail IDs in a separate query
        const imgSql = `
      SELECT image_id, image_text_data
      FROM images
      WHERE image_id IN (?)
    `;

        db.query(imgSql, [imageIds], (imgErr, imgRows) => {
            if (imgErr) {
                console.error("[getReportedEvents] DB img error", imgErr);
                // Even if images fail, better to still return the events list
                const mappedNoImages = mapRows(rows, {});
                return res.status(200).json({ events: mappedNoImages });
            }

            const imgMap = {};
            imgRows.forEach((row) => {
                imgMap[row.image_id] = row.image_text_data;
            });

            const mapped = mapRows(rows, imgMap);
            return res.status(200).json({ events: mapped });
        });
    });
};
