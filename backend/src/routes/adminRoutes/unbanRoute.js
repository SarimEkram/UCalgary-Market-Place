import { Router } from "express";
import { unbanUser, getBannedUsers } from "../../controller/adminController/unbanController.js";

const router = Router();

router.get("/", getBannedUsers);
router.post("/unban", unbanUser);

export default router;