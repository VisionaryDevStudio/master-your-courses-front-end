# Meet The Mentors Editorial Hybrid Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the current mentor cards with a premium three-profile editorial layout for Zoey, Dr. Sherri Sadr, and Dr. Hossein Piri, plus a manual mobile snap carousel.

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

---

### Task 1: Canonical Mentor Roster and Zoey Profile

**Files:**
- Modify: `tests/light-mode-section-surfaces.test.mjs:216-260,604-650`
- Modify: `index.html:40-74,1479-1595`

**Interfaces:**
- Consumes: existing `MENTORS_DATA`, `openMentorModal(index, trigger)`, and `handleMentorCardKeydown(event, index, trigger)`.
- Produces: three ordered mentor records and three matching card roots with `data-mentor-index="0|1|2"`.

- [ ] **Step 1: Write the failing roster and content tests**

Replace `expectedMentors` with the ordered Zoey/Sherri/Piri records. Assert Zoey’s exact role, `mentors/zoey.png`, supplied biography, and all six supplied accolades. Add assertions that the mentor section and `MENTORS_DATA` contain no `Elena` or `elena zhou`.

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

Add scoped classes to the existing section. At `max-width: 767px`, make the track horizontally scrollable with `scroll-snap-type: x mandatory`, cards approximately `calc(100% - 2.75rem)` wide, and a gap that leaves the next card edge visible. At `min-width: 768px`, restore a three-column grid and hide mobile controls. Use a compact `4:3` portrait aspect ratio, `object-fit: cover`, concise body copy, two credential rows, restrained border/elevation, and no portrait rotation.

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
