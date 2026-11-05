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
        // If it's a known hosted domain, default to https://
        if (
            url.includes(".onrender.com") ||
            url.includes(".vercel.app") ||
            url.includes(".koyeb.app")
        ) {
            url = `https://${url}`;
        } else if (!url.includes(":") && !url.includes(".")) {
            // Render internal private network hostname (e.g. 'student-depression-ml')
            // Internal Render web services listen on port 10000 by default
            url = `http://${url}:10000`;
        } else {
            url = `http://${url}`;
        }
    }

    return url.replace(/\/+$/, "");
}

/**
 * Pings the ML service health endpoint to verify connectivity and wake up cold instances.
 */

export async function pingMlService(timeoutMs = 10000) {
    const baseUrl = resolveMlServiceUrl();
    const controller = new AbortController();

    const timeoutId = setTimeout(
        () => controller.abort(),
        timeoutMs
    );

    try {
        const response = await fetch(`${baseUrl}/health`, {
            method: "GET",
            headers: { Accept: "application/json" },
            signal: controller.signal,
            cache: "no-store",
        });

        const data = await response.json().catch(() => ({}));

        // HTTP 200 alone does NOT mean the ML model is ready.
        const modelReady =
            data.ready === true ||
            data.model_loaded === true;

        return {
            isReady: response.ok && modelReady,
            status: response.ok && modelReady
                ? "healthy"
                : "waking",
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
            error: err.name === "AbortError"
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
 * Explicit wake-up trigger for the ML inference service.
 * Pings the Python FastAPI service to trigger warm-up from standby.
 */


/**
 * GET /api/health
 * Combined health status for gateway backend and ML inference service.
 */
app.get("/health", async (req, res) => {
    const mlHealth = await pingMlService(10000);

    res.status(200).json({
        status: mlHealth.isReady ? "healthy" : "waking",
        ready: mlHealth.isReady,
        backend: "healthy",
        mlService: mlHealth,
        uptime: process.uptime(),
    });
});

/**
 * POST /api/predict
 * Forwards prediction payload to the ML service with automatic cold-start retry.
 * If the ML service is asleep, retries with backoff instead of immediately dropping the request.
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



router.post("/predict", async (req, res) => {
    const mlUrl = resolveMlServiceUrl();
    const MAX_RETRIES = 4;
    const RETRY_DELAYS = [1500, 3000, 5000, 7000];

    let lastError = null;

    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
        const controller = new AbortController();
        // Allow up to 20s per attempt to accommodate cold container start
        const timeoutId = setTimeout(() => controller.abort(), 20000);

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

            // If the ML service returns client errors (e.g. 400, 422 validation), don't retry
            if (response.status >= 400 && response.status < 500) {
                const clientErr = await response.json().catch(() => ({}));
                return res.status(response.status).json(clientErr);
            }

            // Gateway error (502, 503, 504) while waking up -> candidate for retry
            if (!response.ok) {
                lastError = new Error(`ML service returned HTTP ${response.status}`);
                if (attempt < MAX_RETRIES) {
                    const delay = RETRY_DELAYS[attempt];
                    console.log(
                        `[Prediction Gateway] Attempt ${attempt + 1} got ${response.status}. Retrying in ${delay}ms...`
                    );
                    await new Promise((resolve) => setTimeout(resolve, delay));
                    continue;
                }
                const errResult = await response.json().catch(() => null);
                return res.status(response.status).json(
                    errResult || {
                        error: "AI service returned an unexpected server error.",
                        status: response.status,
                    }
                );
            }

            // Success!
            const result = await response.json();
            return res.status(200).json(result);
        } catch (error) {
            clearTimeout(timeoutId);
            lastError = error;

            if (attempt < MAX_RETRIES) {
                const delay = RETRY_DELAYS[attempt];
                console.log(
                    `[Prediction Gateway] Attempt ${attempt + 1} failed (${error.message}). Retrying in ${delay}ms...`
                );
                await new Promise((resolve) => setTimeout(resolve, delay));
            }
        }
    }

    console.error("[Prediction Gateway] All retry attempts exhausted:", lastError?.message);

    return res.status(503).json({
        error:
            "The AI prediction service is still waking up from standby. Please retry in a few moments.",
        code: "AI_WARMING_UP",
        details: lastError?.message,
    });
});

export default router;
