import db from "../../config/db.js";
import { promisePool } from "../../config/db.js";

// 1) Get all EVENT posts created by this user
// POST /api/my-events/list
// Body: { userId }
export const getUserEventPosts = (req, res) => {
    const userId = req.user.id;

  if (!userId) {
    return res.status(400).json({ error: "userId is required" });
  }

  const sql = `
    SELECT
        p.post_id,
        p.name AS title,
        p.description,
        p.price,
        p.postal_code,
        p.posted_date,
        e.organization_name,
        e.event_start,
        e.event_end,
        i.image_text_data AS thumbnail_blob
    FROM posts p
    JOIN event_posts e
        ON e.event_id = p.post_id
    LEFT JOIN images i
        ON i.image_id = (
            SELECT MIN(image_id)
            FROM images
            WHERE post_id = p.post_id
        )
    WHERE p.user_id = ? AND p.post_type = 'event'
    ORDER BY p.posted_date DESC
  `;

  db.query(sql, [userId], (err, rows) => {
    if (err) {
      console.error("DB error (getUserEventPosts):", err);
      return res.status(500).json({ error: "Database error" });
    }

    const myEvents = rows.map((row) => ({
      post_id: row.post_id,
      title: row.title,
      description: row.description,
      price: row.price,
      postal_code: row.postal_code,
      posted_date: row.posted_date,
      organization_name: row.organization_name,
      event_start: row.event_start,
      event_end: row.event_end,
      thumbnail: row.thumbnail_blob
        ? Buffer.isBuffer(row.thumbnail_blob)
          ? row.thumbnail_blob.toString("base64")
          : row.thumbnail_blob
        : null,
    }));

    return res.status(200).json({ myEvents });
  });
};

// 2) Delete an EVENT post created by this user
// DELETE /api/my-events/delete
// Body: { userId, postId }
export const deleteEventPost = (req, res) => {
    const userId = req.user.id;
    const { postId } = req.body;

    if (!userId || !postId) {
        return res
            .status(400)
            .json({ error: "userId and postId are required to delete an event" });
    }

    const pid = Number(postId);
    if (!Number.isInteger(pid) || pid <= 0) {
        return res.status(400).json({ error: "Invalid postId" });
    }

    const deletePostSql = `
        DELETE FROM posts
        WHERE post_id = ? AND user_id = ? AND post_type = 'event'
    `;

    db.query(deletePostSql, [pid, userId], (err, result) => {
        if (err) {
            console.error("DB error (deleteEventPost/posts):", err);
            return res.status(500).json({ error: "Failed to delete event" });
        }

        if (result.affectedRows === 0) {
            return res
                .status(404)
                .json({ error: "Event post not found for this user" });
        }

        return res.status(200).json({
            message: "Event post deleted successfully",
            postId: pid,
        });
    });
};

// 3) Create a new EVENT post
// POST /api/my-events/create
//
// Request: multipart/form-data
// Fields (req.body):
//   - userId            (required)
//   - title             (required) : event title (maps to posts.name)
//   - description       (required)
//   - location          (required) : postal code (maps to posts.postal_code)
//   - price             (optional) : numeric >= 0, or empty for NULL
//   - organization_name (required)
//   - event_start       (required) : ISO or date string parseable by JS Date
//   - event_end         (required) : ISO or date string parseable by JS Date
//
// Files (req.files via Multer):
//   - images[]          (optional) : image files to store in `images.image_text_data`.
export const createEventPost = async (req, res) => {
    const { title, description, location, price, organization_name, event_start, event_end } = req.body;
    const userId = req.user.id;

    if (!userId || !title || !description || !location || !organization_name || !event_start || !event_end) {
        return res.status(400).json({
            error: "userId, title, description, location, organization_name, event_start, and event_end are required",
        });
    }

    let priceVal = null;
    if (typeof price !== "undefined" && price !== "") {
        const priceNum = Number(price);
        if (!Number.isFinite(priceNum) || priceNum < 0) {
            return res.status(400).json({ error: "Invalid price" });
        }
        priceVal = priceNum;
    }

    const startDate = new Date(event_start);
    const endDate = new Date(event_end);
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        return res.status(400).json({ error: "Invalid event_start or event_end" });
    }
    if (startDate > endDate) {
        return res.status(400).json({ error: "event_start must be before event_end" });
    }

    const files = Array.isArray(req.files) ? req.files : [];
    const conn = await promisePool.getConnection();

    try {
        await conn.beginTransaction();

        const [postResult] = await conn.query(
            "INSERT INTO posts (user_id, post_type, postal_code, price, name, description) VALUES (?, 'event', ?, ?, ?, ?)",
            [userId, location, priceVal, title, description]
        );
        const newPostId = postResult.insertId;

        await conn.query(
            "INSERT INTO event_posts (event_id, organization_name, event_start, event_end) VALUES (?, ?, ?, ?)",
            [newPostId, organization_name, startDate, endDate]
        );

        for (const file of files) {
            await conn.query(
                "INSERT INTO images (post_id, image_text_data) VALUES (?, ?)",
                [newPostId, file.buffer]
            );
        }

        await conn.commit();
        return res.status(201).json({ message: "Event post created successfully", postId: newPostId });
    } catch (err) {
        await conn.rollback();
        console.error("DB error (createEventPost):", err);
        return res.status(500).json({ error: "Failed to create event post" });
    } finally {
        conn.release();
    }
};

// 4) Edit an EVENT post
// PUT /api/my-events/edit
//
// Request: multipart/form-data (handled by Multer in myEventsRoute.js)
// Fields (req.body):
//   - userId            (required) : ID of the user who owns the post
//   - postId            (required) : ID of the event post to update
//   - title             (required) : New event title (posts.name)
//   - description       (required)
//   - location          (required) : postal code (posts.postal_code)
//   - price             (optional) : numeric >= 0, or empty for NULL
//   - organization_name (required)
//   - event_start       (required)
//   - event_end         (required)
//   - deleted_images    (optional) : JSON string or array of image_ids to delete
//
// Files (req.files via Multer):
//   - new_images[]      (optional) : One or more image files to append to this post
export const updateEventPost = async (req, res) => {
    const { postId, title, description, location, price, organization_name, event_start, event_end, deleted_images } = req.body;
    const userId = req.user.id;

    if (!userId || !postId) {
        return res.status(400).json({ error: "userId and postId are required to update an event" });
    }
    if (!title || !description || !location || !organization_name || !event_start || !event_end) {
        return res.status(400).json({
            error: "title, description, location, organization_name, event_start, and event_end are required",
        });
    }

    const pid = Number(postId);
    if (!Number.isInteger(pid) || pid <= 0) {
        return res.status(400).json({ error: "Invalid postId" });
    }

    let priceVal = null;
    if (typeof price !== "undefined" && price !== "") {
        const priceNum = Number(price);
        if (!Number.isFinite(priceNum) || priceNum < 0) {
            return res.status(400).json({ error: "Invalid price" });
        }
        priceVal = priceNum;
    }

    const startDate = new Date(event_start);
    const endDate = new Date(event_end);
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        return res.status(400).json({ error: "Invalid event_start or event_end" });
    }
    if (startDate > endDate) {
        return res.status(400).json({ error: "event_start must be before event_end" });
    }

    let deletedIds = [];
    if (deleted_images) {
        try {
            const parsed = Array.isArray(deleted_images) ? deleted_images : JSON.parse(deleted_images);
            if (Array.isArray(parsed)) {
                deletedIds = parsed
                    .map((item) => {
                        if (typeof item === "number") return item;
                        if (typeof item === "string") return Number(item);
                        if (item && typeof item === "object" && "image_id" in item) return Number(item.image_id);
                        return NaN;
                    })
                    .filter((id) => Number.isInteger(id) && id > 0);
            }
        } catch (e) {
            console.warn("Failed to parse deleted_images:", e);
        }
    }

    const newImages = Array.isArray(req.files) ? req.files : [];
    const conn = await promisePool.getConnection();

    try {
        await conn.beginTransaction();

        const [updateResult] = await conn.query(
            "UPDATE posts SET name = ?, description = ?, postal_code = ?, price = ? WHERE post_id = ? AND user_id = ? AND post_type = 'event'",
            [title, description, location, priceVal, pid, userId]
        );

        if (updateResult.affectedRows === 0) {
            await conn.rollback();
            return res.status(404).json({ error: "Event post not found for this user" });
        }

        await conn.query(
            "UPDATE event_posts SET organization_name = ?, event_start = ?, event_end = ? WHERE event_id = ?",
            [organization_name, startDate, endDate, pid]
        );

        if (deletedIds.length) {
            const placeholders = deletedIds.map(() => "?").join(",");
            await conn.query(
                `DELETE FROM images WHERE post_id = ? AND image_id IN (${placeholders})`,
                [pid, ...deletedIds]
            );
        }

        for (const file of newImages) {
            await conn.query(
                "INSERT INTO images (post_id, image_text_data) VALUES (?, ?)",
                [pid, file.buffer]
            );
        }

        await conn.commit();
        return res.status(200).json({ message: "Event post updated successfully", postId: pid });
    } catch (err) {
        await conn.rollback();
        console.error("DB error (updateEventPost):", err);
        return res.status(500).json({ error: "Failed to update event post" });
    } finally {
        conn.release();
    }
};

