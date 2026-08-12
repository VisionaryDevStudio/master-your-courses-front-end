# Results Section Motion and Trust Implementation Plan

> **Amendment:** The mobile-advisor portion of Task 2 is superseded by `docs/superpowers/plans/2026-08-11-results-advisor-bottom-sheet.md` after rendered QA proved that a fixed compact control still crossed the results proof. Task 1 remains authoritative.

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the results proof appear at the right moment, remain correct without JavaScript, respect reduced motion, include accurate context, and stay unobstructed by the mobile advisor.

**Architecture:** Give the results section one stable identity and one synchronized count-up controller driven by a section-level observer. Add a mobile-only results-hidden state and bottom-sheet presentation to the existing advisor while preserving its desktop popup, contact destinations, and accessible interaction contract.

**Tech Stack:** Static HTML, Tailwind CSS CDN, scoped CSS, vanilla JavaScript, IntersectionObserver, matchMedia, requestAnimationFrame, Node.js built-in test runner, Browser plugin or the previously approved Playwright/Google Chrome fallback.

## Global Constraints

- Preserve all results cards, order, spacing, radii, shadows, borders, colors, typography, desktop center-card elevation, and static presentation.
- Add no card entrance, floating, hover-scale, parallax, or ambient motion.
- Render `1,200`, `77`, and `21` directly in HTML as safe defaults.
- Observe the results section once at threshold `0.35`; animate all counters together once over `1400ms` using `1 - Math.pow(1 - progress, 3)`.
- Format the student count with `en-US` thousands separators and always finish on exact targets.
- Reduced-motion users receive final values immediately and no count-up frame.
- A mid-animation change to reduced motion cancels the frame, restores final values, and never replays.
- Below `768px`, hide the floating advisor completely while the results section intersects and restore it after leaving.
- Below `768px` outside the results section, open the advisor as one modal bottom sheet and hide the duplicate gradient trigger while open.
- Preserve all three contact choices, backdrop close, Escape close, contained Tab focus, focus restoration, and accessible naming.
- At `768px` and above, preserve the current anchored advisor popup.
- Add exactly: `Based on AP exam outcomes reported by participating students.`
- Do not change animation systems or typography outside this section and its conditional mobile advisor state.

---

### Task 1: Build the trustworthy synchronized results counter

**Files:**
- Modify: `index.html:630-662`
- Modify: `index.html:2847-2873`
- Test: `tests/light-mode-section-surfaces.test.mjs`

**Interfaces:**
- Consumes: `.count-up`, each element's numeric `data-target`, `requestAnimationFrame`, `cancelAnimationFrame`, `IntersectionObserver`, and `matchMedia('(prefers-reduced-motion: reduce)')`.
- Produces: `#results-section`, final HTML metric text, the approved qualifier, and one one-shot synchronized count-up controller.

- [ ] **Step 1: Add failing static contract tests**

Add tests that assert:

```js
test("keeps final results values and the approved qualifier in HTML", () => {
  const results = html.match(/<section id="results-section"[\s\S]*?<\/section>/)?.[0] ?? "";
  assert.match(results, /class="count-up" data-target="1200">1,200<\/span>/);
  assert.match(results, /class="count-up" data-target="77">77<\/span>/);
  assert.match(results, /class="count-up" data-target="21">21<\/span>/);
  assert.match(results, /Based on AP exam outcomes reported by participating students\./);
});

test("uses one synchronized reduced-motion-aware results counter", () => {
  const controller = html.slice(html.indexOf("// Results Count-Up"), html.indexOf("// Floating CTA Logic"));
  assert.match(controller, /const RESULTS_COUNT_DURATION = 1400/);
  assert.match(controller, /const easedProgress = 1 - Math\.pow\(1 - progress, 3\)/);
  assert.match(controller, /new IntersectionObserver\([\s\S]*threshold:\s*0\.35/);
  assert.match(controller, /observe\(resultsSection\)/);
  assert.match(controller, /prefers-reduced-motion:\s*reduce/);
  assert.match(controller, /cancelAnimationFrame\(resultsCountFrame\)/);
  assert.doesNotMatch(controller, /forEach\([^)]*=>\s*resultsObserver\.observe/);
});
```

- [ ] **Step 2: Run the suite and verify RED**

Run:

```bash
node --test tests/light-mode-section-surfaces.test.mjs
```

Expected: both new tests fail because the section has no ID or qualifier, HTML contains zeroes, and the current controller observes each counter for 2000ms.

- [ ] **Step 3: Apply the safe HTML and trust qualifier**

- Add `id="results-section"` to the existing results section.
- Replace the three numeric text nodes with `1,200`, `77`, and `21` while preserving `data-target` and suffix spans.
- Add the approved qualifier immediately after the success-rate badge container:

```html
<p class="mt-3 text-center text-xs font-medium text-muted-foreground">
  Based on AP exam outcomes reported by participating students.
</p>
```

- [ ] **Step 4: Replace the per-number controller with one synchronized controller**

Replace the existing count-up block with a `// Results Count-Up` block implementing this state model:

```js
const resultsSection = document.getElementById('results-section');
const resultsCountElements = resultsSection ? [...resultsSection.querySelectorAll('.count-up')] : [];
const resultsReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const RESULTS_COUNT_DURATION = 1400;
let resultsCountFrame = null;
let resultsCountComplete = resultsReducedMotion.matches;

function writeFinalResults() {
  resultsCountElements.forEach(element => {
    element.textContent = Number(element.dataset.target).toLocaleString('en-US');
  });
}

function runResultsCount() {
  if (resultsCountComplete || resultsReducedMotion.matches || resultsCountElements.length === 0) {
    resultsCountComplete = true;
    writeFinalResults();
    return;
  }
  resultsCountElements.forEach(element => { element.textContent = '0'; });
  let startTimestamp = null;
  const step = timestamp => {
    if (resultsReducedMotion.matches) {
      resultsCountFrame = null;
      resultsCountComplete = true;
      writeFinalResults();
      return;
    }
    if (startTimestamp === null) startTimestamp = timestamp;
    const progress = Math.min((timestamp - startTimestamp) / RESULTS_COUNT_DURATION, 1);
    const easedProgress = 1 - Math.pow(1 - progress, 3);
    resultsCountElements.forEach(element => {
      const target = Number(element.dataset.target);
      element.textContent = Math.floor(target * easedProgress).toLocaleString('en-US');
    });
    if (progress < 1) {
      resultsCountFrame = window.requestAnimationFrame(step);
    } else {
      resultsCountFrame = null;
      resultsCountComplete = true;
      writeFinalResults();
    }
  };
  resultsCountFrame = window.requestAnimationFrame(step);
}
```

Create one observer with `{ threshold: 0.35 }`; when `resultsSection` intersects, call `runResultsCount()`, unobserve the section, and never replay. If reduced motion is active at initialization, call `writeFinalResults()` and do not observe. On the media query's `change` event, when `event.matches` is true, cancel a non-null frame, mark complete, write final values, and unobserve the section.

- [ ] **Step 5: Add behavior-focused regression coverage**

Use a small VM harness following the existing hero-motion harness pattern to execute the real results controller with controlled elements, observer, media query, and animation frames. Assert:

```js
- initial HTML values remain final before intersection;
- observer options equal { threshold: 0.35 } and only #results-section is observed;
- intersection changes all three values to 0 and schedules exactly one shared frame;
- at 700ms the ease-out values are 1,050 / 67 / 18;
- at 1400ms values finish exactly 1,200 / 77 / 21 and the section is unobserved;
- a second intersection cannot replay the count;
- initial reduced motion observes nothing and schedules no frame;
- enabling reduced motion during the count cancels the frame and immediately writes final values.
```

- [ ] **Step 6: Run full tests and commit Task 1**

```bash
node --test tests/light-mode-section-surfaces.test.mjs
git diff --check
git add index.html tests/light-mode-section-surfaces.test.mjs
git commit -m "feat: refine results count-up motion"
```

Expected: all tests pass and the commit contains only the results markup/controller plus focused tests.

---

### Task 2: Protect mobile proof from the floating advisor

**Files:**
- Modify: `index.html:330-375`
- Modify: `index.html:2679-2740`
- Modify: `index.html:2875-2910`
- Test: `tests/light-mode-section-surfaces.test.mjs`

**Interfaces:**
- Consumes: `#results-section` from Task 1; `#floating-cta-container`, `#floating-cta-menu`, `#floating-cta-backdrop`, `#floating-cta-chevron`, `isCtaOpen`, and `toggleFloatingCTA()`.
- Produces: `.results-advisor-compact`, `#floating-cta-toggle`, `#floating-cta-toggle-content`, `#floating-cta-label`, and a viewport-aware advisor state synchronizer.

- [ ] **Step 1: Add failing compact-state tests**

Add static and behavior tests asserting:

```js
test("defines an accessible mobile-only compact advisor state for results", () => {
  assert.match(html, /@media \(max-width:\s*767px\)[\s\S]*\.results-advisor-compact/);
  assert.match(html, /id="floating-cta-toggle"[^>]*aria-label="Speak with an Academic Advisor"/);
  assert.match(html, /id="floating-cta-toggle-content"/);
  assert.match(html, /id="floating-cta-label"/);
  assert.match(html, /resultsAdvisorMedia = window\.matchMedia\('\(max-width: 767px\)'\)/);
  assert.match(html, /results-advisor-compact/);
});
```

The behavior harness must prove a 390px intersecting results section adds the compact state, opening the menu removes it while keeping `aria-expanded="true"`, closing reapplies it, leaving the section removes it, and a 768px viewport never adds it.

- [ ] **Step 2: Run the suite and verify RED**

Run:

```bash
node --test tests/light-mode-section-surfaces.test.mjs
```

Expected: the new compact-advisor tests fail because no compact state or synchronizer exists.

- [ ] **Step 3: Add the scoped compact-state CSS and markup hooks**

Add CSS under `@media (max-width: 767px)`:

```css
#floating-cta-container.results-advisor-compact:not(.advisor-menu-open) {
  left: auto;
  width: 3.5rem;
}
#floating-cta-container.results-advisor-compact:not(.advisor-menu-open) #floating-cta-toggle {
  width: 3.5rem;
  height: 3.5rem;
}
#floating-cta-container.results-advisor-compact:not(.advisor-menu-open) #floating-cta-toggle-content {
  width: 3.5rem;
  height: 3.5rem;
  padding: 0;
  gap: 0;
}
#floating-cta-container.results-advisor-compact:not(.advisor-menu-open) #floating-cta-label,
#floating-cta-container.results-advisor-compact:not(.advisor-menu-open) #floating-cta-chevron {
  display: none;
}
```

Add `id="floating-cta-toggle"` to the existing toggle button, `id="floating-cta-toggle-content"` to its inner flex wrapper, and `id="floating-cta-label"` to its visible text span. Preserve the button's accessible label and all existing content.

- [ ] **Step 4: Add the viewport/intersection synchronizer**

After the existing advisor references, add:

```js
const resultsAdvisorMedia = window.matchMedia('(max-width: 767px)');
let resultsSectionIntersecting = false;

function syncResultsAdvisorState() {
  if (!floatingCtaContainer) return;
  const compact = resultsAdvisorMedia.matches && resultsSectionIntersecting && !isCtaOpen;
  floatingCtaContainer.classList.toggle('results-advisor-compact', compact);
  floatingCtaContainer.classList.toggle('advisor-menu-open', isCtaOpen);
}
```

Observe `#results-section` with a separate advisor observer at threshold `0`. Set `resultsSectionIntersecting = entry.isIntersecting` and call the synchronizer. Listen for media-query changes and call the synchronizer. Call the synchronizer at the end of both branches of `toggleFloatingCTA()` after setting the menu state and update the existing toggle button's `aria-expanded` value to match `isCtaOpen`.

- [ ] **Step 5: Run full static and behavior tests**

```bash
node --test tests/light-mode-section-surfaces.test.mjs
```

Expected: all Task 1 and Task 2 tests pass with zero failures.

- [ ] **Step 6: Run combined rendered QA**

The flow under test is: load the page -> enter the results section -> observe synchronized proof -> open and close the compact mobile advisor -> leave the section -> verify restoration.

Use the Browser plugin first. If its runtime remains unavailable, use the previously approved Playwright/Google Chrome fallback and record the reason. Verify:

```text
390x844 light and dark:
- final values exist before the section enters;
- at 35% visibility all values start together and complete around 1400ms;
- advisor becomes a 56x56 control and covers no card, badge, or qualifier;
- button accessible name remains "Speak with an Academic Advisor";
- opening the menu restores usable full width, sets aria-expanded true, and all three contact choices remain reachable;
- closing reapplies compact state; leaving the section restores the full bar;
- no horizontal overflow or clipping.

768x1024 and 1440x900 light and dark:
- advisor never uses the compact state;
- card geometry and 16px desktop center-card elevation are unchanged;
- count-up synchronization, duration, and final values pass.

Reduced motion before load and toggled mid-count:
- final values display immediately;
- no count frame at initial reduced motion;
- a running frame is cancelled on preference change and cannot replay.

General:
- qualifier is visible and readable;
- no relevant console errors or framework overlay;
- existing advisor interaction and focus behavior remain intact.
```

Capture and inspect mobile and desktop light/dark screenshots outside the repository.

- [ ] **Step 7: Run gates and commit Task 2**

```bash
node --test tests/light-mode-section-surfaces.test.mjs
git diff --check
curl -sS -o /dev/null -w '%{http_code}\n' http://127.0.0.1:4173/index.html
git diff -- index.html tests/light-mode-section-surfaces.test.mjs
git add index.html tests/light-mode-section-surfaces.test.mjs
git commit -m "fix: protect mobile results proof"
```

Expected: tests pass, diff check is clean, preview returns HTTP `200`, and the task diff is restricted to scoped advisor CSS/markup/controller changes and focused tests.
