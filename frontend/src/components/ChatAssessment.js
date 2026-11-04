"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { submitPrediction, wakeAiService } from "@/lib/api";
import { QUESTIONS } from "@/lib/questions";
import ChatMessage from "./chat/ChatMessage";
import { ChoiceInput, TextInput } from "./chat/ChatInput";
import PredictionResult from "./PredictionResult";
import { Brain, Loader2, RefreshCw } from "lucide-react";

export default function ChatAssessment() {
  const [messages, setMessages] = useState([]);
  const [stepIndex, setStepIndex] = useState(-1);
  const [answers, setAnswers] = useState({});
  const [aiStatus, setAiStatus] = useState("checking");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [predictionResult, setPredictionResult] = useState(null);
  const [inputLocked, setInputLocked] = useState(true);

  const bottomRef = useRef(null);
  const startedRef = useRef(false);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, isSubmitting]);

  useEffect(() => {
    if (stepIndex < 0 || aiStatus === "ready") return;
    let cancelled = false;
    setAiStatus("waking");

    const ping = async () => {
      try {
        const res = await wakeAiService(true);
        if (cancelled) return;
        setAiStatus(res?.ready ? "ready" : "waking");
      } catch {
        if (!cancelled) setAiStatus("standby");
      }
    };

    ping();
    const id = setInterval(ping, 3500);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [stepIndex, aiStatus]);

  const pushMessage = useCallback((msg) => {
    setMessages((prev) => [...prev, { id: crypto.randomUUID(), ...msg }]);
  }, []);

  const pushBot = useCallback(
    (text, variant = "normal") => pushMessage({ role: "bot", text, variant }),
    [pushMessage]
  );

  const askQuestion = useCallback(
    (index) => {
      const q = QUESTIONS[index];
      if (!q) return;
      pushBot(q.prompt);
      setInputLocked(false);
    },
    [pushBot]
  );

  const startChat = () => {
    if (startedRef.current) return;
    startedRef.current = true;
    setStepIndex(0);
    pushBot(
      "Hi there 👋 I'm your wellbeing assistant. A few short questions — about a minute."
    );
    setTimeout(() => {
      pushBot(
        "Everything you share stays on your device until you submit. Ready? Let's go."
      );
      setTimeout(() => askQuestion(0), 400);
    }, 400);
  };

  const handleAnswer = (rawValue, displayValue) => {
    const q = QUESTIONS[stepIndex];
    if (!q) return;

    let parsed;
    if (q.validate) {
      const r = q.validate(rawValue);
      if (r.error) {
        pushMessage({ role: "user", text: String(displayValue ?? rawValue) });
        pushBot(r.error, "error");
        return;
      }
      parsed = r.value;
    } else {
      parsed = rawValue;
    }

    pushMessage({ role: "user", text: displayValue ?? String(parsed) });
    const nextAnswers = { ...answers, [q.key]: parsed };
    setAnswers(nextAnswers);
    setInputLocked(true);

    const nextIndex = stepIndex + 1;
    setStepIndex(nextIndex);

    if (nextIndex >= QUESTIONS.length) {
      finishAndPredict(nextAnswers);
    } else {
      setTimeout(() => askQuestion(nextIndex), 350);
    }
  };

  const finishAndPredict = async (finalAnswers) => {
    pushBot(
      "Perfect — that's everything. Let me analyze your responses with the model…"
    );
    setIsSubmitting(true);

    if (aiStatus !== "ready") {
      try {
        const res = await wakeAiService(true);
        if (res?.ready) setAiStatus("ready");
      } catch {
        /* ignore */
      }
    }

    const response = await submitPrediction(finalAnswers);
    setIsSubmitting(false);

    if (response.success) {
      setPredictionResult(response.data);
      setAiStatus("ready");
    } else {
      pushBot(
        response.error ||
          "The AI service didn't respond in time. Give it a moment and try again.",
        "error"
      );
      setAiStatus(response.isWarmingUp ? "waking" : "standby");
    }
  };

  const handleRetry = () => {
    if (Object.keys(answers).length === QUESTIONS.length)
      finishAndPredict(answers);
  };

  const handleReset = () => {
    setMessages([]);
    setStepIndex(-1);
    setAnswers({});
    setPredictionResult(null);
    setIsSubmitting(false);
    setInputLocked(true);
    startedRef.current = false;
  };

  const currentQuestion =
    stepIndex >= 0 && stepIndex < QUESTIONS.length
      ? QUESTIONS[stepIndex]
      : null;

  const showStart = stepIndex === -1;
  const hasError = messages.some((m) => m.variant === "error");
  const showInput = !!currentQuestion && !inputLocked && !isSubmitting;

  return (
    <div className="flex flex-col h-full w-full bg-background">
      {/* Header */}
      <header className="flex-shrink-0 border-b border-border bg-surface">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4">
          <div className="inline-flex items-center gap-2 mb-1.5">
            <span className="w-2 h-2 bg-accent"></span>
            <span className="text-[11px] font-mono tracking-[0.2em] uppercase font-semibold text-muted">
              Conversational Screening
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-serif font-bold text-navy-deep tracking-tight leading-tight">
            Student Depression Risk Assessment
          </h1>
        </div>
      </header>

      {/* Chat column — constrained width, centered, fills remaining height */}
      <div className="flex-1 min-h-0 w-full">
        <div className="max-w-3xl mx-auto h-full flex flex-col px-4 sm:px-6">
          {/* Message area — scrolls, and content sits at the bottom when short */}
          <div className="flex-1 min-h-0 overflow-y-auto pt-4 pb-3">
            <div className="flex flex-col justify-end min-h-full gap-4">
              {showStart && (
                <div className="text-center py-10 sm:py-14 space-y-4">
                  <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-50 border border-blue-200 text-accent mx-auto">
                    <Brain className="w-6 h-6" />
                  </div>
                  <h2 className="font-serif text-xl sm:text-2xl text-navy-deep font-bold">
                    Ready when you are
                  </h2>
                  <p className="text-sm text-muted max-w-sm mx-auto leading-relaxed">
                    Click below to begin. The assistant will ask ~10 quick
                    questions and wake the AI model in the background while you
                    chat.
                  </p>
                  <button
                    type="button"
                    onClick={startChat}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-accent hover:bg-accent-hover text-white text-sm font-semibold transition-colors shadow-sm"
                  >
                    <Brain className="w-4 h-4" />
                    Start Assessment
                  </button>
                </div>
              )}

              {messages.map((m) => (
                <ChatMessage key={m.id} role={m.role} variant={m.variant}>
                  {m.text}
                </ChatMessage>
              ))}

              {isSubmitting && (
                <ChatMessage role="bot">
                  <span className="inline-flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-accent" />
                    {aiStatus === "waking"
                      ? "Warming up the model and analyzing your responses…"
                      : "Analyzing your responses…"}
                  </span>
                </ChatMessage>
              )}

              <div ref={bottomRef} />
            </div>
          </div>

          {/* Input bar — sits right under messages, floats above viewport bottom */}
          <div className="flex-shrink-0 pb-5 sm:pb-8">
            <div className="bg-surface border border-border shadow-sm">
              <div className="px-3 py-2.5 sm:px-4 sm:py-3 min-h-[56px] flex items-center">
                <div className="w-full">
                  {showInput && currentQuestion.type === "choice" && (
                    <ChoiceInput
                      options={currentQuestion.options}
                      optionLabels={currentQuestion.optionLabels}
                      onSelect={(opt) =>
                        handleAnswer(
                          opt,
                          currentQuestion.optionLabels?.[opt] ?? opt
                        )
                      }
                    />
                  )}

                  {showInput && currentQuestion.type === "number" && (
                    <TextInput
                      type="number"
                      placeholder="Type your answer…"
                      onSubmit={(raw) => handleAnswer(raw, raw)}
                    />
                  )}

                  {hasError && !predictionResult && (
                    <button
                      type="button"
                      onClick={handleRetry}
                      className="inline-flex items-center gap-1.5 px-3 py-2 bg-accent hover:bg-accent-hover text-white text-xs font-semibold"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      Retry Prediction
                    </button>
                  )}

                  {!showInput && !isSubmitting && !hasError && (
                    <p className="text-[11px] text-muted text-center font-mono py-1">
                      {showStart
                        ? "Press Start to begin the assessment."
                        : "This screening tool is for educational use only — not a clinical diagnosis."}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Result modal */}
      {predictionResult && (
        <ResultModal>
          <PredictionResult
            result={predictionResult}
            onReset={handleReset}
            onClose={() => setPredictionResult(null)}
          />
        </ResultModal>
      )}
    </div>
  );
}

function ResultModal({ children }) {
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-3 sm:p-6 bg-navy-deep/50 backdrop-blur-sm animate-fadeIn"
    >
      <div className="w-full max-w-2xl max-h-[calc(100dvh-1.5rem)] overflow-y-auto bg-surface border border-border shadow-2xl animate-fadeIn">
        {children}
      </div>
    </div>
  );
}