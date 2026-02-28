"use client";

import { AnimatePresence, motion } from "motion/react";
import { useAppState } from "@/providers/AppStateProvider";
import type { AppView } from "@/types/app";
import { LockScreenView } from "@/views/LockScreenView";
import { DashboardView } from "@/views/DashboardView";
import { LoveWheelView } from "@/views/LoveWheelView";
import { LoveScratchView } from "@/views/LoveScratchView";
import { LoveMapView } from "@/views/LoveMapView";

const viewTitles: Record<AppView, string> = {
  "lock-screen": "Вход",
  dashboard: "Главная",
  "love-wheel": "Колесо любви",
  "love-scratch": "Любовный скретч",
  "love-map": "Карта B ↔ L",
};

function renderView(view: AppView) {
  switch (view) {
    case "lock-screen":
      return <LockScreenView />;
    case "dashboard":
      return <DashboardView />;
    case "love-wheel":
      return <LoveWheelView />;
    case "love-scratch":
      return <LoveScratchView />;
    case "love-map":
      return <LoveMapView />;
    default:
      return <LockScreenView />;
  }
}

export function AppRoot() {
  const {
    hasHydrated,
    activeView,
    isUnlocked,
    canGoBack,
    goBack,
    navigate,
    resetSession,
  } = useAppState();

  if (!hasHydrated) {
    return (
      <section className="flex min-h-[calc(100dvh-var(--safe-top)-2rem)] items-center justify-center">
        <div className="glass-card w-full rounded-app-2xl p-6 text-center shadow-app-card">
          <div className="mb-3 inline-flex rounded-full bg-white/80 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-app-text-soft">
            loading
          </div>
          <h1 className="text-2xl font-semibold text-app-text">
            Chargement de votre univers…
          </h1>
        </div>
      </section>
    );
  }

  return (
    <section className="flex min-h-[calc(100dvh-var(--safe-top)-1.25rem)] flex-col">
      {isUnlocked && activeView !== "lock-screen" ? (
        <header className="mb-4 flex items-center justify-between gap-3 pt-2">
          <button
            type="button"
            onClick={goBack}
            disabled={!canGoBack}
            className="glass-card inline-flex h-11 w-11 items-center justify-center rounded-full text-base text-app-text shadow-sm transition disabled:opacity-40"
            aria-label="Revenir en arrière"
          >
            ←
          </button>

          <div className="glass-card flex min-h-11 items-center rounded-full px-4 text-center text-sm font-medium text-app-text shadow-sm">
            {viewTitles[activeView]}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => navigate("dashboard")}
              className="glass-card inline-flex h-11 w-11 items-center justify-center rounded-full text-base text-app-text shadow-sm transition"
              aria-label="Retour dashboard"
            >
              ⌂
            </button>

            <button
              type="button"
              onClick={resetSession}
              className="glass-card inline-flex h-11 w-11 items-center justify-center rounded-full text-base text-app-text shadow-sm transition"
              aria-label="Réinitialiser la session"
            >
              ↺
            </button>
          </div>
        </header>
      ) : null}

      <div className="relative flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeView}
            initial={{ opacity: 0, y: 14, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.985 }}
            transition={{ duration: 0.24, ease: "easeOut" }}
            className="h-full"
          >
            {renderView(activeView)}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}