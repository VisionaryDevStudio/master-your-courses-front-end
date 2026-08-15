# Meet The Mentors — Editorial Hybrid Design

## Objective

Redesign only the **Meet The Mentors** section into the approved premium editorial hybrid while preserving the surrounding landing-page rhythm, light/dark themes, and existing mentor modal behavior.

The final mentor roster, in display order, is:

1. Zoey
2. Dr. Hossein Piri
3. Dr. Sherri Sadr

Elena is removed from the visible cards, mentor data, accessibility labels, modal content, and tests.

## Desktop and Tablet

- Keep all three mentors visible in one row at desktop widths.
- Use compact `4:3` editorial portraits instead of small circular avatars or tall portrait panels.
- Keep every portrait frame at its existing `4:3` dimensions and render one clean image per mentor with `object-fit: cover`.
- Portrait assets are authored natively at `1600 × 1200` (`4:3`), with the full head, upper torso, and shirt/shoulders already composed inside the source file. The page does not synthesize, blur, duplicate, or letterbox portrait backgrounds.
- Use neutral `center center` positioning so replacement assets require no mentor-specific CSS or artificial scaling.
- Preserve the warm mentor-section canvas so the section remains integrated with the existing page.
- Each card shows the portrait, name, role, a concise two-to-three-line summary, and two selected credentials.
- Cards use restrained borders, soft elevation, and subtle accent color; avoid decorative glow, oversized empty areas, or excessive badges.
- Hover and keyboard focus may lift the card slightly and strengthen its border/shadow, without rotating portraits or creating distracting movement.
- Tablet retains the same three-profile presentation when space permits and may use a compact three-column treatment without changing content hierarchy.

## Mobile

- Replace the long vertical list with a horizontal, manual snap carousel.
- Show one primary card with a visible edge of the next card to communicate swipe affordance.
- Include accessible previous and next controls plus three pagination indicators.
- Do not auto-advance.
- Swiping, control clicks, and keyboard activation keep the active card and pagination state synchronized.
- The carousel must not create horizontal page overflow.

## Motion and Accessibility

- Cards reveal with a short staggered fade-and-rise when the section first enters the viewport.
- Motion should be restrained and run only once.
- Hover uses a small vertical lift and gentle shadow change; portrait rotation is removed.
- `prefers-reduced-motion: reduce` disables reveal displacement, stagger, smooth scrolling, and hover translation.
- Mentor cards remain keyboard-operable buttons with visible focus treatment and accurate accessible names.
- The existing modal keeps focus management, Escape closing, backdrop closing, and focus restoration.

## Zoey Content

### Visible card

- Name: **Zoey**
- Role: **Certified Biology & Science Teacher**
- Portrait: `mentors/zoey.png`
- Summary: Zoey makes difficult biology concepts manageable through step-by-step, adaptive instruction that builds confidence and AP-level mastery.
- Selected credentials:
  - 2025–26 National Virtual Teacher of the Year
  - Master’s, Johns Hopkins University — 4.0 GPA

### Detailed profile

Biography:

> Zoey is one of the most decorated AP Biology teachers in the country. She has a rare gift for making difficult biology concepts feel manageable—breaking them down step-by-step and adapting her instruction to how each individual student learns best. Parents choose her because she doesn't just teach content; she builds the confidence and skills students need to earn top grades and score a 5.

Accolades:

- AP Biology Teacher Since 2017
- 2025–26 National Virtual Teacher of the Year
- Teacher of the Year, 2020–21 — U.S. Grant High School
- Master's Degree, Johns Hopkins University — 4.0 GPA
- Scored a 5 on the AP Biology Exam — then built a career teaching others to do the same
- Teacher Mentor — Coached 39+ educators in mastery-based learning

## Existing Mentor Content

Dr. Sherri Sadr uses `mentors/sherri.png`; Dr. Hossein Piri retains `mentors/Dr.piri.jpg`. Their names, roles, biographies, and detailed-profile accolades remain unchanged. Their visible cards are edited only for presentation length and hierarchy; factual meaning is not changed.

## Responsive and Theme Requirements

- Verify at 390px, 768px, and 1440px in light and dark modes.
- Preserve the existing section spacing tokens and neighboring-section boundaries.
- Avoid clipping, horizontal overflow, stretched portraits, and overlap with the floating consultation trigger.
- Portraits use stable aspect ratios and intentional object positioning at every breakpoint.
- The portrait treatment must preserve the current frame height and card geometry at every breakpoint; no card-height, grid, carousel-width, or surrounding-spacing changes are permitted.
- Final replacement assets for Zoey, Dr. Piri, and Dr. Sherri must each show an uncropped head and meaningful shirt/shoulder context without plain letterbox bars.

## Testing

- Add static contracts for the exact three-mentor roster and removal of Elena.
- Test Zoey’s portrait, visible content, modal data, and accessible label.
- Test the mobile snap-carousel structure, manual controls, pagination, and no-auto-advance contract.
- Test desktop/tablet preservation and reduced-motion behavior.
- Test the single-image portrait structure, `4:3` frame contract, cover behavior, source mapping, and absence of decorative duplicate portrait layers.
- Run the existing section-surface test suite, a clean diff check, HTTP preview check, and rendered responsive QA.

## Out of Scope

- Changes to other landing-page sections.
- Changes to mentor facts not supplied by the user.
- New backend, CMS, booking, or mentor-directory functionality.
- Automatic carousel advancement.
