"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Typographic Brand Mark */}
          <a
            href="#"
            className="flex flex-col group focus:outline-none focus-visible:ring-1 focus-visible:ring-emerald-accent"
          >
            <span className="font-serif text-lg tracking-wider font-semibold text-foreground">
              STUDENT RESEARCH
            </span>
            <span className="font-sans text-[10px] tracking-widest uppercase text-muted font-medium">
              MACHINE LEARNING PROJECT
            </span>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8 text-sm font-medium tracking-tight">
            <a
              href="#overview"
              className="text-muted hover:text-foreground transition-colors duration-150 py-1"
            >
              Overview
            </a>
            <a
              href="#assessment"
              className="text-foreground hover:text-emerald-secondary transition-colors duration-150 font-semibold py-1 border-b-2 border-transparent hover:border-emerald-accent"
            >
              Assessment
            </a>
            <a
              href="#methodology"
              className="text-muted hover:text-foreground transition-colors duration-150 py-1"
            >
              Methodology
            </a>
            <a
              href="#about"
              className="text-muted hover:text-foreground transition-colors duration-150 py-1"
            >
              About
            </a>
          </nav>

          {/* Mobile menu trigger */}
          <div className="md:hidden flex items-center">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-muted hover:text-foreground border border-border bg-surface focus:outline-none"
              aria-label={mobileMenuOpen ? "Close menu" : "Open navigation menu"}
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5 stroke-[1.5]" />
              ) : (
                <Menu className="w-5 h-5 stroke-[1.5]" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-border bg-surface px-4 pt-3 pb-4 space-y-2">
          <a
            href="#overview"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-sm text-muted hover:text-foreground hover:bg-subtle"
          >
            Overview
          </a>
          <a
            href="#assessment"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-sm font-medium text-foreground bg-subtle border-l-2 border-emerald-accent"
          >
            Assessment
          </a>
          <a
            href="#methodology"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-sm text-muted hover:text-foreground hover:bg-subtle"
          >
            Methodology
          </a>
          <a
            href="#about"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-sm text-muted hover:text-foreground hover:bg-subtle"
          >
            About
          </a>
        </div>
      )}
    </header>
  );
}
