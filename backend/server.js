import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import predictionRoutes, {
    pingMlService,
    resolveMlServiceUrl,
} from "./routes/prediction.js";

dotenv.config();

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
 * Top-level health check endpoint.
 * Returns combined health for both the Express gateway and the Python ML service.
 */
app.get("/health", async (req, res) => {
    const mlHealth = await pingMlService(4000);
    res.json({
        status: mlHealth.isReady ? "healthy" : "waking",
        uptime: process.uptime(),
        backend: "healthy",
        mlService: mlHealth,
    });
});

/**
 * Top-level wake route for convenience.
 */
app.get("/wake", async (req, res) => {
    const mlHealth = await pingMlService(7000);
    res.json({
        ready: mlHealth.isReady,
        status: mlHealth.isReady ? "ready" : "waking",
        backend: "healthy",
        mlService: mlHealth,
        message: mlHealth.isReady
            ? "AI inference service is active and ready."
            : "AI inference service is waking up from standby.",
    });
});

// Prediction API routes mounted at /api
app.use("/api", predictionRoutes);

const PORT = process.env.PORT || 5000;
const HOST = "0.0.0.0";

app.listen(PORT, HOST, () => {
    console.log(`Backend server running on http://${HOST}:${PORT}`);
    console.log(`Resolved ML service target: ${resolveMlServiceUrl()}`);
});
