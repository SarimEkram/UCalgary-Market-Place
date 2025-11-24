import express from "express";
import {
    sendVerificationEmail,
    verifyCode,
    createAccount,
} from "../../controller/authController/registrationController.js";

const router = express.Router();

// Send verification code to email
// POST /api/registration/send-verification
router.post("/send-verification", sendVerificationEmail);

// Check if a code is valid
// POST /api/registration/verify-code
router.post("/verify-code", verifyCode);

// Create the account once code is verified
// POST /api/registration/create-account
router.post("/create-account", createAccount);

export default router;
