import { Router } from "express";
import { getRecentAdminActions } from "../../controller/adminController/getRecentAdminActionsController.js";

const router = Router();

// GET /api/admin/recent-actions?adminId=1
router.get("/", getRecentAdminActions);

export default router;