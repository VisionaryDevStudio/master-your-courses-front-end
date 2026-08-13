# Advisor Booking Button Balance Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the advisor panel's primary booking action feel compact, centered, and premium at every breakpoint while preserving its conversion priority and all existing behavior.

**Architecture:** Keep the existing single-file HTML/CSS implementation and refine only the shared advisor booking hooks. Replace the booking link's decorative chevron with a decorative calendar icon, then rebalance the shared panel, primary action, and secondary WhatsApp spacing so the same treatment works in the mobile bottom sheet and the 320px tablet/desktop popup.

**Tech Stack:** Static HTML, CSS, inline Lucide-compatible SVG, Node.js built-in test runner, local browser preview.

## Global Constraints

- Refine only the open advisor panel's booking action and nearby spacing on mobile, tablet, and desktop.
- Preserve all copy, URLs, headings, close behavior, focus order, sheet/popup geometry, trigger behavior, motion, and reduced-motion handling.
- Keep `Book a Consultation` as a full-width primary action with an approximate `54px` visual height and at least a `44px` interactive target.
- Remove the directional chevron and place one restrained decorative calendar icon immediately before the label with `aria-hidden="true"`.
- Preserve the existing indigo treatment, hover state, accessible focus ring, exact booking and WhatsApp URLs, and safe new-tab attributes.
- Keep the WhatsApp alternative centered and compact; do not add a card, divider, badge, arrow, or decorative effect.
- Preserve the inset mobile sheet and anchored `320px` tablet/desktop popup.

---

### Task 1: Rebalance the Advisor Booking Composition

**Files:**
- Modify: `index.html:302-357`
- Modify: `index.html:2888-2904`
- Test: `tests/light-mode-section-surfaces.test.mjs:709-790`

**Interfaces:**
- Consumes: Existing `#advisor-booking-link`, `#advisor-whatsapp-link`, `.advisor-booking-panel`, `.advisor-booking-primary`, and `.advisor-booking-secondary` hooks.
- Produces: A centered `.advisor-booking-primary` containing `.advisor-booking-calendar[aria-hidden="true"]`, plus shared spacing values used unchanged by mobile, tablet, and desktop.

- [ ] **Step 1: Add a focused failing contract test**

Extend `uses a booking-first advisor conversion panel in the open mobile sheet` and `keeps the added concierge hooks constrained at desktop popup widths` with assertions that require the new calendar icon, reject the old chevron, and lock the shared balance rules:

```js
assert.match(
  bookingLink,
  /<svg[^>]*class="[^"]*advisor-booking-calendar[^"]*"[^>]*aria-hidden="true"[^>]*>[\s\S]*<rect x="3" y="4" width="18" height="18" rx="2" ry="2"\/>[\s\S]*<line x1="16" y1="2" x2="16" y2="6"\/>[\s\S]*<line x1="8" y1="2" x2="8" y2="6"\/>[\s\S]*<line x1="3" y1="10" x2="21" y2="10"\/>[\s\S]*<\/svg>[\s\S]*<span>Book a Consultation<\/span>/
);
assert.doesNotMatch(bookingLink, /<path d="m9 18 6-6-6-6"\/>/);
assert.match(sharedAdvisorStyles, /\.advisor-booking-panel\s*\{[\s\S]*gap:\s*0\.375rem;[\s\S]*padding:\s*0\.5rem/);
assert.match(sharedAdvisorStyles, /\.advisor-booking-primary\s*\{[\s\S]*justify-content:\s*center;[\s\S]*gap:\s*0\.5rem;[\s\S]*min-height:\s*3\.375rem/);
assert.match(sharedAdvisorStyles, /\.advisor-booking-calendar\s*\{[\s\S]*flex:\s*0 0 auto/);
assert.match(sharedAdvisorStyles, /\.advisor-booking-secondary\s*\{[\s\S]*min-height:\s*2\.75rem;[\s\S]*padding:\s*0\.25rem 0\.5rem/);
```

- [ ] **Step 2: Run the focused test and verify the intended RED state**

Run:

```bash
node --test --test-name-pattern="booking-first|desktop popup widths" tests/light-mode-section-surfaces.test.mjs
```

Expected: FAIL because the current booking link still contains the right-edge chevron and the shared CSS still uses `justify-content: space-between`, `gap: 0.625rem`, and the old padding.

- [ ] **Step 3: Replace the chevron with the decorative calendar icon**

Update only `#advisor-booking-link` in `index.html` so its content is:

```html
<svg class="lucide advisor-booking-calendar h-5 w-5" aria-hidden="true" viewBox="0 0 24 24">
  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
  <line x1="16" y1="2" x2="16" y2="6"/>
  <line x1="8" y1="2" x2="8" y2="6"/>
  <line x1="3" y1="10" x2="21" y2="10"/>
</svg>
<span>Book a Consultation</span>
```

Do not change the link ID, URL, `target`, `rel`, visible label, or classes other than adding the calendar hook.

- [ ] **Step 4: Apply the shared compact spacing rules**

Change the existing shared CSS declarations to these exact values:

```css
.advisor-booking-panel {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  border: 1px solid hsl(var(--border) / 0.6);
  border-radius: 1rem;
  background: hsl(var(--background));
  padding: 0.5rem;
}

.advisor-booking-primary {
  justify-content: center;
  gap: 0.5rem;
  min-height: 3.375rem;
  background: rgb(67 56 202);
  color: white;
}

.advisor-booking-calendar {
  flex: 0 0 auto;
}

.advisor-booking-secondary {
  justify-content: center;
  gap: 0.5rem;
  min-height: 2.75rem;
  padding: 0.25rem 0.5rem;
  color: hsl(var(--muted-foreground));
}
```

Keep the shared `.advisor-booking-primary, .advisor-booking-secondary` structure, border radius, focus-visible rules, primary hover color, and the existing responsive sheet/popup rules unchanged.

- [ ] **Step 5: Run the focused and full static suites**

Run:

```bash
node --test --test-name-pattern="booking-first|desktop popup widths" tests/light-mode-section-surfaces.test.mjs
node --test tests/light-mode-section-surfaces.test.mjs
git diff --check
```

Expected: Focused tests PASS, full suite PASS, and `git diff --check` exits with no output.

- [ ] **Step 6: Verify the rendered result at all supported breakpoints**

Serve the page if needed:

```bash
python3 -m http.server 4173 --bind 127.0.0.1
```

Use the in-app Browser skill first; if its runtime is unavailable, record that reason and use local Chrome/Playwright. Open `http://127.0.0.1:4173/index.html` and inspect the open advisor panel at `390x844`, `768x1024`, and `1440x900` in light and dark mode. Confirm:

- The booking label and calendar icon form one centered visual group.
- The booking action is full width and computes to approximately `54px` high.
- The chevron is absent and the calendar icon does not alter the accessible name `Book a Consultation`.
- The supporting sentence wraps without clipping at `390px`.
- The WhatsApp link remains centered, compact, at least `44px` high, and visually related to the booking action.
- The mobile sheet remains inset; the tablet/desktop popup remains `320px` wide.
- Keyboard order is Close, Book a Consultation, WhatsApp; Escape, close control, and backdrop restore focus to the trigger.
- Reduced motion, overflow, clipping, console errors, and page errors show no regression.

Capture and inspect at least one mobile and one desktop screenshot before completion.

- [ ] **Step 7: Commit the verified refinement**

```bash
git add index.html tests/light-mode-section-surfaces.test.mjs
git commit -m "fix: rebalance advisor booking action"
```

Then run the fresh post-commit gate:

```bash
node --test tests/light-mode-section-surfaces.test.mjs
git show --check --stat --oneline HEAD
```

Expected: Full suite PASS and the committed diff check is clean.
