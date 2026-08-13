# Advisor Booking Conversion Design

## Goal

Turn the floating advisor experience on mobile, tablet, and desktop into a guided consultation conversion rather than a three-option contact directory.

## Conversion Hierarchy

- Keep the header CTA labeled `Apply Now`; it remains the direct enrollment path.
- Change the floating advisor's primary action to `Book a Consultation`; it serves visitors who want guidance before applying.
- Use the supporting sentence `Choose a convenient time to discuss your student’s goals.`
- Use `Prefer to message us? Chat on WhatsApp` as the only secondary contact action.
- Remove the visible Call and Email choices from the floating advisor panel.

## Links

- Point `Book a Consultation` to the explicit temporary URL `https://cal.com/your-booking-link`.
- Mark the placeholder in an adjacent HTML comment so it can be searched and replaced safely later.
- Open the booking URL in a new tab with `target="_blank"` and `rel="noopener noreferrer"`.
- Preserve the existing WhatsApp destination `https://wa.me/18001234567`, also opening it safely in a new tab.
- Do not change the header `Apply Now` destination.

## Mobile Presentation

- Preserve the approved inset concierge sheet, backdrop, handle, heading, close control, motion, reduced-motion treatment, and focus behavior.
- Replace the three-row list with one full-width, high-emphasis booking button.
- Place the supporting sentence above the booking button.
- Place the WhatsApp action beneath the primary button as a quiet text link with the WhatsApp icon.
- Keep the sheet compact, balanced, and free from unnecessary dividers or empty space.

## Tablet and Desktop Presentation

- Preserve the anchored popup position and width at `768px` and above.
- Use the visible heading `Speak with an Advisor` on tablet and desktop.
- Present the same primary booking action, supporting sentence, and secondary WhatsApp link as mobile.
- Do not retain the former Call and Email cards.

## Accessibility and Behavior

- Keep modal dialog semantics, breakpoint-specific accessible headings, close-button behavior, backdrop close, Escape close, focus entry, Tab containment, and focus restoration.
- Make the booking button the first focus target after the close control.
- Ensure both actions have visible keyboard focus and at least a `44px` target.
- Keep the closed mobile `56×56px` circular trigger and its post-Results reveal behavior unchanged.

## Verification

- Confirm mobile, tablet, and desktop show exactly one primary `Book a Consultation` action and one secondary WhatsApp action.
- Confirm no Call or Email action remains in the floating advisor.
- Confirm exact booking placeholder and WhatsApp destinations, safe new-tab attributes, focus order, all close paths, and focus restoration.
- Confirm the header still reads `Apply Now` and its destination is unchanged.
- Check light/dark themes, mobile geometry, desktop anchoring, reduced motion, overflow, clipping, and page errors.

## Success Criteria

The floating advisor gives visitors one clear premium next step—schedule a consultation—while retaining WhatsApp as a low-emphasis alternative and preserving `Apply Now` as the separate enrollment CTA.
