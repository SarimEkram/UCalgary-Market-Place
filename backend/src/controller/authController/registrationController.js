import db from "../../config/db.js";
import bcrypt from "bcryptjs";

// Allowed email domain (e.g., @ucalgary.ca)
const ALLOWED_DOMAIN = "@ucalgary.ca";

/**
 * Generate a random 8-character uppercase code
 */
function generateVerificationCode() {
  const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let code = '';
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
 * Send verification email
 * POST /api/registration/send-verification
 * Body: { email: string }
 */
export const sendVerificationEmail = (req, res) => {
  const { email } = req.body;

  // Validate email is provided
  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  // Check domain name
  if (!email.endsWith(ALLOWED_DOMAIN)) {
    return res.status(400).json({ 
      error: `Email must be from ${ALLOWED_DOMAIN} domain` 
    });
  }

  // Check if user already exists
  const checkUserQuery = "SELECT user_id FROM users WHERE email = ?";
  db.query(checkUserQuery, [email], (err, results) => {
    if (err) {
      console.error("Error checking existing user:", err);
      return res.status(500).json({ error: "Database error" });
    }

    if (results.length > 0) {
      return res.status(409).json({ error: "User with this email already exists" });
    }

    // Generate a unique verification code (check if code already exists and regenerate if needed)
    const generateUniqueCode = (callback) => {
      let verificationCode = generateVerificationCode();
      
      // Check if code already exists in the database
      const checkCodeQuery = "SELECT randomCode FROM verification_codes WHERE randomCode = ?";
      db.query(checkCodeQuery, [verificationCode], (err, codeResults) => {
        if (err) {
          console.error("Error checking verification code:", err);
          return callback(err, null);
        }

        // If code exists, regenerate and check again
        if (codeResults.length > 0) {
          // Recursively generate a new code and check again
          return generateUniqueCode(callback);
        }

        // Code is unique, return it
        callback(null, verificationCode);
      });
    };

    // Generate unique code and proceed with insertion
    generateUniqueCode((err, verificationCode) => {
      if (err) {
        return res.status(500).json({ error: "Database error" });
      }

      // Calculate expiration time (5 minutes from now)
      const expirationDate = new Date();
      expirationDate.setMinutes(expirationDate.getMinutes() + 5);
      const expirationTime = expirationDate.toTimeString().substring(0, 8); // Format as HH:MM:SS

      // Store verification code in database
      const insertCodeQuery = "INSERT INTO verification_codes (randomCode, expiration_date) VALUES (?, ?)";
      db.query(insertCodeQuery, [verificationCode, expirationTime], (err, result) => {
        if (err) {
          console.error("Error storing verification code:", err);
          return res.status(500).json({ error: "Failed to generate verification code" });
        }

        // In a real implementation, we would send an email here
        // For now, we'll just return success 
        console.log(`Verification code for ${email}: ${verificationCode}`);

        res.status(200).json({ 
          message: "Verification code sent successfully",
          // In development, we might want to return the code for testing
          // code: verificationCode
        });
      });
    });
  });
};

/**
 * Verify the verification code
 * POST /api/registration/verify-code
 * Body: { code: string }
 */
export const verifyCode = (req, res) => {
  const { code } = req.body;

  // Validate code is provided
  if (!code) {
    return res.status(400).json({ error: "Verification code is required" });
  }

  // Normalize code to uppercase
  const normalizedCode = code.toUpperCase();

  // Check if code exists and is not expired
  const verifyQuery = `
    SELECT randomCode 
    FROM verification_codes 
    WHERE randomCode = ? AND expiration_date > CURTIME()
  `;

  db.query(verifyQuery, [normalizedCode], (err, results) => {
    if (err) {
      console.error("Error verifying code:", err);
      return res.status(500).json({ error: "Database error" });
    }

    if (results.length === 0) {
      return res.status(400).json({ 
        error: "Invalid or expired verification code",
        isValid: false 
      });
    }

    // Code is valid
    res.status(200).json({ 
      message: "Verification code is valid",
      isValid: true 
    });
  });
};

/**
 * Create user account (only if verified)
 * POST /api/registration/create-account
 * Body: { email: string, password: string, firstName: string, lastName: string, code: string }
 */
export const createAccount = (req, res) => {
  const { email, password, firstName, lastName, code } = req.body;

  // Validate all required fields
  if (!email || !password || !firstName || !lastName || !code) {
    return res.status(400).json({ error: "All fields are required" });
  }

  // Check domain name again
  if (!email.endsWith(ALLOWED_DOMAIN)) {
    return res.status(400).json({ 
      error: `Email must be from ${ALLOWED_DOMAIN} domain` 
    });
  }

  // Normalize code to uppercase
  const normalizedCode = code.toUpperCase();

  // First, verify the code is valid and not expired
  const verifyQuery = `
    SELECT randomCode 
    FROM verification_codes 
    WHERE randomCode = ? AND expiration_date > CURTIME()
  `;

  db.query(verifyQuery, [normalizedCode], (err, results) => {
    if (err) {
      console.error("Error verifying code:", err);
      return res.status(500).json({ error: "Database error" });
    }

    if (results.length === 0) {
      return res.status(400).json({ 
        error: "Invalid or expired verification code" 
      });
    }

    // Code is valid, now check if user already exists
    const checkUserQuery = "SELECT user_id FROM users WHERE email = ?";
    db.query(checkUserQuery, [email], (err, userResults) => {
      if (err) {
        console.error("Error checking existing user:", err);
        return res.status(500).json({ error: "Database error" });
      }

      if (userResults.length > 0) {
        return res.status(409).json({ error: "User with this email already exists" });
      }

      // Hash the password
      const hashedPassword = hashPassword(password);

      // Insert user into database
      const insertUserQuery = `
        INSERT INTO users (email, fname, lname, hashed_password) 
        VALUES (?, ?, ?, ?)
      `;

      db.query(
        insertUserQuery,
        [email, firstName, lastName, hashedPassword],
        (err, result) => {
          if (err) {
            console.error("Error creating user:", err);
            // Check if it's a duplicate email error
            if (err.code === "ER_DUP_ENTRY") {
              return res.status(409).json({ error: "User with this email already exists" });
            }
            return res.status(500).json({ error: "Failed to create user account" });
          }

          // Delete the used verification code
          const deleteCodeQuery = "DELETE FROM verification_codes WHERE randomCode = ?";
          db.query(deleteCodeQuery, [normalizedCode], (deleteErr) => {
            if (deleteErr) {
              console.error("Error deleting verification code:", deleteErr);
              // Don't fail the request if code deletion fails
            }
          });

          res.status(201).json({ 
            message: "User account created successfully",
            userId: result.insertId 
          });
        }
      );
    });
  });
};