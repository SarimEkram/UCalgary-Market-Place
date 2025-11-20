import { Router } from "express";
import {
    forgotPassword,
    verifyResetCode,
    resetPassword,
} from "../../controller/authController/passwordController.js";

const router = Router();

router.post("/forgot", forgotPassword);
router.post("/verify", verifyResetCode);
router.post("/reset", resetPassword);

export default router;
