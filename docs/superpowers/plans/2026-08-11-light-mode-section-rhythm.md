# Light Mode Section Rhythm Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give the standalone landing page a premium editorial light-mode rhythm in which every major section has a clear visual beginning and end while preserving dark mode and existing behavior.

**Architecture:** Keep the single-file page architecture and add a small semantic surface system to its existing custom CSS. Major sections receive named `surface-*` classes; light-only selectors provide cool, indigo, warm, and paper backgrounds, while the existing Tailwind `dark:` utilities continue to own dark mode. A Node built-in test reads the HTML and protects the surface tokens, section mapping, light-only scoping, and dark-mode classes from regression.

**Tech Stack:** Static HTML, Tailwind CSS CDN, custom CSS variables/classes, JavaScript, Node.js built-in test runner.

## Global Constraints

- Limit the production change to `index.html`.
- Preserve existing content, interactions, responsive behavior, and dark-mode appearance.
- Add no assets, runtime dependencies, or JavaScript for visual separation.
- Use background temperature, restrained atmosphere, card elevation, spacing, and fine boundaries instead of a mechanical alternating stripe pattern.
- Keep decorative layers non-interactive and behind content.
- Preserve all current uncommitted user changes in `index.html`; do not replace the file from `HEAD`.
- Do not stage or commit `.DS_Store`, `.superpowers/`, or `update_fonts.js`.

---

### Task 1: Define and test the semantic light-surface system

**Files:**
- Create: `tests/light-mode-section-surfaces.test.mjs`
- Modify: `index.html:172-214`

**Interfaces:**
- Consumes: Existing `:root`, `.dark`, body, and custom utility rules in `index.html`.
- Produces: CSS tokens `--surface-paper`, `--surface-mist`, `--surface-indigo`, `--surface-warm`, and `--surface-track`; classes `surface-hero`, `surface-results`, `surface-universities`, `surface-methodology`, `surface-programs`, `surface-mentors`, `surface-track-record`, and `surface-full-bleed`.

- [ ] **Step 1: Write the failing structural test**

Create `tests/light-mode-section-surfaces.test.mjs`:

```js
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const html = readFileSync(new URL("../index.html", import.meta.url), "utf8");

test("defines the premium light-mode surface tokens", () => {
  for (const token of [
    "--surface-paper:",
    "--surface-mist:",
    "--surface-indigo:",
    "--surface-warm:",
    "--surface-track:",
  ]) {
    assert.ok(html.includes(token), `missing ${token}`);
  }
});

test("scopes custom section surfaces to light mode", () => {
  for (const surface of [
    "surface-hero",
    "surface-results",
    "surface-universities",
    "surface-methodology",
    "surface-programs",
    "surface-mentors",
    "surface-track-record",
  ]) {
    assert.ok(
      html.includes(`html:not(.dark) .${surface}`),
      `${surface} is not explicitly light-mode scoped`,
    );
  }
});

test("provides a full-bleed canvas for constrained sections", () => {
  assert.match(html, /\.surface-full-bleed\s*\{/);
  assert.match(html, /\.surface-full-bleed::before\s*\{/);
  assert.match(html, /inset:\s*0 calc\(50% - 50vw\)/);
  assert.match(html, /pointer-events:\s*none/);
});
```

- [ ] **Step 2: Run the test and verify it fails**

Run:

```bash
node --test tests/light-mode-section-surfaces.test.mjs
```

Expected: FAIL because the surface tokens and semantic classes do not yet exist.

- [ ] **Step 3: Add the light-mode tokens and reusable surface CSS**

Extend the existing `:root` declaration in `index.html` with:

```css
--surface-paper: 0 0% 100%;
--surface-mist: 214 38% 96%;
--surface-indigo: 235 42% 96%;
--surface-warm: 32 28% 96%;
--surface-track: 213 44% 95%;
```

After the existing `body` rule, add:

```css
html:not(.dark) .surface-hero {
  background:
    radial-gradient(circle at 84% 28%, rgb(99 102 241 / 0.11), transparent 32rem),
    radial-gradient(circle at 70% 72%, rgb(16 185 129 / 0.055), transparent 26rem),
    hsl(var(--surface-paper));
}

html:not(.dark) .surface-results {
  background:
    linear-gradient(180deg, rgb(255 255 255 / 0.35), transparent 18rem),
    hsl(var(--surface-mist));
}

html:not(.dark) .surface-universities {
  background: hsl(var(--surface-paper));
}

html:not(.dark) .surface-methodology {
  background:
    radial-gradient(circle at 50% 0%, rgb(99 102 241 / 0.09), transparent 34rem),
    hsl(var(--surface-indigo));
}

html:not(.dark) .surface-mentors {
  background:
    radial-gradient(circle at 18% 12%, rgb(168 85 247 / 0.06), transparent 28rem),
    hsl(var(--surface-warm));
}

html:not(.dark) .surface-full-bleed {
  position: relative;
  isolation: isolate;
}

html:not(.dark) .surface-full-bleed::before {
  content: "";
  position: absolute;
  inset: 0 calc(50% - 50vw);
  z-index: -1;
  pointer-events: none;
}

html:not(.dark) .surface-programs::before {
  background:
    radial-gradient(circle at 8% 14%, rgb(59 130 246 / 0.055), transparent 30rem),
    radial-gradient(circle at 92% 70%, rgb(99 102 241 / 0.05), transparent 34rem),
    hsl(var(--surface-paper));
}

html:not(.dark) .surface-track-record::before {
  background:
    radial-gradient(circle at 82% 18%, rgb(14 165 233 / 0.07), transparent 30rem),
    hsl(var(--surface-track));
}

@media (max-width: 767px) {
  html:not(.dark) .surface-hero,
  html:not(.dark) .surface-methodology,
  html:not(.dark) .surface-mentors {
    background-size: 38rem 38rem, auto;
  }
}
```

Keep these selectors explicitly under `html:not(.dark)` so they cannot override the existing dark-mode backgrounds.

- [ ] **Step 4: Run the test and verify it passes**

Run:

```bash
node --test tests/light-mode-section-surfaces.test.mjs
```

Expected: 3 tests PASS.

- [ ] **Step 5: Check the HTML diff and commit only this task**

Run:

```bash
git diff --check
git diff -- index.html tests/light-mode-section-surfaces.test.mjs
git add index.html tests/light-mode-section-surfaces.test.mjs
git commit -m "style: add semantic light mode surfaces"
```

Expected: the commit contains the pre-existing staged state of neither `.DS_Store`, `.superpowers/`, nor `update_fonts.js`. Before committing, confirm `git diff --cached --name-only` lists only `index.html` and the new test.

---

### Task 2: Map the surface system onto the page’s editorial sequence

**Files:**
- Modify: `index.html:305,490,525,574,677,1450,2098`
- Modify: `tests/light-mode-section-surfaces.test.mjs`

**Interfaces:**
- Consumes: The `surface-*` classes and surface tokens from Task 1.
- Produces: The approved surface sequence: hero paper, results mist, university white, methodology indigo, programs editorial white, mentors warm, video dark, track record blue-gray, and final CTA dark.

- [ ] **Step 1: Add failing tests for the exact section mapping and dark anchors**

Append to `tests/light-mode-section-surfaces.test.mjs`:

```js
const sectionMappings = [
  ["Cinematic Hero Section", "surface-hero"],
  ["By The Numbers (Success Rate)", "surface-results"],
  ["University Ribbon", "surface-universities"],
  ["Methodology", "surface-methodology"],
  ["Elite Programs", "surface-programs surface-full-bleed"],
  ["Meet The Mentors", "surface-mentors"],
  ["Verified Impact & Video Testimonials", "surface-track-record surface-full-bleed"],
];

test("maps every light section to the approved editorial sequence", () => {
  for (const [comment, classes] of sectionMappings) {
    const start = html.indexOf(comment);
    assert.notEqual(start, -1, `missing section comment: ${comment}`);
    const openingSection = html.slice(start, start + 320);
    for (const className of classes.split(" ")) {
      assert.ok(
        openingSection.includes(className),
        `${comment} is missing ${className}`,
      );
    }
  }
});

test("keeps the cinematic and closing sections dark", () => {
  for (const comment of ["Results & Quotes Ticker", "Final CTA"]) {
    const start = html.indexOf(comment);
    assert.notEqual(start, -1, `missing dark anchor: ${comment}`);
    const openingSection = html.slice(start, start + 320);
    assert.match(openingSection, /bg-(?:slate|zinc)-950/);
  }
});

test("retains dark-mode backgrounds on sections that previously had them", () => {
  for (const className of ["surface-results", "surface-methodology"]) {
    const section = html.match(new RegExp(`<section[^>]*${className}[^>]*>`))?.[0] ?? "";
    assert.match(section, /dark:bg-zinc-950/);
  }
});
```

- [ ] **Step 2: Run the mapping tests and verify they fail**

Run:

```bash
node --test tests/light-mode-section-surfaces.test.mjs
```

Expected: the three new tests FAIL because no section has the semantic surface classes.

- [ ] **Step 3: Apply semantic classes to each existing section**

Modify only the opening section tags associated with these comments:

```html
<!-- Cinematic Hero Section -->
<section id="hero-section" class="surface-hero ...">

<!-- By The Numbers (Success Rate) -->
<section class="surface-results ... bg-slate-50 dark:bg-zinc-950 ...">

<!-- University Ribbon -->
<section class="surface-universities ...">

<!-- Methodology -->
<section class="surface-methodology ... bg-slate-50 dark:bg-zinc-950 ...">

<!-- Elite Programs -->
<section class="surface-programs surface-full-bleed ...">

<!-- Meet The Mentors -->
<section class="surface-mentors ...">

<!-- Verified Impact & Video Testimonials -->
<section class="surface-track-record surface-full-bleed ...">
```

Do not add a light-surface class to `Results & Quotes Ticker`, `Final CTA`, or the footer. Do not remove their dark backgrounds. Do not modify content or rearrange section markup.

- [ ] **Step 4: Run all structural tests**

Run:

```bash
node --test tests/light-mode-section-surfaces.test.mjs
```

Expected: 6 tests PASS.

- [ ] **Step 5: Perform static safety checks**

Run:

```bash
git diff --check
rg -n "surface-(hero|results|universities|methodology|programs|mentors|track-record|full-bleed)" index.html
rg -n "Results & Quotes Ticker|Final CTA|bg-(slate|zinc)-950" index.html
```

Expected: each approved light surface appears in CSS and once on its target section; the dark ticker and final CTA still include `bg-slate-950` or `bg-zinc-950`.

- [ ] **Step 6: Commit the section mapping**

Run:

```bash
git add index.html tests/light-mode-section-surfaces.test.mjs
git diff --cached --name-only
git commit -m "style: separate landing page light sections"
```

Expected: the staged file list contains only `index.html` and `tests/light-mode-section-surfaces.test.mjs`.

---

### Task 3: Verify the finished page visually and protect existing behavior

**Files:**
- Modify if visual correction is required: `index.html`
- Modify if an assertion needs to represent the final approved contract: `tests/light-mode-section-surfaces.test.mjs`

**Interfaces:**
- Consumes: The complete semantic surface system and page mapping from Tasks 1–2.
- Produces: A visually verified light-mode page with unchanged dark mode, responsive behavior, and interactions.

- [ ] **Step 1: Start or reuse the local preview server**

Run:

```bash
python3 -m http.server 4173 --bind 127.0.0.1
```

Open `http://127.0.0.1:4173/index.html`. If port 4173 is already serving this directory, reuse it instead of starting another process.

- [ ] **Step 2: Verify the desktop light-mode sequence**

Set the page to light mode and inspect at approximately 1440 by 900 pixels. Confirm in order:

- the hero is the brightest section and its glow remains behind readable text;
- Results is visibly cooler than the hero and its white cards lift from the canvas;
- the university ribbon reads as a compact white bridge with fine boundaries;
- Methodology has a pale indigo atmosphere distinct from Results;
- Elite Programs returns to editorial white across the full viewport width;
- Mentors is subtly warmer than adjacent academic surfaces;
- the existing dark ticker remains a deliberate visual reset;
- Track Record sits on a cool blue-gray full-width canvas while its inner video gallery remains dark;
- the final CTA and footer remain dark.

Expected: sections are distinguishable without resembling alternating white and gray stripes, and no decorative layer covers or blocks content.

- [ ] **Step 3: Verify mobile light mode**

Inspect at approximately 390 by 844 pixels. Confirm the same surface order, no horizontal scrollbar, no clipped ambient gradients, readable section headings, and intact mobile header and floating contact CTA.

Expected: PASS with the full page width contained inside the viewport.

- [ ] **Step 4: Verify dark mode has not changed**

Toggle dark mode and inspect the hero, Results, Methodology, Elite Programs, Mentors, ticker, Track Record, final CTA, and footer at desktop and mobile widths.

Expected: the new light tokens and gradients do not appear; existing dark backgrounds, cards, borders, and text remain intact.

- [ ] **Step 5: Exercise existing interactions**

Verify the theme toggle, programs accordion/carousel controls, mentor profile modal, video testimonial selection, and floating contact CTA open/close behavior.

Expected: every interaction behaves as before and no new console errors appear.

- [ ] **Step 6: Run final automated and repository checks**

Run:

```bash
node --test tests/light-mode-section-surfaces.test.mjs
git diff --check
git status --short
```

Expected: all 6 tests PASS; no whitespace errors; unrelated user files remain untracked and unstaged.

- [ ] **Step 7: Commit any visual corrections, if made**

If Step 2–5 required changes, run:

```bash
git add index.html tests/light-mode-section-surfaces.test.mjs
git diff --cached --name-only
git commit -m "style: refine light mode editorial rhythm"
```

Expected: commit only `index.html` and the test file. If no corrections were required, do not create an empty commit.
