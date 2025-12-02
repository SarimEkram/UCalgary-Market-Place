import { Router } from "express";
import multer from "multer";
import {
    getUserMarketPosts,
    deleteMarketPost,
    createMarketPost,
    updateMarketPost,
} from "../../controller/userSettingsController/myPostsController.js";

const router = Router();
const upload = multer();

// Get all market posts created by this user
router.post("/list", getUserMarketPosts);

// Delete a market post
router.delete("/delete", deleteMarketPost);

// Create a new market post
router.post("/create-market", upload.array("images"), createMarketPost);

// Edit market post
router.put("/edit-market", upload.array("new_images"), updateMarketPost);

export default router;
