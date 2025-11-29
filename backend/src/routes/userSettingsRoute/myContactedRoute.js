import { Router } from "express";
import { 
    getContactedPosts,
    contactSeller,
    canContactSeller
} from "../../controller/userSettingsController/myContactedController.js";

const router = Router();

// POST /api/getContactedPosts - Get all contacted posts
router.post("/", getContactedPosts);

// Export router and individual functions for use in app.js
export default router;
export { contactSeller, canContactSeller };
