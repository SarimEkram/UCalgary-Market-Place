import { Router } from "express";
import { contactSeller } from "../../controller/contactSellerPost/contactSellerPost.js";

const router = Router();

// POST /api/contactSeller
router.post("/", contactSeller);

export default router;
