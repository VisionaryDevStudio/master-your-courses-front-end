# Mentor Authority Profile Modal Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the generic mentor résumé popup with a premium, responsive editorial authority profile using structured credentials, semantic icons, theme-aware surfaces, and restrained accessible motion.

**Architecture:** Keep the existing modal controller, focus trap, and mentor-card triggers. Replace string-only accolades with structured credential objects, render them through a small icon/template layer, and rebuild the modal markup/CSS around semantic `.mentor-profile-*` hooks while leaving the mentor cards and carousel unchanged.

**Tech Stack:** Static HTML, Tailwind CDN utilities, custom CSS, vanilla JavaScript, Node test runner, local Chrome/CDP responsive QA.

## Global Constraints

- Source of truth is `html-version/index.html` in the nested Git repository.
- Preserve mentor order: Zoey, Dr. Hossein Piri, Dr. Sherri Sadr.
- Preserve the three mentor cards, card portraits, mobile carousel, focus trap, Escape/backdrop/close behavior, and focus restoration.
- Use only claims approved in `docs/superpowers/specs/2026-08-14-mentor-authority-profile-modal-design.md` or present in the AP Biology webinar reference.
- Keep `Book a Consultation` with `href="#"`.
- Do not modify portrait assets or unrelated working-tree changes.
- All new icons are inline SVGs with `aria-hidden="true"`; no emoji or repeated trophy treatment.

---

### Task 1: Structured Mentor Credential Model

**Files:**
- Modify: `tests/light-mode-section-surfaces.test.mjs`
- Modify: `index.html:30-180`

**Interfaces:**
- Consumes: `MENTORS_DATA[index]` from the existing modal controller.
- Produces: `mentor.credentials: Array<{type, title, detail, featured}>`, `MENTOR_CREDENTIAL_ICONS`, and `renderMentorCredentials(credentials): string`.

- [ ] **Step 1: Write the failing credential-model test**

Add a focused test that executes the real modal logic in the existing VM harness and asserts that opening each mentor renders four credentials in the approved order, with six supported semantic types and no repeated trophy markup.

```js
test("renders curated semantic credentials for every mentor", () => {
  assert.match(mentorModalLogicSource, /credentials:\s*\[/);
  assert.match(mentorModalLogicSource, /const MENTOR_CREDENTIAL_ICONS/);
  assert.match(mentorModalLogicSource, /function renderMentorCredentials\(credentials\)/);
  assert.doesNotMatch(mentorModalLogicSource, /mentor\.accolades\.forEach/);
});
```

- [ ] **Step 2: Run the test to verify RED**

Run:

```bash
node --test --test-name-pattern="curated semantic credentials" tests/light-mode-section-surfaces.test.mjs
```

Expected: FAIL because `MENTORS_DATA` still contains string `accolades` and the semantic renderer does not exist.

- [ ] **Step 3: Implement the structured data and renderer**

Replace each `accolades` array with the exact four credential objects from the approved spec. Define one SVG string for each supported type (`award`, `education`, `exam`, `experience`, `research`, `mentorship`) and render:

```html
<div class="mentor-profile-credential" data-credential-type="education" data-featured="false">
  <span class="mentor-profile-credential-icon" aria-hidden="true">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 10 12 5 2 10l10 5 10-5Z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
  </span>
  <span class="mentor-profile-credential-text">
    <strong>Master’s Degree, Johns Hopkins University</strong>
    <small>4.0 GPA</small>
  </span>
</div>
```

Escape credential text before insertion or build nodes without interpreting credential strings as HTML.

- [ ] **Step 4: Run focused and full tests to verify GREEN**

Run:

```bash
node --test --test-name-pattern="curated semantic credentials" tests/light-mode-section-surfaces.test.mjs
node --test tests/light-mode-section-surfaces.test.mjs
```

Expected: both commands pass with zero failures.

- [ ] **Step 5: Commit Task 1**

```bash
git add index.html tests/light-mode-section-surfaces.test.mjs
git commit -m "feat: structure mentor profile credentials"
```

### Task 2: Editorial Authority Profile Layout and Theme

**Files:**
- Modify: `tests/light-mode-section-surfaces.test.mjs`
- Modify: `index.html:450-570`
- Modify: `index.html:2770-2820`

**Interfaces:**
- Consumes: structured credentials and existing modal element IDs from Task 1.
- Produces: semantic `.mentor-profile-*` layout hooks and responsive theme rules.

- [ ] **Step 1: Write failing layout and theme tests**

Add tests that protect:

```js
assert.match(modal, /mentor-profile-layout/);
assert.match(modal, /mentor-profile-portrait-frame/);
assert.match(modal, /mentor-profile-identity/);
assert.match(modal, /mentor-profile-credentials-panel/);
assert.match(html, /@media \(min-width:\s*1024px\)[\s\S]*grid-template-columns:\s*42fr 58fr/);
assert.match(html, /@media \(max-width:\s*767px\)[\s\S]*aspect-ratio:\s*3\s*\/\s*2/);
assert.match(html, /\.mentor-profile-portrait-frame[\s\S]*aspect-ratio:\s*4\s*\/\s*5/);
assert.match(html, /\.mentor-profile-credentials-panel[\s\S]*background:\s*rgb\(15 23 42/);
```

Also assert that the old circular avatar and independent accolade-card classes are absent from the modal.

- [ ] **Step 2: Run the focused test to verify RED**

Run:

```bash
node --test --test-name-pattern="editorial authority profile" tests/light-mode-section-surfaces.test.mjs
```

Expected: FAIL because the modal still uses a circular avatar and the old sidebar/list layout.

- [ ] **Step 3: Replace the modal markup**

Build these bounded units:

- `.mentor-profile-layout`: desktop 42/58 grid; stacked below 1024px.
- `.mentor-profile-visual`: eyebrow, 4:5 portrait with offset layer, identity, role, authority badges.
- `.mentor-profile-content`: biography and selected credentials.
- `.mentor-profile-credentials-panel`: one unified dark panel containing a featured row and quieter divided rows.
- `.mentor-profile-footer`: integrated consultation CTA.

Retain the existing element IDs required by the controller and accessibility attributes.

- [ ] **Step 4: Implement responsive and theme-aware CSS**

Use a maximum width of `min(1080px, calc(100vw - 48px))`, internal scrolling at `90vh`, warm white light surfaces, and deep navy dark surfaces. At mobile, use a 3:2 portrait banner and overlapping identity surface; at tablet, use a compact horizontal visual header without an empty sidebar.

- [ ] **Step 5: Run focused and full tests to verify GREEN**

Run:

```bash
node --test --test-name-pattern="editorial authority profile" tests/light-mode-section-surfaces.test.mjs
node --test tests/light-mode-section-surfaces.test.mjs
git diff --check
```

Expected: all tests pass and the diff check is clean.

- [ ] **Step 6: Commit Task 2**

```bash
git add index.html tests/light-mode-section-surfaces.test.mjs
git commit -m "feat: redesign mentor authority profiles"
```

### Task 3: Premium Motion and Responsive Browser QA

**Files:**
- Modify: `tests/light-mode-section-surfaces.test.mjs`
- Modify: `index.html`
- Create: `.superpowers/sdd/2026-08-15-mentor-authority-profile-modal/task-3-report.md`

**Interfaces:**
- Consumes: completed Task 2 modal.
- Produces: approved 240ms backdrop, 300ms surface entrance, 35–45ms internal staging, 200ms close, and zero-motion reduced state.

- [ ] **Step 1: Write failing motion-contract tests**

Add assertions for:

```js
assert.match(html, /\.mentor-profile-stage[\s\S]*transition-delay:\s*var\(--mentor-profile-delay, 0ms\)/);
assert.match(html, /#mentor-modal-content[\s\S]*translateY\(10px\)[\s\S]*scale\(\.985\)/);
assert.match(html, /@media \(prefers-reduced-motion:\s*reduce\)[\s\S]*\.mentor-profile-stage[\s\S]*transition:\s*none/);
```

Preserve existing 200ms close assertions.

- [ ] **Step 2: Run the focused test to verify RED**

Run:

```bash
node --test --test-name-pattern="stages the mentor authority profile" tests/light-mode-section-surfaces.test.mjs
```

Expected: FAIL because internal editorial staging is absent.

- [ ] **Step 3: Implement minimal motion**

Use opacity plus a maximum 10px translation and `0.985` scale for the modal surface. Apply explicit `--mentor-profile-delay` values in 40ms increments to portrait, identity, biography, credential panel, and CTA. Do not animate individual credential rows or add decorative loops.

- [ ] **Step 4: Verify rendered behavior**

Because the Browser plugin may be unavailable, first check for its callable runtime. If unavailable, record that reason and use local Chrome/CDP fallback.

Inspect every mentor at:

- 390×844 light and dark
- 768×1024 light and dark
- 1440×900 light and dark
- 390×844 reduced motion
- 1440×900 reduced motion

Verify portrait framing, no unused portrait-column void, content order, four semantic credentials, CTA visibility, internal scrolling, zero horizontal overflow, focus on close after open, Tab/Shift+Tab containment, Escape/backdrop/close restoration, 44px close target, and no page errors.

- [ ] **Step 5: Run the complete final gate**

Run:

```bash
node --test tests/light-mode-section-surfaces.test.mjs
git diff --check
curl -I http://127.0.0.1:4180/index.html
```

Expected: zero test failures, clean diff, and HTTP 200.

- [ ] **Step 6: Write the QA report and commit**

Record viewport/theme screenshots, computed motion values, interaction results, overflow values, and any environment limitations in the Task 3 report. Keep the report as local evidence if `.superpowers` is ignored, and commit only the approved source/test files:

```bash
git add index.html tests/light-mode-section-surfaces.test.mjs
git commit -m "fix: finalize mentor authority profile modal"
```
