# University Ribbon Motion Refinement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Preserve the university ribbon's calm continuous marquee while improving entrance polish, mobile density, logo balance, reduced-motion behavior, and accessibility.

**Architecture:** Convert the flat 30-logo track into three explicit ten-logo groups so CSS can move exactly one-third of the track and hide duplicate groups under reduced motion. Add section-specific CSS hooks for the marquee, viewport, groups, logos, and entrance; reuse the existing one-shot IntersectionObserver by adding the new entrance hook to its observed selector.

**Tech Stack:** Static HTML, CSS animations and media queries, IntersectionObserver, Node.js built-in test runner, local browser preview.

## Global Constraints

- Change only the university ribbon section, its logo markup, its motion styles, and the observer selector needed for its one-time entrance.
- Keep the existing university set, logo assets, section copy, surfaces, surrounding rhythm, and adjacent sections.
- Keep normal marquee motion `40s linear infinite`; pause and resume without resetting on viewport hover or focus.
- Use a one-time `450ms` fade-and-rise entrance and unobserve after first intersection.
- Use `52px` logo gaps below `768px` and `96px` at `768px` and wider.
- Keep logo heights `32px` mobile and `40px` tablet/desktop; cap inline sizes at `152px` mobile and `176px` tablet/desktop.
- Use `70%` light and `55%` dark resting opacity; grayscale at rest; desktop hover color reveal lasts `500ms`.
- Reduced motion shows one static horizontally scrollable ten-logo group with no marquee or entrance translation.
- The viewport must be a labeled, focusable region; duplicate groups must be excluded from assistive technology.
- Add no cards, pills, logo backgrounds, borders, or individual logo animations.

---

### Task 1: Build the Accessible Responsive Marquee Structure

**Files:**
- Modify: `index.html:553-560`
- Modify: `index.html:896-950`
- Test: `tests/light-mode-section-surfaces.test.mjs`

**Interfaces:**
- Consumes: `.surface-universities`, existing university SVG assets, and the existing `@keyframes marquee` name.
- Produces: `.university-ribbon-viewport`, `.university-marquee`, three `.university-logo-group` elements, and `.university-logo` images.

- [ ] **Step 1: Add failing structure, styling, and accessibility contracts**

Add tests that extract the university section and assert exact contracts:

```js
test("uses an accessible three-group university marquee with silent duplicates", () => {
  const start = html.indexOf('class="surface-universities');
  const end = html.indexOf('<!-- ----------------- Methodology', start);
  const section = html.slice(start, end);
  const groups = [...section.matchAll(/<div class="university-logo-group"([^>]*)>([\s\S]*?)<\/div>/g)];

  assert.match(section, /class="university-ribbon-viewport[^"]*"[^>]*tabindex="0"[^>]*role="region"[^>]*aria-label="Universities our students have gained admission to"/);
  assert.match(section, /class="university-marquee university-ribbon-reveal"/);
  assert.equal(groups.length, 3);
  assert.equal((groups[0][2].match(/class="university-logo"/g) ?? []).length, 10);
  assert.doesNotMatch(groups[0][1], /aria-hidden="true"/);
  for (const duplicate of groups.slice(1)) {
    assert.match(duplicate[1], /aria-hidden="true"/);
    assert.equal((duplicate[2].match(/alt="" aria-hidden="true"/g) ?? []).length, 10);
  }
});

test("defines the approved university marquee density and reduced-motion layout", () => {
  assert.match(html, /@keyframes university-marquee\s*\{[\s\S]*to\s*\{\s*transform:\s*translateX\(calc\(-100% \/ 3\)\)/);
  assert.match(html, /\.university-marquee\s*\{[\s\S]*animation:\s*university-marquee 40s linear infinite;[\s\S]*opacity:\s*0\.7/);
  assert.match(html, /\.dark \.university-marquee\s*\{\s*opacity:\s*0\.55/);
  assert.match(html, /\.university-logo-group\s*\{[\s\S]*gap:\s*3\.25rem/);
  assert.match(html, /\.university-logo\s*\{[\s\S]*height:\s*2rem;[\s\S]*max-width:\s*9\.5rem/);
  assert.match(html, /@media \(min-width:\s*768px\)[\s\S]*\.university-logo-group\s*\{[\s\S]*gap:\s*6rem[\s\S]*\.university-logo\s*\{[\s\S]*height:\s*2\.5rem;[\s\S]*max-width:\s*11rem/);
  assert.match(html, /@media \(hover:\s*hover\) and \(pointer:\s*fine\)[\s\S]*\.university-ribbon-viewport:hover \.university-marquee[\s\S]*animation-play-state:\s*paused[\s\S]*filter:\s*grayscale\(0\)/);
  assert.match(html, /\.university-ribbon-viewport:focus \.university-marquee\s*\{[\s\S]*animation-play-state:\s*paused/);
  assert.match(html, /@media \(prefers-reduced-motion:\s*reduce\)[\s\S]*\.university-marquee\s*\{[\s\S]*animation:\s*none;[\s\S]*transform:\s*none[\s\S]*\.university-logo-group\[aria-hidden="true"\]\s*\{\s*display:\s*none/);
});
```

- [ ] **Step 2: Run the focused tests and observe RED**

```bash
node --test --test-name-pattern="university marquee" tests/light-mode-section-surfaces.test.mjs
```

Expected: FAIL because the dedicated structure and CSS hooks do not exist.

- [ ] **Step 3: Replace the flat track with explicit groups**

Update only the university section:

```html
<div
  class="university-ribbon-viewport relative w-full max-w-[1400px] mx-auto"
  tabindex="0"
  role="region"
  aria-label="Universities our students have gained admission to"
  style="mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent); -webkit-mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);"
>
  <div class="university-marquee university-ribbon-reveal">
    <div class="university-logo-group">
      <!-- The ten existing images retain their current src, meaningful alt, loading, and decoding attributes; replace utility sizing classes with class="university-logo dark:invert". -->
    </div>
    <div class="university-logo-group" aria-hidden="true">
      <!-- Repeat the same ten assets with alt="" aria-hidden="true" and class="university-logo dark:invert". -->
    </div>
    <div class="university-logo-group" aria-hidden="true">
      <!-- Repeat the same ten silent duplicate images. -->
    </div>
  </div>
</div>
```

Preserve asset order: Harvard, MIT, Duke, Florida, Alabama, Northwestern, Notre Dame, NYU, Ohio State, UPenn.

- [ ] **Step 4: Add the exact ribbon CSS**

Replace the generic marquee rule used only here with:

```css
@keyframes university-marquee {
  from { transform: translateX(0); }
  to { transform: translateX(calc(-100% / 3)); }
}

.university-ribbon-viewport {
  overflow: hidden;
  border-radius: 0.25rem;
}

.university-ribbon-viewport:focus-visible {
  outline: 2px solid rgb(99 102 241 / 0.65);
  outline-offset: 4px;
}

.university-marquee {
  display: flex;
  width: max-content;
  animation: university-marquee 40s linear infinite;
  opacity: 0.7;
  filter: grayscale(1);
  transition: filter 500ms ease, opacity 500ms ease;
  will-change: transform;
}

.dark .university-marquee { opacity: 0.55; }

.university-logo-group {
  display: flex;
  align-items: center;
  gap: 3.25rem;
  padding-right: 3.25rem;
}

.university-logo {
  width: auto;
  height: 2rem;
  max-width: 9.5rem;
  object-fit: contain;
  flex: 0 0 auto;
}

.university-ribbon-viewport:focus .university-marquee {
  animation-play-state: paused;
}

@media (min-width: 768px) {
  .university-logo-group { gap: 6rem; padding-right: 6rem; }
  .university-logo { height: 2.5rem; max-width: 11rem; }
}

@media (hover: hover) and (pointer: fine) {
  .university-ribbon-viewport:hover .university-marquee {
    animation-play-state: paused;
    filter: grayscale(0);
  }
}

@media (prefers-reduced-motion: reduce) {
  .university-ribbon-viewport { overflow-x: auto; scrollbar-width: none; }
  .university-ribbon-viewport::-webkit-scrollbar { display: none; }
  .university-marquee { animation: none; transform: none; will-change: auto; }
  .university-logo-group[aria-hidden="true"] { display: none; }
}
```

- [ ] **Step 5: Run focused and full static verification**

```bash
node --test --test-name-pattern="university marquee" tests/light-mode-section-surfaces.test.mjs
node --test tests/light-mode-section-surfaces.test.mjs
git diff --check
```

Expected: Focused and full suites PASS; diff check clean.

- [ ] **Step 6: Verify structure and responsive rendering in Chrome**

Use the in-app Browser skill first; if unavailable, record the reason and use the user-approved local Chrome fallback. At `390x844`, `768x1024`, and `1440x900` in light/dark modes confirm exact gap, size caps, opacity, edge masks, no page overflow, all assets loaded, and a seamless loop sample. Under reduced motion at `390px`, confirm animation name is `none`, transform is `none`, only ten logos participate in layout/accessibility, and the viewport scroll width exceeds client width without increasing page width. Save mobile, desktop, and reduced-motion screenshots inside the plan SDD workspace.

- [ ] **Step 7: Commit Task 1**

```bash
git add index.html tests/light-mode-section-surfaces.test.mjs
git commit -m "feat: refine university logo marquee"
```

---

### Task 2: Add the One-Time University Ribbon Entrance

**Files:**
- Modify: `index.html:580-600`
- Modify: `index.html:3280-3300`
- Test: `tests/light-mode-section-surfaces.test.mjs`

**Interfaces:**
- Consumes: `.university-ribbon-reveal`, `.is-visible`, and the existing one-shot scroll-reveal observer.
- Produces: A dedicated `450ms` entrance and observer coverage without changing other `.scroll-reveal` timing.

- [ ] **Step 1: Add failing entrance CSS and observer contracts**

```js
test("reveals the university ribbon once with reduced-motion protection", () => {
  assert.match(html, /@media \(prefers-reduced-motion:\s*no-preference\)[\s\S]*\.university-ribbon-reveal\s*\{[\s\S]*opacity:\s*0;[\s\S]*transform:\s*translateY\(0\.75rem\);[\s\S]*transition:[^;]*450ms/);
  assert.match(html, /\.university-ribbon-reveal\.is-visible\s*\{[\s\S]*opacity:\s*1;[\s\S]*transform:\s*translateY\(0\)/);
  assert.match(html, /@media \(prefers-reduced-motion:\s*reduce\)[\s\S]*\.university-ribbon-reveal\s*\{[\s\S]*opacity:\s*1;[\s\S]*transform:\s*none;[\s\S]*transition:\s*none/);
  assert.match(html, /document\.querySelectorAll\('\.scroll-reveal, \.university-ribbon-reveal'\)/);
  assert.match(html, /entry\.target\.classList\.add\('is-visible'\);[\s\S]*observer\.unobserve\(entry\.target\)/);
});
```

- [ ] **Step 2: Run the focused test and observe RED**

```bash
node --test --test-name-pattern="reveals the university ribbon once" tests/light-mode-section-surfaces.test.mjs
```

Expected: FAIL because the entrance CSS and observer selector are absent.

- [ ] **Step 3: Add the dedicated entrance rules**

After the existing scroll-reveal CSS, add:

```css
@media (prefers-reduced-motion: no-preference) {
  .university-ribbon-reveal {
    opacity: 0;
    transform: translateY(0.75rem);
    transition: opacity 450ms cubic-bezier(0.22, 1, 0.36, 1), transform 450ms cubic-bezier(0.22, 1, 0.36, 1);
  }
  .university-ribbon-reveal.is-visible { opacity: 1; transform: translateY(0); }
}

@media (prefers-reduced-motion: reduce) {
  .university-ribbon-reveal { opacity: 1; transform: none; transition: none; }
}
```

- [ ] **Step 4: Extend the existing one-shot observer selector**

Change only:

```js
document.querySelectorAll('.scroll-reveal, .university-ribbon-reveal').forEach((el) => {
  observer.observe(el);
});
```

Retain the existing threshold, root margin, stagger logic, and `is-visible` class. Move `observer.unobserve(entry.target)` into the existing reveal timeout immediately after the class is added so observation ends only after the scheduled entrance begins.

- [ ] **Step 5: Run focused and full static verification**

```bash
node --test --test-name-pattern="reveals the university ribbon once" tests/light-mode-section-surfaces.test.mjs
node --test tests/light-mode-section-surfaces.test.mjs
git diff --check
```

Expected: Focused and full suites PASS; diff check clean.

- [ ] **Step 6: Verify motion states and interactions**

At `1440x900`, capture the ribbon before intersection, during entrance, after settling, while hovered, while focused, and after hover/focus ends. Confirm the entrance lasts `450ms`, the marquee pauses without transform reset, resumes from the paused position, and does not replay after scrolling away and back. At `390x844` reduced motion, confirm no entrance translation or marquee movement. Confirm duplicate accessibility behavior, page overflow, asset loading, console errors, and page errors again on the integrated tree.

- [ ] **Step 7: Commit and run the final post-commit gate**

```bash
git add index.html tests/light-mode-section-surfaces.test.mjs
git commit -m "feat: reveal university ribbon once"
node --test tests/light-mode-section-surfaces.test.mjs
git diff --check HEAD~2..HEAD
git show --check --stat --oneline HEAD
```

Expected: Full suite PASS and the two-task committed range is clean.
