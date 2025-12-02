// backend/src/controller/reportController/reportController.js
import db from "../../config/db.js";

/**
 * POST /api/report
 * Body: { reporterId, reportType, reason, postId (if reportType='post'), reportedUserId (if reportType='user') }
 * Creates a report entry in the database
 */
export const createReport = (req, res) => {
    let { reporterId, reportType, reason, postId, reportedUserId } = req.body;

    // Validation
    if (!reporterId || !reportType || !reason) {
        return res.status(400).json({
            error: "reporterId, reportType, and reason are required"
        });
    }

    // Validate reportType
    if (reportType !== 'user' && reportType !== 'post') {
        return res.status(400).json({
            error: "reportType must be either 'user' or 'post'"
        });
    }

    // Special handling for events: if reportType is 'user' but reportedUserId is null/undefined
    // and we have a postId, check if it's an event and convert to post report
    if (reportType === 'user' && (!reportedUserId || reportedUserId === null) && postId) {
        // Check if the post is an event
        const checkEventQuery = `
            SELECT post_type 
            FROM posts 
            WHERE post_id = ?
        `;
        
        db.query(checkEventQuery, [postId], (err, rows) => {
            if (err) {
                console.error("DB error (createReport - check event):", err);
                return res.status(500).json({
                    error: "Failed to verify post type"
                });
            }

            if (rows.length === 0) {
                return res.status(404).json({
                    error: "Post not found"
                });
            }

            // If it's an event, convert to post report
            if (rows[0].post_type === 'event') {
                reportType = 'post';
                // Continue with post report flow
                proceedWithReport();
            } else {
                // For market posts, reportedUserId is required
                return res.status(400).json({
                    error: "reportedUserId is required when reportType is 'user'"
                });
            }
        });
        return; // Exit early, proceedWithReport will be called from the callback if it's an event
    }

    // Normal validation flow (when reportType is 'post' or when reportType is 'user' with valid reportedUserId)
    proceedWithReport();

    function proceedWithReport() {
        // Validate based on report type
        if (reportType === 'post' && !postId) {
            return res.status(400).json({
                error: "postId is required when reportType is 'post'"
            });
        }

        if (reportType === 'user' && (!reportedUserId || reportedUserId === null)) {
            return res.status(400).json({
                error: "reportedUserId is required when reportType is 'user'"
            });
        }

        // Step 1: Insert into reports table
        const insertReportQuery = `
            INSERT INTO reports (reporter_id, report_type, reason)
            VALUES (?, ?, ?)
        `;

        db.query(
            insertReportQuery,
            [reporterId, reportType, reason],
            (err, result) => {
            if (err) {
                console.error("DB error (createReport - insert reports):", err);
                return res.status(500).json({
                    error: "Failed to create report"
                });
            }

            const reportId = result.insertId;

            // Step 2: Insert into appropriate report table (post_report or user_report)
            if (reportType === 'post') {
                const insertPostReportQuery = `
                    INSERT INTO post_report (report_id, post_id)
                    VALUES (?, ?)
                `;

                db.query(
                    insertPostReportQuery,
                    [reportId, postId],
                    (err2) => {
                        if (err2) {
                            console.error("DB error (createReport - insert post_report):", err2);
                            // Clean up the main report entry if post_report insert fails
                            db.query("DELETE FROM reports WHERE report_id = ?", [reportId], () => {});
                            return res.status(500).json({
                                error: "Failed to create post report"
                            });
                        }

                        return res.status(201).json({
                            success: true,
                            message: "Post report created successfully",
                            reportId: reportId
                        });
                    }
                );
            } else {
                // reportType === 'user'
                const insertUserReportQuery = `
                    INSERT INTO user_report (report_id, reported_user_id)
                    VALUES (?, ?)
                `;

                db.query(
                    insertUserReportQuery,
                    [reportId, reportedUserId],
                    (err2) => {
                        if (err2) {
                            console.error("DB error (createReport - insert user_report):", err2);
                            // Clean up the main report entry if user_report insert fails
                            db.query("DELETE FROM reports WHERE report_id = ?", [reportId], () => {});
                            return res.status(500).json({
                                error: "Failed to create user report"
                            });
                        }

                        return res.status(201).json({
                            success: true,
                            message: "User report created successfully",
                            reportId: reportId
                        });
                    }
                );
            }
        }
    );
    }
};
