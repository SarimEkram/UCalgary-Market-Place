import { Router } from "express";
import { logout } from "../../controller/authController/logoutController.js";

const router = Router();

router.post("/", logout);

export default router;