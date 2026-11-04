"use client";

export default function PredictionResult({ result, onReset }) {
  if (!result) return null;

  const { experimental_prediction, decision_score, threshold, disclaimer } =
    result;

  const isYes = experimental_prediction === "Yes";
  const scoreDiff = (decision_score - threshold).toFixed(4);

  // Calculate visualization position on the scale between -3.0 and +3.0
  const clamp = (val, min, max) => Math.min(Math.max(val, min), max);
  const minRange = -3.0;
  const maxRange = 3.0;
  const rangeSpan = maxRange - minRange;

  const thresholdPercent = clamp(
    ((threshold - minRange) / rangeSpan) * 100,
    5,
    95
  );
  const scorePercent = clamp(
    ((decision_score - minRange) / rangeSpan) * 100,
    5,
    95
  );

  return (
    <div className="border border-border bg-surface p-6 sm:p-10 text-left">
      {/* Header Eyebrow */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-4 mb-6 border-b border-border">
        <div className="flex items-center gap-2">
          <span
            className={`w-2.5 h-2.5 ${
              isYes ? "bg-amber-600" : "bg-emerald-secondary"
            }`}
          ></span>
          <span className="font-mono text-xs uppercase tracking-widest text-muted">
            OUTPUT ARCHIVE · RECORD ID #{Math.floor(100000 + Math.random() * 900000)}
          </span>
        </div>
        <span className="font-mono text-xs text-muted">
          MODEL: SUPPORT VECTOR CLASSIFIER
        </span>
      </div>

      {/* Main Classification Result Badge */}
      <div className="mb-8">
        <span className="text-xs uppercase tracking-wider text-muted font-mono block mb-2">
          Experimental Model Classification
        </span>
        <div className="flex items-baseline gap-4">
          <h3 className="font-serif text-3xl sm:text-4xl text-foreground font-medium">
            Category:{" "}
            <span
              className={
                isYes ? "text-[#9A3412]" : "text-emerald-secondary"
              }
            >
              {experimental_prediction}
            </span>
          </h3>
          <span className="font-mono text-xs text-muted border border-border px-2.5 py-1 bg-subtle">
            Binary Label: {isYes ? "Positive Class [1]" : "Negative Class [0]"}
          </span>
        </div>

        {/* Exact Required Phrasing */}
        <p className="mt-4 text-sm sm:text-base text-foreground/90 leading-relaxed max-w-3xl">
          {isYes
            ? "The model classified this submitted record into the Yes category based on patterns learned from the research dataset."
            : "The model classified this submitted record into the No category based on patterns learned from the research dataset."}
        </p>
      </div>

      {/* Statistical Values Plate */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-5 bg-subtle border border-border mb-8">
        <div>
          <span className="text-[11px] uppercase tracking-wider text-muted font-mono block">
            Computed Decision Score
          </span>
          <span className="font-mono text-lg text-foreground font-semibold block mt-1">
            {typeof decision_score === "number"
              ? decision_score.toFixed(6)
              : decision_score}
          </span>
          <span className="text-[11px] text-muted block mt-0.5">
            Perpendicular signed distance
          </span>
        </div>

        <div className="border-t sm:border-t-0 sm:border-l border-border pt-3 sm:pt-0 sm:pl-4">
          <span className="text-[11px] uppercase tracking-wider text-muted font-mono block">
            Calibrated Threshold (τ)
          </span>
          <span className="font-mono text-lg text-foreground font-semibold block mt-1">
            {typeof threshold === "number"
              ? threshold.toFixed(6)
              : threshold}
          </span>
          <span className="text-[11px] text-muted block mt-0.5">
            Validation cut-point
          </span>
        </div>

        <div className="border-t sm:border-t-0 sm:border-l border-border pt-3 sm:pt-0 sm:pl-4">
          <span className="text-[11px] uppercase tracking-wider text-muted font-mono block">
            Threshold Differential
          </span>
          <span
            className={`font-mono text-lg font-semibold block mt-1 ${
              Number(scoreDiff) >= 0 ? "text-[#9A3412]" : "text-emerald-secondary"
            }`}
          >
            {Number(scoreDiff) >= 0 ? `+${scoreDiff}` : scoreDiff}
          </span>
          <span className="text-[11px] text-muted block mt-0.5">
            Distance from margin boundary
          </span>
        </div>
      </div>

      {/* Decision Boundary Scale Graphic */}
      <div className="border border-border p-5 bg-surface mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="font-mono text-xs uppercase tracking-wider text-muted">
            Decision Space Alignment
          </span>
          <span className="font-mono text-xs text-muted">
            Cutoff Rule: Score ≥ τ → Yes
          </span>
        </div>

        {/* Track */}
        <div className="relative h-9 bg-subtle border border-border my-4">
          {/* Threshold marker line */}
          <div
            className="absolute top-0 bottom-0 w-[2px] bg-foreground z-10"
            style={{ left: `${thresholdPercent}%` }}
          >
            <div className="absolute -top-6 -translate-x-1/2 whitespace-nowrap font-mono text-[10px] text-foreground font-semibold bg-surface border border-border px-1 py-0.5">
              τ ({threshold.toFixed(2)})
            </div>
          </div>

          {/* Decision score marker pin */}
          <div
            className="absolute top-0 bottom-0 w-1 bg-emerald-accent z-20"
            style={{ left: `${scorePercent}%` }}
          >
            <div className="absolute -bottom-6 -translate-x-1/2 whitespace-nowrap font-mono text-[10px] text-emerald-secondary font-bold bg-surface border border-emerald-accent px-1 py-0.5">
              Score ({decision_score.toFixed(2)})
            </div>
          </div>

          {/* Region labels */}
          <div className="flex h-full text-[11px] font-mono text-muted">
            <div
              className="h-full flex items-center justify-center bg-emerald-secondary/5 border-r border-dashed border-border"
              style={{ width: `${thresholdPercent}%` }}
            >
              Region: Classified No
            </div>
            <div
              className="h-full flex items-center justify-center bg-amber-500/10"
              style={{ width: `${100 - thresholdPercent}%` }}
            >
              Region: Classified Yes
            </div>
          </div>
        </div>

        <div className="flex justify-between font-mono text-[10px] text-muted mt-8">
          <span>-3.0 (Strong Negative Evidence)</span>
          <span>0.0 (Unadjusted Hyperplane Origin)</span>
          <span>+3.0 (Strong Positive Evidence)</span>
        </div>
      </div>

      {/* Mandatory Clinical Disclaimer Alert */}
      <div className="border-l-4 border-foreground bg-subtle p-5 mb-8">
        <div className="flex items-start gap-3">
          <div className="flex-1">
            <h4 className="font-sans text-xs font-bold uppercase tracking-wider text-foreground mb-1">
              Ethical &amp; Clinical Disclaimer
            </h4>
            <p className="text-sm text-foreground/90 leading-relaxed font-normal">
              {disclaimer ||
                "This result is an experimental machine-learning classification, not a medical diagnosis or a substitute for professional mental-health assessment. The model has not been clinically validated."}
            </p>
            <p className="text-xs text-muted mt-2 leading-relaxed">
              Academic algorithms predict patterns within retrospective research
              cohorts. If you or someone you know is experiencing psychological
              distress, please consult a qualified mental healthcare provider or
              institutional counseling service.
            </p>
          </div>
        </div>
      </div>

      {/* Return Button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 border-t border-border">
        <span className="text-xs text-muted">
          All values derived dynamically from the Scikit-learn SVM model.
        </span>
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center justify-center px-6 py-3 bg-surface hover:bg-subtle text-foreground text-sm font-medium border border-border transition-colors duration-150 focus:outline-none"
        >
          ← Return to Form &amp; Submit Another Record
        </button>
      </div>
    </div>
  );
}
