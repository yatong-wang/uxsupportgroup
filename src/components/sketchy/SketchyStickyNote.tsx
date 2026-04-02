import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const STICKY_NOTE_FONT = "'Patrick Hand', 'Architects Daughter', cursive";

const variantClassName = {
  blue: "bg-[#a8d4e6] text-uxsg-ink border-[#5a9aba]/40",
  yellow: "bg-uxsg-yellow text-uxsg-ink border-[#d4b820]/40",
} as const;

export type SketchyStickyNoteProps = {
  /** Absolute positioning, width overrides, etc. */
  className?: string;
  variant?: keyof typeof variantClassName;
  /** Tailwind rotate utility, e.g. `-rotate-3`, `rotate-2` */
  rotateClassName: string;
  title: ReactNode;
  children: ReactNode;
};

export function SketchyStickyNote({
  className,
  variant = "blue",
  rotateClassName,
  title,
  children,
}: SketchyStickyNoteProps) {
  return (
    <div
      className={cn(
        "absolute w-40 md:w-48 p-3 shadow-lg transform z-[5] border",
        variantClassName[variant],
        rotateClassName,
        className,
      )}
      style={{ borderRadius: "2px", fontFamily: STICKY_NOTE_FONT }}
    >
      <div className="font-bold text-xs">{title}</div>
      <p className="text-[11px] mt-1 text-uxsg-ink/90 leading-tight">{children}</p>
    </div>
  );
}
