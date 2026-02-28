import { ViewCard } from "@/components/layout/ViewCard";
import { LoveWheelGame } from "@/components/love-wheel/LoveWheelGame";
import { loveWheelCopy } from "@/data/loveWheel";

export function LoveWheelView() {
  return (
    <ViewCard
      eyebrow={loveWheelCopy.eyebrow}
      title={loveWheelCopy.title}
      description={loveWheelCopy.description}
    >
      <LoveWheelGame />
    </ViewCard>
  );
}