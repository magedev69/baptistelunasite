"use client";

import { motion } from "motion/react";
import { loveWords } from "@/data/loveWords";

const positions = [
  { top: "6%", left: "4%" },
  { top: "12%", right: "8%" },
  { top: "22%", left: "2%" },
  { top: "26%", right: "2%" },
  { top: "42%", left: "3%" },
  { top: "48%", right: "3%" },
  { top: "62%", left: "8%" },
  { top: "66%", right: "10%" },
  { top: "78%", left: "6%" },
  { top: "82%", right: "4%" },
  { top: "35%", left: "14%" },
  { top: "54%", right: "18%" },
];

export function FloatingLoveWords() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {loveWords.slice(0, positions.length).map((word, index) => {
        const pos = positions[index];

        return (
          <motion.div
            key={`${word}-${index}`}
            className="absolute rounded-full border border-white/50 bg-white/55 px-3 py-1 text-[11px] font-medium text-app-text-soft shadow-sm backdrop-blur-sm sm:text-xs"
            style={pos}
            initial={{ opacity: 0, scale: 0.92, y: 8 }}
            animate={{
              opacity: [0.3, 0.72, 0.45],
              scale: [1, 1.04, 1],
              y: [0, -8, 0],
              rotate: [0, 1.5, -1.5, 0],
            }}
            transition={{
              duration: 4.8 + (index % 3),
              delay: index * 0.14,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            {word}
          </motion.div>
        );
      })}
    </div>
  );
}