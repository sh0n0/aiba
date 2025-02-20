import { Star } from "lucide-react";

export function StarButton({ starred, onToggle }: { starred: boolean; onToggle: () => void }) {
  return (
    <button onClick={onToggle} type="button">
      <Star size={24} fill={starred ? "gold" : "none"} stroke={starred ? "gold" : "currentColor"} />
    </button>
  );
}
