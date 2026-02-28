import { ViewCard } from "@/components/layout/ViewCard";
import { LoveScratchGame } from "@/components/love-scratch/LoveScratchGame";
import { loveScratchCopy } from "@/data/loveScratch";

export function LoveScratchView() {
  return (
    <ViewCard
      eyebrow={loveScratchCopy.eyebrow}
      title={loveScratchCopy.title}
      description={loveScratchCopy.description}
    >
      <LoveScratchGame />
    </ViewCard>
  );
}