# Closing CTA Refinement Design

## Goal

Refine **Ready to master your courses?** into a decisive, premium closing conversion moment without changing its dark cinematic canvas, responsive dimensions, or relationship to the footer.

## Content and actions

- Keep the headline `Ready to master your courses?`.
- Replace the generic supporting sentence with concise guidance focused on choosing the right program and receiving a personalized plan.
- Rename the primary action to `Book a Consultation` and use the existing calendar icon language.
- The primary action opens the existing accessible advisor consultation panel through the established `toggleFloatingCTA()` controller; it does not create another modal or booking surface.
- Rename the secondary action to `Explore Programs` and link it to the Elite Programs section.
- Add a stable `id="elite-programs"` anchor to the existing Elite Programs section without changing its layout or behavior.

## Visual hierarchy

- Preserve the section's dark background, centered composition, headline scale, section height, and restrained ambient color.
- Keep the primary action visually dominant, but replace the strong glow and one-rem upward hover with restrained elevation, a subtle border, and a small two-pixel lift for fine pointers.
- Make the secondary action quieter through lower-contrast surface treatment while retaining a clear border and readable text.
- Use rounded-full actions to match the landing page's established premium CTA language.
- Preserve full-width stacked controls on mobile and inline controls from the small breakpoint upward.
- Do not introduce squares, decorative cards, new imagery, or additional conversion choices.

## Motion

- Remove the generic `scroll-reveal` whole-section scale and 60px travel from this section only.
- Reveal the heading, copy, and action group as three content stages with 18px vertical travel, opacity transition, and restrained delays.
- Use a 560ms premium easing curve for each stage with delays of 0ms, 70ms, and 140ms.
- Activate motion only after the section intersects and only when `prefers-reduced-motion: no-preference`.
- Fail open: if IntersectionObserver is unavailable or construction fails, content remains visible.
- Under reduced motion, content is immediately visible with no transform or transition.
- Remove `will-change` after the section becomes visible.

## Accessibility

- Use real interactive controls: a button for opening the advisor panel and an anchor for in-page navigation.
- Keep both controls at least 44px tall.
- Add explicit, high-contrast `:focus-visible` rings with offset appropriate to the dark canvas.
- Keep the calendar and arrow icons decorative with `aria-hidden="true"`.
- Preserve logical reading and focus order: heading, supporting copy, primary action, secondary action.

## Responsive and theme behavior

- At 390px, preserve the existing natural headline wrapping and stacked full-width actions.
- At tablet and desktop widths, retain centered copy and inline actions.
- The section remains intentionally dark in both light and dark page themes.
- Prevent horizontal overflow and avoid overlap with the fixed advisor trigger.

## Testing and acceptance

- Add focused structural tests for copy, action semantics/destinations, anchor identity, staged hooks, focus rings, and absence of generic `scroll-reveal` on the section.
- Add controller tests proving fail-open behavior, one-time reveal, reduced-motion behavior, and cleanup of `will-change`.
- Verify the primary action opens the existing consultation panel and the secondary action targets Elite Programs.
- Render and inspect 390px, 768px, and 1440px layouts in light and dark themes, plus reduced motion.
- Preserve all existing tests and unrelated workspace changes.

## Scope

Only the closing CTA and the Elite Programs anchor are changed. The footer, floating advisor implementation, program selector, navigation, and other sections remain unchanged.
