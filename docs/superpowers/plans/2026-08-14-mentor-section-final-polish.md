# Mentor Section Final Polish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Finish the mentor section with theme-consistent profiles, balanced responsive spacing, correct mobile controls, and restrained accessible motion.

**Architecture:** Keep the existing mentor markup, carousel controller, and modal controller. Add narrowly scoped mentor CSS and semantic class hooks so light/dark styling, responsive density, and reduced motion remain isolated from the rest of the landing page.

**Tech Stack:** Static HTML, Tailwind CDN utilities, custom CSS, vanilla JavaScript, Node test runner, Chrome responsive QA.

## Global Constraints

- Preserve the current three-card desktop/tablet layout and one-card mobile carousel.
- Preserve mentor order: Zoey, Dr. Hossein Piri, Dr. Sherri Sadr.
- Preserve the warm light-mode mentor section canvas and existing dark-mode section canvas.
- Do not modify or replace portrait assets.
- Do not touch unrelated working-tree changes.

---

### Task 1: Protect the final mentor design contracts

**Files:**
- Modify: `tests/light-mode-section-surfaces.test.mjs`

**Interfaces:**
- Consumes: existing `index.html` mentor section and modal markup.
- Produces: regression coverage for responsive density, dot labels, modal theming, CTA copy, touch size, and reduced motion.

- [ ] **Step 1: Write failing tests**

Add assertions that the dot labels follow the DOM card order, the modal uses theme-aware class hooks, the close target is 44px, the CTA says `Book a Consultation`, tablet spacing is compact, and modal transitions are disabled for reduced motion.

- [ ] **Step 2: Run tests to verify RED**

Run: `node --test tests/light-mode-section-surfaces.test.mjs`

Expected: focused mentor assertions fail because the current modal is hard-coded dark, the dots are mislabeled, and the new responsive contracts are absent.

### Task 2: Implement the scoped mentor refinement

**Files:**
- Modify: `index.html`

**Interfaces:**
- Consumes: existing `.mentor-*` hooks and modal controller.
- Produces: theme-responsive mentor dialog, compact tablet cards, ordered controls, and motion-safe modal behavior.

- [ ] **Step 1: Add semantic modal hooks and theme-aware CSS**

Introduce mentor-modal classes for the backdrop, surface, sidebar, headings, copy, credentials, footer, close button, and primary action. Use warm light surfaces in light mode and retain the current dark composition under `.dark`.

- [ ] **Step 2: Tighten responsive mentor spacing**

Reduce the heading-to-grid gap and tablet-only internal card spacing without changing the desktop grid or mobile carousel structure.

- [ ] **Step 3: Correct interaction details**

Match dot labels to Zoey, Piri, Sherri; increase the close control to 44px; use `Book a Consultation`; and disable modal transitions under reduced motion.

- [ ] **Step 4: Run tests to verify GREEN**

Run: `node --test tests/light-mode-section-surfaces.test.mjs`

Expected: all tests pass.

### Task 3: Rendered responsive verification

**Files:**
- Verify: `index.html`

**Interfaces:**
- Consumes: completed Task 2 output.
- Produces: browser evidence for light/dark, mobile/tablet/desktop, modal behavior, overflow, and motion preferences.

- [ ] **Step 1: Serve and inspect**

Serve `html-version` locally and inspect mentor cards plus each profile modal at 390x844, 768x1024, and 1440x900 in light and dark modes.

- [ ] **Step 2: Verify interaction and accessibility**

Check carousel order, dot labels, keyboard focus restoration, Escape/backdrop/close paths, 44px close target, reduced-motion transition removal, and zero horizontal overflow.

- [ ] **Step 3: Run final gates**

Run:

```bash
node --test tests/light-mode-section-surfaces.test.mjs
git diff --check
curl -I http://127.0.0.1:4180/index.html
```

Expected: zero test failures, clean diff, and HTTP 200.
