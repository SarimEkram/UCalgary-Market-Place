import express from "express";
import multer from "multer";
import {
  getUserEventPosts,
  deleteEventPost,
  createEventPost,
  updateEventPost,
} from "../../controller/userSettingsController/myEventsController.js";

const router = express.Router();
const upload = multer();

// Get all event posts created by this user
router.post("/list", getUserEventPosts);

// Delete an event post
router.delete("/delete", deleteEventPost);

// Create a new event post
router.post("/create", upload.array("images"), createEventPost);

// Edit an existing event post
router.put("/edit", upload.array("new_images"), updateEventPost);

export default router;
