import { Router } from "express";
import { getContactedPosts } from "../../controller/userSettingsController/myContactedController.js";

const router = Router();

// POST /api/getContactedPosts
router.post("/", getContactedPosts);

export default router;