# Track Record Story Player Refinement

**Date:** 2026-08-16  
**Status:** Approved direction pending written-spec review  
**Surface:** `The Track Record` section in `index.html`

## Objective

Refine the existing cinematic testimonial gallery so it feels deliberate and premium on desktop and mobile while preserving its current section composition, testimonial content, dark visual identity, and manual browsing model.

## Scope

Implement the following approved improvements:

1. Replace the initially live YouTube iframe with a poster-first video surface and explicit play action.
2. Crossfade the video surface and story copy together when the selected testimonial changes.
3. Add genuine horizontal swipe navigation on mobile while retaining the previous and next buttons.
4. Add a compact current-position indicator, formatted as `1 / 9`.
5. Add accessible labels and selected-state semantics to story controls.
6. Update the video title whenever the selected testimonial changes.
7. Tighten mobile quote typography and spacing without truncating testimonial content.

The `View All Testimonials` link remains unchanged. Its destination will be implemented with the future testimonials page.

## Visual Design

### Poster-first video surface

- The media frame keeps its current aspect ratio, radius, dark surround, and position.
- Before playback, it displays the selected testimonial's YouTube thumbnail as a full-bleed image.
- A centered circular play button and restrained dark gradient make the action obvious while preserving thumbnail legibility.
- The selected student's name and result remain in the story-copy area; the poster does not duplicate large text overlays.
- Selecting another story returns the media frame to that story's poster instead of immediately loading an iframe.
- Activating play replaces the poster with the selected YouTube embed and gives the iframe a title containing the selected student's name.

### Story transitions

- The media surface, student name, result, and quote transition as one story unit.
- Normal motion uses a restrained opacity transition of approximately 220ms with no large translation or scale effect.
- The content update occurs between fade-out and fade-in so old and new story details never appear mixed.
- Reduced motion performs the update immediately with no animation delay.

### Mobile density

- Preserve the full testimonial quote; do not clamp or add a disclosure interaction.
- Reduce excess vertical gaps around the label, identity, quote, and navigation bar.
- Use a slightly smaller mobile quote size and controlled line height while maintaining comfortable reading contrast.
- The media frame remains large enough to be recognizable and tappable without dominating the full viewport.

## Interaction Design

### Arrows and counter

- Previous and next buttons remain manual and wrap from the first story to the last and vice versa.
- The control bar shows the current story position as `current / total` and updates after every arrow, swipe, or desktop selector action.
- Icon-only buttons receive explicit accessible labels: `Previous testimonial` and `Next testimonial`.

### Genuine mobile swipe

- Swipe is enabled only on the featured story surface below the desktop selector breakpoint.
- A horizontal gesture must travel at least 50px and be more horizontal than vertical before it changes the story.
- Swiping left advances; swiping right goes back.
- Vertical page scrolling must remain natural. Ambiguous or primarily vertical gestures do nothing.
- Each gesture changes at most one story.
- Swipe does not trigger while the gesture begins inside the active YouTube iframe.
- Arrow buttons remain present for discoverability, accessibility, and non-touch input.

### Desktop selector

- Existing desktop story rows remain visually and structurally in place.
- The active row receives `aria-pressed="true"`; inactive rows receive `aria-pressed="false"`.
- Selecting a row updates the poster, story copy, counter, active styling, and accessible state through one shared controller.

## Accessibility

- Poster play control accessible name: `Play testimonial from {student}`.
- YouTube iframe title: `Testimonial from {student}` and refreshed for every selection.
- Previous/next buttons have accessible labels and remain at least 44px square.
- The position indicator uses readable text rather than color alone.
- The current desktop selector exposes programmatic selected state.
- Story changes do not automatically move keyboard focus.
- Reduced-motion preference removes crossfade timing and other newly introduced animation.
- Touch behavior must not prevent normal vertical page scrolling or browser navigation gestures.

## Data and Controller

- Keep `VIDEOS_DATA` as the single source for student, result, YouTube ID, and quote.
- Derive the poster URL from each YouTube ID rather than adding separate duplicated data.
- Centralize story selection so arrows, swipe, and desktop rows call the same bounded/wrapping update function.
- Separate selection from playback: selecting a story shows its poster; playing a story mounts its iframe.
- Do not autoplay videos when a story is selected or swiped.

## Failure Handling

- If a thumbnail fails to load, retain a dark media surface with the play control and accessible label.
- If the YouTube iframe cannot load, the surrounding story identity and quote remain visible and usable.
- Invalid story indexes must be normalized to the valid wraparound range.

## Testing and Verification

### Automated contracts

- Poster-first markup exists and the initial iframe is not mounted.
- Play mounts the selected YouTube ID and sets the correct iframe title.
- All selection paths update identity, result, quote, counter, poster, and selected semantics.
- Swipe threshold rejects short and vertical gestures and accepts valid horizontal gestures.
- Previous/next wrap at both ends.
- Reduced motion removes transition delay.
- `View All Testimonials` remains unchanged.

### Rendered QA

- Inspect 390px, 768px, and 1440px in light and dark themes.
- Verify poster, play state, arrow navigation, desktop row selection, mobile swipe, counter updates, and wraparound.
- Verify reduced motion at mobile and desktop sizes.
- Verify no horizontal overflow, clipped controls, scroll trapping, page errors, or section overlap.
- Confirm normal vertical scrolling still works when a touch starts on the mobile story surface.

## Out of Scope

- Building or linking the future testimonials page.
- Changing testimonial claims, names, schools, quotes, or YouTube IDs.
- Autoplay, automatic story rotation, video analytics, captions management, or custom video hosting.
- Redesigning adjacent testimonial marquee, mentor, final CTA, or footer sections.
