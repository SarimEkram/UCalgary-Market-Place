import db from "../../config/db.js";
import bcrypt from "bcryptjs";

export const login = (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
    }

    const verifyPasswordAndRespond = (row, roleLabel) => {
        bcrypt.compare(password, row.hashed_password, (err, isMatch) => {
            if (err) {

                return res.status(500).json({ error: "Password check failed" });
            }

            if (!isMatch) {
                return res.status(401).json({ error: "Email or password is wrong" });
            }

            return res.json({
                success: true,
                role: roleLabel,
                isAdmin: roleLabel === "admin",
                user: {
                    id: roleLabel === "admin" ? row.admin_id : row.user_id,
                    email: row.email,
                    fname: row.fname,
                    lname: row.lname,
                },
            });
        });
    };

    const adminQuery = "SELECT * FROM admins WHERE email = ?";
    db.query(adminQuery, [email], (err, adminRows) => {
        if (err) {

            return res.status(500).json({ error: "Database error" });
        }

        if (adminRows.length > 0) {
            return verifyPasswordAndRespond(adminRows[0], "admin");
        }

        const userQuery = "SELECT * FROM users WHERE email = ?";
        db.query(userQuery, [email], (err2, userRows) => {
            if (err2) {

                return res.status(500).json({ error: "Database error" });
            }

            if (userRows.length === 0) {
                return res.status(404).json({ error: "User does not exist" });
            }

            return verifyPasswordAndRespond(userRows[0], "user");
        });
    });
};
