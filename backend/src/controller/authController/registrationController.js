import db from "../../config/db.js";
import bcrypt from "bcryptjs";
import transporter from "../../config/mail.js";

const ALLOWED_DOMAIN = "@ucalgary.ca";
const PASSWORD_REGEX = /^(?=.*\d)(?=.*[!@#$%^&*(),.?:{}|<>]).{8,20}$/;


/**
 * Generate a random 8-character uppercase code
 */
function generateVerificationCode() {
    const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let code = "";
    for (let i = 0; i < 8; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
}

/**
 * Hash password using bcryptjs
 */
function hashPassword(password) {
    return bcrypt.hashSync(password, 10);
}

/**
 * POST /api/registration/send-verification
 * Body: { email }
 */
export const sendVerificationEmail = (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ error: "Email is required" });
    }

    if (!email.endsWith(ALLOWED_DOMAIN)) {
        return res
            .status(400)
            .json({ error: `Email must be from ${ALLOWED_DOMAIN} domain` });
    }

    const checkUserQuery = "SELECT user_id FROM users WHERE email = ?";
    db.query(checkUserQuery, [email], (err, userResults) => {
        if (err) {
            return res.status(500).json({ error: "Database error" });
        }

        if (userResults.length > 0) {
            return res
                .status(409)
                .json({ error: "User with this email already exists" });
        }

        const checkBanQuery = "SELECT user_email FROM banned_users WHERE user_email = ?";
        db.query(checkBanQuery, [email], (banErr, banResults) => {
            if (banErr) {
                return res.status(500).json({ error: "Database error" });
            }

            if (banResults.length > 0) {
                return res.status(403).json({ error: "This account has been banned" });
            }

            const generateUniqueCode = (callback) => {
                const code = generateVerificationCode();

                const checkCodeQuery =
                    "SELECT randomCode FROM verification_codes WHERE randomCode = ?";
                db.query(checkCodeQuery, [code], (err2, codeResults) => {
                    if (err2) {
                        return callback(err2, null);
                    }

                    if (codeResults.length > 0) {
                        return generateUniqueCode(callback);
                    }

                    callback(null, code);
                });
            };

            generateUniqueCode((codeErr, verificationCode) => {
                if (codeErr) {
                    return res.status(500).json({ error: "Database error" });
                }

                const expirationDate = new Date();
                expirationDate.setMinutes(expirationDate.getMinutes() + 5);
                const expirationTime = expirationDate
                    .toISOString()
                    .slice(0, 19)
                    .replace("T", " ");

                const insertCodeQuery =
                    "INSERT INTO verification_codes (randomCode, email, expiration_date) VALUES (?, ?, ?)";

                db.query(insertCodeQuery, [verificationCode, email, expirationTime], (insertErr) => {
                    if (insertErr) {
                        return res
                            .status(500)
                            .json({ error: "Failed to generate verification code" });
                    }

                    const mailOptions = {
                        from: process.env.EMAIL_USER,
                        to: email,
                        subject: "Your Marketplace Verification Code",
                        text: `Your verification code is: ${verificationCode}\n\nThis code will expire in 5 minutes.`,
                    };

                    transporter.sendMail(mailOptions, (mailErr, info) => {
                        if (mailErr) {
                            return res.status(500).json({
                                error: "Failed to send verification email",
                            });
                        }

                        return res.status(200).json({
                            message: "Verification code sent successfully",
                        });
                    });
                });
            });
        });
    });
};
/**
 * POST /api/registration/verify-code
 * Body: { code }
 */
export const verifyCode = (req, res) => {
    const { code, email } = req.body;

    if (!code || !email) {
        return res
            .status(400)
            .json({ error: "Verification code and email are required", isValid: false });
    }

    const normalizedCode = code.toUpperCase();

    const verifyQuery = `
        SELECT randomCode
        FROM verification_codes
        WHERE randomCode = ? AND email = ? AND expiration_date > CURTIME()
    `;

    db.query(verifyQuery, [normalizedCode, email], (err, results) => {
        if (err) {

            return res
                .status(500)
                .json({ error: "Database error", isValid: false });
        }

        if (results.length === 0) {
            return res.status(400).json({
                error: "Invalid or expired verification code",
                isValid: false,
            });
        }

        return res.status(200).json({
            message: "Verification code is valid",
            isValid: true,
        });
    });
};

/**
 * POST /api/registration/create-account
 * Body: { email, password, firstName, lastName, code }
 */
export const createAccount = (req, res) => {
    const { email, password, firstName, lastName, code } = req.body;

    if (!email || !password || !firstName || !lastName || !code) {
        return res.status(400).json({ error: "All fields are required" });
    }

    if (!PASSWORD_REGEX.test(password)) {
        return res.status(400).json({
            error: "Password must be 8-20 characters with at least one number and one special character",
        });
    }

    if (!email.endsWith(ALLOWED_DOMAIN)) {
        return res
            .status(400)
            .json({ error: `Email must be from ${ALLOWED_DOMAIN} domain` });
    }

    const normalizedCode = code.toUpperCase();

    const verifyQuery = `
        SELECT randomCode
        FROM verification_codes
        WHERE randomCode = ? AND email = ? AND expiration_date > NOW()
    `;

    db.query(verifyQuery, [normalizedCode, email], (err, codeResults) => {
        if (err) {
            return res.status(500).json({ error: "Database error" });
        }

        if (codeResults.length === 0) {
            return res
                .status(400)
                .json({ error: "Invalid or expired verification code" });
        }

        const checkUserQuery = "SELECT user_id FROM users WHERE email = ?";
        db.query(checkUserQuery, [email], (err2, userResults) => {
            if (err2) {
                return res.status(500).json({ error: "Database error" });
            }

            if (userResults.length > 0) {
                return res
                    .status(409)
                    .json({ error: "User with this email already exists" });
            }

            const checkBanQuery = "SELECT user_email FROM banned_users WHERE user_email = ?";
            db.query(checkBanQuery, [email], (banErr, banResults) => {
                if (banErr) {
                    return res.status(500).json({ error: "Database error" });
                }

                if (banResults.length > 0) {
                    return res.status(403).json({ error: "This account has been banned" });
                }

                const hashedPassword = hashPassword(password);

                const insertUserQuery = `
                    INSERT INTO users (email, fname, lname, hashed_password)
                    VALUES (?, ?, ?, ?)
                `;

                db.query(
                    insertUserQuery,
                    [email, firstName, lastName, hashedPassword],
                    (insertErr, result) => {
                        if (insertErr) {
                            if (insertErr.code === "ER_DUP_ENTRY") {
                                return res
                                    .status(409)
                                    .json({ error: "User with this email already exists" });
                            }

                            return res
                                .status(500)
                                .json({ error: "Failed to create user account" });
                        }

                        const deleteCodeQuery =
                            "DELETE FROM verification_codes WHERE randomCode = ? AND email = ?";
                        db.query(deleteCodeQuery, [normalizedCode, email], (deleteErr) => {
                            if (deleteErr) {
                                console.error(
                                    "Error deleting verification code (non-fatal):",
                                    deleteErr
                                );
                            }
                        });

                        return res.status(201).json({
                            message: "User account created successfully",
                            userId: result.insertId,
                        });
                    }
                );
            });
        });
    });
};
