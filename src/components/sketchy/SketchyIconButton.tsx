import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { HandDrawnRect } from "./HandDrawnRect";

type SketchyIconButtonProps = {
  type?: ButtonHTMLAttributes<HTMLButtonElement>["type"];
  "aria-label": string;
  children: ReactNode;
  className?: string;
};

export const SketchyIconButton = ({
  type = "submit",
  "aria-label": ariaLabel,
  children,
  className,
}: SketchyIconButtonProps) => (
  <button
    type={type}
    className={cn("relative shrink-0 w-10 h-9 flex items-center justify-center", className)}
    aria-label={ariaLabel}
  >
    <HandDrawnRect fill="var(--uxsg-ink)" stroke="var(--uxsg-ink)" strokeWidth={1.5} />
    {children}
  </button>
);
