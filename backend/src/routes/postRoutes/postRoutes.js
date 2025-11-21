import express from "express";

import { 
    getPosts,
    getMarketResults,
    getEventResults,
    getEventById,
    getMarketItemById
} from "../../controller/postsController/postController.js";

const router = express.Router();

// get posts for home thumbnails - supports optional ?type=market|event
// Also expose at root so frontend can call `/api/posts?type=...`
router.get("/postfetch", getPosts);

// get search results for marketplace
router.get("/marketres", getMarketResults);

// get search results for events
router.get("/eventres", getEventResults);

// get specific marketplace item by id
router.get("/itemdetails/:id", getMarketItemById);

// get specific event by id
router.get("/eventdetails/:id", getEventById);

export default router;


