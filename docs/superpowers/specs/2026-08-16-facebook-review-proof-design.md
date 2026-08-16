# Facebook Review Proof Section Design

**Date:** 2026-08-16
**Status:** Approved refinement, awaiting implementation-plan approval

## Objective

Add a compact, premium Facebook-backed review section to the homepage without repeating the visual language or continuous motion of the existing testimonial marquee and Track Record player.

## Placement and Hierarchy

- Place the section after `#track-record-section` and immediately before `#closing-cta`.
- Use the light-mode editorial surface between the cool Track Record canvas and dark closing CTA.
- Heading: `Trusted by students and families`.
- Supporting copy: `Public feedback from families and students who learned with MasterYourCourses.`
- Remove the visible `Facebook review excerpts` source badge and `Verified Family Feedback` eyebrow. They compete with the primary heading and repeat the same trust message.
- Preserve `Facebook review excerpts` only in semantic and accessible labels where it clarifies the source.
- Do not show an aggregate score, review count, or `View all` link until those values and the public destination are supplied.

## Review Content

Use four homepage excerpts transcribed from the supplied review images. Label them as excerpts rather than implying that every card contains the entire public post.

### Mauli Shah

- Date: `June 6, 2023`
- Tags: `AP Physics`, `Parent Review`
- Excerpt: `I have enrolled my 11th grader for AP physics. I am very happy with the outcome. Masoud is a very soft spoken, dedicated and hardworking teacher. He works very closely with students and keeps them on track with learning.`
- Context: `Parent of 11th Grader · AP Physics Student`

### Shivam Maji

- Date: `May 16, 2023`
- Tags: `AP Chemistry`, `AP Calculus BC`, `Grade Boost`
- Excerpt: `Enrolling in Master Your Courses' Grade Boost Program for AP Chemistry and AP Calculus BC was a game-changer for me. I experienced a remarkable improvement in my grades, going from a C to an A in AP Calculus BC and from a B to an A in AP Chemistry.`
- Context: `Student · Grade Improvement: C→A, B→A`

### Velma Burke

- Date: `January 20, 2023`
- Tags: `Math`, `Self Empowerment`
- Excerpt: `You guys have an AMAZING skill set as TEACHERS!! Your teaching methods for math makes understanding and solving math easy! I was never very good in math because I didn't understand it and thought I couldn't!`
- Context: `Adult Learner · Four Months Progress`

### Farhana Hanip

- Date: `December 7, 2022`
- Tags: `Math`, `Chemistry`, `10th Grade`
- Excerpt: `My 10th grader was struggling with Math & Chemistry. I found MasterYourCourses. They've wonderful online platform, all tutors are knowledgeable & experienced. We'll definitely plan to keep working.`
- Context: `Parent of 10th Grader · Math & Chemistry`

The review content must live in one guarded JavaScript data array so names, images, excerpts, dates, tags, contexts, and future Facebook URLs can be replaced without editing carousel logic.

## Avatar Placeholders

- Add one local neutral avatar placeholder asset rather than loading a remote stock image.
- Render the placeholder inside a circular, softly tinted frame and layer each reviewer's initials over it.
- Treat the placeholder graphic as decorative; the adjacent reviewer name provides the accessible identity.
- Keep avatar replacement isolated to each review object's `avatar` field.

## Carousel and Responsive Layout

- Use one semantic review list and one set of controls.
- Desktop at 1024px and above: three review cards visible.
- Tablet from 768px to 1023px: two review cards visible.
- Mobile below 768px: one card plus a visible next-card edge.
- Use native horizontal overflow and `scroll-snap-type: x mandatory` for genuine touch swipe.
- Add accessible previous and next buttons and a visible position counter.
- Do not auto-advance.
- Disable the previous control at the first card and the next control at the final card.
- Keep review cards visually equal in height at each breakpoint.
- Present the strongest opening portion of longer excerpts within a calm three-to-five-line reading area.
- Add an accessible `Read more` / `Show less` disclosure only when an approved excerpt exceeds the compact area. Expansion reveals the full approved excerpt in place; it does not navigate away or imply that additional unprovided Facebook copy exists.

## Visual Language

- Borrow DAT Bootcamp's clear reading hierarchy, but retain the MasterYourCourses editorial identity and carousel behavior.
- Use a restrained warm-white card surface, subtle slate border, soft low-elevation shadow, and large but not oversized corner radius.
- Use Facebook blue only for a small card-level source detail and focused control accents.
- Use gold only for the five-star row.
- Reduce tag noise: retain no more than two concise subject or outcome tags per card, derived from the existing indigo, blue, emerald, and amber palette.
- Keep the reviewer identity and outcome/context line visually paired at the base of each card.
- Use placeholder initials rather than fabricated reviewer photography.
- Avoid large platform logos, screenshot frames, strong rotations, glass panels, gradient borders, and decorative square textures.

## Motion

- Reveal the section introduction and carousel once with the same restrained editorial easing used elsewhere: short vertical travel, opacity, and bounded stagger.
- Carousel navigation may use native smooth scrolling only when reduced motion is not requested.
- Under `prefers-reduced-motion: reduce`, show the section immediately and use instant carousel navigation.
- No continuous movement, autoplay, parallax, card rotation, or pulsing effects.

## Accessibility

- Give the carousel a descriptive region label.
- Use a semantic list for reviews and buttons for carousel controls.
- Keep every control at least 44 by 44 pixels.
- Add visible focus treatments consistent with the page.
- Announce the visible review position politely without announcing every scroll pixel.
- Keep stars decorative and provide one accessible `5 out of 5 stars` label per review.
- Preserve quote punctuation and identify the cards as Facebook review excerpts.
- Make each disclosure a real button with an accurate expanded state and a visible keyboard focus treatment.

## Verification

- Add structural tests for placement, the single visible heading hierarchy, exact four-review data, semantic list, no autoplay, controls, counter, local placeholder asset, and conditional disclosures.
- Add controller tests for previous/next boundaries, position synchronization, responsive visible-card counts, and reduced-motion navigation.
- Render and inspect light and dark modes at 390px, 768px, and 1440px.
- Verify genuine touch-style horizontal scrolling on mobile, keyboard controls, focus visibility, and no horizontal page overflow.
- Confirm the advisor trigger does not obscure carousel controls or review content.
- Run the full structural suite and verify the served page returns HTTP 200.
