import express from "express";
import * as pageController from "../controllers/page-controller.js";
import { generalLimiter } from "../middlewares/rate-limit.js";

const router = express.Router();

router.get("/", pageController.renderHome);

router.get('/post/:id', pageController.showPost);

router.get("/api/posts", generalLimiter, pageController.getPostsApi);

export default router;