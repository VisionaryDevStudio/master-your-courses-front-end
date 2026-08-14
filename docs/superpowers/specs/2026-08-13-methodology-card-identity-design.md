# Methodology Card Identity Design

## Scope

Correct the methodology card visual system across mobile, tablet, and desktop without reverting the approved premium surfaces, reliable reveal controller, compact mobile composition, responsive grid, or reduced-motion safeguards.

## Selected Direction: Premium Individual Identity

Restore the six cards’ distinct visual identities through restrained accent and icon colors. Remove the repeated `Core Method` and `Ongoing Support` labels from inside every card, while retaining the two mobile group labels that organize the compact list.

This is a hybrid correction rather than a full rollback:

- The original rainbow cards had stronger individuality but oversized saturated bars and excessive hover motion.
- The current unified indigo cards are more polished but visually repetitive and overly corporate.
- The selected direction uses individual, muted accents within the current premium card architecture.

## Card Styling

- Preserve the current white/translucent card surface, subtle border, radius, controlled shadow, and equal grid geometry.
- Give each card a distinct 3px accent rule:
  1. Elite Tutors: blue
  2. Personalized Plans: indigo
  3. Weekly Assessments: restrained rose/red
  4. Comprehensive Resources: emerald
  5. Supportive Community: restrained pink/fuchsia
  6. Clear Progress Tracking: violet
- Accent colors should be clear but less saturated than the original `*-500` utility bars.
- Match each icon container to its card’s accent family with a pale background and readable foreground.
- Provide corresponding dark-mode icon and accent values with sufficient contrast.
- Do not change card dimensions, grid columns, or section background.

## Content Hierarchy

- Remove all six repeated `.methodology-tier` elements from card markup at every breakpoint.
- On tablet and desktop, the visual sequence becomes icon → heading → description.
- Preserve comfortable spacing by adding a scoped gap between icon and heading rather than leaving tier-sized whitespace.
- Keep the existing shortened heading `Clear Progress Tracking`.
- Preserve all six descriptions verbatim.

## Mobile Preservation

- Keep the two visible mobile group labels: `Core Method` before cards 1–3 and `Ongoing Support` before cards 4–6.
- Preserve the compact icon-and-heading row, `1.25rem` padding, full descriptions, card order, and mobile reveal behavior.
- The new per-card colors should remain visible on mobile through the accent rule and icon treatment without adding extra labels or height.

## Motion Preservation

- Preserve the dedicated methodology IntersectionObserver and deterministic breakpoint delays unchanged.
- Preserve the 20px/500ms one-time entrance, fail-open initialization, fine-pointer-only 2px hover, icon scale near `1.035`, and reduced-motion reset.
- Do not restore the original 60px scale entrance, 8px bars, 4px lift, or 1.10 icon scaling.

## Accessibility

- Continue using color only as secondary visual identity; card headings and descriptions remain the primary information.
- Preserve semantic `article` elements, heading order, DOM order, and visible mobile group labels.
- Ensure cards remain fully visible without JavaScript and under reduced motion.

## Implementation Boundaries

- Limit production changes to methodology CSS and card markup in `index.html`.
- Add focused regression coverage in `tests/light-mode-section-surfaces.test.mjs` before production edits.
- Do not modify unrelated sections, global utilities, advisor behavior, university ribbon behavior, mentor assets, or dependencies.

## Verification

- Record RED/GREEN evidence for six distinct accents, six matching icon variants, removal of repeated tier markup, and mobile-group preservation.
- Run the complete Node test suite and `git diff --check`.
- Verify the live page returns HTTP 200.
- Inspect 390×844, 768×1024, and 1440×900 in light and dark modes.
- Confirm compact mobile geometry, tablet/desktop grid geometry, all motion measurements, reduced motion, no overflow, and no clipped content remain unchanged.

