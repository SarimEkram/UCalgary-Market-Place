import db from "../../config/db.js";

// 1) Get all MARKET posts created by this user (for "My Posts" page)
// POST /api/my-posts/list
// Body: { userId }
export const getUserMarketPosts = (req, res) => {
    const { userId } = req.body;

    if (!userId) {
        return res.status(400).json({ error: "userId is required" });
    }

    const sql = `
        SELECT
            p.post_id,
            p.name,
            p.description,
            p.price,
            p.postal_code,
            p.posted_date,
            mp.item_condition,
            i.image_text_data AS thumbnail_blob
        FROM posts p
                 JOIN market_posts mp
                      ON mp.market_id = p.post_id
                 LEFT JOIN images i
                           ON i.image_id = (
                               SELECT MIN(image_id)
                               FROM images
                               WHERE post_id = p.post_id
                           )
        WHERE p.user_id = ? AND p.post_type = 'market'
        ORDER BY p.posted_date DESC
    `;

    db.query(sql, [userId], (err, rows) => {
        if (err) {
            console.error("DB error (getUserMarketPosts):", err);
            return res.status(500).json({ error: "Database error" });
        }

        const myPosts = rows.map((row) => ({
            post_id: row.post_id,
            name: row.name,
            description: row.description,
            price: row.price,
            postal_code: row.postal_code,
            posted_date: row.posted_date,
            item_condition: row.item_condition,
            thumbnail: row.thumbnail_blob
                ? Buffer.isBuffer(row.thumbnail_blob)
                    ? row.thumbnail_blob.toString("base64")
                    : row.thumbnail_blob
                : null,
        }));

        return res.status(200).json({ myPosts });
    });
};

// 2) Delete a MARKET post created by this user
// DELETE /api/my-posts/delete
// Body: { userId, postId }
export const deleteMarketPost = (req, res) => {
    const { userId, postId } = req.body;

    if (!userId || !postId) {
        return res
            .status(400)
            .json({ error: "userId and postId are required to delete a post" });
    }

    const pid = Number(postId);
    if (!Number.isInteger(pid) || pid <= 0) {
        return res.status(400).json({ error: "Invalid postId" });
    }

    const deletePostSql = `
        DELETE FROM posts
        WHERE post_id = ? AND user_id = ? AND post_type = 'market'
    `;

    db.query(deletePostSql, [pid, userId], (err, result) => {
        if (err) {
            console.error("DB error (deleteMarketPost/posts):", err);
            return res.status(500).json({ error: "Failed to delete post" });
        }

        if (result.affectedRows === 0) {
            return res
                .status(404)
                .json({ error: "Market post not found for this user" });
        }

        return res.status(200).json({
            message: "Market post deleted successfully",
            postId: pid,
        });
    });
};


// 3) Create a new MARKET post
// POST /api/my-posts/create-market
//
// Request: multipart/form-data
// Fields (req.body):
//   - userId       (required)
//   - title        (required)
//   - description  (required)
//   - location     (required) : postal code
//   - price        (required) : numeric >= 0
//   - condition    (required) : "new" | "good" | "fair"
//
// Files (req.files via Multer):
//   - images[]     (optional) : image files to store in `images.image_text_data`.

export const createMarketPost = (req, res) => {
  const {
    userId,
    title,
    description,
    location,
    price,
    condition,
  } = req.body;

  if (!userId || !title || !description || !location || typeof price === "undefined") {
    return res.status(400).json({
      error: "userId, title, description, location, and price are required",
    });
  }

  const priceNum = Number(price);
  if (!Number.isFinite(priceNum) || priceNum < 0) {
    return res.status(400).json({ error: "Invalid price" });
  }

  const normalizedCondition = String(condition || "").toLowerCase();
  const allowedConditions = ["new", "good", "fair"];
  if (!allowedConditions.includes(normalizedCondition)) {
    return res.status(400).json({ error: "Invalid item condition" });
  }

  const files = Array.isArray(req.files) ? req.files : [];

  // 1) Insert into posts
  const insertPostSql = `
      INSERT INTO posts (user_id, post_type, postal_code, price, name, description)
      VALUES (?, 'market', ?, ?, ?, ?)
  `;

  db.query(
    insertPostSql,
    [userId, location, priceNum, title, description],
    (err, result) => {
      if (err) {
        console.error("DB error (createMarketPost - posts):", err);
        return res.status(500).json({ error: "Failed to create post" });
      }

      const newPostId = result.insertId;

      // 2) Insert into market_posts
      const insertMarketSql = `
          INSERT INTO market_posts (market_id, item_condition)
          VALUES (?, ?)
      `;
      db.query(
        insertMarketSql,
        [newPostId, normalizedCondition],
        (err2) => {
          if (err2) {
            console.error("DB error (createMarketPost - market_posts):", err2);
            return res
              .status(500)
              .json({ error: "Failed to create market post details" });
          }

          // 3) Insert images if any
          if (!files.length) {
            return res.status(201).json({
              message: "Market post created successfully",
              postId: newPostId,
            });
          }

          const insertOne = (index) => {
            if (index >= files.length) {
              return res.status(201).json({
                message: "Market post created successfully",
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
                    "DB error (createMarketPost - insert image):",
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



// 4) Edit a MARKET post
// PUT /api/my-posts/edit-market
//
// Request: multipart/form-data (handled by Multer in myPostsRoute.js)
// Fields (req.body):
//   - userId          (required) : ID of the user who owns the post
//   - postId          (required) : ID of the market post to update
//   - title           (required) : New post title (maps to posts.name)
//   - description     (required) : New post description
//   - location        (required) : Postal code (maps to posts.postal_code)
//   - price           (required) : New price (numeric, >= 0)
//   - condition       (required) : "new" | "good" | "fair" (maps to market_posts.item_condition)
//   - deleted_images  (optional) : JSON string or array of image_ids to delete
//
// Files (req.files via Multer):
//   - new_images[]    (optional) : One or more image files to append to this post
export const updateMarketPost = (req, res) => {

  const {
    userId,
    postId,
    title,
    description,
    location,
    price,
    condition,
    deleted_images,
  } = req.body;

  // Basic validation
  if (!userId || !postId) {
    return res
      .status(400)
      .json({ error: "userId and postId are required to update a post" });
  }
  if (!title || !description || !location || typeof price === "undefined") {
    return res.status(400).json({
      error: "title, description, location, and price are required",
    });
  }

  const pid = Number(postId);
  if (!Number.isInteger(pid) || pid <= 0) {
    return res.status(400).json({ error: "Invalid postId" });
  }

  const priceNum = Number(price);
  if (!Number.isFinite(priceNum) || priceNum < 0) {
    return res.status(400).json({ error: "Invalid price" });
  }

  const normalizedCondition = String(condition || "").toLowerCase();
  const allowedConditions = ["new", "good", "fair"];
  if (!allowedConditions.includes(normalizedCondition)) {
    return res.status(400).json({ error: "Invalid item condition" });
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
    .map((id) => Number(id))
    .filter((id) => Number.isInteger(id) && id > 0);

  const newImages = Array.isArray(req.files) ? req.files : [];

  // ---- 1) Update main post (posts table) ----
  const updatePostSql = `
    UPDATE posts
    SET name = ?, description = ?, postal_code = ?, price = ?
    WHERE post_id = ? AND user_id = ? AND post_type = 'market'
  `;

  db.query(
    updatePostSql,
    [title, description, location, priceNum, pid, userId],
    (err, result) => {
      if (err) {
        console.error("DB error (updateMarketPost - posts):", err);
        return res.status(500).json({ error: "Failed to update post" });
      }

      if (result.affectedRows === 0) {
        return res
          .status(404)
          .json({ error: "Market post not found for this user" });
      }

      // ---- 2) Update condition in market_posts ----
      const updateConditionSql = `
        UPDATE market_posts
        SET item_condition = ?
        WHERE market_id = ?
      `;
      db.query(
        updateConditionSql,
        [normalizedCondition, pid],
        (err2, result2) => {
          if (err2) {
            console.error(
              "DB error (updateMarketPost - market_posts):",
              err2
            );
            return res
              .status(500)
              .json({ error: "Failed to update item condition" });
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
                  "DB error (updateMarketPost - delete images):",
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
                      "DB error (updateMarketPost - insert image):",
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
                message: "Market post updated successfully",
                postId: pid,
              });
            });
          });
        }
      );
    }
  );
};
