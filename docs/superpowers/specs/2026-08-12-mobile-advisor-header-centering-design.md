# Mobile Advisor Header Centering Design

## Goal

Make the mobile advisor sheet header feel visually balanced with the centered booking action below it.

## Scope

Refine only the title and subtitle alignment within the open mobile advisor sheet. Preserve the drag handle, close control, booking panel, copy, URLs, focus behavior, sheet geometry, motion, and reduced-motion behavior.

## Mobile Header

- Center `How can we help?` and `Connect with our academic team.` as one header group.
- Reserve equal `44px` clearance on the left and right so the text is centered within the sheet rather than within the space remaining beside the close control.
- Keep the close control absolutely positioned at the top-right with its existing `44px` interactive target and `20px` icon.
- Keep the drag handle centered above the header.
- Preserve the current vertical spacing between the header and booking panel; do not change the booking panel's internal spacing.

## Tablet and Desktop

- At `768px` and wider, retain the existing left-aligned `Speak with an Advisor` heading.
- Keep the subtitle hidden at tablet and desktop widths.
- Preserve the anchored `320px` popup and its current close-control placement.

## Accessibility and Verification

- Preserve `aria-labelledby="floating-cta-title"` and the existing breakpoint-specific heading text.
- Preserve keyboard order and focus restoration.
- Confirm the title group is optically centered at `390px` without colliding with the close control.
- Verify light and dark mobile states, tablet and desktop preservation, reduced motion, overflow, clipping, and page errors.

## Success Criteria

The mobile sheet header reads as a centered introduction to the centered booking action, while the close control remains visually independent and fully accessible.
