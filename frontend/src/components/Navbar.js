export default function Navbar() {
  return (
    <header className="border-b border-border bg-surface/95 backdrop-blur-sm sticky top-0 z-40">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
        {/* Brand */}
        <a href="/" className="flex flex-col group min-w-0">
          <span className="font-serif text-base sm:text-lg font-bold tracking-[0.15em] text-navy-deep truncate">
            DEPRESSION PREDICTOR
          </span>
          <span className="font-sans text-[9px] sm:text-[10px] tracking-[0.22em] uppercase text-muted font-semibold">
            AI Wellbeing Platform
          </span>
        </a>
      </div>
    </header>
  );
}