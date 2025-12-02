import { Router } from "express";
import {
    searchUsers,
    getUserProfileForAdmin,
} from "../../controller/adminController/findUserController.js";

const router = Router();

router.get("/", searchUsers);
router.get("/:id/profile", getUserProfileForAdmin);

export default router;
