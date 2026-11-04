export default function About() {
  return (
    <section id="about" className="border-b border-border bg-background py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="font-sans text-xs tracking-[0.2em] uppercase font-semibold text-muted">
              PROJECT SCOPE
            </span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl text-foreground font-normal tracking-tight mb-4">
            About This Research
          </h2>
          <p className="text-base sm:text-lg text-muted font-normal leading-relaxed">
            This digital platform was constructed as an academic machine-learning
            research application. Its objective is to evaluate empirical statistical
            techniques for tabular classification on structured student demographic
            and academic records.
          </p>
        </div>

        {/* Academic Overview Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          <div className="border border-border bg-surface p-6 sm:p-8">
            <h3 className="font-sans text-sm font-semibold uppercase tracking-wider text-foreground mb-3">
              Research Objectives
            </h3>
            <p className="text-sm text-muted leading-relaxed mb-4">
              The project investigates how supervised learning algorithms,
              specifically Support Vector Machines with balanced margin optimization,
              perform when exposed to real-world socio-academic tabular datasets.
              Key experimental areas include data leakage identification,
              cross-validation stability, hyperparameter sensitivity, and
              algorithmic fairness across demographic groups.
            </p>
            <p className="text-sm text-muted leading-relaxed">
              By transparently publishing both the methodology and the live
              inference pipeline, this application serves as an open technical
              reference for responsible machine-learning research practices.
            </p>
          </div>

          <div className="border border-border bg-surface p-6 sm:p-8">
            <h3 className="font-sans text-sm font-semibold uppercase tracking-wider text-foreground mb-3">
              Responsible AI &amp; Ethical Boundaries
            </h3>
            <p className="text-sm text-muted leading-relaxed mb-4">
              Statistical machine-learning classifiers identify mathematical
              associations learned from retrospective survey samples. They do not
              possess clinical understanding, nor can they diagnose depressive
              disorders or determine medical interventions.
            </p>
            <p className="text-sm text-muted leading-relaxed">
              This platform does not store submitted assessment records in any
              persistent database. Data submitted via the evaluation interface is
              processed in-memory for immediate inference score computation and
              immediately discarded.
            </p>
          </div>
        </div>

        {/* Technical Stack Overview Strip */}
        <div className="mt-8 border border-border bg-subtle p-6">
          <div className="flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-muted">
            <div>
              <span className="text-foreground font-semibold">STACK ARCHITECTURE:</span>{" "}
              Scikit-learn 1.5 · FastAPI 0.115 · Express 4.19 · Next.js 14
            </div>
            <div>
              <span className="text-foreground font-semibold">MODEL ARTIFACT:</span>{" "}
              Linear/RBF SVC · C=1.0 · Balanced Weights · τ = -0.1596
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
