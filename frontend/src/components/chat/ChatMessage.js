"use client";

import { Bot, User, AlertCircle } from "lucide-react";

export default function ChatMessage({ role, children, variant = "normal" }) {
  const isBot = role === "bot";
  const isError = variant === "error";

  return (
    <div className={`flex gap-3 ${isBot ? "justify-start" : "justify-end"} animate-fadeIn`}>
      {isBot && (
        <div className="w-9 h-9 flex-shrink-0 bg-blue-50 border border-blue-200 text-accent flex items-center justify-center">
          {isError ? <AlertCircle className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
        </div>
      )}
      <div
        className={[
          "max-w-[85%] sm:max-w-[75%] px-4 py-3 text-sm leading-relaxed border",
          isBot
            ? isError
              ? "bg-red-50 border-red-200 text-red-900"
              : "bg-white border-border text-foreground"
            : "bg-accent border-accent text-white",
        ].join(" ")}
      >
        {children}
      </div>
      {!isBot && (
        <div className="w-9 h-9 flex-shrink-0 bg-navy-deep text-white flex items-center justify-center">
          <User className="w-4 h-4" />
        </div>
      )}
    </div>
  );
}