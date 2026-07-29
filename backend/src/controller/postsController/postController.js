import db from "../../config/db.js";

export function getPosts(req, res) {
    console.log("[getPosts] incoming", { url: req.originalUrl, query: req.query });

    const { type, limit = 20 } = req.query;
    const lim = Math.max(1, Math.min(100, Number(limit) || 20));

    const sql = `
        SELECT
        p.post_id       AS id,
        p.name          AS title,
        p.price         AS price,
        p.post_type     AS post_type,
        p.postal_code   AS postal_code,
        p.posted_date   AS posted_date,
        e.organization_name AS organization_name,
        e.event_start   AS event_start,
        e.event_end     AS event_end,
        i.image_id,
        i.image_text_data AS thumbnail_data
        FROM posts p
        LEFT JOIN event_posts e
        ON e.event_id = p.post_id
        LEFT JOIN images i
        ON i.post_id = p.post_id
        AND i.image_id = (
        SELECT MIN(i2.image_id)
        FROM images i2
        WHERE i2.post_id = p.post_id
        )
        ${type ? "WHERE p.post_type = ?" : ""}
        ORDER BY p.posted_date DESC
        LIMIT ?
    `;

    const params = [];
    if (type) params.push(type);
    params.push(lim);

    db.query(sql, params, (err, rows) => {
        if (err) {
        console.error("[getPosts] DB error", err);
        return res.status(500).json({ error: "Database error" });
        }

        const mapped = rows.map((row) => ({
            id: row.id,
            title: row.title,
            price: row.price,
            post_type: row.post_type,
            postal_code: row.postal_code,
            posted_date: row.posted_date,
            organization_name: row.organization_name,
            event_start: row.event_start,   // null for market posts can remove if not needed
            event_end: row.event_end,       // null for market posts can remove if not needed
            thumbnail: row.image_id
                ? {
                    image_id: row.image_id,
                    data:
                    row.thumbnail_data && Buffer.isBuffer(row.thumbnail_data)
                        ? row.thumbnail_data.toString("base64")
                        : null,
                }
                : null,
        }));

        res.json(mapped);
    });
}

// --------------------------------------------
// This function returns marketplace search results for marketplace pages
// Only posts of type 'market' with filters + keyword search.
// --------------------------------------------
export function getMarketResults(req, res) {
    const {
        searchTerms,
        minPrice,
        maxPrice,
        startDate,
        endDate,
        condition,
        limit = 20,
        offset = 0,
    } = req.query;

    let lim = parseInt(limit, 10);
    if (isNaN(lim) || lim <= 0) lim = 20;
    if (lim > 100) lim = 100;

    let off = parseInt(offset, 10);
    if (isNaN(off) || off < 0) off = 0;

    const where = [];
    const params = [];

    where.push("p.post_type = 'market'");

    if (condition) {
        where.push("mp.item_condition = ?");
        params.push(condition);
    }

    if (startDate !== undefined && startDate !== "") {
        where.push("p.posted_date >= ?");
        params.push(startDate);
    }

    if (endDate !== undefined && endDate !== "") {
        where.push("p.posted_date <= ?");
        params.push(endDate);
    }

    if (minPrice !== undefined && minPrice !== "") {
        where.push("p.price >= ?");
        params.push(minPrice);
    }

    if (maxPrice !== undefined && maxPrice !== "") {
        where.push("p.price <= ?");
        params.push(maxPrice);
    }

    if (searchTerms) {
        const raw = Array.isArray(searchTerms)
            ? searchTerms.join(" ")
            : String(searchTerms);

        const trimmed = raw.trim();
        if (trimmed) {
            const booleanQuery = trimmed
                .split(/\s+/)
                .filter(Boolean)
                .map((word) => word.replace(/[^a-zA-Z0-9]/g, ""))
                .filter((word) => word.length >= 3)
                .map((word) => `+${word}`)
                .join(" ");

            if (booleanQuery) {
                where.push("MATCH(p.name, p.description) AGAINST(? IN BOOLEAN MODE)");
                params.push(booleanQuery);
            }
        }
    }

    const whereClause = where.length ? `WHERE ${where.join(" AND ")}` : "";

    // Count total matching rows
    const countSql = `
        SELECT COUNT(*) AS total
        FROM posts p
        JOIN market_posts mp ON mp.market_id = p.post_id
        ${whereClause}
    `;

    db.query(countSql, [...params], (countErr, countRows) => {
        if (countErr) {
            console.error("getMarketResults count error:", countErr);
            return res.status(500).json({ error: "Failed to count marketplace posts" });
        }

        const total = countRows[0].total;

        const sql = `
            SELECT
                p.post_id         AS id,
                p.name            AS title,
                p.description     AS description,
                p.price           AS price,
                p.posted_date     AS posted_date,
                p.postal_code     AS postal_code,
                p.user_id         AS seller_id,
                mp.item_condition AS item_condition,
                i.image_id,
                i.image_text_data AS thumbnail_data
            FROM posts p
            JOIN market_posts mp ON mp.market_id = p.post_id
            LEFT JOIN images i
                ON i.post_id = p.post_id
                AND i.image_id = (
                    SELECT MIN(i2.image_id)
                    FROM images i2
                    WHERE i2.post_id = p.post_id
                )
            ${whereClause}
            ORDER BY p.posted_date DESC
            LIMIT ? OFFSET ?
        `;

        db.query(sql, [...params, lim, off], (err, rows) => {
            if (err) {
                console.error("getMarketResults sql error:", err);
                return res.status(500).json({ error: "Failed to fetch marketplace posts" });
            }

            const results = rows.map((row) => ({
                id: row.id,
                title: row.title,
                description: row.description,
                price: row.price,
                posted_date: row.posted_date,
                postal_code: row.postal_code,
                seller_id: row.seller_id,
                item_condition: row.item_condition,
                thumbnail: row.image_id
                    ? {
                        image_id: row.image_id,
                        data: row.thumbnail_data && Buffer.isBuffer(row.thumbnail_data)
                            ? row.thumbnail_data.toString("base64")
                            : row.thumbnail_data || null,
                    }
                    : null,
            }));

            res.json({ results, total, offset: off, limit: lim });
        });
    });
}



// --------------------------------------------
// This function returns event search results for events pages
// Only posts of type 'event' with filters + keyword search.
// --------------------------------------------
export function getEventResults(req, res) {
    const {
        searchTerms,
        minPrice,
        maxPrice,
        startDate,
        endDate,
        limit = 20,
        offset = 0,
    } = req.query;

    let lim = parseInt(limit, 10);
    if (isNaN(lim) || lim <= 0) lim = 20;
    if (lim > 100) lim = 100;

    let off = parseInt(offset, 10);
    if (isNaN(off) || off < 0) off = 0;

    const where = [];
    const params = [];

    where.push("p.post_type = 'event'");

    if (startDate !== undefined && startDate !== "") {
        where.push("e.event_end >= ?");
        params.push(startDate);
    }

    if (endDate !== undefined && endDate !== "") {
        where.push("e.event_start <= ?");
        params.push(endDate);
    }

    if (minPrice !== undefined && minPrice !== "") {
        where.push("p.price >= ?");
        params.push(minPrice);
    }

    if (maxPrice !== undefined && maxPrice !== "") {
        where.push("p.price <= ?");
        params.push(maxPrice);
    }

    if (searchTerms) {
        const raw = Array.isArray(searchTerms)
            ? searchTerms.join(" ")
            : String(searchTerms);

        const trimmed = raw.trim();
        if (trimmed) {
            const booleanQuery = trimmed
                .split(/\s+/)
                .filter(Boolean)
                .map((word) => word.replace(/[^a-zA-Z0-9]/g, ""))
                .filter((word) => word.length >= 3)
                .map((word) => `+${word}*`)
                .join(" ");

            if (!booleanQuery) {
                return res.json([]);
            }
            where.push("MATCH(p.name, p.description) AGAINST(? IN BOOLEAN MODE)");
            params.push(booleanQuery);
        }
    }

    const whereClause = where.length ? `WHERE ${where.join(" AND ")}` : "";

    const countSql = `
        SELECT COUNT(*) AS total
        FROM posts p
        JOIN event_posts e ON e.event_id = p.post_id
        ${whereClause}
    `;

    db.query(countSql, [...params], (countErr, countRows) => {
        if (countErr) {
            console.error("getEventResults count error:", countErr);
            return res.status(500).json({ error: "Failed to count event posts" });
        }

        const total = countRows[0].total;

        const sql = `
            SELECT
                p.post_id           AS id,
                p.name              AS title,
                p.description       AS description,
                p.price             AS price,
                p.posted_date       AS posted_date,
                p.postal_code       AS postal_code,
                p.user_id           AS organizer_id,
                e.organization_name AS organization_name,
                e.event_start       AS event_start,
                e.event_end         AS event_end,
                i.image_id,
                i.image_text_data   AS thumbnail_data
            FROM posts p
            JOIN event_posts e ON e.event_id = p.post_id
            LEFT JOIN images i
                ON i.post_id = p.post_id
                AND i.image_id = (
                    SELECT MIN(i2.image_id)
                    FROM images i2
                    WHERE i2.post_id = p.post_id
                )
            ${whereClause}
            ORDER BY e.event_start ASC
            LIMIT ? OFFSET ?
        `;

        db.query(sql, [...params, lim, off], (err, rows) => {
            if (err) {
                console.error("getEventResults sql error:", err);
                return res.status(500).json({ error: "Failed to fetch event posts" });
            }

            const results = rows.map((r) => ({
                id: r.id,
                title: r.title,
                description: r.description,
                price: r.price,
                posted_date: r.posted_date,
                postal_code: r.postal_code,
                organizer_id: r.organizer_id,
                organization_name: r.organization_name,
                event_start: r.event_start,
                event_end: r.event_end,
                thumbnail: r.image_id
                    ? {
                        image_id: r.image_id,
                        data: r.thumbnail_data && Buffer.isBuffer(r.thumbnail_data)
                            ? r.thumbnail_data.toString("base64")
                            : r.thumbnail_data || null,
                    }
                    : null,
            }));

            res.json({ results, total, offset: off, limit: lim });
        });
    });
}



// --------------------------------------------
// Get full details for a single event listing
// --------------------------------------------
export function getEventById(req, res) {
  const { id } = req.params;

  const eventId = Number(id);
  if (!Number.isInteger(eventId) || eventId <= 0) {
    return res.status(400).json({ error: "Invalid event id" });
  }

  const sql = `
      SELECT
        p.post_id           AS id,
        p.name              AS title,
        p.description       AS description,
        p.price             AS price,
        p.post_type         AS type,
        p.postal_code       AS location,
        p.posted_date       AS posted_date,
        p.user_id           AS organizer_id,
        u.fname             AS organizer_fname,
        u.lname             AS organizer_lname,
        u.email             AS organizer_email,
        e.organization_name AS organization_name,
        e.event_start       AS start_date,
        e.event_end         AS end_date,
        i.image_id,
        i.image_text_data   AS image_data
      FROM posts p
      JOIN event_posts e ON e.event_id = p.post_id
      JOIN users u       ON u.user_id = p.user_id
      LEFT JOIN images i ON i.post_id = p.post_id
      WHERE p.post_id = ? AND p.post_type = 'event'
    `;


  db.query(sql, [eventId], (err, rows) => {
    if (err) {
      console.error("getEventById sql error:", err);
      return res.status(500).json({ error: "Failed to fetch event" });
    }

    if (!rows.length) {
      return res.status(404).json({ error: "Event not found" });
    }

    const first = rows[0];

    // Base event data (all non-image fields)
      const base = {
          id: first.id,
          title: first.title,
          description: first.description,
          price: first.price,
          type: first.type,
          location: first.location,
          posted_date: first.posted_date,
          organizer_id: first.organizer_id,
          organizer_fname: first.organizer_fname,
          organizer_lname: first.organizer_lname,
          organizer_email: first.organizer_email,
          organization_name: first.organization_name,
          start_date: first.start_date,
          end_date: first.end_date,
      };

    // Collect & normalize images into base64
    const images = rows
      .filter((r) => r.image_id != null && r.image_data != null)
      .map((r) => ({
        image_id: r.image_id,
        data: Buffer.isBuffer(r.image_data)
          ? r.image_data.toString("base64")
          : String(r.image_data), // just in case driver gives a string
      }));

    res.json({ ...base, images });
  });
}



// -----------------------------------------------
// Get full details for a single marketplace item
// -----------------------------------------------

export function getMarketItemById(req, res) {
  const { id } = req.params;

  const postId = Number(id);
  if (!Number.isInteger(postId) || postId <= 0) {
    return res.status(400).json({ error: "Invalid market item id" });
  }

  const sql = `
    SELECT
      p.post_id        AS id,
      p.name           AS title,
      p.description    AS description,
      p.price          AS price,
      p.post_type      AS type,
      p.postal_code    AS postal_code,
      p.posted_date    AS posted_date,
      p.user_id        AS seller_id,
      u.fname          AS seller_fname,
      u.lname          AS seller_lname,
      u.email          AS seller_email,
      mp.item_condition AS item_condition,
      i.image_id,
      i.image_text_data AS image_data
    FROM posts p
    JOIN market_posts mp ON mp.market_id = p.post_id
    JOIN users u ON u.user_id = p.user_id
    LEFT JOIN images i   ON i.post_id = p.post_id
    WHERE p.post_id = ? AND p.post_type = 'market'
  `;

  db.query(sql, [postId], (err, rows) => {
    if (err) {
      console.error("getMarketItemById sql error:", err);
      return res.status(500).json({ error: "Failed to fetch market item" });
    }

    if (!rows.length) {
      return res.status(404).json({ error: "Market item not found" });
    }

    const first = rows[0];

    const base = {
      id: first.id,
      title: first.title,
      description: first.description,
      price: first.price,
      type: first.type,
      postal_code: first.postal_code,
      posted_date: first.posted_date,
      seller_id: first.seller_id,
      seller_fname: first.seller_fname,
      seller_lname: first.seller_lname,
      seller_email: first.seller_email,
      item_condition: first.item_condition,
    };

    const images = rows
      .filter((r) => r.image_id != null && r.image_data != null)
      .map((r) => ({
        image_id: r.image_id,
        data: Buffer.isBuffer(r.image_data)
          ? r.image_data.toString("base64")
          : String(r.image_data),
      }));

    res.json({ ...base, images });
  });
}

// -----------------------------------------------
// Get full details for a single marketplace item with report category
// -----------------------------------------------

export function getReportedMarketItemById(req, res) {
  const { id } = req.params;

  const postId = Number(id);
  if (!Number.isInteger(postId) || postId <= 0) {
    return res.status(400).json({ error: "Invalid market item id" });
  }

  const sql = `
    SELECT
      p.post_id        AS id,
      p.name           AS title,
      p.description    AS description,
      p.price          AS price,
      p.post_type      AS type,
      p.postal_code    AS postal_code,
      p.posted_date    AS posted_date,
      p.user_id        AS seller_id,
      u.fname          AS seller_fname,
      u.lname          AS seller_lname,
      u.email          AS seller_email,
      mp.item_condition AS item_condition,
      i.image_id,
      i.image_text_data AS image_data,
      (
        SELECT r.reason
        FROM post_report pr
        JOIN reports r ON r.report_id = pr.report_id
        WHERE pr.post_id = p.post_id
        ORDER BY r.report_id DESC
        LIMIT 1
      ) AS report_category
    FROM posts p
    JOIN market_posts mp ON mp.market_id = p.post_id
    JOIN users u ON u.user_id = p.user_id
    LEFT JOIN images i   ON i.post_id = p.post_id
    WHERE p.post_id = ? AND p.post_type = 'market'
  `;

  db.query(sql, [postId], (err, rows) => {
    if (err) {
      console.error("getReportedMarketItemById sql error:", err);
      return res.status(500).json({ error: "Failed to fetch market item" });
    }

    if (!rows.length) {
      return res.status(404).json({ error: "Market item not found" });
    }

    const first = rows[0];

    const base = {
      id: first.id,
      title: first.title,
      description: first.description,
      price: first.price,
      type: first.type,
      postal_code: first.postal_code,
      posted_date: first.posted_date,
      seller_id: first.seller_id,
      seller_fname: first.seller_fname,
      seller_lname: first.seller_lname,
      seller_email: first.seller_email,
      item_condition: first.item_condition,
      report_category: first.report_category || null,
    };

    const images = rows
      .filter((r) => r.image_id != null && r.image_data != null)
      .map((r) => ({
        image_id: r.image_id,
        data: Buffer.isBuffer(r.image_data)
          ? r.image_data.toString("base64")
          : String(r.image_data),
      }));

    res.json({ ...base, images });
  });
}

export function getReportedEventById(req, res) {
  const { id } = req.params;

  const eventId = Number(id);
  if (!Number.isInteger(eventId) || eventId <= 0) {
    return res.status(400).json({ error: "Invalid event id" });
  }

  const sql = `
    SELECT
      p.post_id           AS id,
      p.name              AS title,
      p.description       AS description,
      p.price             AS price,
      p.post_type         AS type,
      p.postal_code       AS location,
      p.posted_date       AS posted_date,
      p.user_id           AS organizer_id,
      u.fname             AS organizer_fname,
      u.lname             AS organizer_lname,
      u.email             AS organizer_email,
      e.organization_name AS organization_name,
      e.event_start       AS start_date,
      e.event_end         AS end_date,
      i.image_id,
      i.image_text_data   AS image_data,
      (
        SELECT r.reason
        FROM post_report pr
        JOIN reports r ON r.report_id = pr.report_id
        WHERE pr.post_id = p.post_id
        ORDER BY r.report_id DESC
        LIMIT 1
      ) AS report_category
    FROM posts p
    JOIN event_posts e ON e.event_id = p.post_id
    JOIN users u       ON u.user_id = p.user_id
    LEFT JOIN images i ON i.post_id = p.post_id
    WHERE p.post_id = ? AND p.post_type = 'event'
  `;


  db.query(sql, [eventId], (err, rows) => {
    if (err) {
      console.error("getReportedEventById sql error:", err);
      return res.status(500).json({ error: "Failed to fetch event" });
    }

    if (!rows.length) {
      return res.status(404).json({ error: "Event not found" });
    }

    const first = rows[0];

    // Base event data (all non-image fields)
    const base = {
      id: first.id,
      title: first.title,
      description: first.description,
      price: first.price,
      type: first.type,
      location: first.location,
      posted_date: first.posted_date,
      organizer_id: first.organizer_id,
      organizer_fname: first.organizer_fname,
      organizer_lname: first.organizer_lname,
      organizer_email: first.organizer_email,
      organization_name: first.organization_name,
      start_date: first.start_date,
      end_date: first.end_date,
      report_category: first.report_category || null,
    };

    // Collect & normalize images into base64
    const images = rows
      .filter((r) => r.image_id != null && r.image_data != null)
      .map((r) => ({
        image_id: r.image_id,
        data: Buffer.isBuffer(r.image_data)
          ? r.image_data.toString("base64")
          : String(r.image_data), // just in case driver gives a string
      }));

    res.json({ ...base, images });
  });
}

export function getSuggestions(req, res) {
    const { q, type } = req.query;

    if (!q || !q.trim()) {
        return res.json([]);
    }

    const trimmed = q.trim();

    // Add * to each word for prefix matching: "text" -> "text*", "org chem" -> "org* chem*"
    const booleanQuery = trimmed
        .split(/\s+/)
        .filter(Boolean)
        .map((word) => `+${word}*`)
        .join(" ");

    const postType = type === "event" ? "event" : "market";

    const sql = `
        SELECT DISTINCT p.name
        FROM posts p
        WHERE p.post_type = ?
        AND MATCH(p.name, p.description) AGAINST(? IN BOOLEAN MODE)
        LIMIT 8
    `;

    db.query(sql, [postType, booleanQuery], (err, rows) => {
        if (err) {
            console.error("getSuggestions error:", err);
            return res.json([]);
        }

        const suggestions = rows.map((r) => r.name);
        res.json(suggestions);
    });
}