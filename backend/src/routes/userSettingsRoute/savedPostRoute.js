import { Router } from "express";
import { getSavedPost } from "../../controller/userSettingsController/savedPostController.js";

const router = Router();

router.post("/", getSavedPost);

export default router;
