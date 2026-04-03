import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type MembershipSectionTitleProps = {
  children: ReactNode;
  className?: string;
};

export const MembershipSectionTitle = ({ children, className }: MembershipSectionTitleProps) => (
  <h2 className={cn("text-4xl md:text-5xl font-bold mb-6", className)}>{children}</h2>
);
