# Track Record Direct YouTube Embed Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the Track Record custom poster gate with an immediately available native YouTube embed so playback requires one click.

**Architecture:** Keep the existing story controller and responsive player layout. Replace `renderVideoPoster` and `playActiveVideo` with one `renderVideoEmbed(video)` function used by initial markup and every committed story selection; remove only poster-specific CSS and DOM hooks.

**Tech Stack:** Static HTML, CSS, vanilla JavaScript, Node.js `node:test`, local HTTP preview, Chrome/Playwright responsive QA.

## Global Constraints

- Do not autoplay on load or story selection.
- Preserve all nine stories and their existing copy.
- Preserve desktop selector rows, mobile arrows, visible counter, genuine swipe, wrapping, transitions, reduced motion, and iframe-origin swipe exclusion.
- Keep **View All Testimonials** unchanged.
- Make no unrelated refactors or dependency changes.
- Preserve unrelated dirty and untracked workspace files.

---

### Task 1: Replace the poster gate with direct YouTube embeds

**Files:**
- Modify: `tests/light-mode-section-surfaces.test.mjs:487-700`
- Modify: `index.html:1401-1439`
- Modify: `index.html:2845-2860`
- Modify: `index.html:3065-3155`

**Interfaces:**
- Consumes: `VIDEOS_DATA`, `setActiveVideo(index, options)`, `commitActiveVideo(index)`, and `#testimonial-media`.
- Produces: `renderVideoEmbed(video)` that replaces `#testimonial-media` children with one non-autoplaying iframe titled `Testimonial from <student>`.

- [ ] **Step 1: Write the failing direct-embed tests**

Update the structural test to require the initial iframe and reject poster hooks:

```js
test("uses a direct accessible YouTube embed in the Track Record player", () => {
  const start = html.indexOf("Verified Impact & Video Testimonials");
  const end = html.indexOf("MENTORS_AND_RESULTS_INSERTED", start);
  const section = html.slice(start, end);
  assert.match(section, /<iframe[^>]*id="main-video-iframe"/);
  assert.match(section, /src="https:\/\/www\.youtube\.com\/embed\/OXvoto-nhnY\?rel=0"/);
  assert.match(section, /title="Testimonial from Shivam Maji"/);
  assert.doesNotMatch(section, /id="testimonial-play"|testimonial-poster|testimonial-play-icon/);
  assert.doesNotMatch(section, /[?&]autoplay=1/);
  assert.equal((section.match(/aria-pressed="(?:true|false)"/g) ?? []).length, 9);
  assert.match(section, /href="#"[\s\S]*View All Testimonials/);
});
```

Update the controller harness export and behavior assertions:

```js
runInNewContext(
  `${trackRecordScriptSource}\nglobalThis.__trackRecordApi = { setActiveVideo, nextVideo, prevVideo };`,
  context
);

assert.equal(harness.iframeCount(), 1);
assert.equal(harness.iframeTitle(), "Testimonial from Shivam Maji");
assert.match(harness.iframeSrc(), /OXvoto-nhnY\?rel=0$/);
assert.doesNotMatch(harness.iframeSrc(), /autoplay=1/);

harness.api.nextVideo();
assert.equal(harness.iframeCount(), 1);
assert.equal(harness.iframeTitle(), "Testimonial from Edrik");
assert.match(harness.iframeSrc(), /cEfGnov3ykU\?rel=0$/);
```

Remove poster-specific harness helpers and change iframe-origin swipe coverage to use the already-rendered iframe.

- [ ] **Step 2: Run the focused tests and verify RED**

Run:

```bash
node --test --test-name-pattern="Track Record" tests/light-mode-section-surfaces.test.mjs
```

Expected: FAIL because the section still contains the custom poster, lacks an initial iframe, and story selection restores a poster.

- [ ] **Step 3: Implement the initial direct embed**

Replace the contents of `#testimonial-media` with the native iframe:

```html
<iframe
  id="main-video-iframe"
  src="https://www.youtube.com/embed/OXvoto-nhnY?rel=0"
  title="Testimonial from Shivam Maji"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
  allowfullscreen
  class="absolute inset-0 h-full w-full"
></iframe>
```

- [ ] **Step 4: Replace poster functions with the embed renderer**

Delete `posterUrlFor`, `renderVideoPoster`, and `playActiveVideo`. Add:

```js
function renderVideoEmbed(video) {
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

In `commitActiveVideo`, replace `renderVideoPoster(video)` with:

```js
renderVideoEmbed(video);
```

- [ ] **Step 5: Remove unused poster styling**

Delete `.testimonial-poster-shade`, `.testimonial-play-icon`, and its reduced-motion rule. Retain the shared `.testimonial-media` transition because it now fades the iframe with the story copy.

- [ ] **Step 6: Run focused and full tests and verify GREEN**

Run:

```bash
node --test --test-name-pattern="Track Record" tests/light-mode-section-surfaces.test.mjs
node --test tests/light-mode-section-surfaces.test.mjs
git diff --check
```

Expected: focused tests pass, the full suite has zero failures, and the diff check is clean.

- [ ] **Step 7: Perform rendered responsive verification**

Serve and verify:

```bash
python3 -m http.server 4173 --bind 127.0.0.1
curl -sS -o /dev/null -w 'HTTP %{http_code}\n' http://127.0.0.1:4173/index.html
```

Using the in-app Browser when available, otherwise local Chrome/Playwright with the reason recorded, inspect 390x844 and 1440x900 in light and dark modes. Verify:

- The YouTube player is present immediately and has no custom overlay.
- The initial iframe has no `autoplay=1` parameter.
- Selecting Edrik replaces the iframe source and title after the existing transition.
- Mobile 50px horizontal-dominant swipe changes exactly one story; vertical gestures do not.
- Touches beginning inside the iframe do not trigger story navigation.
- Counter, arrows, desktop pressed state, reduced motion, and horizontal overflow remain correct.

- [ ] **Step 8: Commit the focused implementation**

```bash
git add index.html tests/light-mode-section-surfaces.test.mjs
git commit -m "fix: show Track Record videos directly"
```

---

### Task 2: Independent scope and behavior review

**Files:**
- Review: `index.html`
- Review: `tests/light-mode-section-surfaces.test.mjs`
- Review: `docs/superpowers/specs/2026-08-16-track-record-direct-youtube-embed-design.md`

**Interfaces:**
- Consumes: Task 1 commit and its test/browser evidence.
- Produces: a requirement-compliance verdict and any evidence-backed Critical, Important, or Minor findings.

- [ ] **Step 1: Review the committed diff against the specification**

Confirm the implementation removes only the custom poster gate, directly renders one iframe, does not autoplay, preserves the story controller contract, and does not modify **View All Testimonials**.

- [ ] **Step 2: Inspect verification evidence**

Check that focused/full tests, HTTP status, 390px/1440px screenshots, source/title updates, swipe boundaries, reduced motion, and overflow were explicitly verified.

- [ ] **Step 3: Resolve any review findings test-first**

For each accepted finding, add a focused failing regression, verify RED, apply the smallest implementation correction, and rerun focused/full gates.

- [ ] **Step 4: Run final verification before handoff**

```bash
node --test tests/light-mode-section-surfaces.test.mjs
git diff --check
curl -sS -o /dev/null -w 'HTTP %{http_code}\n' http://127.0.0.1:4173/index.html
git status --short
```

Expected: zero test failures, clean task diff, HTTP 200, and only pre-existing unrelated workspace changes.
