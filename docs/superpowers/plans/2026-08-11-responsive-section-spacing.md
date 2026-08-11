# Responsive Section Spacing Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Apply one Balanced Premium vertical-spacing system across mobile, tablet, and desktop while preserving intentionally compact bands and all existing behavior.

**Architecture:** Add four semantic CSS utilities to the standalone page, then map each existing section and major introduction wrapper to the correct utility. Keep the hero and floating-advisor clearance as explicit exceptions, and protect the contract with source-level regression tests plus rendered responsive QA.

**Tech Stack:** Standalone HTML, inline CSS, Tailwind CDN utility classes, vanilla JavaScript, Node.js built-in test runner, Chrome/Playwright for rendered verification.

## Global Constraints

- Major sections use 64px mobile, 88px tablet, and 128px desktop vertical padding.
- Dense sections use 56px mobile, 72px tablet, and 96px desktop vertical padding.
- Compact bands use 40px mobile, 48px tablet, and 56px desktop vertical padding.
- Major introduction gaps use 32px mobile, 40px tablet, and 48px desktop spacing.
- The tablet breakpoint is 768px and the desktop breakpoint is 1024px.
- Preserve content, horizontal padding, maximum widths, layouts, colors, interactions, animations, and dark-mode surfaces.
- Reserve 80px of mobile-only clearance after the Elite Programs selector panel, not on the entire section.
- Do not add dependencies or create horizontal overflow.

---

## File Structure

- Modify `index.html`: define semantic spacing utilities and apply them to existing sections and introduction wrappers.
- Modify `tests/light-mode-section-surfaces.test.mjs`: enforce exact spacing values, section mappings, exceptions, and removal of superseded one-off classes.
- Create no production files and add no runtime dependencies.

### Task 1: Define and test the semantic spacing utilities

**Files:**
- Modify: `tests/light-mode-section-surfaces.test.mjs`
- Modify: `index.html:200-300`

**Interfaces:**
- Consumes: existing inline `<style>` block and Node source-contract test suite.
- Produces: `.section-space-major`, `.section-space-dense`, `.section-space-band`, and `.section-intro-gap` CSS utilities with exact responsive values.

- [ ] **Step 1: Write the failing spacing-token test**

Add this test before the Elite Programs selector test:

```js
test("defines the Balanced Premium responsive spacing utilities", () => {
  const style = html.slice(html.indexOf("<!-- Custom CSS classes -->"), html.indexOf("</style>", html.indexOf("<!-- Custom CSS classes -->")));

  for (const rule of [
    /\.section-space-major\s*\{[^}]*padding-block:\s*4rem;/s,
    /\.section-space-dense\s*\{[^}]*padding-block:\s*3\.5rem;/s,
    /\.section-space-band\s*\{[^}]*padding-block:\s*2\.5rem;/s,
    /\.section-intro-gap\s*\{[^}]*margin-bottom:\s*2rem;/s,
    /@media\s*\(min-width:\s*768px\)[\s\S]*?\.section-space-major\s*\{[^}]*padding-block:\s*5\.5rem;/,
    /@media\s*\(min-width:\s*1024px\)[\s\S]*?\.section-space-major\s*\{[^}]*padding-block:\s*8rem;/,
  ]) {
    assert.match(style, rule);
  }
});
```

- [ ] **Step 2: Run the test and confirm the red state**

Run: `node --test tests/light-mode-section-surfaces.test.mjs`

Expected: FAIL only on `defines the Balanced Premium responsive spacing utilities` because the semantic CSS classes do not exist.

- [ ] **Step 3: Add the minimal semantic CSS**

Insert after the `body` rule in `index.html`:

```css
.section-space-major { padding-block: 4rem; }
.section-space-dense { padding-block: 3.5rem; }
.section-space-band { padding-block: 2.5rem; }
.section-intro-gap { margin-bottom: 2rem; }

@media (min-width: 768px) {
  .section-space-major { padding-block: 5.5rem; }
  .section-space-dense { padding-block: 4.5rem; }
  .section-space-band { padding-block: 3rem; }
  .section-intro-gap { margin-bottom: 2.5rem; }
}

@media (min-width: 1024px) {
  .section-space-major { padding-block: 8rem; }
  .section-space-dense { padding-block: 6rem; }
  .section-space-band { padding-block: 3.5rem; }
  .section-intro-gap { margin-bottom: 3rem; }
}
```

- [ ] **Step 4: Run the focused suite and confirm green**

Run: `node --test tests/light-mode-section-surfaces.test.mjs`

Expected: all tests PASS.

- [ ] **Step 5: Commit the spacing foundation**

```bash
git add index.html tests/light-mode-section-surfaces.test.mjs
git commit -m "style: add responsive section spacing tokens"
```

### Task 2: Map every section and introduction to the spacing system

**Files:**
- Modify: `tests/light-mode-section-surfaces.test.mjs`
- Modify: `index.html:404-2516`

**Interfaces:**
- Consumes: the four semantic spacing classes from Task 1.
- Produces: exact class mappings on all major sections, compact bands, and section introductions; an explicit mobile-only `.program-selector-clearance` exception.

- [ ] **Step 1: Write the failing section-mapping test**

Add:

```js
test("maps sections to the Balanced Premium rhythm", () => {
  for (const surface of ["surface-methodology", "surface-programs", "surface-mentors", "surface-track-record"]) {
    assert.match(html, new RegExp(`<section[^>]*${surface}[^>]*section-space-major`));
  }
  assert.match(html, /<section[^>]*surface-results[^>]*section-space-dense/);
  assert.match(html, /<section[^>]*surface-universities[^>]*section-space-band/);
  assert.match(html, /<section[^>]*section-space-band[^>]*>[\s\S]*?Scrolling Track/);
  assert.match(html, /<section[^>]*section-space-major[^>]*scroll-reveal[^>]*>/);
  assert.match(html.match(/<footer[^>]*>/)?.[0] ?? "", /section-space-dense/);

  const body = html.slice(html.indexOf("</style>"));
  assert.equal((body.match(/section-intro-gap/g) ?? []).length, 4);
  assert.match(html, /class="lg:hidden program-selector-clearance"/);
  assert.doesNotMatch(html, /class="lg:hidden pb-24"/);
});
```

- [ ] **Step 2: Run the suite and confirm the red state**

Run: `node --test tests/light-mode-section-surfaces.test.mjs`

Expected: FAIL on the new mapping assertions because sections still use one-off Tailwind padding classes.

- [ ] **Step 3: Apply section mappings and remove superseded vertical padding**

Use these exact mappings:

```text
Hero: keep pt-28 md:pt-32; change bottom spacing to pb-16 md:pb-[5.5rem] lg:pb-32
Results: section-space-dense
University logos: section-space-band
Methodology: section-space-major
Elite Programs: section-space-major
Mentors: section-space-major
Results & Quotes Ticker: section-space-band
Track Record: section-space-major
Final CTA: section-space-major
Footer: section-space-dense
```

Remove the replaced `py-*`, `pt-*`, and `pb-*` section-level classes so semantic CSS is the sole owner of those vertical values. Preserve all unrelated classes.

- [ ] **Step 4: Normalize introduction wrappers and advisor clearance**

Replace the existing bottom-margin classes on the Methodology, Elite Programs, Mentors, and Track Record introduction wrappers with `section-intro-gap`.

Add this CSS beside the spacing utilities:

```css
.program-selector-clearance { padding-bottom: 5rem; }

@media (min-width: 1024px) {
  .program-selector-clearance { padding-bottom: 0; }
}
```

Change the Elite Programs mobile wrapper from `class="lg:hidden pb-24"` to `class="lg:hidden program-selector-clearance"`.

- [ ] **Step 5: Run regression and source-quality checks**

Run:

```bash
node --test tests/light-mode-section-surfaces.test.mjs
git diff --check
```

Expected: all tests PASS and `git diff --check` exits 0.

- [ ] **Step 6: Commit the responsive mappings**

```bash
git add index.html tests/light-mode-section-surfaces.test.mjs
git commit -m "style: normalize responsive section rhythm"
```

### Task 3: Verify rendered rhythm and interaction safety

**Files:**
- Modify only if QA finds a spacing defect: `index.html`
- Test: temporary Playwright script under `/tmp`, never committed

**Interfaces:**
- Consumes: completed semantic spacing mappings from Tasks 1 and 2 and the live preview URL.
- Produces: screenshot and interaction evidence at 390px, 768px, and 1440px in light and dark modes.

- [ ] **Step 1: Start or verify the local preview**

Run: `curl -s -o /dev/null -w '%{http_code}\n' http://127.0.0.1:4173/index.html`

Expected: `200`. If the preview is not running, start a non-mutating static server for `html-version` on port 4173.

- [ ] **Step 2: Capture the full page at all required widths**

Using the Browser skill when its controller is available, otherwise the already-approved local Chrome/Playwright fallback, capture light and dark screenshots at:

```text
390x844
768x1024
1440x900
```

Save screenshots under `/tmp/responsive-spacing-*`; do not add them to git.

- [ ] **Step 3: Measure and inspect the spacing contract**

For each viewport, verify:

```text
Major section computed padding matches 64px / 88px / 128px.
Dense section computed padding matches 56px / 72px / 96px.
Compact band computed padding matches 40px / 48px / 56px.
Intro gaps match 32px / 40px / 48px.
No adjacent section has an unexplained blank band or background seam.
document.documentElement.scrollWidth <= document.documentElement.clientWidth.
```

- [ ] **Step 4: Exercise interaction-sensitive boundaries**

At 390px, select all six Elite Programs tabs and confirm the panel action can scroll fully above the advisor bar. At 1440px, confirm the program stage remains below the fixed header while sticky. Toggle light/dark mode once at each width and check that spacing does not shift.

- [ ] **Step 5: Correct any verified defect with a red-green loop**

If QA reveals a mismatch, first add a focused assertion to `tests/light-mode-section-surfaces.test.mjs`, run it to see the expected failure, apply the smallest `index.html` correction, then rerun the suite and the affected rendered check. Do not make aesthetic changes outside the approved spacing system.

- [ ] **Step 6: Run final verification**

Run:

```bash
node --test tests/light-mode-section-surfaces.test.mjs
git diff --check
git status --short
curl -s -o /dev/null -w 'preview_http=%{http_code}\n' http://127.0.0.1:4173/index.html
```

Expected: all tests PASS, no diff errors, only known unrelated untracked files remain, and `preview_http=200`.

- [ ] **Step 7: Commit QA corrections only if Step 5 changed tracked files**

```bash
git add index.html tests/light-mode-section-surfaces.test.mjs
git commit -m "fix: refine responsive section spacing"
```

Do not create an empty commit when rendered QA requires no correction.
