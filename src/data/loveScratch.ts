export type LoveScratchReward = {
  id: string;
  emoji: string;
  badge: string;
  title: string;
  description: string;
  revealMessage: string;
};

export const loveScratchCopy = {
  eyebrow: "feature 02",
  title: "Любовный скретч",
  description:
    "Сотри билет и узнай, какой маленький романтический сюрприз спрятан внутри. 💞",
  progress: "revealed",
  readyBadge: "scratch ticket",
  hiddenStateTitle: "A tiny surprise is waiting underneath",
  hiddenStateText:
    "Scratch the shiny layer to uncover a sweet reward made for you.",
  resultBadge: "revealed reward",
  scratchAgain: "Scratch again",
  backToDashboard: "Back to dashboard",
  revealHint: "Keep scratching to unlock the full card",
};

export const LOVE_SCRATCH_REWARDS: LoveScratchReward[] = [
  {
    id: "heart",
    emoji: "💖",
    badge: "sweet reward",
    title: "You win my heart",
    description:
      "Official confirmation that my heart is still, once again, entirely yours.",
    revealMessage: "There was never really any doubt, but now it is official.",
  },
  {
    id: "kiss",
    emoji: "💋",
    badge: "kiss voucher",
    title: "Voucher for one kiss",
    description:
      "This ticket can be redeemed for one very soft kiss at any time.",
    revealMessage: "A kiss has been reserved in your name.",
  },
  {
    id: "call-me",
    emoji: "📞",
    badge: "cute mission",
    title: "Call me now",
    description:
      "This card gives you the right to ask for a call right now, no questions asked.",
    revealMessage: "Your mission is simple: call me and collect your reward.",
  },
  {
    id: "memory",
    emoji: "📸",
    badge: "little memory",
    title: "A memory of us",
    description:
      "This ticket unlocks one little memory, one tiny scene, one soft moment from us.",
    revealMessage: "A piece of our story just slipped through the glitter.",
  },
  {
    id: "compliment",
    emoji: "🌸",
    badge: "pretty reminder",
    title: "You are absurdly pretty",
    description:
      "Some truths deserve their own ticket, and this is one of them.",
    revealMessage: "This card would like to remind you how beautiful you are.",
  },
  {
    id: "cuddle",
    emoji: "🧸",
    badge: "comfort prize",
    title: "Unlimited cuddle energy",
    description:
      "This reward unlocks the right to maximum softness and affection.",
    revealMessage: "Warmth level: officially activated.",
  },
  {
    id: "hidden-message",
    emoji: "💌",
    badge: "secret note",
    title: "A hidden message",
    description:
      "A tiny secret little message has chosen to reveal itself to you.",
    revealMessage: "A love note was hiding under the glitter just for you.",
  },
  {
    id: "next-date",
    emoji: "🌙",
    badge: "date privilege",
    title: "You choose our next date",
    description:
      "This card gives you full control over the next cute plan we make together.",
    revealMessage: "The next little adventure is officially in your hands.",
  },
];