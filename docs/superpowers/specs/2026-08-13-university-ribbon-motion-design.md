# University Ribbon Motion Refinement Design

## Goal

Refine the `Our students gain admission to` ribbon so its motion feels calm and premium, its mobile density is stronger, and its reduced-motion and assistive-technology behavior are correct.

## Scope

Change only the university ribbon section, its logo markup, its motion styles, and the observer behavior needed for its one-time entrance. Preserve the section copy, university set, logo assets, surrounding section rhythm, light/dark surfaces, and adjacent sections.

## Continuous Motion

- Keep the existing leftward marquee at `40s`, linear, and infinite.
- Add a one-time `450ms` fade-and-rise entrance when the ribbon first intersects the viewport.
- Use the existing scroll-reveal observer pattern and remove observation after the entrance is completed.
- Do not replay the entrance after the section has become visible.
- Pause the marquee when its viewport is hovered or keyboard-focused.
- Resume from the same marquee position when hover or focus leaves.

## Responsive Density

- Use a `52px` logo gap below `768px`.
- Retain the existing `96px` gap at `768px` and wider.
- Keep mobile logos `32px` high and tablet/desktop logos `40px` high.
- Keep the existing section height, padding rhythm, overflow containment, and soft edge masks.

## Logo Presentation

- Use `70%` resting track opacity in light mode.
- Use `55%` resting track opacity in dark mode.
- Keep logos grayscale at rest.
- On hover-capable desktop devices, reveal logo color over `500ms` while the marquee is paused.
- Cap each logo's inline size at `176px` on tablet/desktop and `152px` on mobile while preserving intrinsic aspect ratio.
- Do not add cards, pills, backgrounds, borders, or individual logo animations.

## Reduced Motion

- When `prefers-reduced-motion: reduce` is active, disable the marquee and entrance translation.
- Render one static horizontal row containing the first ten universities.
- Make the viewport horizontally scrollable when the row exceeds the available width.
- Hide the two duplicate groups from layout in reduced-motion mode.
- Preserve the edge masks as a visual indication that the static row can scroll horizontally.

## Accessibility

- Give the ribbon viewport `tabindex="0"`, `role="region"`, and `aria-label="Universities our students have gained admission to"`.
- Keep the first group of ten logos exposed with their existing meaningful alternative text.
- Give every image in duplicate groups `alt=""` and `aria-hidden="true"` so university names are announced only once.
- Provide a visible focus treatment on the ribbon viewport without changing its dimensions.
- Pausing on keyboard focus applies to the entire viewport rather than individual logos because the logos are evidence, not links.

## Verification

- Verify pre-entry, entrance, settled, hovered, focused, and resumed states at `1440px`.
- Verify the `52px` mobile gap, edge masking, logo caps, and smooth marquee at `390px`.
- Verify light and dark resting opacity and hover color behavior.
- Verify reduced motion produces no transform animation, shows exactly ten logos, and supports horizontal scrolling.
- Verify duplicate logos are excluded from the accessibility tree.
- Confirm no horizontal page overflow, clipped logos, layout shifts, missing assets, console errors, or page errors.

## Success Criteria

The ribbon retains its recognizable continuous movement while feeling more editorial and readable, and users who prefer reduced motion receive a complete static university list without repeated announcements.
