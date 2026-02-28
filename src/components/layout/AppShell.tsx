import { ReactNode } from "react";
import { FloatingHearts } from "@/components/ui/FloatingHearts";

type AppShellProps = {
  children: ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  return (
    <main className="relative min-h-dvh overflow-hidden bg-app-bg text-app-text">
      <FloatingHearts />

      <div className="pointer-events-none absolute -left-16 top-10 h-40 w-40 rounded-full bg-app-primary/15 blur-3xl" />
      <div className="pointer-events-none absolute right-[-20px] top-1/3 h-44 w-44 rounded-full bg-app-secondary/12 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-1/4 h-36 w-36 rounded-full bg-app-accent/20 blur-3xl" />

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,111,181,0.16),transparent_35%),radial-gradient(circle_at_20%_80%,rgba(255,209,102,0.18),transparent_28%),radial-gradient(circle_at_85%_75%,rgba(139,108,255,0.12),transparent_24%)]" />

      <div className="relative mx-auto flex min-h-dvh w-full max-w-[460px] flex-col px-4 pb-[calc(var(--safe-bottom)+1.25rem)] pt-safe-top sm:px-6 md:max-w-[640px]">
        {children}
      </div>
    </main>
  );
}