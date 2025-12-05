import db from "../../config/db.js";

// 2) Get all contacted posts for a user (with thumbnail + seller/organization)
export const getContactedPosts = (req, res) => {
    const { userId } = req.body;

    if (!userId) {
        return res.status(400).json({ error: "userId is required" });
    }

    const sql = `
    SELECT
      cs.user_id,
      p.post_id,
      p.post_type,
      p.name            AS title,
      p.price,
      p.postal_code,
      p.posted_date,
      p.description,
      u.fname           AS seller_fname,
      u.lname           AS seller_lname,
      e.organization_name,
      i.image_text_data AS thumbnail_blob
    FROM contacted_seller cs
      JOIN posts p   ON cs.post_id = p.post_id
      JOIN users u   ON p.user_id = u.user_id
      LEFT JOIN event_posts e
        ON e.event_id = p.post_id
      LEFT JOIN images i
        ON i.image_id = (
          SELECT MIN(image_id)
          FROM images
          WHERE post_id = p.post_id
        )
    WHERE cs.user_id = ?
    ORDER BY cs.post_id DESC
  `;

    db.query(sql, [userId], (err, rows) => {
        if (err) {

            return res.status(500).json({ error: "Database error" });
        }

        const contactedPosts = rows.map((row) => ({
            user_id: row.user_id,
            post_id: row.post_id,
            post_type: row.post_type,
            title: row.title,
            price: row.price,
            postal_code: row.postal_code,
            posted_date: row.posted_date,
            description: row.description,
            seller_fname: row.seller_fname,
            seller_lname: row.seller_lname,
            organization_name: row.organization_name,
            thumbnail: row.thumbnail_blob
                ? (Buffer.isBuffer(row.thumbnail_blob)
                    ? row.thumbnail_blob.toString("base64")
                    : row.thumbnail_blob)
                : null,
        }));

        return res.status(200).json({ contactedPosts });
    });
};
