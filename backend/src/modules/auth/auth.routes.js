import { Router } from "express";
import { authController } from "./auth.controller.js";
import { authenticate } from "../../core/middleware/authMiddleware.js";
import { loginLimiter } from "../../core/middleware/rateLimit.js";

const router = Router();

// Public
router.post("/register", authController.register);
router.post("/login", authController.login);

router.post("/login", loginLimiter, authController.login);

// Private
router.get("/me", authenticate, authController.me);

export default router;