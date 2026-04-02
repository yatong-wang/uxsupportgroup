import { HandDrawnRect } from "./HandDrawnRect";

export type SketchyCTAVariant = "light-bg" | "dark-bg";

type SketchyCTAProps = {
  href: string;
  children: React.ReactNode;
  variant?: SketchyCTAVariant;
};

export const SketchyCTA = ({ href, children, variant = "light-bg" }: SketchyCTAProps) => {
  const isDark = variant === "dark-bg";
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="relative inline-flex items-center justify-center px-8 py-3 text-base font-body"
    >
      <HandDrawnRect fill={isDark ? "#090907" : "white"} stroke="#090907" strokeWidth={2} />
      <span className={`relative z-10 ${isDark ? "text-white" : "text-uxsg-ink"}`}>{children}</span>
    </a>
  );
};
