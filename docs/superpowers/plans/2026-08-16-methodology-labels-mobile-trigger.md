# Methodology Labels and Mobile Consultation Trigger Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove the two unnecessary methodology group labels and optically center the calendar icon in the unchanged 56px mobile consultation trigger.

**Architecture:** Keep the existing static HTML, scoped CSS, and advisor controller. Make two narrow presentation changes in `index.html`, protected by structural regressions in the existing Node test file; no new dependencies or controller logic are needed.

**Tech Stack:** Static HTML, Tailwind CDN utilities, scoped CSS, inline JavaScript, Node.js built-in test runner, local Chrome responsive QA.

## Global Constraints

- Preserve all six methodology cards, their order, identities, colors, content, responsive layout, and reveal behavior.
- Preserve the existing 56 by 56 pixel mobile trigger, gradient, border, shadow, position, accessible label, and consultation-panel behavior.
- Preserve the existing desktop and tablet phone icon, label, chevron, and status indicator.
- Keep the trigger's existing keyboard focus and reduced-motion behavior.
- Do not modify or stage unrelated dirty files.

---

### Task 1: Remove the Methodology Group Labels

**Files:**
- Modify: `tests/light-mode-section-surfaces.test.mjs`
- Modify: `index.html`

**Interfaces:**
- Consumes: `#methodology-section`, `.methodology-grid`, and the six existing `.methodology-card` elements.
- Produces: A six-card methodology grid without `.methodology-mobile-group` markup or CSS.

- [ ] **Step 1: Replace the existing label-presence test with a failing absence contract**

Update the methodology test to assert that the section retains six descriptions while the labels and their CSS hook are absent:

```js
test("keeps methodology content complete without group labels", () => {
  const section = html.match(/<section[^>]*id="methodology-section"[\s\S]*?<\/section>/)?.[0] ?? "";
  assert.equal((section.match(/methodology-description/g) ?? []).length, 6);
  assert.doesNotMatch(section, /methodology-mobile-group|Core Method|Ongoing Support/);
  assert.doesNotMatch(html, /\.methodology-mobile-group\s*\{/);
  assert.doesNotMatch(html, /methodology-description[^\n{]*(?:line-clamp|display:\s*none|visibility:\s*hidden)/);
});
```

- [ ] **Step 2: Run the focused test and verify RED**

Run:

```bash
node --test --test-name-pattern="without group labels" tests/light-mode-section-surfaces.test.mjs
```

Expected: FAIL because the two label elements and `.methodology-mobile-group` CSS still exist.

- [ ] **Step 3: Remove only the labels and their unused styles**

In `index.html`:

- Delete the `Core Method` and `Ongoing Support` `<p class="methodology-mobile-group">` elements.
- Delete the base `.methodology-mobile-group { display: none; }` rule.
- Delete the mobile `.methodology-mobile-group` rule and `html.dark .methodology-mobile-group` rule.
- Leave every `.methodology-card` and methodology motion rule unchanged.

- [ ] **Step 4: Run the focused and full structural suites**

Run:

```bash
node --test --test-name-pattern="without group labels" tests/light-mode-section-surfaces.test.mjs
node --test tests/light-mode-section-surfaces.test.mjs
```

Expected: Both commands PASS.

- [ ] **Step 5: Commit Task 1**

```bash
git add index.html tests/light-mode-section-surfaces.test.mjs
git commit -m "fix: remove methodology group labels"
```

---

### Task 2: Center the Mobile Consultation Trigger Icon

**Files:**
- Modify: `tests/light-mode-section-surfaces.test.mjs`
- Modify: `index.html`

**Interfaces:**
- Consumes: `#floating-cta-toggle`, `#floating-cta-toggle-content`, `.advisor-trigger-calendar`, `.advisor-trigger-phone`, `#floating-cta-ping`, and `toggleFloatingCTA()`.
- Produces: A direct `.advisor-trigger-icon` wrapper centered by the existing trigger content at mobile width, while retaining all non-mobile trigger children and behavior.

- [ ] **Step 1: Write the failing centered-trigger contract**

Add assertions to the existing mobile trigger test:

```js
assert.match(trigger, /id="floating-cta-toggle-content"[^>]*>[\s\S]*?<span class="advisor-trigger-icon">[\s\S]*?advisor-trigger-calendar[^>]*w-\[22px\][^>]*h-\[22px\]/);
assert.doesNotMatch(trigger, /<div class="relative">\s*<div>\s*<svg class="lucide advisor-trigger-calendar/);
assert.match(mobileStyles, /#floating-cta-container:not\(\.advisor-menu-open\) #floating-cta-toggle-content\s*\{[^}]*display:\s*grid;[^}]*place-items:\s*center;/);
assert.match(mobileStyles, /\.advisor-trigger-icon\s*\{[^}]*display:\s*grid;[^}]*place-items:\s*center;[^}]*width:\s*100%;[^}]*height:\s*100%;/);
```

- [ ] **Step 2: Run the focused test and verify RED**

Run:

```bash
node --test --test-name-pattern="mobile consultation trigger" tests/light-mode-section-surfaces.test.mjs
```

Expected: FAIL because the current icon uses nested `<div>` wrappers, a 20px calendar, and flex/margin centering.

- [ ] **Step 3: Apply the minimal markup and CSS correction**

In `#floating-cta-toggle-content`, replace the nested icon blocks with one semantic-neutral wrapper:

```html
<span class="advisor-trigger-icon">
  <svg class="lucide advisor-trigger-calendar w-[22px] h-[22px] text-white" aria-hidden="true" viewBox="0 0 24 24">...</svg>
  <svg class="lucide advisor-trigger-phone w-5 h-5 text-white" aria-hidden="true" viewBox="0 0 24 24">...</svg>
  <span id="floating-cta-ping" aria-hidden="true" class="...">...</span>
</span>
```

Within the existing mobile media query, use one centering coordinate system:

```css
#floating-cta-container:not(.advisor-menu-open) #floating-cta-toggle-content {
  display: grid;
  place-items: center;
  width: 3.5rem;
  height: 3.5rem;
  padding: 0;
  gap: 0;
}

.advisor-trigger-icon {
  position: relative;
  display: grid;
  place-items: center;
  width: 100%;
  height: 100%;
}

.advisor-trigger-calendar {
  margin: 0;
}
```

Keep `.advisor-trigger-calendar { display: none; }` outside mobile and keep the existing mobile phone/ping hiding rule so tablet and desktop remain unchanged.

- [ ] **Step 4: Run focused and full tests**

Run:

```bash
node --test --test-name-pattern="mobile consultation trigger" tests/light-mode-section-surfaces.test.mjs
node --test tests/light-mode-section-surfaces.test.mjs
git diff --check
```

Expected: All tests PASS and the diff check has no output.

- [ ] **Step 5: Run rendered responsive QA**

Serve and verify the exact page:

```bash
python3 -m http.server 4173 --bind 127.0.0.1
curl -sS -o /dev/null -w 'HTTP %{http_code}\n' http://127.0.0.1:4173/index.html
```

Using the in-app Browser when available, otherwise the documented local Chrome fallback:

- At 390px light and dark, confirm the button is exactly 56 by 56 pixels and the calendar center matches the button center on both axes.
- Open the panel and confirm its dialog, focus, close, backdrop, and Escape behavior remain intact.
- At 768px and 1440px, confirm the phone icon, label, chevron, ping, and popup remain unchanged.
- Confirm `scrollWidth === clientWidth` at all three widths.

- [ ] **Step 6: Commit Task 2**

```bash
git add index.html tests/light-mode-section-surfaces.test.mjs
git commit -m "fix: center mobile consultation trigger"
```

- [ ] **Step 7: Run the final post-commit gate**

```bash
node --test tests/light-mode-section-surfaces.test.mjs
git show --check --oneline --stat HEAD
curl -sS -o /dev/null -w 'HTTP %{http_code}\n' http://127.0.0.1:4173/index.html
git status --short
```

Expected: Full suite PASS, commit check clean, HTTP 200, and only the user's unrelated pre-existing files remain dirty or untracked.
