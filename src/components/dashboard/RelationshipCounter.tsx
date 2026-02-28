"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import { relationshipCopy, RELATIONSHIP_START_ISO } from "@/data/relationship";
import { getRelationshipParts, padTimeUnit } from "@/utils/relationship";

const labels = [
  { key: "years", label: "Years" },
  { key: "months", label: "Months" },
  { key: "weeks", label: "Weeks" },
  { key: "days", label: "Days" },
  { key: "hours", label: "Hours" },
  { key: "minutes", label: "Minutes" },
  { key: "seconds", label: "Seconds" },
] as const;

export function RelationshipCounter() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const interval = window.setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => window.clearInterval(interval);
  }, []);

  const parts = useMemo(
    () => getRelationshipParts(RELATIONSHIP_START_ISO, now),
    [now]
  );

  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut", delay: 0.08 }}
      className="glass-card rounded-app-2xl p-5 shadow-app-card"
    >
      <div className="mb-3 inline-flex rounded-full bg-white/80 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-app-text-soft">
        live counter
      </div>

      <h2 className="text-xl font-semibold tracking-tight text-app-text">
        {relationshipCopy.counterTitle}
      </h2>

      <p className="mt-2 text-sm leading-6 text-app-text-soft">
        {relationshipCopy.counterSubtitle}
      </p>

      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {labels.map((item, index) => {
          const value = parts[item.key];

          return (
            <motion.div
              key={item.key}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.28, delay: 0.03 * index }}
              className="rounded-[22px] border border-app-border bg-white/75 p-4 text-center shadow-sm"
            >
              <div className="text-2xl font-semibold tracking-tight text-app-text">
                {padTimeUnit(value)}
              </div>
              <div className="mt-1 text-[11px] uppercase tracking-[0.18em] text-app-text-soft">
                {item.label}
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.section>
  );
}