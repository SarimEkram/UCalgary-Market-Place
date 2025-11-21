import db from "../../config/db.js";
import bcrypt from "bcryptjs";

const generateVerificationCode = () => {
    const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let code = "";
    for (let i = 0; i < 8; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
};

const getExpirationTime = () => {
    const expirationDate = new Date();
    expirationDate.setMinutes(expirationDate.getMinutes() + 5);
    return expirationDate.toTimeString().substring(0, 8);
};

export const forgotPassword = (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res
            .status(400)
            .json({ success: false, error: "Email is required" });
    }

    const createAndStoreCode = () => {
        const code = generateVerificationCode();
        const expirationTime = getExpirationTime();

        const insertQuery =
            "INSERT INTO verification_codes (randomCode, expiration_date) VALUES (?, ?)";

        db.query(insertQuery, [code, expirationTime], (err) => {
            if (err) {
                console.error("DB error (insert reset code):", err);
                return res
                    .status(500)
                    .json({ success: false, error: "Failed to generate reset code" });
            }
            // remove later
            console.log(`Password reset code for ${email}: ${code}`);

            return res.status(200).json({
                success: true,
                message: "Reset code generated. Please check your email.",
            });
        });
    };

    const adminQuery = "SELECT admin_id FROM admins WHERE email = ?";
    db.query(adminQuery, [email], (err, adminRows) => {
        if (err) {
            //remove later
            console.error("DB error (forgot/admin):", err);
            return res
                .status(500)
                .json({ success: false, error: "Database error" });
        }

        if (adminRows.length > 0) {
            return createAndStoreCode();
        }

        const userQuery = "SELECT user_id FROM users WHERE email = ?";
        db.query(userQuery, [email], (err2, userRows) => {
            if (err2) {
                console.error("DB error (forgot/users):", err2);
                return res
                    .status(500)
                    .json({ success: false, error: "Database error" });
            }

            if (userRows.length === 0) {
                return res.status(404).json({
                    success: false,
                    error: "Account with this email does not exist",
                });
            }

            return createAndStoreCode();
        });
    });
};

export const verifyResetCode = (req, res) => {
    const { code } = req.body;

    if (!code) {
        return res.status(400).json({
            success: false,
            isValid: false,
            error: "Verification code is required",
        });
    }

    const normalizedCode = code.toUpperCase();

    const verifyQuery = `
    SELECT randomCode
    FROM verification_codes
    WHERE randomCode = ? AND expiration_date > CURTIME()
  `;

    db.query(verifyQuery, [normalizedCode], (err, rows) => {
        if (err) {
            console.error("DB error (verify reset code):", err);
            return res
                .status(500)
                .json({ success: false, isValid: false, error: "Database error" });
        };

        if (rows.length === 0) {
            return res.status(400).json({
                success: false,
                isValid: false,
                error: "Invalid or expired verification code",
            });
        }

        return res.status(200).json({
            success: true,
            isValid: true,
            message: "Verification code is valid",
        });
    });
};

export const resetPassword = (req, res) => {
    const { email, code, newPassword } = req.body;

    if (!email || !code || !newPassword) {
        return res.status(400).json({
            success: false,
            error: "Email, code and new password are required",
        });
    }

    const normalizedCode = code.toUpperCase();

    const verifyQuery = `
    SELECT randomCode
    FROM verification_codes
    WHERE randomCode = ? AND expiration_date > CURTIME()
  `;

    const deleteCode = () => {
        const deleteQuery = "DELETE FROM verification_codes WHERE randomCode = ?";
        db.query(deleteQuery, [normalizedCode], (err) => {
            if (err) {
                console.error("DB error (delete reset code):", err);
            }
        });
    };

    const updateAdminPassword = () => {
        bcrypt.hash(newPassword, 10, (hashErr, hashed) => {
            if (hashErr) {
                console.error("bcrypt error (reset/admin):", hashErr);
                return res
                    .status(500)
                    .json({ success: false, error: "Password hashing failed" });
            }

            const updateQuery =
                "UPDATE admins SET hashed_password = ? WHERE email = ?";

            db.query(updateQuery, [hashed, email], (err) => {
                if (err) {
                    console.error("DB error (update admin password):", err);
                    return res
                        .status(500)
                        .json({ success: false, error: "Failed to update password" });
                }

                deleteCode();
                return res.status(200).json({
                    success: true,
                    message: "Password updated successfully",
                });
            });
        });
    };

    const updateUserPassword = () => {
        bcrypt.hash(newPassword, 10, (hashErr, hashed) => {
            if (hashErr) {
                console.error("bcrypt error (reset/user):", hashErr);
                return res
                    .status(500)
                    .json({ success: false, error: "Password hashing failed" });
            }

            const updateQuery =
                "UPDATE users SET hashed_password = ? WHERE email = ?";

            db.query(updateQuery, [hashed, email], (err) => {
                if (err) {
                    console.error("DB error (update user password):", err);
                    return res
                        .status(500)
                        .json({ success: false, error: "Failed to update password" });
                }

                deleteCode();
                return res.status(200).json({
                    success: true,
                    message: "Password updated successfully",
                });
            });
        });
    };

    db.query(verifyQuery, [normalizedCode], (err, codeRows) => {
        if (err) {
            console.error("DB error (reset/verify code):", err);
            return res
                .status(500)
                .json({ success: false, error: "Database error" });
        }

        if (codeRows.length === 0) {
            return res.status(400).json({
                success: false,
                error: "Invalid or expired verification code",
            });
        }

        const adminQuery = "SELECT admin_id FROM admins WHERE email = ?";
        db.query(adminQuery, [email], (err2, adminRows) => {
            if (err2) {
                console.error("DB error (reset/admin lookup):", err2);
                return res
                    .status(500)
                    .json({ success: false, error: "Database error" });
            }

            if (adminRows.length > 0) {
                return updateAdminPassword();
            }

            const userQuery = "SELECT user_id FROM users WHERE email = ?";
            db.query(userQuery, [email], (err3, userRows) => {
                if (err3) {
                    console.error("DB error (reset/user lookup):", err3);
                    return res
                        .status(500)
                        .json({ success: false, error: "Database error" });
                }

                if (userRows.length === 0) {
                    return res.status(404).json({
                        success: false,
                        error: "Account with this email does not exist",
                    });
                }

                return updateUserPassword();
            });
        });
    });
};
