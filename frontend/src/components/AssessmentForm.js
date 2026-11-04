"use client";

import { useState } from "react";
import { submitPrediction } from "../lib/api";
import PredictionResult from "./PredictionResult";
import { AlertCircle, Loader2, Sparkles, RotateCcw } from "lucide-react";

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

// Preset reference student cases for 1-click test
const BENCHMARK_SAMPLES = [
  {
    label: "Sample Case: Student Experiencing High Stress",
    data: {
      Gender: "Female",
      Age: "22",
      Family_background: "Lower Middle class",
      Relationship_status: "Complicated",
      Marital_status: "Unmarried",
      Living_style: "Bachelor",
      Current_semester: "7",
      CGPA: "2.90",
      friend_circle: "No",
      Cost_without_study: "8000",
    },
  },
  {
    label: "Sample Case: Student with Supportive Environment",
    data: {
      Gender: "Male",
      Age: "21",
      Family_background: "Middle class",
      Relationship_status: "In a Relationship",
      Marital_status: "Unmarried",
      Living_style: "Family",
      Current_semester: "4",
      CGPA: "3.75",
      friend_circle: "Yes",
      Cost_without_study: "3500",
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
      errors.Gender = "Please select gender.";
    }

    const ageNum = parseInt(formData.Age, 10);
    if (!formData.Age || isNaN(ageNum) || ageNum < 15 || ageNum > 80) {
      errors.Age = "Please enter a valid age (15-80).";
    }

    const semNum = parseInt(formData.Current_semester, 10);
    if (
      !formData.Current_semester ||
      isNaN(semNum) ||
      semNum < 1 ||
      semNum > 20
    ) {
      errors.Current_semester = "Please enter current semester (1-20).";
    }

    const cgpaNum = parseFloat(formData.CGPA);
    if (!formData.CGPA || isNaN(cgpaNum) || cgpaNum < 0.0 || cgpaNum > 4.0) {
      errors.CGPA = "Please enter CGPA between 0.00 and 4.00.";
    }

    const costNum = parseFloat(formData.Cost_without_study);
    if (
      formData.Cost_without_study === "" ||
      isNaN(costNum) ||
      costNum < 0
    ) {
      errors.Cost_without_study = "Please enter estimated monthly living cost.";
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
      errors.Living_style = "Please select living arrangement.";
    }

    if (!formData.friend_circle) {
      errors.friend_circle = "Please select friend circle status.";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError(null);

    if (!validateForm()) return;

    setIsLoading(true);
    const response = await submitPrediction(formData);
    setIsLoading(false);

    if (response.success) {
      setPredictionResult(response.data);
      const container = document.getElementById("form-top");
      if (container) {
        container.scrollIntoView({ behavior: "smooth" });
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
    <div id="form-top" className="w-full max-w-3xl mx-auto py-8 px-4 sm:px-6">
      {/* Intro Header */}
      {!predictionResult && (
        <div className="mb-8 text-center sm:text-left border-b border-border pb-6">
          <div className="inline-flex items-center gap-2 mb-2">
            <span className="w-2 h-2 bg-emerald-accent"></span>
            <span className="text-[11px] font-mono tracking-widest uppercase font-semibold text-muted">
              UNIVERSAL AI ASSESSMENT
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-semibold text-foreground tracking-tight">
            Student Wellbeing &amp; Depression Check
          </h1>
          <p className="text-sm text-muted mt-2 max-w-2xl leading-relaxed">
            Fill in the details below to receive an instant, research-backed AI assessment of student wellbeing.
            Works for students anywhere in the world.
          </p>

          {/* Quick Benchmark buttons */}
          <div className="mt-5 pt-4 border-t border-border flex flex-wrap items-center gap-2 text-xs">
            <span className="text-muted font-medium flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-emerald-accent" />
              Try a sample student:
            </span>
            {BENCHMARK_SAMPLES.map((sample, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleApplyPreset(sample.data)}
                className="px-3 py-1.5 bg-surface hover:bg-subtle text-foreground border border-border transition-colors text-xs"
              >
                {sample.label}
              </button>
            ))}
            <button
              type="button"
              onClick={() => {
                setFormData(INITIAL_STATE);
                setFieldErrors({});
                setApiError(null);
              }}
              className="px-2 py-1.5 text-muted hover:text-foreground text-xs inline-flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" /> Reset
            </button>
          </div>
        </div>
      )}

      {/* Main View: Result or Form */}
      {predictionResult ? (
        <PredictionResult result={predictionResult} onReset={handleReset} />
      ) : (
        <form onSubmit={handleSubmit} noValidate className="space-y-6">
          {/* Service Error Alert */}
          {apiError && (
            <div
              role="alert"
              className="p-4 bg-red-50 border-l-4 border-red-500 text-red-800 text-sm flex items-start gap-3"
            >
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-red-600" />
              <div>
                <h4 className="font-semibold text-xs uppercase tracking-wider">
                  Notice
                </h4>
                <p className="mt-1 text-xs sm:text-sm">{apiError}</p>
              </div>
            </div>
          )}

          {/* Card 1: Personal & Demographic Info */}
          <div className="bg-surface border border-border p-6 sm:p-7">
            <h2 className="text-xs font-mono uppercase tracking-wider text-muted font-semibold mb-4 pb-2 border-b border-border">
              1. Personal Details
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
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
                    fieldErrors.Gender ? "border-red-500" : "border-border"
                  } text-sm text-foreground focus:outline-none focus:border-emerald-accent`}
                >
                  <option value="">Select Gender...</option>
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                </select>
                {fieldErrors.Gender && (
                  <p className="mt-1 text-xs text-red-600">{fieldErrors.Gender}</p>
                )}
              </div>

              {/* Age */}
              <div>
                <label
                  htmlFor="field-age"
                  className="block text-xs font-semibold uppercase tracking-wider text-foreground mb-1.5"
                >
                  Age (Years) <span className="text-emerald-secondary">*</span>
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
                  className={`w-full px-3.5 py-2.5 bg-background border ${
                    fieldErrors.Age ? "border-red-500" : "border-border"
                  } text-sm text-foreground focus:outline-none focus:border-emerald-accent`}
                />
                {fieldErrors.Age && (
                  <p className="mt-1 text-xs text-red-600">{fieldErrors.Age}</p>
                )}
              </div>
            </div>
          </div>

          {/* Card 2: Academic Profile */}
          <div className="bg-surface border border-border p-6 sm:p-7">
            <h2 className="text-xs font-mono uppercase tracking-wider text-muted font-semibold mb-4 pb-2 border-b border-border">
              2. Academic Profile
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Current Semester */}
              <div>
                <label
                  htmlFor="field-semester"
                  className="block text-xs font-semibold uppercase tracking-wider text-foreground mb-1.5"
                >
                  Current Semester <span className="text-emerald-secondary">*</span>
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
                  className={`w-full px-3.5 py-2.5 bg-background border ${
                    fieldErrors.Current_semester ? "border-red-500" : "border-border"
                  } text-sm text-foreground focus:outline-none focus:border-emerald-accent`}
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

              {/* CGPA */}
              <div>
                <label
                  htmlFor="field-cgpa"
                  className="block text-xs font-semibold uppercase tracking-wider text-foreground mb-1.5"
                >
                  CGPA (Scale of 4.00) <span className="text-emerald-secondary">*</span>
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
                  className={`w-full px-3.5 py-2.5 bg-background border ${
                    fieldErrors.CGPA ? "border-red-500" : "border-border"
                  } text-sm text-foreground focus:outline-none focus:border-emerald-accent`}
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

          {/* Card 3: Social, Living & Financial Context */}
          <div className="bg-surface border border-border p-6 sm:p-7">
            <h2 className="text-xs font-mono uppercase tracking-wider text-muted font-semibold mb-4 pb-2 border-b border-border">
              3. Social &amp; Living Context
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Family Background */}
              <div>
                <label
                  htmlFor="field-family"
                  className="block text-xs font-semibold uppercase tracking-wider text-foreground mb-1.5"
                >
                  Family Financial Background <span className="text-emerald-secondary">*</span>
                </label>
                <select
                  id="field-family"
                  name="Family_background"
                  value={formData.Family_background}
                  onChange={handleChange}
                  className={`w-full px-3.5 py-2.5 bg-background border ${
                    fieldErrors.Family_background ? "border-red-500" : "border-border"
                  } text-sm text-foreground focus:outline-none focus:border-emerald-accent`}
                >
                  <option value="">Select Background...</option>
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
                    fieldErrors.Relationship_status ? "border-red-500" : "border-border"
                  } text-sm text-foreground focus:outline-none focus:border-emerald-accent`}
                >
                  <option value="">Select Status...</option>
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
                    fieldErrors.Marital_status ? "border-red-500" : "border-border"
                  } text-sm text-foreground focus:outline-none focus:border-emerald-accent`}
                >
                  <option value="">Select Status...</option>
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

              {/* Living Arrangement */}
              <div>
                <label
                  htmlFor="field-living"
                  className="block text-xs font-semibold uppercase tracking-wider text-foreground mb-1.5"
                >
                  Living Arrangement <span className="text-emerald-secondary">*</span>
                </label>
                <select
                  id="field-living"
                  name="Living_style"
                  value={formData.Living_style}
                  onChange={handleChange}
                  className={`w-full px-3.5 py-2.5 bg-background border ${
                    fieldErrors.Living_style ? "border-red-500" : "border-border"
                  } text-sm text-foreground focus:outline-none focus:border-emerald-accent`}
                >
                  <option value="">Select Arrangement...</option>
                  <option value="Family">Living with Family</option>
                  <option value="Bachelor">Bachelor / Hostel / Shared Apartment</option>
                </select>
                {fieldErrors.Living_style && (
                  <p className="mt-1 text-xs text-red-600">
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
                  Close Supportive Friends <span className="text-emerald-secondary">*</span>
                </label>
                <select
                  id="field-friend"
                  name="friend_circle"
                  value={formData.friend_circle}
                  onChange={handleChange}
                  className={`w-full px-3.5 py-2.5 bg-background border ${
                    fieldErrors.friend_circle ? "border-red-500" : "border-border"
                  } text-sm text-foreground focus:outline-none focus:border-emerald-accent`}
                >
                  <option value="">Select...</option>
                  <option value="Yes">Yes (Has close supportive friends)</option>
                  <option value="No">No (Lacks close peer support)</option>
                </select>
                {fieldErrors.friend_circle && (
                  <p className="mt-1 text-xs text-red-600">
                    {fieldErrors.friend_circle}
                  </p>
                )}
              </div>

              {/* Living Cost */}
              <div>
                <label
                  htmlFor="field-cost"
                  className="block text-xs font-semibold uppercase tracking-wider text-foreground mb-1.5"
                >
                  Monthly Living Expenses <span className="text-emerald-secondary">*</span>
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
                    fieldErrors.Cost_without_study ? "border-red-500" : "border-border"
                  } text-sm text-foreground focus:outline-none focus:border-emerald-accent`}
                />
                {fieldErrors.Cost_without_study && (
                  <p className="mt-1 text-xs text-red-600">
                    {fieldErrors.Cost_without_study}
                  </p>
                )}
                <span className="text-[11px] text-muted block mt-1">
                  Living &amp; personal expenses excluding direct tuition
                </span>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 bg-emerald-accent hover:bg-emerald-secondary disabled:bg-muted text-white text-sm font-medium tracking-wide transition-colors border border-emerald-secondary focus:outline-none disabled:cursor-not-allowed shadow-sm"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Analyzing Assessment...
                </>
              ) : (
                "Check Depression Risk Status"
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
