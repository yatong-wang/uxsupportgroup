
Here’s what was implemented:

### Sketch primitives (`src/components/sketchy/`)
- **`RoughWavyUnderline.tsx`**, **`TickedLine.tsx`**, **`HandDrawnRectTall.tsx`**, **`HandDrawnPill.tsx`** — shared SVGs; `TickedLine` uses `text-uxsg-ink` for strokes.
- **`HandDrawnRect.tsx`** — unchanged; used from pages/components instead of duplicating.

### Sketch composites
- **`SketchySectionTitle.tsx`** — tick lines + `font-headline` H2 + wavy underline (`mb-8` wrapper).
- **`SketchyCTA.tsx`** — `variant="light-bg" | "dark-bg"` (replaces outline/filled).
- **`SketchyTape.tsx`** — `position` + `size` (`lg` / `sm`), tape fill via `bg-[color:var(--uxsg-tape)]`, `#roughen` filter.
- **`SketchyTallCard.tsx`** — tall hand-drawn frame + tapes; optional `strokeWidth`, `paddingClassName`, `innerClassName`.
- **`SketchyIconListItem.tsx`** — `li` + icon + `tone="light" | "dark"`.
- **`SketchyHandDrawnInput.tsx`** — `Input` + `HandDrawnRect` (forwardRef for `react-hook-form`).
- **`SketchyIconButton.tsx`** — ink-filled rect + icon slot.

### Refactors
- **`IndexV7.tsx`** — imports the above; “Two Ways” uses `SketchyTallCard` + `SketchyIconListItem`; hero CTAs use `light-bg` / `dark-bg`.
- **`UpcomingEvents.tsx`** — `SketchySectionTitle`, `SketchyTallCard` for sketchy event cards (tapes `sm`, `strokeWidth={1.5}`, `p-5`).
- **`SketchyFooter.tsx`** — `SketchyHandDrawnInput` + `SketchyIconButton` (no `Input` import).

### Membership
- **`MembershipSectionTitle.tsx`** — `text-4xl md:text-5xl font-bold mb-6`.
- **`MembershipChecklistRow.tsx`** — default `Check` icon + `text-lg` row.
- **`MembershipAccordion.tsx`** — `MembershipAccordionItem`, `MembershipAccordionTrigger`, shared class strings.
- **`MembershipHero.tsx`**, **`MembershipPricing.tsx`**, **`MembershipFAQ.tsx`** — wired to these components.

`npm run build` and ESLint on the touched paths both succeed. The `#roughen` filter remains in [`SketchyLayout.tsx`](src/components/sketchy/SketchyLayout.tsx) for tape rendering.