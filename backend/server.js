import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import predictionRoutes from "./routes/prediction.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        status: "running",
        service: "Student Depression Backend API"
    });
});

app.get("/health", (req, res) => {
    res.json({
        status: "healthy",
        uptime: process.uptime()
    });
});

app.use("/api", predictionRoutes);

const PORT = process.env.PORT || 5000;
const HOST = "0.0.0.0";

app.listen(PORT, HOST, () => {
    console.log(`Backend server running on http://${HOST}:${PORT}`);
});
