"use client";

import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { AppButton } from "@/components/ui/AppButton";
import {
  LOVE_WHEEL_REWARDS,
  loveWheelCopy,
  type LoveWheelReward,
} from "@/data/loveWheel";
import { useAppState } from "@/providers/AppStateProvider";

const SPIN_DURATION_MS = 5200;
const WHEEL_SIZE = 320;
const WHEEL_CENTER = WHEEL_SIZE / 2;
const LABEL_RADIUS = 116;
const EMOJI_RADIUS = 88;
const SEPARATOR_INNER_RADIUS = 58;
const SEPARATOR_OUTER_RADIUS = 150;

function polarToCartesian(radius: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;

  return {
    x: WHEEL_CENTER + radius * Math.cos(rad),
    y: WHEEL_CENTER + radius * Math.sin(rad),
  };
}

export function LoveWheelGame() {
  const { navigate } = useAppState();

  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedReward, setSelectedReward] = useState<LoveWheelReward | null>(
    null
  );

  const timeoutRef = useRef<number | null>(null);

  const segmentCount = LOVE_WHEEL_REWARDS.length;
  const segmentAngle = 360 / segmentCount;

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const wheelGradient = useMemo(() => {
    return `conic-gradient(${LOVE_WHEEL_REWARDS.map((reward, index) => {
      const start = index * segmentAngle;
      const end = start + segmentAngle;
      return `${reward.color} ${start}deg ${end}deg`;
    }).join(", ")})`;
  }, [segmentAngle]);

  function getTargetRotationForIndex(index: number) {
    const currentNormalized = ((rotation % 360) + 360) % 360;
    const segmentCenter = index * segmentAngle + segmentAngle / 2;

    const desiredNormalized = (360 - segmentCenter) % 360;
    const delta =
      (desiredNormalized - currentNormalized + 360) % 360 || 360;
    const extraSpins = (5 + Math.floor(Math.random() * 2)) * 360;

    return rotation + extraSpins + delta;
  }

  function handleSpin() {
    if (isSpinning) return;

    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
    }

    const nextIndex = Math.floor(Math.random() * LOVE_WHEEL_REWARDS.length);
    const reward = LOVE_WHEEL_REWARDS[nextIndex];
    const nextRotation = getTargetRotationForIndex(nextIndex);

    setSelectedReward(null);
    setIsSpinning(true);
    setRotation(nextRotation);

    timeoutRef.current = window.setTimeout(() => {
      setSelectedReward(reward);
      setIsSpinning(false);
    }, SPIN_DURATION_MS);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-app-xl border border-app-border bg-white/72 p-4 text-sm leading-6 text-app-text-soft">
        {loveWheelCopy.helper}
      </div>

      <div className="relative mx-auto flex w-full max-w-[340px] flex-col items-center">
        <div className="pointer-events-none absolute -top-2 z-20">
          <div className="h-0 w-0 border-l-[14px] border-r-[14px] border-t-[22px] border-l-transparent border-r-transparent border-t-app-primary drop-shadow-sm" />
        </div>

        <motion.div
          className="relative mt-6 h-[320px] w-[320px] rounded-full border-[10px] border-white/80 shadow-[0_18px_50px_rgba(255,111,181,0.20)]"
          style={{
            background: wheelGradient,
            transform: `rotate(${rotation}deg)`,
            transition: isSpinning
              ? `transform ${SPIN_DURATION_MS}ms cubic-bezier(0.12, 0.82, 0.18, 1)`
              : undefined,
          }}
        >
          <div className="absolute inset-[14px] rounded-full border border-white/60" />
          <div className="absolute inset-[36px] rounded-full border border-white/30" />

          <svg
            viewBox={`0 0 ${WHEEL_SIZE} ${WHEEL_SIZE}`}
            className="pointer-events-none absolute inset-0 h-full w-full"
          >
            {LOVE_WHEEL_REWARDS.map((_, index) => {
              const angle = index * segmentAngle;
              const start = polarToCartesian(SEPARATOR_INNER_RADIUS, angle);
              const end = polarToCartesian(SEPARATOR_OUTER_RADIUS, angle);

              return (
                <line
                  key={`separator-${index}`}
                  x1={start.x}
                  y1={start.y}
                  x2={end.x}
                  y2={end.y}
                  stroke="rgba(255,255,255,0.45)"
                  strokeWidth="1.5"
                />
              );
            })}
          </svg>

          {LOVE_WHEEL_REWARDS.map((reward, index) => {
            const angle = index * segmentAngle + segmentAngle / 2;
            const labelPoint = polarToCartesian(LABEL_RADIUS, angle);
            const emojiPoint = polarToCartesian(EMOJI_RADIUS, angle);

            return (
              <Fragment key={reward.id}>
                <div
                  className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-1/2"
                  style={{
                    left: `${emojiPoint.x}px`,
                    top: `${emojiPoint.y}px`,
                  }}
                >
                  <span className="block text-lg drop-shadow-[0_2px_4px_rgba(255,255,255,0.4)]">
                    {reward.emoji}
                  </span>
                </div>

                <div
                  className="pointer-events-none absolute z-10 w-[82px] -translate-x-1/2 -translate-y-1/2 px-1 text-center"
                  style={{
                    left: `${labelPoint.x}px`,
                    top: `${labelPoint.y}px`,
                  }}
                >
                  <span className="block text-[10px] font-semibold uppercase leading-[1.08] tracking-[0.12em] text-app-text">
                    {reward.shortLabel}
                  </span>
                </div>
              </Fragment>
            );
          })}

          <div className="absolute left-1/2 top-1/2 z-20 flex h-[96px] w-[96px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/70 bg-white/88 shadow-lg backdrop-blur-md">
            <motion.div
              animate={{
                scale: isSpinning ? [1, 1.06, 1] : [1, 1.03, 1],
              }}
              transition={{
                duration: isSpinning ? 0.8 : 1.8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="text-center"
            >
              <div className="text-2xl">💖</div>
              <div className="mt-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-app-text-soft">
                Love
              </div>
            </motion.div>
          </div>
        </motion.div>

        <div className="mt-5 flex w-full flex-col gap-3">
          <AppButton onClick={handleSpin} disabled={isSpinning} className="w-full">
            {isSpinning ? loveWheelCopy.spinning : loveWheelCopy.spin}
          </AppButton>

          <AppButton
            variant="secondary"
            onClick={() => navigate("dashboard")}
            className="w-full"
          >
            {loveWheelCopy.backToDashboard}
          </AppButton>
        </div>
      </div>

      <div>
        <div className="mb-3 inline-flex rounded-full bg-white/80 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-app-text-soft">
          {loveWheelCopy.possibleRewards}
        </div>

        <div className="flex flex-wrap gap-2">
          {LOVE_WHEEL_REWARDS.map((reward) => (
            <span
              key={reward.id}
              className="rounded-full border border-app-border bg-white/75 px-3 py-1.5 text-sm text-app-text-soft shadow-sm"
            >
              {reward.emoji} {reward.shortLabel}
            </span>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {selectedReward ? (
          <motion.div
            key={selectedReward.id}
            initial={{ opacity: 0, y: 18, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
            className="glass-card rounded-app-2xl p-5 shadow-app-card"
          >
            <div className="mb-3 inline-flex rounded-full bg-white/80 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-app-text-soft">
              {loveWheelCopy.resultBadge}
            </div>

            <div className="flex flex-col items-center text-center">
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [0, 4, -4, 0],
                }}
                transition={{
                  duration: 1.6,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="relative mb-3 flex h-20 w-20 items-center justify-center rounded-full bg-white/80"
              >
                <div className="absolute inset-0 rounded-full bg-app-primary/20 blur-2xl" />
                <span className="relative text-4xl">{selectedReward.emoji}</span>
              </motion.div>

              <h3 className="text-2xl font-semibold tracking-tight text-app-text">
                {selectedReward.title}
              </h3>

              <p className="mt-2 max-w-[32ch] text-sm leading-6 text-app-text-soft">
                {selectedReward.description}
              </p>

              <p className="mt-3 text-sm font-medium text-app-primary">
                {selectedReward.resultMessage}
              </p>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <AppButton onClick={handleSpin} disabled={isSpinning}>
                {loveWheelCopy.playAgain}
              </AppButton>

              <AppButton
                variant="secondary"
                onClick={() => navigate("dashboard")}
              >
                {loveWheelCopy.backToDashboard}
              </AppButton>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}