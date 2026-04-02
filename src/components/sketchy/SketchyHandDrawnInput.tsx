import * as React from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { HandDrawnRect } from "./HandDrawnRect";

export const SketchyHandDrawnInput = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<typeof Input>
>(({ className, ...props }, ref) => (
  <div className="relative w-full">
    <HandDrawnRect fill="white" strokeWidth={1.5} />
    <Input
      ref={ref}
      className={cn(
        "relative z-10 bg-transparent border-0 text-uxsg-ink placeholder:text-uxsg-ink/50 h-9 shadow-none focus-visible:ring-0",
        className,
      )}
      {...props}
    />
  </div>
));
SketchyHandDrawnInput.displayName = "SketchyHandDrawnInput";
