import { Router } from "express";
import { getContactedPosts } from "../../controller/userSettingsController/myContactedController.js";

const router = Router();

// POST /api/contacted/list
router.post("/list", getContactedPosts);

export default router;
