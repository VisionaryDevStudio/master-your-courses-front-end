# Mobile Advisor Circle Trigger Correction

## Goal

Restore the compact circular advisor trigger on mobile without changing the approved bottom sheet or the results-section overlap protection.

## Closed Mobile State

- At viewport widths below `768px`, display the closed advisor trigger as a `56px × 56px` circle.
- Keep it fixed in the existing bottom-right safe area.
- Show the existing white phone icon and green unread indicator.
- Hide the visible “Speak with an Advisor” label and chevron.
- Preserve the button's accessible name: `Speak with an Academic Advisor`.
- Keep the existing gradient, shadow, and click behavior inside the circular geometry.

## Open Mobile State

- Clicking the circle opens the approved bottom sheet.
- Hide the circular trigger while the sheet is open.
- Preserve the single heading, close button, dimmed backdrop, Call, WhatsApp, and Email choices, modal semantics, keyboard focus containment, Escape/backdrop/close behavior, and focus restoration.
- Closing the sheet restores focus to the circular trigger.

## Results Section

- Continue hiding the entire advisor while `#results-section` intersects the mobile viewport.
- Do not display either the circular trigger or bottom sheet over the results proof.
- Restore the circular trigger after leaving the results section.

## Tablet and Desktop

- At `768px` and above, preserve the existing full advisor button and anchored popup.
- Do not apply circular-trigger dimensions or hidden label rules at those widths.

## Verification

- At `390x844` in light and dark themes, confirm the closed trigger measures exactly `56px × 56px`, is circular, shows only the phone icon and indicator, and retains its accessible name.
- Confirm opening produces the existing bottom sheet and hides the circle.
- Confirm close button, backdrop, and Escape each restore the circle and focus.
- Scan the complete results-section scroll range and confirm the advisor remains fully hidden, then restores as a circle after exit.
- At `768x1024` and `1440x900`, confirm the full-width trigger and anchored popup remain unchanged.
- Confirm no horizontal overflow, clipping, relevant console errors, or changes to the results counter and qualifier.

## Scope

This is a focused responsive styling correction to the existing advisor trigger plus regression coverage. It does not redesign the bottom sheet, results section, contact actions, desktop popup, or any unrelated page surface.
