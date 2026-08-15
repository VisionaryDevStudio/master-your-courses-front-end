# Mentor Dual-Image System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give each mentor independent image sources for the main-page card and authority-profile modal without changing either component's layout, motion, content, or interaction behavior.

**Architecture:** Extend `MENTORS_DATA` with explicit `cardImage`, `profileImage`, and role-specific object-position values. Hydrate the existing static card images from that model after the DOM is available, and bind the modal only to `profileImage`; until the six final exports are supplied, both roles intentionally reference the mentor's current known-good asset so the live page remains error-free.

**Tech Stack:** Static HTML, custom CSS, vanilla JavaScript, Node test runner, local Chrome/CDP responsive QA.

## Global Constraints

- Source of truth is `html-version/index.html` in the nested Git repository.
- Preserve mentor order: Zoey, Dr. Hossein Piri, Dr. Sherri Sadr.
- Preserve the current mentor cards, modal layout, content, credentials, carousel, accessibility, motion, and responsive frame dimensions.
- Main-page cards retain a 4:3 frame; modal desktop/tablet retains 4:5; modal mobile retains 3:2.
- Do not generate, retouch, copy, rename, overwrite, or commit portrait assets during this implementation.
- Until preferred exports exist, use the current known-good portrait for both explicit roles; do not request missing files and do not create broken-image fallbacks through failed network requests.
- Final preferred filenames remain `zoey-card.webp` / `zoey-profile.webp`, `piri-card.webp` / `piri-profile.webp`, and `sherri-card.webp` / `sherri-profile.webp`.
- Preserve mentor-specific alt text and appropriate lazy-loading/decoding behavior.

---

### Task 1: Independent Card and Profile Portrait Sources

**Files:**
- Modify: `index.html:40-175`
- Modify: `index.html:454-470`
- Modify: `index.html:2032-2110`
- Modify: `tests/light-mode-section-surfaces.test.mjs:880-955`

**Interfaces:**
- Consumes: existing `MENTORS_DATA[index]`, mentor card elements with `data-mentor-index`, and `#mentor-modal-avatar`.
- Produces: `mentor.cardImage: string`, `mentor.profileImage: string`, `mentor.cardObjectPosition: string`, `mentor.profileObjectPosition: string`, and `hydrateMentorCardImages(): void`.

- [ ] **Step 1: Write the failing role-separation tests**

Add a focused test that protects the data contract, card hydration, modal binding, and unchanged frame ratios:

```js
test("uses independent mentor images for cards and profiles", () => {
  assert.match(mentorModalLogicSource, /cardImage:\s*["']/);
  assert.match(mentorModalLogicSource, /profileImage:\s*["']/);
  assert.match(mentorModalLogicSource, /cardObjectPosition:\s*["']/);
  assert.match(mentorModalLogicSource, /profileObjectPosition:\s*["']/);
  assert.match(mentorModalLogicSource, /function hydrateMentorCardImages\(\)/);
  assert.match(mentorModalLogicSource, /mentor-modal-avatar['"]\)\.src\s*=\s*mentor\.profileImage/);
  assert.doesNotMatch(mentorModalLogicSource, /mentor\.avatar/);

  assert.match(html, /\.mentor-portrait-wrap\s*\{[\s\S]*?aspect-ratio:\s*4\s*\/\s*3/);
  assert.match(html, /\.mentor-profile-portrait-frame\s*\{[\s\S]*?aspect-ratio:\s*4\s*\/\s*5/);
  assert.match(html, /@media \(max-width:\s*767px\)[\s\S]*?\.mentor-profile-portrait-frame\s*\{[\s\S]*?aspect-ratio:\s*3\s*\/\s*2/);
});
```

Extend the existing VM harness with a functional image element and assert that `openMentorModal(index)` assigns the approved `profileImage`, not the corresponding card source.

- [ ] **Step 2: Run the focused test and verify RED**

Run:

```bash
node --test --test-name-pattern="independent mentor images" tests/light-mode-section-surfaces.test.mjs
```

Expected: FAIL because the model still exposes only `avatar` and the card hydrator does not exist.

- [ ] **Step 3: Implement the dual-role data contract**

Replace every mentor's `avatar` with explicit role fields. Use current assets for both roles until final exports arrive:

```js
{
  name: "Zoey",
  cardImage: "mentors/zoey.png",
  profileImage: "mentors/zoey.png",
  cardObjectPosition: "center center",
  profileObjectPosition: "center 10%",
  // existing role, bio, and credentials remain unchanged
}
```

Use equivalent current paths for Piri (`mentors/Dr.piri.jpg`) and Sherri (`mentors/sherri.png`). Add an adjacent comment listing the six preferred WebP filenames so swapping assets later requires changing only these fields.

- [ ] **Step 4: Bind card and modal images to their roles**

Add one small card hydrator:

```js
function hydrateMentorCardImages() {
  document.querySelectorAll('.mentor-card[data-mentor-index]').forEach(card => {
    const mentor = MENTORS_DATA[Number(card.dataset.mentorIndex)];
    const image = card.querySelector('.mentor-portrait');
    if (!mentor || !image) return;
    image.src = mentor.cardImage;
    image.alt = `Portrait of ${mentor.name}`;
    image.style.objectPosition = mentor.cardObjectPosition;
  });
}
```

Call it from the existing `DOMContentLoaded` initialization path. In `openMentorModal()` assign:

```js
const modalImage = document.getElementById('mentor-modal-avatar');
modalImage.src = mentor.profileImage;
modalImage.alt = `Portrait of ${mentor.name}`;
modalImage.style.objectPosition = mentor.profileObjectPosition;
```

Keep the static card `src` values as valid known-good initial sources so images remain available before hydration and when JavaScript is unavailable.

- [ ] **Step 5: Verify GREEN and existing behavior**

Run:

```bash
node --test --test-name-pattern="independent mentor images" tests/light-mode-section-surfaces.test.mjs
node --test tests/light-mode-section-surfaces.test.mjs
git diff --check
```

Expected: focused and full suites pass with zero failures and the diff check is clean.

- [ ] **Step 6: Run responsive rendered QA**

First check for the callable in-app Browser runtime. If unavailable, record the reason and use local Chrome/CDP fallback.

Inspect Zoey, Piri, and Sherri at 390x844, 768x1024, and 1440x900 in light and dark mode. Verify:

- Main card loads `cardImage`; open modal loads `profileImage`.
- Card remains 4:3; modal remains 3:2 on mobile and 4:5 at tablet/desktop.
- No broken image requests, layout shift, head/shoulder clipping beyond the limitations of the temporary source, horizontal overflow, or page errors.
- Carousel, modal open/close, focus trap, Escape/backdrop/close restoration, theme, and reduced-motion behavior remain unchanged.

Record the temporary-source limitation explicitly: visual card/profile differentiation begins when the six final exports replace the current paths.

- [ ] **Step 7: Commit**

```bash
git add index.html tests/light-mode-section-surfaces.test.mjs
git commit -m "feat: separate mentor card and profile images"
```
