import { Router } from "express";
import { updateUserInfo } from "../../controller/userSettingsController/mySettingsController.js";

const router = Router();
router.post("/update", updateUserInfo);
export default router;
