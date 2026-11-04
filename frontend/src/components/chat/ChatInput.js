"use client";

import { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";

export function ChoiceInput({ options, optionLabels, onSelect, disabled }) {
  return (
    <div className="flex flex-wrap gap-2 animate-fadeIn">
      {options.map((opt) => (
        <button
          key={opt}
          type="button"
          disabled={disabled}
          onClick={() => onSelect(opt)}
          className="px-4 py-2 text-sm font-medium bg-white border border-border hover:border-accent hover:text-accent text-navy-deep transition-colors disabled:opacity-40"
        >
          {optionLabels?.[opt] ?? opt}
        </button>
      ))}
    </div>
  );
}

export function TextInput({ onSubmit, placeholder, disabled, type = "text" }) {
  const [value, setValue] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    if (!disabled) inputRef.current?.focus();
  }, [disabled]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed) return;
    onSubmit(trimmed);
    setValue("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 animate-fadeIn">
      <input
        ref={inputRef}
        type={type}
        value={value}
        disabled={disabled}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className="flex-1 px-3.5 py-2.5 bg-white border border-border text-sm text-foreground focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/20"
        inputMode={type === "number" ? "decimal" : "text"}
      />
      <button
        type="submit"
        disabled={disabled || !value.trim()}
        className="px-4 bg-accent hover:bg-accent-hover disabled:bg-muted text-white transition-colors"
        aria-label="Send"
      >
        <Send className="w-4 h-4" />
      </button>
    </form>
  );
}