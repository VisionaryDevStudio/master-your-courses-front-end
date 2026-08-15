# Mentor Authority Profile Modal Design

**Date:** 2026-08-14  
**Status:** Approved direction; pending implementation  
**Scope:** The `Meet The Mentors` profile modal only

## Goal

Replace the current résumé-like profile popup with a premium editorial authority profile. The redesign should borrow the strongest hierarchy from the AP Biology webinar mentor presentation while remaining compact, theme-aware, responsive, and consistent with the MasterYourCourses landing page.

## Design Direction

The modal becomes a two-part editorial profile rather than a sidebar beside a repeated list of identical accolade cards.

- The mentor portrait is a substantial rectangular editorial image, not a small circular avatar.
- The identity block includes the mentor's name, role, and a restrained set of authority badges.
- The biography reads as a concise introduction with a comfortable line length.
- Credentials live in one visually unified `Selected Credentials` panel.
- Credential rows use meaning-specific icons rather than repeating a trophy.
- The consultation action is integrated into the lower information hierarchy.
- Light mode uses a warm white profile surface with a deep navy credential panel.
- Dark mode uses a deep navy profile surface with a subtly elevated credential panel.

## Desktop Layout

At 1024px and wider, use a 42/58 two-column composition.

### Portrait column

- Use a 4:5 portrait frame with rounded corners and a restrained indigo offset layer inspired by the webinar page.
- Preserve the full face and upper torso using the supplied portrait crop.
- Position the name, role, and authority badges beneath or immediately beside the portrait without creating a large empty lower column.
- Add a small `Meet your mentor` eyebrow to clarify the profile context.

### Content column

- Lead with `About the mentor` and the biography.
- Place the credentials panel immediately below the biography.
- Keep the consultation CTA aligned with the panel footer rather than detached at the bottom of a tall container.
- Limit the modal to `min(1080px, calc(100vw - 48px))` and `90vh`; overflow remains internal when necessary.

## Mobile and Tablet Layout

Below 768px, use a compact stacked profile.

- Portrait becomes a 3:2 editorial banner with the face positioned safely.
- Identity content overlaps the lower portrait edge through a small surface card, reducing vertical length.
- Authority badges become a horizontally scrollable or wrapping row without clipped text.
- Biography remains visible before credentials.
- Credential panel uses compact rows and retains meaning-specific icons.
- CTA is full width and appears after the credential panel.
- Close control remains 44px, inset from the safe edge, and visually neutral.

At 768–1023px, retain the stacked hierarchy but allow the portrait and identity block to share a compact horizontal header when space permits. Do not recreate the former narrow empty sidebar.

## Credential Model

Each credential is represented by structured data:

```js
{
  type: "award" | "education" | "exam" | "experience" | "research" | "mentorship",
  title: "Primary credential",
  detail: "Optional institution or context",
  featured: true | false
}
```

The first credential is featured. Supporting credentials use quieter rows. Icons are simple inline SVGs and must differ by credential type.

### Zoey

1. Award — `2025–26 National Virtual Teacher of the Year` — featured
2. Education — `Master’s Degree, Johns Hopkins University` / `4.0 GPA`
3. Experience — `AP Biology Teacher Since 2017`
4. Exam — `Scored a 5 on the AP Biology Exam`

Her teacher mentorship and school-level Teacher of the Year experience move into the biography rather than creating additional rows.

### Dr. Hossein Piri

1. Award — `40 Under 40` / `2026` — featured
2. Research — `Dean’s Research Scholar` / `University of Calgary`
3. Award — `Killam Teaching Award` / `University of British Columbia`
4. Research — `Collaborative Researcher` / `Harvard Business School`

### Dr. Sherri Sadr

1. Education — `Doctor of Dental Medicine` / `UBC Faculty of Dentistry` — featured
2. Mentorship — `Research Experience (REX) Mentor` / `University of British Columbia`
3. Mentorship — `VICE Mentor` / `AMS of UBC`
4. Experience — `Healthcare Service` / `Vancouver Coastal Health`

## Visual Hierarchy

- One featured credential receives a slightly stronger surface and accent edge.
- Supporting credentials are separated by fine rules inside the shared panel, not independent rounded boxes.
- Icons use a restrained semantic palette: indigo for education, amber for awards, emerald for exams/achievement, cyan for research, violet for mentorship, and slate-blue for professional experience.
- Avoid emojis, repeated trophy symbols, glowing borders, strong gradients, or excessive glassmorphism.
- Preserve the landing page's Outfit display typography and Inter body typography.

## Motion

- Modal backdrop fades in over 240ms.
- Modal surface enters over 300ms with opacity plus a maximum 10px upward movement and subtle `0.985` scale.
- Portrait, identity, biography, and credentials may use a restrained 35–45ms internal stagger after the surface appears.
- Credential rows do not animate independently on hover; only the featured row may receive a quiet border or surface change.
- Closing remains faster at 200ms.
- Under `prefers-reduced-motion: reduce`, all modal and internal transitions resolve immediately with no translation or scale.

## Interaction and Accessibility

- Preserve `role="dialog"`, `aria-modal="true"`, labelled name, described biography, focus trap, Escape close, backdrop close, and focus restoration.
- Close control remains at least 44×44px.
- The consultation link remains `Book a Consultation` with `href="#"` until the real booking URL is supplied.
- Every icon is decorative and `aria-hidden="true"`; the complete credential meaning remains in text.
- Text and interactive elements must meet WCAG AA contrast in both themes.

## Testing and Acceptance Criteria

- Light mode displays a light editorial profile; dark mode displays a dark editorial profile.
- No repeated trophy icon appears across all credentials.
- Every mentor renders the correct ordered credential types and copy.
- Desktop has no large unused lower portrait column.
- Mobile shows portrait, identity, biography, credentials, and CTA without horizontal overflow.
- Modal open/close paths, focus trap, focus restoration, and carousel behavior remain functional.
- Normal motion uses the approved entrance and 200ms close; reduced motion computes zero-duration transitions.
- Verify at 390×844, 768×1024, and 1440×900 in light and dark modes.

## Out of Scope

- Replacing or regenerating mentor portrait files.
- Changing the three mentor cards behind the popup.
- Connecting the consultation CTA to a production booking service.
- Adding new mentor claims beyond the approved site and AP Biology webinar reference content.
