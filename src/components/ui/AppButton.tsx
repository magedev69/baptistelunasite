import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/utils/cn";

type AppButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
};

export function AppButton({
  children,
  className,
  variant = "primary",
  ...props
}: AppButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex min-h-11 items-center justify-center rounded-full px-5 py-3 text-sm font-medium transition-transform duration-200 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50",
        variant === "primary" &&
          "bg-app-primary text-white shadow-app-card hover:bg-app-primary-strong",
        variant === "secondary" &&
          "border border-app-border bg-white/80 text-app-text shadow-sm hover:bg-white",
        variant === "ghost" &&
          "bg-transparent text-app-text-soft hover:bg-white/60",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}