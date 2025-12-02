import { Router } from "express";
import { adminBanUser } from "../../controller/adminController/deleteUserController.js";

const router = Router();

// DELETE /api/admin/users/ban
router.delete("/ban", adminBanUser);

export default router;
