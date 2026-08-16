# Facebook Review Proof Section Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a premium, manually controlled Facebook review carousel between The Track Record and the final CTA using four approved review excerpts and local placeholder avatars.

**Architecture:** Keep review content in one guarded `FACEBOOK_REVIEWS` data array and render one semantic list into a native horizontal scroll-snap viewport. A small controller owns previous/next navigation, responsive page sizing, position announcements, and reduced-motion behavior; a separate one-shot observer adds restrained entrance motion without hiding content when JavaScript or observation fails.

**Tech Stack:** Static HTML, scoped CSS, Tailwind CDN utilities, inline JavaScript, local SVG asset, Node.js built-in test runner, local Chrome responsive QA.

## Global Constraints

- Place the section after the Track Record section and immediately before `#closing-cta`.
- Use exactly four approved Facebook review excerpts from the design spec.
- Do not display an aggregate rating, review count, public-review CTA, or invented source URL.
- Use one local neutral placeholder avatar asset and reviewer initials; do not load remote or fabricated reviewer photography.
- Use native horizontal scrolling and scroll snap with no autoplay.
- Show three cards at 1024px and above, two cards from 768px through 1023px, and one card plus a visible next-card edge below 768px.
- Preserve dark mode, reduced motion, keyboard access, advisor clearance, and the existing Track Record and closing CTA behavior.
- Do not modify or stage unrelated dirty files.

---

### Task 1: Review Data, Semantic Markup, and Editorial Card System

**Files:**
- Create: `assets/reviewer-placeholder.svg`
- Modify: `index.html`
- Modify: `tests/light-mode-section-surfaces.test.mjs`

**Interfaces:**
- Produces: `FACEBOOK_REVIEWS: Array<{name:string, initials:string, date:string, tags:string[], excerpt:string, context:string, avatar:string}>`.
- Produces: `#facebook-reviews-section`, `#facebook-reviews-viewport`, `#facebook-reviews-track`, `#facebook-review-prev`, `#facebook-review-next`, and `#facebook-review-position`.
- Produces: `.facebook-review-card` list items rendered from the data array.

- [ ] **Step 1: Write failing structural tests**

Append tests that extract the block between `<!-- Facebook Review Proof -->` and `<!-- Facebook Review Proof End -->` and assert:

```js
test("places a semantic four-review Facebook proof section before the closing CTA", () => {
  const start = html.indexOf("<!-- Facebook Review Proof -->");
  const end = html.indexOf("<!-- Facebook Review Proof End -->", start);
  const section = html.slice(start, end);
  assert.ok(start > html.indexOf("The Track Record"));
  assert.ok(end < html.indexOf('id="closing-cta"'));
  assert.match(section, /id="facebook-reviews-section"/);
  assert.match(section, /Verified Family Feedback/);
  assert.match(section, /Trusted by students and families/);
  assert.match(section, /role="region"[^>]*aria-label="Facebook review excerpts"/);
  assert.match(section, /<ul[^>]*id="facebook-reviews-track"/);
  assert.match(section, /id="facebook-review-prev"[^>]*aria-label="Previous Facebook reviews"/);
  assert.match(section, /id="facebook-review-next"[^>]*aria-label="Next Facebook reviews"/);
  assert.match(section, /id="facebook-review-position"[^>]*aria-live="polite"/);
  assert.doesNotMatch(section, /4\.9|234 reviews|View all Facebook|autoplay/);
});

test("keeps approved Facebook excerpts in one guarded data model", () => {
  assert.match(html, /const FACEBOOK_REVIEWS = Object\.freeze\(\[/);
  for (const name of ["Mauli Shah", "Shivam Maji", "Velma Burke", "Farhana Hanip"]) {
    assert.match(html, new RegExp(`name:\\s*["']${name}["']`));
  }
  assert.equal((html.match(/avatar:\s*["']assets\/reviewer-placeholder\.svg["']/g) ?? []).length, 4);
  assert.match(html, /Facebook review excerpt/);
  const dataSource = html.match(/const FACEBOOK_REVIEWS = Object\.freeze\(\[[\s\S]*?\]\);/)?.[0] ?? "";
  assert.doesNotMatch(dataSource, /https?:\/\//);
});
```

- [ ] **Step 2: Run the focused tests and verify RED**

```bash
node --test --test-name-pattern="Facebook proof|approved Facebook" tests/light-mode-section-surfaces.test.mjs
```

Expected: FAIL because the section, data, asset, and controls do not exist.

- [ ] **Step 3: Create the local neutral avatar asset**

Create `assets/reviewer-placeholder.svg` as a 96 by 96 viewBox with a transparent background, a restrained indigo-to-sky circular fill, and a simple white head-and-shoulders silhouette. Do not include text, brand logos, filters, scripts, or external references.

- [ ] **Step 4: Add the guarded review data array**

Add `const FACEBOOK_REVIEWS = Object.freeze([...])` near the other page data. Copy the four names, dates, tags, excerpts, and context strings verbatim from `docs/superpowers/specs/2026-08-16-facebook-review-proof-design.md`. Give every object `avatar: "assets/reviewer-placeholder.svg"` and initials `MS`, `SM`, `VB`, and `FH` respectively.

- [ ] **Step 5: Add the semantic section markup**

Between Track Record and `#closing-cta`, add:

```html
<!-- Facebook Review Proof -->
<section id="facebook-reviews-section" class="facebook-reviews-section section-space-major" aria-labelledby="facebook-reviews-heading">
  <div class="max-w-7xl mx-auto px-6">
    <div class="facebook-reviews-intro facebook-review-stage">
      <span class="facebook-source-badge">...</span>
      <h2 id="facebook-reviews-heading">Trusted by students and families</h2>
      <p>Public feedback from families and students who learned with MasterYourCourses.</p>
    </div>
    <div class="facebook-reviews-shell facebook-review-stage" role="region" aria-label="Facebook review excerpts">
      <div id="facebook-reviews-viewport" tabindex="0">
        <ul id="facebook-reviews-track"></ul>
      </div>
      <div class="facebook-review-controls">
        <button id="facebook-review-prev" type="button" aria-label="Previous Facebook reviews">...</button>
        <span id="facebook-review-position" aria-live="polite" aria-atomic="true">1 / 4</span>
        <button id="facebook-review-next" type="button" aria-label="Next Facebook reviews">...</button>
      </div>
    </div>
  </div>
</section>
<!-- Facebook Review Proof End -->
```

The Facebook source badge uses an inline decorative `f` mark and the text `Facebook review excerpts`; it must not claim a live verification link.

- [ ] **Step 6: Render cards from the data model**

Implement `renderFacebookReviews()` so each object produces one `<li class="facebook-review-card">` with:

- Decorative placeholder image (`alt=""`, `aria-hidden="true"`).
- Initials overlay.
- Reviewer name and `<time datetime="YYYY-MM-DD">`.
- Decorative five-star row inside a wrapper with `aria-label="5 out of 5 stars"`.
- Tags as non-interactive spans.
- `<blockquote>` containing the exact excerpt.
- Context line.

Escape review text through a small `escapeReviewText(value)` helper before interpolation; do not use raw unescaped data in `innerHTML`.

- [ ] **Step 7: Add the scoped responsive card CSS**

Create a `/* Facebook review proof */` block that:

- Light-scopes a warm-white editorial surface and dark-scopes a zinc/slate equivalent.
- Uses `overflow-x: auto`, `scroll-snap-type: x mandatory`, hidden visual scrollbar, and `overscroll-behavior-inline: contain` on the viewport.
- Uses CSS custom properties for card count and gap.
- Mobile: card basis `min(82vw, 20rem)` so the next card edge remains visible.
- 768–1023px: card basis `calc((100% - 1rem) / 2)`.
- 1024px+: card basis `calc((100% - 2rem) / 3)`.
- Makes cards equal height through track alignment and card flex layout.
- Keeps controls at least 44 by 44 pixels with visible focus rings.
- Uses Facebook blue only in the source badge/focus accent and gold only in the star row.

- [ ] **Step 8: Verify GREEN and commit**

```bash
node --test --test-name-pattern="Facebook proof|approved Facebook" tests/light-mode-section-surfaces.test.mjs
node --test tests/light-mode-section-surfaces.test.mjs
git diff --check
git add assets/reviewer-placeholder.svg index.html tests/light-mode-section-surfaces.test.mjs
git commit -m "feat: add Facebook review proof section"
```

Expected: Focused and full suites PASS; diff check has no output.

---

### Task 2: Manual Carousel Controller and Responsive State

**Files:**
- Modify: `index.html`
- Modify: `tests/light-mode-section-surfaces.test.mjs`

**Interfaces:**
- Consumes: `FACEBOOK_REVIEWS`, the viewport/track/control IDs from Task 1, and `window.matchMedia`.
- Produces: `getFacebookReviewPageSize(): 1 | 2 | 3`, `setFacebookReviewIndex(index:number, options?:{focus?:boolean}): void`, and `syncFacebookReviewControls(): void`.

- [ ] **Step 1: Add a failing VM-backed controller test**

Extract the controller between `// Facebook review carousel` and `// Facebook review carousel end`. Run it in a VM harness with four mock cards, controllable `innerWidth`, `scrollTo`, `scrollLeft`, `clientWidth`, `matchMedia`, buttons, and counter. Assert:

```js
assert.equal(harness.pageSize(390), 1);
assert.equal(harness.pageSize(768), 2);
assert.equal(harness.pageSize(1440), 3);
assert.equal(harness.counter({ width: 390 }), "1 / 4");
assert.equal(harness.counter({ width: 768 }), "1–2 / 4");
assert.equal(harness.counter({ width: 1440 }), "1–3 / 4");
harness.next();
assert.equal(harness.index(), 1);
assert.equal(harness.counter({ width: 1440 }), "2–4 / 4");
assert.equal(harness.nextDisabled(), true);
harness.resize(390);
harness.setIndex(3);
assert.equal(harness.nextDisabled(), true);
harness.previous();
assert.equal(harness.index(), 2);
assert.equal(harness.behavior({ reduced: false }), "smooth");
assert.equal(harness.behavior({ reduced: true }), "auto");
```

Also assert the source contains no timer APIs:

```js
assert.doesNotMatch(controllerSource, /setInterval|setTimeout|requestAnimationFrame/);
```

- [ ] **Step 2: Run the focused controller test and verify RED**

```bash
node --test --test-name-pattern="Facebook review carousel" tests/light-mode-section-surfaces.test.mjs
```

Expected: FAIL because the controller markers and behavior do not exist.

- [ ] **Step 3: Implement bounded manual navigation**

Implement the controller with:

- Page size `1` below 768px, `2` from 768px, `3` from 1024px.
- Current index clamped from `0` through `FACEBOOK_REVIEWS.length - getFacebookReviewPageSize()` so wider layouts never scroll into trailing whitespace.
- `scrollTo({ left: card.offsetLeft - track.offsetLeft, behavior })`.
- `behavior: "auto"` for reduced motion and `"smooth"` otherwise.
- Previous/next click handlers that move exactly one review.
- ArrowLeft/ArrowRight handling while the viewport is focused.
- A passive `scroll` listener that finds the card whose offset is closest to `scrollLeft` and synchronizes the counter/buttons.
- A `resize` listener that resynchronizes without moving focus.
- Disabled previous at index `0`; disabled next at the responsive maximum start index (`3` mobile, `2` tablet, `1` desktop).
- Counter text shows the visible range: `1 / 4` on mobile, `1–2 / 4` on tablet, and `1–3 / 4` on desktop, updating as navigation changes.

Do not add autoplay, wrapping, drag emulation, duplicated cards, or timer-based state.

- [ ] **Step 4: Verify GREEN and commit**

```bash
node --test --test-name-pattern="Facebook review carousel" tests/light-mode-section-surfaces.test.mjs
node --test tests/light-mode-section-surfaces.test.mjs
git diff --check
git add index.html tests/light-mode-section-surfaces.test.mjs
git commit -m "feat: add manual Facebook review navigation"
```

Expected: Focused and full suites PASS.

---

### Task 3: Entrance Motion, Integration QA, and Final Gate

**Files:**
- Modify: `index.html`
- Modify: `tests/light-mode-section-surfaces.test.mjs`

**Interfaces:**
- Consumes: `#facebook-reviews-section` and `.facebook-review-stage` from Task 1.
- Produces: one-shot `facebook-review-motion-ready` and `is-visible` section states with fail-open behavior.

- [ ] **Step 1: Add failing motion and placement contracts**

Add tests asserting:

```js
assert.match(html, /#facebook-reviews-section\.facebook-review-motion-ready \.facebook-review-stage/);
assert.match(html, /#facebook-reviews-section\.facebook-review-motion-ready\.is-visible \.facebook-review-stage/);
assert.match(html, /@media \(prefers-reduced-motion: reduce\)[\s\S]*#facebook-reviews-section \.facebook-review-stage[\s\S]*transition:\s*none/);
assert.match(controllerSource, /const facebookReviewObserver = new IntersectionObserver[\s\S]*facebookReviewsSection\.classList\.add\('facebook-review-motion-ready'\)/);
assert.match(controllerSource, /facebookReviewsSection\.classList\.remove\('facebook-review-motion-ready'\)/);
```

Use a small observer harness to prove first intersection adds `is-visible`, unobserves once, reduced motion skips observation, and constructor failure leaves the section visible.

- [ ] **Step 2: Run focused tests and verify RED**

```bash
node --test --test-name-pattern="Facebook review.*motion|Facebook proof placement" tests/light-mode-section-surfaces.test.mjs
```

Expected: FAIL because the scoped reveal controller and reduced-motion CSS do not exist.

- [ ] **Step 3: Implement restrained fail-open motion**

Add scoped CSS only under `prefers-reduced-motion: no-preference`:

- Initial stage opacity `0`, translateY `18px`.
- Duration `560ms`, easing `cubic-bezier(0.22, 1, 0.36, 1)`.
- Intro delay `0ms`; carousel delay `90ms`.
- Visible state opacity `1`, transform `none`, `will-change: auto`.

Under reduced motion, force opacity `1`, transform `none`, and transition `none`.

Construct the observer before adding `facebook-review-motion-ready`; on intersection add `is-visible` and unobserve. In `catch`, remove `facebook-review-motion-ready` so content fails open.

- [ ] **Step 4: Run the complete automated gate**

```bash
node --test tests/light-mode-section-surfaces.test.mjs
git diff --check
```

Expected: Full suite PASS; diff check has no output.

- [ ] **Step 5: Run rendered responsive QA**

Serve the exact page and confirm HTTP health:

```bash
python3 -m http.server 4173 --bind 127.0.0.1
curl -sS -o /dev/null -w 'HTTP %{http_code}\n' http://127.0.0.1:4173/index.html
```

Using the in-app Browser when available, otherwise the documented local Chrome fallback, inspect light and dark modes at 390×844, 768×1024, and 1440×900, plus reduced motion at 390 and 1440. Verify:

- Section placement between Track Record and closing CTA.
- One card plus next edge at 390px, two cards at 768px, three cards at 1440px.
- Native mobile horizontal swipe and scroll snap.
- Previous/next boundaries, arrow-key navigation, counter synchronization, and disabled states.
- Exact excerpts remain visible with equal-height cards.
- Reduced motion uses instant navigation and no entrance transition.
- Every control has a visible focus indication and at least a 44px hit area.
- `document.documentElement.scrollWidth === document.documentElement.clientWidth`.
- Floating advisor does not overlap controls or card text.
- No page exceptions or missing local assets.

- [ ] **Step 6: Commit Task 3**

```bash
git add index.html tests/light-mode-section-surfaces.test.mjs
git commit -m "feat: finish Facebook review section motion"
```

- [ ] **Step 7: Run the fresh post-commit verification gate**

```bash
node --test tests/light-mode-section-surfaces.test.mjs
git show --check --oneline --stat HEAD
curl -sS -o /dev/null -w 'HTTP %{http_code}\n' http://127.0.0.1:4173/index.html
git status --short
```

Expected: Full suite PASS, commit check clean, HTTP 200, and only the user's unrelated pre-existing files remain dirty or untracked.
