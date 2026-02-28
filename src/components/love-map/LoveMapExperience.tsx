"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { AppButton } from "@/components/ui/AppButton";
import { cn } from "@/utils/cn";
import { useAppState } from "@/providers/AppStateProvider";
import {
  LOVE_MAP_ACTIONS,
  LOVE_MAP_POINTS,
  LOVE_MAP_RIVALS,
  LOVE_MAP_ROUTE_PATH,
  loveMapCopy,
  type LoveMapActionId,
  type LoveMapPointId,
} from "@/data/loveMap";

type FeedbackState = {
  badge: string;
  title: string;
  text: string;
};

type MissileFlight = {
  id: number;
  from: LoveMapPointId;
  to: LoveMapPointId;
};

type TeleportFlight = {
  id: number;
  from: LoveMapPointId;
  to: LoveMapPointId;
};

type BurstState = {
  id: number;
  pointId: LoveMapPointId;
  variant: "hearts" | "sparkles";
};

function getDefaultFeedback(): FeedbackState {
  return {
    badge: loveMapCopy.defaultBadge,
    title: loveMapCopy.defaultTitle,
    text: loveMapCopy.defaultText,
  };
}

function getOtherPointId(pointId: LoveMapPointId): LoveMapPointId {
  return pointId === "B" ? "L" : "B";
}

function WorldArtwork({ rivalsCleared }: { rivalsCleared: boolean }) {
  return (
    <svg
      viewBox="0 0 1000 520"
      className="absolute inset-0 h-full w-full"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="map-route-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#ff6fb5" stopOpacity="0.9" />
          <stop offset="50%" stopColor="#ffd166" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#8b6cff" stopOpacity="0.9" />
        </linearGradient>

        <radialGradient id="corsica-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ff6fb5" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#ff6fb5" stopOpacity="0" />
        </radialGradient>

        <radialGradient id="armenia-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#8b6cff" stopOpacity="0.42" />
          <stop offset="100%" stopColor="#8b6cff" stopOpacity="0" />
        </radialGradient>

        <filter id="route-blur">
          <feGaussianBlur stdDeviation="4" />
        </filter>
      </defs>

      <rect
        x="0"
        y="0"
        width="1000"
        height="520"
        fill="rgba(255,255,255,0.08)"
      />

      <g opacity="0.1" fill="#6d5570">
        <path d="M86 112C126 78 196 72 244 94C286 114 286 160 250 184C222 202 184 196 164 224C146 250 110 254 80 232C54 214 44 180 56 150C64 132 74 120 86 112Z" />
        <path d="M228 262C252 256 286 272 298 304C308 336 294 362 274 388C254 414 242 448 220 470C202 488 176 480 168 458C160 428 172 396 184 370C198 342 196 318 202 292C206 274 214 266 228 262Z" />
        <path d="M404 118C434 96 476 94 508 110C532 122 550 144 550 172C548 198 528 214 506 224C486 234 478 252 484 272C490 294 510 314 520 340C530 366 520 398 494 420C470 440 430 438 406 418C382 398 372 364 382 336C392 308 394 286 382 264C370 242 346 224 342 198C338 170 354 140 380 126C392 120 398 120 404 118Z" />
        <path d="M558 108C604 82 680 76 742 92C806 108 864 150 890 206C908 244 904 290 878 316C852 342 812 350 776 342C742 334 720 312 688 300C656 288 620 290 592 274C562 256 544 228 544 198C544 164 548 132 558 108Z" />
        <path d="M818 374C842 360 878 362 904 376C928 390 934 420 914 438C892 456 848 460 820 446C798 434 792 392 818 374Z" />
      </g>

      <g opacity="0.08" stroke="rgba(109,85,112,0.6)" strokeWidth="1">
        {Array.from({ length: 7 }).map((_, index) => (
          <line
            key={`grid-h-${index}`}
            x1="0"
            y1={index * 86}
            x2="1000"
            y2={index * 86}
          />
        ))}
        {Array.from({ length: 11 }).map((_, index) => (
          <line
            key={`grid-v-${index}`}
            x1={index * 100}
            y1="0"
            x2={index * 100}
            y2="520"
          />
        ))}
      </g>

      <ellipse cx="456" cy="206" rx="40" ry="40" fill="url(#corsica-glow)" />
      <ellipse cx="690" cy="186" rx="50" ry="50" fill="url(#armenia-glow)" />

      <motion.path
        d={LOVE_MAP_ROUTE_PATH}
        fill="none"
        stroke="url(#map-route-gradient)"
        strokeWidth="5"
        strokeLinecap="round"
        opacity="0.24"
        filter="url(#route-blur)"
      />
      <motion.path
        d={LOVE_MAP_ROUTE_PATH}
        fill="none"
        stroke="url(#map-route-gradient)"
        strokeWidth="2.8"
        strokeLinecap="round"
        strokeDasharray="10 10"
        animate={{ strokeDashoffset: [0, -40] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
      />

      <g>
        <path
          d="M449 196C453 186 460 182 465 184C470 186 469 194 466 199C463 204 458 210 454 212C450 208 447 202 449 196Z"
          fill="#ff6fb5"
          opacity="0.9"
        />
        <circle cx="456" cy="206" r="4.2" fill="#ffd7ea" />
      </g>

      <g>
        <path
          d="M676 175C684 165 694 162 703 166C708 170 708 180 702 186C696 193 688 198 678 196C672 190 670 182 676 175Z"
          fill="#8b6cff"
          opacity="0.9"
        />
        <circle cx="690" cy="186" r="4.4" fill="#efe6ff" />
      </g>

      <g opacity={rivalsCleared ? 0.08 : 0.24}>
        {LOVE_MAP_RIVALS.map((marker) => (
          <circle
            key={marker.id}
            cx={parseFloat(marker.left) * 10}
            cy={(parseFloat(marker.top) / 100) * 520}
            r="5"
            fill="#ff9cc9"
          />
        ))}
      </g>
    </svg>
  );
}

function BurstEffect({
  pointId,
  variant,
}: {
  pointId: LoveMapPointId;
  variant: "hearts" | "sparkles";
}) {
  const point = LOVE_MAP_POINTS[pointId];

  const particles =
    variant === "hearts"
      ? [
          { icon: "💖", x: -38, y: -26 },
          { icon: "💘", x: -10, y: -42 },
          { icon: "✨", x: 24, y: -34 },
          { icon: "💞", x: 38, y: -6 },
          { icon: "💗", x: -28, y: 10 },
          { icon: "✨", x: 12, y: 22 },
        ]
      : [
          { icon: "✨", x: -42, y: -18 },
          { icon: "💫", x: -10, y: -40 },
          { icon: "⭐", x: 28, y: -28 },
          { icon: "🫧", x: 38, y: 6 },
          { icon: "✨", x: -26, y: 20 },
          { icon: "💫", x: 8, y: 28 },
        ];

  return (
    <div
      className="pointer-events-none absolute z-30 -translate-x-1/2 -translate-y-1/2"
      style={{ left: point.left, top: point.top }}
    >
      {particles.map((particle, index) => (
        <motion.span
          key={`${variant}-${index}`}
          className="absolute left-0 top-0 text-lg"
          initial={{ x: 0, y: 0, opacity: 0, scale: 0.4 }}
          animate={{
            x: particle.x,
            y: particle.y,
            opacity: [0, 1, 0],
            scale: [0.4, 1, 0.85],
          }}
          transition={{
            duration: 0.9,
            delay: index * 0.03,
            ease: "easeOut",
          }}
        >
          {particle.icon}
        </motion.span>
      ))}
    </div>
  );
}

function PointMarker({
  pointId,
  selectedAction,
  isBusy,
  onClick,
  isDimmed,
}: {
  pointId: LoveMapPointId;
  selectedAction: LoveMapActionId | null;
  isBusy: boolean;
  onClick: (pointId: LoveMapPointId) => void;
  isDimmed?: boolean;
}) {
  const point = LOVE_MAP_POINTS[pointId];
  const isActionReady = Boolean(selectedAction) && !isBusy;

  return (
    <button
      type="button"
      onClick={() => onClick(pointId)}
      disabled={isBusy}
      className={cn(
        "absolute z-20 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center transition",
        isBusy && "cursor-default"
      )}
      style={{ left: point.left, top: point.top, opacity: isDimmed ? 0.35 : 1 }}
      aria-label={`${point.person} in ${point.location}`}
    >
      <div className="relative flex h-16 w-16 items-center justify-center">
        <motion.span
          className="absolute inset-0 rounded-full"
          style={{ backgroundColor: `${point.glow}20` }}
          animate={{
            scale: isActionReady ? [1, 1.22, 1] : [1, 1.14, 1],
            opacity: isActionReady ? [0.55, 0.12, 0.55] : [0.35, 0.1, 0.35],
          }}
          transition={{
            duration: isActionReady ? 0.9 : 1.8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <motion.span
          className="absolute inset-[8px] rounded-full border"
          style={{ borderColor: `${point.glow}55` }}
          animate={{
            scale: isActionReady ? [1, 1.08, 1] : [1, 1.03, 1],
          }}
          transition={{
            duration: 1.3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <motion.span
          whileTap={{ scale: 0.96 }}
          className="relative flex h-11 w-11 items-center justify-center rounded-full border border-white/75 bg-white/90 text-base font-semibold text-app-text shadow-lg backdrop-blur-md"
          style={{ boxShadow: `0 0 26px ${point.glow}35` }}
        >
          {point.label}
        </motion.span>
      </div>

      <div className="mt-1 rounded-full border border-white/60 bg-white/78 px-3 py-1 text-[11px] font-medium tracking-[0.08em] text-app-text shadow-sm backdrop-blur-sm">
        {point.person} · {point.location}
      </div>
    </button>
  );
}

export function LoveMapExperience() {
  const { navigate } = useAppState();

  const timeoutsRef = useRef<number[]>([]);

  const [selectedAction, setSelectedAction] = useState<LoveMapActionId | null>(
    null
  );
  const [feedback, setFeedback] = useState<FeedbackState>(getDefaultFeedback());
  const [missileFlight, setMissileFlight] = useState<MissileFlight | null>(null);
  const [teleportFlight, setTeleportFlight] = useState<TeleportFlight | null>(
    null
  );
  const [burst, setBurst] = useState<BurstState | null>(null);
  const [rivalsCleared, setRivalsCleared] = useState(false);

  const isBusy = Boolean(missileFlight || teleportFlight);

  useEffect(() => {
    return () => {
      timeoutsRef.current.forEach((timeoutId) => window.clearTimeout(timeoutId));
    };
  }, []);

  function queueTimeout(callback: () => void, delay: number) {
    const timeoutId = window.setTimeout(callback, delay);
    timeoutsRef.current.push(timeoutId);
  }

  function resetToDefaultFeedback() {
    setFeedback(
      rivalsCleared
        ? {
            badge: loveMapCopy.onlyLunaBadge,
            title: loveMapCopy.onlyLunaTitle,
            text: loveMapCopy.onlyLunaText,
          }
        : getDefaultFeedback()
    );
  }

  function handleActionSelect(actionId: LoveMapActionId) {
    if (isBusy) return;

    if (selectedAction === actionId) {
      setSelectedAction(null);
      resetToDefaultFeedback();
      return;
    }

    setSelectedAction(actionId);

    if (actionId === "missile") {
      setFeedback({
        badge: loveMapCopy.missileArmedBadge,
        title: loveMapCopy.missileArmedTitle,
        text: loveMapCopy.missileArmedText,
      });
      return;
    }

    setFeedback({
      badge: loveMapCopy.teleportArmedBadge,
      title: loveMapCopy.teleportArmedTitle,
      text: loveMapCopy.teleportArmedText,
    });
  }

  function handleOnlyLunaToggle() {
    if (isBusy) return;

    setSelectedAction(null);

    if (!rivalsCleared) {
      setRivalsCleared(true);
      setFeedback({
        badge: loveMapCopy.onlyLunaBadge,
        title: loveMapCopy.onlyLunaTitle,
        text: loveMapCopy.onlyLunaText,
      });
      setBurst({
        id: Date.now(),
        pointId: "L",
        variant: "sparkles",
      });
      queueTimeout(() => setBurst(null), 1000);
      return;
    }

    setRivalsCleared(false);
    setFeedback({
      badge: loveMapCopy.restoreWorldBadge,
      title: loveMapCopy.restoreWorldTitle,
      text: loveMapCopy.restoreWorldText,
    });
  }

  function handlePointClick(targetId: LoveMapPointId) {
    if (isBusy) return;

    if (!selectedAction) {
      setFeedback({
        badge: loveMapCopy.pickActionFirstBadge,
        title: loveMapCopy.pickActionFirstTitle,
        text: loveMapCopy.pickActionFirstText,
      });
      return;
    }

    const sourceId = getOtherPointId(targetId);
    const source = LOVE_MAP_POINTS[sourceId];
    const target = LOVE_MAP_POINTS[targetId];

    if (selectedAction === "missile") {
      setSelectedAction(null);
      setMissileFlight({
        id: Date.now(),
        from: sourceId,
        to: targetId,
      });

      setFeedback({
        badge: loveMapCopy.missileDeliveredBadge,
        title: "Love missile delivered",
        text: `${source.person} sent a heart rocket to ${target.person} in ${target.location}. Impact level: maximum softness.`,
      });

      queueTimeout(() => {
        setBurst({
          id: Date.now(),
          pointId: targetId,
          variant: "hearts",
        });
      }, 850);

      queueTimeout(() => {
        setMissileFlight(null);
      }, 1250);

      queueTimeout(() => {
        setBurst(null);
      }, 1650);

      return;
    }

    setSelectedAction(null);
    setTeleportFlight({
      id: Date.now(),
      from: sourceId,
      to: targetId,
    });

    setFeedback({
      badge: loveMapCopy.teleportDeliveredBadge,
      title: "Distance cancelled",
      text: `${source.person} has been teleported to ${target.person}. Geography has been politely ignored.`,
    });

    queueTimeout(() => {
      setBurst({
        id: Date.now(),
        pointId: targetId,
        variant: "sparkles",
      });
    }, 700);

    queueTimeout(() => {
      setTeleportFlight(null);
    }, 1100);

    queueTimeout(() => {
      setBurst(null);
    }, 1500);
  }

  const footerHint = useMemo(() => {
    if (selectedAction === "missile") {
      return "Love missile selected — tap B or L on the map.";
    }

    if (selectedAction === "teleport") {
      return "Teleport selected — tap B or L on the map.";
    }

    if (rivalsCleared) {
      return "World secured. Luna has exclusive map priority.";
    }

    return "Pick an action below, then use the map points.";
  }, [selectedAction, rivalsCleared]);

  return (
    <div className="space-y-6">
      <div className="rounded-app-xl border border-app-border bg-white/72 p-4 text-sm leading-6 text-app-text-soft">
        {loveMapCopy.helper}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="glass-card rounded-app-2xl p-5 shadow-app-card"
      >
        <div className="mb-3 inline-flex rounded-full bg-white/80 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-app-text-soft">
          {feedback.badge}
        </div>

        <h3 className="text-xl font-semibold tracking-tight text-app-text">
          {feedback.title}
        </h3>

        <p className="mt-2 text-sm leading-6 text-app-text-soft">
          {feedback.text}
        </p>
      </motion.div>

      <div className="mx-auto w-full max-w-[720px]">
        <div className="relative aspect-[16/10] overflow-hidden rounded-[30px] border border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.92),rgba(255,247,251,0.88))] shadow-[0_20px_60px_rgba(255,111,181,0.15)]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,111,181,0.14),transparent_30%),radial-gradient(circle_at_20%_80%,rgba(255,209,102,0.12),transparent_24%),radial-gradient(circle_at_80%_30%,rgba(139,108,255,0.12),transparent_24%)]" />

          <WorldArtwork rivalsCleared={rivalsCleared} />

          <AnimatePresence>
            {LOVE_MAP_RIVALS.map((marker, index) => (
              <motion.span
                key={marker.id}
                className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/60 bg-white/78 px-2 py-1 text-[10px] shadow-sm backdrop-blur-sm"
                style={{ left: marker.left, top: marker.top }}
                initial={{ opacity: 0.56, scale: 1 }}
                animate={
                  rivalsCleared
                    ? {
                        opacity: 0,
                        scale: 0,
                        y: -22,
                        filter: "blur(4px)",
                      }
                    : {
                        opacity: 0.56,
                        scale: 1,
                        y: [0, -4, 0],
                        filter: "blur(0px)",
                      }
                }
                transition={{
                  duration: rivalsCleared ? 0.4 : 2.4,
                  delay: rivalsCleared ? index * 0.03 : index * 0.08,
                  repeat: rivalsCleared ? 0 : Infinity,
                  ease: "easeInOut",
                }}
              >
                ♡
              </motion.span>
            ))}
          </AnimatePresence>

          <PointMarker
            pointId="B"
            selectedAction={selectedAction}
            isBusy={isBusy}
            onClick={handlePointClick}
            isDimmed={teleportFlight?.from === "B"}
          />
          <PointMarker
            pointId="L"
            selectedAction={selectedAction}
            isBusy={isBusy}
            onClick={handlePointClick}
            isDimmed={teleportFlight?.from === "L"}
          />

          <AnimatePresence>
            {missileFlight ? (
              <motion.div
                key={`missile-${missileFlight.id}`}
                className="pointer-events-none absolute z-30 -translate-x-1/2 -translate-y-1/2 text-2xl drop-shadow-lg"
                initial={{
                  left: LOVE_MAP_POINTS[missileFlight.from].left,
                  top: LOVE_MAP_POINTS[missileFlight.from].top,
                  scale: 0.8,
                  rotate: -18,
                  opacity: 1,
                }}
                animate={{
                  left: LOVE_MAP_POINTS[missileFlight.to].left,
                  top: LOVE_MAP_POINTS[missileFlight.to].top,
                  scale: [0.8, 1.05, 0.95],
                  rotate: [-18, 8, 0],
                  opacity: [0, 1, 1],
                }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: 1.15,
                  ease: [0.18, 0.82, 0.22, 1],
                }}
              >
                💘
              </motion.div>
            ) : null}
          </AnimatePresence>

          <AnimatePresence>
            {teleportFlight ? (
              <>
                <motion.div
                  key={`teleport-traveller-${teleportFlight.id}`}
                  className="pointer-events-none absolute z-30 -translate-x-1/2 -translate-y-1/2 text-2xl drop-shadow-lg"
                  initial={{
                    left: LOVE_MAP_POINTS[teleportFlight.from].left,
                    top: LOVE_MAP_POINTS[teleportFlight.from].top,
                    scale: 0.5,
                    opacity: 0,
                  }}
                  animate={{
                    left: LOVE_MAP_POINTS[teleportFlight.to].left,
                    top: LOVE_MAP_POINTS[teleportFlight.to].top,
                    scale: [0.5, 1.2, 0.7],
                    opacity: [0, 1, 0],
                    rotate: [0, 90, 180],
                  }}
                  exit={{ opacity: 0 }}
                  transition={{
                    duration: 1.05,
                    ease: "easeInOut",
                  }}
                >
                  ✨
                </motion.div>

                <motion.div
                  key={`teleport-glow-${teleportFlight.id}`}
                  className="pointer-events-none absolute z-20 -translate-x-1/2 -translate-y-1/2 rounded-full bg-app-secondary/20 blur-2xl"
                  style={{
                    left: LOVE_MAP_POINTS[teleportFlight.to].left,
                    top: LOVE_MAP_POINTS[teleportFlight.to].top,
                    width: 90,
                    height: 90,
                  }}
                  initial={{ scale: 0.4, opacity: 0 }}
                  animate={{ scale: [0.4, 1.25, 0.9], opacity: [0, 0.9, 0] }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.05, ease: "easeOut" }}
                />
              </>
            ) : null}
          </AnimatePresence>

          <AnimatePresence>
            {burst ? (
              <BurstEffect pointId={burst.pointId} variant={burst.variant} />
            ) : null}
          </AnimatePresence>

          <div className="pointer-events-none absolute left-4 top-4 rounded-full border border-white/70 bg-white/82 px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.18em] text-app-text-soft shadow-sm backdrop-blur-sm">
            {loveMapCopy.readyHintBadge}
          </div>

          <div className="pointer-events-none absolute bottom-4 left-1/2 z-20 w-[min(92%,420px)] -translate-x-1/2 rounded-full border border-white/70 bg-white/82 px-4 py-2 text-center text-xs font-medium tracking-[0.06em] text-app-text-soft shadow-sm backdrop-blur-sm">
            {footerHint}
          </div>
        </div>
      </div>

      <div>
        <div className="mb-3 inline-flex rounded-full bg-white/80 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-app-text-soft">
          {loveMapCopy.actionsTitle}
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          {LOVE_MAP_ACTIONS.map((action) => {
            const isActive = selectedAction === action.id;

            return (
              <button
                key={action.id}
                type="button"
                onClick={() => handleActionSelect(action.id)}
                disabled={isBusy}
                className={cn(
                  "glass-card w-full rounded-app-2xl p-4 text-left shadow-app-card transition-all duration-200 active:scale-[0.99]",
                  isActive
                    ? "border-app-primary/35 bg-white/88 shadow-app-glow"
                    : "hover:-translate-y-0.5",
                  isBusy && "opacity-60"
                )}
              >
                <div className="mb-3 flex items-center justify-between gap-3">
                  <span className="text-2xl">{action.icon}</span>
                  {isActive ? (
                    <span className="rounded-full bg-app-primary/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-app-primary">
                      armed
                    </span>
                  ) : null}
                </div>

                <h4 className="text-lg font-semibold tracking-tight text-app-text">
                  {action.title}
                </h4>

                <p className="mt-2 text-sm leading-6 text-app-text-soft">
                  {action.description}
                </p>
              </button>
            );
          })}

          <button
            type="button"
            onClick={handleOnlyLunaToggle}
            disabled={isBusy}
            className={cn(
              "glass-card w-full rounded-app-2xl p-4 text-left shadow-app-card transition-all duration-200 active:scale-[0.99]",
              rivalsCleared
                ? "border-app-primary/35 bg-white/88 shadow-app-glow"
                : "hover:-translate-y-0.5",
              isBusy && "opacity-60"
            )}
          >
            <div className="mb-3 flex items-center justify-between gap-3">
              <span className="text-2xl">👑</span>
              {rivalsCleared ? (
                <span className="rounded-full bg-app-primary/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-app-primary">
                  active
                </span>
              ) : null}
            </div>

            <h4 className="text-lg font-semibold tracking-tight text-app-text">
              {rivalsCleared ? loveMapCopy.restoreWorld : loveMapCopy.onlyLuna}
            </h4>

            <p className="mt-2 text-sm leading-6 text-app-text-soft">
              {rivalsCleared
                ? "Bring the tiny rival markers back for replay value and drama."
                : "Remove every rival marker from the world and secure full Luna exclusivity."}
            </p>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <AppButton
          variant="secondary"
          onClick={() => navigate("dashboard")}
          className="w-full"
        >
          {loveMapCopy.backToDashboard}
        </AppButton>

        <AppButton
          onClick={() => {
            setSelectedAction(null);
            setMissileFlight(null);
            setTeleportFlight(null);
            setBurst(null);
            setRivalsCleared(false);
            setFeedback(getDefaultFeedback());
          }}
          className="w-full"
        >
          Reset map magic
        </AppButton>
      </div>
    </div>
  );
}