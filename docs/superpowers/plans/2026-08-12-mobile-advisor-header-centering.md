# Mobile Advisor Header Centering Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Center the mobile advisor title and subtitle independently of the top-right close control while preserving the tablet/desktop popup.

**Architecture:** Modify only the existing mobile advisor-header CSS inside the `max-width: 767px` media query. Use symmetric `3rem` side padding and a full-width centered text wrapper so the 44px close target does not shift the optical center; leave the existing desktop layout and all interaction code unchanged.

**Tech Stack:** Static HTML, CSS, Node.js built-in test runner, local browser preview.

## Global Constraints

- Refine only the title and subtitle alignment within the open mobile advisor sheet.
- Center `How can we help?` and `Connect with our academic team.` as one header group.
- Reserve equal `44px` clearance on the left and right.
- Keep the close control at the top-right with its existing `44px` target and `20px` icon.
- Preserve the drag handle, booking panel, copy, URLs, focus behavior, sheet geometry, motion, reduced motion, and current vertical spacing.
- At `768px` and wider, retain the left-aligned `Speak with an Advisor` heading, hidden subtitle, and anchored `320px` popup.

---

### Task 1: Center the Mobile Advisor Header

**Files:**
- Modify: `index.html:456-479`
- Test: `tests/light-mode-section-surfaces.test.mjs:730-800`

**Interfaces:**
- Consumes: `.advisor-sheet-header`, its direct text-wrapper child, `#floating-cta-title`, `.advisor-sheet-subtitle`, and `#floating-cta-close`.
- Produces: A mobile-only centered header group with symmetric clearance; no JavaScript or markup interface changes.

- [ ] **Step 1: Write the failing mobile-centering contract**

Add a focused test:

```js
test("centers the mobile advisor heading independently of its close control", () => {
  assert.match(html, /@media \(max-width:\s*767px\)[\s\S]*\.advisor-sheet-header\s*\{[\s\S]*padding:\s*0\.5rem 3rem 0\.25rem/);
  assert.match(html, /@media \(max-width:\s*767px\)[\s\S]*\.advisor-sheet-header\s*>\s*div\s*\{[\s\S]*width:\s*100%;[\s\S]*text-align:\s*center/);
  assert.match(html, /\.advisor-sheet-header #floating-cta-close\s*\{[\s\S]*position:\s*absolute;[\s\S]*right:\s*0/);
  assert.match(html, /id="floating-cta-close"[^>]*class="[^"]*h-11[^"]*w-11/);
  assert.match(html, /id="floating-cta-close"[\s\S]*?<svg class="lucide w-5 h-5"/);
});
```

- [ ] **Step 2: Run the focused test and observe RED**

```bash
node --test --test-name-pattern="centers the mobile advisor heading" tests/light-mode-section-surfaces.test.mjs
```

Expected: FAIL because the current header uses asymmetric `0.5rem 3rem 0.25rem 0.25rem` padding and has no centered direct-child rule.

- [ ] **Step 3: Apply the minimal mobile-only CSS**

Replace the mobile `.advisor-sheet-header` padding and add its direct-child rule:

```css
.advisor-sheet-header {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0.5rem 3rem 0.25rem;
}

.advisor-sheet-header > div {
  width: 100%;
  text-align: center;
}
```

Do not alter the close-control rule, header markup, booking panel, or any rules outside the mobile media query.

- [ ] **Step 4: Run focused and full verification**

```bash
node --test --test-name-pattern="centers the mobile advisor heading" tests/light-mode-section-surfaces.test.mjs
node --test tests/light-mode-section-surfaces.test.mjs
git diff --check
```

Expected: Focused test PASS, full suite PASS, and clean diff check.

- [ ] **Step 5: Verify responsive rendering and interaction**

Open `http://127.0.0.1:4173/index.html` with the in-app Browser skill first; if its runtime is unavailable, record the reason and use local Chrome/Playwright. Verify the open advisor at `390x844`, `768x1024`, and `1440x900`:

- At `390px`, title and subtitle share the sheet's horizontal center and do not overlap the 44px close target.
- Mobile light and dark screenshots show unchanged drag-handle, booking-panel, and vertical geometry.
- At `768px` and `1440px`, `Speak with an Advisor` remains left-aligned, subtitle remains hidden, and popup width remains `320px`.
- Close, Escape, and backdrop restore focus; reduced-motion duration, horizontal overflow, clipping, and page-error checks remain unchanged.

- [ ] **Step 6: Commit and run the post-commit gate**

```bash
git add index.html tests/light-mode-section-surfaces.test.mjs
git commit -m "fix: center mobile advisor heading"
node --test tests/light-mode-section-surfaces.test.mjs
git show --check --stat --oneline HEAD
```

Expected: Full suite PASS and committed diff clean.
