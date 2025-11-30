import { Router } from "express";
import { getContactedPosts, contactSeller } from "../../controller/userSettingsController/myContactedController.js";

const router = Router();

// POST /api/getContactedPosts
router.post("/", getContactedPosts);

// POST /api/contactSeller
router.post("/contact", contactSeller);

export default router;
