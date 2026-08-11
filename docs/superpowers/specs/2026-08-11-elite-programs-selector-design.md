# Elite Programs Selector Design

## Goal

Make Elite Programs easier and more reliable to browse on mobile, add intentional program color, and simplify the desktop preview by removing its generic square grid.

## Current Problems

- The desktop stage contains a 24px geometric grid that repeats a visual motif already removed elsewhere.
- Mobile uses six vertically stacked accordion cards, producing a long, pale section with weak visual hierarchy.
- The floating advisor control can overlap program choices at some scroll positions.
- The active program ignores repeated taps, which can feel unresponsive because there is no explicit selected-state behavior.
- Program selection is not communicated with tab semantics or a persistent compact control.

## Selected Direction

Use a horizontally scrollable program selector above one shared mobile preview card. Keep the existing two-column desktop structure, but remove the stage grid.

## Mobile Selector

- Show all six programs as compact horizontal tabs in a swipeable rail.
- Each tab includes the existing program icon and a short readable label.
- Use each program's existing accent color for its icon, selected border, and restrained tinted background.
- Keep inactive tabs opaque and legible rather than transparent or heavily muted.
- Only one tab is selected at a time.
- Keep the selected tab visible by scrolling it into view after pointer or keyboard selection.
- Use native buttons with `role="tab"`, `aria-selected`, and a shared `tablist` label.
- Support pointer activation plus Left Arrow, Right Arrow, Home, and End keyboard navigation.

## Mobile Preview

- Render one shared preview card below the selector instead of six accordion bodies.
- Update the preview mockup, title, description, proof point, accent atmosphere, and CTA label from the existing program data.
- Use a softly tinted program-specific canvas so the section has color without becoming noisy.
- Keep the card height content-driven and avoid fixed accordion `max-height` clipping.
- Preserve the current mockup content and CTA copy.

## Overlay and Scroll Behavior

- Give the selector and preview enough bottom clearance that the floating advisor control cannot cover essential controls.
- Add section-aware scroll margin beneath the fixed header.
- Program selection must remain reliable while the advisor control is visible.
- Selecting the already active tab keeps it selected and provides a stable visual state; it does not collapse the preview.

## Desktop

- Preserve the existing program list and sticky preview stage.
- Remove the 24px square grid from the stage.
- Retain the program-specific radial color atmosphere, mockup, proof pill, title, description, and CTA.
- Preserve desktop auto-advance and direct hover/click selection.

## Olympiad Preview Refinement

- Remove the graph-paper square grid from the dark USAPhO problem panel in both the shared mobile preview and desktop stage.
- Preserve the dark slate panel, rounded geometry, problem copy, mathematical accents, purple label, and surrounding mockup structure.
- Replace the grid with a smooth, restrained tonal gradient that adds depth without introducing a visible repeating pattern.
- Keep the panel border subtle so it defines the surface without competing with the problem text.
- Do not alter any other program mockup or the broader Elite Programs section background.

## Data and Interaction Architecture

- Continue using `PROGRAMS_DATA` and `PROGRAMS_MOCKUPS` as the single program-content source.
- Replace the static duplicated mobile accordion markup with one generated selector and one shared preview.
- Route desktop and mobile selection through one `setActiveProgram(index, source)` state transition.
- Keep selection rendering idempotent so repeated selection never throws or leaves stale content.
- Do not introduce dependencies or additional assets.

## Accessibility

- Use semantic buttons for every program choice.
- Expose the selector as a labeled tablist and each program as a tab.
- Associate the selected tab with the shared preview panel.
- Maintain a visible keyboard focus indicator.
- Ensure touch targets are at least 44px high.
- Do not rely on color alone; selected state also uses border, elevation, and `aria-selected`.

## Responsive Behavior

- The tab rail scrolls horizontally without creating page-level horizontal overflow.
- The selected tab scrolls into view using reduced-motion-aware behavior.
- The preview mockup remains readable at 390px width and scales without clipping.
- Desktop layout begins at the existing `lg` breakpoint.

## Verification

- At 390x844, repeatedly select all six programs by touch/click and verify the preview content matches each selection.
- Verify the same sequence with keyboard navigation.
- Show the floating advisor control and confirm it does not block the selector or preview CTA.
- Verify no page-level horizontal overflow.
- At 1440x900, confirm list selection, auto-advance, and the preview stage still work with the grid removed.
- Select Olympiad & Contests at mobile and desktop widths and confirm no square grid remains inside the USAPhO problem panel.
- Test light and dark modes at desktop and mobile widths.
- Confirm no page errors are produced during repeated selections.

## Scope

This change is limited to Elite Programs markup, styling, and selection behavior in `index.html`, plus focused regression tests. It does not define destinations for the existing program CTAs or redesign other page sections.
