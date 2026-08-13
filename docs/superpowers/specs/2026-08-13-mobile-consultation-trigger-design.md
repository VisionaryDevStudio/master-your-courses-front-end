# Mobile Consultation Trigger Design

## Goal

Make the closed mobile advisor trigger clearly represent consultation booking rather than an immediate phone call or live-support presence.

## Scope

Refine only the closed mobile circular trigger. Preserve the open advisor sheet, booking flow, trigger timing and visibility logic, desktop trigger, labels, focus behavior, and reduced-motion behavior.

## Mobile Symbol

- Replace the visible mobile phone symbol with the same restrained calendar icon language used by `Book a Consultation`.
- Keep the phone symbol visible in the labeled tablet/desktop `Speak with an Advisor` control.
- Hide the green presence/ping indicator on mobile because it does not represent real availability.
- Preserve the accessible name `Speak with an Academic Advisor` and the existing `aria-expanded` state.

## Surface Treatment

- Keep the existing `56px` circular size and purple gradient.
- Replace the visually heavy double-edge treatment with one crisp translucent light border and a restrained shadow in the default state.
- Keep a clearly visible keyboard focus treatment without changing the circle's dimensions.
- Use only the existing button transition; do not add pulsing, orbiting, or continuous icon animation.

## Tablet and Desktop

- At `768px` and wider, preserve the current labeled trigger, phone icon, green indicator, chevron, dimensions, and behavior.

## Verification

- Verify closed mobile light and dark states at `390px`, including normal, focused, and pressed states.
- Confirm the calendar icon is visually centered, the green indicator is absent, and the control remains `56px` square.
- Confirm tablet and desktop trigger markup and rendering remain unchanged.
- Verify the trigger still opens the sheet, updates `aria-expanded`, restores focus after closing, respects Results-section visibility logic, and introduces no overflow or page errors.

## Success Criteria

The mobile circle reads as a calm entry point to booking an academic consultation, not as an immediate-call or live-chat widget.
