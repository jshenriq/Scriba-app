import express from "express";
import { renderHomePage, renderPostPage, getPostsApi } from "../controllers/page-controller.js";
import { generalLimiter } from "../middlewares/rate-limit.js";

const router = express.Router();

router.get("/", renderHomePage);

router.get('/post/:id', renderPostPage);

router.get("/api/posts", generalLimiter, getPostsApi);

export default router;