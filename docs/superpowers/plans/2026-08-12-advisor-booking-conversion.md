# Advisor Booking Conversion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the floating advisor's Call/WhatsApp/Email directory with one primary booking action and one secondary WhatsApp action on mobile, tablet, and desktop.

**Architecture:** Preserve the existing advisor container, responsive sheet/popup, state controller, modal semantics, and focus trap. Replace only the panel's action markup and the action-specific CSS hooks; update the existing static and VM behavior tests so the new two-link focus order and conversion contract are executable.

**Tech Stack:** Static HTML, scoped CSS, Tailwind CDN utilities, vanilla JavaScript, Node.js built-in test runner, Browser plugin with approved local Chrome fallback only if its Node REPL runtime is unavailable.

## Global Constraints

- Keep the header CTA `Apply Now` and its existing destination unchanged.
- Use exactly `Book a Consultation` and `Choose a convenient time to discuss your student’s goals.`
- Use `https://cal.com/your-booking-link` as the explicit temporary booking URL and mark it with an adjacent searchable HTML comment.
- Open booking and WhatsApp in new tabs with `target="_blank" rel="noopener noreferrer"`.
- Preserve WhatsApp destination `https://wa.me/18001234567`.
- Remove visible and focusable Call and Email actions from the advisor panel.
- Preserve mobile sheet geometry, trigger reveal sequence, backdrop, close paths, motion/reduced-motion, and focus restoration.
- Preserve the anchored popup at `768px+`, with the same booking-first hierarchy.
- Add no dependencies and make no unrelated changes.

---

### Task 1: Replace advisor contact choices with a booking-first conversion panel

**Files:**
- Modify: `index.html:413-451` — replace obsolete row hooks with booking-panel hooks
- Modify: `index.html:2854-2904` — replace three contact rows with primary booking and secondary WhatsApp
- Modify: `tests/light-mode-section-surfaces.test.mjs:697-783` — replace three-row contracts with booking conversion contracts
- Modify: `tests/light-mode-section-surfaces.test.mjs:798-902` — update focusable harness from four controls to three

**Interfaces:**
- Consumes: existing `#floating-cta-menu`, `#floating-cta-title`, `#floating-cta-close`, `setFloatingCtaOpen`, and keyboard focus-trap controller.
- Produces: `#advisor-booking-link`, `.advisor-booking-copy`, `.advisor-booking-primary`, and `#advisor-whatsapp-link`.
- Focus order: `#floating-cta-close` → `#advisor-booking-link` → `#advisor-whatsapp-link`.

- [ ] **Step 1: Write failing conversion and focus-order tests**

Add a test asserting exactly one `Book a Consultation` link with `href="https://cal.com/your-booking-link"`, safe new-tab attributes, the exact supporting sentence, one WhatsApp link with its preserved URL, an adjacent `BOOKING_URL_PLACEHOLDER` comment, and absence of `tel:+18001234567`, `mailto:admissions@masteryourcourses.com`, `Call an Advisor`, and `Email Admissions` inside the advisor menu slice.

Update the harness focusable IDs to:

```js
["floating-cta-close", "advisor-booking-link", "advisor-whatsapp-link"]
```

Assert opening focuses the close control, Tab wraps from WhatsApp to close, Shift+Tab wraps from close to WhatsApp, and closing restores the floating trigger.

- [ ] **Step 2: Run RED**

Run:

```bash
node --test --test-name-pattern="booking-first advisor|hides the mobile advisor throughout" tests/light-mode-section-surfaces.test.mjs
```

Expected: FAIL because the booking action is absent and the old Call/Email actions remain.

- [ ] **Step 3: Implement the minimal booking-first markup and styles**

Keep the existing responsive header and close button. Replace `.advisor-contact-list` with:

```html
<div class="advisor-booking-panel">
  <p class="advisor-booking-copy text-muted-foreground">Choose a convenient time to discuss your student’s goals.</p>
  <!-- BOOKING_URL_PLACEHOLDER: replace this URL with the production scheduling link. -->
  <a id="advisor-booking-link" href="https://cal.com/your-booking-link" target="_blank" rel="noopener noreferrer" class="advisor-booking-primary">
    <span>Book a Consultation</span>
    <!-- preserve a restrained directional arrow -->
  </a>
  <a id="advisor-whatsapp-link" href="https://wa.me/18001234567" target="_blank" rel="noopener noreferrer" class="advisor-booking-secondary">
    <!-- preserve the existing WhatsApp icon -->
    <span>Prefer to message us? <strong>Chat on WhatsApp</strong></span>
  </a>
</div>
```

Use CSS hooks with a minimum `44px` target, high-contrast indigo primary button, quiet secondary link, and full-element `:focus-visible` rings. Keep the mobile panel compact and reset only necessary geometry at `768px+`; do not alter the outer sheet/popup controller or motion rules.

- [ ] **Step 4: Update obsolete structure tests and verify GREEN**

Remove assertions that require three contact rows, three arrows, three icons, and the old desktop contact cards. Replace them with assertions for one primary link, one secondary link, exact copy/URLs, safe attributes, and breakpoint-compatible booking panel hooks.

Run:

```bash
node --test --test-name-pattern="booking-first advisor|compact premium concierge|desktop popup widths|hides the mobile advisor throughout" tests/light-mode-section-surfaces.test.mjs
node --test tests/light-mode-section-surfaces.test.mjs
git diff --check
```

Expected: focused tests and complete suite PASS with zero failures; diff check exits `0`.

- [ ] **Step 5: Run rendered responsive and interaction QA**

The flow under test is: mobile page → pass Results → open advisor → inspect booking-first sheet → exercise keyboard/close paths; repeat open state at tablet and desktop.

Verify at `390×844` light/dark/reduced motion, `768×1024`, and `1440×900`:

```text
Exactly one booking action and one WhatsApp alternative.
Exact href and safe new-tab attributes.
No visible/focusable Call or Email option.
Mobile sheet remains inset, unclipped, compact, and horizontally safe.
Tablet/desktop remains an anchored 320px popup.
Focus order is Close → Booking → WhatsApp and wraps both directions.
Escape, backdrop, close button, and trigger focus restoration pass.
Header Apply Now remains visible and unchanged.
No relevant page errors or horizontal overflow.
```

Use the in-app Browser first. If its Node REPL runtime is unavailable after discovery, document that and use the existing local Chrome fallback without installing dependencies. Save and inspect temporary screenshots outside the repository.

- [ ] **Step 6: Commit the scoped implementation**

Run:

```bash
git add index.html tests/light-mode-section-surfaces.test.mjs
git commit -m "feat: make advisor booking-first"
git show --check --stat --oneline HEAD
```

Expected: one scoped commit touching only the HTML and focused test file.
