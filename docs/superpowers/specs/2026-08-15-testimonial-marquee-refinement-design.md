# Testimonial Marquee Refinement Design

## Goal

Preserve the continuous scrolling testimonial ribbon on both desktop and mobile while making it easier to read, visually smoother, and accessible for reduced-motion and assistive-technology users.

## Scope

- Refine only the dark `Results & Quotes Ticker` immediately after `Meet The Mentors`.
- Preserve the six existing testimonials, names, score changes, quotes, colors, typography, and overall dark-ribbon composition.
- Do not replace the mobile marquee with a carousel, pagination, manual-only scrolling, or stacked cards.
- Do not change the following `The Track Record` section.

## Motion

- Normal desktop motion remains a seamless linear marquee with an 80-second loop.
- Normal mobile motion remains continuous but uses a 96-second loop to improve quote readability.
- The animation pauses while the ribbon is hovered, contains keyboard focus, or is actively pressed.
- No acceleration, bounce, scale, or directional reversal is added.
- Under `prefers-reduced-motion: reduce`, automatic animation stops completely and the unique testimonial set remains available through native horizontal scrolling.

## Structure and Accessibility

- The six unique testimonials form one semantic group.
- Three visual duplicate groups support the seamless loop and use `aria-hidden="true"` so assistive technology encounters each testimonial only once.
- The semantic group is labelled `Student outcomes` without adding a new visible heading or changing the ribbon's vertical rhythm.
- Each unique testimonial remains readable in DOM order: student name, assessment and score improvement, then quote.
- Duplicate groups cannot receive keyboard focus.

## Visual Refinements

- Add restrained left and right edge masks so testimonials enter and leave the viewport softly.
- Desktop keeps the compact horizontal pill treatment and 48px track spacing.
- Mobile keeps 280px cards but reduces track spacing to 24px.
- Mobile cards use a consistent 156px height so quotes do not cause vertical jumping; internal content remains vertically balanced.
- Desktop cards keep a consistent 66px height.
- Preserve the existing subtle border, translucent navy surface, circular initial, score coloring, and quote treatment.

## Seamless Loop Contract

- Render four identical six-item groups.
- The marquee moves exactly one group width before resetting, using a `translate3d` transform and a shared CSS duration variable.
- Group spacing must be included consistently so the reset point has no visible jump.
- The track uses `will-change: transform` only while automatic motion is active; reduced motion removes it.

## Responsive Behavior

- Desktop at 1440px: multiple complete pills remain visible, with partial edge cards softened by the masks.
- Tablet at 768px: continuous horizontal motion remains, with cards retaining readable score and quote hierarchy.
- Mobile at 390px: one mostly complete 280px card and a controlled preview of the next remain visible while moving.
- No horizontal document overflow is introduced at any breakpoint.

## Verification

- Static tests protect group semantics, duplicate `aria-hidden` treatment, desktop/mobile durations, pause states, reduced-motion behavior, card dimensions, and one-group translation distance.
- Browser QA covers 390x844, 768x1024, and 1440x900 in light and dark themes; the ribbon remains dark in both themes.
- Reduced-motion QA confirms animation is stopped and the unique group can be horizontally scrolled.
- Verify there are exactly six assistive-technology-visible testimonials, no document overflow, no console errors, no animation jump, and no changes to adjacent sections.

## Out of Scope

- Changing testimonial claims or introducing new quotes.
- Adding profile photos, logos, controls, pagination, or navigation arrows.
- Redesigning the video testimonial gallery that follows the ribbon.
