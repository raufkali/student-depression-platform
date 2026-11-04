export default function Hero() {
  return (
    <section className="relative border-b border-border bg-background pt-16 pb-20 md:pt-24 md:pb-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Main Editorial Content */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 mb-6">
              <span className="h-1.5 w-1.5 bg-emerald-accent"></span>
              <span className="font-sans text-xs tracking-[0.2em] uppercase font-semibold text-muted">
                STUDENT WELLBEING RESEARCH / 2026
              </span>
            </div>

            {/* Main Editorial Headline */}
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-foreground font-normal leading-[1.12] tracking-tight mb-6">
              Understanding Student Wellbeing Through Data.
            </h1>

            {/* Supporting Text */}
            <p className="text-base sm:text-lg text-muted font-normal leading-relaxed max-w-2xl mb-8">
              An experimental machine-learning research platform exploring
              patterns in student-related data to study depression
              classification.
            </p>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2 mb-12">
              <a
                href="#assessment"
                className="inline-flex items-center justify-center px-6 py-3.5 bg-emerald-accent hover:bg-emerald-secondary text-white font-sans text-sm font-medium tracking-wide transition-colors duration-150 border border-emerald-secondary"
              >
                Start Assessment
              </a>
              <a
                href="#methodology"
                className="inline-flex items-center justify-center px-6 py-3.5 bg-surface hover:bg-subtle text-foreground font-sans text-sm font-medium tracking-wide border border-border transition-colors duration-150"
              >
                Explore Methodology →
              </a>
            </div>

            {/* Research Metadata Strip */}
            <div className="pt-6 border-t border-border grid grid-cols-3 gap-4 text-left">
              <div>
                <dt className="text-[11px] uppercase tracking-wider text-muted font-mono">
                  Sample Size
                </dt>
                <dd className="font-serif text-xl sm:text-2xl text-foreground mt-0.5">
                  4,464
                </dd>
                <span className="text-[11px] text-muted block mt-0.5">
                  Regional student cohort
                </span>
              </div>
              <div className="border-l border-border pl-4">
                <dt className="text-[11px] uppercase tracking-wider text-muted font-mono">
                  Classifier
                </dt>
                <dd className="font-serif text-xl sm:text-2xl text-foreground mt-0.5">
                  SVM
                </dd>
                <span className="text-[11px] text-muted block mt-0.5">
                  Balanced Support Vector
                </span>
              </div>
              <div className="border-l border-border pl-4">
                <dt className="text-[11px] uppercase tracking-wider text-muted font-mono">
                  Decision Threshold
                </dt>
                <dd className="font-serif text-xl sm:text-2xl text-foreground mt-0.5">
                  -0.1596
                </dd>
                <span className="text-[11px] text-muted block mt-0.5">
                  Validation calibrated
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Research Technical Annotation Plate */}
          <div className="lg:col-span-5">
            <div className="border border-border bg-surface p-6 sm:p-8 relative">
              {/* Card Label Header */}
              <div className="flex items-center justify-between pb-4 mb-6 border-b border-border">
                <span className="font-mono text-xs uppercase tracking-widest text-muted">
                  REGISTRY ARCHIVE
                </span>
                <span className="font-mono text-xs text-muted">
                  REF: ML-SDRP-SVM
                </span>
              </div>

              {/* Research Spec Table */}
              <dl className="divide-y divide-border text-sm mb-6">
                <div className="py-2.5 flex justify-between items-baseline">
                  <dt className="text-muted font-normal">Algorithm Family</dt>
                  <dd className="font-mono text-xs text-foreground font-medium">
                    Support Vector Classifier (SVC)
                  </dd>
                </div>
                <div className="py-2.5 flex justify-between items-baseline">
                  <dt className="text-muted font-normal">Regularization (C)</dt>
                  <dd className="font-mono text-xs text-foreground">1.0 (Balanced Weights)</dd>
                </div>
                <div className="py-2.5 flex justify-between items-baseline">
                  <dt className="text-muted font-normal">Feature Dimensions</dt>
                  <dd className="font-mono text-xs text-foreground">11 Input Covariates</dd>
                </div>
                <div className="py-2.5 flex justify-between items-baseline">
                  <dt className="text-muted font-normal">Preprocessing</dt>
                  <dd className="font-mono text-xs text-foreground">StandardScaler + OHE</dd>
                </div>
                <div className="py-2.5 flex justify-between items-baseline">
                  <dt className="text-muted font-normal">Leakage Treatment</dt>
                  <dd className="font-mono text-xs text-emerald-secondary font-medium">
                    Health_condition Purged
                  </dd>
                </div>
                <div className="py-2.5 flex justify-between items-baseline">
                  <dt className="text-muted font-normal">Test Set Recall</dt>
                  <dd className="font-mono text-xs text-foreground">76.0% (Sensitivity)</dd>
                </div>
              </dl>

              {/* Fine-Lined Abstract Data Coordinate Graphic */}
              <div className="border border-border bg-subtle p-4 font-mono text-[11px] text-muted">
                <div className="flex justify-between items-center mb-3">
                  <span className="uppercase tracking-wider text-[10px]">
                    Hyperplane Projection (1D Decision Boundary)
                  </span>
                  <span className="text-[10px] text-foreground font-semibold">
                    τ = -0.1596
                  </span>
                </div>

                {/* Scaled Linear Coordinate Bar */}
                <div className="relative h-6 bg-surface border border-border my-2 flex items-center">
                  {/* Left Region: No */}
                  <div className="w-[42%] h-full bg-[#E5EFE9] flex items-center justify-center text-[10px] text-muted border-r border-dashed border-muted">
                    No [s &lt; τ]
                  </div>
                  {/* Right Region: Yes */}
                  <div className="w-[58%] h-full bg-[#D1FAE5]/40 flex items-center justify-center text-[10px] text-emerald-secondary font-medium">
                    Yes [s ≥ τ]
                  </div>
                  {/* Threshold Pin */}
                  <div className="absolute left-[42%] top-0 bottom-0 w-0.5 bg-foreground"></div>
                </div>

                <div className="flex justify-between text-[10px] text-muted mt-2">
                  <span>-3.0 (Min Score)</span>
                  <span className="text-foreground font-semibold">Threshold Cutoff</span>
                  <span>+3.0 (Max Score)</span>
                </div>
              </div>

              {/* Research Annotation Footnote */}
              <p className="mt-4 text-[11px] text-muted leading-relaxed">
                Source: Departmental dataset survey of enrolled university students.
                Model artifacts strictly serve exploratory empirical analysis.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
