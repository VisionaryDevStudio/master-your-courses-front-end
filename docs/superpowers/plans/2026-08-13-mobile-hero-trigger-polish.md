# Mobile Hero and Consultation Trigger Polish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove the light-mode mobile hero's visible atmospheric edge and refine the closed consultation trigger into a clean, optically balanced 56px circle without changing tablet, desktop, modal, or methodology behavior.

**Architecture:** Keep the correction inside the existing mobile media query in `index.html`. Split the shared mobile surface sizing so the hero receives its own oversized, non-repeating atmospheric layers, then refine only the closed mobile trigger's border, shadow, and calendar rendering. Protect both changes with static contract tests and verify the final page in a real browser across the breakpoint boundary.

**Tech Stack:** Static HTML, scoped CSS, inline SVG, Node.js built-in test runner, local HTTP preview, Chrome/Playwright or Chrome CDP for rendered QA.

## Global Constraints

- Production changes are limited to scoped CSS and, only if required for explicit SVG rendering, attributes on `.advisor-trigger-calendar` in `index.html`.
- Do not change hero content, typography, layout, navigation, animations, methodology cards, advisor-sheet behavior, or dark mode.
- Keep the mobile consultation trigger exactly `56 × 56px` below `768px`.
- Preserve the tablet/desktop full advisor trigger at `768px` and above.
- Preserve active, focus-visible, open/close, focus-restoration, keyboard, modal, and reduced-motion behavior.
- Keep `scrollWidth === clientWidth` and the hero equal to the viewport width.

---

### Task 1: Make the Mobile Hero Atmosphere Continuous

**Files:**
- Modify: `tests/light-mode-section-surfaces.test.mjs`
- Modify: `index.html:502-506`

**Interfaces:**
- Consumes: The existing `.surface-hero`, `.surface-methodology`, and `.surface-mentors` light-mode surface rules.
- Produces: A hero-only mobile background contract with three explicit layer sizes, three positions, and `no-repeat`; the methodology and mentor mobile sizing rule remains separate and unchanged.

- [ ] **Step 1: Add a focused failing regression test**

Add this test near the existing light-mode surface tests:

```js
test("keeps the mobile hero atmosphere continuous without changing adjacent surfaces", () => {
  const mobile = extractCssBlock(html, "@media (max-width: 767px)");

  assert.match(
    mobile,
    /html:not\(\.dark\) \.surface-hero\s*\{[^}]*background-size:\s*125vw 48rem,\s*120vw 42rem,\s*auto;[^}]*background-position:\s*50% -6rem,\s*50% 20rem,\s*0 0;[^}]*background-repeat:\s*no-repeat;/
  );
  assert.match(
    mobile,
    /html:not\(\.dark\) \.surface-methodology,\s*html:not\(\.dark\) \.surface-mentors\s*\{[^}]*background-size:\s*38rem 38rem,\s*auto;/
  );
  assert.doesNotMatch(
    mobile,
    /html:not\(\.dark\) \.surface-hero,\s*html:not\(\.dark\) \.surface-methodology/
  );
});
```

- [ ] **Step 2: Run the focused suite and confirm RED**

Run:

```bash
node --test --test-name-pattern="mobile hero atmosphere" tests/light-mode-section-surfaces.test.mjs
```

Expected: FAIL because `.surface-hero` still shares the fixed `38rem 38rem` rule and does not declare explicit positions or `background-repeat`.

- [ ] **Step 3: Implement the minimal hero-only CSS contract**

Replace the shared three-surface block in the mobile media query with:

```css
html:not(.dark) .surface-hero {
  background-size: 125vw 48rem, 120vw 42rem, auto;
  background-position: 50% -6rem, 50% 20rem, 0 0;
  background-repeat: no-repeat;
}

html:not(.dark) .surface-methodology,
html:not(.dark) .surface-mentors {
  background-size: 38rem 38rem, auto;
}
```

This retains the existing gradient colors from the base `.surface-hero` rule while ensuring each atmospheric layer is wider than the viewport below `768px`.

- [ ] **Step 4: Run the focused and full static suites**

Run:

```bash
node --test --test-name-pattern="mobile hero atmosphere" tests/light-mode-section-surfaces.test.mjs
node --test tests/light-mode-section-surfaces.test.mjs
git diff --check
```

Expected: focused PASS, full suite PASS, and no whitespace errors.

- [ ] **Step 5: Commit the hero correction**

```bash
git add index.html tests/light-mode-section-surfaces.test.mjs
git commit -m "fix: smooth mobile hero atmosphere"
```

---

### Task 2: Refine the Closed Mobile Consultation Trigger

**Files:**
- Modify: `tests/light-mode-section-surfaces.test.mjs:918-946`
- Modify: `index.html:513-535`

**Interfaces:**
- Consumes: `#floating-cta-container`, `#floating-cta-toggle`, `#floating-cta-toggle-content`, and `.advisor-trigger-calendar`.
- Produces: A 56px closed mobile trigger with a 1px light edge, one restrained shadow, centered block calendar icon, and the existing accessibility and interaction contracts.

- [ ] **Step 1: Update the trigger contract to require the refined optical styling**

In `keeps the closed mobile advisor circular while it transitions into the results-hidden state`, replace the old border/shadow assertions and add icon-centering assertions:

```js
assert.match(
  mobileStyles,
  /#floating-cta-container:not\(\.advisor-menu-open\) #floating-cta-toggle\s*\{[^}]*width:\s*3\.5rem;[^}]*height:\s*3\.5rem;[^}]*border:\s*1px solid rgb\(255 255 255 \/ 0\.76\);[^}]*box-shadow:\s*0 8px 22px rgb\(67 56 202 \/ 0\.2\);/
);
assert.match(
  mobileStyles,
  /\.advisor-trigger-calendar\s*\{[^}]*display:\s*block;[^}]*margin:\s*0 auto;[^}]*flex:\s*0 0 auto;/
);
assert.doesNotMatch(
  mobileStyles,
  /#floating-cta-container:not\(\.advisor-menu-open\) #floating-cta-toggle\s*\{[^}]*border:\s*2px/
);
assert.match(
  mobileStyles,
  /#floating-cta-container:not\(\.advisor-menu-open\) #floating-cta-toggle:focus-visible\s*\{[^}]*box-shadow:\s*0 8px 22px rgb\(67 56 202 \/ 0\.2\),\s*0 0 0 3px rgb\(99 102 241 \/ 0\.5\);/
);
```

Keep the existing assertions for the accessible name, phone/ping visibility, active scale, label/chevron hiding, and exact `3.5rem` dimensions.

- [ ] **Step 2: Run the focused test and confirm RED**

Run:

```bash
node --test --test-name-pattern="closed mobile advisor circular" tests/light-mode-section-surfaces.test.mjs
```

Expected: FAIL on the old 2px border, old shadow, and missing explicit icon centering.

- [ ] **Step 3: Apply the minimal mobile trigger refinement**

Update only the mobile declarations:

```css
#floating-cta-container:not(.advisor-menu-open) #floating-cta-toggle {
  width: 3.5rem;
  height: 3.5rem;
  border: 1px solid rgb(255 255 255 / 0.76);
  box-shadow: 0 8px 22px rgb(67 56 202 / 0.2);
}

.advisor-trigger-calendar {
  display: block;
  margin: 0 auto;
  flex: 0 0 auto;
}

#floating-cta-container:not(.advisor-menu-open) #floating-cta-toggle:focus-visible {
  box-shadow:
    0 8px 22px rgb(67 56 202 / 0.2),
    0 0 0 3px rgb(99 102 241 / 0.5);
}
```

Do not change the inline SVG, gradient, container position, open-sheet selectors, or any rule at/above `768px` unless rendered QA demonstrates an SVG centering defect that CSS cannot solve.

- [ ] **Step 4: Run focused and full regression gates**

Run:

```bash
node --test --test-name-pattern="closed mobile advisor circular" tests/light-mode-section-surfaces.test.mjs
node --test tests/light-mode-section-surfaces.test.mjs
git diff --check
```

Expected: focused PASS, full suite PASS, and no whitespace errors.

- [ ] **Step 5: Commit the trigger refinement**

```bash
git add index.html tests/light-mode-section-surfaces.test.mjs
git commit -m "fix: refine mobile consultation trigger"
```

---

### Task 3: Rendered Responsive and Interaction Verification

**Files:**
- Verify: `index.html`
- Verify: `tests/light-mode-section-surfaces.test.mjs`

**Interfaces:**
- Consumes: The completed hero background and consultation-trigger CSS contracts from Tasks 1 and 2.
- Produces: Screenshot and computed-style evidence that the correction works at mobile widths and preserves the `768px` breakpoint, desktop layout, advisor sheet, methodology cards, and accessibility behavior.

- [ ] **Step 1: Start or verify the isolated preview**

Run from the worktree:

```bash
python3 -m http.server 4174 --bind 127.0.0.1
curl -I http://127.0.0.1:4174/index.html
```

Expected: HTTP `200 OK`. Reuse the existing server if port `4174` is already serving this exact worktree.

- [ ] **Step 2: Capture light-mode mobile evidence at both ends of the breakpoint**

Using the in-app Browser skill first, or local Chrome/Playwright if that runtime is unavailable, inspect `390×844` and `767×900` at device scale factor `2`.

For each viewport, record and assert:

```js
const measurements = await page.evaluate(() => {
  const hero = document.querySelector('.surface-hero');
  const trigger = document.querySelector('#floating-cta-toggle');
  const heroStyle = getComputedStyle(hero);
  const triggerRect = trigger.getBoundingClientRect();
  return {
    clientWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
    heroWidth: hero.getBoundingClientRect().width,
    backgroundRepeat: heroStyle.backgroundRepeat,
    triggerWidth: triggerRect.width,
    triggerHeight: triggerRect.height,
    triggerBorderWidth: getComputedStyle(trigger).borderTopWidth,
  };
});
```

Expected: `scrollWidth === clientWidth`, `heroWidth === clientWidth`, all background layers compute to `no-repeat`, trigger is `56×56`, and border is `1px`. Inspect screenshots to confirm there is no hard vertical atmospheric edge and the calendar is optically centered.

- [ ] **Step 3: Verify breakpoint preservation**

Inspect `768×1024` and `1440×900` in light mode. Confirm:

- The advisor trigger uses the existing full tablet/desktop label presentation rather than the 56px mobile circle.
- The calendar icon is hidden and the existing phone, ping, label, and chevron presentation remains intact.
- Hero content, layout, colors, and motion are unchanged.
- Methodology cards retain six distinct accents and their existing tablet/desktop grid.
- No horizontal overflow, page exceptions, or relevant console errors occur.

- [ ] **Step 4: Verify advisor interactions and accessibility**

At `390×844`, click the trigger, then verify close button, backdrop, and Escape each close the sheet and restore focus to `#floating-cta-toggle`. Tab and Shift+Tab must remain trapped while open. Repeat once with `prefers-reduced-motion: reduce` and confirm transitions remain effectively disabled.

- [ ] **Step 5: Run the final completion gate**

Run:

```bash
node --test tests/light-mode-section-surfaces.test.mjs
git diff --check
git status --short
curl -I http://127.0.0.1:4174/index.html
```

Expected: all tests pass, diff check is clean, preview returns HTTP 200, and only known unrelated files—if any—remain outside the scoped commits.

