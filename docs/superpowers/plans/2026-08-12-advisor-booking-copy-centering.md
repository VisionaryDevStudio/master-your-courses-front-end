# Advisor Booking Copy Centering Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Center the advisor booking sentence across mobile, tablet, and desktop without changing its typography, spacing, or surrounding composition.

**Architecture:** Add one shared `text-align: center` declaration to the existing `.advisor-booking-copy` rule so the mobile bottom sheet and tablet/desktop popup inherit the same alignment. Lock the rule and unchanged semantic copy in the existing static suite, then verify the rendered panel at all supported breakpoints.

**Tech Stack:** Static HTML, CSS, Node.js built-in test runner, local browser preview.

## Global Constraints

- Refine only the alignment of `Choose a convenient time to discuss your student’s goals.`.
- Center the sentence on mobile, tablet, and desktop.
- Preserve its semantic `<p>`, font size, line height, color, margins, and natural wrapping.
- Do not alter the booking button, WhatsApp alternative, panel padding, panel gap, header alignment, controls, URLs, focus behavior, motion, or responsive geometry.
- Preserve the mobile inset sheet and anchored `320px` tablet/desktop popup.

---

### Task 1: Center the Shared Advisor Booking Copy

**Files:**
- Modify: `index.html:312-316`
- Test: `tests/light-mode-section-surfaces.test.mjs:730-755`

**Interfaces:**
- Consumes: The shared `.advisor-booking-copy` CSS hook and existing semantic paragraph.
- Produces: Shared centered alignment inherited by every advisor-panel breakpoint.

- [ ] **Step 1: Write the failing alignment contract**

Extend `uses a booking-first advisor conversion panel in the open mobile sheet` with:

```js
const sharedAdvisorStyles = html.slice(0, html.indexOf("@media (max-width: 767px)"));

assert.match(
  sharedAdvisorStyles,
  /\.advisor-booking-copy\s*\{[\s\S]*margin:\s*0\.125rem 0\.25rem;[\s\S]*font-size:\s*0\.75rem;[\s\S]*line-height:\s*1rem;[\s\S]*text-align:\s*center;/
);
assert.match(
  advisorMenu,
  /<p class="advisor-booking-copy text-muted-foreground">Choose a convenient time to discuss your student’s goals\.<\/p>/
);
```

The shared-style slice proves the declaration applies before mobile overrides and therefore governs mobile, tablet, and desktop.

- [ ] **Step 2: Run the focused test and observe RED**

```bash
node --test --test-name-pattern="booking-first advisor conversion panel" tests/light-mode-section-surfaces.test.mjs
```

Expected: FAIL because `.advisor-booking-copy` does not yet declare `text-align: center`.

- [ ] **Step 3: Add the minimal shared CSS declaration**

Update only the existing rule:

```css
.advisor-booking-copy {
  margin: 0.125rem 0.25rem;
  font-size: 0.75rem;
  line-height: 1rem;
  text-align: center;
}
```

- [ ] **Step 4: Run focused and full static verification**

```bash
node --test --test-name-pattern="booking-first advisor conversion panel" tests/light-mode-section-surfaces.test.mjs
node --test tests/light-mode-section-surfaces.test.mjs
git diff --check
```

Expected: Focused test PASS, full suite PASS, and clean diff check.

- [ ] **Step 5: Verify rendered alignment and preservation**

Open `http://127.0.0.1:4173/index.html` with the in-app Browser skill first; if unavailable, record the reason and use local Chrome/Playwright. Inspect the open advisor panel at `390x844`, `768x1024`, and `1440x900` in light and dark mode:

- Sentence center equals the booking panel's horizontal center at each viewport.
- The sentence wraps without clipping at `390px`.
- Computed font size remains `12px`, line height `16px`, and margins remain `2px 4px`.
- Booking button, WhatsApp link, panel padding/gap, mobile header, close target, and `320px` tablet/desktop popup geometry remain unchanged.
- Focus order/restoration, reduced motion, overflow, clipping, console errors, and page errors show no regression.

Save at least one open mobile and one open desktop screenshot in this plan's SDD workspace for traceable QA.

- [ ] **Step 6: Commit and run the post-commit gate**

```bash
git add index.html tests/light-mode-section-surfaces.test.mjs
git commit -m "fix: center advisor booking copy"
node --test tests/light-mode-section-surfaces.test.mjs
git show --check --stat --oneline HEAD
```

Expected: Full suite PASS and committed diff clean.
