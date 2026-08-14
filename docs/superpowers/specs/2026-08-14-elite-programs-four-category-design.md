# Elite Programs Four-Category Design

## Objective

Consolidate the current six Elite Programs options into four clear customer-facing categories while preserving the section's established visual system, responsive selector, stage presentation, and interaction behavior.

The redesign should reduce decision fatigue and remove overlap between AP-specific services and general tutoring.

## Category Architecture

### 1. AP Prep

- **Selector label:** AP Prep
- **Coverage line:** All AP STEM courses
- **Supporting copy:** Self-paced Mastery Engines, live programs, and private AP tutoring.
- **CTA:** Explore AP Prep
- **Color identity:** Emerald
- **Preview direction:** Preserve the existing premium program-preview framing, but represent the full AP pathway rather than a single bootcamp. Show representative AP STEM coverage such as Biology, Chemistry, Physics, Calculus, Statistics, and Computer Science, together with the three delivery modes: Mastery Engine, Live Programs, and Private Tutoring. The list is representative; the copy must not imply that only those named courses are supported.

AP tutoring belongs only within AP Prep. It must not be repeated under the general 1-on-1 category.

### 2. 1-on-1 Tutoring

- **Selector label:** 1-on-1 Tutoring
- **Coverage line:** High-school and university courses
- **Supporting copy:** Personalized tutoring matched to the student's exact course and goals.
- **CTA:** Find Your Tutor
- **Color identity:** Violet
- **Preview direction:** Reuse the strongest parts of the existing private-mentorship preview: mentor profile, subject matching, and a consultation-oriented action. Do not label this category as AP tutoring.

### 3. SAT Prep

- **Selector label:** SAT Prep
- **Coverage line:** SAT Math now, broader SAT later
- **Supporting copy:** Targeted instruction, practice, and score-improvement programs.
- **CTA:** Explore SAT Prep
- **Color identity:** Blue
- **Preview direction:** Reuse the current SAT performance dashboard and score-progression visual. The copy must accurately distinguish current SAT Math availability from future broader SAT coverage.

### 4. Competition Prep

- **Selector label:** Competition Prep
- **Coverage line:** AMC, AIME, F=ma, Physics Olympiad, and more
- **Supporting copy:** Advanced preparation for competitive STEM exams.
- **CTA:** Explore Competition Prep
- **Color identity:** Rose
- **Preview direction:** Reuse the current Olympiad simulator visual and competitive-exam proof treatment without limiting the category to one competition.

## Responsive Presentation

### Mobile below 768px

- Keep the existing horizontally scrollable compact selector.
- Use four tabs in this order: AP Prep, 1-on-1, SAT Prep, Competition.
- AP Prep is selected by default.
- Continue showing one active program panel at a time.
- Preserve touch targets, horizontal snap behavior, selected-state contrast, keyboard semantics, advisor clearance, and the current section spacing.
- Use the full category title inside the active panel even when the compact tab label is shortened to `1-on-1` or `Competition`.

### Tablet and Desktop at 768px and above

- Keep the existing program selector and large preview-stage composition.
- Replace the six choices with four category choices in the approved order.
- Preserve the sticky stage, active-item treatment, section width, spacing, background, rounded surfaces, and current premium visual density.
- The reduction to four choices should create more breathing room; do not enlarge the selector or introduce oversized cards to fill the space.

## Interaction and State

- Use one canonical four-item data model for titles, coverage lines, descriptions, color identities, CTAs, proof text, and previews.
- `setActiveProgram(index, trigger)` must accept only indices `0` through `3` through the rendered controls.
- Mobile arrow-key navigation must wrap across four tabs and maintain correct `aria-selected`, `tabindex`, and `aria-controls` values.
- Desktop selection must update the title, copy, proof, CTA, color treatment, and preview as one synchronized state.
- Preserve the existing transition timing, active-state motion, sticky behavior, and reduced-motion handling.
- Do not add nested subject selectors, secondary carousels, or additional category levels.

## Content and Conversion Rules

- AP Prep is the only category that mentions AP-specific tutoring.
- General 1-on-1 Tutoring covers high-school and university coursework without duplicating the AP pathway.
- SAT Prep must not imply that full SAT coverage already exists; the current focus is SAT Math.
- Competition Prep should communicate breadth without turning the selector label into a long exam list.
- CTA destinations remain placeholders until the final program URLs are supplied. Existing placeholder behavior may be retained, but each visible CTA must use the approved category-specific label.

## Visual Continuity

- Preserve the section heading, introductory copy, light/dark surfaces, typography, borders, shadows, radii, and overall composition.
- Reuse existing preview assets and UI motifs wherever they still fit the new category.
- Remove obsolete six-program labels, descriptions, previews, proof statements, and controls rather than hiding them.
- Do not modify other page sections.

## Accessibility

- Preserve the tablist/tab/panel relationship on mobile.
- Every visible selector must have a unique accessible name and correctly identify the active category.
- Arrow-key navigation, click activation, and focus visibility must work for all four categories.
- Content changes must remain available without relying on color alone.

## Verification

- Add test-first contracts that fail while six categories remain and pass only when exactly four approved categories are rendered.
- Verify the canonical data, mobile tabs, desktop selector items, titles, coverage copy, CTA labels, and previews use the same four-category order.
- Confirm removed labels such as `AP STEM Bootcamps`, `Mastery Engines`, `1-on-1 AP Mentorship`, `University Tutoring`, and `Olympiad & Contests` no longer appear as selector categories.
- Run the full static test suite and `git diff --check`.
- Inspect light and dark mode at 390px, 768px, and 1440px.
- Exercise all four categories by click and mobile keyboard navigation.
- Confirm no horizontal page overflow, sticky-stage regression, console error, or advisor overlap.

