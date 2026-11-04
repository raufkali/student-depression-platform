"use client";

import { useState } from "react";
import { AlertCircle, CheckCircle, ChevronDown, ChevronUp, RefreshCw, HeartHandshake, ShieldCheck } from "lucide-react";

export default function PredictionResult({ result, onReset }) {
  const [showTechnicalDetails, setShowTechnicalDetails] = useState(false);

  if (!result) return null;

  const { experimental_prediction, decision_score, threshold } = result;
  const isDepressedRisk = experimental_prediction === "Yes";

  return (
    <div className="w-full bg-surface border border-border p-6 sm:p-10 shadow-sm animate-fadeIn">
      {/* Direct Status Header */}
      <div className="flex items-center gap-3 pb-6 border-b border-border">
        {isDepressedRisk ? (
          <div className="w-12 h-12 bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center flex-shrink-0">
            <AlertCircle className="w-6 h-6 stroke-[2]" />
          </div>
        ) : (
          <div className="w-12 h-12 bg-emerald-50 border border-emerald-200 text-emerald-secondary flex items-center justify-center flex-shrink-0">
            <CheckCircle className="w-6 h-6 stroke-[2]" />
          </div>
        )}

        <div>
          <span className="text-[11px] font-mono uppercase tracking-widest text-muted block">
            AI ASSESSMENT RESULT
          </span>
          <h2 className="text-xl sm:text-2xl font-serif font-semibold text-foreground mt-0.5">
            {isDepressedRisk ? (
              <span className="text-amber-800">
                Yes — The student could be at risk of depression
              </span>
            ) : (
              <span className="text-emerald-secondary">
                No — The student is unlikely to be depressed
              </span>
            )}
          </h2>
        </div>
      </div>

      {/* Human-Readable Explanation */}
      <div className="py-6 space-y-4">
        {isDepressedRisk ? (
          <div className="bg-[#FFFBEB] border-l-4 border-amber-500 p-4 sm:p-5">
            <h3 className="text-sm font-semibold text-amber-900 uppercase tracking-wide mb-1 flex items-center gap-2">
              <HeartHandshake className="w-4 h-4 text-amber-700" />
              What this means
            </h3>
            <p className="text-sm text-amber-900/90 leading-relaxed">
              Based on the academic load, relationship factors, living situation, and social circles provided,
              the AI model identified patterns commonly associated with elevated student depression and emotional strain.
            </p>
          </div>
        ) : (
          <div className="bg-[#ECFDF5] border-l-4 border-emerald-600 p-4 sm:p-5">
            <h3 className="text-sm font-semibold text-emerald-900 uppercase tracking-wide mb-1 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              What this means
            </h3>
            <p className="text-sm text-emerald-900/90 leading-relaxed">
              Based on the submitted information, the student&apos;s attributes align with positive wellbeing patterns,
              showing low risk of depression.
            </p>
          </div>
        )}

        {/* Helpful Recommendations */}
        <div className="border border-border p-5 bg-subtle/50">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground mb-3">
            {isDepressedRisk ? "Recommended Steps & Support" : "Healthy Habits & Maintenance"}
          </h4>

          {isDepressedRisk ? (
            <ul className="space-y-2 text-sm text-muted">
              <li className="flex items-start gap-2">
                <span className="text-emerald-secondary font-bold">•</span>
                <span><strong>Speak with someone:</strong> Reach out to an academic counselor, campus wellbeing center, or trusted friend.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-secondary font-bold">•</span>
                <span><strong>Manage academic workload:</strong> Discuss semester pacing or deadline extensions if stress feels unmanageable.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-secondary font-bold">•</span>
                <span><strong>Stay socially connected:</strong> Even brief conversations with peers or family can alleviate feelings of isolation.</span>
              </li>
            </ul>
          ) : (
            <ul className="space-y-2 text-sm text-muted">
              <li className="flex items-start gap-2">
                <span className="text-emerald-secondary font-bold">•</span>
                <span><strong>Maintain social connections:</strong> Keep nurturing supportive friendships and peer groups.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-secondary font-bold">•</span>
                <span><strong>Balance study and rest:</strong> Prioritize regular sleep, exercise, and leisure alongside academic goals.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-secondary font-bold">•</span>
                <span><strong>Be there for peers:</strong> Look out for friends who might be struggling through stressful semesters.</span>
              </li>
            </ul>
          )}
        </div>
      </div>

      {/* Optional Technical Details Toggle */}
      <div className="pt-2 pb-4">
        <button
          type="button"
          onClick={() => setShowTechnicalDetails(!showTechnicalDetails)}
          className="text-xs text-muted hover:text-foreground inline-flex items-center gap-1 font-mono transition-colors"
        >
          {showTechnicalDetails ? (
            <>
              Hide Technical Model Details <ChevronUp className="w-3.5 h-3.5" />
            </>
          ) : (
            <>
              Show Technical Model Details <ChevronDown className="w-3.5 h-3.5" />
            </>
          )}
        </button>

        {showTechnicalDetails && (
          <div className="mt-3 p-4 bg-background border border-border font-mono text-xs text-muted space-y-1.5 animate-fadeIn">
            <div className="flex justify-between">
              <span>Model Classification:</span>
              <strong className="text-foreground">{experimental_prediction}</strong>
            </div>
            <div className="flex justify-between">
              <span>Decision Score:</span>
              <span className="text-foreground">{decision_score.toFixed(4)}</span>
            </div>
            <div className="flex justify-between">
              <span>Calibrated Cutoff Threshold:</span>
              <span className="text-foreground">{threshold.toFixed(4)}</span>
            </div>
            <div className="flex justify-between">
              <span>Distance to Boundary:</span>
              <span className="text-foreground">{(decision_score - threshold).toFixed(4)}</span>
            </div>
          </div>
        )}
      </div>

      {/* Action Button & Disclaimer */}
      <div className="pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
        <button
          type="button"
          onClick={onReset}
          className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 bg-emerald-accent hover:bg-emerald-secondary text-white text-sm font-medium transition-colors border border-emerald-secondary rounded-none"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Assess Another Student
        </button>

        <p className="text-[11px] text-muted text-center sm:text-right max-w-sm">
          <strong>Important:</strong> This is an AI screening tool for educational awareness, not a clinical psychiatric diagnosis.
        </p>
      </div>
    </div>
  );
}
