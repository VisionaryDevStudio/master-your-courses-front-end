# Methodology Premium Refinement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the “Why Our Students Succeed” section feel like a premium, coherent academic system with reliable, restrained, accessible motion.

**Architecture:** Keep the existing six-card responsive grid and enhance it with section-scoped `.methodology-*` markup and CSS. Give methodology cards their own IntersectionObserver so reveal order is explicit and independent of the generic page reveal callback; CSS remains visible by default and hides cards only after JavaScript marks the section motion-ready.

**Tech Stack:** Static HTML, Tailwind CDN utilities, scoped CSS, vanilla JavaScript IntersectionObserver, Node test runner, local HTTP preview, browser-rendered responsive QA.

## Global Constraints

- Modify only the methodology markup, scoped CSS, its reveal-controller integration, and focused regression tests.
- Preserve the existing 3-column desktop, 2-column tablet, and 1-column mobile grid.
- Preserve the methodology section’s atmospheric indigo surface and existing six claims.
- Do not add decorative squares, imagery, dependencies, or unrelated page changes.
- All cards must remain visible if JavaScript is unavailable or initialization fails.
- Under `prefers-reduced-motion: reduce`, cards render immediately with no translation, scale, stagger, or hover transform.
- Hover motion is allowed only when `(hover: hover) and (pointer: fine)` matches.
- Use the nested repository at `/Users/admin/Desktop/masteryourcoursesdashboard-gpt/html-version` and preserve unrelated user changes.

---

### Task 1: Premium Methodology Card System

**Files:**
- Modify: `index.html:1026-1117`
- Test: `tests/light-mode-section-surfaces.test.mjs`

**Interfaces:**
- Consumes: existing `.surface-methodology` surface, responsive grid utilities, theme classes, and six methodology claims.
- Produces: `#methodology-section`, `.methodology-grid`, six `.methodology-card` elements, `.methodology-card-accent`, `.methodology-icon`, `.methodology-tier`, and `data-methodology-index="0"` through `"5"` for Task 2.

- [ ] **Step 1: Add failing visual-contract tests**

Append focused tests that extract `#methodology-section` and assert:

```js
test("uses the premium methodology card system without saturated utility bars", () => {
  const section = html.match(/<section[^>]*id="methodology-section"[\s\S]*?<\/section>/)?.[0] ?? "";
  assert.match(section, /class="[^"]*methodology-grid/);
  assert.equal((section.match(/class="[^"]*methodology-card\b/g) ?? []).length, 6);
  assert.equal((section.match(/methodology-card-accent/g) ?? []).length, 6);
  assert.equal((section.match(/methodology-icon/g) ?? []).length, 6);
  assert.equal((section.match(/methodology-tier/g) ?? []).length, 6);
  assert.doesNotMatch(section, /h-2 w-full bg-(?:blue|indigo|red|emerald|pink|purple)-500/);
  assert.match(section, />Clear Progress Tracking<\/h3>/);
  assert.doesNotMatch(section, />Clear Progress Tracking Dashboard<\/h3>/);
});

test("keeps methodology cards balanced across responsive layouts", () => {
  assert.match(html, /\.methodology-card\s*\{[\s\S]*border-radius:[\s\S]*box-shadow:/);
  assert.match(html, /\.methodology-card-accent\s*\{[\s\S]*height:\s*(?:3px|0\.25rem)/);
  assert.match(html, /@media \(max-width:\s*767px\)[\s\S]*\.methodology-card-body\s*\{[\s\S]*padding:/);
});
```

- [ ] **Step 2: Run the tests and verify RED**

Run:

```bash
node --test --test-name-pattern="premium methodology|methodology cards balanced" tests/light-mode-section-surfaces.test.mjs
```

Expected: both new tests fail because the scoped hooks and premium card rules do not exist.

- [ ] **Step 3: Implement the scoped visual system**

Add `id="methodology-section"` and `.methodology-grid`. Replace the generic card classes with section hooks while retaining the responsive grid. Each card must have this stable structure:

```html
<article class="methodology-card" data-methodology-index="0">
  <div class="methodology-card-accent" aria-hidden="true"></div>
  <div class="methodology-card-body">
    <div class="methodology-icon methodology-icon-primary">…</div>
    <p class="methodology-tier">Core Method</p>
    <h3>Elite Tutors</h3>
    <p class="methodology-description">…</p>
  </div>
</article>
```

Use `Core Method` for indexes 0–2 and `Ongoing Support` for indexes 3–5. Add scoped CSS near the surface styles with these concrete properties:

```css
.methodology-card {
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  min-height: 100%;
  border: 1px solid rgb(203 213 225 / 0.82);
  border-radius: 1.5rem;
  background: rgb(255 255 255 / 0.9);
  box-shadow: 0 1px 2px rgb(15 23 42 / 0.04), 0 14px 34px rgb(79 70 229 / 0.055);
}
.methodology-card-accent { height: 3px; background: linear-gradient(90deg, #4f46e5, #6366f1 62%, #818cf8); }
.methodology-card-body { display: flex; min-height: 100%; flex: 1; flex-direction: column; padding: 2rem; }
.methodology-icon { width: 3.5rem; height: 3.5rem; border-radius: 1rem; }
.methodology-tier { margin: 1.25rem 0 .5rem; font-size: .6875rem; font-weight: 800; letter-spacing: .14em; text-transform: uppercase; }
html.dark .methodology-card { border-color: rgb(51 65 85 / .85); background: rgb(24 24 27 / .92); box-shadow: 0 16px 40px rgb(0 0 0 / .18); }
@media (max-width: 767px) { .methodology-card-body { padding: 1.5rem; } }
```

Use quiet blue/indigo icon variants for the core row and subdued cyan/violet variants for the support row. Keep heading and description typography consistent with the current site. Change only the final heading to `Clear Progress Tracking`.

- [ ] **Step 4: Run focused and full tests**

Run:

```bash
node --test --test-name-pattern="premium methodology|methodology cards balanced" tests/light-mode-section-surfaces.test.mjs
node --test tests/light-mode-section-surfaces.test.mjs
git diff --check
```

Expected: focused tests pass, full suite passes, and diff check prints nothing.

- [ ] **Step 5: Render and inspect the static design**

At 390×844, 768×1024, and 1440×900 in light and dark themes, confirm the six cards form one restrained family, first/second-row labels are coherent, mobile spacing is compact but comfortable, final heading is balanced, and there is no horizontal overflow.

- [ ] **Step 6: Commit Task 1**

```bash
git add index.html tests/light-mode-section-surfaces.test.mjs
git commit -m "feat: refine methodology card system"
```

---

### Task 2: Reliable Methodology Motion

**Files:**
- Modify: `index.html:647-665`
- Modify: `index.html:3357-3379`
- Test: `tests/light-mode-section-surfaces.test.mjs`

**Interfaces:**
- Consumes: `.methodology-card` and numeric `data-methodology-index` hooks created by Task 1.
- Produces: `.methodology-motion-ready`, `.methodology-visible`, deterministic `--methodology-delay`, and a dedicated `methodologyObserver` that reveals/unobserves each card once.

- [ ] **Step 1: Add failing motion-contract tests**

Append tests that assert the fail-open CSS architecture, deterministic delay, fine-pointer hover boundary, and reduced-motion reset:

```js
test("reveals methodology cards with deterministic fail-open motion", () => {
  assert.match(html, /\.methodology-motion-ready \.methodology-card:not\(\.methodology-visible\)/);
  assert.match(html, /translateY\((?:20px|1\.25rem)\)/);
  assert.doesNotMatch(html, /\.methodology-motion-ready \.methodology-card:not\(\.methodology-visible\)[^{]*\{[^}]*scale\(/);
  assert.match(html, /--methodology-delay/);
  assert.match(html, /dataset\.methodologyIndex/);
  assert.match(html, /methodologyObserver\.unobserve\(entry\.target\)/);
});

test("limits methodology hover and neutralizes all reduced motion", () => {
  assert.match(html, /@media \(hover:\s*hover\) and \(pointer:\s*fine\)[\s\S]*\.methodology-card:hover/);
  assert.match(html, /translateY\(-2px\)/);
  assert.match(html, /@media \(prefers-reduced-motion:\s*reduce\)[\s\S]*\.methodology-card[\s\S]*transition:\s*none[\s\S]*transform:\s*none/);
  assert.match(html, /@media \(prefers-reduced-motion:\s*reduce\)[\s\S]*\.methodology-icon[\s\S]*transform:\s*none/);
});
```

- [ ] **Step 2: Run the tests and verify RED**

Run:

```bash
node --test --test-name-pattern="reveals methodology|limits methodology hover" tests/light-mode-section-surfaces.test.mjs
```

Expected: both tests fail because the section still uses generic callback-batch staggering and generic hover utilities.

- [ ] **Step 3: Add fail-open entrance and restrained hover CSS**

Add section-specific motion rules:

```css
@media (prefers-reduced-motion: no-preference) {
  .methodology-card { transition: border-color 220ms ease, box-shadow 220ms ease, transform 220ms ease; }
  .methodology-icon { transition: transform 220ms ease, background-color 220ms ease; }
  .methodology-motion-ready .methodology-card:not(.methodology-visible) {
    opacity: 0;
    transform: translateY(20px);
  }
  .methodology-motion-ready .methodology-card {
    transition-property: opacity, transform, border-color, box-shadow;
    transition-duration: 500ms, 500ms, 220ms, 220ms;
    transition-timing-function: cubic-bezier(.22, 1, .36, 1), cubic-bezier(.22, 1, .36, 1), ease, ease;
    transition-delay: var(--methodology-delay, 0ms), var(--methodology-delay, 0ms), 0ms, 0ms;
  }
}
@media (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference) {
  .methodology-card:hover { transform: translateY(-2px); }
  .methodology-card:hover .methodology-icon { transform: scale(1.035); }
}
@media (prefers-reduced-motion: reduce) {
  .methodology-card, .methodology-icon { opacity: 1; transform: none; transition: none; }
}
```

Ensure the visible entrance state overrides the initial translation without interfering with fine-pointer hover after the entrance completes.

- [ ] **Step 4: Add the dedicated reveal controller**

Before observing cards, verify both IntersectionObserver support and `prefers-reduced-motion: no-preference`. Only then add `.methodology-motion-ready` to `#methodology-section`. Use explicit card indexes for delay:

```js
const methodologySection = document.getElementById('methodology-section');
const methodologyCards = [...document.querySelectorAll('.methodology-card')];
const methodologyMotion = window.matchMedia('(prefers-reduced-motion: no-preference)');

if (methodologySection && methodologyCards.length && 'IntersectionObserver' in window && methodologyMotion.matches) {
  methodologySection.classList.add('methodology-motion-ready');
  methodologyCards.forEach((card) => {
    const index = Number(card.dataset.methodologyIndex || 0);
    const delay = window.matchMedia('(max-width: 767px)').matches ? Math.min(index * 20, 40) : (index % 3) * 70;
    card.style.setProperty('--methodology-delay', `${delay}ms`);
  });
  const methodologyObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('methodology-visible');
      methodologyObserver.unobserve(entry.target);
    });
  }, { threshold: 0.08, rootMargin: '0px 0px 8% 0px' });
  methodologyCards.forEach((card) => methodologyObserver.observe(card));
}
```

Remove `.scroll-reveal` from methodology cards so the generic observer cannot double-animate them. Do not change generic behavior for other sections.

- [ ] **Step 5: Run focused and full automated verification**

Run:

```bash
node --test --test-name-pattern="methodology" tests/light-mode-section-surfaces.test.mjs
node --test tests/light-mode-section-surfaces.test.mjs
git diff --check
curl -sS -o /dev/null -w '%{http_code}\n' http://127.0.0.1:4173/index.html
```

Expected: all methodology tests pass, complete suite passes, diff check prints nothing, and curl prints `200`.

- [ ] **Step 6: Perform rendered motion QA**

Use the in-app Browser first; if its executable runtime is unavailable, record the reason and use local Chrome/Playwright. Verify:

- 390×844 light/dark: wheel slowly and quickly through the entire section; every card appears once near the viewport with no blank animation gaps.
- 768×1024 light/dark: two-column card order and delays remain deterministic.
- 1440×900 light/dark: rows reveal left-to-right; hover lift measures approximately 2px and icon scale approximately 1.035.
- 390×844 reduced motion: every card is immediately visible, with no transition or transform.
- Coarse pointer emulation: hover transformations do not activate.
- All viewports: `scrollWidth === clientWidth`, no clipped content, no page errors, and no animation replay after scrolling away and back.

Save screenshots and measurements under `.superpowers/sdd/2026-08-13-methodology-premium-refinement/` and visually inspect them before completion.

- [ ] **Step 7: Commit Task 2**

```bash
git add index.html tests/light-mode-section-surfaces.test.mjs
git commit -m "feat: refine methodology motion"
```

- [ ] **Step 8: Final verification and report**

Rerun the full Node suite, `git diff --check HEAD~2..HEAD`, the HTTP 200 check, and the responsive browser assertions. Write `.superpowers/sdd/2026-08-13-methodology-premium-refinement/final-report.md` with RED/GREEN evidence, screenshots, measured motion values, accessibility results, commit hashes, and any environment limitations.

