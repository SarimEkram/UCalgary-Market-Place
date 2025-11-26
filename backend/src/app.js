import express from "express";
import cors from "cors";
import loginRoutes from "./routes/authRoutes/loginRoutes.js";
import registrationRoutes from "./routes/authRoutes/registrationRoutes.js";
import postRoutes from "./routes/postRoutes/postRoutes.js";
import passwordRoutes from "./routes/authRoutes/passwordRoutes.js";
import savedPostRoutes from "./routes/userSettingsRoute/savedPostRoute.js";
import mySettingsRoutes from "./routes/userSettingsRoute/mySettingsRoute.js";
import myContactedRoutes from "./routes/userSettingsRoute/myContactedRoute.js";
import myPostsRoutes from "./routes/userSettingsRoute/myPostsRoute.js";

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

// Contacted posts list
app.use("/api/getContactedPosts", myContactedRoutes);

// My posts route
app.use("/api/my-posts", myPostsRoutes);

export default app;