# Methodology Card Identity Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restore distinct, restrained visual identity to the six methodology cards while preserving the premium card architecture, compact mobile layout, and reliable motion system.

**Architecture:** Replace the single shared accent and five category-oriented icon classes with six card-specific color variants. Remove repeated per-card tier markup and restore desktop/tablet icon-to-heading spacing through a scoped copy-container rule; the existing mobile `display: contents` layout keeps its compact icon-heading row and two external group labels.

**Tech Stack:** Static HTML, scoped CSS, Tailwind CDN typography utilities, Node test runner, Chrome responsive QA.

## Global Constraints

- Production changes are limited to methodology CSS and card markup in `index.html`.
- Preserve card surfaces, borders, radius, shadow, grid geometry, descriptions, and `Clear Progress Tracking` heading.
- Preserve the two mobile group labels and compact mobile geometry.
- Preserve the methodology IntersectionObserver, deterministic delays, fail-open behavior, hover measurements, and reduced-motion behavior unchanged.
- Use six distinct restrained color families: blue, indigo, rose, emerald, fuchsia, and violet.
- Remove all six `.methodology-tier` elements and their CSS; do not leave tier-sized whitespace.
- Do not restore 8px bars, saturated `*-500` utility bars, 60px/scale entrance, 4px hover lift, or 1.10 icon scale.
- Do not modify unrelated sections, dependencies, advisor behavior, university ribbon behavior, or mentor assets.

---

### Task 1: Restore Premium Individual Card Identity

**Files:**
- Modify: `index.html:270-351`
- Modify: `index.html:460-505`
- Modify: `index.html:1161-1251`
- Test: `tests/light-mode-section-surfaces.test.mjs:1148-1265`

**Interfaces:**
- Consumes: `.methodology-card`, `.methodology-card-accent`, `.methodology-icon`, `.methodology-card-body`, `.methodology-description`, `.methodology-mobile-group`, and existing motion hooks.
- Produces: six accent variants `.accent-blue`, `.accent-indigo`, `.accent-rose`, `.accent-emerald`, `.accent-fuchsia`, `.accent-violet`; six matching icon variants `.icon-blue`, `.icon-indigo`, `.icon-rose`, `.icon-emerald`, `.icon-fuchsia`, `.icon-violet`; zero `.methodology-tier` nodes.

- [ ] **Step 1: Update and add failing visual-contract tests**

Replace the old assertion that expects six `methodology-tier` instances with an assertion that expects zero. Add exact variant coverage:

```js
test("restores six restrained methodology identities without repeated card tiers", () => {
  const section = html.match(/<section[^>]*id="methodology-section"[\s\S]*?<\/section>/)?.[0] ?? "";
  const accents = ["blue", "indigo", "rose", "emerald", "fuchsia", "violet"];

  assert.equal((section.match(/methodology-tier/g) ?? []).length, 0);
  for (const accent of accents) {
    assert.equal((section.match(new RegExp(`methodology-card-accent accent-${accent}`, "g")) ?? []).length, 1);
    assert.equal((section.match(new RegExp(`methodology-icon icon-${accent}`, "g")) ?? []).length, 1);
    assert.match(html, new RegExp(`\\.accent-${accent}\\s*\\{`));
    assert.match(html, new RegExp(`\\.icon-${accent}\\s*\\{`));
    assert.match(html, new RegExp(`html\\.dark \\.icon-${accent}\\s*\\{`));
  }
  assert.doesNotMatch(html, /\.methodology-card-accent\s*\{[^}]*background:/);
  assert.doesNotMatch(section, /h-2 w-full bg-(?:blue|indigo|red|emerald|pink|purple)-500/);
});
```

Update the existing mobile-only test by removing its obsolete `.methodology-tier { display: none; }` assertion and adding:

```js
assert.equal((section.match(/methodology-mobile-group/g) ?? []).length, 2);
assert.match(mobile, /\.methodology-card-body\s*>\s*\.flex-1\s*\{\s*display:\s*contents/);
```

Add a spacing-preservation contract:

```js
test("keeps premium card spacing after removing repeated tiers", () => {
  assert.match(html, /\.methodology-card-body\s*>\s*\.flex-1\s*\{\s*margin-top:\s*1\.25rem;/);
  const mobile = extractCssBlock(html, "@media (max-width: 767px)");
  assert.match(mobile, /\.methodology-card-body\s*>\s*\.flex-1\s*\{\s*display:\s*contents;/);
  assert.doesNotMatch(html, /\.methodology-tier\s*\{/);
});
```

- [ ] **Step 2: Run focused tests and verify RED**

Run:

```bash
node --test --test-name-pattern="methodology identities|premium card spacing|premium methodology|compacts methodology" tests/light-mode-section-surfaces.test.mjs
```

Expected: failures because the markup still has repeated tiers and shared/category-based accent classes.

- [ ] **Step 3: Implement six restrained accent and icon variants**

Keep `.methodology-card-accent { height: 3px; }`, but remove its shared background. Add:

```css
.accent-blue { background: linear-gradient(90deg, #3b82f6, #60a5fa); }
.accent-indigo { background: linear-gradient(90deg, #4f46e5, #818cf8); }
.accent-rose { background: linear-gradient(90deg, #e11d48, #fb7185); }
.accent-emerald { background: linear-gradient(90deg, #059669, #34d399); }
.accent-fuchsia { background: linear-gradient(90deg, #c026d3, #e879f9); }
.accent-violet { background: linear-gradient(90deg, #7c3aed, #a78bfa); }

.icon-blue { background: rgb(219 234 254 / .82); color: #2563eb; }
.icon-indigo { background: rgb(224 231 255 / .82); color: #4f46e5; }
.icon-rose { background: rgb(255 228 230 / .82); color: #be123c; }
.icon-emerald { background: rgb(209 250 229 / .82); color: #047857; }
.icon-fuchsia { background: rgb(250 232 255 / .82); color: #a21caf; }
.icon-violet { background: rgb(237 233 254 / .84); color: #6d28d9; }
```

Add dark-mode equivalents with translucent `*-900`-family backgrounds and `*-300`-family foregrounds. Keep contrast clear without adding glow.

- [ ] **Step 4: Remove repeated tiers and restore non-mobile spacing**

Delete all six `<p class='methodology-tier'>…</p>` elements and all `.methodology-tier` CSS, including dark and mobile rules. Add:

```css
.methodology-card-body > .flex-1 { margin-top: 1.25rem; }
```

Inside `@media (max-width: 767px)`, retain the existing rule and explicitly neutralize the desktop margin:

```css
.methodology-card-body > .flex-1 {
  display: contents;
  margin-top: 0;
}
```

Update each accent/icon pair in card order to the exact six variants defined in Interfaces. Preserve the two `.methodology-mobile-group` nodes.

- [ ] **Step 5: Run focused and full automated verification**

Run:

```bash
node --test --test-name-pattern="methodology" tests/light-mode-section-surfaces.test.mjs
node --test tests/light-mode-section-surfaces.test.mjs
git diff --check
curl -sS -o /dev/null -w '%{http_code}\n' http://127.0.0.1:4173/index.html
```

Expected: methodology tests and complete suite pass, diff check prints nothing, and curl prints `200`.

- [ ] **Step 6: Perform rendered responsive and motion QA**

Use the in-app Browser first; if its Node REPL runtime is unavailable, record the limitation and use local Google Chrome.

At 390×844, 768×1024, and 1440×900 in light and dark modes, verify:

- six distinct accent and icon families are visually restrained and readable;
- no internal tier labels are visible;
- mobile still shows exactly two external group labels and maintains compact icon-heading rows;
- 768px remains two columns with 32px body padding and 56px icons;
- 1440px remains three columns with 32px body padding and 56px icons;
- descriptions are fully visible and cards remain balanced;
- mobile, tablet, and desktop motion delays match their existing baselines;
- fine-pointer hover remains approximately -2px/1.035, reduced motion remains immediate, and cards do not replay;
- there is no overflow, clipping, page exception, or relevant console error.

Save and inspect evidence under `.superpowers/sdd/2026-08-13-methodology-card-identity/`.

- [ ] **Step 7: Commit and report**

```bash
git add index.html tests/light-mode-section-surfaces.test.mjs
git commit -m "fix: restore methodology card identity"
```

Write `.superpowers/sdd/2026-08-13-methodology-card-identity/final-report.md` with RED/GREEN output, screenshot and measurement evidence, commit hash, and environment limitations.
