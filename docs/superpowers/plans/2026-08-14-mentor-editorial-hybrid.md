# Meet The Mentors Editorial Hybrid Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Present Zoey, Dr. Hossein Piri, and Dr. Sherri Sadr in a premium editorial layout with a manual mobile snap carousel and complete, naturally proportioned portraits inside the existing compact frames.

**Architecture:** Keep the static single-file architecture in `index.html`: canonical mentor data drives the existing modal, semantic card markup presents concise summaries, CSS controls responsive layout and motion, and a small controller synchronizes the mobile carousel controls and pagination. Extend the existing Node static/VM test suite with contract and behavior coverage before implementation.

**Tech Stack:** HTML5, Tailwind CDN utilities, scoped CSS, vanilla JavaScript, Node.js `node:test`, local HTTP preview, Playwright/Chrome responsive QA.

## Global Constraints

- Final display order is Zoey, Dr. Hossein Piri, Dr. Sherri Sadr.
- Remove Elena from cards, canonical data, accessibility labels, modal content, and tests.
- Use `mentors/zoey.png`, `mentors/Dr.piri.jpg`, and `mentors/sherri.png`; do not modify or delete user-owned image files.
- Desktop shows three editorial cards; mobile uses a manual snap carousel with controls, pagination, and no auto-advance.
- Preserve the warm mentor surface, dark mode, modal focus behavior, section spacing, and neighboring sections.
- Reduced motion removes reveal displacement, stagger, smooth scrolling, and hover translation.
- Verify 390px, 768px, and 1440px in light and dark modes without overflow or floating-consultation overlap.
- Keep the existing `4:3` portrait frames and card geometry unchanged while showing each mentor's uncropped head and meaningful shirt/shoulder context.
- Use a contained foreground portrait over a quiet, low-contrast blurred extension of the same source image; do not introduce plain letterbox bars or stretch either layer.

---

### Task 1: Canonical Mentor Roster and Zoey Profile

**Files:**
- Modify: `tests/light-mode-section-surfaces.test.mjs:216-260,604-650`
- Modify: `index.html:40-74,1479-1595`

**Interfaces:**
- Consumes: existing `MENTORS_DATA`, `openMentorModal(index, trigger)`, and `handleMentorCardKeydown(event, index, trigger)`.
- Produces: three ordered mentor records and three matching card roots with `data-mentor-index="0|1|2"`.

- [ ] **Step 1: Write the failing roster and content tests**

Replace `expectedMentors` with the ordered Zoey/Piri/Sherri records. Assert Zoey’s exact role, `mentors/zoey.png`, supplied biography, and all six supplied accolades. Add assertions that the mentor section and `MENTORS_DATA` contain no `Elena` or `elena zhou`.

```js
assert.deepEqual(extractMentorData(), expectedMentors);
assert.doesNotMatch(mentorsSection, /Elena|elena zhou/i);
assert.equal(expectedMentors[0].name, "Zoey");
assert.equal(expectedMentors[0].avatar, "mentors/zoey.png");
assert.equal(expectedMentors[0].accolades.length, 6);
```

- [ ] **Step 2: Run the focused test and confirm RED**

Run: `node --test --test-name-pattern="mentor|Zoey" tests/light-mode-section-surfaces.test.mjs`

Expected: FAIL because Elena remains in `MENTORS_DATA` and the second card.

- [ ] **Step 3: Replace the canonical data and visible card content**

Set the data order to Zoey, Piri, Sherri. Use the exact approved Zoey biography and six accolades from the specification. Reorder the existing Sherri and Piri data without changing their factual content. Update each card’s index, accessible name, portrait, name, role, concise summary, and two visible credentials. Zoey’s visible credentials are:

```html
<span>2025–26 National Virtual Teacher of the Year</span>
<span>Master’s, Johns Hopkins University — 4.0 GPA</span>
```

- [ ] **Step 4: Run the focused and full tests**

Run:

```bash
node --test --test-name-pattern="mentor|Zoey" tests/light-mode-section-surfaces.test.mjs
node --test tests/light-mode-section-surfaces.test.mjs
```

Expected: PASS with the new ordered roster and existing modal accessibility contracts intact.

- [ ] **Step 5: Commit the roster change**

```bash
git add index.html tests/light-mode-section-surfaces.test.mjs
git commit -m "feat: update mentor roster with Zoey"
```

---

### Task 2: Editorial Cards and Mobile Snap Carousel

**Files:**
- Modify: `tests/light-mode-section-surfaces.test.mjs`
- Modify: `index.html:300-820,1469-1598,2880-2960`

**Interfaces:**
- Consumes: ordered `[data-mentor-index]` card roots from Task 1.
- Produces: `.mentor-carousel`, `.mentor-track`, `.mentor-card`, `[data-mentor-prev]`, `[data-mentor-next]`, `[data-mentor-dot]`, and `initMentorCarousel()`.

- [ ] **Step 1: Write failing structure and behavior tests**

Add static assertions for horizontal mobile snapping, visible next-card spacing, three manual dots, two buttons, desktop three-column layout, and reduced-motion overrides. Extract `initMentorCarousel` into the existing VM harness pattern and assert:

```js
assert.equal(harness.activeIndex(), 0);
harness.clickNext();
assert.equal(harness.activeIndex(), 1);
harness.clickPrevious();
assert.equal(harness.activeIndex(), 0);
assert.equal(harness.autoAdvanceTimers(), 0);
```

Also assert controls have accessible labels and disabled state at the first/last mentor.

- [ ] **Step 2: Run the focused carousel test and confirm RED**

Run: `node --test --test-name-pattern="mentor carousel|editorial mentor" tests/light-mode-section-surfaces.test.mjs`

Expected: FAIL because the current section is a vertical mobile grid and has no carousel controller.

- [ ] **Step 3: Implement the responsive editorial structure**

Add scoped classes to the existing section. At `max-width: 767px`, make the track horizontally scrollable with `scroll-snap-type: x mandatory`, cards approximately `calc(100% - 2.75rem)` wide, and a gap that leaves the next card edge visible. At `min-width: 768px`, restore a three-column grid and hide mobile controls. Use a compact `4:3` portrait frame, concise body copy, two credential rows, restrained border/elevation, and no portrait rotation. Task 4 defines the final contained-foreground portrait treatment inside that frame.

```css
.mentor-card { scroll-snap-align: center; }
@media (max-width: 767px) {
  .mentor-track { display:flex; overflow-x:auto; scroll-snap-type:x mandatory; }
  .mentor-card { flex:0 0 calc(100% - 2.75rem); }
}
@media (min-width: 768px) {
  .mentor-track { display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); }
  .mentor-carousel-controls { display:none; }
}
```

- [ ] **Step 4: Implement manual carousel synchronization**

Create `initMentorCarousel()` that derives the active index from the nearest card after user scroll, scrolls via previous/next controls, updates `aria-current` on dots, and updates button disabled states. Use `behavior: 'auto'` when reduced motion is active and `'smooth'` otherwise. Do not create an interval or timeout for advancement.

```js
function setMentorIndex(nextIndex, shouldScroll = true) {
  mentorIndex = Math.max(0, Math.min(mentorCards.length - 1, nextIndex));
  if (shouldScroll) mentorCards[mentorIndex].scrollIntoView({
    behavior: mentorReducedMotion.matches ? 'auto' : 'smooth',
    block: 'nearest',
    inline: 'center'
  });
  syncMentorCarouselState();
}
```

- [ ] **Step 5: Add reveal and reduced-motion treatment**

Use one IntersectionObserver on the mentor section. Under `prefers-reduced-motion: no-preference`, add a small fade-and-rise stagger once; under `reduce`, force full opacity, no transform, no transition, and automatic scrolling. Restrict hover lift to `(hover: hover) and (pointer: fine)`.

- [ ] **Step 6: Run focused and full tests**

Run:

```bash
node --test --test-name-pattern="mentor carousel|editorial mentor" tests/light-mode-section-surfaces.test.mjs
node --test tests/light-mode-section-surfaces.test.mjs
git diff --check
```

Expected: PASS; no whitespace errors.

- [ ] **Step 7: Commit the responsive mentor experience**

```bash
git add index.html tests/light-mode-section-surfaces.test.mjs
git commit -m "feat: add editorial mentor carousel"
```

---

### Task 3: Rendered QA and Final Correction Gate

**Files:**
- Modify if a verified defect is found: `index.html`
- Modify if a regression contract is required: `tests/light-mode-section-surfaces.test.mjs`
- Create: `.superpowers/sdd/2026-08-14-mentor-editorial-hybrid/task-3-report.md`

**Interfaces:**
- Consumes: final mentor section, modal, and carousel from Tasks 1–2.
- Produces: responsive evidence and any minimal test-first correction.

- [ ] **Step 1: Start and verify the exact page preview**

Run:

```bash
python3 -m http.server 4173 --bind 127.0.0.1
curl -I http://127.0.0.1:4173/index.html
```

Expected: HTTP 200 for `index.html`.

- [ ] **Step 2: Inspect light and dark layouts at all target widths**

Capture and inspect 390×844, 768×1024, and 1440×900. Verify portrait crop, card height, copy wrapping, three-column preservation, mobile next-card preview, pagination, no root horizontal overflow, and no collision with the floating consultation trigger.

- [ ] **Step 3: Exercise all interaction paths**

At 390px, swipe/scroll the carousel and use previous, next, and pagination controls. Confirm state synchronization, first/last disabled states, no automatic movement, card Enter/Space activation, modal close button, Escape, backdrop close, and focus restoration. Repeat a representative modal path at 768px and 1440px.

- [ ] **Step 4: Verify reduced motion**

Emulate `prefers-reduced-motion: reduce`; confirm cards render immediately, carousel movement is not smooth, and hover/reveal transforms are absent.

- [ ] **Step 5: Fix any verified defect test-first**

For each defect, add one focused failing assertion, reproduce RED, apply the smallest correction, then rerun the focused test and rendered path. Do not change unrelated sections.

- [ ] **Step 6: Run the final gate and document evidence**

Run:

```bash
node --test tests/light-mode-section-surfaces.test.mjs
git diff --check
curl -I http://127.0.0.1:4173/index.html
```

Write the viewport/theme results, interaction results, screenshots inspected, remaining browser limitations, and exact command outcomes to the task report.

- [ ] **Step 7: Commit only a verified correction, if one was required**

```bash
git add index.html tests/light-mode-section-surfaces.test.mjs
git commit -m "fix: finalize mentor editorial experience"
```

If no correction was required, leave the report uncommitted and do not create an empty commit.

---

### Task 4: Full-Subject Portrait Treatment

**Files:**
- Modify: `tests/light-mode-section-surfaces.test.mjs`
- Modify: `index.html:424-433,951,1658-1728`
- Modify: `docs/superpowers/plans/2026-08-14-mentor-editorial-hybrid.md`

**Interfaces:**
- Consumes: the existing `.mentor-portrait-wrap`, `.mentor-portrait`, ordered mentor sources, and unchanged `4:3` frame geometry.
- Produces: `.mentor-portrait-backdrop` for the atmospheric layer and `.mentor-portrait-foreground` for the complete subject image, with `data-mentor-portrait="zoey|piri|sherri"` hooks for restrained per-person positioning.

- [x] **Step 1: Write the failing layered-portrait contract**

Extend the existing mentor test to require one backdrop and one foreground image per card, matching sources and mentor identifiers. Require the frame to remain `4 / 3`, the backdrop to use `object-fit: cover`, and the foreground to use `object-fit: contain`.

```js
for (const mentor of ["zoey", "piri", "sherri"]) {
  const frame = mentorCardFor(mentor);
  assert.match(frame, new RegExp(`data-mentor-portrait="${mentor}"`));
  assert.match(frame, /class="mentor-portrait-backdrop"/);
  assert.match(frame, /class="mentor-portrait mentor-portrait-foreground"/);
}
assert.match(css, /\.mentor-portrait-wrap\s*\{[^}]*aspect-ratio:\s*4\s*\/\s*3/s);
assert.match(css, /\.mentor-portrait-backdrop\s*\{[^}]*object-fit:\s*cover/s);
assert.match(css, /\.mentor-portrait-foreground\s*\{[^}]*object-fit:\s*contain/s);
```

- [x] **Step 2: Run the focused test and confirm RED**

Run:

```bash
node --test --test-name-pattern="mentor|editorial mentor" tests/light-mode-section-surfaces.test.mjs
```

Expected: FAIL because each card currently contains only one cover-cropped `.mentor-portrait` image.

- [x] **Step 3: Implement the two-layer portrait frame**

Move the stable aspect ratio to `.mentor-portrait-wrap`. Keep the wrapper dimensions and rounded clipping unchanged. Add an `aria-hidden="true"` duplicate source as the backdrop and retain the existing meaningful `alt` text only on the foreground image.

```html
<div class="mentor-portrait-wrap relative shrink-0" data-mentor-portrait="zoey">
  <img src="mentors/zoey.png" alt="" aria-hidden="true" class="mentor-portrait-backdrop">
  <img src="mentors/zoey.png" alt="Portrait of Zoey" loading="lazy" decoding="async" class="mentor-portrait mentor-portrait-foreground">
</div>
```

Use the same structure for Piri and Sherri with their existing sources and accessible names.

- [x] **Step 4: Add restrained shared styling and per-mentor tuning**

Keep the frame at `4 / 3`. Make both image layers fill the frame. Blur, enlarge, and soften the cover backdrop; contain the foreground at natural proportions above it. Use mentor-specific hooks only for small scale or vertical-position adjustments verified from screenshots.

```css
.mentor-portrait-wrap {
  position: relative;
  aspect-ratio: 4 / 3;
  overflow: hidden;
  background: color-mix(in srgb, var(--muted) 82%, white);
}
.mentor-portrait-backdrop,
.mentor-portrait-foreground {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}
.mentor-portrait-backdrop {
  object-fit: cover;
  filter: blur(18px) saturate(.72);
  opacity: .34;
  transform: scale(1.09);
}
.mentor-portrait-foreground {
  object-fit: contain;
  object-position: center bottom;
}
```

Do not add new animation. Ensure hover/reveal transforms remain on the card rather than either portrait layer.

- [x] **Step 5: Run the focused and full static gates**

Run:

```bash
node --test --test-name-pattern="mentor|editorial mentor" tests/light-mode-section-surfaces.test.mjs
node --test tests/light-mode-section-surfaces.test.mjs
git diff --check
```

Expected: PASS with exactly three layered portraits, correct source mapping, stable `4:3` geometry, and no whitespace errors.

- [x] **Step 6: Perform rendered responsive QA**

Using the exact local preview, capture and inspect 390×844, 768×1024, and 1440×900 in light and dark modes. Verify for every mentor:

- the full head remains visible with breathing room;
- meaningful shirt or shoulder context remains visible;
- the foreground is not stretched;
- the backdrop reads as ambient color rather than a duplicate face;
- card height, mobile next-card preview, section spacing, modal behavior, and root width remain unchanged.

If a mentor needs correction, adjust only that mentor's `object-position`, foreground inset, or maximum scale and repeat all three viewport captures.

- [x] **Step 7: Commit the verified portrait refinement**

```bash
git add index.html tests/light-mode-section-surfaces.test.mjs docs/superpowers/plans/2026-08-14-mentor-editorial-hybrid.md
git commit -m "fix: preserve full mentor portraits"
```

---

### Task 5: Native 4:3 Portrait Asset Contract

**Files:**
- Modify: `tests/light-mode-section-surfaces.test.mjs`
- Modify: `index.html`
- Modify: `docs/superpowers/specs/2026-08-14-mentor-editorial-hybrid-design.md`

**Interfaces:**
- Consumes: the unchanged `.mentor-portrait-wrap` 4:3 frame and existing mentor source paths.
- Produces: one accessible `.mentor-portrait` image per mentor, ready for direct replacement with native 1600×1200 assets.

- [x] Write a failing contract that rejects backdrop/foreground duplicates and requires one cover image per frame.
- [x] Run the focused test and confirm it fails against the temporary layered treatment.
- [x] Remove `.mentor-portrait-backdrop`, `.mentor-portrait-foreground`, duplicate decorative images, blur, contain, and mentor-specific positioning.
- [x] Preserve the wrapper aspect ratio, card dimensions, carousel, ordering, accessible alt text, and modal behavior.
- [x] Run the focused test, full suite, diff check, and responsive rendered checks at 390px, 768px, and 1440px.
- [x] Commit only the HTML, test, specification, and plan changes.
