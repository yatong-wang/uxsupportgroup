import { cn } from "@/lib/utils";
import type { ComponentPropsWithoutRef } from "react";
import { HandDrawnPill } from "./HandDrawnPill";

/** Tailwind rotation classes applied to the pill wrapper (formerly SketchyBadge-only tilts). */
export const SKETCHY_BADGE_ROTATION = {
  tilt: "rotate-6",
  subtle: "rotate-2",
  none: "",
} as const;

export type SketchyBadgeRotation = keyof typeof SKETCHY_BADGE_ROTATION;

export type SketchyBadgeProps = Omit<ComponentPropsWithoutRef<"span">, "children"> & {
  children: React.ReactNode;
  /** Preset: `ink` (default) dark pill; `white` white fill with ink stroke and text. Ignored if `fill` is set. */
  variant?: "ink" | "white";
  /** Passed to `HandDrawnPill` (defaults match ink-on-paper labels, or variant presets). */
  fill?: string;
  stroke?: string;
  /** Maps to `SKETCHY_BADGE_ROTATION` classes. */
  rotation?: SketchyBadgeRotation;
  /** Text layer over the pill; defaults to `text-uxsg-paper` on ink fill. */
  labelClassName?: string;
};

export const SketchyBadge = ({
  className,
  rotation = "tilt",
  variant = "ink",
  fill: fillProp,
  stroke: strokeProp,
  labelClassName,
  children,
  ...props
}: SketchyBadgeProps) => {
  const fill = fillProp ?? (variant === "white" ? "white" : "#090907");
  const stroke = strokeProp ?? "#090907";
  const resolvedLabel =
    labelClassName ?? (variant === "white" ? "text-uxsg-ink" : "text-uxsg-paper");

  return (
  <span
    className={cn("relative inline-block px-3 py-1", SKETCHY_BADGE_ROTATION[rotation], className)}
    {...props}
  >
    <HandDrawnPill fill={fill} stroke={stroke} />
    <span
      className={cn(
        "relative z-10 text-[10px] font-bold uppercase tracking-widest font-body",
        resolvedLabel,
      )}
    >
      {children}
    </span>
  </span>
  );
};
