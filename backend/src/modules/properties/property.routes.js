import { Router } from "express";
import { propertyController } from "./property.controller.js";
import { authenticate } from "../../core/middleware/authMiddleware.js";

const router = Router();

// Public
router.get("/", propertyController.getPublic);
router.get("/slug/:slug", propertyController.getBySlug);

// Private (admin/agent)
router.post("/", authenticate, propertyController.create);
router.put("/:id", authenticate, propertyController.update);
router.delete("/:id", authenticate, propertyController.remove);

export default router;