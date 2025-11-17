import express from "express";
import cors from "cors";
import registrationRoutes from "./routes/authRoutes/registrationRoutes.js";

const app = express();

app.use(express.json());
app.use(cors()); // Allow Vite frontend

// Registration routes
app.use("/api/registration", registrationRoutes);

export default app;