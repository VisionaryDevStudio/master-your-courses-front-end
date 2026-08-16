# Testimonial Marquee Refinement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Preserve the continuously moving desktop and mobile testimonial ribbon while improving readability, loop quality, pause behavior, and reduced-motion and screen-reader accessibility.

**Architecture:** Re-group the existing 24 repeated cards into four identical six-card groups, expose only the first group semantically, and animate the group-aware track by exactly one-quarter of its width. Add a bounded `.testimonial-marquee-*` CSS system for durations, edge masks, consistent responsive card geometry, pause states, and a stationary reduced-motion fallback without changing adjacent sections.

**Tech Stack:** Static HTML, Tailwind CDN utilities, custom CSS, Node test runner, local Chrome/CDP browser QA.

## Global Constraints

- Source of truth is `html-version/index.html` in the nested Git repository.
- Modify only the `Results & Quotes Ticker` immediately after `Meet The Mentors`, plus its focused regression tests.
- Preserve all six names, assessment labels, before/after scores, quotes, colors, typography, initials, and the dark-ribbon composition.
- Preserve continuous automatic motion on normal desktop, tablet, and mobile devices.
- Desktop duration is 80 seconds; mobile duration below 768px is 96 seconds.
- Desktop cards remain 66px high with 48px spacing; mobile cards remain 280px wide, become 156px high, and use 24px spacing.
- Do not modify `The Track Record` or the video testimonial gallery.
- Do not add visible headings, photos, logos, arrows, pagination, or new testimonial claims.
- Under reduced motion, automatic animation stops and only the unique six-card group remains visible through native horizontal scrolling.

---

### Task 1: Semantic Four-Group Loop Structure

**Files:**
- Modify: `index.html:2241-2753`
- Modify: `tests/light-mode-section-surfaces.test.mjs`

**Interfaces:**
- Consumes: the existing six-card sequence repeated four times.
- Produces: `.testimonial-marquee-section`, `.testimonial-marquee-viewport`, `.testimonial-marquee-track`, four `.testimonial-marquee-group` elements, and 24 `.testimonial-marquee-card` elements.

- [ ] **Step 1: Write the failing structure test**

Extract the ticker between the `Results & Quotes Ticker` and `Verified Impact & Video Testimonials` comments and add:

```js
test("uses one semantic testimonial group with silent loop duplicates", () => {
  const tickerStart = html.indexOf("Results & Quotes Ticker");
  const tickerEnd = html.indexOf("Verified Impact & Video Testimonials", tickerStart);
  const ticker = html.slice(tickerStart, tickerEnd);

  assert.match(ticker, /class="[^"]*testimonial-marquee-section/);
  assert.match(ticker, /class="[^"]*testimonial-marquee-viewport[^"]*"[^>]*tabindex="0"/);
  assert.equal((ticker.match(/testimonial-marquee-group/g) ?? []).length, 4);
  assert.equal((ticker.match(/testimonial-marquee-card/g) ?? []).length, 24);
  assert.equal((ticker.match(/aria-label="Student outcomes"/g) ?? []).length, 1);
  assert.equal((ticker.match(/aria-hidden="true"/g) ?? []).length, 3);

  for (const name of ["Duncan", "Ari", "Kaitlyn", "Sakina", "David", "Emma"]) {
    assert.equal((ticker.match(new RegExp(`>${name}<`, "g")) ?? []).length, 4);
  }
});
```

- [ ] **Step 2: Run the focused test and verify RED**

Run:

```bash
node --test --test-name-pattern="semantic testimonial group" tests/light-mode-section-surfaces.test.mjs
```

Expected: FAIL because the current ticker is a flat animated track without group or duplicate semantics.

- [ ] **Step 3: Introduce bounded section and viewport hooks**

Change the ticker shell to:

```html
<section class="testimonial-marquee-section section-space-band bg-slate-950 overflow-hidden relative flex items-center" aria-label="Student outcomes">
  <div class="testimonial-marquee-viewport relative w-full flex items-center" tabindex="0">
    <div class="testimonial-marquee-track">
      <!-- four groups -->
    </div>
  </div>
</section>
```

The section owns the accessible name; do not add visible copy.

- [ ] **Step 4: Wrap the four existing sequences**

Wrap each existing six-card sequence in:

```html
<div class="testimonial-marquee-group" role="list">
  <!-- six existing cards, each with testimonial-marquee-card and role=listitem -->
</div>
```

Only the first group keeps `role="list"`. Set `aria-hidden="true"` on groups two through four and omit list roles from those duplicates. Add `.testimonial-marquee-card` to every existing card without changing its content or Tailwind presentation classes.

- [ ] **Step 5: Run focused and full tests**

Run:

```bash
node --test --test-name-pattern="semantic testimonial group" tests/light-mode-section-surfaces.test.mjs
node --test tests/light-mode-section-surfaces.test.mjs
git diff --check
```

Expected: all tests pass and the diff check is clean.

- [ ] **Step 6: Commit Task 1**

```bash
git add index.html tests/light-mode-section-surfaces.test.mjs
git commit -m "refactor: structure testimonial marquee groups"
```

### Task 2: Responsive Motion, Readability, and Browser QA

**Files:**
- Modify: `index.html:1233-1242`
- Modify: `tests/light-mode-section-surfaces.test.mjs`
- Create: `.superpowers/sdd/2026-08-15-testimonial-marquee-refinement/task-2-report.md`

**Interfaces:**
- Consumes: Task 1 `.testimonial-marquee-*` hooks and four equal groups.
- Produces: `@keyframes testimonial-marquee`, responsive duration and spacing variables, edge-mask viewport, pause states, and reduced-motion fallback.

- [ ] **Step 1: Write the failing motion and layout contract test**

Add:

```js
test("keeps testimonial motion readable and reduced-motion safe", () => {
  assert.match(html, /@keyframes testimonial-marquee[\s\S]*translate3d\(-25%,\s*0,\s*0\)/);
  assert.match(html, /\.testimonial-marquee-track\s*\{[\s\S]*--testimonial-duration:\s*80s[\s\S]*animation:\s*testimonial-marquee var\(--testimonial-duration\) linear infinite/);
  assert.match(html, /\.testimonial-marquee-group\s*\{[\s\S]*gap:\s*48px[\s\S]*padding-right:\s*48px/);
  assert.match(html, /\.testimonial-marquee-card\s*\{[\s\S]*height:\s*66px/);
  assert.match(html, /testimonial-marquee-viewport:(?:hover|active)[\s\S]*animation-play-state:\s*paused/);
  assert.match(html, /testimonial-marquee-viewport:focus-within[\s\S]*animation-play-state:\s*paused/);
  assert.match(html, /@media \(max-width:\s*767px\)[\s\S]*--testimonial-duration:\s*96s[\s\S]*gap:\s*24px[\s\S]*height:\s*156px/);
  assert.match(html, /@media \(prefers-reduced-motion:\s*reduce\)[\s\S]*\.testimonial-marquee-track\s*\{[\s\S]*animation:\s*none[\s\S]*transform:\s*none/);
  assert.match(html, /@media \(prefers-reduced-motion:\s*reduce\)[\s\S]*\.testimonial-marquee-group\[aria-hidden="true"\]\s*\{\s*display:\s*none/);
});
```

- [ ] **Step 2: Run the focused test and verify RED**

Run:

```bash
node --test --test-name-pattern="testimonial motion readable" tests/light-mode-section-surfaces.test.mjs
```

Expected: FAIL because the old `marquee` animation translates 50%, uses one inline duration, and has no pause or reduced-motion rules.

- [ ] **Step 3: Replace the generic marquee CSS**

Implement:

```css
@keyframes testimonial-marquee {
  from { transform: translate3d(0, 0, 0); }
  to { transform: translate3d(-25%, 0, 0); }
}
.testimonial-marquee-viewport {
  overflow: hidden;
  -webkit-mask-image: linear-gradient(to right, transparent 0, #000 4%, #000 96%, transparent 100%);
  mask-image: linear-gradient(to right, transparent 0, #000 4%, #000 96%, transparent 100%);
}
.testimonial-marquee-track {
  --testimonial-duration: 80s;
  display: flex;
  width: max-content;
  animation: testimonial-marquee var(--testimonial-duration) linear infinite;
  will-change: transform;
}
.testimonial-marquee-group {
  display: flex;
  align-items: center;
  gap: 48px;
  padding-right: 48px;
}
.testimonial-marquee-card { height: 66px; }
.testimonial-marquee-viewport:hover .testimonial-marquee-track,
.testimonial-marquee-viewport:focus-within .testimonial-marquee-track,
.testimonial-marquee-viewport:active .testimonial-marquee-track {
  animation-play-state: paused;
}
```

Remove the old `.animate-marquee` hook and its inline `animation-duration`.

- [ ] **Step 4: Add mobile and reduced-motion rules**

```css
@media (max-width: 767px) {
  .testimonial-marquee-track { --testimonial-duration: 96s; }
  .testimonial-marquee-group { gap: 24px; padding-right: 24px; }
  .testimonial-marquee-card { width: 280px; height: 156px; }
  .testimonial-marquee-viewport {
    -webkit-mask-image: linear-gradient(to right, transparent 0, #000 16px, #000 calc(100% - 16px), transparent 100%);
    mask-image: linear-gradient(to right, transparent 0, #000 16px, #000 calc(100% - 16px), transparent 100%);
  }
}
@media (prefers-reduced-motion: reduce) {
  .testimonial-marquee-viewport {
    overflow-x: auto;
    -webkit-mask-image: none;
    mask-image: none;
  }
  .testimonial-marquee-track { animation: none; transform: none; will-change: auto; }
  .testimonial-marquee-group[aria-hidden="true"] { display: none; }
}
```

- [ ] **Step 5: Verify focused and full tests**

Run:

```bash
node --test --test-name-pattern="testimonial motion readable" tests/light-mode-section-surfaces.test.mjs
node --test tests/light-mode-section-surfaces.test.mjs
git diff --check
```

Expected: all tests pass and the diff check is clean.

- [ ] **Step 6: Run rendered browser QA**

First check for the callable in-app Browser runtime. If unavailable, record the reason and use the existing local Chrome/CDP fallback.

Inspect 390x844, 768x1024, and 1440x900 in light and dark mode plus 390x844 and 1440x900 reduced motion. Verify:

- Normal motion runs at 96s on mobile and 80s at tablet/desktop.
- The reset point is visually seamless and moves exactly one group.
- Hover, focus, and active states pause motion; leaving resumes it.
- Card heights and gaps match the approved responsive values.
- Edge masks are visible but do not obscure readable card centers.
- Reduced motion has no transform/animation, hides all three duplicate groups, and permits native horizontal scrolling through six unique cards.
- Exactly six testimonials remain exposed to assistive technology.
- No document overflow, console errors, or visible changes to mentors or `The Track Record`.

- [ ] **Step 7: Write Task 2 QA report and commit**

Record screenshots, computed values, interaction results, reset-boundary evidence, overflow, accessibility counts, and browser limitations in the required report. Keep ignored evidence local and commit only source/test files:

```bash
git add index.html tests/light-mode-section-surfaces.test.mjs
git commit -m "fix: refine responsive testimonial marquee"
```
