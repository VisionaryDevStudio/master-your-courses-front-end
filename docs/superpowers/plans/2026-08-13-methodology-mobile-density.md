# Methodology Mobile Density Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Shorten and clarify the mobile methodology section while leaving its approved tablet and desktop presentation unchanged.

**Architecture:** Preserve the existing card markup structure and motion hooks, adding only two mobile group labels and scoped CSS below `768px`. On mobile, CSS Grid repositions the existing icon, heading, and description into a compact header-plus-copy composition; at tablet and desktop, the new labels remain hidden and all existing card rules continue to govern.

**Tech Stack:** Static HTML, Tailwind CDN utilities, scoped CSS media queries, Node test runner, local HTTP preview, Chrome responsive QA.

## Global Constraints

- Production changes are limited to methodology markup and scoped mobile CSS in `index.html`.
- Apply compact composition only under `@media (max-width: 767px)`.
- Preserve the approved 768px and 1440px card layout, padding, icon size, tier visibility, grid, hover, and motion delays.
- Keep all six descriptions fully visible; do not clamp, truncate, collapse, or hide content.
- Preserve the existing methodology reveal controller, fail-open behavior, reduced-motion behavior, and card order.
- Do not use fixed card heights.
- Do not add a carousel, accordion, dependency, decorative square, or unrelated page change.
- Preserve unrelated user files and uncommitted mentor assets.

---

### Task 1: Compact Mobile Methodology List

**Files:**
- Modify: `index.html:270-351`
- Modify: `index.html:460-462`
- Modify: `index.html:1120-1208`
- Test: `tests/light-mode-section-surfaces.test.mjs`

**Interfaces:**
- Consumes: existing `.methodology-grid`, `.methodology-card`, `.methodology-card-body`, `.methodology-icon`, `.methodology-tier`, `.methodology-description`, `data-methodology-index`, and methodology reveal controller.
- Produces: two `.methodology-mobile-group` elements with `Core Method` and `Ongoing Support`, plus mobile-only compact grid rules; no JavaScript interface changes.

- [ ] **Step 1: Add failing mobile composition and isolation tests**

Append these focused contracts:

```js
test("uses two mobile-only methodology group labels without hiding card content", () => {
  const section = html.match(/<section[^>]*id="methodology-section"[\s\S]*?<\/section>/)?.[0] ?? "";
  assert.equal((section.match(/methodology-mobile-group/g) ?? []).length, 2);
  assert.match(section, /methodology-mobile-group[^>]*>Core Method</);
  assert.match(section, /methodology-mobile-group[^>]*>Ongoing Support</);
  assert.equal((section.match(/methodology-description/g) ?? []).length, 6);
  assert.doesNotMatch(html, /methodology-description[^\n{]*(?:line-clamp|display:\s*none|visibility:\s*hidden)/);
});

test("compacts methodology cards only below the tablet breakpoint", () => {
  const mobile = html.match(/@media \(max-width:\s*767px\)\s*\{[\s\S]*?\n\s*\}/g)?.join("\n") ?? "";
  assert.match(html, /\.methodology-mobile-group\s*\{\s*display:\s*none;/);
  assert.match(mobile, /\.methodology-mobile-group\s*\{[\s\S]*display:\s*block/);
  assert.match(mobile, /\.methodology-card-body\s*\{[\s\S]*display:\s*grid[\s\S]*grid-template-columns:\s*2\.75rem\s+minmax\(0,\s*1fr\)[\s\S]*padding:\s*1\.25rem/);
  assert.match(mobile, /\.methodology-icon\s*\{[\s\S]*width:\s*2\.75rem[\s\S]*height:\s*2\.75rem/);
  assert.match(mobile, /\.methodology-tier\s*\{\s*display:\s*none/);
  assert.match(mobile, /\.methodology-card-body\s*>\s*\.flex-1\s*\{\s*display:\s*contents/);
  assert.match(mobile, /\.methodology-description\s*\{[\s\S]*grid-column:\s*1\s*\/\s*-1/);
});
```

If the media-query extraction is too brittle for the existing stylesheet shape, use a helper that slices from the exact `@media (max-width: 767px)` marker to the next known surface rule, but keep assertions scoped to that block.

- [ ] **Step 2: Run focused tests and verify RED**

Run:

```bash
node --test --test-name-pattern="mobile-only methodology|compacts methodology" tests/light-mode-section-surfaces.test.mjs
```

Expected: two failures because the group-label hooks and compact mobile CSS do not exist.

- [ ] **Step 3: Add the mobile group labels**

Add one label immediately before card index 0 and one immediately before card index 3:

```html
<p class="methodology-mobile-group" id="methodology-core-group">Core Method</p>
```

```html
<p class="methodology-mobile-group" id="methodology-support-group">Ongoing Support</p>
```

Keep the labels as visible structural text without `aria-labelledby`; each article retains its own visible heading as its useful local label. Do not add duplicate desktop-visible labels.

- [ ] **Step 4: Add the scoped compact layout**

Add a hidden default rule outside the media query:

```css
.methodology-mobile-group { display: none; }
```

Inside the existing `@media (max-width: 767px)` block, replace the single methodology padding rule with:

```css
.methodology-mobile-group {
  display: block;
  margin: .375rem 0 -.25rem;
  color: #4f46e5;
  font-size: .6875rem;
  font-weight: 800;
  letter-spacing: .14em;
  text-transform: uppercase;
}
html.dark .methodology-mobile-group { color: #a5b4fc; }
.methodology-card-body {
  display: grid;
  grid-template-columns: 2.75rem minmax(0, 1fr);
  grid-template-rows: auto auto;
  column-gap: .875rem;
  row-gap: .875rem;
  min-height: 0;
  padding: 1.25rem;
}
.methodology-icon {
  grid-column: 1;
  grid-row: 1;
  width: 2.75rem;
  height: 2.75rem;
  border-radius: .875rem;
}
.methodology-icon svg { width: 1.375rem; height: 1.375rem; }
.methodology-tier { display: none; }
.methodology-card-body > .flex-1 { display: contents; }
.methodology-card h3 {
  grid-column: 2;
  grid-row: 1;
  align-self: center;
  margin-bottom: 0;
}
.methodology-description {
  grid-column: 1 / -1;
  grid-row: 2;
}
```

Do not add `height`, `max-height`, overflow clipping, or text clamping. Keep the existing `.methodology-card` surface and accent unchanged.

- [ ] **Step 5: Run focused and full automated verification**

Run:

```bash
node --test --test-name-pattern="methodology" tests/light-mode-section-surfaces.test.mjs
node --test tests/light-mode-section-surfaces.test.mjs
git diff --check
curl -sS -o /dev/null -w '%{http_code}\n' http://127.0.0.1:4173/index.html
```

Expected: all methodology contracts and the complete suite pass, diff check prints nothing, and curl prints `200`.

- [ ] **Step 6: Perform rendered breakpoint and motion QA**

Use the in-app Browser first. If its Node REPL runtime is unavailable, record that exact limitation and use the already approved local Google Chrome fallback.

At 390×844 in light, dark, and reduced-motion modes, verify:

- exactly two group labels are visible in the correct positions;
- all six per-card `.methodology-tier` labels are hidden;
- icon and heading share one row;
- descriptions remain fully visible;
- typical card heights fall near 170–190px without fixed heights;
- all six cards reveal once without blank gaps or replay;
- no horizontal overflow, clipping, console errors, or page exceptions.

At 768×1024 and 1440×900, compare computed values against the approved baseline:

- group labels: `display: none`;
- per-card tier labels: visible;
- body padding: `32px`;
- icon width/height: `56px`;
- grid columns: 2 at 768px and 3 at 1440px;
- motion delays: `0/70/0/70/0/70ms` at 768px and `0/70/140/0/70/140ms` at 1440px;
- desktop fine-pointer hover remains approximately `-2px` with icon scale `1.035`.

Save and visually inspect screenshots and measurements under `.superpowers/sdd/2026-08-13-methodology-mobile-density/`.

- [ ] **Step 7: Commit the scoped implementation**

```bash
git add index.html tests/light-mode-section-surfaces.test.mjs
git commit -m "feat: compact mobile methodology cards"
```

- [ ] **Step 8: Final report**

Write `.superpowers/sdd/2026-08-13-methodology-mobile-density/final-report.md` with RED/GREEN evidence, responsive measurements, screenshots, test output, commit hash, and environment limitations.
