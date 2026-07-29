import db from "../../config/db.js";
import { promisePool } from "../../config/db.js";

export const createReport = async (req, res) => {
    const reporterId = req.user.id;
    let { reportType, reason, postId, reportedUserId } = req.body;

    if (!reporterId || !reportType || !reason) {
        return res.status(400).json({ error: "reporterId, reportType, and reason are required" });
    }

    if (reportType !== "user" && reportType !== "post") {
        return res.status(400).json({ error: "reportType must be either 'user' or 'post'" });
    }

    if (reportType === "user" && (!reportedUserId || reportedUserId === null) && postId) {
        const [rows] = await promisePool.query("SELECT post_type FROM posts WHERE post_id = ?", [postId]);
        if (rows.length === 0) {
            return res.status(404).json({ error: "Post not found" });
        }
        if (rows[0].post_type === "event") {
            reportType = "post";
        } else {
            return res.status(400).json({ error: "reportedUserId is required when reportType is 'user'" });
        }
    }

    if (reportType === "post" && !postId) {
        return res.status(400).json({ error: "postId is required when reportType is 'post'" });
    }
    if (reportType === "user" && (!reportedUserId || reportedUserId === null)) {
        return res.status(400).json({ error: "reportedUserId is required when reportType is 'user'" });
    }

    const conn = await promisePool.getConnection();

    try {
        await conn.beginTransaction();

        const [reportResult] = await conn.query(
            "INSERT INTO reports (reporter_id, report_type, reason) VALUES (?, ?, ?)",
            [reporterId, reportType, reason]
        );
        const reportId = reportResult.insertId;

        if (reportType === "post") {
            await conn.query(
                "INSERT INTO post_report (report_id, post_id) VALUES (?, ?)",
                [reportId, postId]
            );
        } else {
            await conn.query(
                "INSERT INTO user_report (report_id, reported_user_id) VALUES (?, ?)",
                [reportId, reportedUserId]
            );
        }

        await conn.commit();
        return res.status(201).json({
            success: true,
            message: `${reportType === "post" ? "Post" : "User"} report created successfully`,
            reportId,
        });
    } catch (err) {
        await conn.rollback();
        console.error("DB error (createReport):", err);
        return res.status(500).json({ error: "Failed to create report" });
    } finally {
        conn.release();
    }
};