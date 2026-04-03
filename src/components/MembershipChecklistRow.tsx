import type { ReactNode } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

type MembershipChecklistRowProps = {
  children: ReactNode;
  icon?: ReactNode;
  className?: string;
};

export const MembershipChecklistRow = ({
  children,
  icon = <Check className="w-6 h-6 text-primary flex-shrink-0 mt-1" />,
  className,
}: MembershipChecklistRowProps) => (
  <li className={cn("flex items-start gap-3 text-lg", className)}>
    {icon}
    <span>{children}</span>
  </li>
);
