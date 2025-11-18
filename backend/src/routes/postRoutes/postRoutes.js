import express from "express";

import { 
    getPosts,
    getMarketResults,
    getEventResults,
    getEventById,
    getMarketItemById
} from "../../controller/postsController/postController.js";

const router = express.Router();

// get posts for homepage thumbnails
router.get("/", getPosts);

// get search results for marketplace
router.get("/", getMarketResults);

// get search results for events
router.get("/", getEventResults);

// get specific event by id
router.get("/", getEventById);

// get specific marketplace item by id
router.get("/", getMarketItemById);

