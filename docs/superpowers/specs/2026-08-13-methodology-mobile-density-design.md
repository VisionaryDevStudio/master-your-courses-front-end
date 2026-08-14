# Methodology Mobile Density Design

## Scope

Refine only the mobile presentation of the “Why Our Students Succeed” methodology cards below `768px`. Preserve the approved tablet and desktop layouts, card styling, content, motion system, dark mode, and surrounding section rhythm.

## Selected Direction: Compact Vertical List

Keep all six cards in a single vertical sequence because this is the clearest and most accessible mobile reading pattern. Reduce the section’s length by changing card composition and spacing rather than hiding content or introducing horizontal navigation.

Alternatives considered:

1. Horizontal carousel: shorter on the page, but hides most of the methodology and makes comparison and discovery harder.
2. Accordion cards: compact, but adds six interactions to read content that is concise enough to remain visible.
3. Compact vertical list (selected): preserves visibility and natural scrolling while materially reducing height.

## Mobile Card Composition

- Apply changes only through a `max-width: 767px` media query.
- Keep the existing one-column sequence and the current order of all six cards.
- Place each icon beside its heading in a compact horizontal header row.
- Keep each description fully visible below the header; do not truncate, clamp, collapse, or hide text.
- Reduce card-body padding from the current mobile value to approximately `1.25rem`.
- Reduce the icon to approximately `2.75rem` square while preserving its recognizable shape, background, and color.
- Reduce gaps so typical cards land near `170–190px` tall without imposing a fixed height that could clip translations or accessibility text scaling.
- Preserve the thin accent rule, border, radius, and premium surface treatment.

## Group Hierarchy

- Stop repeating `Core Method` and `Ongoing Support` inside every mobile card.
- Add one visible `Core Method` group label before cards 1–3 and one visible `Ongoing Support` group label before cards 4–6 on mobile.
- Preserve the existing per-card tier labels at `768px` and above so tablet and desktop remain visually unchanged.
- The mobile group labels should be understated uppercase text with restrained letter spacing and sufficient contrast; they are navigational hierarchy, not decorative pills.
- Group labels must not introduce large new vertical gaps.

## Motion

- Preserve the existing methodology reveal controller, one-time entrance behavior, fail-open initialization, and reduced-motion safeguards.
- Continue revealing cards independently as they approach the mobile viewport.
- Group labels may remain static; they should not add another animation layer.
- Keep mobile cards free of hover-only movement.

## Responsive Isolation

- At `390px`, cards use the compact header-row composition and mobile group labels.
- At `768px` and `1440px`, computed card layout, icon dimensions, padding, tier-label visibility, grid columns, hover behavior, and motion delays must remain at the approved baseline.
- Do not change shared typography or global spacing utilities.

## Accessibility

- Use semantic group headings or descriptive text associated with the relevant card group; do not rely on color alone.
- Preserve heading order and readable source order.
- Content must remain visible with JavaScript disabled and under `prefers-reduced-motion: reduce`.
- Avoid fixed card heights so browser text enlargement and translated content can expand safely.

## Implementation Boundaries

- Limit production changes to the methodology markup and scoped mobile CSS in `index.html`.
- Add focused regression coverage in `tests/light-mode-section-surfaces.test.mjs` before production changes.
- Do not modify the existing methodology IntersectionObserver unless a verified compatibility problem is found.
- Preserve unrelated user files and existing uncommitted mentor assets.

## Verification

- Record a test-first RED/GREEN cycle for mobile composition, group-label visibility, and breakpoint isolation.
- Run the complete Node test suite and `git diff --check`.
- Verify the live page returns HTTP 200.
- Inspect 390×844 in light, dark, and reduced-motion modes.
- Compare 768×1024 and 1440×900 against the current approved baseline to confirm no layout or motion changes.
- Verify no horizontal overflow, clipped text, blank reveal gaps, or animation replay.

