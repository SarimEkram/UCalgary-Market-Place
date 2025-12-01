import db from "../../config/db.js";

// Cooldown period in hours (24 hours = 1 day)
const CONTACT_COOLDOWN_HOURS = 24;

// 1) Add contact entry when user contacts seller/organizer
// POST /api/contactSeller
// Body: { userId, postId }
export const contactSeller = (req, res) => {
    const { userId, postId } = req.body;

    if (!userId || !postId) {
        return res.status(400).json({ 
            error: "userId and postId are required" 
        });
    }

    const pid = Number(postId);
    if (!Number.isInteger(pid) || pid <= 0) {
        return res.status(400).json({ error: "Invalid postId" });
    }

    // Check if entry already exists
    const checkSql = `
        SELECT contacted_at 
        FROM contacted_seller 
        WHERE user_id = ? AND post_id = ?
    `;

    db.query(checkSql, [userId, pid], (checkErr, checkRows) => {
        if (checkErr) {
            console.error("DB error (contactSeller/check):", checkErr);
            return res.status(500).json({ error: "Database error" });
        }

        if (checkRows.length > 0) {
            // Entry exists, update timestamp
            const updateSql = `
                UPDATE contacted_seller 
                SET contacted_at = CURRENT_TIMESTAMP 
                WHERE user_id = ? AND post_id = ?
            `;

            db.query(updateSql, [userId, pid], (updateErr, updateResult) => {
                if (updateErr) {
                    console.error("DB error (contactSeller/update):", updateErr);
                    return res.status(500).json({ error: "Failed to update contact" });
                }

                return res.status(200).json({
                    success: true,
                    message: "Contact timestamp updated",
                    contacted_at: new Date().toISOString()
                });
            });
        } else {
            // New entry
            const insertSql = `
                INSERT INTO contacted_seller (user_id, post_id, contacted_at)
                VALUES (?, ?, CURRENT_TIMESTAMP)
            `;

            db.query(insertSql, [userId, pid], (insertErr, insertResult) => {
                if (insertErr) {
                    console.error("DB error (contactSeller/insert):", insertErr);
                    return res.status(500).json({ error: "Failed to add contact" });
                }

                return res.status(200).json({
                    success: true,
                    message: "Contact added successfully",
                    contacted_at: new Date().toISOString()
                });
            });
        }
    });
};

// 2) Check if user can contact seller/organizer (cooldown check)
// POST /api/canContactSeller
// Body: { userId, postId }
export const canContactSeller = (req, res) => {
    const { userId, postId } = req.body;

    if (!userId || !postId) {
        return res.status(400).json({ 
            error: "userId and postId are required" 
        });
    }

    const pid = Number(postId);
    if (!Number.isInteger(pid) || pid <= 0) {
        return res.status(400).json({ error: "Invalid postId" });
    }

    const sql = `
        SELECT contacted_at,
               TIMESTAMPDIFF(HOUR, contacted_at, NOW()) AS hours_since_contact
        FROM contacted_seller
        WHERE user_id = ? AND post_id = ?
    `;

    db.query(sql, [userId, pid], (err, rows) => {
        if (err) {
            console.error("DB error (canContactSeller):", err);
            return res.status(500).json({ error: "Database error" });
        }

        if (rows.length === 0) {
            // Never contacted, can contact
            return res.status(200).json({
                canContact: true,
                reason: "never_contacted"
            });
        }

        const hoursSinceContact = rows[0].hours_since_contact;
        const canContact = hoursSinceContact >= CONTACT_COOLDOWN_HOURS;
        const hoursRemaining = canContact 
            ? 0 
            : CONTACT_COOLDOWN_HOURS - hoursSinceContact;

        return res.status(200).json({
            canContact,
            reason: canContact ? "cooldown_passed" : "cooldown_active",
            hoursSinceContact,
            hoursRemaining: Math.ceil(hoursRemaining),
            contactedAt: rows[0].contacted_at
        });
    });
};

// 3) Get all contacted posts for a user (with thumbnail + seller/organization + timeout info)
// POST /api/getContactedPosts
// Body: { userId }
export const getContactedPosts = (req, res) => {
    const { userId } = req.body;

    if (!userId) {
        return res.status(400).json({ error: "userId is required" });
    }

    const sql = `
        SELECT
            cs.user_id,
            cs.contacted_at,
            TIMESTAMPDIFF(HOUR, cs.contacted_at, NOW()) AS hours_since_contact,
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
        ORDER BY cs.contacted_at DESC
    `;

    db.query(sql, [userId], (err, rows) => {
        if (err) {
            console.error("DB error (getContactedPosts):", err);
            return res.status(500).json({ error: "Database error" });
        }

        const contactedPosts = rows.map((row) => {
            const hoursSinceContact = row.hours_since_contact;
            const canContactAgain = hoursSinceContact >= CONTACT_COOLDOWN_HOURS;
            const hoursRemaining = canContactAgain 
                ? 0 
                : CONTACT_COOLDOWN_HOURS - hoursSinceContact;

            return {
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
                contacted_at: row.contacted_at,
                hours_since_contact: hoursSinceContact,
                can_contact_again: canContactAgain,
                hours_remaining: Math.ceil(hoursRemaining),
                thumbnail: row.thumbnail_blob
                    ? (Buffer.isBuffer(row.thumbnail_blob)
                        ? row.thumbnail_blob.toString("base64")
                        : row.thumbnail_blob)
                    : null,
            };
        });

        return res.status(200).json({ contactedPosts });
    });
};

