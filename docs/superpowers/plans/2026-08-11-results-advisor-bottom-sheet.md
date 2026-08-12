# Results Advisor Bottom Sheet Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the mobile compact advisor with a non-obstructive results-hidden state and a purpose-built bottom sheet everywhere else on mobile.

**Architecture:** Retain the existing advisor markup and contact actions, but replace `.results-advisor-compact` with `.results-advisor-hidden` below 768px. Refactor open/close behavior through one setter so bottom-sheet presentation, focus management, Escape/backdrop closing, results intersection, media changes, and desktop popup behavior remain synchronized.

**Tech Stack:** Static HTML, scoped CSS, vanilla JavaScript, IntersectionObserver, matchMedia, Node.js built-in test runner, Browser plugin or the previously approved Playwright/Google Chrome fallback.

## Global Constraints

- Below `768px`, hide the entire advisor while `#results-section` intersects; close it first if open and restore the full trigger after leaving.
- Below `768px` outside results, open one bottom sheet with a dimmed backdrop, one heading, one close button, and no visible duplicate gradient trigger.
- Preserve Call, WhatsApp, and Email choices, destinations, icons, copy, and styling.
- Preserve the trigger's accessible name; expose the sheet as a modal dialog named by its heading.
- Backdrop and Escape close the sheet; focus moves inside on open, remains contained with Tab/Shift+Tab, and returns to the trigger on close.
- At `768px` and above, retain the current anchored popup behavior and never apply results-hidden or mobile-sheet layout.
- Preserve the results counter, qualifier, cards, geometry, typography, themes, and all unrelated page behavior.
- Add no dependencies or new assets.

---

### Task 1: Replace compact advisor with hidden results state and mobile bottom sheet

**Files:**
- Modify: `index.html:300-329`
- Modify: `index.html:2690-2770`
- Modify: `index.html:2940-3005`
- Test: `tests/light-mode-section-surfaces.test.mjs`

**Interfaces:**
- Consumes: `#results-section`, existing floating advisor container/menu/backdrop/toggle/ping/chevron, three contact links, `resultsAdvisorMedia`, and `isCtaOpen`.
- Produces: `.results-advisor-hidden`, mobile `.advisor-menu-open` bottom-sheet CSS, `setFloatingCtaOpen(nextOpen, options)`, focus containment, and synchronized results/media behavior.

- [ ] **Step 1: Write failing replacement-contract tests**

Add or update focused tests to assert:

```js
test("hides the advisor over mobile results and uses a single accessible bottom sheet elsewhere", () => {
  assert.match(html, /@media \(max-width:\s*767px\)[\s\S]*\.results-advisor-hidden/);
  assert.match(html, /#floating-cta-container\.advisor-menu-open[\s\S]*#floating-cta-menu/);
  assert.match(html, /#floating-cta-container\.advisor-menu-open[\s\S]*#floating-cta-toggle[\s\S]*display:\s*none/);
  assert.match(html, /id="floating-cta-menu"[^>]*role="dialog"[^>]*aria-modal="true"[^>]*aria-labelledby="floating-cta-title"/);
  assert.match(html, /id="floating-cta-title"/);
  assert.doesNotMatch(html, /results-advisor-compact/);
});

test("coordinates results visibility, modal focus, and desktop preservation", () => {
  const controller = html.slice(html.indexOf("// Floating CTA Logic"), html.indexOf("// Scroll reveal observer"));
  assert.match(controller, /function setFloatingCtaOpen\(nextOpen/);
  assert.match(controller, /results-advisor-hidden/);
  assert.match(controller, /event\.key === 'Escape'/);
  assert.match(controller, /event\.key === 'Tab'/);
  assert.match(controller, /floatingCtaToggle\?\.focus/);
  assert.match(controller, /resultsAdvisorMedia\.matches/);
});
```

Extend the existing advisor behavior harness to prove:

```text
- 390px + results intersection closes an open menu, adds results-advisor-hidden, and removes pointer access.
- Leaving results removes results-advisor-hidden and restores the full trigger.
- Opening outside results adds advisor-menu-open, sets aria-expanded true, shows the menu/backdrop, hides the trigger visually, and focuses the close button.
- Tab from the last focusable wraps to the first; Shift+Tab from the first wraps to the last.
- Escape and backdrop close, set aria-expanded false, and restore trigger focus.
- A media change to 768px removes results-advisor-hidden and retains the existing desktop popup contract.
```

- [ ] **Step 2: Run tests and verify RED**

```bash
node --test tests/light-mode-section-surfaces.test.mjs
```

Expected: the replacement tests fail because compact classes remain and modal/focus behavior does not exist.

- [ ] **Step 3: Replace compact CSS with hidden and bottom-sheet CSS**

Under `@media (max-width: 767px)`, remove every compact-state rule and add:

```css
#floating-cta-container.results-advisor-hidden {
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
  transform: translateY(1rem);
}
#floating-cta-container.advisor-menu-open {
  inset: 0;
  width: 100%;
  justify-content: flex-end;
}
#floating-cta-container.advisor-menu-open #floating-cta-menu {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  max-height: min(85vh, 42rem);
  margin: 0;
  overflow-y: auto;
  border-radius: 2rem 2rem 0 0;
  padding-bottom: max(1rem, env(safe-area-inset-bottom));
}
#floating-cta-container.advisor-menu-open #floating-cta-toggle {
  display: none;
}
```

Keep the existing backdrop visible/invisible transitions. Do not apply these layout rules at 768px or wider.

- [ ] **Step 4: Add dialog naming hooks without changing content**

- Add `role="dialog" aria-modal="true" aria-labelledby="floating-cta-title"` to `#floating-cta-menu`.
- Add `id="floating-cta-title"` to its existing heading.
- Preserve the existing close button and give it a stable `id="floating-cta-close"`.
- Preserve all three links and the trigger's existing `aria-label`.

- [ ] **Step 5: Refactor state through one open/close setter**

Implement:

```js
function getAdvisorFocusableElements() {
  if (!floatingCtaMenu) return [];
  return [...floatingCtaMenu.querySelectorAll('button, a[href], [tabindex]:not([tabindex="-1"])')]
    .filter(element => !element.hasAttribute('disabled'));
}

function setFloatingCtaOpen(nextOpen, { restoreFocus = true } = {}) {
  isCtaOpen = Boolean(nextOpen);
  floatingCtaToggle?.setAttribute('aria-expanded', String(isCtaOpen));
  floatingCtaContainer?.classList.toggle('advisor-menu-open', isCtaOpen);
  floatingCtaMenu?.classList.toggle('opacity-0', !isCtaOpen);
  floatingCtaMenu?.classList.toggle('invisible', !isCtaOpen);
  floatingCtaMenu?.classList.toggle('scale-95', !isCtaOpen);
  floatingCtaMenu?.classList.toggle('translate-y-4', !isCtaOpen);
  floatingCtaBackdrop?.classList.toggle('opacity-0', !isCtaOpen);
  floatingCtaBackdrop?.classList.toggle('invisible', !isCtaOpen);
  floatingCtaChevron?.classList.toggle('rotate-180', isCtaOpen);
  if (floatingCtaPing) floatingCtaPing.style.display = isCtaOpen ? 'none' : 'flex';
  syncResultsAdvisorState();
  if (isCtaOpen) {
    getAdvisorFocusableElements()[0]?.focus();
  } else if (restoreFocus) {
    floatingCtaToggle?.focus();
  }
}

window.toggleFloatingCTA = () => setFloatingCtaOpen(!isCtaOpen);
```

When mobile results become visible, call `setFloatingCtaOpen(false, { restoreFocus: false })` before adding the hidden state. `syncResultsAdvisorState()` must toggle `results-advisor-hidden` only when `resultsAdvisorMedia.matches && resultsSectionIntersecting`, and remove it on media change or section exit.

- [ ] **Step 6: Add keyboard containment and Escape handling**

Attach one document `keydown` listener that returns unless `isCtaOpen`. Escape calls `setFloatingCtaOpen(false)`. For Tab, retrieve focusable elements; wrap last-to-first and first-to-last with `preventDefault()`. The existing backdrop click continues calling `toggleFloatingCTA()`.

- [ ] **Step 7: Run the full suite and verify GREEN**

```bash
node --test tests/light-mode-section-surfaces.test.mjs
```

Expected: all results counter and advisor behavior tests pass with zero failures.

- [ ] **Step 8: Run rendered interaction QA**

The flow under test is: open the mobile advisor outside results -> use keyboard and close paths -> enter results -> verify the advisor disappears -> leave results -> verify restoration.

Use the Browser plugin first; if its runtime remains unavailable, use the previously approved Playwright/Google Chrome fallback. Verify:

```text
390x844 light and dark:
- outside results, the trigger opens one bottom sheet anchored to the viewport bottom;
- the gradient trigger is absent while open, so the title appears only once;
- backdrop is dimmed, dialog semantics/name are correct, and all three contact links are visible;
- initial focus enters the sheet; Tab and Shift+Tab wrap; Escape, backdrop, and close button each close and restore trigger focus;
- throughout every scroll position where results intersects, the entire advisor is hidden and overlaps no card, badge, or qualifier;
- after leaving results, the full trigger returns.

768x1024 and 1440x900 light and dark:
- results never hide the advisor;
- advisor retains the existing anchored popup rather than bottom-sheet layout;
- all contact links and aria-expanded behavior remain correct.

General:
- results counter, qualifier, card geometry, themes, overflow, and console health remain unchanged.
```

Capture and inspect mobile closed, mobile bottom-sheet, mobile results, and desktop popup screenshots outside the repository.

- [ ] **Step 9: Run final gates and commit**

```bash
node --test tests/light-mode-section-surfaces.test.mjs
git diff --check
curl -sS -o /dev/null -w '%{http_code}\n' http://127.0.0.1:4173/index.html
git diff -- index.html tests/light-mode-section-surfaces.test.mjs
git add index.html tests/light-mode-section-surfaces.test.mjs
git commit -m "fix: use mobile advisor bottom sheet"
```

Expected: tests pass, diff check is clean, preview returns HTTP `200`, and the diff is limited to replacing compact advisor behavior with the approved hidden-results and bottom-sheet interaction.
