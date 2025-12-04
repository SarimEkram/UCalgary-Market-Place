import db from "../../config/db.js";
import bcrypt from "bcryptjs";

export const updateUserInfo = (req, res) => {
    const { email, fname, lname, newPassword } = req.body;

    if (!email) {
        return res
            .status(400)
            .json({ success: false, error: "Email is required" });
    }

    const updates = [];
    const baseParams = [];

    if (fname && fname.trim() !== "") {
        updates.push("fname = ?");
        baseParams.push(fname.trim());
    }

    if (lname && lname.trim() !== "") {
        updates.push("lname = ?");
        baseParams.push(lname.trim());
    }

    const runUpdateForTable = (tableName, callback) => {
        if (updates.length === 0) {
            return res.status(400).json({
                success: false,
                error: "No changes provided",
            });
        }

        const sql = `
            UPDATE ${tableName}
            SET ${updates.join(", ")}
            WHERE email = ?
        `;

        const params = [...baseParams, email]; // fresh copy per call

        db.query(sql, params, callback);
    };

    const proceed = () => {
        // 1) admins first
        runUpdateForTable("admins", (err, result) => {
            if (err) {
                console.error("DB error (update admin info):", err);
                return res
                    .status(500)
                    .json({ success: false, error: "Failed to update user info" });
            }

            if (result.affectedRows > 0) {
                // updated an admin
                return res.status(200).json({
                    success: true,
                    message: "User info updated successfully",
                });
            }

            // 2) if not in admins, try users
            runUpdateForTable("users", (err2, result2) => {
                if (err2) {
                    console.error("DB error (update user info):", err2);
                    return res
                        .status(500)
                        .json({ success: false, error: "Failed to update user info" });
                }

                if (result2.affectedRows === 0) {
                    return res
                        .status(404)
                        .json({ success: false, error: "User not found" });
                }

                return res.status(200).json({
                    success: true,
                    message: "User info updated successfully",
                });
            });
        });
    };

    // If password is provided, hash it first, then run updates
    if (newPassword && newPassword.trim() !== "") {
        bcrypt.hash(newPassword.trim(), 10, (hashErr, hashed) => {
            if (hashErr) {
                console.error("bcrypt error (settings):", hashErr);
                return res
                    .status(500)
                    .json({ success: false, error: "Password hashing failed" });
            }

            updates.push("hashed_password = ?");
            baseParams.push(hashed);

            proceed();
        });
    } else {
        proceed();
    }
};
