import express from "express";
import {
    getUserEventPosts,
    deleteEventPost,
} from "../../controller/userSettingsController/myEventsController.js";

const router = express.Router();

router.post("/list", getUserEventPosts);
router.delete("/delete", deleteEventPost);

export default router;
