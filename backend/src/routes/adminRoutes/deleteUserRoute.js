import { Router } from "express";
import { adminBanUser } from "../../controller/adminController/deleteUserController.js";

const router = Router();

// CHANGE DELETE → POST
router.post("/ban", adminBanUser);

export default router;
