import express from "express";
import {
  sendVerificationEmail,
  verifyCode,
  createAccount,
} from "../../controller/authController/registrationController.js";

const router = express.Router();

// Send verification email
router.post("/send-verification", sendVerificationEmail);

// Verify code
router.post("/verify-code", verifyCode);

// Create account
router.post("/create-account", createAccount);

export default router;