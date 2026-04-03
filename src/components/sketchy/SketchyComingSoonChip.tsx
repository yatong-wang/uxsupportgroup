import { cn } from "@/lib/utils";
import { SketchyBadge } from "./SketchyBadge";

type SketchyComingSoonChipProps = {
  className?: string;
};

/** Compact hand-drawn “Coming Soon” pill for placeholder nav links. Visual only; pair with `sr-only` for AT. */
export function SketchyComingSoonChip({ className }: SketchyComingSoonChipProps) {
  return (
    <SketchyBadge
      rotation="subtle"
      aria-hidden
      className={cn(
        "shrink-0 whitespace-nowrap px-2 py-0.5",
        "origin-left scale-[0.78] md:scale-[0.82]",
        className
      )}
    >
      Coming Soon
    </SketchyBadge>
  );
}
