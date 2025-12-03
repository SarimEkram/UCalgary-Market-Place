import db from "../../config/db.js";

/**
 * GET /api/admin/recent-actions?adminId=1
 * Fetches admin profile information and recent admin actions
 * Returns admin profile (fname, lname, email) and actions array
 */
export const getRecentAdminActions = (req, res) => {
    const { adminId } = req.query;

    if (!adminId) {
        return res.status(400).json({ error: "Admin ID is required" });
    }

    const adminIdNum = parseInt(adminId, 10);
    if (Number.isNaN(adminIdNum)) {
        return res.status(400).json({ error: "Admin ID must be a number" });
    }

    // First, get admin profile info
    const adminSql = `
        SELECT admin_id, fname, lname, email
        FROM admins
        WHERE admin_id = ?
    `;

    db.query(adminSql, [adminIdNum], (adminErr, adminRows) => {
        if (adminErr) {
            console.error("[getRecentAdminActions] DB error (admin query):", adminErr);
            return res.status(500).json({ error: "Database error" });
        }

        if (adminRows.length === 0) {
            return res.status(404).json({ error: "Admin not found" });
        }

        const admin = adminRows[0];

        // Then, get recent admin actions
        const actionsSql = `
            SELECT 
                action,
                action_timestamp AS date
            FROM admin_actions
            WHERE admin_id = ?
            ORDER BY action_timestamp DESC
            LIMIT 50
        `;

        db.query(actionsSql, [adminIdNum], (actionsErr, actionsRows) => {
            if (actionsErr) {
                console.error("[getRecentAdminActions] DB error (actions query):", actionsErr);
                return res.status(500).json({ error: "Database error fetching actions" });
            }

            // Process actions 
            const actions = [];
            let processedCount = 0;
            const totalActions = actionsRows.length;
            let responseSent = false;

            if (totalActions === 0) {
                // No actions to process, return empty array
                return res.status(200).json({
                    admin: {
                        id: admin.admin_id,
                        fname: admin.fname,
                        lname: admin.lname,
                        email: admin.email,
                    },
                    actions: [],
                });
            }

            actionsRows.forEach((row, index) => {
                let actionText = row.action;

                // Check if this is a "View User Profile" action with descriptions
                if (actionText.includes("Viewed user profile") && actionText.includes("with posts:")) {
                    // Extract post descriptions from action text
                    const postsMatch = actionText.match(/with posts: (.+)$/);
                    if (postsMatch) {
                        const postDescriptions = postsMatch[1]
                            .split(',')
                            .map(p => p.trim().replace(/^"/g, '').replace(/"$/g, ''));

                        // Look up correct post titles for each description
                        const postTitles = [];
                        let titleLookupCount = 0;

                        if (postDescriptions.length === 0) {
                            // No posts to look up, use original action text
                            actions[index] = {
                                date: row.date,
                                action: actionText,
                            };
                            processedCount++;
                            if (processedCount === totalActions) {
                                sendResponse();
                            }
                        } else {
                            postDescriptions.forEach((description, descIndex) => {
                                const findTitleSql = `
                                    SELECT p.name 
                                    FROM posts p 
                                    WHERE p.description = ? 
                                    LIMIT 1
                                `;
                                db.query(findTitleSql, [description], (titleErr, titleRows) => {
                                    titleLookupCount++;
                                    
                                    if (!titleErr && titleRows.length > 0) {
                                        postTitles[descIndex] = titleRows[0].name;
                                    } else {
                                        postTitles[descIndex] = description; // Fallback to original if not found
                                    }

                                    // When all titles are looked up, update the action text
                                    if (titleLookupCount === postDescriptions.length) {
                                        const correctedPostList = postTitles.map(title => `"${title}"`).join(", ");
                                        actionText = actionText.replace(/with posts: .+$/, `with posts: ${correctedPostList}`);
                                        
                                        actions[index] = {
                                            date: row.date,
                                            action: actionText,
                                        };
                                        processedCount++;
                                        if (processedCount === totalActions) {
                                            sendResponse();
                                        }
                                    }
                                });
                            });
                        }
                    } else {
                        // No posts match found, use original action text
                        actions[index] = {
                            date: row.date,
                            action: actionText,
                        };
                        processedCount++;
                        if (processedCount === totalActions) {
                            sendResponse();
                        }
                    }
                } else {
                    // Not a "View User Profile" action, use original text
                    actions[index] = {
                        date: row.date,
                        action: actionText,
                    };
                    processedCount++;
                    if (processedCount === totalActions) {
                        sendResponse();
                    }
                }
            });

            // Helper function to send response when all actions are processed
            function sendResponse() {
                if (!responseSent) {
                    responseSent = true;
                    res.status(200).json({
                        admin: {
                            id: admin.admin_id,
                            fname: admin.fname,
                            lname: admin.lname,
                            email: admin.email,
                        },
                        actions: actions,
                    });
                }
            }
        });
    });
};