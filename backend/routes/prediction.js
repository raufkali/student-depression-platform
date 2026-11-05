import express from "express";

const router = express.Router();

/**
 * Normalizes and resolves the ML service URL from environment variables.
 * Handles missing protocols, Render internal service names, and trailing slashes.
 */
export function resolveMlServiceUrl(rawUrl = process.env.ML_SERVICE_URL) {
    if (!rawUrl || !rawUrl.trim()) {
        return "http://127.0.0.1:8000";
    }

    let url = rawUrl.trim();

    if (!/^https?:\/\//i.test(url)) {
        if (
            url.includes(".onrender.com") ||
            url.includes(".vercel.app") ||
            url.includes(".koyeb.app")
        ) {
            url = `https://${url}`;
        } else if (!url.includes(":") && !url.includes(".")) {
            // Render private network hostname (e.g. 'student-depression-ml')
            url = `http://${url}:10000`;
        } else {
            url = `http://${url}`;
        }
    }

    return url.replace(/\/+$/, "");
}

/**
 * Pings the ML service health endpoint to verify connectivity.
 * The request itself also wakes a sleeping Render instance.
 */
export async function pingMlService(timeoutMs = 10000) {
    const baseUrl = resolveMlServiceUrl();
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
        const response = await fetch(`${baseUrl}/health`, {
            method: "GET",
            headers: { Accept: "application/json" },
            signal: controller.signal,
        });

        const data = await response.json().catch(() => ({}));

        // HTTP 200 alone does not mean the model is loaded
        const modelReady = data.ready === true || data.model_loaded === true;
        const isReady = response.ok && modelReady;

        return {
            isReady,
            status: isReady ? "healthy" : "waking",
            modelLoaded: modelReady,
            statusCode: response.status,
            targetUrl: baseUrl,
            details: data,
        };
    } catch (err) {
        return {
            isReady: false,
            status: "waking",
            modelLoaded: false,
            error:
                err.name === "AbortError"
                    ? "ML service health check timed out."
                    : err.message,
            targetUrl: baseUrl,
        };
    } finally {
        clearTimeout(timeoutId);
    }
}

/**
 * GET /api/wake
 * Explicit wake-up trigger. Pings the ML service so it starts up from standby.
 */
router.get("/wake", async (req, res) => {
    const mlHealth = await pingMlService(10000);

    if (!mlHealth.isReady) {
        return res.status(503).json({
            ready: false,
            status: "waking",
            backend: "healthy",
            message: "ML service is starting or loading its model.",
            mlService: mlHealth,
        });
    }

    return res.status(200).json({
        ready: true,
        status: "ready",
        backend: "healthy",
        message: "AI inference engine is ready.",
        mlService: mlHealth,
    });
});

/**
 * POST /api/predict
 * Forwards the payload to the ML service. If the service is cold-starting,
 * retries within a total time budget instead of dropping the request.
 */
router.post("/predict", async (req, res) => {
    const mlUrl = resolveMlServiceUrl();

    const TOTAL_BUDGET_MS = 85000; // stay under Render's ~100s request limit
    const PER_ATTEMPT_TIMEOUT_MS = 25000;
    const RETRY_DELAY_MS = 4000;
    const RETRYABLE_STATUSES = [502, 503, 504];

    const deadline = Date.now() + TOTAL_BUDGET_MS;

    let lastError = null;
    let attempt = 0;

    while (Date.now() < deadline) {
        attempt++;

        const remaining = deadline - Date.now();
        const controller = new AbortController();
        const timeoutId = setTimeout(
            () => controller.abort(),
            Math.min(PER_ATTEMPT_TIMEOUT_MS, remaining)
        );

        try {
            const response = await fetch(`${mlUrl}/predict`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify(req.body),
                signal: controller.signal,
            });

            clearTimeout(timeoutId);

            // Client errors (400, 422 validation, etc.): never retry
            if (response.status >= 400 && response.status < 500) {
                const clientErr = await response.json().catch(() => ({}));
                return res.status(response.status).json(clientErr);
            }

            // Success
            if (response.ok) {
                const result = await response.json();
                return res.status(200).json(result);
            }

            // Real server error (e.g. 500): not a cold-start symptom, return it
            if (!RETRYABLE_STATUSES.includes(response.status)) {
                const serverErr = await response.json().catch(() => null);
                return res.status(response.status).json(
                    serverErr || {
                        error: "AI service returned an unexpected server error.",
                        status: response.status,
                    }
                );
            }

            // 502/503/504: service is probably waking up, retry
            lastError = new Error(`ML service returned HTTP ${response.status}`);
        } catch (error) {
            clearTimeout(timeoutId);
            lastError = error;
        }

        console.log(
            `[Prediction Gateway] Attempt ${attempt} failed (${lastError?.message}). Retrying...`
        );

        if (Date.now() + RETRY_DELAY_MS >= deadline) break;
        await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));
    }

    console.error("[Prediction Gateway] Gave up:", lastError?.message);

    return res.status(503).json({
        error:
            "The AI prediction service is still waking up from standby. Please retry in a few moments.",
        code: "AI_WARMING_UP",
        details: lastError?.message,
    });
});

export default router;