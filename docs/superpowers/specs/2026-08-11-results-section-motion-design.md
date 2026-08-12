# Results Section Motion and Trust Design

## Goal

Refine only “The numbers speak for themselves” so its proof feels credible, calm, accessible, and unobstructed on mobile while preserving the approved card composition.

## Scope

This change applies to the results section, its count-up controller, and the mobile presentation of the existing floating advisor while the results section is visible. It does not redesign the cards, change their colors or typography, add card entrance effects, alter desktop advisor behavior, or change animation systems elsewhere on the page.

## Preserved Visual Design

- Keep the three existing cards, their order, spacing, radii, shadows, borders, and responsive grid.
- Keep the center `77%` card dark and raised by 16px on desktop.
- Keep the indigo, emerald, and purple number accents.
- Keep all cards static: no entrance, floating, hover-scale, parallax, or ambient motion.
- Keep the section heading, explanatory paragraph, and success-rate badge styling unchanged.

## Safe Metric Defaults

- Render the final values directly in the HTML: `1,200`, `77`, and `21`.
- Preserve the existing suffixes `+`, `%`, and `%` as separate styled elements.
- JavaScript may temporarily replace the numeric text with zero only when a count-up will actually run.
- If JavaScript fails or is unavailable, the section must continue to show the correct final values.

## Count-Up Trigger

- Observe the results section once rather than observing each number independently.
- Start all three counters together when at least 35% of the section is visible.
- Run the animation only once per page load.
- Disconnect or unobserve the results section after the counters complete.
- Do not restart the counters when the user scrolls away and returns.

## Count-Up Motion

- Animate all three counters from `0` to their targets over `1,400ms`.
- Use an ease-out cubic curve: `1 - Math.pow(1 - progress, 3)`.
- Continue formatting the student count with the `en-US` thousands separator.
- Keep all three animations synchronized by using the same start timestamp and animation frame.
- Finish with the exact target values even if a frame is delayed.

## Reduced Motion

- Check `prefers-reduced-motion: reduce` before initializing the count-up.
- When reduced motion is active, retain the final HTML values and do not request animation frames.
- If the preference changes to reduced motion while the count-up is running, cancel the pending frame and immediately restore all final values.
- A later preference change back to normal motion must not replay an already completed or cancelled count-up.

## Mobile Advisor Clearance

- Give the results section a stable identifier for intersection tracking.
- At viewport widths below `768px`, hide the entire floating advisor while the results section intersects the viewport.
- If the advisor is open when the results section enters, close it before hiding the control.
- Restore the full advisor trigger when the results section leaves the viewport.
- Desktop and tablet widths at or above `768px` retain the current advisor presentation.
- Viewport changes must update the presentation without leaving stale hidden-state classes.

## Mobile Advisor Bottom Sheet

- At viewport widths below `768px`, open the advisor choices as a bottom sheet rather than a floating popup above a duplicate trigger bar.
- Anchor the sheet to the bottom edge, span the viewport width, and keep rounded top corners with safe-area-aware bottom padding.
- Show one “Speak with an Advisor” heading and one close button inside the sheet.
- Hide the gradient trigger button while the sheet is open; restore it after close.
- Keep the three existing Call, WhatsApp, and Email choices, their copy, destinations, icons, and visual styling.
- Keep the dimmed backdrop and allow backdrop click to close.
- Allow Escape to close, move focus into the sheet when it opens, contain Tab focus within the open sheet, and restore focus to the trigger after close.
- Expose the open sheet as a modal dialog with an accessible name derived from its heading.
- Desktop and tablet widths at or above `768px` retain the existing anchored popup behavior rather than the bottom-sheet layout.

## Trust Qualifier

- Add this approved sentence immediately below the success-rate badge:

  `Based on AP exam outcomes reported by participating students.`

- Style it as restrained supporting copy, not another badge: centered, sentence case, muted color, and smaller than the badge label.
- Keep it readable in light and dark themes.

## Accessibility

- Keep the section heading as an `h2` and preserve reading order.
- The advisor trigger remains a button with its existing accessible label; the mobile sheet exposes modal dialog semantics and restores focus on close.
- Do not add an `aria-live` region to the counters; the final statistics should be read as stable content rather than announcing every frame.
- Reduced-motion users receive no count-up animation.
- The qualifier remains real text in the document.

## Verification

- At `1440x900`, confirm the three counters begin together at 35% section visibility, ease to their final values in approximately `1,400ms`, and never replay.
- At `390x844`, confirm the advisor is completely hidden while the results section is visible and cannot cover any card, badge, or qualifier, then returns to the full trigger after the section leaves.
- Outside the results section at `390x844`, confirm the trigger opens one bottom sheet with no duplicate trigger bar, a dimmed backdrop, all three contact choices, modal semantics, Escape/backdrop close, contained Tab focus, and focus restoration.
- At `768x1024`, confirm the advisor retains its current anchored popup and does not use the mobile bottom sheet or results-hidden behavior.
- With reduced motion enabled before load, confirm final values are visible immediately and no count-up animation frame is scheduled.
- Toggle reduced motion during an active count and confirm the final values appear immediately without replay.
- Disable or block the count-up script and confirm the HTML still displays `1,200`, `77`, and `21`.
- Verify light and dark themes, no horizontal overflow, no clipping, no relevant console errors, and no changes to card geometry.

## Success Criteria

The section remains visually familiar, but its proof appears at the right moment, settles faster, respects motion preferences, survives JavaScript failure, includes accurate context, and is never obscured by the mobile advisor. Elsewhere on mobile, the advisor opens as a focused, non-duplicative bottom sheet.
