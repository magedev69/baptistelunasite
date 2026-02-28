"use client";

import { motion } from "motion/react";
import { dashboardFeatures } from "@/data/features";
import { relationshipCopy } from "@/data/relationship";
import { useAppState } from "@/providers/AppStateProvider";
import { FeatureTile } from "@/components/ui/FeatureTile";
import { AppButton } from "@/components/ui/AppButton";
import { FloatingLoveWords } from "@/components/dashboard/FloatingLoveWords";
import { RelationshipCounter } from "@/components/dashboard/RelationshipCounter";

const featureIcons = ["🎡", "✨", "🗺️"];

export function DashboardView() {
  const { navigate, visitedViews, lockApp } = useAppState();

  return (
    <section className="flex flex-col gap-5 py-2">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="relative overflow-hidden glass-card rounded-app-2xl p-6 shadow-app-card"
      >
        <FloatingLoveWords />

        <div className="relative z-10">
          <div className="mb-3 inline-flex rounded-full bg-white/80 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-app-text-soft">
            {relationshipCopy.badge}
          </div>

          <div className="flex flex-col items-center text-center">
            <div className="flex items-center gap-3">
              <span className="text-4xl font-semibold tracking-tight text-app-text">
                {relationshipCopy.titleTop}
              </span>

              <motion.div
                animate={{
                  scale: [1, 1.08, 1],
                  opacity: [0.9, 1, 0.9],
                }}
                transition={{
                  duration: 1.8,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="relative flex h-20 w-20 items-center justify-center"
              >
                <div className="absolute inset-0 rounded-full bg-app-primary/20 blur-2xl" />
                <div className="absolute inset-2 rounded-full bg-app-primary/15 blur-xl" />
                <span className="relative text-4xl drop-shadow-sm">💖</span>
              </motion.div>

              <span className="text-4xl font-semibold tracking-tight text-app-text">
                {relationshipCopy.titleBottom}
              </span>
            </div>

            <div className="mt-2 text-xl font-semibold tracking-tight text-app-primary">
              {relationshipCopy.titleMiddle}
            </div>

            <h1 className="mt-4 max-w-[14ch] text-balance text-3xl font-semibold tracking-tight text-app-text sm:text-4xl">
              {relationshipCopy.headline}
            </h1>

            <p className="mt-3 max-w-[34ch] text-sm leading-6 text-app-text-soft">
              {relationshipCopy.paragraph}
            </p>
          </div>

          <div className="mt-6 flex flex-wrap justify-center gap-2">
            <span className="rounded-full border border-app-border bg-white/75 px-3 py-1.5 text-sm text-app-text-soft">
              Luna
            </span>
            <span className="rounded-full border border-app-border bg-white/75 px-3 py-1.5 text-sm text-app-text-soft">
              Baptiste
            </span>
            <span className="rounded-full border border-app-border bg-white/75 px-3 py-1.5 text-sm text-app-text-soft">
              Forever
            </span>
          </div>

          
        </div>
      </motion.div>

      <RelationshipCounter />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut", delay: 0.14 }}
        className="grid grid-cols-1 gap-4 md:grid-cols-2"
      >
        {dashboardFeatures.map((feature, index) => (
          <FeatureTile
            key={feature.id}
            eyebrow={feature.eyebrow}
            title={feature.title}
            description={feature.description}
            icon={featureIcons[index]}
            onClick={() => navigate(feature.id)}
          />
        ))}
      </motion.div>
    </section>
  );
}