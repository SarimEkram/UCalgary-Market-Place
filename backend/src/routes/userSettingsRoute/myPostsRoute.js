import { Router } from "express";
import {
    getUserMarketPosts,
    createMarketPost,
    updateMarketPost,
    deleteMarketPost,
} from "../../controller/userSettingsController/myPostsController.js";

const router = Router();

// Get all market posts created by this user
router.post("/list", getUserMarketPosts);

// Delete a market post
router.delete("/delete", deleteMarketPost);

export default router;
