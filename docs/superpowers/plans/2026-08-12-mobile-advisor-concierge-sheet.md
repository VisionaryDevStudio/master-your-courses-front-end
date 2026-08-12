# Mobile Advisor Concierge Sheet Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the oversized open mobile advisor presentation with the approved compact concierge sheet while preserving its trigger, contact destinations, accessibility behavior, and tablet/desktop popup.

**Architecture:** Keep the existing single-file HTML/CSS/JavaScript architecture. Add mobile-only semantic hooks and styles to the existing advisor markup, allowing the current `setFloatingCtaOpen` controller to remain the single source of open/closed state; use CSS media queries for compact layout and reduced motion. Extend the existing static and VM behavior suite, then verify the rendered flow in a real browser.

**Tech Stack:** Static HTML, Tailwind CDN utilities, scoped CSS, vanilla JavaScript, Node.js built-in test runner, Playwright/Chrome fallback only if the in-app Browser runtime is unavailable.

## Global Constraints

- Apply the redesign only below `768px` while the advisor is open.
- Keep the closed mobile trigger `56×56px` and reveal it only after the Results section has been passed.
- Preserve `tel:+18001234567`, `https://wa.me/18001234567`, and `mailto:admissions@masteryourcourses.com` exactly.
- Preserve close-button, backdrop, Escape, focus-entry, Tab containment, and focus-restoration behavior.
- Keep the existing anchored popup at `768px` and above visually and behaviorally unchanged.
- Use `How can we help?` and `Connect with our academic team.` as the mobile sheet heading and supporting copy.
- Use one unified list with three `64–68px` rows, two fine dividers, restrained colored icon wells, and one directional chevron per row.
- Use `24px` top corners, safe-area bottom padding, a subtle dim backdrop, and approximately `280ms` upward entrance motion.
- Remove meaningful translation when `prefers-reduced-motion: reduce` is active.
- Add no dependencies and perform no unrelated refactor.

---

### Task 1: Build and verify the compact mobile concierge sheet

**Files:**
- Modify: `index.html:338-365` — mobile sheet, backdrop, and reduced-motion styles
- Modify: `index.html:2740-2781` — semantic handle, header copy, unified contact list, and row chevrons
- Modify: `tests/light-mode-section-surfaces.test.mjs:697-728` — mobile concierge structure and style contract
- Verify: `tests/light-mode-section-surfaces.test.mjs:734-902` — existing interaction harness and responsive preservation

**Interfaces:**
- Consumes: `#floating-cta-container.advisor-menu-open`, `#floating-cta-menu`, `#floating-cta-backdrop`, `#floating-cta-title`, `#floating-cta-close`, and the existing `setFloatingCtaOpen(nextOpen, { restoreFocus })` state controller.
- Produces: `#floating-cta-handle`, `.advisor-sheet-header`, `.advisor-sheet-subtitle`, `.advisor-contact-list`, `.advisor-contact-row`, `.advisor-contact-icon`, and `.advisor-contact-arrow` hooks used only for presentation and verification.
- Preserves: the existing dialog semantics, focusable order `[close, Call, WhatsApp, Email]`, link destinations, trigger controller, and `results-advisor-hidden` behavior.

- [ ] **Step 1: Add a failing mobile concierge contract test**

Add this focused test after `hides the advisor over mobile results and uses a single accessible bottom sheet elsewhere`:

```js
test("uses the compact premium concierge presentation only for the open mobile advisor", () => {
  assert.match(html, /id="floating-cta-handle"[^>]*aria-hidden="true"/);
  assert.match(html, /id="floating-cta-title"[^>]*>How can we help\?<\/h3>/);
  assert.match(html, /class="advisor-sheet-subtitle[^>]*>Connect with our academic team\.<\/p>/);
  assert.equal((html.match(/class="advisor-contact-row/g) ?? []).length, 3);
  assert.equal((html.match(/class="advisor-contact-arrow/g) ?? []).length, 3);
  assert.match(html, /class="advisor-contact-list[^"]*divide-y/);
  assert.match(html, /@media \(max-width:\s*767px\)[\s\S]*border-radius:\s*1\.5rem 1\.5rem 0 0/);
  assert.match(html, /@media \(max-width:\s*767px\)[\s\S]*\.advisor-contact-row\s*\{[\s\S]*min-height:\s*4rem/);
  assert.match(html, /@media \(prefers-reduced-motion:\s*reduce\)[\s\S]*#floating-cta-menu[\s\S]*transition-duration:\s*0\.01ms/);
  assert.match(html, /href="tel:\+18001234567"/);
  assert.match(html, /href="https:\/\/wa\.me\/18001234567"/);
  assert.match(html, /href="mailto:admissions@masteryourcourses\.com"/);
});
```

- [ ] **Step 2: Run the focused suite and verify RED**

Run:

```bash
node --test --test-name-pattern="compact premium concierge" tests/light-mode-section-surfaces.test.mjs
```

Expected: FAIL because the approved handle, copy, unified-list hooks, arrows, mobile geometry, and reduced-motion contract do not yet exist.

- [ ] **Step 3: Implement the minimal semantic markup**

In `#floating-cta-menu`, add a decorative handle before the header, replace the heading copy, add the subtitle, and wrap the links in one list:

```html
<div id="floating-cta-handle" aria-hidden="true"></div>
<div class="advisor-sheet-header">
  <div>
    <h3 id="floating-cta-title" class="font-bold text-foreground">How can we help?</h3>
    <p class="advisor-sheet-subtitle text-muted-foreground">Connect with our academic team.</p>
  </div>
  <button id="floating-cta-close" onclick="toggleFloatingCTA()" class="flex h-11 w-11 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500" aria-label="Close menu">
    <svg class="lucide h-5 w-5" viewBox="0 0 24 24"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
  </button>
</div>
```

Immediately after the header, open `<div class="advisor-contact-list divide-y divide-slate-200/80 dark:divide-white/10">`, place the three existing anchors inside it in their current order, and close the wrapper after the Email anchor. Give each anchor `class="advisor-contact-row ..."`, each colored icon well `class="advisor-contact-icon ..."`, and append this decorative arrow to each anchor:

```html
<svg class="advisor-contact-arrow lucide" aria-hidden="true" viewBox="0 0 24 24">
  <path d="m9 18 6-6-6-6"/>
</svg>
```

Remove the three individual white/dark card backgrounds, outer borders, rounded corners, and per-card shadows from the mobile contact anchors. Keep desktop equivalents through `md:` utilities or desktop-scoped CSS so the `768px+` popup remains unchanged.

- [ ] **Step 4: Implement the scoped mobile visual system**

Within `@media (max-width: 767px)`, update the open sheet and add the focused hooks:

```css
#floating-cta-container.advisor-menu-open #floating-cta-menu {
  max-height: min(78vh, 32rem);
  overflow-y: auto;
  border-radius: 1.5rem 1.5rem 0 0;
  padding: 0.5rem 1rem max(1rem, env(safe-area-inset-bottom));
  gap: 0;
  background: hsl(var(--background) / 0.985);
  box-shadow: 0 -1.25rem 4rem rgb(15 23 42 / 0.16);
  transform: translateY(0) scale(1);
  transition: opacity 220ms ease-out, transform 280ms cubic-bezier(0.22, 1, 0.36, 1), visibility 0s;
}

#floating-cta-menu.opacity-0 {
  transform: translateY(1.25rem) scale(1);
}

#floating-cta-handle {
  width: 2.25rem;
  height: 0.25rem;
  margin: 0 auto 0.375rem;
  border-radius: 999px;
  background: hsl(var(--muted-foreground) / 0.3);
}

.advisor-sheet-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.375rem 0.25rem 0.875rem;
}

.advisor-sheet-subtitle {
  margin-top: 0.125rem;
  font-size: 0.8125rem;
  line-height: 1.25rem;
}

.advisor-contact-list {
  overflow: hidden;
  border: 1px solid hsl(var(--border));
  border-radius: 1rem;
  background: hsl(var(--background));
}

.advisor-contact-row {
  display: flex;
  align-items: center;
  min-height: 4rem;
  gap: 0.75rem;
  padding: 0.625rem 0.75rem;
}

.advisor-contact-icon {
  width: 2.25rem;
  height: 2.25rem;
  flex: 0 0 2.25rem;
}

.advisor-contact-arrow {
  width: 1rem;
  height: 1rem;
  margin-left: auto;
  color: hsl(var(--muted-foreground) / 0.7);
}

#floating-cta-container.advisor-menu-open #floating-cta-backdrop {
  background: rgb(15 23 42 / 0.48);
  backdrop-filter: blur(2px);
}
```

Add a `@media (prefers-reduced-motion: reduce)` override that limits the mobile menu and backdrop transition duration to `0.01ms` and removes translation. Ensure the closed menu retains `opacity: 0`/`visibility: hidden`, while the open menu has `translateY(0)`.

- [ ] **Step 5: Run the focused and full suites and verify GREEN**

Run:

```bash
node --test --test-name-pattern="compact premium concierge" tests/light-mode-section-surfaces.test.mjs
node --test tests/light-mode-section-surfaces.test.mjs
git diff --check
```

Expected: focused test PASS; full suite PASS with at least 36 tests and zero failures; diff check exits `0`.

- [ ] **Step 6: Verify the rendered interaction and visual contract**

The flow under test is: `index.html` at `390×844` → scroll beyond Results → open the circular advisor → inspect compact sheet → close by each supported path → confirm trigger restoration.

Use the in-app Browser first. If its Node REPL runtime is unavailable, record that exact limitation and use the existing local Playwright/Google Chrome fallback without installing dependencies. Verify:

```text
390×844 light: sheet height is at least 25% shorter than the recorded oversized baseline; no internal scroll; no clipping.
390×844 dark: surface, dividers, icons, copy, and focus treatment remain readable.
Mobile structure: one handle, one title, one subtitle, three rows, two dividers, three arrows.
Destinations: exact tel, WhatsApp, and mailto href values remain unchanged.
Interaction: close button, backdrop, Escape, Tab wrap, Shift+Tab wrap, and focus restoration all pass.
Motion: normal opening uses bounded upward motion; reduced motion has no meaningful translation.
Trigger sequence: hidden before/through Results; one 56×56 circle appears after Results and returns after close.
768×1024 and 1440×900: anchored popup geometry and behavior remain unchanged.
Health: correct title/URL, meaningful DOM, no framework overlay, no horizontal overflow, and no relevant page errors.
```

Save temporary screenshots outside the repository for mobile light-open, mobile dark-open, mobile reduced-motion-open, tablet popup, and desktop popup. Inspect every screenshot before accepting it.

- [ ] **Step 7: Commit the scoped implementation**

Run:

```bash
git add index.html tests/light-mode-section-surfaces.test.mjs
git commit -m "feat: refine mobile advisor concierge sheet"
git show --check --stat --oneline HEAD
```

Expected: one scoped commit containing only `index.html` and `tests/light-mode-section-surfaces.test.mjs`; commit check exits `0`.
