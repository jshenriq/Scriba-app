import express from "express";
import * as pageController from "../controllers/pageController.js";
import { generalLimiter } from "../middlewares/rateLimit.js";

const router = express.Router();

router.get("/", pageController.renderHome);

router.get('/post/:id', pageController.showPost);

router.get("/api/posts", generalLimiter, pageController.getPostsApi);

export default router;