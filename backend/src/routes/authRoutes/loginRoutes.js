import { Router } from "express";
import { login } from "../../controller/authController/loginController.js";

const router = Router();

router.post("/", login);

export default router;
