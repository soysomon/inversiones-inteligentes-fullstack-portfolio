import { Router } from "express";
import { userController } from "./user.controller.js";
import { authenticate } from "../../core/middleware/authMiddleware.js";

const router = Router();

// Private routes
router.get("/me", authenticate, userController.getProfile);
router.put("/me", authenticate, userController.update);

export default router;