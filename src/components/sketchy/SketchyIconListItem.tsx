import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type SketchyIconListItemProps = {
  icon: ReactNode;
  children: ReactNode;
  tone?: "light" | "dark";
  className?: string;
};

export const SketchyIconListItem = ({
  icon,
  children,
  tone = "light",
  className,
}: SketchyIconListItemProps) => (
  <li className={cn("flex gap-3", className)}>
    {icon}
    <span
      className={tone === "light" ? "text-uxsg-ink/85" : "text-white/90"}
    >
      {children}
    </span>
  </li>
);
