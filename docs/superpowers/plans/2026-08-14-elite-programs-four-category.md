# Elite Programs Four-Category Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the six-option Elite Programs selector with four clear categories while preserving the established mobile tab panel, desktop selector, sticky preview stage, motion, and visual language.

**Architecture:** Keep `PROGRAMS_DATA`, `PROGRAMS_MOCKUPS`, `setActiveProgram`, and `updateUI` as the shared state path. Reduce every rendered selector to the same four-item order, add a dedicated coverage line to the shared mobile and desktop stages, reuse the strongest existing preview mockups, and delete the permanently hidden legacy accordion rather than maintaining obsolete duplicated content.

**Tech Stack:** Static HTML, Tailwind CDN utilities, scoped CSS, inline SVG, vanilla JavaScript, Node.js built-in test runner, local HTTP preview, Chrome browser QA.

## Global Constraints

- Category order is exactly: `AP Prep`, `1-on-1 Tutoring`, `SAT Prep`, `Competition Prep`.
- AP Prep covers all AP STEM courses through Mastery Engines, live programs, and private AP tutoring.
- General 1-on-1 Tutoring covers high-school and university courses and must not duplicate AP tutoring.
- SAT Prep says `SAT Math now, broader SAT later`; it must not imply full SAT coverage already exists.
- Competition Prep covers `AMC, AIME, F=ma, Physics Olympiad, and more`.
- Preserve the current mobile horizontal tab rail, one shared mobile panel, desktop selector, sticky stage, spacing, surfaces, radii, shadows, and transition behavior.
- AP Prep is selected by default.
- CTA destinations remain placeholders; visible CTA labels must be category-specific.
- Preserve reduced-motion behavior, keyboard navigation, focus visibility, advisor clearance, and no page-level horizontal overflow.
- Do not modify any section outside Elite Programs.

---

### Task 1: Consolidate Elite Programs Content and Markup

**Files:**
- Modify: `tests/light-mode-section-surfaces.test.mjs:411-426`
- Modify: `tests/light-mode-section-surfaces.test.mjs:488-497`
- Modify: `index.html:1258-2045`

**Interfaces:**
- Consumes: The current mobile tab rail, shared mobile panel, desktop `.program-list-item` selector, sticky stage, and the six existing preview mockups.
- Produces: Four mobile tabs, four desktop selector items, shared coverage-line hooks, an AP pathway preview, and four retained preview entries in the approved order.

- [ ] **Step 1: Add failing four-category structure tests**

Replace the six-tab expectations in `uses a compact accessible Elite Programs mobile selector` and add this focused category contract:

```js
test("uses the approved four Elite Programs categories across mobile and desktop", () => {
  const programsStart = html.indexOf("Elite Programs");
  const mentorsStart = html.indexOf("Meet The Mentors", programsStart);
  const programs = html.slice(programsStart, mentorsStart);
  const approvedTitles = ["AP Prep", "1-on-1 Tutoring", "SAT Prep", "Competition Prep"];

  assert.equal((programs.match(/class="program-mobile-tab\b/g) ?? []).length, 4);
  assert.equal((programs.match(/class="program-list-item\b/g) ?? []).length, 4);
  assert.equal((programs.match(/role="tab"/g) ?? []).length, 4);
  assert.equal((programs.match(/aria-controls="program-mobile-panel"/g) ?? []).length, 4);

  for (const title of approvedTitles) {
    assert.ok(programs.includes(`>${title}<`), `missing selector title ${title}`);
  }

  assert.match(programs, /id="mobile-program-coverage"/);
  assert.match(programs, /id="stage-coverage"/);
  assert.doesNotMatch(programs, /class="program-acc-item\b/);
  assert.doesNotMatch(programs, />AP STEM<|>SAT Math<|>Mastery Engines<|>1-on-1 AP<|>University<|>Olympiad</);
});
```

Update the existing compact-selector test to expect four tabs, four `role="tab"` values, and four shared-panel controls.

- [ ] **Step 2: Run the focused tests and confirm RED**

Run:

```bash
node --test --test-name-pattern="Elite Programs|compact accessible" tests/light-mode-section-surfaces.test.mjs
```

Expected: FAIL because six tabs/list items remain, coverage hooks are absent, and hidden accordion markup still exists.

- [ ] **Step 3: Replace the mobile tabs and remove the obsolete accordion**

Use these exact mobile controls:

```html
<button id="program-mobile-tab-0" class="program-mobile-tab snap-start shrink-0 rounded-full border px-4 py-3 text-sm font-bold transition-all" type="button" role="tab" aria-selected="true" aria-controls="program-mobile-panel" tabindex="0" onclick="setActiveProgram(0, this)" onkeydown="handleProgramTabKeydown(event, 0)">AP Prep</button>
<button id="program-mobile-tab-1" class="program-mobile-tab snap-start shrink-0 rounded-full border px-4 py-3 text-sm font-bold transition-all" type="button" role="tab" aria-selected="false" aria-controls="program-mobile-panel" tabindex="-1" onclick="setActiveProgram(1, this)" onkeydown="handleProgramTabKeydown(event, 1)">1-on-1</button>
<button id="program-mobile-tab-2" class="program-mobile-tab snap-start shrink-0 rounded-full border px-4 py-3 text-sm font-bold transition-all" type="button" role="tab" aria-selected="false" aria-controls="program-mobile-panel" tabindex="-1" onclick="setActiveProgram(2, this)" onkeydown="handleProgramTabKeydown(event, 2)">SAT Prep</button>
<button id="program-mobile-tab-3" class="program-mobile-tab snap-start shrink-0 rounded-full border px-4 py-3 text-sm font-bold transition-all" type="button" role="tab" aria-selected="false" aria-controls="program-mobile-panel" tabindex="-1" onclick="setActiveProgram(3, this)" onkeydown="handleProgramTabKeydown(event, 3)">Competition</button>
```

Inside the shared mobile panel, insert this line between the title and supporting description:

```html
<p id="mobile-program-coverage" class="mt-2 text-sm font-bold text-foreground/85"></p>
```

Delete the entire permanently hidden block containing `.program-acc-item` elements. Do not retain old six-program content in hidden markup.

- [ ] **Step 4: Replace the desktop selector with four items**

Keep the existing `.program-list-item` structure, event handlers, progress strip, icon container, spacing, and active/inactive classes. Render exactly four items with `data-index`, `onmouseenter`, and `onclick` values `0` through `3`:

```html
<h3 class="program-list-title ...">AP Prep</h3>
<p class="program-list-coverage text-xs font-bold text-foreground/75 mt-1">All AP STEM courses</p>
<p class="program-list-desc ...">Self-paced Mastery Engines, live programs, and private AP tutoring.</p>

<h3 class="program-list-title ...">1-on-1 Tutoring</h3>
<p class="program-list-coverage text-xs font-bold text-foreground/75 mt-1">High-school and university courses</p>
<p class="program-list-desc ...">Personalized tutoring matched to the student's exact course and goals.</p>

<h3 class="program-list-title ...">SAT Prep</h3>
<p class="program-list-coverage text-xs font-bold text-foreground/75 mt-1">SAT Math now, broader SAT later</p>
<p class="program-list-desc ...">Targeted instruction, practice, and score-improvement programs.</p>

<h3 class="program-list-title ...">Competition Prep</h3>
<p class="program-list-coverage text-xs font-bold text-foreground/75 mt-1">AMC, AIME, F=ma, Physics Olympiad, and more</p>
<p class="program-list-desc ...">Advanced preparation for competitive STEM exams.</p>
```

Use the existing emerald target icon for AP, purple mentor/graduation icon for tutoring, blue chart icon for SAT, and rose trophy icon for competition.

- [ ] **Step 5: Add the shared stage coverage line and update initial AP content**

Add:

```html
<p id="stage-coverage" class="text-sm font-bold text-foreground/80 mb-2">All AP STEM courses</p>
```

between `#stage-title` and `#stage-desc`. Set the initial stage title to `AP Prep`, description to `Self-paced Mastery Engines, live programs, and private AP tutoring.`, CTA to `Explore AP Prep`, and proof to `Complete AP STEM Pathway`.

- [ ] **Step 6: Reduce the preview array to four approved previews**

Keep the current preview frame and array interface. Build `PROGRAMS_MOCKUPS` in this exact order:

1. **AP Prep:** Update the current Bootcamp Schedule mockup header to `AP STEM Pathway`. Show compact course chips for `Biology`, `Chemistry`, `Physics`, `Calculus`, `Statistics`, and `Computer Science`, plus three visible delivery rows labeled `Mastery Engine`, `Live Programs`, and `Private Tutoring`. Include the caption `All AP STEM courses` so the named chips read as examples rather than limits.
2. **1-on-1 Tutoring:** Retain the existing mentor-profile mockup containing `Dr. Sherri, M.D.` and change its internal action label to `Find Your Tutor`.
3. **SAT Prep:** Retain the existing `SAT Math Performance` score-dashboard mockup unchanged.
4. **Competition Prep:** Retain the existing `USAPhO Simulator` mockup and smooth slate problem panel unchanged.

Remove the old standalone Mastery Engine and University Physics preview entries.

- [ ] **Step 7: Run the focused and full static gates**

Run:

```bash
node --test --test-name-pattern="Elite Programs|compact accessible|Olympiad preview" tests/light-mode-section-surfaces.test.mjs
node --test tests/light-mode-section-surfaces.test.mjs
git diff --check
```

Expected: focused tests PASS, full suite PASS, and no whitespace errors.

- [ ] **Step 8: Commit the four-category markup**

```bash
git add index.html tests/light-mode-section-surfaces.test.mjs
git commit -m "feat: consolidate elite program categories"
```

---

### Task 2: Synchronize Four-Category State and Accessibility

**Files:**
- Modify: `tests/light-mode-section-surfaces.test.mjs`
- Modify: `index.html:1915-2065`

**Interfaces:**
- Consumes: Four mobile tabs, four desktop list items, `#mobile-program-coverage`, `#stage-coverage`, and the four-element `PROGRAMS_MOCKUPS` from Task 1.
- Produces: A canonical four-object `PROGRAMS_DATA` model and guarded state rendering across mobile and desktop.

- [ ] **Step 1: Add failing canonical-data and controller tests**

Add:

```js
test("drives Elite Programs from one guarded four-category data model", () => {
  const programsStart = html.indexOf("Elite Programs");
  const mentorsStart = html.indexOf("Meet The Mentors", programsStart);
  const programs = html.slice(programsStart, mentorsStart);

  assert.match(programs, /const PROGRAMS_DATA = \[[\s\S]*"title":"AP Prep"[\s\S]*"title":"1-on-1 Tutoring"[\s\S]*"title":"SAT Prep"[\s\S]*"title":"Competition Prep"[\s\S]*\];/);
  assert.equal((programs.match(/"coverage":/g) ?? []).length, 4);
  assert.equal((programs.match(/"title":/g) ?? []).length, 4);
  assert.match(programs, /if \(!Number\.isInteger\(idx\) \|\| idx < 0 \|\| idx >= PROGRAMS_DATA\.length\) return;/);
  assert.match(programs, /mobile-program-coverage['"]\)\.innerText = activeData\.coverage/);
  assert.match(programs, /stage-coverage['"]\)\.innerText = prog\.coverage/);
  assert.doesNotMatch(programs, /querySelectorAll\(['"]\.program-acc-item/);
});
```

Also assert all four exact coverage strings, descriptions, CTA labels, and proof strings occur in `PROGRAMS_DATA`.

- [ ] **Step 2: Run the focused test and confirm RED**

Run:

```bash
node --test --test-name-pattern="guarded four-category" tests/light-mode-section-surfaces.test.mjs
```

Expected: FAIL because the old six-object data model remains, no `coverage` fields exist, and invalid indices are not guarded.

- [ ] **Step 3: Replace `PROGRAMS_DATA` with the canonical four objects**

Use:

```js
const PROGRAMS_DATA = [
  {"title":"AP Prep","coverage":"All AP STEM courses","desc":"Self-paced Mastery Engines, live programs, and private AP tutoring.","iconColor":"text-emerald-600 dark:text-emerald-400","glowColor":"rgba(16, 185, 129, 0.12)","cta":"Explore AP Prep","proof":"Complete AP STEM Pathway"},
  {"title":"1-on-1 Tutoring","coverage":"High-school and university courses","desc":"Personalized tutoring matched to the student's exact course and goals.","iconColor":"text-violet-600 dark:text-violet-400","glowColor":"rgba(139, 92, 246, 0.12)","cta":"Find Your Tutor","proof":"Matched to Course and Goals"},
  {"title":"SAT Prep","coverage":"SAT Math now, broader SAT later","desc":"Targeted instruction, practice, and score-improvement programs.","iconColor":"text-blue-600 dark:text-blue-400","glowColor":"rgba(59, 130, 246, 0.12)","cta":"Explore SAT Prep","proof":"Focused SAT Math Improvement"},
  {"title":"Competition Prep","coverage":"AMC, AIME, F=ma, Physics Olympiad, and more","desc":"Advanced preparation for competitive STEM exams.","iconColor":"text-rose-600 dark:text-rose-400","glowColor":"rgba(244, 63, 94, 0.12)","cta":"Explore Competition Prep","proof":"Advanced STEM Competition Training"}
];
```

- [ ] **Step 4: Guard state changes and render coverage synchronously**

Start `setActiveProgram` with:

```js
if (!Number.isInteger(idx) || idx < 0 || idx >= PROGRAMS_DATA.length) return;
```

In the mobile panel update, add:

```js
document.getElementById('mobile-program-coverage').innerText = activeData.coverage;
```

In the delayed desktop stage update, add:

```js
document.getElementById('stage-coverage').innerText = prog.coverage;
```

Delete the obsolete `.program-acc-item` update loop. Keep mobile tab selection, desktop list selection, proof, CTA, mockup, glow, progress, auto-advance, and reduced-motion-aware tab scrolling behavior.

- [ ] **Step 5: Keep coverage styling synchronized in the desktop list**

Within the `.program-list-item` loop, retain the coverage line at all times and update its active/inactive color class without collapsing it:

```js
const coverage = item.querySelector('.program-list-coverage');
coverage.className = 'program-list-coverage text-xs font-bold mt-1 ' + (isActive ? 'text-foreground/75' : 'text-muted-foreground');
```

Only `.program-list-desc` continues to expand and collapse.

- [ ] **Step 6: Run focused and full tests**

Run:

```bash
node --test --test-name-pattern="Elite Programs|guarded four-category|compact accessible|Olympiad preview" tests/light-mode-section-surfaces.test.mjs
node --test tests/light-mode-section-surfaces.test.mjs
git diff --check
```

Expected: focused tests PASS, full suite PASS, and no whitespace errors.

- [ ] **Step 7: Commit the controller correction**

```bash
git add index.html tests/light-mode-section-surfaces.test.mjs
git commit -m "fix: synchronize elite program selection"
```

---

### Task 3: Responsive Rendered QA

**Files:**
- Verify: `index.html`
- Verify: `tests/light-mode-section-surfaces.test.mjs`

**Interfaces:**
- Consumes: The completed four-category markup, data model, mockups, and controller.
- Produces: Retained evidence that all categories work in light/dark mode across mobile, tablet, and desktop without visual or interaction regressions.

- [ ] **Step 1: Start and verify an isolated preview**

Run from the implementation worktree:

```bash
python3 -m http.server 4174 --bind 127.0.0.1
curl -I http://127.0.0.1:4174/index.html
```

Expected: HTTP `200 OK`. If port `4174` is occupied, verify it serves this exact worktree before reusing it.

- [ ] **Step 2: Verify mobile interaction at 390×844**

In light and dark mode:

- Confirm exactly four tabs in the approved order and AP Prep selected initially.
- Click every tab and verify the active title, coverage, description, proof, CTA, color, and preview all update together.
- Exercise Arrow Left, Arrow Right, Home, and End; confirm focus and `aria-selected` wrap across four tabs.
- Confirm tabs remain at least 44px high, the rail scrolls without page overflow, and the advisor does not cover the selector or active CTA.
- Confirm the AP preview communicates all AP STEM courses and the three delivery modes without implying only six supported courses.

- [ ] **Step 3: Verify the breakpoint and desktop stage**

At `768×1024`, confirm the existing mobile selector remains active because the desktop composition still begins at `lg`. At `1440×900`, verify:

- Exactly four desktop choices appear with the approved coverage lines.
- Hover and click select every category.
- The sticky stage retains header clearance and updates all content synchronously.
- Auto-advance cycles through exactly four categories and pauses on list hover.
- AP uses emerald, tutoring violet, SAT blue, and competition rose.
- The competition panel retains the smooth slate simulator with no graph-paper squares.

- [ ] **Step 4: Verify motion and error states**

- With reduced motion enabled, select every mobile tab and confirm no smooth-scroll dependency or clipped transition.
- Confirm no horizontal page overflow at 390, 768, or 1440.
- Confirm no page exceptions, relevant console errors, stale six-category labels, or undefined array access.

- [ ] **Step 5: Run the final gate**

Run:

```bash
node --test tests/light-mode-section-surfaces.test.mjs
git diff --check
git status --short
curl -I http://127.0.0.1:4174/index.html
```

Expected: all tests pass, diff check is clean, preview returns HTTP 200, and unrelated user files remain untouched.
