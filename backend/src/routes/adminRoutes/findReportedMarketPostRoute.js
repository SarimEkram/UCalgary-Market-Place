import { Router } from "express";
import { getReportedMarketPosts } from "../../controller/adminController/findReportedMarketPostController.js";

const router = Router();

// GET /api/admin/reported-market-posts
router.get("/", getReportedMarketPosts);

export default router;
