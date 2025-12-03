import { Router } from "express";
import { getReportedEvents } from "../../controller/adminController/findReportedEventController.js";

const router = Router();

// GET /api/admin/reported-events
router.get("/", getReportedEvents);

export default router;