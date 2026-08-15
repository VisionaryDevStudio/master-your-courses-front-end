# Mentor Dual-Image System Design

## Goal

Give every mentor a dedicated image for the main-page card and a separate image for the profile modal. This prevents one source image from being forced into incompatible wide and tall crops.

## Scope

- Preserve the existing mentor cards, modal layout, content, order, accessibility, motion, and responsive dimensions.
- Change only the portrait-source model, image bindings, framing rules required for predictable crops, fallback behavior, and regression coverage.
- Do not generate, retouch, or overwrite portrait assets during the code implementation.

## Image Roles

Each mentor receives two explicit sources:

- `cardImage`: a 4:3 landscape portrait used only by the three main-page mentor cards.
- `profileImage`: a 4:5 portrait used by the profile modal on desktop and tablet and inside the existing 3:2 mobile banner frame.

The modal may crop the profile image responsively through `object-fit: cover`, but it must never reuse the card source once a profile source is available.

## File Contract

Preferred production filenames:

| Mentor | Main card | Profile modal |
|---|---|---|
| Zoey | `mentors/zoey-card.webp` | `mentors/zoey-profile.webp` |
| Dr. Hossein Piri | `mentors/piri-card.webp` | `mentors/piri-profile.webp` |
| Dr. Sherri Sadr | `mentors/sherri-card.webp` | `mentors/sherri-profile.webp` |

Until a preferred export exists, each role may point to that mentor's current portrait asset. This provides an intentional, non-broken placeholder while keeping the two source fields independent in code.

## Export Specifications

### Card image

- Canvas: 1200 x 900 pixels (4:3).
- Subject: centered horizontally, eyes approximately 35-40% from the top.
- Framing: full head, shoulders, and upper torso visible.
- Safe area: keep the head and shoulders inside the central 80% width and central 82% height.
- Background: clean, quiet, and edge-to-edge; no borders, text, badges, or baked-in corner radius.
- Format: WebP, sRGB, visually high quality, target 140-250 KB.

### Profile image

- Canvas: 1200 x 1500 pixels (4:5).
- Subject: centered horizontally, eyes approximately 30-35% from the top.
- Framing: full head, shoulders, and torso to at least mid-chest.
- Mobile-safe region: all essential facial and shoulder content must remain inside the central 60% of the image height so the existing 3:2 mobile banner crop remains usable.
- Background: clean, quiet, and edge-to-edge; no borders, text, badges, or baked-in corner radius.
- Format: WebP, sRGB, visually high quality, target 180-320 KB.

## Data and Rendering

The mentor data model exposes `cardImage` and `profileImage` alongside the existing name, role, biography, and credentials.

- Static card markup binds to the matching card source.
- `openMentorModal()` binds the modal image to `profileImage`.
- Existing alt text remains mentor-specific and meaningful.
- Image decode/loading attributes remain appropriate to their context.
- A missing preferred export must fall back to the mentor's current known-good portrait source rather than render a broken image.

## Responsive Framing

- Main-page cards retain their current 4:3 media region.
- Modal desktop/tablet retains the current 4:5 portrait frame.
- Modal mobile retains the current 3:2 banner frame.
- Per-mentor `object-position` may be defined separately for card and profile roles if a supplied portrait needs minor optical adjustment; it must not change the shared frame dimensions.

## Verification

- Regression tests confirm every mentor has two explicit image roles and that card and modal rendering use the correct role.
- Test the temporary fallback behavior without requiring all six final exports to exist.
- Inspect Zoey, Piri, and Sherri at 390 x 844, 768 x 1024, and 1440 x 900 in light and dark mode.
- Confirm no broken images, head/shoulder clipping, layout shifts, horizontal overflow, or regressions to carousel/modal interactions.

## Out of Scope

- Changing mentor copy, credentials, order, cards, modal dimensions, or animation timing.
- AI-generating or editing the final mentor photographs.
- Adding a third mobile-specific source.
