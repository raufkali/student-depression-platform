
import express from "express";

const router = express.Router();

const ML_SERVICE_URL =
    process.env.ML_SERVICE_URL || "http://127.0.0.1:8000";

router.post("/predict", async (req, res) => {
    try {
        const response = await fetch(`${ML_SERVICE_URL}/predict`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(req.body)
        });

        const result = await response.json();

        if (!response.ok) {
            return res.status(response.status).json(result);
        }

        return res.status(200).json(result);

    } catch (error) {
        console.error("ML Service Error:", error.message);

        return res.status(503).json({
            error: "ML prediction service is unavailable."
        });
    }
});

export default router;
