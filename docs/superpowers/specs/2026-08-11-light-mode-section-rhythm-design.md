# Light Mode Section Rhythm Design

## Goal

Give the standalone landing page a premium, high-end edtech light mode in which each major section reads as a distinct chapter. Preserve the existing content, interactions, responsive behavior, and dark-mode appearance.

## Design Direction

Use a layered editorial rhythm rather than a mechanical white-gray stripe pattern. Separation will come from controlled changes in surface temperature, restrained brand-color atmosphere, card elevation, spacing, and occasional fine boundaries. White remains the primary content surface, while neighboring sections use subtly different neutral or tinted canvases.

The result should feel scholarly, contemporary, calm, and expensive. Decorative color must support hierarchy rather than compete with content.

## Section Sequence

1. **Hero — luminous paper**
   - Keep a predominantly white surface.
   - Use restrained indigo and blue radial illumination to create depth without reducing headline clarity.
   - Treat the hero as the brightest point on the page.

2. **Results — cool mist**
   - Use a clearly perceptible cool gray-blue canvas.
   - Keep statistic cards white with refined borders and soft elevation.
   - Ensure the section boundary is visible even before the cards enter the viewport.

3. **University logos — white bridge**
   - Use a compact pure-white transition band.
   - Retain fine top and bottom rules to distinguish it from both neighboring sections.

4. **Methodology — pale academic indigo**
   - Use a pale indigo-gray canvas distinct from the Results surface.
   - Retain the existing restrained grid treatment.
   - Keep methodology cards white so they read as tools laid onto the canvas.

5. **Elite Programs — editorial white gallery**
   - Return to white, with subtle edge gradients or ambient color fields to avoid a blank sheet effect.
   - Let the large program components provide the primary structure.
   - Avoid enclosing the entire long section in a heavy rounded rectangle.

6. **Mentors — warm human surface**
   - Use a warm lavender-stone neutral to distinguish the human-focused content from the cooler academic sections.
   - Keep mentor cards clean and elevated.

7. **Video showcase — cinematic anchor**
   - Preserve the existing dark presentation.
   - Use it as a deliberate visual reset in the page sequence.

8. **Track Record — cool blue-gray**
   - Use a cool blue-gray canvas that is visibly lighter than the video section and distinct from white.
   - Keep evidence and testimonial surfaces white and elevated.

9. **Final CTA — dark close**
   - Preserve the existing dark closing section and its strong contrast.

## Implementation Structure

- Define semantic light-mode surface tokens in the page CSS for the main neutral, cool, indigo, warm, and elevated-card colors.
- Add small reusable section-surface classes rather than repeating long arbitrary color declarations.
- Apply those classes to the existing major section elements.
- Scope new atmosphere layers to light mode and preserve every existing `dark:` treatment.
- Use borders only where neighboring surfaces remain intentionally close in value.
- Keep decorative layers non-interactive and behind content.

## Responsive Behavior

- Maintain the existing section padding and content widths unless a small spacing adjustment is required to clarify a boundary.
- Reduce large ambient gradients on narrow screens so they do not appear as accidental colored patches.
- Preserve card readability, horizontal overflow behavior, and all existing mobile navigation and CTA interactions.

## Accessibility and Quality Constraints

- Maintain readable foreground contrast on every new surface.
- Do not communicate section meaning through color alone; headings and spacing continue to establish structure.
- Respect reduced-motion behavior already present on the page.
- Avoid new assets, additional runtime dependencies, or JavaScript for purely visual separation.
- Dark mode must remain visually and functionally unchanged.

## Verification

- Load the page with light mode forced and inspect the complete vertical sequence at desktop and mobile widths.
- Confirm every major section has a recognizable beginning and end without looking like a stack of alternating stripes.
- Toggle to dark mode and verify that the new light surfaces do not leak through.
- Check heading, body, border, and card contrast on each new surface.
- Exercise the theme toggle and existing interactive sections to confirm no behavior regressed.

## Scope

This change is limited to the light-mode section rhythm and directly related card/surface contrast in `index.html`. It does not redesign content, rewrite copy, restructure sections, or alter dark mode.
