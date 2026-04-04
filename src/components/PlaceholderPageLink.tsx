import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import {
  isPlaceholderPagePath,
  PLACEHOLDER_PAGE_HINT,
  PLACEHOLDER_PAGE_SR_ONLY,
} from "@/navigation/placeholderPages";
import { SketchyComingSoonChip } from "@/components/sketchy/SketchyComingSoonChip";

type PlaceholderPageLinkProps = {
  to: string;
  className?: string;
  children: ReactNode;
  /** Passed through to real `<Link>` only (not used for placeholder/disabled items). */
  onClick?: () => void;
};

/**
 * Renders a normal router link, or a non-navigating disabled control with tooltip + title when `to` is a placeholder route.
 */
export function PlaceholderPageLink({ to, className, children, onClick }: PlaceholderPageLinkProps) {
  if (isPlaceholderPagePath(to)) {
    return (
      <Tooltip delayDuration={200}>
        <TooltipTrigger asChild>
          <span
            role="link"
            aria-disabled="true"
            tabIndex={0}
            title={PLACEHOLDER_PAGE_HINT}
            className={cn(
              "inline-flex max-w-full cursor-not-allowed items-center gap-1.5 opacity-60",
              "hover:!no-underline hover:!text-muted-foreground",
              className
            )}
          >
            {children}
            <SketchyComingSoonChip />
            <span className="sr-only">{PLACEHOLDER_PAGE_SR_ONLY}</span>
          </span>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-xs text-center">
          {PLACEHOLDER_PAGE_HINT}
        </TooltipContent>
      </Tooltip>
    );
  }
  return (
    <Link to={to} className={className} onClick={onClick}>
      {children}
    </Link>
  );
}
