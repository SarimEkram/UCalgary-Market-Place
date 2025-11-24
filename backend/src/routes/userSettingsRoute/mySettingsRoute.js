import { Router } from "express";
import { updateUserInfo } from "../../controller/userSettingsController/settingsController.js";

const router = Router();

// Update user info (first name, last name, password).
// Frontend will call: PUT /api/settings
router.put("/", updateUserInfo);

export default router;
