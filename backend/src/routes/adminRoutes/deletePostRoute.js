import { Router } from "express";
import { adminDeletePost } from "../../controller/adminController/deletePostController.js";

const router = Router();

// DELETE /api/admin/posts/:postId
router.delete("/:postId", adminDeletePost);

export default router;
