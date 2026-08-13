# Mobile Consultation Trigger Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the closed mobile advisor circle communicate consultation booking with a calendar icon, no false live-status indicator, and a quieter premium edge treatment.

**Architecture:** Keep one accessible trigger and add separate decorative calendar and phone SVG hooks inside it. Mobile CSS shows the calendar, hides the phone and ping, and owns the circle border/focus/pressed treatment; the existing tablet/desktop content remains visible from `768px` upward.

**Tech Stack:** Static HTML, CSS, inline Lucide-compatible SVG, Node.js built-in test runner, local browser preview.

## Global Constraints

- Refine only the closed mobile circular trigger.
- Keep its exact `56px` size, purple gradient, accessible name `Speak with an Academic Advisor`, and `aria-expanded` behavior.
- Show a restrained calendar icon and hide the phone icon and green ping below `768px`.
- Preserve the phone icon, green indicator, label, chevron, dimensions, and behavior at `768px` and wider.
- Use one translucent light border, restrained shadow, visible keyboard focus, and the existing transition; add no continuous icon animation.
- Preserve the open sheet, booking flow, trigger visibility timing, Results-section logic, focus restoration, and reduced-motion behavior.

---

### Task 1: Refine the Closed Mobile Consultation Trigger

**Files:**
- Modify: `index.html:376-414`
- Modify: `index.html:2925-2942`
- Test: `tests/light-mode-section-surfaces.test.mjs:851-865`

**Interfaces:**
- Consumes: `#floating-cta-toggle`, `#floating-cta-toggle-content`, `#floating-cta-ping`, existing phone SVG, mobile `max-width: 767px` CSS, and existing toggle controller.
- Produces: `.advisor-trigger-calendar` and `.advisor-trigger-phone` decorative SVG hooks plus mobile-only presentation rules.

- [ ] **Step 1: Add a focused failing markup and mobile-style contract**

Extend `keeps the closed mobile advisor circular while it transitions into the results-hidden state` by extracting the trigger markup and the exact mobile media block, then assert:

```js
const triggerStart = html.indexOf('id="floating-cta-toggle"');
const triggerEnd = html.indexOf('</button>', triggerStart);
const trigger = html.slice(triggerStart, triggerEnd);
const mobileStart = html.indexOf('@media (max-width: 767px)');
const nextMedia = html.indexOf('@media ', mobileStart + 1);
const mobileStyles = html.slice(mobileStart, nextMedia);

assert.match(trigger, /class="[^"]*advisor-trigger-calendar[^"]*"[^>]*aria-hidden="true"/);
assert.match(trigger, /class="[^"]*advisor-trigger-phone[^"]*"[^>]*aria-hidden="true"/);
assert.match(trigger, /id="floating-cta-ping"/);
assert.match(mobileStyles, /\.advisor-trigger-calendar\s*\{[\s\S]*display:\s*block/);
assert.match(mobileStyles, /\.advisor-trigger-phone,[\s\S]*#floating-cta-ping\s*\{[\s\S]*display:\s*none/);
assert.match(mobileStyles, /#floating-cta-container:not\(\.advisor-menu-open\) #floating-cta-toggle\s*\{[\s\S]*border:\s*2px solid rgb\(255 255 255 \/ 0\.72\);[\s\S]*box-shadow:\s*0 10px 28px rgb\(67 56 202 \/ 0\.24\)/);
assert.match(mobileStyles, /#floating-cta-container:not\(\.advisor-menu-open\) #floating-cta-toggle:focus-visible\s*\{[\s\S]*box-shadow:[^;]*0 0 0 3px rgb\(99 102 241 \/ 0\.5\)/);
assert.match(mobileStyles, /#floating-cta-container:not\(\.advisor-menu-open\) #floating-cta-toggle:active\s*\{[\s\S]*transform:\s*scale\(0\.96\)/);
const sharedStyles = html.slice(0, mobileStart);
assert.match(sharedStyles, /\.advisor-trigger-calendar\s*\{\s*display:\s*none;\s*\}/);
assert.doesNotMatch(sharedStyles, /\.advisor-trigger-phone\s*\{[\s\S]*display:\s*none|#floating-cta-ping\s*\{[\s\S]*display:\s*none/);
```

- [ ] **Step 2: Run the focused test and observe RED**

```bash
node --test --test-name-pattern="closed mobile advisor circular" tests/light-mode-section-surfaces.test.mjs
```

Expected: FAIL because the separate icon hooks and mobile-only surface rules do not yet exist.

- [ ] **Step 3: Add separate decorative calendar and phone icons**

Inside the trigger's existing icon wrapper, replace the anonymous phone-only SVG with:

```html
<svg class="lucide advisor-trigger-calendar w-5 h-5 text-white" aria-hidden="true" viewBox="0 0 24 24">
  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
  <line x1="16" y1="2" x2="16" y2="6"/>
  <line x1="8" y1="2" x2="8" y2="6"/>
  <line x1="3" y1="10" x2="21" y2="10"/>
</svg>
<svg class="lucide advisor-trigger-phone w-5 h-5 text-white" aria-hidden="true" viewBox="0 0 24 24">
  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
</svg>
```

Keep the ping markup for desktop and keep the trigger's accessible label and state attributes unchanged.

- [ ] **Step 4: Add exact mobile-only presentation rules**

Within `@media (max-width: 767px)`, add:

```css
.advisor-trigger-calendar {
  display: block;
}

.advisor-trigger-phone,
#floating-cta-ping {
  display: none;
}

#floating-cta-container:not(.advisor-menu-open) #floating-cta-toggle {
  width: 3.5rem;
  height: 3.5rem;
  border: 2px solid rgb(255 255 255 / 0.72);
  box-shadow: 0 10px 28px rgb(67 56 202 / 0.24);
}

#floating-cta-container:not(.advisor-menu-open) #floating-cta-toggle:focus-visible {
  box-shadow:
    0 10px 28px rgb(67 56 202 / 0.24),
    0 0 0 3px rgb(99 102 241 / 0.5);
}

#floating-cta-container:not(.advisor-menu-open) #floating-cta-toggle:active {
  transform: scale(0.96);
}
```

Add one shared default immediately before the mobile media query so desktop retains the phone:

```css
.advisor-trigger-calendar {
  display: none;
}
```

The mobile-scope test must exclude this one shared default while rejecting any shared rule that hides the phone or ping.

- [ ] **Step 5: Run focused and full static verification**

```bash
node --test --test-name-pattern="closed mobile advisor circular" tests/light-mode-section-surfaces.test.mjs
node --test tests/light-mode-section-surfaces.test.mjs
git diff --check
```

Expected: Focused and full suites PASS; diff check clean.

- [ ] **Step 6: Verify rendered mobile and desktop behavior**

Open `http://127.0.0.1:4173/index.html` using the in-app Browser skill first; if unavailable, record why and use local Chrome/Playwright. Verify:

- `390x844` light and dark: closed trigger is exactly `56x56`, calendar centered, phone and green ping absent, purple gradient retained, single translucent border visible.
- Mobile keyboard focus: clear focus indication without layout shift; pressed state scales to `0.96` and returns cleanly.
- Mobile interaction: click opens the sheet, `aria-expanded` becomes `true`, Escape/close/backdrop restore focus, and Results visibility behavior remains stable.
- `768x1024` and `1440x900`: phone, green ping, label, and chevron remain visible; calendar remains hidden; control dimensions and behavior are unchanged.
- Light/dark, reduced motion, overflow, clipping, console errors, and page errors show no regression.

Save open and closed mobile screenshots plus one desktop closed-trigger screenshot inside this plan's SDD workspace.

- [ ] **Step 7: Commit and run the post-commit gate**

```bash
git add index.html tests/light-mode-section-surfaces.test.mjs
git commit -m "fix: clarify mobile consultation trigger"
node --test tests/light-mode-section-surfaces.test.mjs
git show --check --stat --oneline HEAD
```

Expected: Full suite PASS and committed diff clean.
