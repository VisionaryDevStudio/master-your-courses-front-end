# Track Record Story Player Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn The Track Record gallery into a poster-first, accessible testimonial player with coordinated story transitions and genuine mobile swipe navigation.

**Architecture:** Keep the feature inside `index.html` and retain `VIDEOS_DATA` as its single content source. Replace direct iframe mutation with a controller that separates story selection from playback and routes desktop rows, arrows, and swipe through one update path. Add section-scoped CSS and focused static/VM tests.

**Tech Stack:** Static HTML, Tailwind CDN utilities, scoped CSS, vanilla JavaScript, Node test runner/VM, Playwright or Chrome rendered QA.

## Global Constraints

- Preserve the Track Record composition, dark identity, nine testimonials, ordering, claims, quotes, and YouTube IDs.
- Keep `View All Testimonials` and its current `href="#"` unchanged.
- Do not autoplay, automatically rotate, clamp, or truncate testimonials.
- Enable swipe only below `1024px`; a valid swipe is at least `50px` and more horizontal than vertical.
- Use opacity-only story transitions around `220ms`; reduced motion updates immediately.
- Preserve unrelated workspace changes and adjacent sections.

---

### Task 1: Poster-first controller, accessibility, and swipe

**Files:**
- Modify: `index.html:1230-1310`
- Modify: `index.html:2802-3032`
- Modify: `tests/light-mode-section-surfaces.test.mjs`

**Interfaces:**
- Consumes: `VIDEOS_DATA` and nine `.video-thumbnail-item` buttons.
- Produces: `normalizeVideoIndex(index)`, `posterUrlFor(video)`, `renderVideoPoster(video)`, `playActiveVideo()`, `commitActiveVideo(index)`, `setActiveVideo(index, options?)`, `nextVideo()`, and `prevVideo()`.
- DOM hooks: `#testimonial-media`, `#testimonial-story-surface`, `#testimonial-story-content`, `#testimonial-position`, `#main-video-student`, `#main-video-school`, and `#main-video-quote`.

- [ ] **Step 1: Write the failing poster-first structure test**

Add after the testimonial marquee tests:

```js
test("uses a poster-first accessible Track Record player", () => {
  const start = html.indexOf("Verified Impact & Video Testimonials");
  const end = html.indexOf("MENTORS_AND_RESULTS_INSERTED", start);
  const section = html.slice(start, end);
  assert.match(section, /id="testimonial-media"/);
  assert.match(section, /id="testimonial-story-surface"/);
  assert.match(section, /id="testimonial-position"[^>]*>\s*1\s*\/\s*9\s*</);
  assert.match(section, /aria-label="Previous testimonial"/);
  assert.match(section, /aria-label="Next testimonial"/);
  assert.doesNotMatch(section, /<iframe[^>]*id="main-video-iframe"/);
  assert.match(section, /Play testimonial from Shivam Maji/);
  assert.equal((section.match(/aria-pressed="(?:true|false)"/g) ?? []).length, 9);
  assert.match(section, /href="#"[\s\S]*View All Testimonials/);
});
```

Mutation proof: restoring the initial iframe or removing the counter, either arrow label, or pressed states must fail.

- [ ] **Step 2: Run the focused test and verify RED**

```bash
node --test --test-name-pattern="poster-first accessible Track Record player" tests/light-mode-section-surfaces.test.mjs
```

Expected: FAIL because the current gallery mounts the iframe immediately and lacks the new hooks and semantics.

- [ ] **Step 3: Add poster-first markup and accessible controls**

Replace the initial iframe with:

```html
<div id="testimonial-media" class="testimonial-media absolute inset-0">
  <button id="testimonial-play" type="button" class="testimonial-poster absolute inset-0 h-full w-full text-white" aria-label="Play testimonial from Shivam Maji" onclick="playActiveVideo()">
    <img id="testimonial-poster-image" src="https://i.ytimg.com/vi/OXvoto-nhnY/hqdefault.jpg" alt="" class="absolute inset-0 h-full w-full object-cover">
    <span class="testimonial-poster-shade absolute inset-0" aria-hidden="true"></span>
    <span class="testimonial-play-icon" aria-hidden="true"><!-- existing Lucide play icon --></span>
  </button>
</div>
```

Add `id="testimonial-story-surface"` to the story column and `id="testimonial-story-content"` to the copy wrapper. Add `#testimonial-position` with initial text `1 / 9`; label the arrow buttons `Previous testimonial` and `Next testimonial`; add `type="button"` and correct initial `aria-pressed` values to all nine desktop story buttons. Keep `View All Testimonials` byte-for-byte unchanged.

- [ ] **Step 4: Write the failing behavioral controller test**

Slice the Track Record script from `const VIDEOS_DATA` to its closing script and run it with `runInNewContext`. Build a minimal harness for element text/attributes, `replaceChildren`, selector collections, touch listeners, `window.innerWidth`, `matchMedia`, and deterministic timers. Assert real mutations:

```js
test("coordinates Track Record selection playback wrapping and swipe", () => {
  const harness = createTrackRecordHarness();
  harness.api.nextVideo();
  assert.equal(harness.text("main-video-student"), "Edrik");
  assert.equal(harness.text("testimonial-position"), "2 / 9");
  assert.equal(harness.pressed(1), "true");
  assert.equal(harness.iframeCount(), 0);
  harness.api.setActiveVideo(8, { immediate: true });
  harness.api.nextVideo();
  assert.equal(harness.text("main-video-student"), "Shivam Maji");
  harness.swipe({ startX: 300, startY: 100, endX: 220, endY: 110 });
  assert.equal(harness.text("main-video-student"), "Edrik");
  harness.swipe({ startX: 220, startY: 100, endX: 215, endY: 180 });
  assert.equal(harness.text("main-video-student"), "Edrik");
  harness.api.playActiveVideo();
  assert.equal(harness.iframeTitle(), "Testimonial from Edrik");
  assert.match(harness.iframeSrc(), /cEfGnov3ykU/);
});
```

- [ ] **Step 5: Run the behavioral test and verify RED**

```bash
node --test --test-name-pattern="coordinates Track Record selection playback wrapping and swipe" tests/light-mode-section-surfaces.test.mjs
```

Expected: FAIL because selection currently mounts an iframe and lacks counter/swipe/title coordination.

- [ ] **Step 6: Implement the shared selection/playback controller**

Use these exact responsibilities:

```js
const trackRecordReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const STORY_FADE_MS = 220;
let activeVideoIndex = 0;
let storyTransitionTimer = 0;

function normalizeVideoIndex(index) {
  return (Number(index) % VIDEOS_DATA.length + VIDEOS_DATA.length) % VIDEOS_DATA.length;
}
function posterUrlFor(video) {
  return `https://i.ytimg.com/vi/${video.youtubeId}/hqdefault.jpg`;
}
function playActiveVideo() {
  const video = VIDEOS_DATA[activeVideoIndex];
  const iframe = document.createElement('iframe');
  iframe.id = 'main-video-iframe';
  iframe.src = `https://www.youtube.com/embed/${video.youtubeId}?rel=0`;
  iframe.title = `Testimonial from ${video.student}`;
  iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
  iframe.allowFullscreen = true;
  iframe.className = 'absolute inset-0 h-full w-full';
  document.getElementById('testimonial-media').replaceChildren(iframe);
}
```

`renderVideoPoster(video)` must restore the poster button, image, and `Play testimonial from {student}` label. `commitActiveVideo(index)` normalizes the index and synchronously updates poster, student, school, quote, counter, visual active classes, and all nine `aria-pressed` states. `setActiveVideo(index, { immediate = trackRecordReducedMotion.matches } = {})` clears the previous timer, fades the shared content to zero, commits after `220ms`, then restores opacity; immediate mode commits with opacity `1`. Arrows call `setActiveVideo(activeVideoIndex ± 1)`.

- [ ] **Step 7: Implement one-story genuine swipe without scroll trapping**

Attach passive `touchstart` and `touchend` listeners to `#testimonial-story-surface`. Record the first changed touch only below `1024px` and ignore gestures starting inside an iframe. On end, calculate deltas, reset the start state, reject movement below `50px` or with `abs(deltaX) <= abs(deltaY)`, call `nextVideo()` for left and `prevVideo()` for right. Do not call `preventDefault`; CSS supplies `touch-action: pan-y`.

- [ ] **Step 8: Run GREEN gates and commit Task 1**

```bash
node --test --test-name-pattern="Track Record|poster-first" tests/light-mode-section-surfaces.test.mjs
node --test tests/light-mode-section-surfaces.test.mjs
git diff --check
git add index.html tests/light-mode-section-surfaces.test.mjs
git commit -m "feat: refine Track Record story player"
```

Expected: focused and full suites pass with zero failures and the diff check is clean.

---

### Task 2: Responsive density, reduced motion, and rendered QA

**Files:**
- Modify: `index.html` only if the scoped CSS is not completed in Task 1 or QA proves a defect
- Modify: `tests/light-mode-section-surfaces.test.mjs`
- Create: `.superpowers/sdd/2026-08-16-track-record-story-player/task-2-report.md`

**Interfaces:**
- Consumes: `.testimonial-story-surface`, `.testimonial-story-content`, `.testimonial-poster-shade`, and `.testimonial-play-icon` from Task 1.
- Produces: stable responsive/reduced-motion rules and recorded visual/interactivity evidence.

- [ ] **Step 1: Write the failing CSS contract**

```js
test("uses restrained responsive and reduced-motion Track Record polish", () => {
  assert.match(html, /\.testimonial-story-surface\s*\{[^}]*touch-action:\s*pan-y/s);
  assert.match(html, /\.testimonial-story-content\s*\{[^}]*transition:\s*opacity 220ms/s);
  assert.match(html, /\.testimonial-poster-shade\s*\{[^}]*linear-gradient/s);
  assert.match(html, /\.testimonial-play-icon\s*\{[\s\S]*min-width:\s*3\.5rem[\s\S]*min-height:\s*3\.5rem/);
  assert.match(html, /@media \(max-width:\s*767px\)[\s\S]*#main-video-quote\s*\{[^}]*font-size:\s*1rem;[^}]*line-height:\s*1\.65/s);
  assert.match(html, /@media \(prefers-reduced-motion:\s*reduce\)[\s\S]*\.testimonial-story-content\s*\{[^}]*transition:\s*none/s);
});
```

- [ ] **Step 2: Run the CSS test and verify RED**

```bash
node --test --test-name-pattern="responsive and reduced-motion Track Record polish" tests/light-mode-section-surfaces.test.mjs
```

Expected: FAIL until the scoped CSS exists.

- [ ] **Step 3: Add minimal premium CSS and mobile density rules**

```css
.testimonial-story-surface { touch-action: pan-y; }
.testimonial-story-content { opacity: 1; transition: opacity 220ms ease; }
.testimonial-story-content.is-changing { opacity: 0; }
.testimonial-poster-shade { background: linear-gradient(to top, rgb(2 6 23 / 0.62), transparent 58%); }
.testimonial-play-icon {
  position: absolute; inset: 50% auto auto 50%; transform: translate(-50%, -50%);
  min-width: 3.5rem; min-height: 3.5rem; display: grid; place-items: center;
  border-radius: 9999px; background: rgb(79 70 229 / 0.92);
  box-shadow: 0 12px 32px rgb(15 23 42 / 0.4);
}
@media (max-width: 767px) {
  #main-video-quote { font-size: 1rem; line-height: 1.65; }
  .testimonial-story-content { padding-inline: 0.5rem; }
}
@media (prefers-reduced-motion: reduce) {
  .testimonial-story-content, .testimonial-play-icon { transition: none; }
}
```

Tighten only the mobile media-to-copy, school-to-quote, and navigation top gaps. Do not alter desktop spacing unless screenshots prove a defect.

- [ ] **Step 4: Run GREEN static gates**

```bash
node --test --test-name-pattern="Track Record" tests/light-mode-section-surfaces.test.mjs
node --test tests/light-mode-section-surfaces.test.mjs
git diff --check
```

- [ ] **Step 5: Run rendered browser QA**

Flow: open `http://127.0.0.1:4173/index.html` → scroll to The Track Record → select, swipe, wrap, and play stories → verify media/copy/counter/accessibility synchronization.

Check 390×844 light/dark (left/right swipe, short/vertical rejection, arrow wrap, `1 / 9` counter, play state, natural vertical scroll), 768×1024 light/dark (poster/arrows/no clipping), 1440×900 light/dark (first/middle/final rows, poster/copy/counter/pressed state/play), and 390/1440 reduced motion (instant state changes). At every size verify page identity, meaningful DOM, no overlay, relevant console errors, horizontal overflow, scroll trap, clipping, or adjacent-section overlap. Save representative screenshots under `.superpowers/sdd/2026-08-16-track-record-story-player/task-2-artifacts/`.

- [ ] **Step 6: Fix evidence-backed defects test-first**

For each defect, add a focused failing test, observe RED, make the smallest Track Record-only fix, rerun focused/full tests, and recapture the affected state. Do not broaden scope.

- [ ] **Step 7: Write the evidence report**

Create `.superpowers/sdd/2026-08-16-track-record-story-player/task-2-report.md` with changed files, RED/GREEN evidence, final totals, viewport/theme/reduced matrix, swipe deltas/indexes, poster/play/iframe title, counter/pressed states, overflow/console/vertical-scroll results, screenshot paths, limitations, and risks.

- [ ] **Step 8: Commit only if QA changed tracked files**

```bash
git add index.html tests/light-mode-section-surfaces.test.mjs
git commit -m "fix: finalize responsive Track Record player"
```

Do not create an empty commit when QA needs no tracked correction.

---

## Final Verification

```bash
node --test tests/light-mode-section-surfaces.test.mjs
git diff --check
curl -sS -o /dev/null -w '%{http_code}\n' http://127.0.0.1:4173/index.html
git status --short
```

Expected: zero failures, clean diff check, HTTP `200`, and only pre-existing unrelated workspace files remain dirty/untracked.
