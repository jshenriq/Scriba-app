import express from "express";
import * as postController from "../controllers/postController.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { generalLimiter } from "../middlewares/rateLimit.js";

const router = express.Router();

// API para carregar mais posts do dashboard (load more)
router.get("/api/dashboard", generalLimiter, isAuthenticated, postController.getDashboardPostsApi);

router.get("/dashboard", isAuthenticated, postController.renderDashboardPage);

//rotas pra pagina de criar novo post
router.get("/create", isAuthenticated, postController.renderCreatePostPage);
router.post("/create", generalLimiter, isAuthenticated, postController.createPost);

//rotas pra pagina edit
router.get("/edit/:id", isAuthenticated, postController.renderEditPage);
router.post("/edit/:id", generalLimiter, isAuthenticated, postController.editPost)

router.delete("/api/delete/:id", generalLimiter, isAuthenticated, postController.deletePostApi);



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
