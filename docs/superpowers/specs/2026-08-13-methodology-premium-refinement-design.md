# Methodology Premium Refinement Design

## Scope

Refine only the “Why Our Students Succeed” methodology section in `index.html`. Preserve its six-card grid, existing claims, responsive breakpoints, light/dark theme support, and surrounding section rhythm. Do not add decorative squares, new imagery, or unrelated page changes.

## Selected Direction: Academic Precision

The section should feel like a coherent academic system rather than six unrelated feature tiles. Keep all six cards, but distinguish the first row as the core learning method and the second row as the support system through restrained labels and accent treatment—not different card sizes or a layout rebuild.

Alternatives considered:

1. Keep the six-color rainbow treatment and only repair motion. Lowest risk, but it retains the generic template appearance.
2. Replace the grid with an editorial timeline or asymmetric feature layout. More distinctive, but unnecessarily disruptive and harder to scan on mobile.
3. Academic Precision (selected). Preserve the successful grid while upgrading hierarchy, palette, surfaces, and behavior.

## Visual Design

- Use one premium indigo/blue family as the dominant academic color system.
- Replace the six saturated 8px top bars with restrained 3–4px accent rules.
- Keep limited semantic variation inside the icon treatments, but reduce saturation so the cards read as one branded family.
- Give cards a subtle cool border, controlled shadow, and quiet surface contrast in light mode. Preserve appropriate dark-mode equivalents.
- Maintain equal card geometry across each row. The first row represents the core method; the second represents ongoing support.
- Add concise eyebrow labels inside the cards to communicate that hierarchy without adding decorative clutter.
- Shorten “Clear Progress Tracking Dashboard” to “Clear Progress Tracking” to balance the final card while preserving its meaning.
- Preserve the section’s existing atmospheric indigo background and generous spacing.

## Motion Design

- Replace the generic `scroll-reveal` behavior on these cards with a section-specific methodology reveal.
- Cards enter once with opacity and a restrained 18–24px vertical translation. Do not scale cards during entrance.
- Use an approximately 500ms ease-out transition.
- Desktop/tablet: reveal cards in deterministic visual order with a subtle 60–80ms stagger. The delay must be based on explicit card order, not observer callback batching.
- Mobile: reveal each card as it approaches the viewport with no noticeable queue; delays should remain at or below 40ms.
- Cards must never remain invisible after they have entered the viewport, and the section must not display large blank gaps during ordinary scrolling.
- Remove permanent `will-change` usage after the entrance settles.

## Hover and Interaction

- The cards remain informational and non-clickable.
- On fine-pointer, hover-capable devices only, allow at most a 2px card lift with a restrained border/shadow change.
- Limit icon movement to a subtle scale near 1.03–1.04 with no independent vertical jump.
- Do not apply hover transforms on touch/coarse-pointer devices.
- Avoid motion that suggests the cards are buttons or links.

## Reduced Motion and Accessibility

- Under `prefers-reduced-motion: reduce`, render every card immediately with no translation, scaling, stagger, or hover transform.
- Content must remain visible if JavaScript is unavailable or initialization fails. Motion enhancement must not be required to access the cards.
- Preserve text contrast, semantic heading order, and decorative SVG behavior.

## Responsive Behavior

- Preserve the existing 3-column desktop, 2-column tablet, and 1-column mobile grid.
- Keep desktop row heights visually balanced.
- On mobile, reduce excess internal height where possible while preserving comfortable reading and touch-page rhythm.
- The longer final description may wrap naturally, but its shortened heading should no longer create an avoidable extra title line at common widths.

## Implementation Boundaries

- Production changes are limited to the methodology section’s markup, scoped CSS, and its reveal-controller integration in `index.html`.
- Add focused regression coverage to `tests/light-mode-section-surfaces.test.mjs` before implementation.
- Do not alter the shared reveal behavior for unrelated sections unless a narrowly scoped compatibility adjustment is required and tested.

## Verification

- Test-first static/behavior contracts must cover scoped styling, deterministic delays, visibility fallback, hover eligibility, and reduced motion.
- Run the complete Node test suite and `git diff --check`.
- Verify the live page returns HTTP 200.
- Inspect light and dark screenshots at 390px, 768px, and 1440px.
- Exercise normal scrolling, fast scrolling, reduced motion, mouse hover, coarse-pointer behavior, and horizontal overflow.

