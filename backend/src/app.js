import express from "express";
import cors from "cors";

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

// Admin routes:
import findUserRoutes from "./routes/adminRoutes/findUserRoute.js";
import deleteUserRoutes from "./routes/adminRoutes/deleteUserRoute.js";
import deletePostRoutes from "./routes/adminRoutes/deletePostRoute.js";
// import viewReportedUserRoutes from "./routes/adminRoutes/viewReportedUserRoute.js";
import findReportedEventRoutes from "./routes/adminRoutes/findReportedEventRoute.js";
import findReportedMarketPostRoutes from "./routes/adminRoutes/findReportedMarketPostRoute.js";
import getRecentActionsRoutes from "./routes/adminRoutes/getRecentActionsRoute.js";


const app = express();

app.use(express.json());
app.use(cors()); // Allow Vite frontend

app.get("/", (req, res) => {
    res.json({ message: "Backend is running" });
});


//login route
app.use("/api/login", loginRoutes);

//password route
app.use("/api/password", passwordRoutes);

// Registration routes
app.use("/api/registration", registrationRoutes);

// Post routes
app.use("/api/posts", postRoutes);


// Post routes to get saved posts
app.use("/api/getSavedPosts", savedPostRoutes)

// Post route for settings updates
app.use("/api/settings", mySettingsRoutes);

// Post route to view all contacted posts
app.use("/api/contacted", myContactedRoutes);

// Post route to contact a user
app.use("/api/contactSeller", contactUserPostRoute);


// My posts route
app.use("/api/my-posts", myPostsRoutes);

// My events post route
app.use("/api/my-events", myEventsRoute);

// Report route
app.use("/api/report", reportRoutes);


app.use("/api/admin/users", findUserRoutes);   // GET /api/admin/users?q=...
app.use("/api/admin/users", deleteUserRoutes); // DELETE /api/admin/users/ban
app.use("/api/admin/posts", deletePostRoutes); // DELETE /api/admin/posts/:postId
// app.use("/api/admin/reported-users", viewReportedUserRoutes);
app.use("/api/admin/reported-events", findReportedEventRoutes); // GET /api/admin/reported-events
app.use("/api/admin/reported-market-posts", findReportedMarketPostRoutes); // GET /api/admin/reported-market-posts
app.use("/api/admin/recent-actions", getRecentActionsRoutes); // GET /api/admin/recent-actions?adminId=1


export default app;