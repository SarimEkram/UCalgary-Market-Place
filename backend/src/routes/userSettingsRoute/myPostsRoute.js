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

// Create a new market post
router.post("/create", createMarketPost);

// Update an existing market post
router.put("/update", updateMarketPost);

// Delete a market post
router.delete("/delete", deleteMarketPost);

export default router;
