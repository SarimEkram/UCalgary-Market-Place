import db from "../../config/db.js";
import bcrypt from "bcryptjs";

export const updateUserInfo = (req, res) => {
    const { email, fname, lname, newPassword } = req.body;

    if (!email) {
        return res
            .status(400)
            .json({ success: false, error: "Email is required" });
    }

    // dynamic because theres no reason no write multiple sql queries
    const updates = [];
    const params = [];

    if (fname && fname.trim() !== "") {
        updates.push("fname = ?");
        params.push(fname.trim());
    }

    if (lname && lname.trim() !== "") {
        updates.push("lname = ?");
        params.push(lname.trim());
    }

    // Helper that actually runs the UPDATE once we know all fields
    const runUpdate = () => {
        if (updates.length === 0) {
            return res.status(400).json({
                success: false,
                error: "No changes provided",
            });
        }

        const sql = `
      UPDATE users
      SET ${updates.join(", ")}
      WHERE email = ?
    `;

        params.push(email);

        db.query(sql, params, (err, result) => {
            if (err) {

                return res
                    .status(500)
                    .json({ success: false, error: "Failed to update user info" });
            }

            if (result.affectedRows === 0) {
                return res
                    .status(404)
                    .json({ success: false, error: "User not found" });
            }

            return res.status(200).json({
                success: true,
                message: "User info updated successfully",
            });
        });
    };

    // If password is provided, hash it first, then runUpdate
    if (newPassword && newPassword.trim() !== "") {
        bcrypt.hash(newPassword.trim(), 10, (hashErr, hashed) => {
            if (hashErr) {

                return res
                    .status(500)
                    .json({ success: false, error: "Password hashing failed" });
            }

            updates.push("hashed_password = ?");
            params.push(hashed);

            runUpdate();
        });
    } else {
        // No password change, just update names (if provided)
        runUpdate();
    }
};
