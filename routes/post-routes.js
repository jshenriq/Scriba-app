import express from "express";
import {
  getDashboardPostsApi,
  renderDashboardPage,
  renderCreatePostPage,
  createPost,
  renderEditPage,
  editPost,
  deletePostApi
} from "../controllers/post-controller.js";
import isAuthenticated from "../middlewares/is-authenticated.js";
import { generalLimiter } from "../middlewares/rate-limit.js";

const router = express.Router();

// API para carregar mais posts do dashboard (load more)
router.get("/api/dashboard", generalLimiter, isAuthenticated, getDashboardPostsApi);

router.get("/dashboard", isAuthenticated, renderDashboardPage);

//rotas pra pagina de criar novo post
router.get("/create", isAuthenticated, renderCreatePostPage);
router.post("/create", generalLimiter, isAuthenticated, createPost);

//rotas pra pagina edit
router.get("/edit/:id", isAuthenticated, renderEditPage);
router.post("/edit/:id", generalLimiter, isAuthenticated, editPost)

router.delete("/api/delete/:id", generalLimiter, isAuthenticated, deletePostApi);



// router.get("/test-error", (req, res) => {
//   req.flash("error", "Isso é um teste de erro!");
//   res.redirect("/dashboard");
// });

// router.get("/test-error", (req, res) => {
//     const err = new Error("Algo deu errado!");
//     err.statusCode = 400;
//     next(err);
// });


export default router;
