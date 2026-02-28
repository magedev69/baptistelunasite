"use client";

import type { ReactNode } from "react";
import { motion } from "motion/react";

type ViewCardProps = {
  eyebrow: string;
  title: string;
  description: string;
  children?: ReactNode;
};

export function ViewCard({
  eyebrow,
  title,
  description,
  children,
}: ViewCardProps) {
  return (
    <section className="flex min-h-full items-center justify-center py-6">
      <motion.div
        initial={{ opacity: 0, y: 18, scale: 0.985 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="glass-card w-full rounded-app-2xl p-6 shadow-app-card"
      >
        <div className="mb-3 inline-flex rounded-full bg-white/80 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-app-text-soft">
          {eyebrow}
        </div>

        <h1 className="text-balance text-3xl font-semibold tracking-tight text-app-text">
          {title}
        </h1>

        <p className="mt-3 max-w-[34ch] text-sm leading-6 text-app-text-soft">
          {description}
        </p>

        {children ? <div className="mt-6">{children}</div> : null}
      </motion.div>
    </section>
  );
}