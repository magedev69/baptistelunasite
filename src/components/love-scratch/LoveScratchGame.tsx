"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { AnimatePresence, motion } from "motion/react";
import { AppButton } from "@/components/ui/AppButton";
import {
  LOVE_SCRATCH_REWARDS,
  loveScratchCopy,
  type LoveScratchReward,
} from "@/data/loveScratch";
import { useAppState } from "@/providers/AppStateProvider";

const SCRATCH_THRESHOLD = 42;
const BRUSH_RADIUS = 20;

function roundedRectPath(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

function pickRandomReward(excludeId?: string): LoveScratchReward {
  const pool =
    LOVE_SCRATCH_REWARDS.length > 1 && excludeId
      ? LOVE_SCRATCH_REWARDS.filter((reward) => reward.id !== excludeId)
      : LOVE_SCRATCH_REWARDS;

  return pool[Math.floor(Math.random() * pool.length)];
}

export function LoveScratchGame() {
  const { navigate } = useAppState();

  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isPointerDownRef = useRef(false);
  const lastPointRef = useRef<{ x: number; y: number } | null>(null);

  const [currentReward, setCurrentReward] = useState<LoveScratchReward>(
    () => LOVE_SCRATCH_REWARDS[0]
  );
  const [scratchPercent, setScratchPercent] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);
  const [isCanvasReady, setIsCanvasReady] = useState(false);

  const progressLabel = useMemo(
    () => `${Math.min(100, Math.round(scratchPercent))}%`,
    [scratchPercent]
  );

  const drawCover = useCallback(() => {
    const canvas = canvasRef.current;
    const wrapper = wrapperRef.current;
    if (!canvas || !wrapper) return;

    const rect = wrapper.getBoundingClientRect();
    const dpr = Math.max(window.devicePixelRatio || 1, 1);

    canvas.width = Math.max(1, Math.floor(rect.width * dpr));
    canvas.height = Math.max(1, Math.floor(rect.height * dpr));
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, rect.width, rect.height);

    const radius = 28;

    ctx.save();
    roundedRectPath(ctx, 0, 0, rect.width, rect.height, radius);
    ctx.clip();

    const gradient = ctx.createLinearGradient(0, 0, rect.width, rect.height);
    gradient.addColorStop(0, "#ffdbe9");
    gradient.addColorStop(0.35, "#f4ddff");
    gradient.addColorStop(0.7, "#dff5ff");
    gradient.addColorStop(1, "#fff0d9");

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, rect.width, rect.height);

    const shine = ctx.createLinearGradient(0, 0, rect.width, 0);
    shine.addColorStop(0, "rgba(255,255,255,0)");
    shine.addColorStop(0.3, "rgba(255,255,255,0.18)");
    shine.addColorStop(0.5, "rgba(255,255,255,0.42)");
    shine.addColorStop(0.7, "rgba(255,255,255,0.18)");
    shine.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = shine;
    ctx.fillRect(-40, 0, rect.width + 80, rect.height);

    for (let i = 0; i < 18; i += 1) {
      const x = 24 + ((rect.width - 48) / 17) * i;
      const y = 24 + ((i % 4) * (rect.height - 48)) / 4;

      ctx.beginPath();
      ctx.arc(x, y, 2 + (i % 3), 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255,255,255,0.28)";
      ctx.fill();
    }

    ctx.fillStyle = "rgba(92, 51, 95, 0.78)";
    ctx.font = "700 14px Arial";
    ctx.textAlign = "center";
    ctx.fillText("Scratch me", rect.width / 2, rect.height / 2 - 6);

    ctx.fillStyle = "rgba(92, 51, 95, 0.56)";
    ctx.font = "500 12px Arial";
    ctx.fillText("✨ reveal your reward ✨", rect.width / 2, rect.height / 2 + 18);

    ctx.restore();

    ctx.save();
    roundedRectPath(ctx, 1, 1, rect.width - 2, rect.height - 2, radius);
    ctx.strokeStyle = "rgba(255,255,255,0.65)";
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.restore();

    setIsCanvasReady(true);
  }, []);

  const computeScratchPercent = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return 0;

    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return 0;

    const { width, height } = canvas;
    const imageData = ctx.getImageData(0, 0, width, height).data;

    let transparentPixels = 0;
    const totalPixels = width * height;

    for (let index = 3; index < imageData.length; index += 4) {
      if (imageData[index] < 16) {
        transparentPixels += 1;
      }
    }

    return (transparentPixels / totalPixels) * 100;
  }, []);

  const revealAll = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setScratchPercent(100);
    setIsRevealed(true);
  }, []);

  const scratchAt = useCallback(
    (clientX: number, clientY: number) => {
      const canvas = canvasRef.current;
      if (!canvas || isRevealed) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;

      const x = (clientX - rect.left) * scaleX;
      const y = (clientY - rect.top) * scaleY;

      ctx.save();
      ctx.globalCompositeOperation = "destination-out";
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.strokeStyle = "rgba(0,0,0,1)";
      ctx.fillStyle = "rgba(0,0,0,1)";
      ctx.lineWidth = BRUSH_RADIUS * 2 * scaleX;

      const previous = lastPointRef.current;
      if (previous) {
        ctx.beginPath();
        ctx.moveTo(previous.x * scaleX, previous.y * scaleY);
        ctx.lineTo(x, y);
        ctx.stroke();
      }

      ctx.beginPath();
      ctx.arc(x, y, BRUSH_RADIUS * scaleX, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      lastPointRef.current = { x: clientX - rect.left, y: clientY - rect.top };
    },
    [isRevealed]
  );

  const finalizeScratch = useCallback(() => {
    if (isRevealed) return;

    const percent = computeScratchPercent();
    setScratchPercent(percent);

    if (percent >= SCRATCH_THRESHOLD) {
      revealAll();
    }
  }, [computeScratchPercent, isRevealed, revealAll]);

  useEffect(() => {
    setCurrentReward(pickRandomReward());
  }, []);

  useEffect(() => {
    drawCover();

    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const observer = new ResizeObserver(() => {
      if (!isRevealed) {
        drawCover();
      }
    });

    observer.observe(wrapper);

    return () => observer.disconnect();
  }, [drawCover, isRevealed]);

  function handlePointerDown(event: ReactPointerEvent<HTMLCanvasElement>) {
    if (isRevealed) return;

    isPointerDownRef.current = true;
    lastPointRef.current = null;
    event.currentTarget.setPointerCapture(event.pointerId);
    scratchAt(event.clientX, event.clientY);
  }

  function handlePointerMove(event: ReactPointerEvent<HTMLCanvasElement>) {
    if (!isPointerDownRef.current || isRevealed) return;
    scratchAt(event.clientX, event.clientY);
  }

  function handlePointerUp() {
    if (!isPointerDownRef.current) return;

    isPointerDownRef.current = false;
    lastPointRef.current = null;
    finalizeScratch();
  }

  function handleReset() {
    const nextReward = pickRandomReward(currentReward.id);
    setCurrentReward(nextReward);
    setScratchPercent(0);
    setIsRevealed(false);
    setIsCanvasReady(false);

    requestAnimationFrame(() => {
      drawCover();
    });
  }

  return (
    <div className="space-y-6">
      <div className="rounded-app-xl border border-app-border bg-white/72 p-4 text-sm leading-6 text-app-text-soft">
        {loveScratchCopy.helper}
      </div>

      <div className="mx-auto w-full max-w-[360px]">
        <div className="mb-3 flex items-center justify-between gap-3">
          <span className="rounded-full border border-app-border bg-white/75 px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.18em] text-app-text-soft shadow-sm">
            {loveScratchCopy.readyBadge}
          </span>

          <span className="rounded-full border border-app-border bg-white/75 px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.18em] text-app-text-soft shadow-sm">
            {loveScratchCopy.progress} {progressLabel}
          </span>
        </div>

        <div
          ref={wrapperRef}
          className="relative aspect-[5/6] overflow-hidden rounded-[28px] border border-white/70 bg-white/85 shadow-[0_18px_50px_rgba(255,111,181,0.16)]"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,111,181,0.14),transparent_35%),radial-gradient(circle_at_bottom,rgba(139,108,255,0.10),transparent_28%)]" />

          <div className="absolute inset-[14px] rounded-[24px] border border-app-border bg-white/72 p-5">
            <div className="flex h-full flex-col justify-between">
              <div>
                <div className="inline-flex rounded-full bg-white/80 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-app-text-soft">
                  {isRevealed
                    ? currentReward.badge
                    : loveScratchCopy.hiddenStateTitle}
                </div>

                <div className="mt-4 flex items-center justify-center">
                  <motion.div
                    animate={{
                      scale: isRevealed ? [1, 1.08, 1] : [1, 1.03, 1],
                      rotate: isRevealed ? [0, 4, -4, 0] : 0,
                    }}
                    transition={{
                      duration: 1.7,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="relative flex h-24 w-24 items-center justify-center rounded-full bg-white/80"
                  >
                    <div className="absolute inset-0 rounded-full bg-app-primary/18 blur-2xl" />
                    <span className="relative text-5xl">
                      {isRevealed ? currentReward.emoji : "🎟️"}
                    </span>
                  </motion.div>
                </div>

                <div className="mt-5 text-center">
                  <h3 className="text-2xl font-semibold tracking-tight text-app-text">
                    {isRevealed
                      ? currentReward.title
                      : loveScratchCopy.hiddenStateTitle}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-app-text-soft">
                    {isRevealed
                      ? currentReward.description
                      : loveScratchCopy.hiddenStateText}
                  </p>
                </div>
              </div>

              <div className="rounded-app-xl border border-app-border bg-white/70 px-4 py-3 text-center text-sm text-app-text-soft">
                {isRevealed
                  ? currentReward.revealMessage
                  : loveScratchCopy.revealHint}
              </div>
            </div>
          </div>

          <AnimatePresence>
            {!isRevealed ? (
              <motion.canvas
                key="scratch-layer"
                ref={canvasRef}
                initial={{ opacity: 0 }}
                animate={{ opacity: isCanvasReady ? 1 : 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerLeave={handlePointerUp}
                onPointerCancel={handlePointerUp}
                className="absolute inset-0 z-20 h-full w-full touch-none"
              />
            ) : null}
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={isRevealed ? currentReward.id : "hidden"}
          initial={{ opacity: 0, y: 18, scale: 0.985 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 8, scale: 0.985 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="glass-card rounded-app-2xl p-5 shadow-app-card"
        >
          <div className="mb-3 inline-flex rounded-full bg-white/80 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-app-text-soft">
            {isRevealed
              ? loveScratchCopy.resultBadge
              : loveScratchCopy.readyBadge}
          </div>

          <div className="text-center">
            <h3 className="text-xl font-semibold tracking-tight text-app-text">
              {isRevealed
                ? currentReward.title
                : "Your reward is still hidden"}
            </h3>

            <p className="mt-3 text-sm leading-6 text-app-text-soft">
              {isRevealed
                ? currentReward.revealMessage
                : "Scratch enough of the surface and the full card will open automatically."}
            </p>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <AppButton onClick={handleReset}>
              {loveScratchCopy.scratchAgain}
            </AppButton>

            <AppButton
              variant="secondary"
              onClick={() => navigate("dashboard")}
            >
              {loveScratchCopy.backToDashboard}
            </AppButton>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}