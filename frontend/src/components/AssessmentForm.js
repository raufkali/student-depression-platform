"use client";

import { useState } from "react";
import { submitPrediction } from "@/lib/api";
import PredictionResult from "./PredictionResult";
import { AlertCircle, Loader2 } from "lucide-react";

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
  Home_division: "",
};

// Preset reference records from research exploration for quick validation
const BENCHMARK_SAMPLES = [
  {
    label: "Reference Case 01 (Senior Undergrad, High Living Cost)",
    data: {
      Gender: "Female",
      Age: "22",
      Family_background: "Middle class",
      Relationship_status: "Single",
      Marital_status: "Unmarried",
      Living_style: "Family",
      Current_semester: "7",
      CGPA: "3.50",
      friend_circle: "Yes",
      Cost_without_study: "5000",
      Home_division: "Dhaka",
    },
  },
  {
    label: "Reference Case 02 (Junior Undergrad, Bachelor Style)",
    data: {
      Gender: "Male",
      Age: "21",
      Family_background: "Rich class",
      Relationship_status: "In a Relationship",
      Marital_status: "Unmarried",
      Living_style: "Bachelor",
      Current_semester: "4",
      CGPA: "3.80",
      friend_circle: "Yes",
      Cost_without_study: "3500",
      Home_division: "Chittagong",
    },
  },
];

export default function AssessmentForm() {
  const [formData, setFormData] = useState(INITIAL_STATE);
  const [fieldErrors, setFieldErrors] = useState({});
  const [apiError, setApiError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [predictionResult, setPredictionResult] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear field-specific error upon typing
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

    if (!formData.Gender) {
      errors.Gender = "Please select a gender option.";
    }

    const ageNum = parseInt(formData.Age, 10);
    if (!formData.Age || isNaN(ageNum) || ageNum < 16 || ageNum > 80) {
      errors.Age = "Age must be an integer between 16 and 80.";
    }

    const semNum = parseInt(formData.Current_semester, 10);
    if (
      !formData.Current_semester ||
      isNaN(semNum) ||
      semNum < 1 ||
      semNum > 20
    ) {
      errors.Current_semester = "Semester must be an integer between 1 and 20.";
    }

    const cgpaNum = parseFloat(formData.CGPA);
    if (!formData.CGPA || isNaN(cgpaNum) || cgpaNum < 0.0 || cgpaNum > 4.0) {
      errors.CGPA = "CGPA must be a valid decimal between 0.00 and 4.00.";
    }

    const costNum = parseFloat(formData.Cost_without_study);
    if (
      formData.Cost_without_study === "" ||
      isNaN(costNum) ||
      costNum < 0
    ) {
      errors.Cost_without_study =
        "Cost without study must be a non-negative number.";
    }

    if (!formData.Family_background) {
      errors.Family_background = "Please select family background.";
    }

    if (!formData.Relationship_status) {
      errors.Relationship_status = "Please select relationship status.";
    }

    if (!formData.Marital_status) {
      errors.Marital_status = "Please select marital status.";
    }

    if (!formData.Living_style) {
      errors.Living_style = "Please select living style.";
    }

    if (!formData.friend_circle) {
      errors.friend_circle = "Please select friend circle status.";
    }

    if (!formData.Home_division) {
      errors.Home_division = "Please select home division.";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError(null);

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    const response = await submitPrediction(formData);

    setIsLoading(false);

    if (response.success) {
      setPredictionResult(response.data);
      // Smoothly scroll down to results
      const element = document.getElementById("assessment-container");
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      setApiError(response.error);
    }
  };

  const handleReset = () => {
    setPredictionResult(null);
    setApiError(null);
  };

  const handleApplyPreset = (sampleData) => {
    setFormData(sampleData);
    setFieldErrors({});
    setApiError(null);
  };

  return (
    <section id="assessment" className="border-b border-border bg-background py-20 md:py-28">
      <div id="assessment-container" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-12 border-b border-border pb-8">
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="font-sans text-xs tracking-[0.2em] uppercase font-semibold text-muted">
              EMPIRICAL INFERENCE
            </span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl text-foreground font-normal tracking-tight mb-3">
            Student Research Assessment
          </h2>
          <p className="text-base text-muted font-normal leading-relaxed">
            Provide the requested information to generate an experimental model
            classification. All variables are preprocessed in accordance with
            the documented pipeline.
          </p>

          {/* Preset Buttons for Convenience */}
          {!predictionResult && (
            <div className="mt-6 pt-4 border-t border-border flex flex-wrap items-center gap-2 text-xs">
              <span className="text-muted font-mono uppercase tracking-wider">
                Quick Benchmarks:
              </span>
              {BENCHMARK_SAMPLES.map((sample, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleApplyPreset(sample.data)}
                  className="px-2.5 py-1.5 border border-border bg-surface hover:bg-subtle text-foreground text-xs font-sans transition-colors"
                >
                  Load {sample.label}
                </button>
              ))}
              <button
                type="button"
                onClick={() => {
                  setFormData(INITIAL_STATE);
                  setFieldErrors({});
                  setApiError(null);
                }}
                className="px-2.5 py-1.5 text-muted hover:text-foreground text-xs underline underline-offset-2"
              >
                Clear
              </button>
            </div>
          )}
        </div>

        {/* Dynamic Display: Result or Form */}
        {predictionResult ? (
          <PredictionResult result={predictionResult} onReset={handleReset} />
        ) : (
          <form onSubmit={handleSubmit} noValidate className="space-y-12">
            {/* Global API Error Alert */}
            {apiError && (
              <div
                role="alert"
                className="p-4 bg-[#FEF2F2] border-l-4 border-[#DC2626] text-[#991B1B] text-sm flex items-start gap-3"
              >
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-[#DC2626]" />
                <div>
                  <h4 className="font-semibold text-xs uppercase tracking-wider">
                    Service Communication Error
                  </h4>
                  <p className="mt-1 leading-relaxed text-xs sm:text-sm">
                    {apiError}
                  </p>
                </div>
              </div>
            )}

            {/* GROUP 01 — Personal Information */}
            <fieldset className="border border-border bg-surface p-6 sm:p-8">
              <legend className="px-3 font-mono text-xs uppercase tracking-wider font-semibold text-foreground bg-surface border border-border">
                Group 01 — Personal Information
              </legend>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
                {/* Gender */}
                <div>
                  <label
                    htmlFor="field-gender"
                    className="block text-xs font-semibold uppercase tracking-wider text-foreground mb-1.5"
                  >
                    Gender <span className="text-emerald-secondary">*</span>
                  </label>
                  <select
                    id="field-gender"
                    name="Gender"
                    value={formData.Gender}
                    onChange={handleChange}
                    className={`w-full px-3.5 py-2.5 bg-background border ${
                      fieldErrors.Gender ? "border-[#DC2626]" : "border-border"
                    } text-sm text-foreground focus:outline-none focus:border-emerald-accent rounded-none`}
                  >
                    <option value="">Select Gender...</option>
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                  </select>
                  {fieldErrors.Gender && (
                    <p className="mt-1 text-xs text-[#DC2626]">
                      {fieldErrors.Gender}
                    </p>
                  )}
                  <p className="mt-1 text-[11px] text-muted">
                    Included in primary SVM pipeline per documented fairness audit.
                  </p>
                </div>

                {/* Age */}
                <div>
                  <label
                    htmlFor="field-age"
                    className="block text-xs font-semibold uppercase tracking-wider text-foreground mb-1.5"
                  >
                    Age <span className="text-emerald-secondary">*</span>
                  </label>
                  <input
                    type="number"
                    id="field-age"
                    name="Age"
                    min="16"
                    max="80"
                    step="1"
                    placeholder="e.g. 22"
                    value={formData.Age}
                    onChange={handleChange}
                    className={`w-full px-3.5 py-2.5 bg-background border ${
                      fieldErrors.Age ? "border-[#DC2626]" : "border-border"
                    } text-sm text-foreground focus:outline-none focus:border-emerald-accent rounded-none`}
                  />
                  {fieldErrors.Age && (
                    <p className="mt-1 text-xs text-[#DC2626]">
                      {fieldErrors.Age}
                    </p>
                  )}
                  <p className="mt-1 text-[11px] text-muted">
                    Dataset cohort range: 18–35 (mean: 22.62 years).
                  </p>
                </div>
              </div>
            </fieldset>

            {/* GROUP 02 — Academic Information */}
            <fieldset className="border border-border bg-surface p-6 sm:p-8">
              <legend className="px-3 font-mono text-xs uppercase tracking-wider font-semibold text-foreground bg-surface border border-border">
                Group 02 — Academic Information
              </legend>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-4">
                {/* Current Semester */}
                <div>
                  <label
                    htmlFor="field-current-semester"
                    className="block text-xs font-semibold uppercase tracking-wider text-foreground mb-1.5"
                  >
                    Current Semester <span className="text-emerald-secondary">*</span>
                  </label>
                  <input
                    type="number"
                    id="field-current-semester"
                    name="Current_semester"
                    min="1"
                    max="20"
                    step="1"
                    placeholder="e.g. 7"
                    value={formData.Current_semester}
                    onChange={handleChange}
                    className={`w-full px-3.5 py-2.5 bg-background border ${
                      fieldErrors.Current_semester
                        ? "border-[#DC2626]"
                        : "border-border"
                    } text-sm text-foreground focus:outline-none focus:border-emerald-accent rounded-none`}
                  />
                  {fieldErrors.Current_semester && (
                    <p className="mt-1 text-xs text-[#DC2626]">
                      {fieldErrors.Current_semester}
                    </p>
                  )}
                  <p className="mt-1 text-[11px] text-muted">
                    Enrolled academic term (1 to 12).
                  </p>
                </div>

                {/* CGPA */}
                <div>
                  <label
                    htmlFor="field-cgpa"
                    className="block text-xs font-semibold uppercase tracking-wider text-foreground mb-1.5"
                  >
                    CGPA (Scale 4.00) <span className="text-emerald-secondary">*</span>
                  </label>
                  <input
                    type="number"
                    id="field-cgpa"
                    name="CGPA"
                    min="0.00"
                    max="4.00"
                    step="0.01"
                    placeholder="e.g. 3.50"
                    value={formData.CGPA}
                    onChange={handleChange}
                    className={`w-full px-3.5 py-2.5 bg-background border ${
                      fieldErrors.CGPA ? "border-[#DC2626]" : "border-border"
                    } text-sm text-foreground focus:outline-none focus:border-emerald-accent rounded-none`}
                  />
                  {fieldErrors.CGPA && (
                    <p className="mt-1 text-xs text-[#DC2626]">
                      {fieldErrors.CGPA}
                    </p>
                  )}
                  <p className="mt-1 text-[11px] text-muted">
                    Cumulative grade point average (mean: 3.42).
                  </p>
                </div>

                {/* Cost Without Study */}
                <div>
                  <label
                    htmlFor="field-cost"
                    className="block text-xs font-semibold uppercase tracking-wider text-foreground mb-1.5"
                  >
                    Cost Without Study (BDT) <span className="text-emerald-secondary">*</span>
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
                    className={`w-full px-3.5 py-2.5 bg-background border ${
                      fieldErrors.Cost_without_study
                        ? "border-[#DC2626]"
                        : "border-border"
                    } text-sm text-foreground focus:outline-none focus:border-emerald-accent rounded-none`}
                  />
                  {fieldErrors.Cost_without_study && (
                    <p className="mt-1 text-xs text-[#DC2626]">
                      {fieldErrors.Cost_without_study}
                    </p>
                  )}
                  <p className="mt-1 text-[11px] text-muted">
                    Monthly living expenditure excluding tuition.
                  </p>
                </div>
              </div>
            </fieldset>

            {/* GROUP 03 — Social and Living Context */}
            <fieldset className="border border-border bg-surface p-6 sm:p-8">
              <legend className="px-3 font-mono text-xs uppercase tracking-wider font-semibold text-foreground bg-surface border border-border">
                Group 03 — Social and Living Context
              </legend>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
                {/* Family Background */}
                <div>
                  <label
                    htmlFor="field-family"
                    className="block text-xs font-semibold uppercase tracking-wider text-foreground mb-1.5"
                  >
                    Family Background <span className="text-emerald-secondary">*</span>
                  </label>
                  <select
                    id="field-family"
                    name="Family_background"
                    value={formData.Family_background}
                    onChange={handleChange}
                    className={`w-full px-3.5 py-2.5 bg-background border ${
                      fieldErrors.Family_background
                        ? "border-[#DC2626]"
                        : "border-border"
                    } text-sm text-foreground focus:outline-none focus:border-emerald-accent rounded-none`}
                  >
                    <option value="">Select Status...</option>
                    <option value="Lower Middle class">Lower Middle class</option>
                    <option value="Middle class">Middle class</option>
                    <option value="Rich class">Rich class</option>
                  </select>
                  {fieldErrors.Family_background && (
                    <p className="mt-1 text-xs text-[#DC2626]">
                      {fieldErrors.Family_background}
                    </p>
                  )}
                </div>

                {/* Relationship Status */}
                <div>
                  <label
                    htmlFor="field-relationship"
                    className="block text-xs font-semibold uppercase tracking-wider text-foreground mb-1.5"
                  >
                    Relationship Status <span className="text-emerald-secondary">*</span>
                  </label>
                  <select
                    id="field-relationship"
                    name="Relationship_status"
                    value={formData.Relationship_status}
                    onChange={handleChange}
                    className={`w-full px-3.5 py-2.5 bg-background border ${
                      fieldErrors.Relationship_status
                        ? "border-[#DC2626]"
                        : "border-border"
                    } text-sm text-foreground focus:outline-none focus:border-emerald-accent rounded-none`}
                  >
                    <option value="">Select Status...</option>
                    <option value="Single">Single</option>
                    <option value="In a Relationship">In a Relationship</option>
                    <option value="Complicated">Complicated</option>
                  </select>
                  {fieldErrors.Relationship_status && (
                    <p className="mt-1 text-xs text-[#DC2626]">
                      {fieldErrors.Relationship_status}
                    </p>
                  )}
                </div>

                {/* Marital Status */}
                <div>
                  <label
                    htmlFor="field-marital"
                    className="block text-xs font-semibold uppercase tracking-wider text-foreground mb-1.5"
                  >
                    Marital Status <span className="text-emerald-secondary">*</span>
                  </label>
                  <select
                    id="field-marital"
                    name="Marital_status"
                    value={formData.Marital_status}
                    onChange={handleChange}
                    className={`w-full px-3.5 py-2.5 bg-background border ${
                      fieldErrors.Marital_status
                        ? "border-[#DC2626]"
                        : "border-border"
                    } text-sm text-foreground focus:outline-none focus:border-emerald-accent rounded-none`}
                  >
                    <option value="">Select Status...</option>
                    <option value="Unmarried">Unmarried</option>
                    <option value="Married">Married</option>
                    <option value="Separated">Separated</option>
                  </select>
                  {fieldErrors.Marital_status && (
                    <p className="mt-1 text-xs text-[#DC2626]">
                      {fieldErrors.Marital_status}
                    </p>
                  )}
                </div>

                {/* Living Style */}
                <div>
                  <label
                    htmlFor="field-living"
                    className="block text-xs font-semibold uppercase tracking-wider text-foreground mb-1.5"
                  >
                    Living Style <span className="text-emerald-secondary">*</span>
                  </label>
                  <select
                    id="field-living"
                    name="Living_style"
                    value={formData.Living_style}
                    onChange={handleChange}
                    className={`w-full px-3.5 py-2.5 bg-background border ${
                      fieldErrors.Living_style
                        ? "border-[#DC2626]"
                        : "border-border"
                    } text-sm text-foreground focus:outline-none focus:border-emerald-accent rounded-none`}
                  >
                    <option value="">Select Residence...</option>
                    <option value="Family">Family</option>
                    <option value="Bachelor">Bachelor</option>
                  </select>
                  {fieldErrors.Living_style && (
                    <p className="mt-1 text-xs text-[#DC2626]">
                      {fieldErrors.Living_style}
                    </p>
                  )}
                </div>

                {/* Friend Circle */}
                <div>
                  <label
                    htmlFor="field-friend"
                    className="block text-xs font-semibold uppercase tracking-wider text-foreground mb-1.5"
                  >
                    Close Friend Circle <span className="text-emerald-secondary">*</span>
                  </label>
                  <select
                    id="field-friend"
                    name="friend_circle"
                    value={formData.friend_circle}
                    onChange={handleChange}
                    className={`w-full px-3.5 py-2.5 bg-background border ${
                      fieldErrors.friend_circle
                        ? "border-[#DC2626]"
                        : "border-border"
                    } text-sm text-foreground focus:outline-none focus:border-emerald-accent rounded-none`}
                  >
                    <option value="">Select Availability...</option>
                    <option value="Yes">Yes (Has supportive peer circle)</option>
                    <option value="No">No (Lacks close peer circle)</option>
                  </select>
                  {fieldErrors.friend_circle && (
                    <p className="mt-1 text-xs text-[#DC2626]">
                      {fieldErrors.friend_circle}
                    </p>
                  )}
                </div>

                {/* Home Division */}
                <div>
                  <label
                    htmlFor="field-home-division"
                    className="block text-xs font-semibold uppercase tracking-wider text-foreground mb-1.5"
                  >
                    Home Division <span className="text-emerald-secondary">*</span>
                  </label>
                  <select
                    id="field-home-division"
                    name="Home_division"
                    value={formData.Home_division}
                    onChange={handleChange}
                    className={`w-full px-3.5 py-2.5 bg-background border ${
                      fieldErrors.Home_division
                        ? "border-[#DC2626]"
                        : "border-border"
                    } text-sm text-foreground focus:outline-none focus:border-emerald-accent rounded-none`}
                  >
                    <option value="">Select Division...</option>
                    <option value="Barisal">Barisal</option>
                    <option value="Chittagong">Chittagong</option>
                    <option value="Dhaka">Dhaka</option>
                    <option value="Khulna">Khulna</option>
                    <option value="Mymensingh">Mymensingh</option>
                    <option value="Rajshahi">Rajshahi</option>
                    <option value="Rangpur">Rangpur</option>
                    <option value="Sylhet">Sylhet</option>
                  </select>
                  {fieldErrors.Home_division && (
                    <p className="mt-1 text-xs text-[#DC2626]">
                      {fieldErrors.Home_division}
                    </p>
                  )}
                </div>
              </div>
            </fieldset>

            {/* Submission Actions */}
            <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              <span className="text-xs text-muted">
                * All 11 attributes are required for standardized SVM feature transformation.
              </span>

              <button
                type="submit"
                disabled={isLoading}
                className="inline-flex items-center justify-center px-8 py-3.5 bg-emerald-accent hover:bg-emerald-secondary disabled:bg-muted text-white text-sm font-medium tracking-wide transition-colors duration-150 border border-emerald-secondary focus:outline-none disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    <span>Processing Inference...</span>
                  </>
                ) : (
                  <span>Generate Research Prediction</span>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}
