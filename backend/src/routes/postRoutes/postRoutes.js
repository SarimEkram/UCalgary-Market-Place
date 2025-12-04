import express from "express";

import { 
    getPosts,
    getMarketResults,
    getEventResults,
    getEventById,
    getMarketItemById,
    getReportedEventById,
    getReportedMarketItemById
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

// get specific marketplace item by id with report category
router.get("/reported-itemdetails/:id", getReportedMarketItemById);

// get specific event by id with report category
router.get("/reported-eventdetails/:id", getReportedEventById);

export default router;


