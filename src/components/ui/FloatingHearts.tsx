"use client";

import { motion } from "motion/react";

const hearts = [
  { id: 1, left: "8%", size: 16, duration: 8, delay: 0 },
  { id: 2, left: "22%", size: 12, duration: 10, delay: 1.5 },
  { id: 3, left: "48%", size: 18, duration: 9, delay: 0.8 },
  { id: 4, left: "66%", size: 14, duration: 11, delay: 2.2 },
  { id: 5, left: "84%", size: 16, duration: 9.5, delay: 1.1 },
];

export function FloatingHearts() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {hearts.map((heart) => (
        <motion.div
          key={heart.id}
          className="absolute top-[105%] select-none text-pink-400/50"
          style={{ left: heart.left, fontSize: heart.size }}
          initial={{ y: 0, opacity: 0 }}
          animate={{ y: -900, opacity: [0, 1, 1, 0], x: [0, 10, -8, 4, 0] }}
          transition={{
            duration: heart.duration,
            delay: heart.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          ❤
        </motion.div>
      ))}
    </div>
  );
}