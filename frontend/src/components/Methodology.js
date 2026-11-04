export default function Methodology() {
  return (
    <section id="methodology" className="border-b border-border bg-subtle py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="font-sans text-xs tracking-[0.2em] uppercase font-semibold text-muted">
              SCIENTIFIC DOCUMENTATION
            </span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl text-foreground font-normal tracking-tight mb-4">
            Research Methodology &amp; Evaluation
          </h2>
          <p className="text-base sm:text-lg text-muted font-normal leading-relaxed">
            A comprehensive overview of experimental protocols, pipeline
            transformations, target leakage mitigation, threshold calibration,
            and algorithmic fairness audits documented in the research notebooks.
          </p>
        </div>

        {/* 9-Point Editorial Grid */}
        <div className="space-y-12">
          {/* Item 01 & 02: Exploration & Target Leakage */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* 01 */}
            <div className="border border-border bg-surface p-6 sm:p-8">
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-border">
                <span className="font-serif text-2xl text-emerald-secondary font-light">
                  01
                </span>
                <span className="font-mono text-xs text-muted uppercase">
                  Dataset Exploration
                </span>
              </div>
              <h3 className="font-sans text-base font-semibold text-foreground uppercase tracking-tight mb-3">
                Dataset Exploration &amp; Demographics
              </h3>
              <p className="text-sm text-muted leading-relaxed mb-4">
                The experimental cohort comprises <strong>4,464 student records</strong> surveyed
                across Bangladesh&apos;s eight administrative divisions (Barisal,
                Chittagong, Dhaka, Khulna, Mymensingh, Rajshahi, Rangpur, Sylhet).
                Features capture personal demographics, living arrangements,
                academic standing, and non-educational subsistence expenditures.
              </p>
              <div className="bg-subtle border border-border p-3 text-xs font-mono text-muted">
                Cohort N = 4,464 · Stratified Splits: Train (70%), Val (10%), Test (20%)
              </div>
            </div>

            {/* 02 */}
            <div className="border border-border bg-surface p-6 sm:p-8">
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-border">
                <span className="font-serif text-2xl text-emerald-secondary font-light">
                  02
                </span>
                <span className="font-mono text-xs text-emerald-secondary font-semibold uppercase">
                  Data Leakage Remediation
                </span>
              </div>
              <h3 className="font-sans text-base font-semibold text-foreground uppercase tracking-tight mb-3">
                Exclusion of Health_condition (Target Leakage)
              </h3>
              <p className="text-sm text-muted leading-relaxed mb-4">
                Preliminary baseline models achieved artificial accuracy of <strong>99.66% (F1: 0.9937)</strong>.
                Empirical investigation revealed severe target leakage in the <code className="text-xs bg-subtle px-1 py-0.5 border border-border font-mono">Health_condition</code> attribute:
                100% of &apos;Critical&apos; entries were depressed, while 100% of &apos;Good&apos; entries were non-depressed.
                Purging this variable corrected the metric to a genuine, non-trivial baseline of <strong>66.52% (F1: 0.4149)</strong>.
              </p>
              <div className="bg-subtle border border-border p-3 text-xs font-mono text-muted">
                Action: Health_condition dropped from all estimator pipelines
              </div>
            </div>
          </div>

          {/* Item 03 & 04: Scaling & Encoding */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* 03 */}
            <div className="border border-border bg-surface p-6 sm:p-8">
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-border">
                <span className="font-serif text-2xl text-emerald-secondary font-light">
                  03
                </span>
                <span className="font-mono text-xs text-muted uppercase">
                  Numerical Preprocessing
                </span>
              </div>
              <h3 className="font-sans text-base font-semibold text-foreground uppercase tracking-tight mb-3">
                Numerical Feature Scaling
              </h3>
              <p className="text-sm text-muted leading-relaxed mb-4">
                Continuous numerical features are standardized via Scikit-learn <code className="text-xs bg-subtle px-1 py-0.5 border border-border font-mono">StandardScaler</code> to
                zero mean and unit variance. This prevents attributes with large magnitudes (e.g. Cost without study) from dominating SVM margin distances.
              </p>
              <div className="space-y-1.5 text-xs font-mono text-muted bg-subtle border border-border p-3">
                <div>Age: μ = 22.62, σ = 2.01</div>
                <div>Current Semester: μ = 5.42, σ = 2.58</div>
                <div>CGPA: μ = 3.42, σ = 0.39</div>
                <div>Cost Without Study: μ = 11,133.05 BDT, σ = 6,559.59 BDT</div>
              </div>
            </div>

            {/* 04 */}
            <div className="border border-border bg-surface p-6 sm:p-8">
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-border">
                <span className="font-serif text-2xl text-emerald-secondary font-light">
                  04
                </span>
                <span className="font-mono text-xs text-muted uppercase">
                  Categorical Transformations
                </span>
              </div>
              <h3 className="font-sans text-base font-semibold text-foreground uppercase tracking-tight mb-3">
                Categorical Feature Encoding
              </h3>
              <p className="text-sm text-muted leading-relaxed mb-4">
                Nominal variables are transformed using <code className="text-xs bg-subtle px-1 py-0.5 border border-border font-mono">OneHotEncoder(handle_unknown=&apos;ignore&apos;)</code>.
                This preserves unordered categorical semantics across Gender, Family Background, Relationship Status,
                Marital Status, Living Style, Friend Circle, and Home Division.
              </p>
              <div className="bg-subtle border border-border p-3 text-xs font-mono text-muted">
                Total categorical dummy dimensions: 23 binary indicators
              </div>
            </div>
          </div>

          {/* Item 05 & 06: Model Comparison Table */}
          <div className="border border-border bg-surface p-6 sm:p-8">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-border">
              <span className="font-serif text-2xl text-emerald-secondary font-light">
                05 &amp; 06
              </span>
              <span className="font-mono text-xs text-muted uppercase">
                Model Evaluation &amp; Hyperparameter Selection
              </span>
            </div>
            <h3 className="font-sans text-base font-semibold text-foreground uppercase tracking-tight mb-3">
              Support Vector Machine Selection &amp; Cross-Model Tuning
            </h3>
            <p className="text-sm text-muted leading-relaxed mb-6">
              Five candidate architectures were evaluated via Stratified 5-Fold Cross-Validation after purging target leakage.
              While ensemble tree models achieved higher raw accuracy by predicting the majority non-depressed class,
              Support Vector Classifier (SVC with balanced class weights) yielded superior sensitivity (Recall = 72.60%, F1 = 53.79%),
              making it the optimal research architecture for screening applications.
            </p>

            {/* Data Table */}
            <div className="overflow-x-auto border border-border">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-subtle border-b border-border text-foreground">
                  <tr>
                    <th className="p-3">Model Candidate</th>
                    <th className="p-3">Accuracy</th>
                    <th className="p-3">Precision</th>
                    <th className="p-3">Recall</th>
                    <th className="p-3">F1 Score</th>
                    <th className="p-3">ROC-AUC</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border text-muted">
                  <tr className="bg-emerald-50/40 text-foreground font-semibold">
                    <td className="p-3">Support Vector Machine (SVC)*</td>
                    <td className="p-3">66.47%</td>
                    <td className="p-3">42.76%</td>
                    <td className="p-3">72.60%</td>
                    <td className="p-3">53.79%</td>
                    <td className="p-3">0.7392</td>
                  </tr>
                  <tr>
                    <td className="p-3">Logistic Regression</td>
                    <td className="p-3">63.19%</td>
                    <td className="p-3">39.78%</td>
                    <td className="p-3">71.52%</td>
                    <td className="p-3">51.11%</td>
                    <td className="p-3">0.7177</td>
                  </tr>
                  <tr>
                    <td className="p-3">Random Forest</td>
                    <td className="p-3">74.26%</td>
                    <td className="p-3">53.63%</td>
                    <td className="p-3">31.72%</td>
                    <td className="p-3">39.83%</td>
                    <td className="p-3">0.7424</td>
                  </tr>
                  <tr>
                    <td className="p-3">Gradient Boosting</td>
                    <td className="p-3">75.02%</td>
                    <td className="p-3">59.81%</td>
                    <td className="p-3">21.56%</td>
                    <td className="p-3">31.63%</td>
                    <td className="p-3">0.7442</td>
                  </tr>
                  <tr>
                    <td className="p-3">Decision Tree</td>
                    <td className="p-3">68.62%</td>
                    <td className="p-3">42.20%</td>
                    <td className="p-3">44.88%</td>
                    <td className="p-3">43.48%</td>
                    <td className="p-3">0.6114</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <span className="block mt-2 text-[11px] text-muted">
              * Documented in research notebook: SVC tuned with C=1, class_weight=&apos;balanced&apos;, random_state=42.
            </span>
          </div>

          {/* Item 07 & 08: Thresholding & Independent Test */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* 07 */}
            <div className="border border-border bg-surface p-6 sm:p-8">
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-border">
                <span className="font-serif text-2xl text-emerald-secondary font-light">
                  07
                </span>
                <span className="font-mono text-xs text-muted uppercase">
                  Threshold Calibration
                </span>
              </div>
              <h3 className="font-sans text-base font-semibold text-foreground uppercase tracking-tight mb-3">
                Validation-Based Threshold Selection
              </h3>
              <p className="text-sm text-muted leading-relaxed mb-4">
                Rather than accepting the default decision boundary (0.00), precision-recall curve analysis was performed
                across validation partitions. The optimal threshold was calibrated to <strong>τ = -0.1596</strong>, prioritizing
                higher recall (76.0%) while maintaining balanced harmonic precision.
              </p>
              <div className="bg-subtle border border-border p-3 text-xs font-mono text-muted">
                Validation Calibration: τ = -0.159605 · Pos. Class F1 = 0.525
              </div>
            </div>

            {/* 08 */}
            <div className="border border-border bg-surface p-6 sm:p-8">
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-border">
                <span className="font-serif text-2xl text-emerald-secondary font-light">
                  08
                </span>
                <span className="font-mono text-xs text-muted uppercase">
                  Out-of-Sample Verification
                </span>
              </div>
              <h3 className="font-sans text-base font-semibold text-foreground uppercase tracking-tight mb-3">
                Independent Test Partition Evaluation
              </h3>
              <p className="text-sm text-muted leading-relaxed mb-4">
                The frozen model was evaluated on a held-out test partition of <strong>893 unseen students</strong>.
                The final model achieved an overall accuracy of <strong>61.93%</strong>, test recall of <strong>76.0%</strong>,
                precision of <strong>39.0%</strong>, and an area under the ROC curve (ROC-AUC) of <strong>0.7114</strong>.
              </p>
              <div className="bg-subtle border border-border p-3 text-xs font-mono text-muted">
                Test Partition N = 893 · ROC-AUC = 0.7114 · Balanced Recall = 0.760
              </div>
            </div>
          </div>

          {/* Item 09: Feature Importance & Fairness Experiments */}
          <div className="border border-border bg-surface p-6 sm:p-8">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-border">
              <span className="font-serif text-2xl text-emerald-secondary font-light">
                09
              </span>
              <span className="font-mono text-xs text-muted uppercase">
                Interpretability &amp; Algorithmic Fairness
              </span>
            </div>
            <h3 className="font-sans text-base font-semibold text-foreground uppercase tracking-tight mb-3">
              Feature Importance &amp; Gender Disparity Audits
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
              <div>
                <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-foreground mb-2">
                  Permutation Feature Importance Rank
                </h4>
                <p className="text-sm text-muted leading-relaxed mb-3">
                  Permutation test importance showed relationship status, cumulative grade point average (CGPA),
                  and family background had the highest impact on decision scores:
                </p>
                <ol className="list-decimal list-inside space-y-1 text-xs font-mono text-muted bg-subtle border border-border p-3">
                  <li>Relationship_status (+0.0242)</li>
                  <li>CGPA (+0.0238)</li>
                  <li>Family_background (+0.0224)</li>
                  <li>Gender (+0.0171)</li>
                  <li>Cost_without_study (+0.0152)</li>
                  <li>Marital_status (+0.0129)</li>
                  <li>Age (+0.0110)</li>
                  <li>Living_style (+0.0096)</li>
                </ol>
              </div>

              <div>
                <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-foreground mb-2">
                  Algorithmic Fairness Audit: Gender Disparity
                </h4>
                <p className="text-sm text-muted leading-relaxed mb-3">
                  To test whether removing protected attributes alleviates subgroup disparity,
                  Model A (with Gender) was compared to Model B (without Gender):
                </p>
                <div className="overflow-x-auto border border-border">
                  <table className="w-full text-left text-xs font-mono">
                    <thead className="bg-subtle border-b border-border text-foreground">
                      <tr>
                        <th className="p-2">Model</th>
                        <th className="p-2">Subgroup</th>
                        <th className="p-2">Recall</th>
                        <th className="p-2">FPR</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border text-muted">
                      <tr>
                        <td className="p-2 font-medium text-foreground">Model A (With Gender)</td>
                        <td className="p-2">Female (499)</td>
                        <td className="p-2">70.5%</td>
                        <td className="p-2">40.5%</td>
                      </tr>
                      <tr>
                        <td className="p-2 font-medium text-foreground">Model A (With Gender)</td>
                        <td className="p-2">Male (394)</td>
                        <td className="p-2">82.1%</td>
                        <td className="p-2">46.8%</td>
                      </tr>
                      <tr className="bg-amber-50/40">
                        <td className="p-2">Model B (No Gender)</td>
                        <td className="p-2">Female (499)</td>
                        <td className="p-2 text-[#9A3412]">66.7% (Dropped)</td>
                        <td className="p-2">35.4%</td>
                      </tr>
                      <tr className="bg-amber-50/40">
                        <td className="p-2">Model B (No Gender)</td>
                        <td className="p-2">Male (394)</td>
                        <td className="p-2">84.8%</td>
                        <td className="p-2 text-[#9A3412]">54.6% (Increased)</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className="text-[11px] text-muted mt-2 leading-relaxed">
                  <strong>Finding:</strong> Simply removing Gender reduced female sensitivity while exacerbating male false positive rates.
                  Model A was retained with documented fairness limitations.
                </p>
              </div>
            </div>

            {/* Scientific Boundary Note */}
            <div className="border-t border-border pt-4">
              <h4 className="font-sans text-xs uppercase tracking-wider font-semibold text-foreground mb-1">
                Epistemological Boundary: Correlation vs. Causation
              </h4>
              <p className="text-xs text-muted leading-relaxed">
                Feature weights reflect observational correlations within a regional survey sample and must not be interpreted as causal determinants of depressive disorders.
                The model has not undergone clinical psychiatric validation and is restricted to algorithmic research investigation.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
