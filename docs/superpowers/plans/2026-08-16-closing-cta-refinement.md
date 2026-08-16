# Closing CTA Refinement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the closing CTA into a functional, premium conversion moment with restrained staged motion.

**Architecture:** Keep the existing static section and advisor controller. Add scoped closing-CTA classes, a small fail-open reveal controller, a stable Elite Programs anchor, and real action semantics without adding new components or dependencies.

**Tech Stack:** Static HTML, Tailwind CDN utilities, scoped CSS, vanilla JavaScript, Node.js `node:test`, local Chrome responsive QA.

## Global Constraints

- Preserve the dark cinematic canvas, centered composition, section dimensions, and footer relationship.
- Primary action opens the existing advisor panel; secondary action targets `#elite-programs`.
- Preserve stacked mobile and inline tablet/desktop action layouts.
- Use 18px staged travel with 560ms easing and 0/70/140ms delays only under normal motion.
- Reduced motion and controller failures must leave all content visible.
- Do not change the footer, advisor implementation, program selector, or any unrelated section.
- Preserve unrelated dirty and untracked workspace files.

---

### Task 1: Functional premium closing CTA

**Files:**
- Modify: `tests/light-mode-section-surfaces.test.mjs`
- Modify: `index.html`

**Interfaces:**
- Consumes: global `toggleFloatingCTA()`, existing Elite Programs section, and `prefers-reduced-motion`.
- Produces: `#closing-cta`, `.closing-cta-stage`, `#closing-cta-book`, `#closing-cta-programs`, and the `#elite-programs` anchor.

- [ ] **Step 1: Add failing structural and controller tests**

Add tests requiring:

```js
assert.match(section, /id="closing-cta"/);
assert.doesNotMatch(section, /\bscroll-reveal\b/);
assert.match(section, /id="closing-cta-book"[^>]*onclick="toggleFloatingCTA\(\)"/);
assert.match(section, /id="closing-cta-programs"[^>]*href="#elite-programs"/);
assert.match(html, /<section[^>]*id="elite-programs"[^>]*surface-programs/);
assert.equal((section.match(/closing-cta-stage/g) ?? []).length, 3);
```

Bound CSS assertions to the closing CTA blocks and require 18px travel, 560ms timing, 0/70/140ms delays, focus-visible rings, reduced-motion neutralization, and no strong glow.

Use a small VM harness to verify that normal motion adds `closing-cta-motion-ready`, intersection adds `is-visible`, and missing observer or reduced motion leaves the section visible.

- [ ] **Step 2: Verify RED**

```bash
node --test --test-name-pattern="closing CTA" tests/light-mode-section-surfaces.test.mjs
```

Expected: failure because the current section uses generic scroll reveal, inert buttons, and no scoped controller.

- [ ] **Step 3: Implement scoped markup and action semantics**

- Add `id="elite-programs"` to the existing programs section.
- Add `id="closing-cta"` and remove `scroll-reveal` from the closing section.
- Wrap the headline, copy, and action group with `.closing-cta-stage` and delay modifiers.
- Change the primary control to `Book a Consultation`, calendar icon, and `onclick="toggleFloatingCTA()"`.
- Change the secondary control to `<a id="closing-cta-programs" href="#elite-programs">Explore Programs</a>`.
- Use explicit focus-visible styling and decorative `aria-hidden` icons.

- [ ] **Step 4: Implement scoped visual and motion CSS**

Add closing-CTA-only styles for restrained button elevation and normal-motion stage reveal:

```css
@media (prefers-reduced-motion: no-preference) {
  #closing-cta.closing-cta-motion-ready .closing-cta-stage {
    opacity: 0;
    transform: translateY(18px);
    transition: opacity 560ms cubic-bezier(0.22, 1, 0.36, 1), transform 560ms cubic-bezier(0.22, 1, 0.36, 1);
  }
  #closing-cta.closing-cta-motion-ready.is-visible .closing-cta-stage {
    opacity: 1;
    transform: none;
    will-change: auto;
  }
}
```

Apply exact 0ms, 70ms, and 140ms transition delays and neutralize all transition/transform behavior under reduced motion.

- [ ] **Step 5: Add fail-open reveal controller**

Create a controller that only enables the hidden initial state after successful observer construction, reveals once at threshold 0.2, unobserves after reveal, and catches construction failures without hiding content.

- [ ] **Step 6: Verify focused and full GREEN**

```bash
node --test --test-name-pattern="closing CTA" tests/light-mode-section-surfaces.test.mjs
node --test tests/light-mode-section-surfaces.test.mjs
git diff --check
```

Expected: all focused tests and the full suite pass with a clean diff.

- [ ] **Step 7: Run rendered QA**

At 390x844, 768x1024, and 1440x900 in light/dark plus reduced motion, verify section geometry, wrapping, action hierarchy, focus rings, no overflow, consultation-panel opening, Elite Programs navigation, staged reveal, and immediate reduced-motion visibility.

- [ ] **Step 8: Commit**

```bash
git add index.html tests/light-mode-section-surfaces.test.mjs
git commit -m "feat: refine closing consultation CTA"
```

---

### Task 2: Final requirement review

**Files:**
- Review: `index.html`
- Review: `tests/light-mode-section-surfaces.test.mjs`
- Review: `docs/superpowers/specs/2026-08-16-closing-cta-refinement-design.md`

**Interfaces:**
- Consumes: Task 1 commit and test/browser evidence.
- Produces: a READY or CHANGES REQUIRED verdict with severity-ranked findings.

- [ ] **Step 1: Review the committed diff against every design requirement**

Check action semantics, exact copy, scoped visual hierarchy, motion timing, fail-open behavior, reduced motion, focus visibility, responsive behavior, and unchanged adjacent systems.

- [ ] **Step 2: Resolve accepted Critical or Important findings test-first**

For each accepted finding, add a focused failing regression, observe RED, apply the smallest fix, and rerun focused/full verification.

- [ ] **Step 3: Run final verification**

```bash
node --test tests/light-mode-section-surfaces.test.mjs
git diff --check
curl -sS -o /dev/null -w 'HTTP %{http_code}\n' http://127.0.0.1:4173/index.html
git status --short
```

Expected: zero failures, HTTP 200, clean task diff, and only pre-existing unrelated workspace changes.
