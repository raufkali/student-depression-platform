export default function Footer() {
  return (
    <footer className="border-t border-border bg-surface py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-8 pb-10 border-b border-border">
          {/* Brand and Subtitle */}
          <div className="max-w-md">
            <span className="font-serif text-lg tracking-wider font-semibold text-foreground block">
              STUDENT RESEARCH PLATFORM
            </span>
            <span className="font-sans text-xs tracking-widest uppercase text-muted font-medium block mt-1">
              EXPERIMENTAL MACHINE LEARNING PROJECT
            </span>
            <p className="mt-4 text-xs text-muted leading-relaxed">
              An academic digital research initiative exploring tabular classification
              methodologies, data leakage protocols, and Support Vector Machine
              decision boundaries on student-related survey datasets.
            </p>
          </div>

          {/* Quick Navigation Links */}
          <div className="flex flex-wrap gap-8 text-sm">
            <div>
              <span className="text-xs uppercase tracking-wider font-mono font-semibold text-foreground block mb-3">
                Navigation
              </span>
              <ul className="space-y-2 text-xs">
                <li>
                  <a
                    href="#overview"
                    className="text-muted hover:text-foreground transition-colors duration-150"
                  >
                    Overview
                  </a>
                </li>
                <li>
                  <a
                    href="#assessment"
                    className="text-muted hover:text-foreground transition-colors duration-150"
                  >
                    Assessment
                  </a>
                </li>
                <li>
                  <a
                    href="#methodology"
                    className="text-muted hover:text-foreground transition-colors duration-150"
                  >
                    Methodology
                  </a>
                </li>
                <li>
                  <a
                    href="#about"
                    className="text-muted hover:text-foreground transition-colors duration-150"
                  >
                    About
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <span className="text-xs uppercase tracking-wider font-mono font-semibold text-foreground block mb-3">
                Documentation
              </span>
              <ul className="space-y-2 text-xs text-muted">
                <li>Artifact: SVM Pipeline</li>
                <li>Cohort N = 4,464</li>
                <li>Decision Cutoff τ = -0.1596</li>
                <li>License: Academic Open Access</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Responsible Use Disclaimer & Copyright */}
        <div className="pt-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs text-muted">
          <p className="max-w-3xl leading-relaxed">
            <strong>Responsible-Use Notice:</strong> All predictions generated
            by this platform are experimental research outputs derived from
            statistical dataset patterns and must not be interpreted as medical,
            psychiatric, or clinical diagnosis. The model has not been clinically
            validated.
          </p>

          <p className="font-mono whitespace-nowrap">
            &copy; 2026 Student Research Platform
          </p>
        </div>
      </div>
    </footer>
  );
}
