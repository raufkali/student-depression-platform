export default function ResearchOverview() {
  return (
    <section id="overview" className="border-b border-border bg-subtle py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="font-sans text-xs tracking-[0.2em] uppercase font-semibold text-muted">
              FOUNDATIONAL FRAMEWORK
            </span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl text-foreground font-normal tracking-tight mb-4">
            A Data-Driven Research Approach
          </h2>
          <p className="text-base sm:text-lg text-muted font-normal leading-relaxed">
            This project investigates how structured student demographics,
            academic indices, and socio-economic variables correlate with
            reported mental wellbeing indicators. By leveraging a trained Support
            Vector Machine (SVM) pipeline, we systematically examine multivariate
            statistical relationships while emphasizing rigorous methodological
            discipline.
          </p>
        </div>

        {/* Three Editorial Numbered Blocks */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {/* Block 01 */}
          <div className="border-t border-border pt-6 flex flex-col justify-between">
            <div>
              <span className="font-serif text-3xl sm:text-4xl text-emerald-secondary font-light block mb-4">
                01
              </span>
              <h3 className="font-sans text-base font-semibold text-foreground tracking-tight mb-3 uppercase">
                Structured Data
              </h3>
              <p className="text-sm text-muted leading-relaxed">
                Student-related attributes are processed using a machine-learning
                preprocessing pipeline. Continuous attributes undergo Z-score
                standardization, while categorical features are strictly one-hot
                encoded to prevent arbitrary ordinal distortions.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-border/60 text-[11px] font-mono text-muted">
              PIPELINE · StandardScaler &amp; OneHotEncoder
            </div>
          </div>

          {/* Block 02 */}
          <div className="border-t border-border pt-6 flex flex-col justify-between">
            <div>
              <span className="font-serif text-3xl sm:text-4xl text-emerald-secondary font-light block mb-4">
                02
              </span>
              <h3 className="font-sans text-base font-semibold text-foreground tracking-tight mb-3 uppercase">
                Experimental Classification
              </h3>
              <p className="text-sm text-muted leading-relaxed">
                A trained SVM model generates an experimental classification based
                on learned dataset patterns. The decision function computes the
                perpendicular distance of the standardized record to an optimal
                separating hyperplane calibrated with balanced class weights.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-border/60 text-[11px] font-mono text-muted">
              INFERENCE · Calibrated Decision Threshold
            </div>
          </div>

          {/* Block 03 */}
          <div className="border-t border-border pt-6 flex flex-col justify-between">
            <div>
              <span className="font-serif text-3xl sm:text-4xl text-emerald-secondary font-light block mb-4">
                03
              </span>
              <h3 className="font-sans text-base font-semibold text-foreground tracking-tight mb-3 uppercase">
                Responsible Interpretation
              </h3>
              <p className="text-sm text-muted leading-relaxed">
                Predictions are research outputs and must not be treated as
                clinical assessments. Statistical classification models identify
                associative patterns within a specific academic demographic and
                cannot replace qualified psychiatric evaluation.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-border/60 text-[11px] font-mono text-muted">
              ETHICS · Non-Diagnostic Research Utility
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
