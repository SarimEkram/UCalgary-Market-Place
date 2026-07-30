import db from "../config/db.js";
import { io, getSocketId } from "../socket.js";

// GET /api/messages/unread-count
export const getUnreadCount = (req, res) => {
    const userId = req.user.id;

    const sql = `
        SELECT COUNT(*) AS count
        FROM conversations c
        LEFT JOIN conversation_read_status crs
            ON crs.conversation_id = c.conversation_id AND crs.user_id = ?
        WHERE (c.buyer_id = ? OR c.seller_id = ?)
          AND c.status = 'active'
          AND c.last_message_at > COALESCE(crs.last_read_at, '1970-01-01')
    `;

    db.query(sql, [userId, userId, userId], (err, rows) => {
        if (err) {
            console.error("getUnreadCount error:", err);
            return res.status(500).json({ error: "Database error" });
        }
        return res.json({ unreadCount: rows[0].count });
    });
};

// GET /api/messages/conversations
export const getConversations = (req, res) => {
    const userId = req.user.id;
    const { status = "active" } = req.query;

    const sql = `
        SELECT
            c.conversation_id,
            c.post_id,
            c.buyer_id,
            c.seller_id,
            c.status,
            c.last_message_at,
            p.name AS post_title,
            p.price AS post_price,
            buyer.fname AS buyer_fname,
            buyer.lname AS buyer_lname,
            seller.fname AS seller_fname,
            seller.lname AS seller_lname,
            (
                SELECT m.body
                FROM messages m
                WHERE m.conversation_id = c.conversation_id
                ORDER BY m.created_at DESC
                LIMIT 1
            ) AS last_message,
            (
                SELECT COUNT(*)
                FROM messages m
                WHERE m.conversation_id = c.conversation_id
                  AND m.created_at > COALESCE(
                      (SELECT crs.last_read_at
                       FROM conversation_read_status crs
                       WHERE crs.conversation_id = c.conversation_id
                         AND crs.user_id = ?),
                      '1970-01-01'
                  )
                  AND m.sender_id != ?
            ) AS unread_count,
            (
                SELECT i.image_text_data
                FROM images i
                WHERE i.post_id = c.post_id
                ORDER BY i.image_id ASC
                LIMIT 1
            ) AS post_thumbnail
        FROM conversations c
        JOIN users buyer ON buyer.user_id = c.buyer_id
        JOIN users seller ON seller.user_id = c.seller_id
        JOIN posts p ON p.post_id = c.post_id
        WHERE (c.buyer_id = ? OR c.seller_id = ?)
          AND c.status = ?
        ORDER BY c.last_message_at DESC
    `;

    db.query(sql, [userId, userId, userId, userId, status], (err, rows) => {
        if (err) {
            console.error("getConversations error:", err);
            return res.status(500).json({ error: "Database error" });
        }

        const conversations = rows.map((row) => ({
            conversation_id: row.conversation_id,
            post_id: row.post_id,
            post_title: row.post_title,
            post_price: row.post_price,
            post_thumbnail: row.post_thumbnail && Buffer.isBuffer(row.post_thumbnail)
                ? row.post_thumbnail.toString("base64")
                : null,
            buyer: { id: row.buyer_id, fname: row.buyer_fname, lname: row.buyer_lname },
            seller: { id: row.seller_id, fname: row.seller_fname, lname: row.seller_lname },
            other_user: row.buyer_id === userId
                ? { id: row.seller_id, fname: row.seller_fname, lname: row.seller_lname }
                : { id: row.buyer_id, fname: row.buyer_fname, lname: row.buyer_lname },
            status: row.status,
            last_message: row.last_message,
            last_message_at: row.last_message_at,
            unread_count: row.unread_count,
        }));

        return res.json({ conversations });
    });
};

// POST /api/messages/conversations
export const createConversation = (req, res) => {
    const buyerId = req.user.id;
    const { postId } = req.body;

    if (!postId) {
        return res.status(400).json({ error: "postId is required" });
    }

    // Check if conversation already exists
    const checkSql = "SELECT conversation_id FROM conversations WHERE post_id = ? AND buyer_id = ?";

    db.query(checkSql, [postId, buyerId], (err, rows) => {
        if (err) {
            console.error("createConversation check error:", err);
            return res.status(500).json({ error: "Database error" });
        }

        if (rows.length > 0) {
            return res.json({ conversation_id: rows[0].conversation_id, existing: true });
        }

        // Get the post owner
        const postSql = "SELECT user_id FROM posts WHERE post_id = ?";

        db.query(postSql, [postId], (postErr, postRows) => {
            if (postErr) {
                console.error("createConversation post lookup error:", postErr);
                return res.status(500).json({ error: "Database error" });
            }

            if (postRows.length === 0) {
                return res.status(404).json({ error: "Post not found" });
            }

            const sellerId = postRows[0].user_id;

            if (sellerId === buyerId) {
                return res.status(400).json({ error: "You cannot message yourself" });
            }

            const insertSql = `
                INSERT INTO conversations (post_id, buyer_id, seller_id)
                VALUES (?, ?, ?)
            `;

            db.query(insertSql, [postId, buyerId, sellerId], (insErr, result) => {
                if (insErr) {
                    console.error("createConversation insert error:", insErr);
                    return res.status(500).json({ error: "Failed to create conversation" });
                }

                return res.status(201).json({ conversation_id: result.insertId, existing: false });
            });
        });
    });
};

// GET /api/messages/conversations/:id
export const getMessages = (req, res) => {
    const userId = req.user.id;
    const { id } = req.params;
    const { before, limit = 30 } = req.query;

    let lim = parseInt(limit, 10);
    if (isNaN(lim) || lim <= 0) lim = 30;
    if (lim > 100) lim = 100;

    // Verify user is part of this conversation
    const checkSql = "SELECT conversation_id, post_id, buyer_id, seller_id, status FROM conversations WHERE conversation_id = ? AND (buyer_id = ? OR seller_id = ?)";

    db.query(checkSql, [id, userId, userId], (err, convRows) => {
        if (err) {
            console.error("getMessages check error:", err);
            return res.status(500).json({ error: "Database error" });
        }

        if (convRows.length === 0) {
            return res.status(404).json({ error: "Conversation not found" });
        }

        const conv = convRows[0];

        // Update read status
        const upsertReadSql = `
            INSERT INTO conversation_read_status (conversation_id, user_id, last_read_at)
            VALUES (?, ?, NOW())
            ON DUPLICATE KEY UPDATE last_read_at = NOW()
        `;

        db.query(upsertReadSql, [id, userId], (readErr) => {
            if (readErr) {
                console.error("getMessages read status error:", readErr);
            }
        });

        // Get messages
        let msgSql;
        const params = [parseInt(id, 10)];

        if (before) {
            msgSql = `
                SELECT m.message_id, m.sender_id, m.body, m.created_at,
                       u.fname AS sender_fname, u.lname AS sender_lname
                FROM messages m
                JOIN users u ON u.user_id = m.sender_id
                WHERE m.conversation_id = ? AND m.message_id < ?
                ORDER BY m.created_at DESC
                LIMIT ?
            `;
            params.push(parseInt(before, 10), lim);
        } else {
            msgSql = `
                SELECT m.message_id, m.sender_id, m.body, m.created_at,
                       u.fname AS sender_fname, u.lname AS sender_lname
                FROM messages m
                JOIN users u ON u.user_id = m.sender_id
                WHERE m.conversation_id = ?
                ORDER BY m.created_at DESC
                LIMIT ?
            `;
            params.push(lim);
        }

        db.query(msgSql, params, (msgErr, msgRows) => {
            if (msgErr) {
                console.error("getMessages query error:", msgErr);
                return res.status(500).json({ error: "Database error" });
            }

            // Get post info for header
            const postSql = "SELECT name, price FROM posts WHERE post_id = ?";

            db.query(postSql, [conv.post_id], (postErr, postRows) => {
                const postInfo = postRows?.[0] || {};

                return res.json({
                    conversation: {
                        id: conv.conversation_id,
                        post_id: conv.post_id,
                        post_title: postInfo.name,
                        post_price: postInfo.price,
                        buyer_id: conv.buyer_id,
                        seller_id: conv.seller_id,
                        status: conv.status,
                    },
                    messages: msgRows.reverse(),
                    hasMore: msgRows.length === lim,
                });
            });
        });
    });
};

// POST /api/messages/conversations/:id
export const sendMessage = (req, res) => {
    const userId = req.user.id;
    const { id } = req.params;
    const { body } = req.body;

    if (!body || !body.trim()) {
        return res.status(400).json({ error: "Message body is required" });
    }

    // Verify user is part of conversation and it's active
    const checkSql = "SELECT conversation_id, buyer_id, seller_id, status FROM conversations WHERE conversation_id = ? AND (buyer_id = ? OR seller_id = ?)";

    db.query(checkSql, [id, userId, userId], (err, convRows) => {
        if (err) {
            console.error("sendMessage check error:", err);
            return res.status(500).json({ error: "Database error" });
        }

        if (convRows.length === 0) {
            return res.status(404).json({ error: "Conversation not found" });
        }

        if (convRows[0].status === "archived") {
            return res.status(400).json({ error: "This conversation has been archived" });
        }

        const conv = convRows[0];
        const recipientId = conv.buyer_id === userId ? conv.seller_id : conv.buyer_id;

        const insertSql = "INSERT INTO messages (conversation_id, sender_id, body) VALUES (?, ?, ?)";

        db.query(insertSql, [id, userId, body.trim()], (insErr, result) => {
            if (insErr) {
                console.error("sendMessage insert error:", insErr);
                return res.status(500).json({ error: "Failed to send message" });
            }

            // Update last_message_at
            db.query(
                "UPDATE conversations SET last_message_at = NOW() WHERE conversation_id = ?",
                [id]
            );

            // Update sender's read status
            db.query(
                `INSERT INTO conversation_read_status (conversation_id, user_id, last_read_at)
                 VALUES (?, ?, NOW())
                 ON DUPLICATE KEY UPDATE last_read_at = NOW()`,
                [id, userId]
            );

            const message = {
                message_id: result.insertId,
                conversation_id: parseInt(id, 10),
                sender_id: userId,
                body: body.trim(),
                created_at: new Date(),
            };

            // Get sender name for socket emission
            db.query("SELECT fname, lname FROM users WHERE user_id = ?", [userId], (nameErr, nameRows) => {
                if (nameRows?.[0]) {
                    message.sender_fname = nameRows[0].fname;
                    message.sender_lname = nameRows[0].lname;
                }

                // Emit via Socket.io
                const recipientSocketId = getSocketId(recipientId);
                if (recipientSocketId && io) {
                    io.to(recipientSocketId).emit("new_message", message);
                }

                return res.status(201).json({ message });
            });
        });
    });
};

// PATCH /api/messages/conversations/:id/archive
export const archiveConversation = (req, res) => {
    const userId = req.user.id;
    const { id } = req.params;

    const checkSql = "SELECT conversation_id, buyer_id, seller_id FROM conversations WHERE conversation_id = ? AND (buyer_id = ? OR seller_id = ?)";

    db.query(checkSql, [id, userId, userId], (err, rows) => {
        if (err) {
            console.error("archiveConversation check error:", err);
            return res.status(500).json({ error: "Database error" });
        }

        if (rows.length === 0) {
            return res.status(404).json({ error: "Conversation not found" });
        }

        const conv = rows[0];
        const recipientId = conv.buyer_id === userId ? conv.seller_id : conv.buyer_id;

        const updateSql = "UPDATE conversations SET status = 'archived', archived_by = ? WHERE conversation_id = ?";

        db.query(updateSql, [userId, id], (upErr) => {
            if (upErr) {
                console.error("archiveConversation update error:", upErr);
                return res.status(500).json({ error: "Failed to archive conversation" });
            }

            // Notify other user via socket
            const recipientSocketId = getSocketId(recipientId);
            if (recipientSocketId && io) {
                io.to(recipientSocketId).emit("conversation_archived", {
                    conversation_id: parseInt(id, 10),
                });
            }

            return res.json({ success: true, message: "Conversation archived" });
        });
    });
};