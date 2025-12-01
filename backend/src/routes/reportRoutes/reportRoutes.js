// backend/src/routes/reportRoutes/reportRoutes.js
import { Router } from "express";
import { createReport } from "../../controller/reportController/reportController.js";

const router = Router();

// POST /api/report
router.post("/", createReport);

export default router;