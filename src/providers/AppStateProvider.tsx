"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from "react";
import type { AppView, PersistedSession } from "@/types/app";

type AppState = {
  hasHydrated: boolean;
  isUnlocked: boolean;
  activeView: AppView;
  viewHistory: AppView[];
  visitedViews: AppView[];
  animationsEnabled: boolean;
};

type AppAction =
  | {
      type: "HYDRATE";
      payload?: PersistedSession;
    }
  | {
      type: "UNLOCK";
    }
  | {
      type: "LOCK";
    }
  | {
      type: "NAVIGATE";
      view: AppView;
      replace?: boolean;
    }
  | {
      type: "GO_BACK";
    }
  | {
      type: "SET_ANIMATIONS_ENABLED";
      value: boolean;
    }
  | {
      type: "RESET_SESSION";
    };

type AppStateContextValue = AppState & {
  canGoBack: boolean;
  unlockApp: () => void;
  lockApp: () => void;
  navigate: (view: AppView, options?: { replace?: boolean }) => void;
  goBack: () => void;
  resetSession: () => void;
  setAnimationsEnabled: (value: boolean) => void;
};

const STORAGE_KEY = "baptisteluna-v1-session";

const initialState: AppState = {
  hasHydrated: false,
  isUnlocked: false,
  activeView: "lock-screen",
  viewHistory: [],
  visitedViews: ["lock-screen"],
  animationsEnabled: true,
};

const AppStateContext = createContext<AppStateContextValue | null>(null);

function isAppView(value: unknown): value is AppView {
  return (
    value === "lock-screen" ||
    value === "dashboard" ||
    value === "love-wheel" ||
    value === "love-scratch" ||
    value === "love-map"
  );
}

function uniqueViews(views: AppView[]) {
  return Array.from(new Set(views));
}

function reducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case "HYDRATE": {
      const payload = action.payload;

      if (!payload) {
        return {
          ...state,
          hasHydrated: true,
        };
      }

      const isUnlocked = Boolean(payload.isUnlocked);
      const activeView =
        isUnlocked && isAppView(payload.activeView) && payload.activeView !== "lock-screen"
          ? payload.activeView
          : isUnlocked
          ? "dashboard"
          : "lock-screen";

      const visitedViews = uniqueViews([
        "lock-screen",
        ...(Array.isArray(payload.visitedViews)
          ? payload.visitedViews.filter(isAppView)
          : []),
        ...(isUnlocked ? ["dashboard"] : []),
        activeView,
      ]);

      return {
        ...state,
        hasHydrated: true,
        isUnlocked,
        activeView,
        viewHistory: [],
        visitedViews,
      };
    }

    case "UNLOCK": {
      return {
        ...state,
        isUnlocked: true,
        activeView: "dashboard",
        viewHistory: [],
        visitedViews: uniqueViews([...state.visitedViews, "dashboard"]),
      };
    }

    case "LOCK": {
      return {
        ...state,
        isUnlocked: false,
        activeView: "lock-screen",
        viewHistory: [],
        visitedViews: ["lock-screen"],
      };
    }

    case "NAVIGATE": {
      if (!state.isUnlocked && action.view !== "lock-screen") {
        return state;
      }

      if (state.activeView === action.view) {
        return state;
      }

      return {
        ...state,
        activeView: action.view,
        viewHistory: action.replace
          ? state.viewHistory
          : [...state.viewHistory, state.activeView],
        visitedViews: uniqueViews([...state.visitedViews, action.view]),
      };
    }

    case "GO_BACK": {
      if (state.viewHistory.length === 0) {
        return state;
      }

      const previousView = state.viewHistory[state.viewHistory.length - 1];
      const nextHistory = state.viewHistory.slice(0, -1);

      return {
        ...state,
        activeView: previousView,
        viewHistory: nextHistory,
        visitedViews: uniqueViews([...state.visitedViews, previousView]),
      };
    }

    case "SET_ANIMATIONS_ENABLED": {
      return {
        ...state,
        animationsEnabled: action.value,
      };
    }

    case "RESET_SESSION": {
      return {
        ...initialState,
        hasHydrated: true,
      };
    }

    default:
      return state;
  }
}

export function AppStateProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);

      if (!raw) {
        dispatch({ type: "HYDRATE" });
        return;
      }

      const parsed = JSON.parse(raw) as Partial<PersistedSession>;

      dispatch({
        type: "HYDRATE",
        payload: {
          isUnlocked: Boolean(parsed.isUnlocked),
          activeView:
            parsed.activeView && isAppView(parsed.activeView)
              ? parsed.activeView
              : "lock-screen",
          visitedViews: Array.isArray(parsed.visitedViews)
            ? parsed.visitedViews.filter(isAppView)
            : ["lock-screen"],
        },
      });
    } catch {
      dispatch({ type: "HYDRATE" });
    }
  }, []);

  useEffect(() => {
    if (!state.hasHydrated) return;

    const payload: PersistedSession = {
      isUnlocked: state.isUnlocked,
      activeView: state.activeView,
      visitedViews: state.visitedViews,
    };

    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  }, [state.hasHydrated, state.isUnlocked, state.activeView, state.visitedViews]);

  const value = useMemo<AppStateContextValue>(
    () => ({
      ...state,
      canGoBack: state.viewHistory.length > 0,
      unlockApp: () => dispatch({ type: "UNLOCK" }),
      lockApp: () => dispatch({ type: "LOCK" }),
      navigate: (view, options) =>
        dispatch({ type: "NAVIGATE", view, replace: options?.replace }),
      goBack: () => dispatch({ type: "GO_BACK" }),
      resetSession: () => dispatch({ type: "RESET_SESSION" }),
      setAnimationsEnabled: (value) =>
        dispatch({ type: "SET_ANIMATIONS_ENABLED", value }),
    }),
    [state]
  );

  return (
    <AppStateContext.Provider value={value}>
      {children}
    </AppStateContext.Provider>
  );
}

export function useAppState() {
  const context = useContext(AppStateContext);

  if (!context) {
    throw new Error("useAppState must be used within AppStateProvider");
  }

  return context;
}