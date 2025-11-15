import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import connectDB from "./core/config/db.js";
import authRoutes from "./modules/auth/auth.routes.js";
import userRoutes from "./modules/user/user.routes.js";
import propertyRoutes from "./modules/property/property.routes.js";
import { errorHandler } from "./core/middleware/errorHandler.js";
import { logger } from "./core/utils/logger.js";
dotenv.config();

const app = express();

// Basic security + logging
app.use(helmet());
app.use(cors({ origin: "*"})); // open for demo
app.use(morgan("dev"));
app.use(express.json());
app.use("/api/properties", propertyRoutes);
// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

// Health check
app.get("/", (req, res) => {
  res.json({ success: true, message: "API running" });
});
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5001;

const start = async () => {
  await connectDB();
  app.listen(PORT, () => {
    logger.info("Server running...");  });
};

start();