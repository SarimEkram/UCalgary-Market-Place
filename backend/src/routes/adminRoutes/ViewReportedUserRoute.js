import { Router } from "express";
import { viewReportedUsers } from "../../controller/adminController/viewReportedUserController.js";

const router = Router();

// GET /api/admin/reported-users
router.get("/", viewReportedUsers);

export default router;
