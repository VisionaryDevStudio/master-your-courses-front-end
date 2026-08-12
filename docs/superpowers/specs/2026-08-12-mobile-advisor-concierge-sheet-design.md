# Mobile Advisor Concierge Sheet Design

## Goal

Refine only the open mobile advisor sheet so it feels compact, calm, and appropriate for a premium education brand. Preserve the approved circular trigger, reveal timing, contact methods, accessibility behavior, and tablet/desktop popup.

## Scope

This change applies only below `768px` while the advisor is open. It may adjust the mobile sheet surface, header, contact-row presentation, backdrop, and opening motion. It must not change the advisor trigger, its reveal-after-Results behavior, contact destinations, page content, or the popup used at `768px` and above.

## Recommended Direction: Compact Concierge

- Present the advisor as a concise bottom sheet rather than a stack of large dashboard cards.
- Use one unified sheet surface with three compact contact rows.
- Make the hierarchy feel like an admissions concierge: helpful and polished, without becoming decorative or sales-heavy.
- Target a sheet approximately 25–30% shorter than the current mobile presentation at `390×844`, while allowing safe content-driven growth on smaller screens.

## Sheet Surface

- Keep the sheet fixed to the bottom edge and full viewport width.
- Use `24px` rounded top corners and square bottom corners.
- Add a small centered drag handle as a visual affordance; it is decorative and must not imply drag-to-dismiss functionality.
- Use an opaque or near-opaque light surface in light mode and an equivalent elevated dark surface in dark mode.
- Use one restrained top-edge border and a soft, broad shadow. Avoid glass-like glow, strong gradients, and multiple nested shadows.
- Preserve safe-area-aware bottom padding.

## Header

- Replace the visible heading with `How can we help?`.
- Add the supporting line `Connect with our academic team.` directly below it.
- Keep the modal dialog accessible name derived from the visible heading.
- Retain a clearly visible close button in the top-right with a minimum `44×44px` target.
- Keep the title concise and visually dominant without using oversized display typography.

## Contact Choices

- Preserve the existing order and destinations: Call, WhatsApp, and Email.
- Preserve the current labels and descriptions:
  - `Call an Advisor` — `Immediate guidance`
  - `WhatsApp Us` — `Quick parent & student questions`
  - `Email Admissions` — `Detailed inquiries`
- Place all choices inside one unified list surface.
- Use compact rows approximately `64–68px` tall with a minimum `44px` interactive height.
- Replace individual card borders, large radii, and shadows with fine inset dividers between rows.
- Retain the indigo, emerald, and purple icon identities, but reduce the icon containers and saturation so they support rather than dominate the label.
- Add a restrained directional chevron to the end of each row to reinforce that it opens an external contact action.
- Keep hover styles for capable pointers and provide visible active and focus-visible states.

## Backdrop and Motion

- Replace the strong grey blur with a cleaner dimmed backdrop and only subtle blur, if any.
- Animate the backdrop opacity independently from the sheet.
- Open the sheet with a short upward translation and fade using an approximately `280ms` ease-out transition.
- Close with a slightly quicker reverse transition.
- When `prefers-reduced-motion: reduce` is active, remove the sheet translation and use an immediate or near-immediate state change.
- Do not animate individual contact rows or add staggered effects.

## Preserved Behavior

- The closed mobile advisor remains a `56×56px` circular trigger.
- The trigger remains hidden until the user has passed the Results section, then stays visible.
- Opening the trigger shows one sheet and hides the circular trigger.
- Close button, backdrop click, and Escape close the sheet.
- Focus moves into the sheet, remains contained during Tab navigation, and returns to the circular trigger after close.
- The Call, WhatsApp, and Email links retain their current destinations and external-link behavior.
- At `768px` and above, retain the existing anchored popup layout and styling.

## Accessibility

- Keep `role="dialog"` and `aria-modal="true"` on the open sheet.
- Point `aria-labelledby` to the new visible `How can we help?` heading.
- Keep every contact option as a real link with its full accessible label and supporting description in reading order.
- Maintain at least `44×44px` targets for the close button and contact rows.
- Provide keyboard-visible focus treatment with sufficient contrast in both themes.
- Do not rely on color or iconography alone to distinguish contact methods.

## Verification

- At `390×844` in light and dark themes, confirm the open sheet is visibly shorter than the existing version, fits without internal scrolling, and does not clip its header, rows, or safe-area padding.
- Confirm one unified list with three compact rows, two dividers, three colored icons, and three directional chevrons.
- Confirm the backdrop dims the page without the current heavy blur.
- Confirm open motion is smooth and bounded, and reduced-motion mode removes meaningful translation.
- Confirm close button, backdrop click, Escape, forward Tab wrap, backward Tab wrap, and focus restoration.
- Confirm all three destinations remain unchanged.
- Confirm the closed `56×56px` trigger and reveal-after-Results sequence remain unchanged.
- At `768×1024` and `1440×900`, confirm the existing anchored popup remains unchanged.
- Check light/dark contrast, zoom/reflow, horizontal overflow, page errors, and relevant console errors.

## Success Criteria

The mobile advisor opens as a compact premium concierge sheet: the hierarchy is immediately clear, all three contact methods are easy to scan and tap, the background treatment feels controlled, and the interaction remains fully accessible without changing any behavior outside the open mobile state.
