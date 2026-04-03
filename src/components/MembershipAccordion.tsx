import type { ComponentProps } from "react";
import { AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

export const membershipFAQItemClassName =
  "border-b-0 bg-background border border-border rounded-xl overflow-hidden hover:border-primary/50 transition-colors";

export const membershipFAQTriggerClassName = "px-6 py-4 hover:no-underline text-left";

export function MembershipAccordionItem({
  className,
  ...props
}: ComponentProps<typeof AccordionItem>) {
  return <AccordionItem className={cn(membershipFAQItemClassName, className)} {...props} />;
}

export function MembershipAccordionTrigger({
  className,
  ...props
}: ComponentProps<typeof AccordionTrigger>) {
  return <AccordionTrigger className={cn(membershipFAQTriggerClassName, className)} {...props} />;
}
