/**
 * API client module for the Student Depression Assessment Platform.
 * Communicates with the Express API endpoint: POST ${NEXT_PUBLIC_API_URL}/api/predict
 */

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

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
        return {
          success: false,
          error:
            "The AI prediction service is temporarily unavailable. Please make sure the service is running.",
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
        "Unable to connect to the prediction backend. Please check your internet connection or server status.",
      originalError: err.message,
    };
  }
}
