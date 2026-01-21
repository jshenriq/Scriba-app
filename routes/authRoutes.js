import express from "express";
import passport from "passport";
import * as authController from "../controllers/authController.js";
import isNotAuthenticated from "../middlewares/isNotAuthenticated.js";
import { authLimiter } from "../middlewares/rateLimit.js"

const router = express.Router();



//Renderização das páginas (GET)
router.get("/login", isNotAuthenticated, authController.renderLoginPage);
router.get("/register", isNotAuthenticated, authController.renderRegisterPage);


// Processamento dos dados (POST)
router.post("/register", authLimiter, authController.registerUser);
router.post("/login", authLimiter,   
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/login",
    failureFlash: true,
  })
);

// Logout
router.get("/logout", authController.logout);

export default router;