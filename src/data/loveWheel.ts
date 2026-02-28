export type LoveWheelReward = {
  id: string;
  title: string;
  shortLabel: string;
  description: string;
  resultMessage: string;
  emoji: string;
  color: string;
};

export const loveWheelCopy = {
  eyebrow: "feature 01",
  title: "Roue de l'amour",
  description:
    "Прокрути колесо и доверься судьбе — она выберет для тебя маленький сладкий сюрприз. 💖",
  spin: "Spin the wheel",
  spinning: "Spinning...",
  possibleRewards: "Possible rewards",
  resultBadge: "you got",
  playAgain: "Spin again",
  backToDashboard: "Back to dashboard",
};

export const LOVE_WHEEL_REWARDS: LoveWheelReward[] = [
  {
    id: "kiss",
    title: "One Kiss",
    shortLabel: "1 Kiss",
    description: "You unlock one sweet kiss, valid whenever you want it.",
    resultMessage: "A very soft reward just landed on your lips.",
    emoji: "💋",
    color: "#ffd6e7",
  },
  {
    id: "compliment",
    title: "Sweet Compliment",
    shortLabel: "Compliment",
    description: "You win a cute compliment made just for you.",
    resultMessage: "Reminder: you are ridiculously pretty.",
    emoji: "🌸",
    color: "#ffe9c7",
  },
  {
    id: "memory",
    title: "Little Memory",
    shortLabel: "Memory",
    description: "A sweet memory from us gets unlocked.",
    resultMessage: "A tiny piece of our story just came back to life.",
    emoji: "📸",
    color: "#dff5ff",
  },
  {
    id: "mission",
    title: "Couple Mission",
    shortLabel: "Mission",
    description: "You unlock a fun little mission for the two of us.",
    resultMessage: "Time for a tiny romantic mission.",
    emoji: "🎯",
    color: "#e8dcff",
  },
  {
    id: "surprise",
    title: "Mini Surprise",
    shortLabel: "Surprise",
    description: "A small surprise is now officially yours.",
    resultMessage: "Something cute has been activated for you.",
    emoji: "🎁",
    color: "#ffe3ef",
  },
  {
    id: "cuddle",
    title: "Cuddle Voucher",
    shortLabel: "Cuddle",
    description: "You receive one cuddle voucher with unlimited warmth.",
    resultMessage: "This voucher is valid for maximum softness.",
    emoji: "🧸",
    color: "#fff0d9",
  },
  {
    id: "hidden-message",
    title: "Hidden Message",
    shortLabel: "Message",
    description: "You reveal a secret little message full of love.",
    resultMessage: "A tiny secret has chosen you.",
    emoji: "💌",
    color: "#f4ddff",
  },
  {
    id: "next-date",
    title: "Choose Our Next Date",
    shortLabel: "Next Date",
    description: "You get to decide our next little outing together.",
    resultMessage: "The next cute plan is officially in your hands.",
    emoji: "🌙",
    color: "#dff7ea",
  },
];