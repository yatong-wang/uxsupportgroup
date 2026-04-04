import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { HandDrawnRect } from "./HandDrawnRect";

export type SketchyCTAVariant = "light-bg" | "dark-bg" | "light-on-dark";

const CTA_BASE =
  "group relative inline-flex items-center justify-center px-8 py-3 text-base font-body transition-transform duration-200 hover:scale-[1.04] active:scale-[0.98] origin-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-uxsg-ink/40 focus-visible:ring-offset-2 rounded-sm disabled:pointer-events-none disabled:opacity-50 disabled:hover:scale-100";

const LAYER =
  "absolute inset-0 pointer-events-none transition-opacity duration-200 [&>svg]:absolute [&>svg]:inset-0 [&>svg]:h-full [&>svg]:w-full";

type VariantLayers = {
  base: { fill: string; stroke: string };
  hover: { fill: string; stroke: string };
  text: string;
  textHover: string;
};

const variantLayers = (variant: SketchyCTAVariant): VariantLayers => {
  switch (variant) {
    case "dark-bg":
      return {
        base: { fill: "#090907", stroke: "#090907" },
        hover: { fill: "white", stroke: "#090907" },
        text: "text-white",
        textHover: "group-hover:text-uxsg-ink",
      };
    case "light-on-dark":
      return {
        base: { fill: "white", stroke: "white" },
        hover: { fill: "#090907", stroke: "#090907" },
        text: "text-uxsg-ink",
        textHover: "group-hover:text-white",
      };
    case "light-bg":
    default:
      return {
        base: { fill: "white", stroke: "#090907" },
        hover: { fill: "#090907", stroke: "#090907" },
        text: "text-uxsg-ink",
        textHover: "group-hover:text-white",
      };
  }
};

export type SketchyRectButtonProps = {
  variant?: SketchyCTAVariant;
  fullWidth?: boolean;
  className?: string;
  children: ReactNode;
  disabled?: boolean;
} & Pick<ButtonHTMLAttributes<HTMLButtonElement>, "type" | "onClick" | "aria-label">;

export const SketchyRectButton = ({
  variant = "light-bg",
  fullWidth,
  className,
  children,
  type = "button",
  onClick,
  disabled,
  "aria-label": ariaLabel,
}: SketchyRectButtonProps) => {
  const layers = variantLayers(variant);
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={cn(CTA_BASE, fullWidth && "w-full", className)}
    >
      <span className={cn(LAYER, "opacity-100 group-hover:opacity-0")}>
        <HandDrawnRect
          fill={layers.base.fill}
          stroke={layers.base.stroke}
          strokeWidth={2}
        />
      </span>
      <span className={cn(LAYER, "opacity-0 group-hover:opacity-100")}>
        <HandDrawnRect
          fill={layers.hover.fill}
          stroke={layers.hover.stroke}
          strokeWidth={2}
        />
      </span>
      <span
        className={cn(
          "relative z-10 transition-colors duration-200",
          layers.text,
          layers.textHover
        )}
      >
        {children}
      </span>
    </button>
  );
};

type SketchyCTAProps = {
  href: string;
  children: React.ReactNode;
  variant?: SketchyCTAVariant;
  fullWidth?: boolean;
  className?: string;
};

export const SketchyCTA = ({
  href,
  children,
  variant = "light-bg",
  fullWidth,
  className,
}: SketchyCTAProps) => (
  <SketchyRectButton
    type="button"
    variant={variant}
    fullWidth={fullWidth}
    className={className}
    onClick={() => window.open(href, "_blank", "noopener,noreferrer")}
  >
    {children}
  </SketchyRectButton>
);
