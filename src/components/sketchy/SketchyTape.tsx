import { cn } from "@/lib/utils";

export type SketchyTapePosition = "topLeft" | "topRight" | "bottomLeft" | "bottomRight";

type SketchyTapeProps = {
  position: SketchyTapePosition;
  size?: "lg" | "sm";
  className?: string;
};

const positionClassesLg: Record<SketchyTapePosition, string> = {
  topLeft: "absolute -top-2 left-6 w-14 h-5 -rotate-6 z-20",
  topRight: "absolute -top-2 right-6 w-14 h-5 rotate-6 z-20",
  bottomLeft: "absolute -bottom-2 left-6 w-14 h-5 -rotate-6 z-20",
  bottomRight: "absolute -bottom-2 right-6 w-14 h-5 rotate-6 z-20",
};

const positionClassesSm: Record<SketchyTapePosition, string> = {
  topLeft: "absolute -top-1 left-4 w-12 h-4 -rotate-6 z-20",
  topRight: "absolute -top-1 right-4 w-12 h-4 rotate-6 z-20",
  bottomLeft: "absolute -bottom-1 left-4 w-12 h-4 -rotate-6 z-20",
  bottomRight: "absolute -bottom-1 right-4 w-12 h-4 rotate-6 z-20",
};

export const SketchyTape = ({ position, size = "lg", className }: SketchyTapeProps) => {
  const base = size === "sm" ? positionClassesSm[position] : positionClassesLg[position];
  return (
    <div
      className={cn(base, "bg-[color:var(--uxsg-tape)]", className)}
      style={{ filter: "url(#roughen)" }}
      aria-hidden
    />
  );
};
