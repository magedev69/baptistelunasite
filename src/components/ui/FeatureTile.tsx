import type { ReactNode } from "react";

type FeatureTileProps = {
  eyebrow: string;
  title: string;
  description: string;
  icon?: ReactNode;
  onClick?: () => void;
};

export function FeatureTile({
  eyebrow,
  title,
  description,
  icon,
  onClick,
}: FeatureTileProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="glass-card group w-full rounded-app-2xl p-5 text-left shadow-app-card transition-all duration-200 hover:-translate-y-0.5 hover:shadow-app-glow active:scale-[0.99]"
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <span className="rounded-full bg-white/80 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-app-text-soft">
          {eyebrow}
        </span>

        <span className="text-xl">{icon ?? "💗"}</span>
      </div>

      <h3 className="text-lg font-semibold tracking-tight text-app-text">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-app-text-soft">
        {description}
      </p>

      <div className="mt-4 text-sm font-medium text-app-primary">
        Բացել →
      </div>
    </button>
  );
}