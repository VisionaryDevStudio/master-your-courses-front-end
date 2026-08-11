# Responsive Section Spacing Design

## Goal

Create a consistent Balanced Premium vertical rhythm across mobile, tablet, and desktop. Every major page chapter should feel calm, intentional, and clearly separated without making the landing page unnecessarily long or flattening compact transition sections into the same cadence.

## Scope

This change covers vertical spacing between and within the major landing-page sections in `index.html`. It includes section padding, section-introduction spacing, and targeted clearance around the floating advisor control.

It does not change section content, responsive layout structure, typography, colors, interactions, animation behavior, or dark-mode surfaces.

## Spacing Architecture

Define reusable semantic spacing classes in the existing page stylesheet. These classes become the source of truth for responsive section rhythm.

| Class | Mobile | Tablet | Desktop | Purpose |
| --- | ---: | ---: | ---: | --- |
| `section-space-major` | 64px | 88px | 128px | Primary content chapters |
| `section-space-dense` | 56px | 72px | 96px | Content sections that should maintain momentum |
| `section-space-band` | 40px | 48px | 56px | Compact transition bands and tickers |
| `section-intro-gap` | 32px | 40px | 48px | Section heading block to primary content |

The tablet breakpoint begins at 768px, matching the existing `md` breakpoint. The desktop breakpoint begins at 1024px, matching the existing `lg` breakpoint.

## Section Mapping

1. **Hero — custom asymmetric rhythm**
   - Preserve additional top clearance required by the fixed navigation.
   - Use a measured bottom transition into Results rather than applying a generic symmetric class.
   - Retain the existing desktop visual composition.

2. **Results — dense**
   - Apply `section-space-dense`.
   - Keep statistics visually grouped and avoid excess distance before the university-logo bridge.

3. **University logos — compact band**
   - Apply `section-space-band`.
   - Preserve its role as a concise credibility bridge, not a full content chapter.

4. **Methodology — major**
   - Apply `section-space-major`.
   - Apply `section-intro-gap` between the introduction and the methodology content.

5. **Elite Programs — major**
   - Apply `section-space-major`.
   - Apply `section-intro-gap` between the introduction and program selector.
   - Remove the broad mobile `pb-24` from the selector wrapper.
   - Reserve 80px of mobile-only clearance after the selector panel so its final action can scroll fully above the fixed advisor bar; do not add this clearance to the section itself.

6. **Mentors — major**
   - Apply `section-space-major`.
   - Normalize the heading-to-card-grid gap with `section-intro-gap`.

7. **Results and quotes ticker — compact band**
   - Apply `section-space-band`.
   - Preserve the dark visual reset and continuous ticker behavior.

8. **Track Record — major**
   - Apply `section-space-major`.
   - Normalize the introduction-to-content gap with `section-intro-gap` where the existing structure permits.

9. **Final CTA — major**
   - Apply `section-space-major` while preserving its dark closing composition.

10. **Footer — dense**
    - Apply `section-space-dense`.
    - Preserve internal link-group and legal-row spacing.

## Boundary Rules

- Section padding owns the whitespace inside its surface; adjacent margins must not create an accidental double gap.
- Compact bands remain visibly shorter than major sections at every breakpoint.
- A section heading and its descriptive copy remain one introduction block; the semantic intro gap begins after that block.
- Fixed and sticky elements receive targeted clearance at the affected component, not inflated padding across the entire section.
- Full-bleed surface transitions remain intact so spacing does not reveal unintended background seams.
- Existing horizontal page padding and maximum content widths remain unchanged.

## Responsive Behavior

- Mobile uses a consistent 64px major-chapter cadence to maintain polish without excessive scrolling.
- Tablet expands to 88px for improved breathing room as layouts gain columns.
- Desktop uses 128px for major chapters, preserving the established editorial scale.
- Dense and compact sections scale independently so the page retains varied pacing rather than becoming mechanically uniform.
- The hero remains responsive to the fixed navigation height and does not inherit a class that could place content underneath the header.

## Accessibility and Interaction Constraints

- Spacing changes must not reduce touch-target dimensions or place controls behind the floating advisor bar.
- Focused elements must remain visible when navigating with a keyboard.
- Sticky desktop program content must retain sufficient top clearance beneath the navigation.
- No spacing rule may create horizontal overflow at supported viewport widths.
- Reduced-motion behavior and all existing interactions remain unchanged.

## Implementation Strategy

- Add the four semantic spacing utilities to the existing inline stylesheet.
- Replace section-level one-off vertical padding classes with the appropriate semantic class.
- Normalize introduction wrappers with `section-intro-gap` rather than unrelated hard-coded bottom margins.
- Keep exceptional spacing explicit only for the hero, fixed advisor clearance, and any structural element whose behavior cannot be represented by the shared utilities.
- Add regression assertions for the semantic utilities and their section mappings.

## Verification

1. Run the existing Node regression suite plus new spacing-contract assertions.
2. Render the entire page in light and dark mode at 390px, 768px, and 1440px widths.
3. Inspect every section boundary for double gaps, cramped transitions, and unintended background seams.
4. Confirm heading-to-content gaps are consistent across Methodology, Elite Programs, Mentors, and Track Record.
5. Confirm the Elite Programs action remains clear of the floating advisor bar.
6. Check that the fixed navigation and sticky desktop program stage do not overlap content.
7. Confirm there is no horizontal overflow and that existing interactive controls still respond.

## Success Criteria

- Major sections share the approved responsive 64px, 88px, and 128px rhythm.
- Dense sections and compact bands remain intentionally differentiated.
- Major introduction gaps share the approved 32px, 40px, and 48px rhythm.
- No section boundary contains accidental stacked spacing.
- The page feels consistently paced from hero through footer at mobile, tablet, and desktop widths.
- Existing layout, interaction, dark mode, and accessibility behavior do not regress.
