import express from "express";
import cors from "cors";
import loginRoutes from "./routes/authRoutes/loginRoutes.js";
import registrationRoutes from "./routes/authRoutes/registrationRoutes.js";
import postRoutes from "./routes/postRoutes/postRoutes.js";

const app = express();

app.use(express.json());
app.use(cors()); // Allow Vite frontend

//login route
app.use("/api/login", loginRoutes);

// Registration routes
app.use("/api/registration", registrationRoutes);

// Post routes
app.use("/api/posts", postRoutes);

export default app;