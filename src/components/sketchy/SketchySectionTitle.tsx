import { cn } from "@/lib/utils";
import { RoughWavyUnderline } from "./RoughWavyUnderline";
import { TickedLine } from "./TickedLine";

type SketchySectionTitleProps = {
  children: React.ReactNode;
  underlineStrokeW?: number;
  className?: string;
  /** Override h2 classes (e.g. `whitespace-normal max-w-3xl` for long titles). */
  titleClassName?: string;
  /** Small ink badge above the heading (status labels, etc.). */
  badge?: React.ReactNode;
};

export const SketchySectionTitle = ({
  children,
  underlineStrokeW = 2.5,
  className,
  titleClassName,
  badge,
}: SketchySectionTitleProps) => (
  <div className={cn("flex flex-col items-center mb-8", className)}>
    <div className="flex items-center justify-center gap-4 md:gap-6 w-full max-w-3xl mx-auto">
      <TickedLine className="flex-1 h-3 min-w-[60px] max-w-[140px]" />
      <div className="flex flex-col items-center min-w-0 max-w-full">
        {badge ? (
          <div className="mb-2 flex w-full justify-center">{badge}</div>
        ) : null}
        <h2
          className={cn(
            "text-4xl md:text-5xl font-black text-uxsg-ink text-center whitespace-nowrap font-headline",
            titleClassName,
          )}
        >
          {children}
        </h2>
        <span className="block mt-1 text-uxsg-ink w-full">
          <RoughWavyUnderline className="w-full h-3" strokeW={underlineStrokeW} />
        </span>
      </div>
      <TickedLine className="flex-1 h-3 min-w-[60px] max-w-[140px]" />
    </div>
  </div>
);
