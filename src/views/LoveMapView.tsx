import { ViewCard } from "@/components/layout/ViewCard";
import { LoveMapExperience } from "@/components/love-map/LoveMapExperience";
import { loveMapCopy } from "@/data/loveMap";

export function LoveMapView() {
  return (
    <ViewCard
      eyebrow={loveMapCopy.eyebrow}
      title={loveMapCopy.title}
      description={loveMapCopy.description}
    >
      <LoveMapExperience />
    </ViewCard>
  );
}