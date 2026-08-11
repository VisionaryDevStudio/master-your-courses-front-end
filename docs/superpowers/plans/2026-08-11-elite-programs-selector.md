# Elite Programs Selector Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the unreliable mobile Elite Programs accordion with a compact accessible tab selector and one shared color-rich preview while removing the desktop preview grid.

**Architecture:** Keep the existing single-file page, `PROGRAMS_DATA`, `PROGRAMS_MOCKUPS`, and desktop program list. Reuse the six existing mobile header buttons as tabs, hide/remove their duplicated accordion bodies, add one shared mobile preview panel, and route every selection through the existing active-program state and one rendering function.

**Tech Stack:** Static HTML, Tailwind CSS CDN, vanilla JavaScript, Node.js built-in tests, Playwright/Chrome visual and interaction verification.

## Global Constraints

- Production changes are limited to `index.html`.
- Preserve existing program names, descriptions, mockups, proof points, CTA labels, desktop auto-advance, dark mode, and other page sections.
- Add no dependencies or assets.
- Keep the mobile selector horizontally scrollable without page-level overflow.
- Ensure the floating advisor control does not cover essential program-selection controls.
- Do not define destinations for the existing program CTAs.
- Do not stage `.DS_Store`, `.superpowers/`, or `update_fonts.js`.

---

### Task 1: Protect the compact-selector contract

**Files:**
- Modify: `tests/light-mode-section-surfaces.test.mjs`

**Interfaces:**
- Consumes: The Elite Programs section source in `index.html`.
- Produces: Regression coverage for six semantic tabs, one shared panel, no mobile accordion bodies, and no desktop stage grid.

- [ ] Add a failing test that scopes itself between the Elite Programs and Meet The Mentors comments and asserts: a labeled `role="tablist"`; six `.program-mobile-tab` buttons with unique indices; `role="tab"`, `aria-selected`, and `aria-controls="program-mobile-panel"`; one `#program-mobile-panel`; no `.program-acc-content`; and no `Abstract geometric grid background` or 24px stage grid.
- [ ] Run `node --test tests/light-mode-section-surfaces.test.mjs` and confirm the new test fails for the current accordion/grid implementation.
- [ ] Do not change production code in this task.

### Task 2: Build the shared mobile selector and preview

**Files:**
- Modify: `index.html:776-1229`

**Interfaces:**
- Consumes: `PROGRAMS_DATA`, `PROGRAMS_MOCKUPS`, and `activeProgram`.
- Produces: `.program-mobile-tab`, `#program-mobile-panel`, `#mobile-program-proof`, `#mobile-program-mockup`, `#mobile-program-title`, `#mobile-program-desc`, and `#mobile-program-cta`.

- [ ] Replace the six stacked mobile accordion bodies with a horizontal `role="tablist"` containing six native buttons.
- [ ] Give every tab an icon, short label, at least 44px height, stable `data-index`, `aria-selected`, and `aria-controls` attributes.
- [ ] Add one shared mobile preview card below the rail using the first program's existing mockup, proof, title, description, and CTA as its initial server-rendered content.
- [ ] Use a restrained program-specific tinted canvas, opaque inactive tabs, visible focus rings, scroll snapping, hidden scrollbar styling, section scroll margin, and sufficient bottom padding for the floating advisor control.
- [ ] Remove the desktop stage's 24px grid overlay while retaining its radial atmosphere.
- [ ] Run the Node tests and `git diff --check`.

### Task 3: Make selection reliable and accessible

**Files:**
- Modify: `index.html:1418-1499`
- Modify: `tests/light-mode-section-surfaces.test.mjs`

**Interfaces:**
- Consumes: Task 2 DOM IDs/classes and existing program arrays.
- Produces: `setActiveProgram(index, source)`, `renderMobileProgram()`, and `handleProgramTabKeydown(event, index)`.

- [ ] Add a failing structural contract test for the shared selection functions, keyboard handler, and selected-tab scroll behavior.
- [ ] Update `setActiveProgram` so repeated selection remains safe, selection always renders current state, and desktop animation only runs when desktop stage elements exist.
- [ ] Update all six tabs on every render: selected classes, accent styling, `aria-selected`, `tabindex`, and active-state visibility.
- [ ] Render the shared mobile proof, mockup, title, description, CTA label, and program-specific radial atmosphere from the canonical arrays.
- [ ] Implement Left Arrow, Right Arrow, Home, and End keyboard navigation with focus movement and selection.
- [ ] Scroll the selected tab into view with reduced-motion-aware behavior.
- [ ] Run all Node tests and `git diff --check`.

### Task 4: Rendered verification and commit

**Files:**
- Modify if correction is required: `index.html`
- Modify if contract correction is required: `tests/light-mode-section-surfaces.test.mjs`

**Interfaces:**
- Consumes: Completed selector and shared preview.
- Produces: Verified desktop/mobile, light/dark Elite Programs behavior.

- [ ] At 390x844 in light and dark modes, repeatedly select all six programs by pointer and verify each title, description, proof, mockup, CTA label, and selected tab update without page errors.
- [ ] Verify keyboard Right/Left/Home/End selection and visible focus.
- [ ] Reveal the floating advisor control and confirm it does not cover the tab rail or preview CTA.
- [ ] Confirm exact viewport containment with no page-level horizontal overflow.
- [ ] At 1440x900, verify desktop list hover/click selection, auto-advance, sticky preview behavior, and absence of the square grid.
- [ ] Run `node --test tests/light-mode-section-surfaces.test.mjs`, `git diff --check`, and verify the preview returns HTTP 200.
- [ ] Commit only `index.html` and `tests/light-mode-section-surfaces.test.mjs` with message `feat: redesign elite programs mobile selector`.
