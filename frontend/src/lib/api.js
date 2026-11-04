/**
 * API client module for the Student Depression Assessment Platform.
 * Communicates with the Express API endpoint: POST ${NEXT_PUBLIC_API_URL}/api/predict
 * Includes early wake-up pinging and health verification for AI cold starts.
 */

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// Cached wake-up status to avoid flooding the backend with redundant wake calls
let cachedAiStatus = {
  ready: false,
  status: "unknown",
  lastChecked: 0,
};

let inFlightWakePromise = null;

/**
 * Pings the backend and the underlying ML inference service to warm up cold containers.
 * Call this as soon as the user focuses on or enters details in the assessment form.
 * 
 * @param {boolean} forceRefresh - If true, bypasses the local status cache.
 * @returns {Promise<{ready: boolean, status: string, message: string}>}
 */
export async function wakeAiService(forceRefresh = false) {
  const now = Date.now();

  // If we already know the AI is ready and checked within the last 45 seconds, return immediately
  if (!forceRefresh && cachedAiStatus.ready && now - cachedAiStatus.lastChecked < 45000) {
    return cachedAiStatus;
  }

  // Deduplicate concurrent wake calls
  if (inFlightWakePromise) {
    return inFlightWakePromise;
  }

  inFlightWakePromise = (async () => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 12000);

      const response = await fetch(`${API_BASE_URL}/api/wake`, {
        method: "GET",
        headers: { Accept: "application/json" },
        signal: controller.signal,
      }).catch(async () => {
        // Fallback to top-level /wake if /api/wake had a routing difference
        return await fetch(`${API_BASE_URL}/wake`, {
          method: "GET",
          headers: { Accept: "application/json" },
          signal: controller.signal,
        });
      });

      clearTimeout(timeoutId);

      if (response && response.ok) {
        const data = await response.json().catch(() => ({}));
        cachedAiStatus = {
          ready: Boolean(data.ready),
          status: data.status || (data.ready ? "ready" : "waking"),
          message: data.message || (data.ready ? "AI Ready" : "AI Waking up"),
          lastChecked: Date.now(),
        };
        return cachedAiStatus;
      }

      cachedAiStatus = {
        ready: false,
        status: "waking",
        message: "AI service waking up...",
        lastChecked: Date.now(),
      };
      return cachedAiStatus;
    } catch (err) {
      cachedAiStatus = {
        ready: false,
        status: "standby",
        message: "Unable to reach AI gateway.",
        lastChecked: Date.now(),
      };
      return cachedAiStatus;
    } finally {
      inFlightWakePromise = null;
    }
  })();

  return inFlightWakePromise;
}

/**
 * Checks the full health status of both gateway and AI service.
 */
export async function checkAiHealth() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/health`, {
      method: "GET",
      headers: { Accept: "application/json" },
    });
    if (!res.ok) return { healthy: false, status: "degraded" };
    return await res.json();
  } catch {
    return { healthy: false, status: "unreachable" };
  }
}

/**
 * Expected universal student schema (10 features, no regional district):
 * {
 *   Gender: "Female" | "Male",
 *   Age: number,
 *   Family_background: "Lower Middle class" | "Middle class" | "Rich class",
 *   Relationship_status: "Single" | "In a Relationship" | "Complicated",
 *   Marital_status: "Unmarried" | "Married" | "Separated",
 *   Living_style: "Family" | "Bachelor",
 *   Current_semester: number,
 *   CGPA: number,
 *   friend_circle: "Yes" | "No",
 *   Cost_without_study: number
 * }
 */
export async function submitPrediction(formData) {
  const payload = {
    Gender: String(formData.Gender || "").trim(),
    Age: parseInt(formData.Age, 10),
    Family_background: String(formData.Family_background || "").trim(),
    Relationship_status: String(formData.Relationship_status || "").trim(),
    Marital_status: String(formData.Marital_status || "").trim(),
    Living_style: String(formData.Living_style || "").trim(),
    Current_semester: parseInt(formData.Current_semester, 10),
    CGPA: parseFloat(formData.CGPA),
    friend_circle: String(formData.friend_circle || "").trim(),
    Cost_without_study: parseFloat(formData.Cost_without_study),
  };

  // Validation
  const validationErrors = [];
  if (!payload.Gender) validationErrors.push("Please select a gender.");
  if (isNaN(payload.Age) || payload.Age < 15 || payload.Age > 80) {
    validationErrors.push("Please provide a valid age between 15 and 80.");
  }
  if (!payload.Family_background) {
    validationErrors.push("Please select family financial background.");
  }
  if (!payload.Relationship_status) {
    validationErrors.push("Please select relationship status.");
  }
  if (!payload.Marital_status) {
    validationErrors.push("Please select marital status.");
  }
  if (!payload.Living_style) {
    validationErrors.push("Please select living arrangement.");
  }
  if (
    isNaN(payload.Current_semester) ||
    payload.Current_semester < 1 ||
    payload.Current_semester > 20
  ) {
    validationErrors.push("Please enter current semester (1 to 20).");
  }
  if (isNaN(payload.CGPA) || payload.CGPA < 0.0 || payload.CGPA > 4.0) {
    validationErrors.push("Please enter a valid CGPA between 0.00 and 4.00.");
  }
  if (!payload.friend_circle) {
    validationErrors.push("Please indicate if you have a close friend circle.");
  }
  if (
    isNaN(payload.Cost_without_study) ||
    payload.Cost_without_study < 0
  ) {
    validationErrors.push("Please enter living cost (non-negative number).");
  }

  if (validationErrors.length > 0) {
    return {
      success: false,
      error: validationErrors.join(" "),
      validationErrors,
    };
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/predict`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      if (response.status === 503) {
        const isColdBoot = data && (data.code === "AI_WARMING_UP" || data.status === "waking");
        return {
          success: false,
          isWarmingUp: true,
          error: isColdBoot
            ? "The AI prediction service is still warming up from cold standby. Please retry in a few moments."
            : "The AI prediction service is temporarily unavailable. Please make sure the service is running.",
          status: 503,
        };
      }

      return {
        success: false,
        error:
          (data && (data.error || data.message)) ||
          `Server returned an error (HTTP ${response.status}).`,
        status: response.status,
      };
    }

    if (!data || typeof data.experimental_prediction === "undefined") {
      return {
        success: false,
        error: "Invalid response received from prediction service.",
      };
    }

    // Since prediction succeeded, AI is confirmed ready
    cachedAiStatus = {
      ready: true,
      status: "ready",
      message: "AI Ready",
      lastChecked: Date.now(),
    };

    return {
      success: true,
      data: {
        experimental_prediction: data.experimental_prediction,
        decision_score: Number(data.decision_score),
        threshold: Number(data.threshold),
        disclaimer:
          data.disclaimer ||
          "Experimental dataset-based classification, not a clinical diagnosis.",
      },
    };
  } catch (err) {
    return {
      success: false,
      error:
        "Unable to connect to the prediction backend. The service may be waking up from sleep. Please check your connection and retry.",
      originalError: err.message,
      isNetworkError: true,
    };
  }
}
