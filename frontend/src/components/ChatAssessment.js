"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { submitPrediction, wakeAiService } from "@/lib/api";
import { QUESTIONS } from "@/lib/questions";
import ChatMessage from "./chat/ChatMessage";
import { ChoiceInput, TextInput } from "./chat/ChatInput";
import PredictionResult from "./PredictionResult";
import { Brain, Loader2, RefreshCw } from "lucide-react";

const WAKE_POLL_MS = 4000; // how often to ping while the AI is waking
const SUBMIT_RETRY_DELAY_MS = 4000; // pause between prediction attempts

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export default function ChatAssessment() {
  const [messages, setMessages] = useState([]);
  const [stepIndex, setStepIndex] = useState(-1);
  const [answers, setAnswers] = useState({});
  const [aiStatus, setAiStatus] = useState("idle"); // idle | waking | ready
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [predictionResult, setPredictionResult] = useState(null);
  const [predictionFailed, setPredictionFailed] = useState(false);
  const [inputLocked, setInputLocked] = useState(true);

  const bottomRef = useRef(null);
  const startedRef = useRef(false);
  const aiReadyRef = useRef(false); // latest "is AI ready" value, readable inside async loops
  const wakeRunRef = useRef(0); // bump to cancel the running wake loop
  const sessionRef = useRef(0); // bump on reset/unmount to cancel everything

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, isSubmitting]);

  // Cancel all loops when the component unmounts
  useEffect(() => {
    return () => {
      wakeRunRef.current++;
      sessionRef.current++;
    };
  }, []);

  const markReady = useCallback(() => {
    aiReadyRef.current = true;
    setAiStatus("ready");
  }, []);

  /**
   * Pings the backend (which wakes the ML service) until it reports ready.
   * No attempt limit: it only stops when the AI is ready, or when cancelled
   * by a reset, unmount, or a newer wake loop.
   */
  const startWakeLoop = useCallback(async () => {
    const runId = ++wakeRunRef.current;
    aiReadyRef.current = false;
    setAiStatus("waking");

    while (wakeRunRef.current === runId) {
      try {
        const res = await wakeAiService(true);
        if (wakeRunRef.current !== runId) return false;
        if (res?.ready) {
          markReady();
          return true;
        }
      } catch {
        /* keep trying */
      }
      await sleep(WAKE_POLL_MS);
    }
    return false;
  }, [markReady]);

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

    // Ping the backend right away so the AI starts waking while the user answers
    startWakeLoop();

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

  const finishAndPredict = async (finalAnswers, isRetry = false) => {
    const session = sessionRef.current;
    const cancelled = () => sessionRef.current !== session;

    setPredictionFailed(false);
    setIsSubmitting(true);

    pushBot(
      isRetry
        ? "Trying again…"
        : "Perfect — that's everything. Let me analyze your responses with the model…"
    );

    // 1. Make sure a wake loop is running, then wait until the AI is ready.
    if (!aiReadyRef.current) {
      pushBot(
        "The AI model is still waking up. This can take a couple of minutes — I'll keep trying, no need to refresh."
      );
      // Re-start the wake loop only if it isn't already running
      if (aiStatus === "idle") startWakeLoop();
      while (!aiReadyRef.current) {
        if (cancelled()) return;
        await sleep(1000);
      }
    }
    if (cancelled()) return;

    // 2. Submit. Keep retrying with no limit while the service is warming
    //    up or unreachable. Stop only on success or a real (non-cold-start) error.
    let response = null;
    while (true) {
      response = await submitPrediction(finalAnswers);
      if (cancelled()) return;

      if (response.success) break;
      if (!response.isWarmingUp && !response.isNetworkError) break; // real error

      setAiStatus("waking");
      await sleep(SUBMIT_RETRY_DELAY_MS);
      if (cancelled()) return;
    }

    setIsSubmitting(false);

    if (response.success) {
      wakeRunRef.current++; // stop the wake loop if it's somehow still running
      markReady();
      setPredictionResult(response.data);
      return;
    }

    setPredictionFailed(true);
    pushBot(
      response.error ||
        "Something went wrong while analyzing your responses. Please try again.",
      "error"
    );
  };

  const handleRetry = () => {
    if (Object.keys(answers).length !== QUESTIONS.length) return;
    finishAndPredict(answers, true);
  };

  const handleReset = () => {
    wakeRunRef.current++;
    sessionRef.current++;
    aiReadyRef.current = false;
    setMessages([]);
    setStepIndex(-1);
    setAnswers({});
    setPredictionResult(null);
    setPredictionFailed(false);
    setIsSubmitting(false);
    setInputLocked(true);
    setAiStatus("idle");
    startedRef.current = false;
  };

  const currentQuestion =
    stepIndex >= 0 && stepIndex < QUESTIONS.length
      ? QUESTIONS[stepIndex]
      : null;

  const showStart = stepIndex === -1;
  const showInput = !!currentQuestion && !inputLocked && !isSubmitting;
  const showRetry = predictionFailed && !predictionResult && !isSubmitting;

  const statusLabel =
    aiStatus === "ready"
      ? "AI ready"
      : aiStatus === "waking"
      ? "AI waking up…"
      : null;

  return (
    <div className="flex flex-col h-full w-full bg-background">
      {/* Header */}
      <header className="flex-shrink-0 border-b border-border bg-surface">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <div className="inline-flex items-center gap-2">
              <span className="w-2 h-2 bg-accent"></span>
              <span className="text-[11px] font-mono tracking-[0.2em] uppercase font-semibold text-muted">
                Conversational Screening
              </span>
            </div>
            {statusLabel && (
              <span className="text-[10px] font-mono uppercase tracking-wider text-muted">
                {statusLabel}
              </span>
            )}
          </div>
          <h1 className="text-xl sm:text-2xl font-serif font-bold text-navy-deep tracking-tight leading-tight">
            Student Depression Risk Assessment
          </h1>
        </div>
      </header>

      {/* Chat column */}
      <div className="flex-1 min-h-0 w-full">
        <div className="max-w-3xl mx-auto h-full flex flex-col px-4 sm:px-6">
          {/* Message area */}
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
                    {aiStatus === "ready"
                      ? "Analyzing your responses…"
                      : "Waking up the AI model… this can take a couple of minutes."}
                  </span>
                </ChatMessage>
              )}

              <div ref={bottomRef} />
            </div>
          </div>

          {/* Input bar */}
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

                  {showRetry && (
                    <button
                      type="button"
                      onClick={handleRetry}
                      className="inline-flex items-center gap-1.5 px-3 py-2 bg-accent hover:bg-accent-hover text-white text-xs font-semibold"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      Retry Prediction
                    </button>
                  )}

                  {!showInput && !isSubmitting && !showRetry && (
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