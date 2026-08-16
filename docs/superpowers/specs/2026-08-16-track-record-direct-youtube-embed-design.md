# Track Record Direct YouTube Embed Design

## Goal

Remove the redundant custom poster interaction from **The Track Record** so each selected testimonial exposes the native YouTube player immediately. A visitor should need only one click on YouTube's own play control to begin playback.

## Approved behavior

- Render the selected testimonial as a YouTube iframe on initial page load.
- When a visitor selects, swipes to, or arrows to another story, replace the iframe with that story's embed after the existing transition.
- Do not autoplay when the page loads or when the selected story changes.
- Keep the iframe title synchronized as `Testimonial from <student>`.
- Keep the existing YouTube permissions and fullscreen support.

## Removed behavior

- Remove the custom poster button, thumbnail image, shade overlay, and branded play icon.
- Remove poster-only JavaScript and CSS that no longer has a consumer.
- Remove the separate `playActiveVideo` step from the story controller.

## Preserved behavior

- The nine-story data set and story copy remain unchanged.
- Desktop story-selector rows, `aria-pressed` state, and wrapping remain unchanged.
- Mobile arrows, visible position counter, genuine swipe threshold, vertical-gesture rejection, and one-story-per-gesture behavior remain unchanged.
- A touch beginning inside the iframe remains excluded from story swiping so native YouTube controls work normally.
- The coordinated 220ms media-and-copy fade remains unchanged for normal motion; reduced motion remains immediate.
- The existing **View All Testimonials** control remains unchanged.

## Testing and acceptance

- A failing regression test must first prove the current poster-first contract is still present.
- Static coverage must require an initial iframe and reject the custom poster hooks.
- Controller coverage must prove initial embed identity and story-change iframe replacement, title, and source.
- Existing navigation, swipe, transition, reduced-motion, and responsive tests must continue to pass.
- Rendered QA must cover mobile and desktop, confirming that the native YouTube player is visible immediately without autoplay and that no layout or horizontal-overflow regression appears.

## Scope

This is a focused interaction simplification. It does not redesign the Track Record layout, alter testimonial content, add external pages, or change other sections.
