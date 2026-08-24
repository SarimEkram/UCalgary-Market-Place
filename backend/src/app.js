import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import { authLimiter, emailLimiter } from "./middleware/rateLimiter.js";

import { requireAuth, requireAdmin } from "./middleware/auth.js";
import loginRoutes from "./routes/authRoutes/loginRoutes.js";
import registrationRoutes from "./routes/authRoutes/registrationRoutes.js";
import postRoutes from "./routes/postRoutes/postRoutes.js";
import passwordRoutes from "./routes/authRoutes/passwordRoutes.js";
import savedPostRoutes from "./routes/userSettingsRoute/savedPostRoute.js";
import mySettingsRoutes from "./routes/userSettingsRoute/mySettingsRoute.js";

import myContactedRoutes from "./routes/userSettingsRoute/myContactedRoute.js";
import contactUserPostRoute from "./routes/contactSellerPostRoute/contactSellerPostRoute.js";

import myPostsRoutes from "./routes/userSettingsRoute/myPostsRoute.js";
import myEventsRoute from "./routes/userSettingsRoute/myEventsRoute.js";
import reportRoutes from "./routes/reportRoutes/reportRoutes.js";
import logoutRoutes from "./routes/authRoutes/logoutRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
// Admin routes:
import findUserRoutes from "./routes/adminRoutes/findUserRoute.js";
import deleteUserRoutes from "./routes/adminRoutes/deleteUserRoute.js";
import deletePostRoutes from "./routes/adminRoutes/deletePostRoute.js";
import viewReportedUserRoutes from "./routes/adminRoutes/ViewReportedUserRoute.js";
import findReportedEventRoutes from "./routes/adminRoutes/findReportedEventRoute.js";
import findReportedMarketPostRoutes from "./routes/adminRoutes/findReportedMarketPostRoute.js";
import getRecentActionsRoutes from "./routes/adminRoutes/getRecentActionsRoute.js";
import dismissReportRoutes from "./routes/adminRoutes/dismissReportRoute.js";
import dashboardRoutes from "./routes/adminRoutes/dashboardRoute.js";
import unbanRoutes from "./routes/adminRoutes/unbanRoute.js";

const app = express();
app.use(helmet());
app.use(express.json({ limit: "1mb" }));

app.use(express.json());
app.use(cookieParser());

app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
}));

// Public routes (no auth needed)
app.use("/api/login", authLimiter, loginRoutes);
app.use("/api/password", emailLimiter, passwordRoutes);
app.use("/api/registration", emailLimiter, registrationRoutes);

// Protected routes (logged-in users)
app.use("/api/posts", postRoutes);
app.use("/api/getSavedPosts", requireAuth, savedPostRoutes);
app.use("/api/settings", requireAuth, mySettingsRoutes);
app.use("/api/contacted", requireAuth, myContactedRoutes);
app.use("/api/contactSeller", requireAuth, contactUserPostRoute);
app.use("/api/my-posts", requireAuth, myPostsRoutes);
app.use("/api/my-events", requireAuth, myEventsRoute);
app.use("/api/report", requireAuth, reportRoutes);
app.use("/api/messages", requireAuth, messageRoutes);

// Admin routes
app.use("/api/admin/users", requireAdmin, findUserRoutes);
app.use("/api/admin/users", requireAdmin, deleteUserRoutes);
app.use("/api/admin/posts", requireAdmin, deletePostRoutes);
app.use("/api/admin/reported-users", requireAdmin, viewReportedUserRoutes);
app.use("/api/admin/reported-events", requireAdmin, findReportedEventRoutes);
app.use("/api/admin/reported-market-posts", requireAdmin, findReportedMarketPostRoutes);
app.use("/api/admin/recent-actions", requireAdmin, getRecentActionsRoutes);
app.use("/api/logout", logoutRoutes);
app.use("/api/admin/reports", requireAdmin, dismissReportRoutes);
app.use("/api/admin/dashboard", requireAdmin, dashboardRoutes);
app.use("/api/admin/banned", requireAdmin, unbanRoutes);


export default app;