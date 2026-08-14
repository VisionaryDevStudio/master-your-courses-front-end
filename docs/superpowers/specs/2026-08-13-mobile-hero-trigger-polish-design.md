# Mobile Hero and Consultation Trigger Polish Design

## Scope

Correct two mobile presentation defects before merging the methodology card-identity branch:

1. A hard vertical edge in the light-mode hero atmosphere that reads as empty space on the right.
2. An overly heavy closed consultation-trigger ring that looks distorted at high device-pixel ratios.

Do not change hero content, typography, layout, navigation, CTA behavior, advisor sheet behavior, methodology cards, tablet/desktop consultation trigger, or dark-mode atmosphere.

## Root Cause

The mobile light-mode surface rule assigns the first hero background layer a fixed `38rem × 38rem` size without an explicit position or no-repeat contract. At wider mobile widths, the atmospheric layer ends inside the viewport and exposes a visible edge even though the hero itself spans the viewport and there is no document overflow.

The closed mobile consultation trigger is geometrically correct at `56 × 56px`. Its apparent distortion comes from the combination of a 2px light border and broad shadow, which creates a heavy double-ring effect after device-pixel scaling.

## Hero Atmosphere Correction

- Apply a hero-specific light-mode rule only below `768px`.
- Keep the current paper base and indigo/emerald atmospheric colors.
- Size and position both radial layers so their transparent edges terminate outside the viewport rather than inside it.
- Set `background-repeat: no-repeat` explicitly.
- Preserve a soft, continuous atmosphere across the complete hero width without introducing a uniform color block.
- Do not alter `.surface-methodology` or `.surface-mentors` as part of this correction.
- Preserve `width: 100%`, existing section padding, content alignment, and all hero animations.

## Consultation Trigger Correction

- Preserve the closed mobile trigger at exactly `56 × 56px` and its fixed bottom-right placement.
- Reduce the border from 2px to a single clean 1px light edge.
- Replace the broad/double-ring appearance with one restrained indigo shadow.
- Keep the existing purple gradient, calendar icon, accessible name, click target, open-sheet transition, and focus-visible treatment.
- Ensure the calendar SVG is explicitly centered and rendered as a block with balanced stroke geometry.
- Preserve the existing tablet/desktop full-width advisor trigger at `768px` and above.

## Motion and Accessibility

- Preserve the existing active scale, open/close transitions, reduced-motion behavior, focus restoration, keyboard handling, and modal semantics.
- Maintain at least a 44px target; the trigger remains 56px.
- Focus-visible must remain clearly distinguishable after the border/shadow refinement.

## Implementation Boundaries

- Production changes are limited to scoped CSS and, only if necessary for explicit SVG rendering, attributes on `.advisor-trigger-calendar` in `index.html`.
- Add focused regression tests in `tests/light-mode-section-surfaces.test.mjs` before production changes.
- Do not modify the completed methodology card-identity implementation.

## Verification

- Record RED/GREEN evidence for mobile hero background coverage, no-repeat positioning, trigger geometry, and optical treatment.
- Run the full Node test suite and `git diff --check`.
- Verify the isolated preview returns HTTP 200.
- Inspect 390×844 and 767×900 in light mode, including high-DPR capture.
- Confirm 768×1024 and 1440×900 retain the full advisor trigger and existing hero presentation.
- Confirm `scrollWidth === clientWidth`, hero width equals viewport width, the trigger is 56px square below 768px, and there are no relevant console errors or page exceptions.

