# Hero Typography Refinement Design

## Goal

Refine the hero headline so it feels clearer, more balanced, and more premium while preserving the existing Outfit display font and recognizable four-line composition.

## Scope

This change applies only to the desktop and mobile hero `h1` elements in `index.html`. It does not change headings elsewhere, hero copy, colors, spacing outside the headline, animations, buttons, testimonial content, or section layout.

## Typographic Hierarchy

- Keep Outfit as the hero display family.
- Render the opening statement, “Master your toughest courses.”, at weight `800` so its letterforms have more internal clarity.
- Render the outcome statement, “Secure your future.”, at weight `900` so it remains the strongest message without becoming physically larger.
- Preserve the existing gradient on the outcome statement.
- Preserve the intentional four-line composition on desktop and mobile:
  1. Master your
  2. toughest courses.
  3. Secure your
  4. future.

## Desktop Treatment

- Use a responsive headline size of `68px` at the large breakpoint and `72px` at the extra-large breakpoint.
- Use a unitless line-height of `1.02`.
- Use letter-spacing of `-0.04em`, which remains expressive but is less compressed than Tailwind's existing `tracking-tighter` setting.
- Keep the existing headline bottom margin and alignment.

## Mobile and Tablet Treatment

- Keep the established size progression of `36px` by default and `48px` from the small breakpoint.
- Use a unitless line-height of `1.08`.
- Use letter-spacing of `-0.035em`.
- Keep the outcome statement's existing small top separation.
- Do not permit words to clip, collide, or create horizontal overflow at narrow mobile widths.

## Responsive Structure

- Keep the existing dedicated desktop and mobile hero markup rather than introducing shared JavaScript or new layout dependencies.
- Apply the same semantic hierarchy to both variants: one `h1`, a weight-800 opening statement, and a weight-900 outcome span.
- Keep all breakpoint visibility and hero animation hooks unchanged.

## Accessibility and Performance

- Preserve the single primary `h1` exposed by the active responsive layout.
- Do not convert headline text to an image or SVG.
- Do not add animation, JavaScript, font files, or external dependencies.
- Preserve reduced-motion behavior because the existing hero animation classes remain unchanged.

## Verification

- At `390x844`, confirm the four intended lines, readable letterforms, no clipping, and no horizontal overflow.
- At `768x1024`, confirm the mobile/tablet composition remains balanced and does not collide with adjacent hero content.
- At `1024x768`, confirm the desktop headline uses the `68px` large-breakpoint size without colliding with the testimonial column.
- At `1440x900`, confirm the desktop headline reaches `72px`, retains the four-line composition, and preserves header and paragraph clearance.
- Verify light and dark themes.
- Confirm the testimonial zoom, badge movement, hero entrance, and reduced-motion behavior are unchanged.

## Success Criteria

The opening statement reads more clearly, the gradient outcome has stronger hierarchy, and the hero remains unmistakably part of the existing Master Your Courses visual system. No typography outside the hero changes.
