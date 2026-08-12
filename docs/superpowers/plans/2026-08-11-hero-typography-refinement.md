# Hero Typography Refinement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refine only the desktop and mobile hero headlines so the opening statement reads more clearly and the gradient outcome carries stronger hierarchy.

**Architecture:** Preserve the existing duplicated responsive hero markup and change only utility classes on its two `h1` elements and their outcome spans. Protect the exact type contract with static regression tests, then validate computed typography, wrapping, overflow, and unchanged motion in a rendered browser.

**Tech Stack:** Static HTML, Tailwind CSS CDN utility classes, Node.js built-in test runner, Browser plugin or the previously approved local Playwright/Chrome fallback.

## Global Constraints

- Keep Outfit as the hero display family.
- The opening statement uses weight `800`; the gradient outcome uses weight `900`.
- Desktop uses `68px` at `lg`, `72px` at `xl`, line-height `1.02`, and letter-spacing `-0.04em`.
- Mobile/tablet uses `36px` by default, `48px` at `sm`, line-height `1.08`, and letter-spacing `-0.035em`.
- Preserve the four-line composition on desktop and mobile.
- Do not change typography outside the hero, copy, colors, spacing outside the headline, animation hooks, buttons, testimonial content, or section layout.
- Add no dependencies, JavaScript, animation, font files, or external assets.
- Preserve reduced-motion behavior and prevent horizontal overflow or clipping.

---

### Task 1: Apply and verify the hero optical type treatment

**Files:**
- Modify: `index.html:473-478`
- Modify: `index.html:560-565`
- Test: `tests/light-mode-section-surfaces.test.mjs`

**Interfaces:**
- Consumes: Existing responsive hero IDs `hero-copy` and `hero-copy-mobile`, Outfit `font-display`, Tailwind breakpoint visibility, and `hero-copy-enter` animation hook.
- Produces: Two responsive hero headline class contracts and unchanged semantic text/line composition.

- [ ] **Step 1: Write the failing static regression test**

Append this focused test to `tests/light-mode-section-surfaces.test.mjs`:

```js
test("uses the approved optical typography only on the hero headlines", () => {
  const desktopHero = html.match(/<div id="hero-copy"[\s\S]*?<\/h1>/)?.[0] ?? "";
  const mobileHero = html.match(/<div id="hero-copy-mobile"[\s\S]*?<\/h1>/)?.[0] ?? "";

  assert.match(desktopHero, /<h1 class="[^"]*lg:text-\[68px\][^"]*xl:text-7xl[^"]*font-extrabold[^"]*leading-\[1\.02\][^"]*tracking-\[-0\.04em\][^"]*">/);
  assert.match(desktopHero, /<span class="[^"]*font-black[^"]*">\s*Secure your/);
  assert.match(mobileHero, /<h1 class="[^"]*text-4xl[^"]*sm:text-5xl[^"]*font-extrabold[^"]*leading-\[1\.08\][^"]*tracking-\[-0\.035em\][^"]*">/);
  assert.match(mobileHero, /<span class="[^"]*font-black[^"]*">\s*Secure your/);
  assert.equal((html.match(/lg:text-\[68px\]/g) ?? []).length, 1);
  assert.equal((html.match(/tracking-\[-0\.035em\]/g) ?? []).length, 1);
});
```

- [ ] **Step 2: Run the test and verify RED**

Run:

```bash
node --test tests/light-mode-section-surfaces.test.mjs
```

Expected: the new optical-typography test fails because the hero still uses `font-black`, `leading-[1.05]`/`leading-[1.1]`, and `tracking-tighter`.

- [ ] **Step 3: Apply the minimal desktop and mobile class changes**

Change the desktop headline and outcome classes to:

```html
<h1 class="text-5xl lg:text-[68px] xl:text-7xl font-extrabold leading-[1.02] mb-6 font-display tracking-[-0.04em]">
  Master your <br/> toughest&nbsp;courses. <br/>
  <span class="font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500">
```

Change the mobile headline and outcome classes to:

```html
<h1 class="text-4xl sm:text-5xl font-extrabold leading-[1.08] mb-5 font-display tracking-[-0.035em]">
  Master your <br/> toughest&nbsp;courses. <br class="block" />
  <span class="font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 inline-block mt-2">
```

Do not alter the text, `br` elements, gradient classes, margins, responsive wrapper classes, or animation IDs/classes.

- [ ] **Step 4: Run the full static suite and verify GREEN**

Run:

```bash
node --test tests/light-mode-section-surfaces.test.mjs
```

Expected: all tests pass with zero failures.

- [ ] **Step 5: Run rendered responsive QA**

The flow under test is: load `http://127.0.0.1:4173/index.html` -> inspect the hero at each target viewport in light and dark themes -> verify the intended type hierarchy and unchanged hero motion.

Use the Browser plugin first. If its required runtime remains unavailable, use the previously approved local Playwright/Chrome fallback and record that reason. At `390x844`, `768x1024`, `1024x768`, and `1440x900`, verify:

```text
- Page title is "Master Your Courses - Hero Section" and meaningful hero content renders.
- Computed font family includes Outfit.
- Opening statement computed weight is 800; outcome computed weight is 900.
- Mobile/tablet computed size, line-height, and tracking match 36/48px, 1.08, and -0.035em as applicable.
- Desktop computed size is 68px at 1024 and 72px at 1440; line-height is 1.02 and tracking is -0.04em.
- Headline text occupies four visual lines.
- No headline glyphs clip and document scrollWidth equals clientWidth.
- Header, paragraph, and testimonial do not overlap the headline.
- At scroll 320, testimonial scale still reaches the currently implemented motion target and hero copy opacity still reaches 0.35.
- With reduced motion, the testimonial remains scale(1), hero copy remains opacity 1, and the headline typography is unchanged.
- No relevant console errors or framework overlay appears.
```

Capture one desktop and one mobile screenshot outside the repository and inspect both before reporting.

- [ ] **Step 6: Run final verification gates**

Run:

```bash
git diff --check
curl -sS -o /dev/null -w '%{http_code}\n' http://127.0.0.1:4173/index.html
git diff -- index.html tests/light-mode-section-surfaces.test.mjs
```

Expected: clean diff check, HTTP `200`, and a diff restricted to the two hero headlines plus the focused test.

- [ ] **Step 7: Commit the implementation**

```bash
git add index.html tests/light-mode-section-surfaces.test.mjs
git commit -m "style: refine hero typography hierarchy"
```
