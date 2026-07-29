import { Router } from "express";
import { dismissReportsByPost, dismissReportsByUser } from "../../controller/adminController/dismissReportController.js";

const router = Router();

router.patch("/post/:postId/dismiss", dismissReportsByPost);
router.patch("/user/:userId/dismiss", dismissReportsByUser);

export default router;