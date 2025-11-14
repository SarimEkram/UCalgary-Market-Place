import express from "express";
import cors from "cors";
import loginRoutes from "./routes/authRoutes/loginRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({ message: "Backend is running" });
});

app.use("/api/login", loginRoutes);

export default app;
