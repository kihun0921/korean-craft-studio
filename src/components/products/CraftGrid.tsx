import type { Craft } from "@/types";
import CraftCard from "./CraftCard";

interface CraftGridProps {
  crafts: Craft[];
  onInquire: (craft: Craft, trigger: HTMLButtonElement) => void;
}

export default function CraftGrid({ crafts, onInquire }: CraftGridProps) {
  return (
    <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {crafts.map((craft) => (
        <li key={craft.id}>
          <CraftCard craft={craft} onInquire={onInquire} />
        </li>
      ))}
    </ul>
  );
}
