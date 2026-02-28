export type AppView =
  | "lock-screen"
  | "dashboard"
  | "love-wheel"
  | "love-scratch"
  | "love-map";

export type PersistedSession = {
  isUnlocked: boolean;
  activeView: AppView;
  visitedViews: AppView[];
};