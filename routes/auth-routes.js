import express from "express";
import passport from "passport";
import { renderLoginPage, renderRegisterPage, registerUser, logout } from "../controllers/auth-controller.js";
import isNotAuthenticated from "../middlewares/is-not-authenticated.js";
import { authLimiter } from "../middlewares/rate-limit.js"

const router = express.Router();



//Renderização das páginas (GET)
router.get("/login", isNotAuthenticated, renderLoginPage);
router.get("/register", isNotAuthenticated, renderRegisterPage);


// Processamento dos dados (POST)
router.post("/register", authLimiter, registerUser);
router.post("/login", authLimiter,   
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/login",
    failureFlash: true,
  })
);

// Logout
router.get("/logout", logout);

export default router;