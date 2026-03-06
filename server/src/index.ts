import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";

import { errorHandler } from "./middleware/errorHandler";
import { requestLogger } from "./middleware/logger";

// Routes
import authRoutes from "./routes/auth";
import userRoutes from "./routes/users";
import businessRoutes from "./routes/businesses";
import postRoutes from "./routes/posts";
import eventRoutes from "./routes/events";
import routeRoutes from "./routes/routes";
import markerRoutes from "./routes/markers";
import tipRoutes from "./routes/tips";
import aiRoutes from "./routes/ai";
import analyticsRoutes from "./routes/analytics";
import newsletterRoutes from "./routes/newsletter";
import paymentsRoutes from "./routes/payments";
import seoRoutes from "./routes/seo";
import uploadRoutes from "./routes/upload";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
}));

app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true,
}));

// Rate limiting - general
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
});
app.use("/api/", limiter);

// Stricter rate limiting for auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 attempts
  message: "Too many authentication attempts, please try again later.",
});

// Stricter rate limiting for sensitive routes
const sensitiveLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20,
  message: "Too many requests, please try again later.",
});

// Body parsing
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Logging
app.use(morgan("dev"));
app.use(requestLogger);

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// API Routes - v1
app.use("/api/v1/auth", authLimiter, authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/businesses", businessRoutes);
app.use("/api/v1/posts", postRoutes);
app.use("/api/v1/events", eventRoutes);
app.use("/api/v1/routes", routeRoutes);
app.use("/api/v1/markers", markerRoutes);
app.use("/api/v1/tips", tipRoutes);
app.use("/api/v1/ai", sensitiveLimiter, aiRoutes);
app.use("/api/v1/analytics", analyticsRoutes);
app.use("/api/v1/newsletter", sensitiveLimiter, newsletterRoutes);
app.use("/api/v1/payments", paymentsRoutes);
app.use("/api/v1/seo", seoRoutes);
app.use("/api/v1/upload", uploadRoutes);

// Legacy routes for backwards compatibility
app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/businesses", businessRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/routes", routeRoutes);
app.use("/api/markers", markerRoutes);
app.use("/api/tips", tipRoutes);
app.use("/api/ai", sensitiveLimiter, aiRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/newsletter", sensitiveLimiter, newsletterRoutes);
app.use("/api/payments", paymentsRoutes);
app.use("/api/seo", seoRoutes);
app.use("/api/upload", uploadRoutes);

// Error handling
app.use(errorHandler);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(`🔗 API v1: http://localhost:${PORT}/api/v1`);
});

export default app;
