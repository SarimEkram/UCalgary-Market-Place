import db from "../../config/db.js";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// Allowed email domain (e.g., @ucalgary.ca)
const ALLOWED_DOMAIN = "@ucalgary.ca";

/**
 * Nodemailer transporter using Gmail + app password
 */
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

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

    // 1) Basic checks
    if (!email) {
        return res.status(400).json({ error: "Email is required" });
    }

    if (!email.endsWith(ALLOWED_DOMAIN)) {
        return res
            .status(400)
            .json({ error: `Email must be from ${ALLOWED_DOMAIN} domain` });
    }

    // 2) Check if user already exists
    const checkUserQuery = "SELECT user_id FROM users WHERE email = ?";
    db.query(checkUserQuery, [email], (err, userResults) => {
        if (err) {
            console.error("Error checking existing user:", err);
            return res.status(500).json({ error: "Database error" });
        }

        if (userResults.length > 0) {
            return res
                .status(409)
                .json({ error: "User with this email already exists" });
        }

        // 3) Generate a unique verification code
        const generateUniqueCode = (callback) => {
            const code = generateVerificationCode();

            const checkCodeQuery =
                "SELECT randomCode FROM verification_codes WHERE randomCode = ?";
            db.query(checkCodeQuery, [code], (err2, codeResults) => {
                if (err2) {
                    console.error("Error checking verification code:", err2);
                    return callback(err2, null);
                }

                if (codeResults.length > 0) {
                    // Code already in use, try again
                    return generateUniqueCode(callback);
                }

                // Code is unique
                callback(null, code);
            });
        };

        generateUniqueCode((codeErr, verificationCode) => {
            if (codeErr) {
                return res.status(500).json({ error: "Database error" });
            }

            // 4) Compute expiration time (5 minutes from now)
            const expirationDate = new Date();
            expirationDate.setMinutes(expirationDate.getMinutes() + 5);
            const expirationTime = expirationDate
                .toTimeString()
                .substring(0, 8); // HH:MM:SS

            const insertCodeQuery =
                "INSERT INTO verification_codes (randomCode, expiration_date) VALUES (?, ?)";

            // 5) Store code in DB
            db.query(
                insertCodeQuery,
                [verificationCode, expirationTime],
                (insertErr) => {
                    if (insertErr) {
                        console.error("Error storing verification code:", insertErr);
                        return res
                            .status(500)
                            .json({ error: "Failed to generate verification code" });
                    }

                    // 6) Send email with code
                    const mailOptions = {
                        from: process.env.EMAIL_USER,
                        to: email,
                        subject: "Your Marketplace Verification Code",
                        text: `Your verification code is: ${verificationCode}\n\nThis code will expire in 5 minutes.`,
                    };

                    transporter.sendMail(mailOptions, (mailErr, info) => {
                        if (mailErr) {
                            console.error("Error sending verification email:", mailErr);
                            return res.status(500).json({
                                error: "Failed to send verification email",
                            });
                        }

                        console.log("Verification email sent:", info.response);
                        return res.status(200).json({
                            message: "Verification code sent successfully",
                        });
                    });
                }
            );
        });
    });
};

/**
 * POST /api/registration/verify-code
 * Body: { code }
 */
export const verifyCode = (req, res) => {
    const { code } = req.body;

    if (!code) {
        return res
            .status(400)
            .json({ error: "Verification code is required", isValid: false });
    }

    const normalizedCode = code.toUpperCase();

    const verifyQuery = `
    SELECT randomCode
    FROM verification_codes
    WHERE randomCode = ? AND expiration_date > CURTIME()
  `;

    db.query(verifyQuery, [normalizedCode], (err, results) => {
        if (err) {
            console.error("Error verifying code:", err);
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

    // 1) Basic checks
    if (!email || !password || !firstName || !lastName || !code) {
        return res.status(400).json({ error: "All fields are required" });
    }

    if (!email.endsWith(ALLOWED_DOMAIN)) {
        return res
            .status(400)
            .json({ error: `Email must be from ${ALLOWED_DOMAIN} domain` });
    }

    const normalizedCode = code.toUpperCase();

    // 2) Check that code exists and not expired
    const verifyQuery = `
    SELECT randomCode
    FROM verification_codes
    WHERE randomCode = ? AND expiration_date > CURTIME()
  `;

    db.query(verifyQuery, [normalizedCode], (err, codeResults) => {
        if (err) {
            console.error("Error verifying code:", err);
            return res.status(500).json({ error: "Database error" });
        }

        if (codeResults.length === 0) {
            return res
                .status(400)
                .json({ error: "Invalid or expired verification code" });
        }

        // 3) Check if user already exists
        const checkUserQuery = "SELECT user_id FROM users WHERE email = ?";
        db.query(checkUserQuery, [email], (err2, userResults) => {
            if (err2) {
                console.error("Error checking existing user:", err2);
                return res.status(500).json({ error: "Database error" });
            }

            if (userResults.length > 0) {
                return res
                    .status(409)
                    .json({ error: "User with this email already exists" });
            }

            // 4) Hash password
            const hashedPassword = hashPassword(password);

            // 5) Insert new user
            const insertUserQuery = `
        INSERT INTO users (email, fname, lname, hashed_password)
        VALUES (?, ?, ?, ?)
      `;

            db.query(
                insertUserQuery,
                [email, firstName, lastName, hashedPassword],
                (insertErr, result) => {
                    if (insertErr) {
                        console.error("Error creating user:", insertErr);

                        if (insertErr.code === "ER_DUP_ENTRY") {
                            return res
                                .status(409)
                                .json({ error: "User with this email already exists" });
                        }

                        return res
                            .status(500)
                            .json({ error: "Failed to create user account" });
                    }

                    // 6) Delete used verification code (best-effort)
                    const deleteCodeQuery =
                        "DELETE FROM verification_codes WHERE randomCode = ?";
                    db.query(deleteCodeQuery, [normalizedCode], (deleteErr) => {
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
};
