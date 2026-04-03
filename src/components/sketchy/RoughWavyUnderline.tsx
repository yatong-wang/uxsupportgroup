import { useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import { cn } from "@/lib/utils";

/** Shared with static and animated variants — do not change without remeasuring animation. */
const ROUGH_WAVY_PATH_D =
  "M2 10 C10 4, 20 4, 30 10 C40 16, 50 16, 60 10 C70 4, 80 4, 90 10 C100 16, 110 16, 120 10 C130 4, 140 4, 150 10 C160 16, 170 16, 180 10 C185 7, 190 6, 198 8";

type RoughWavyUnderlineProps = {
  className?: string;
  strokeW?: number;
  /** Stretch path to fill width/height (e.g. hero underline under variable-width text). */
  expandToBounds?: boolean;
  /**
   * Looping stroke-dash “redraw” — two paths with offset phases. Respects `prefers-reduced-motion`.
   */
  animated?: boolean;
};

export const RoughWavyUnderline = ({
  className = "",
  strokeW = 3,
  expandToBounds = false,
  animated = false,
}: RoughWavyUnderlineProps) => {
  const measureRef = useRef<SVGPathElement | null>(null);
  const [pathLen, setPathLen] = useState(0);

  useLayoutEffect(() => {
    if (!animated) return;
    const el = measureRef.current;
    if (!el) return;
    setPathLen(el.getTotalLength());
  }, [animated]);

  if (!animated) {
    return (
      <svg
        className={className}
        viewBox="0 0 200 16"
        fill="none"
        preserveAspectRatio={expandToBounds ? "none" : undefined}
        aria-hidden="true"
      >
        <path
          d={ROUGH_WAVY_PATH_D}
          stroke="currentColor"
          strokeWidth={strokeW}
          fill="none"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  const ready = pathLen > 0;
  /** User units (matches SVG viewBox); used by tailwind keyframes for stroke-dashoffset. */
  const lenStyle = {
    "--rough-len": String(pathLen),
  } as CSSProperties;

  return (
    <svg
      className={className}
      viewBox="0 0 200 16"
      fill="none"
      preserveAspectRatio={expandToBounds ? "none" : undefined}
      aria-hidden="true"
    >
      {/* Geometry-only path for getTotalLength (same d as visible strokes). */}
      <path
        ref={measureRef}
        d={ROUGH_WAVY_PATH_D}
        fill="none"
        stroke="none"
        strokeWidth={strokeW}
      />
      <path
        d={ROUGH_WAVY_PATH_D}
        stroke="currentColor"
        strokeWidth={strokeW}
        fill="none"
        strokeLinecap="round"
        style={{
          ...lenStyle,
          strokeDasharray: ready ? pathLen : undefined,
          strokeDashoffset: ready ? pathLen : undefined,
        }}
        className={cn(
          "motion-reduce:opacity-100",
          ready && "opacity-100 motion-safe:animate-rough-underline-a",
          !ready && "opacity-0",
          "motion-reduce:[stroke-dasharray:unset] motion-reduce:[stroke-dashoffset:0] motion-reduce:animate-none"
        )}
      />
      <path
        d={ROUGH_WAVY_PATH_D}
        stroke="currentColor"
        strokeWidth={Math.max(1, strokeW * 0.85)}
        fill="none"
        strokeLinecap="round"
        style={{
          ...lenStyle,
          strokeDasharray: ready ? pathLen : undefined,
          strokeDashoffset: ready ? pathLen : undefined,
        }}
        className={cn(
          "motion-reduce:opacity-100",
          ready && "opacity-40 motion-safe:animate-rough-underline-b",
          !ready && "opacity-0",
          "motion-reduce:[stroke-dasharray:unset] motion-reduce:[stroke-dashoffset:0] motion-reduce:animate-none"
        )}
      />
    </svg>
  );
};
