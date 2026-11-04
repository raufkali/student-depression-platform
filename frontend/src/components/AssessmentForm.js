"use client";

import { useState, useEffect, useRef } from "react";
import { submitPrediction, wakeAiService } from "@/lib/api";
import PredictionResult from "./PredictionResult";
import {
  AlertCircle,
  Loader2,
  Brain,
  Zap,
  RefreshCw,
} from "lucide-react";

const INITIAL_STATE = {
  Gender: "",
  Age: "",
  Family_background: "",
  Relationship_status: "",
  Marital_status: "",
  Living_style: "",
  Current_semester: "",
  CGPA: "",
  friend_circle: "",
  Cost_without_study: "",
};

export default function AssessmentForm() {
  const [formData, setFormData] = useState(INITIAL_STATE);
  const [fieldErrors, setFieldErrors] = useState({});
  const [apiError, setApiError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingNotice, setLoadingNotice] = useState(false);
  const [predictionResult, setPredictionResult] = useState(null);

  // Live status of the backend and AI inference engine: "checking" | "waking" | "ready" | "standby"
  const [aiStatus, setAiStatus] = useState("checking");
  const wakeTriggeredRef = useRef(false);

  /**
   * Pings the backend and ML service to wake up cold containers.
   */
  const triggerWake = (isManual = false) => {
    if (aiStatus === "ready" && !isManual) return;

    if (aiStatus !== "ready") {
      setAiStatus("waking");
    }

    wakeAiService(isManual)
      .then((res) => {
        if (res && res.ready) {
          setAiStatus("ready");
        } else if (res && res.status === "waking") {
          setAiStatus("waking");
        } else {
          setAiStatus("standby");
        }
      })
      .catch(() => {
        setAiStatus("standby");
      });
  };

  // Mount effect: Start background wake ping as soon as page loads
  useEffect(() => {
    triggerWake();
  }, []);

  // Polling effect: While waking, check every 3.5s (up to 10 attempts) until ready
  useEffect(() => {
    if (aiStatus !== "waking") return;

    let attempts = 0;
    const maxAttempts = 10;
    const interval = setInterval(async () => {
      attempts += 1;
      const res = await wakeAiService(true);
      if (res && res.ready) {
        setAiStatus("ready");
        clearInterval(interval);
      } else if (attempts >= maxAttempts) {
        clearInterval(interval);
      }
    }, 3500);

    return () => clearInterval(interval);
  }, [aiStatus]);

  // Loading notice: If submission takes > 2.5s, inform the user about cold start warm-up
  useEffect(() => {
    let timer;
    if (isLoading) {
      timer = setTimeout(() => {
        setLoadingNotice(true);
      }, 2500);
    } else {
      setLoadingNotice(false);
    }
    return () => clearTimeout(timer);
  }, [isLoading]);

  // Form interaction listener: Wake backend and AI as soon as user focuses or types in any field
  const handleFormInteraction = () => {
    if (!wakeTriggeredRef.current || aiStatus !== "ready") {
      wakeTriggeredRef.current = true;
      triggerWake();
    }
  };

  const handleChange = (e) => {
    handleFormInteraction();
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.Gender) errors.Gender = "Please select gender.";

    const ageNum = parseInt(formData.Age, 10);
    if (!formData.Age || isNaN(ageNum) || ageNum < 15 || ageNum > 80)
      errors.Age = "Please enter a valid age (15–80).";

    const semNum = parseInt(formData.Current_semester, 10);
    if (!formData.Current_semester || isNaN(semNum) || semNum < 1 || semNum > 20)
      errors.Current_semester = "Please enter current semester (1–20).";

    const cgpaNum = parseFloat(formData.CGPA);
    if (!formData.CGPA || isNaN(cgpaNum) || cgpaNum < 0.0 || cgpaNum > 4.0)
      errors.CGPA = "Please enter CGPA between 0.00 and 4.00.";

    const costNum = parseFloat(formData.Cost_without_study);
    if (formData.Cost_without_study === "" || isNaN(costNum) || costNum < 0)
      errors.Cost_without_study = "Please enter estimated monthly living cost.";

    if (!formData.Family_background)
      errors.Family_background = "Please select family background.";
    if (!formData.Relationship_status)
      errors.Relationship_status = "Please select relationship status.";
    if (!formData.Marital_status)
      errors.Marital_status = "Please select marital status.";
    if (!formData.Living_style)
      errors.Living_style = "Please select living arrangement.";
    if (!formData.friend_circle)
      errors.friend_circle = "Please select friend circle status.";

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setApiError(null);

    if (!validateForm()) return;

    setIsLoading(true);
    const response = await submitPrediction(formData);
    setIsLoading(false);

    if (response.success) {
      setPredictionResult(response.data);
      setAiStatus("ready");
      const container = document.getElementById("form-top");
      if (container) container.scrollIntoView({ behavior: "smooth" });
    } else {
      setApiError(response.error);
      if (response.isWarmingUp) {
        setAiStatus("waking");
      }
    }
  };

  const handleRetry = () => {
    triggerWake(true);
    handleSubmit();
  };

  const handleReset = () => {
    setPredictionResult(null);
    setApiError(null);
    setFormData(INITIAL_STATE);
    setFieldErrors({});
  };

  const inputBase =
    "w-full px-3.5 py-2.5 bg-white border text-sm text-foreground transition-colors focus:outline-none";
  const inputOk =
    "border-border focus:border-accent focus:ring-1 focus:ring-accent/20";
  const inputBad = "border-red-500 focus:border-red-500";

  return (
    <div id="form-top" className="w-full max-w-3xl mx-auto py-6 sm:py-8 px-4 sm:px-6">
      {!predictionResult && (
        <div className="mb-8 text-center sm:text-left">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
            <div className="inline-flex items-center gap-2">
              <span className="w-2 h-2 bg-accent"></span>
              <span className="text-[11px] font-mono tracking-[0.2em] uppercase font-semibold text-muted">
                AI-Powered Screening
              </span>
            </div>

            {/* AI Live Engine Status Badge */}
            {aiStatus === "ready" && (
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-mono font-medium text-emerald-800 bg-emerald-50 border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                AI Engine Online &amp; Ready
              </div>
            )}

            {aiStatus === "waking" && (
              <div
                className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-mono font-medium text-amber-800 bg-amber-50 border border-amber-200"
                title="Waking AI service from standby. It will be ready before you finish filling details."
              >
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping"></span>
                Waking AI Engine (Warm-Up in Progress)…
              </div>
            )}

            {(aiStatus === "standby" || aiStatus === "checking") && (
              <button
                type="button"
                onClick={() => triggerWake(true)}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-mono font-medium text-navy-deep bg-blue-50/70 border border-blue-200 hover:bg-blue-100 transition-colors"
                title="Click to ping and wake the AI service"
              >
                <Zap className="w-3 h-3 text-accent" />
                AI Standby (Click to Wake)
              </button>
            )}
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-navy-deep tracking-tight leading-tight">
            Student Depression Risk Assessment
          </h1>
          <p className="text-sm text-muted mt-3 max-w-2xl leading-relaxed">
            Complete the fields below to receive an instant, research-backed AI
            prediction of student depression risk. All information stays on your
            device during assessment.
          </p>
        </div>
      )}

      {predictionResult ? (
        <PredictionResult result={predictionResult} onReset={handleReset} />
      ) : (
        <form
          onSubmit={handleSubmit}
          onFocusCapture={handleFormInteraction}
          onChangeCapture={handleFormInteraction}
          noValidate
          className="space-y-6"
        >
          {apiError && (
            <div
              role="alert"
              className="p-4 bg-red-50 border-l-4 border-red-500 text-red-900 text-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm"
            >
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-red-600" />
                <div>
                  <h4 className="font-semibold text-xs uppercase tracking-wider text-red-800">
                    Service Notice
                  </h4>
                  <p className="mt-1 text-xs sm:text-sm text-red-700">{apiError}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleRetry}
                disabled={isLoading}
                className="self-start sm:self-center inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white text-xs font-semibold tracking-wide transition-colors flex-shrink-0 shadow-sm"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
                Wake AI &amp; Retry
              </button>
            </div>
          )}

          {/* Card 1 */}
          <div className="bg-surface border border-border p-5 sm:p-7 shadow-sm">
            <h2 className="text-xs font-mono uppercase tracking-wider text-accent font-semibold mb-4 pb-3 border-b border-border flex items-center gap-2">
              <span className="w-5 h-5 bg-blue-50 text-accent border border-blue-200 flex items-center justify-center text-[10px]">
                1
              </span>
              Personal Details
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label
                  htmlFor="field-gender"
                  className="block text-xs font-semibold uppercase tracking-wider text-navy-deep mb-1.5"
                >
                  Gender <span className="text-accent">*</span>
                </label>
                <select
                  id="field-gender"
                  name="Gender"
                  value={formData.Gender}
                  onChange={handleChange}
                  onFocus={handleFormInteraction}
                  className={`${inputBase} ${
                    fieldErrors.Gender ? inputBad : inputOk
                  }`}
                >
                  <option value="">Select Gender…</option>
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                </select>
                {fieldErrors.Gender && (
                  <p className="mt-1 text-xs text-red-600">{fieldErrors.Gender}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="field-age"
                  className="block text-xs font-semibold uppercase tracking-wider text-navy-deep mb-1.5"
                >
                  Age (Years) <span className="text-accent">*</span>
                </label>
                <input
                  type="number"
                  id="field-age"
                  name="Age"
                  min="15"
                  max="80"
                  placeholder="e.g. 21"
                  value={formData.Age}
                  onChange={handleChange}
                  onFocus={handleFormInteraction}
                  className={`${inputBase} ${
                    fieldErrors.Age ? inputBad : inputOk
                  }`}
                />
                {fieldErrors.Age && (
                  <p className="mt-1 text-xs text-red-600">{fieldErrors.Age}</p>
                )}
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-surface border border-border p-5 sm:p-7 shadow-sm">
            <h2 className="text-xs font-mono uppercase tracking-wider text-accent font-semibold mb-4 pb-3 border-b border-border flex items-center gap-2">
              <span className="w-5 h-5 bg-blue-50 text-accent border border-blue-200 flex items-center justify-center text-[10px]">
                2
              </span>
              Academic Profile
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label
                  htmlFor="field-semester"
                  className="block text-xs font-semibold uppercase tracking-wider text-navy-deep mb-1.5"
                >
                  Current Semester <span className="text-accent">*</span>
                </label>
                <input
                  type="number"
                  id="field-semester"
                  name="Current_semester"
                  min="1"
                  max="20"
                  placeholder="e.g. 6"
                  value={formData.Current_semester}
                  onChange={handleChange}
                  onFocus={handleFormInteraction}
                  className={`${inputBase} ${
                    fieldErrors.Current_semester ? inputBad : inputOk
                  }`}
                />
                {fieldErrors.Current_semester && (
                  <p className="mt-1 text-xs text-red-600">
                    {fieldErrors.Current_semester}
                  </p>
                )}
                <span className="text-[11px] text-muted block mt-1">
                  Academic term (1 to 12)
                </span>
              </div>

              <div>
                <label
                  htmlFor="field-cgpa"
                  className="block text-xs font-semibold uppercase tracking-wider text-navy-deep mb-1.5"
                >
                  CGPA (Scale of 4.00) <span className="text-accent">*</span>
                </label>
                <input
                  type="number"
                  id="field-cgpa"
                  name="CGPA"
                  min="0.00"
                  max="4.00"
                  step="0.01"
                  placeholder="e.g. 3.45"
                  value={formData.CGPA}
                  onChange={handleChange}
                  onFocus={handleFormInteraction}
                  className={`${inputBase} ${
                    fieldErrors.CGPA ? inputBad : inputOk
                  }`}
                />
                {fieldErrors.CGPA && (
                  <p className="mt-1 text-xs text-red-600">{fieldErrors.CGPA}</p>
                )}
                <span className="text-[11px] text-muted block mt-1">
                  Cumulative Grade Point Average
                </span>
              </div>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-surface border border-border p-5 sm:p-7 shadow-sm">
            <h2 className="text-xs font-mono uppercase tracking-wider text-accent font-semibold mb-4 pb-3 border-b border-border flex items-center gap-2">
              <span className="w-5 h-5 bg-blue-50 text-accent border border-blue-200 flex items-center justify-center text-[10px]">
                3
              </span>
              Social &amp; Living Context
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label
                  htmlFor="field-family"
                  className="block text-xs font-semibold uppercase tracking-wider text-navy-deep mb-1.5"
                >
                  Family Background <span className="text-accent">*</span>
                </label>
                <select
                  id="field-family"
                  name="Family_background"
                  value={formData.Family_background}
                  onChange={handleChange}
                  onFocus={handleFormInteraction}
                  className={`${inputBase} ${
                    fieldErrors.Family_background ? inputBad : inputOk
                  }`}
                >
                  <option value="">Select Background…</option>
                  <option value="Lower Middle class">Lower Middle class</option>
                  <option value="Middle class">Middle class</option>
                  <option value="Rich class">Rich / High income</option>
                </select>
                {fieldErrors.Family_background && (
                  <p className="mt-1 text-xs text-red-600">
                    {fieldErrors.Family_background}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="field-relationship"
                  className="block text-xs font-semibold uppercase tracking-wider text-navy-deep mb-1.5"
                >
                  Relationship Status <span className="text-accent">*</span>
                </label>
                <select
                  id="field-relationship"
                  name="Relationship_status"
                  value={formData.Relationship_status}
                  onChange={handleChange}
                  onFocus={handleFormInteraction}
                  className={`${inputBase} ${
                    fieldErrors.Relationship_status ? inputBad : inputOk
                  }`}
                >
                  <option value="">Select Status…</option>
                  <option value="Single">Single</option>
                  <option value="In a Relationship">In a Relationship</option>
                  <option value="Complicated">Complicated</option>
                </select>
                {fieldErrors.Relationship_status && (
                  <p className="mt-1 text-xs text-red-600">
                    {fieldErrors.Relationship_status}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="field-marital"
                  className="block text-xs font-semibold uppercase tracking-wider text-navy-deep mb-1.5"
                >
                  Marital Status <span className="text-accent">*</span>
                </label>
                <select
                  id="field-marital"
                  name="Marital_status"
                  value={formData.Marital_status}
                  onChange={handleChange}
                  onFocus={handleFormInteraction}
                  className={`${inputBase} ${
                    fieldErrors.Marital_status ? inputBad : inputOk
                  }`}
                >
                  <option value="">Select Status…</option>
                  <option value="Unmarried">Unmarried</option>
                  <option value="Married">Married</option>
                  <option value="Separated">Separated</option>
                </select>
                {fieldErrors.Marital_status && (
                  <p className="mt-1 text-xs text-red-600">
                    {fieldErrors.Marital_status}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="field-living"
                  className="block text-xs font-semibold uppercase tracking-wider text-navy-deep mb-1.5"
                >
                  Living Arrangement <span className="text-accent">*</span>
                </label>
                <select
                  id="field-living"
                  name="Living_style"
                  value={formData.Living_style}
                  onChange={handleChange}
                  onFocus={handleFormInteraction}
                  className={`${inputBase} ${
                    fieldErrors.Living_style ? inputBad : inputOk
                  }`}
                >
                  <option value="">Select Arrangement…</option>
                  <option value="Family">Living with Family</option>
                  <option value="Bachelor">
                    Bachelor / Hostel / Shared Apartment
                  </option>
                </select>
                {fieldErrors.Living_style && (
                  <p className="mt-1 text-xs text-red-600">
                    {fieldErrors.Living_style}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="field-friend"
                  className="block text-xs font-semibold uppercase tracking-wider text-navy-deep mb-1.5"
                >
                  Close Supportive Friends <span className="text-accent">*</span>
                </label>
                <select
                  id="field-friend"
                  name="friend_circle"
                  value={formData.friend_circle}
                  onChange={handleChange}
                  onFocus={handleFormInteraction}
                  className={`${inputBase} ${
                    fieldErrors.friend_circle ? inputBad : inputOk
                  }`}
                >
                  <option value="">Select…</option>
                  <option value="Yes">Yes — has close supportive friends</option>
                  <option value="No">No — lacks close peer support</option>
                </select>
                {fieldErrors.friend_circle && (
                  <p className="mt-1 text-xs text-red-600">
                    {fieldErrors.friend_circle}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="field-cost"
                  className="block text-xs font-semibold uppercase tracking-wider text-navy-deep mb-1.5"
                >
                  Monthly Living Expenses <span className="text-accent">*</span>
                </label>
                <input
                  type="number"
                  id="field-cost"
                  name="Cost_without_study"
                  min="0"
                  step="50"
                  placeholder="e.g. 5000"
                  value={formData.Cost_without_study}
                  onChange={handleChange}
                  onFocus={handleFormInteraction}
                  className={`${inputBase} ${
                    fieldErrors.Cost_without_study ? inputBad : inputOk
                  }`}
                />
                {fieldErrors.Cost_without_study && (
                  <p className="mt-1 text-xs text-red-600">
                    {fieldErrors.Cost_without_study}
                  </p>
                )}
                <span className="text-[11px] text-muted block mt-1">
                  Living &amp; personal expenses excluding tuition
                </span>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 bg-accent hover:bg-accent-hover disabled:bg-muted text-white text-sm font-semibold tracking-wide transition-colors focus:outline-none disabled:cursor-not-allowed shadow-sm"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {aiStatus === "waking"
                    ? "Waking AI Model & Analyzing…"
                    : "Analyzing Assessment…"}
                </>
              ) : (
                <>
                  <Brain className="w-4 h-4 mr-2" />
                  Run Depression Risk Prediction
                </>
              )}
            </button>

            {isLoading && loadingNotice && (
              <p className="mt-2.5 text-xs text-muted font-mono flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
                Waking AI inference service from cold standby... (free-tier cold starts may take ~15–30s)
              </p>
            )}
          </div>
        </form>
      )}
    </div>
  );
}
