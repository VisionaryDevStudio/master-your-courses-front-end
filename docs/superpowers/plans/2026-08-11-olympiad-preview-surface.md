# Olympiad Preview Surface Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove the graph-paper squares from the Olympiad USAPhO preview and replace them with a restrained smooth slate gradient in every rendered source.

**Architecture:** Update both copies of the Olympiad mockup in the standalone HTML: the legacy hidden markup and the `PROGRAMS_MOCKUPS` data used by the shared mobile and desktop previews. Add a focused source-contract test, then verify the Olympiad state in the live responsive page.

**Tech Stack:** Standalone HTML, Tailwind CDN classes, vanilla JavaScript, Node.js built-in test runner, Chrome/Playwright rendered QA.

## Global Constraints

- Remove only the graph-paper overlay inside the USAPhO problem panel.
- Preserve the dark slate panel, rounded geometry, problem copy, mathematical accents, purple label, border, and surrounding mockup.
- Use a smooth tonal gradient with no visible repeating pattern.
- Do not change other program mockups, section surfaces, interactions, or dependencies.

---

### Task 1: Replace the Olympiad grid with a smooth tonal surface

**Files:**
- Modify: `tests/light-mode-section-surfaces.test.mjs`
- Modify: `index.html:1219-1230,1462`

**Interfaces:**
- Consumes: the existing static Olympiad mockup and the sixth `PROGRAMS_MOCKUPS` entry.
- Produces: two matching grid-free USAPhO problem panels rendered through existing program-selection logic.

- [ ] **Step 1: Write the failing regression test**

Add:

```js
test("keeps the Olympiad preview free of graph-paper squares", () => {
  const programsStart = html.indexOf("Elite Programs");
  const mentorsStart = html.indexOf("Meet The Mentors", programsStart);
  const programs = html.slice(programsStart, mentorsStart);

  assert.equal((programs.match(/USAPhO Simulator/g) ?? []).length, 2);
  assert.doesNotMatch(programs, /background-size:\s*12px 12px/);
  assert.doesNotMatch(programs, /linear-gradient\(white 1px, transparent 1px\)/);
  assert.equal((programs.match(/bg-gradient-to-br from-slate-700 via-slate-700 to-slate-800/g) ?? []).length, 2);
});
```

- [ ] **Step 2: Run the suite and confirm the red state**

Run: `node --test tests/light-mode-section-surfaces.test.mjs`

Expected: FAIL because both Olympiad sources still contain the 12px grid and neither has the approved tonal-gradient classes.

- [ ] **Step 3: Update both Olympiad problem panels**

In the static markup and escaped `PROGRAMS_MOCKUPS` string, change the panel class from:

```html
bg-slate-700
```

to:

```html
bg-gradient-to-br from-slate-700 via-slate-700 to-slate-800
```

Remove this overlay from both copies:

```html
<div class="absolute inset-0 opacity-[0.12]" style="background-image: linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px); background-size: 12px 12px"></div>
```

For the escaped JavaScript string, preserve the surrounding `\n` formatting and escaped quotes. Do not alter any content after the removed overlay.

- [ ] **Step 4: Run regression and source-quality checks**

Run:

```bash
node --test tests/light-mode-section-surfaces.test.mjs
git diff --check
```

Expected: all tests PASS and the diff check exits 0.

- [ ] **Step 5: Commit the implementation**

```bash
git add index.html tests/light-mode-section-surfaces.test.mjs
git commit -m "style: simplify olympiad preview surface"
```

### Task 2: Verify the rendered Olympiad preview

**Files:**
- Modify only if QA finds a defect: `index.html`
- Test artifacts: `/tmp/olympiad-preview-*`, never committed

**Interfaces:**
- Consumes: the grid-free Olympiad sources from Task 1 and live preview URL.
- Produces: visual evidence that mobile and desktop show a smooth dark problem panel without changing selection behavior.

- [ ] **Step 1: Verify the preview server**

Run: `curl -s -o /dev/null -w '%{http_code}\n' http://127.0.0.1:4173/index.html`

Expected: `200`.

- [ ] **Step 2: Select Olympiad and capture responsive evidence**

Use the Browser skill when available; otherwise use the previously approved local Chrome/Playwright fallback. At `390x844` and `1440x900`, select `Olympiad` or `Olympiad & Contests`, wait for the shared preview transition, and save light-mode screenshots under `/tmp/olympiad-preview-mobile.png` and `/tmp/olympiad-preview-desktop.png`.

- [ ] **Step 3: Inspect the accepted screenshots**

Confirm the USAPhO problem surface is a smooth slate tone with no square pattern, the problem text remains legible, the purple label and mathematical accents remain present, and the surrounding preview geometry is unchanged.

- [ ] **Step 4: Verify interaction and runtime health**

Confirm selecting away from Olympiad and back updates the shared preview correctly, there is no horizontal overflow, and no new page errors occur.

- [ ] **Step 5: Run the final verification gate**

Run:

```bash
node --test tests/light-mode-section-surfaces.test.mjs
git diff --check
git status --short
curl -s -o /dev/null -w 'preview_http=%{http_code}\n' http://127.0.0.1:4173/index.html
```

Expected: all tests PASS, no diff errors, only known unrelated untracked files remain, and `preview_http=200`.
