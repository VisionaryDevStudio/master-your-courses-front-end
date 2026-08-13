# Advisor Booking Button Balance Design

## Goal

Remove the primary booking button’s perceived empty space and tighten the mobile advisor composition without weakening its conversion hierarchy.

## Scope

Refine only the open advisor panel’s booking action and nearby spacing on mobile, tablet, and desktop. Preserve all copy, URLs, headings, close behavior, focus order, sheet/popup geometry, trigger behavior, motion, and reduced-motion handling.

## Primary Booking Action

- Keep `Book a Consultation` as a full-width primary action.
- Center the button content rather than distributing the label and arrow across opposite edges.
- Remove the directional chevron.
- Add a restrained calendar icon immediately before the label.
- Use an approximate `54px` visual height while retaining a minimum `44px` interactive target.
- Preserve the existing indigo treatment, hover state, and accessible focus ring.

## Supporting Composition

- Keep `Choose a convenient time to discuss your student’s goals.` above the button.
- Reduce unnecessary horizontal padding inside the booking panel while preserving readable line length.
- Reduce the vertical gap between the primary booking button and the WhatsApp alternative.
- Keep `Prefer to message us? Chat on WhatsApp` centered as a compact secondary text link with its WhatsApp icon.
- Do not add another card, divider, badge, arrow, or decorative effect.

## Responsive Behavior

- Apply the balanced content treatment at mobile, tablet, and desktop widths.
- Preserve the inset mobile sheet and the anchored `320px` tablet/desktop popup.
- Allow the supporting sentence to wrap naturally on mobile without clipping.
- Maintain at least `44px` targets for booking, WhatsApp, and close controls.

## Accessibility and Verification

- Keep the exact booking and WhatsApp URLs and safe new-tab attributes.
- Keep focus order `Close → Book a Consultation → WhatsApp` and focus restoration after close.
- Confirm the calendar icon is decorative with `aria-hidden="true"`; the visible button text remains the accessible name.
- Verify light/dark mobile, tablet, and desktop states, keyboard focus, reduced motion, overflow, clipping, and page errors.

## Success Criteria

The booking button reads as one centered, intentional action rather than a label and distant arrow separated by unused space, and the WhatsApp alternative sits close enough to feel related without competing for attention.
