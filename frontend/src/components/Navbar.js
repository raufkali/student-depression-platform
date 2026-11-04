export default function Navbar() {
  return (
    <header className="border-b border-border bg-surface/90 backdrop-blur-sm sticky top-0 z-40">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand Mark */}
        <a href="/" className="flex flex-col group">
          <span className="font-serif text-lg font-semibold tracking-wider text-foreground">
            STUDENT RESEARCH
          </span>
          <span className="font-sans text-[10px] tracking-widest uppercase text-muted font-medium">
            AI WELLBEING PLATFORM
          </span>
        </a>

        {/* Status Pill */}
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center px-2.5 py-1 text-xs font-mono text-emerald-secondary bg-emerald-50 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-accent mr-1.5 animate-pulse"></span>
            Universal SVM Active
          </span>
        </div>
      </div>
    </header>
  );
}
