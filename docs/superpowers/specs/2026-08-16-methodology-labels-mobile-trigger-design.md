# Methodology Labels and Mobile Consultation Trigger Design

**Date:** 2026-08-16
**Status:** Approved design, awaiting implementation-plan approval

## Objective

Remove the unnecessary `Core Method` and `Ongoing Support` labels from the “Why Our Students Succeed” section and correct the optical centering of the closed mobile consultation trigger.

## Methodology Section

- Remove both `methodology-mobile-group` elements from the section markup.
- Remove the now-unused `.methodology-mobile-group` CSS, including its mobile and dark-mode rules.
- Preserve all six cards, their order, identities, colors, content, responsive layout, and reveal behavior.
- Do not change the tablet or desktop card design.

## Mobile Consultation Trigger

- Preserve the existing 56 by 56 pixel circular trigger, gradient, border, shadow, position, accessible label, and consultation-panel behavior.
- Remove the unnecessary nested icon wrappers from the trigger markup.
- Center the mobile calendar icon through the trigger content’s single layout system rather than margin-based centering inside nested blocks.
- Use a 22 pixel calendar icon for better optical weight without increasing the button.
- Preserve the existing desktop and tablet phone icon, label, chevron, and status indicator.

## Accessibility and Motion

- Keep the trigger’s 56 pixel touch target and existing keyboard focus treatment.
- Keep the calendar and phone icons decorative with `aria-hidden="true"`.
- Preserve reduced-motion behavior and all existing advisor open, close, and focus-restoration interactions.

## Verification

- Add focused structural regressions proving the group labels and unused CSS are absent.
- Add a focused trigger contract proving the calendar is a direct centered mobile child with the intended size.
- Run the full structural suite.
- Render and inspect the closed trigger at 390 pixels in light and dark mode.
- Confirm tablet and desktop trigger behavior remains unchanged at 768 and 1440 pixels.
- Confirm no horizontal overflow and verify the consultation panel still opens.
