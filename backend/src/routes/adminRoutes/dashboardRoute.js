import { Router } from "express";
import { getDashboardStats } from "../../controller/adminController/dashboardController.js";

const router = Router();

router.get("/", getDashboardStats);

export default router;