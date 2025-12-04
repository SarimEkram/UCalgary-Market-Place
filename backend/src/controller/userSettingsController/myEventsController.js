import db from "../../config/db.js";

// 1) Get all EVENT posts created by this user
// POST /api/my-events/list
// Body: { userId }
export const getUserEventPosts = (req, res) => {
  const { userId } = req.body;

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
    const { userId, postId } = req.body;

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
export const createEventPost = (req, res) => {
  const {
    userId,
    title,
    description,
    location,
    price,
    organization_name,
    event_start,
    event_end,
  } = req.body;

  if (
    !userId ||
    !title ||
    !description ||
    !location ||
    !organization_name ||
    !event_start ||
    !event_end
  ) {
    return res.status(400).json({
      error:
        "userId, title, description, location, organization_name, event_start, and event_end are required",
    });
  }

  // price is optional – allow null if blank
  let priceVal = null;
  if (typeof price !== "undefined" && price !== "") {
    const priceNum = Number(price);
    if (!Number.isFinite(priceNum) || priceNum < 0) {
      return res.status(400).json({ error: "Invalid price" });
    }
    priceVal = priceNum;
  }

  // Validate dates
  const startDate = new Date(event_start);
  const endDate = new Date(event_end);

  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    return res.status(400).json({ error: "Invalid event_start or event_end" });
  }

  if (startDate > endDate) {
    return res
      .status(400)
      .json({ error: "event_start must be before event_end" });
  }

  const files = Array.isArray(req.files) ? req.files : [];

  // 1) Insert into posts
  const insertPostSql = `
      INSERT INTO posts (user_id, post_type, postal_code, price, name, description)
      VALUES (?, 'event', ?, ?, ?, ?)
  `;

  db.query(
    insertPostSql,
    [userId, location, priceVal, title, description],
    (err, result) => {
      if (err) {
        console.error("DB error (createEventPost - posts):", err);
        return res.status(500).json({ error: "Failed to create event post" });
      }

      const newPostId = result.insertId;

      // 2) Insert into event_posts
      const insertEventSql = `
          INSERT INTO event_posts (event_id, organization_name, event_start, event_end)
          VALUES (?, ?, ?, ?)
      `;
      db.query(
        insertEventSql,
        [newPostId, organization_name, startDate, endDate],
        (err2) => {
          if (err2) {
            console.error(
              "DB error (createEventPost - event_posts):",
              err2
            );
            return res
              .status(500)
              .json({ error: "Failed to create event details" });
          }

          // 3) Insert images if any
          if (!files.length) {
            return res.status(201).json({
              message: "Event post created successfully",
              postId: newPostId,
            });
          }

          const insertOne = (index) => {
            if (index >= files.length) {
              return res.status(201).json({
                message: "Event post created successfully",
                postId: newPostId,
              });
            }

            const file = files[index];
            db.query(
              "INSERT INTO images (post_id, image_text_data) VALUES (?, ?)",
              [newPostId, file.buffer],
              (err3) => {
                if (err3) {
                  console.error(
                    "DB error (createEventPost - insert image):",
                    err3
                  );
                  return res
                    .status(500)
                    .json({ error: "Failed to save images" });
                }
                insertOne(index + 1);
              }
            );
          };

          insertOne(0);
        }
      );
    }
  );
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
export const updateEventPost = (req, res) => {
  const {
    userId,
    postId,
    title,
    description,
    location,
    price,
    organization_name,
    event_start,
    event_end,
    deleted_images,
  } = req.body;

  // Basic validation
  if (!userId || !postId) {
    return res
      .status(400)
      .json({ error: "userId and postId are required to update an event" });
  }
  if (!title || !description || !location || !organization_name || !event_start || !event_end) {
    return res.status(400).json({
      error:
        "title, description, location, organization_name, event_start, and event_end are required",
    });
  }

  const pid = Number(postId);
  if (!Number.isInteger(pid) || pid <= 0) {
    return res.status(400).json({ error: "Invalid postId" });
  }

  // price is optional
  let priceVal = null;
  if (typeof price !== "undefined" && price !== "") {
    const priceNum = Number(price);
    if (!Number.isFinite(priceNum) || priceNum < 0) {
      return res.status(400).json({ error: "Invalid price" });
    }
    priceVal = priceNum;
  }

  // Validate dates
  const startDate = new Date(event_start);
  const endDate = new Date(event_end);

  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    return res.status(400).json({ error: "Invalid event_start or event_end" });
  }
  if (startDate > endDate) {
    return res
      .status(400)
      .json({ error: "event_start must be before event_end" });
  }

  // Parse deleted_images (can be JSON string or array)
  let deletedIds = [];
  if (deleted_images) {
    if (Array.isArray(deleted_images)) {
      deletedIds = deleted_images;
    } else if (typeof deleted_images === "string") {
      try {
        const parsed = JSON.parse(deleted_images);
        if (Array.isArray(parsed)) {
          deletedIds = parsed;
        }
      } catch (e) {
        console.warn("Failed to parse deleted_images JSON, ignoring:", e);
      }
    }
  }

  deletedIds = deletedIds
  .map((item) => {
      if (typeof item === "number") return item;
      if (typeof item === "string") return Number(item);
      if (item && typeof item === "object" && "image_id" in item) {
      return Number(item.image_id);
      }
      return NaN;
  })
  .filter((id) => Number.isInteger(id) && id > 0);


  const newImages = Array.isArray(req.files) ? req.files : [];

  // ---- 1) Update main post (posts table) ----
  const updatePostSql = `
    UPDATE posts
    SET name = ?, description = ?, postal_code = ?, price = ?
    WHERE post_id = ? AND user_id = ? AND post_type = 'event'
  `;

  db.query(
    updatePostSql,
    [title, description, location, priceVal, pid, userId],
    (err, result) => {
      if (err) {
        console.error("DB error (updateEventPost - posts):", err);
        return res.status(500).json({ error: "Failed to update event post" });
      }

      if (result.affectedRows === 0) {
        return res
          .status(404)
          .json({ error: "Event post not found for this user" });
      }

      // ---- 2) Update event details in event_posts ----
      const updateEventSql = `
        UPDATE event_posts
        SET organization_name = ?, event_start = ?, event_end = ?
        WHERE event_id = ?
      `;
      db.query(
        updateEventSql,
        [organization_name, startDate, endDate, pid],
        (err2) => {
          if (err2) {
            console.error(
              "DB error (updateEventPost - event_posts):",
              err2
            );
            return res
              .status(500)
              .json({ error: "Failed to update event details" });
          }

          // ---- 3) Delete images if requested ----
          const deleteImagesIfNeeded = (cb) => {
            if (!deletedIds.length) return cb();

            const placeholders = deletedIds.map(() => "?").join(",");
            const deleteSql = `
              DELETE FROM images
              WHERE post_id = ? AND image_id IN (${placeholders})
            `;
            db.query(deleteSql, [pid, ...deletedIds], (err3) => {
              if (err3) {
                console.error(
                  "DB error (updateEventPost - delete images):",
                  err3
                );
                return cb(err3);
              }
              cb();
            });
          };

          // ---- 4) Insert new images if any ----
          const insertNewImagesIfNeeded = (cb) => {
            if (!newImages.length) return cb();

            const insertOne = (index) => {
              if (index >= newImages.length) return cb();

              const file = newImages[index];
              db.query(
                "INSERT INTO images (post_id, image_text_data) VALUES (?, ?)",
                [pid, file.buffer],
                (err4) => {
                  if (err4) {
                    console.error(
                      "DB error (updateEventPost - insert image):",
                      err4
                    );
                    return cb(err4);
                  }
                  insertOne(index + 1);
                }
              );
            };

            insertOne(0);
          };

          deleteImagesIfNeeded((delErr) => {
            if (delErr) {
              return res.status(500).json({
                error: "Failed to delete images",
              });
            }

            insertNewImagesIfNeeded((insErr) => {
              if (insErr) {
                return res.status(500).json({
                  error: "Failed to insert new images",
                });
              }

              // ---- 5) Success msg ----
              return res.status(200).json({
                message: "Event post updated successfully",
                postId: pid,
              });
            });
          });
        }
      );
    }
  );
};

