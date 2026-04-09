/** Routes that currently render only a “Coming Soon” placeholder — keep in sync with those page components. */
export const PLACEHOLDER_PAGE_PATHS = ["/media-kit", "/partner"] as const;

export type PlaceholderPagePath = (typeof PLACEHOLDER_PAGE_PATHS)[number];

export function isPlaceholderPagePath(path: string): path is PlaceholderPagePath {
  return (PLACEHOLDER_PAGE_PATHS as readonly string[]).includes(path);
}

/** Shown as native title and in tooltips for placeholder nav items. */
export const PLACEHOLDER_PAGE_HINT = "Cooking up this page…";

/** Announced by screen readers next to the link name (visible chip is `aria-hidden`). */
export const PLACEHOLDER_PAGE_SR_ONLY = "Coming soon";
