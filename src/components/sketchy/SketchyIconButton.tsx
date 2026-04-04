import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { HandDrawnRect } from "./HandDrawnRect";

const ICON_LAYER =
  "absolute inset-0 pointer-events-none transition-opacity duration-200 [&>svg]:absolute [&>svg]:inset-0 [&>svg]:h-full [&>svg]:w-full";

type SketchyIconButtonProps = {
  type?: ButtonHTMLAttributes<HTMLButtonElement>["type"];
  "aria-label": string;
  children: ReactNode;
  className?: string;
  disabled?: boolean;
};

export const SketchyIconButton = ({
  type = "submit",
  "aria-label": ariaLabel,
  children,
  className,
  disabled,
}: SketchyIconButtonProps) => (
  <button
    type={type}
    disabled={disabled}
    className={cn(
      "group relative shrink-0 w-10 h-9 flex items-center justify-center transition-transform duration-200 hover:scale-[1.1] active:scale-[0.98] origin-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-uxsg-ink/40 focus-visible:ring-offset-2 rounded-sm disabled:pointer-events-none disabled:opacity-50 disabled:hover:scale-100",
      className
    )}
    aria-label={ariaLabel}
  >
    <span className={cn(ICON_LAYER, "opacity-100 group-hover:opacity-0")}>
      <HandDrawnRect fill="var(--uxsg-ink)" stroke="var(--uxsg-ink)" strokeWidth={1.5} />
    </span>
    <span className={cn(ICON_LAYER, "opacity-0 group-hover:opacity-100")}>
      <HandDrawnRect fill="white" stroke="#090907" strokeWidth={1.5} />
    </span>
    <span className="relative z-10 inline-flex items-center justify-center text-white transition-colors duration-200 group-hover:text-uxsg-ink">
      {children}
    </span>
  </button>
);
