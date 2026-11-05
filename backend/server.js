import express from "express";
import cors from "cors";
import "dotenv/config";
import predictionRoutes, {
    pingMlService,
    resolveMlServiceUrl,
} from "./routes/prediction.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        status: "running",
        service: "Student Depression Backend API",
        mlServiceTarget: resolveMlServiceUrl(),
    });
});

/**
 * Top-level health check.
 * Returns combined health for the Express gateway and the Python ML service.
 * Always responds 200 so Render's own health check never fails because the ML
 * service is asleep.
 */
app.get("/health", async (req, res) => {
    const mlHealth = await pingMlService(8000);

    res.status(200).json({
        status: mlHealth.isReady ? "healthy" : "waking",
        ready: mlHealth.isReady,
        backend: "healthy",
        mlService: mlHealth,
        uptime: process.uptime(),
    });
});

// Prediction API routes mounted at /api  (/api/wake, /api/predict)
app.use("/api", predictionRoutes);

const PORT = process.env.PORT || 5000;
const HOST = "0.0.0.0";

app.listen(PORT, HOST, () => {
    console.log(`Backend server running on http://${HOST}:${PORT}`);
    console.log(`Resolved ML service target: ${resolveMlServiceUrl()}`);
});