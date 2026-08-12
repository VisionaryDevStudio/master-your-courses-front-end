# Hero Motion Refinement Design

## Goal

Make the header and hero animation feel calm, cinematic, and premium while preserving the testimonial card's scroll-growth effect as the primary motion signature.

## Motion Hierarchy

The testimonial card moving toward the viewer during the opening scroll is the hero's dominant effect. All other hero motion must support that effect rather than compete with it.

1. The headline receives one short entrance.
2. The testimonial card scales with the opening scroll.
3. Small supporting badges may drift subtly on desktop.
4. Buttons retain restrained interaction feedback.
5. Pointer spotlight remains a desktop-only enhancement.

## Testimonial Card

- Remove continuous floating animation from the main testimonial card on desktop and mobile.
- Keep the card stationary before the user scrolls.
- Scale the desktop card from `1` to a maximum of `1.10` across the first 320px of page scroll.
- Scale the mobile card from `1` to a maximum of `1.06` across the first 320px of page scroll to restore a more noticeable effect without creating edge pressure or clipping.
- Do not translate the card vertically during scroll; scaling is the single card-motion signal.
- Use `transform-origin: center center` and preserve the existing card layout, shadow, border, and content.
- Stop updating the card once the hero is outside the active scroll range.

## Hero Copy

- Keep the initial fade-and-rise entrance.
- Reduce the entrance distance to 20px and use a 500ms duration.
- During scroll, allow only a restrained copy fade from full opacity to `0.35` across the first 320px.
- Remove scroll-driven vertical translation from the copy.
- Keep the headline legible while the testimonial card grows; do not fade the copy to zero.

## Supporting Badges

- Keep ambient movement only on the small rating and student-count badges.
- Limit vertical travel to 5px.
- Use slow 12-second and 14-second cycles so the badges do not move in lockstep.
- Disable badge drift on mobile, where the card and badges should remain stable.
- Preserve badge rotation, content, color, and position.

## Pointer Spotlight

- Preserve the subtle pointer-following hero spotlight on desktop pointer devices.
- Do not run spotlight tracking on touch-sized viewports.
- Update the spotlight through `requestAnimationFrame` so repeated pointer events do not force unnecessary style work.

## Buttons and Navigation

- Reduce hero primary-button hover scale from `1.05` to `1.02`.
- Preserve active press feedback.
- Do not introduce page-wide color or layout transitions for theme switching.

## Performance Architecture

- Drive scroll updates through one `requestAnimationFrame` scheduler rather than mutating styles on every native scroll event.
- Cache hero element references outside the scroll handler.
- Skip visual updates when the calculated state has not changed.
- Limit calculations to the opening 320px scroll range.
- Do not introduce dependencies.

## Reduced Motion

When `prefers-reduced-motion: reduce` is active:

- Show hero copy immediately without entrance translation.
- Keep the testimonial card at scale `1`.
- Disable badge drift.
- Disable scroll-driven opacity and scale changes.
- Disable pointer-following spotlight updates.
- Preserve static layout, content, and button state feedback.

## Responsive Behavior

- Desktop retains the full testimonial scroll-growth effect up to `1.10`.
- Mobile retains a restrained version up to `1.06` but has no continuous ambient badge movement.
- Neither viewport may develop horizontal overflow or testimonial-card clipping.
- The fixed header and hero spacing remain unchanged.

## Verification

- At `1440x900`, confirm the testimonial card scales smoothly from `1` to `1.10` over the first 320px while remaining vertically anchored.
- At `390x844`, confirm the card scales no further than `1.06` and does not clip or create horizontal overflow.
- Confirm the main card no longer floats when the page is idle.
- Confirm desktop badges move no more than 5px and mobile badges remain stationary.
- Confirm hero copy never fades below `0.35` and no longer translates during scrolling.
- Confirm primary-button hover scale is `1.02`.
- Repeat desktop and mobile checks with reduced motion and confirm all decorative hero movement is disabled.
- Confirm there are no page errors during scroll and pointer movement.

## Scope

This refinement is limited to header and hero animation behavior in `index.html` plus focused regression tests. It does not change hero content, spacing, typography, imagery, colors, card composition, or animation behavior in later sections.
