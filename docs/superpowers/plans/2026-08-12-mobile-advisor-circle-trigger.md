# Mobile Advisor Circle Trigger Correction Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ensure the revealed, closed mobile advisor is always a `56px × 56px` circular phone trigger while preserving the bottom sheet, results hiding, and tablet/desktop presentation.

**Architecture:** Add a mobile-only closed-state CSS contract to the existing advisor hooks. The scroll reveal continues controlling opacity/translation; responsive CSS controls geometry and visible children, while the existing open-state rules continue replacing the circle with the bottom sheet.

**Tech Stack:** Static HTML, scoped CSS, vanilla JavaScript, Node.js built-in test runner, Browser plugin or the approved Playwright/Google Chrome fallback.

## Global Constraints

- Below `768px`, the revealed closed trigger is exactly `56px × 56px`, circular, and fixed in the bottom-right safe area.
- Show only the phone icon and green indicator; hide the visible label and chevron.
- Preserve `aria-label="Speak with an Academic Advisor"` and click behavior.
- Opening hides the circle and preserves the approved bottom sheet.
- Results intersection continues hiding the entire advisor; exit restores the circle.
- At `768px` and above, preserve the full trigger and anchored popup.
- Preserve the results counter, qualifier, contact actions, themes, and unrelated page behavior.

---

### Task 1: Correct the revealed mobile closed state

**Files:**
- Modify: `index.html:300-340`
- Test: `tests/light-mode-section-surfaces.test.mjs`

**Interfaces:**
- Consumes: `#floating-cta-container`, `#floating-cta-toggle`, `#floating-cta-toggle-content`, `#floating-cta-label`, `#floating-cta-chevron`, `.advisor-menu-open`, and `.results-advisor-hidden`.
- Produces: A mobile-only closed-state geometry contract that remains subordinate to the existing open and results-hidden states.

- [ ] **Step 1: Write the failing regression test**

Add a focused static test requiring the mobile media block to contain:

```js
test("uses a circular advisor trigger after the mobile scroll reveal", () => {
  const mobileCss = html.match(/@media \(max-width:\s*767px\)\s*\{[\s\S]*?\n\s*\}/)?.[0] ?? "";
  assert.match(html, /@media \(max-width:\s*767px\)[\s\S]*#floating-cta-container:not\(\.advisor-menu-open\):not\(\.results-advisor-hidden\)\s*\{[\s\S]*left:\s*auto;[\s\S]*width:\s*3\.5rem/);
  assert.match(html, /#floating-cta-container:not\(\.advisor-menu-open\):not\(\.results-advisor-hidden\) #floating-cta-toggle\s*\{[\s\S]*width:\s*3\.5rem;[\s\S]*height:\s*3\.5rem/);
  assert.match(html, /#floating-cta-container:not\(\.advisor-menu-open\):not\(\.results-advisor-hidden\) #floating-cta-toggle-content\s*\{[\s\S]*width:\s*3\.5rem;[\s\S]*height:\s*3\.5rem;[\s\S]*padding:\s*0/);
  assert.match(html, /#floating-cta-container:not\(\.advisor-menu-open\):not\(\.results-advisor-hidden\) #floating-cta-label,[\s\S]*#floating-cta-chevron\s*\{[\s\S]*display:\s*none/);
  assert.match(html, /id="floating-cta-toggle"[^>]*aria-label="Speak with an Academic Advisor"/);
  assert.ok(mobileCss.length > 0);
});
```

- [ ] **Step 2: Run tests and verify RED**

```bash
node --test tests/light-mode-section-surfaces.test.mjs
```

Expected: the new test fails because the revealed mobile trigger still uses the full-width base classes.

- [ ] **Step 3: Add the minimal closed-state CSS**

Inside `@media (max-width: 767px)`, before the results-hidden and open-state rules, add:

```css
#floating-cta-container:not(.advisor-menu-open):not(.results-advisor-hidden) {
  left: auto;
  width: 3.5rem;
}
#floating-cta-container:not(.advisor-menu-open):not(.results-advisor-hidden) #floating-cta-toggle {
  width: 3.5rem;
  height: 3.5rem;
}
#floating-cta-container:not(.advisor-menu-open):not(.results-advisor-hidden) #floating-cta-toggle-content {
  width: 3.5rem;
  height: 3.5rem;
  padding: 0;
  gap: 0;
}
#floating-cta-container:not(.advisor-menu-open):not(.results-advisor-hidden) #floating-cta-label,
#floating-cta-container:not(.advisor-menu-open):not(.results-advisor-hidden) #floating-cta-chevron {
  display: none;
}
```

Do not change the scroll reveal controller or mobile bottom-sheet state machine.

- [ ] **Step 4: Run the full suite and verify GREEN**

```bash
node --test tests/light-mode-section-surfaces.test.mjs
```

Expected: all tests pass with zero failures.

- [ ] **Step 5: Run rendered state-transition QA**

The flow under test is: load at `390x844` -> scroll beyond 300px -> observe revealed closed trigger -> open and close bottom sheet -> enter and leave results.

Verify in light and dark themes:

```text
- After scroll reveal, trigger measures 56px × 56px and is circular.
- Only phone icon and green indicator are visible; label and chevron are hidden.
- Accessible name remains "Speak with an Academic Advisor".
- Opening hides the circle and shows the existing bottom sheet.
- Close button, backdrop, and Escape each restore the circle and focus.
- Advisor is completely hidden across the full results-section intersection and restores as a circle after exit.
- At 768x1024 and 1440x900, the existing full trigger and anchored popup remain unchanged.
- No overflow, clipping, page errors, or results-section regressions.
```

Capture and inspect mobile revealed-circle, mobile bottom-sheet, mobile results-hidden, and tablet/desktop screenshots outside the repository.

- [ ] **Step 6: Run final gates and commit**

```bash
node --test tests/light-mode-section-surfaces.test.mjs
git diff --check
curl -sS -o /dev/null -w '%{http_code}\n' http://127.0.0.1:4173/index.html
git diff -- index.html tests/light-mode-section-surfaces.test.mjs
git add index.html tests/light-mode-section-surfaces.test.mjs
git commit -m "fix: restore mobile advisor circle trigger"
```

Expected: tests pass, diff is clean, preview returns `200`, and only the mobile closed-state CSS plus its focused regression test changed.
