import { cn } from "@/lib/utils";
import { HandDrawnRectTall } from "./HandDrawnRectTall";
import { SketchyTape, type SketchyTapePosition } from "./SketchyTape";

export type SketchyTallCardTape = { position: SketchyTapePosition; size?: "lg" | "sm" };

type SketchyTallCardProps = {
  variant: "light" | "dark";
  /** When set, overrides variant fill (e.g. `#ffe24a`, `hsl(var(--card))`). */
  fill?: string;
  tapes: SketchyTallCardTape[];
  children: React.ReactNode;
  className?: string;
  innerClassName?: string;
  strokeWidth?: number;
  paddingClassName?: string;
};

export const SketchyTallCard = ({
  variant,
  fill: fillOverride,
  tapes,
  children,
  className,
  innerClassName,
  strokeWidth = 2,
  paddingClassName = "p-6 md:p-8",
}: SketchyTallCardProps) => {
  const fill = fillOverride ?? (variant === "light" ? "white" : "#090907");
  return (
    <div className={cn("relative", paddingClassName, className)}>
      <HandDrawnRectTall fill={fill} stroke="#090907" strokeWidth={strokeWidth} />
      {tapes.map((tape, i) => (
        <SketchyTape key={`${tape.position}-${i}`} position={tape.position} size={tape.size ?? "lg"} />
      ))}
      <div className={cn("relative z-10", innerClassName)}>{children}</div>
    </div>
  );
};
