import { Router } from "express";
import {
    getUnreadCount,
    getConversations,
    createConversation,
    getMessages,
    sendMessage,
    archiveConversation,
} from "../controller/messageController.js";

const router = Router();

router.get("/unread-count", getUnreadCount);
router.get("/conversations", getConversations);
router.post("/conversations", createConversation);
router.get("/conversations/:id", getMessages);
router.post("/conversations/:id", sendMessage);
router.patch("/conversations/:id/archive", archiveConversation);

export default router;