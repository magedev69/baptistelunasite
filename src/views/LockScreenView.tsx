"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ViewCard } from "@/components/layout/ViewCard";
import { useAppState } from "@/providers/AppStateProvider";
import { ACCESS_CODE, lockDecorations, lockScreenCopy } from "@/data/lock";
import { cn } from "@/utils/cn";

type LockStatus = "idle" | "typing" | "validating" | "error" | "success";

const keypadRows = [
  ["1", "2", "3"],
  ["4", "5", "6"],
  ["7", "8", "9"],
];

export function LockScreenView() {
  const { unlockApp } = useAppState();

  const [digits, setDigits] = useState<string[]>([]);
  const [status, setStatus] = useState<LockStatus>("idle");
  const [feedback, setFeedback] = useState(lockScreenCopy.helper);

  const timeoutsRef = useRef<number[]>([]);

  const codeValue = digits.join("");
  const isBusy = status === "validating" || status === "success";

  useEffect(() => {
    return () => {
      timeoutsRef.current.forEach((timeoutId) => window.clearTimeout(timeoutId));
    };
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (isBusy) return;

      if (/^\d$/.test(event.key)) {
        event.preventDefault();
        appendDigit(event.key);
        return;
      }

      if (event.key === "Backspace") {
        event.preventDefault();
        handleDelete();
        return;
      }

      if (event.key === "Escape") {
        event.preventDefault();
        handleReset();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isBusy, digits]);

  function queueTimeout(callback: () => void, delay: number) {
    const timeoutId = window.setTimeout(callback, delay);
    timeoutsRef.current.push(timeoutId);
  }

  function validateCode(nextCode: string) {
    setStatus("validating");

    if (nextCode === ACCESS_CODE) {
      setFeedback(lockScreenCopy.success);
      setStatus("success");

      queueTimeout(() => {
        unlockApp();
      }, 550);

      return;
    }

    setFeedback(lockScreenCopy.error);
    setStatus("error");

    queueTimeout(() => {
      setDigits([]);
      setStatus("idle");
      setFeedback(lockScreenCopy.helper);
    }, 900);
  }

  function appendDigit(digit: string) {
    if (isBusy) return;

    setFeedback(lockScreenCopy.helper);

    setDigits((previous) => {
      if (previous.length >= ACCESS_CODE.length) return previous;

      const next = [...previous, digit];
      const nextCode = next.join("");

      setStatus("typing");

      if (nextCode.length === ACCESS_CODE.length) {
        queueTimeout(() => validateCode(nextCode), 120);
      }

      return next;
    });
  }

  function handleDelete() {
    if (isBusy) return;

    setDigits((previous) => previous.slice(0, -1));
    setStatus("typing");
    setFeedback(lockScreenCopy.helper);
  }

  function handleReset() {
    if (isBusy) return;

    setDigits([]);
    setStatus("idle");
    setFeedback(lockScreenCopy.helper);
  }

  return (
    <section className="relative flex min-h-[calc(100dvh-var(--safe-top)-1.25rem)] items-center justify-center py-4">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {lockDecorations.map((item) => (
          <motion.div
            key={item.id}
            className="absolute text-2xl sm:text-3xl"
            style={{
              top: item.top,
              left: item.left,
              right: item.right,
              bottom: item.bottom,
            }}
            initial={{ opacity: 0, scale: 0.7, y: 10 }}
            animate={{
              opacity: [0.3, 0.8, 0.45],
              scale: [1, 1.08, 1],
              y: [0, -8, 0],
              rotate: [0, 4, -4, 0],
            }}
            transition={{
              duration: 4.6,
              delay: item.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            {item.emoji}
          </motion.div>
        ))}
      </div>

      <ViewCard
        eyebrow={lockScreenCopy.eyebrow}
        title={lockScreenCopy.title}
        description={lockScreenCopy.subtitle}
      >
        <div className="space-y-5">
          <motion.div
            animate={
              status === "error"
                ? { x: [0, -8, 8, -6, 6, -3, 3, 0] }
                : { x: 0 }
            }
            transition={{ duration: 0.38 }}
            className="grid grid-cols-6 gap-2"
          >
            {Array.from({ length: ACCESS_CODE.length }).map((_, index) => {
              const isFilled = Boolean(digits[index]);
              const isActive =
                index === digits.length &&
                digits.length < ACCESS_CODE.length &&
                (status === "idle" || status === "typing");

              return (
                <motion.div
                  key={index}
                  animate={
                    status === "success" && isFilled
                      ? { scale: [1, 1.08, 1] }
                      : { scale: 1 }
                  }
                  transition={{ duration: 0.25, delay: index * 0.03 }}
                  className={cn(
                    "glass-card flex aspect-square items-center justify-center rounded-[18px] border text-lg font-semibold shadow-sm transition-all",
                    isFilled
                      ? "border-app-primary/30 bg-white/85 text-app-text"
                      : "border-app-border text-app-text-soft/60",
                    isActive && "ring-2 ring-app-primary/25",
                    status === "error" && "border-rose-300/70",
                    status === "success" && "border-emerald-300/80"
                  )}
                >
                  {isFilled ? "♥" : ""}
                </motion.div>
              );
            })}
          </motion.div>

          <div className="min-h-11 rounded-app-xl border border-app-border bg-white/70 px-4 py-3 text-center text-sm leading-6 text-app-text-soft">
            <AnimatePresence mode="wait">
              <motion.p
                key={`${status}-${feedback}`}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.18 }}
              >
                {status === "validating"
                  ? "Checking your code…"
                  : feedback}
              </motion.p>
            </AnimatePresence>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {keypadRows.flat().map((digit) => (
              <button
                key={digit}
                type="button"
                onClick={() => appendDigit(digit)}
                disabled={isBusy}
                className="glass-card flex min-h-14 items-center justify-center rounded-[20px] border border-app-border text-lg font-semibold text-app-text shadow-sm transition-all duration-200 active:scale-[0.98] disabled:opacity-50"
              >
                {digit}
              </button>
            ))}

            <button
              type="button"
              onClick={handleDelete}
              disabled={isBusy}
              className="glass-card flex min-h-14 items-center justify-center rounded-[20px] border border-app-border px-3 text-sm font-medium text-app-text shadow-sm transition-all duration-200 active:scale-[0.98] disabled:opacity-50"
            >
              {lockScreenCopy.delete}
            </button>

            <button
              type="button"
              onClick={() => appendDigit("0")}
              disabled={isBusy}
              className="glass-card flex min-h-14 items-center justify-center rounded-[20px] border border-app-border text-lg font-semibold text-app-text shadow-sm transition-all duration-200 active:scale-[0.98] disabled:opacity-50"
            >
              0
            </button>

            <button
              type="button"
              onClick={handleReset}
              disabled={isBusy}
              className="glass-card flex min-h-14 items-center justify-center rounded-[20px] border border-app-border px-3 text-sm font-medium text-app-text shadow-sm transition-all duration-200 active:scale-[0.98] disabled:opacity-50"
            >
              {lockScreenCopy.reset}
            </button>
          </div>

          <div className="flex items-center justify-center gap-2 text-center text-xs text-app-text-soft">
            <span>⌨️</span>
            <span>{lockScreenCopy.keyboardHint}</span>
          </div>

          <div className="flex items-center justify-center gap-2 pt-1">
            {Array.from({ length: 3 }).map((_, index) => (
              <motion.span
                key={index}
                className="inline-block h-2.5 w-2.5 rounded-full bg-app-primary/45"
                animate={{
                  y: [0, -3, 0],
                  opacity: [0.45, 1, 0.45],
                }}
                transition={{
                  duration: 1.2,
                  delay: index * 0.16,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>

          <p className="text-center text-[11px] uppercase tracking-[0.18em] text-app-text-soft/75">
            {codeValue.length}/{ACCESS_CODE.length} digits entered
          </p>
        </div>
      </ViewCard>
    </section>
  );
}