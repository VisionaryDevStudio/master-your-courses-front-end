# Hero Motion Refinement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Preserve the hero testimonial card's scroll-growth effect while removing competing motion, calming badge drift, improving performance, and fully supporting reduced motion.

**Architecture:** Give hero entrance and badge movement dedicated CSS classes, then replace the unthrottled parallax listener with one reduced-motion-aware `requestAnimationFrame` controller. Keep the DOM structure intact and protect the behavior with source-contract tests plus rendered measurements.

**Tech Stack:** Standalone HTML, inline CSS, Tailwind CDN, vanilla JavaScript, Node.js built-in test runner, Chrome/Playwright rendered QA.

## Global Constraints

- Desktop testimonial scale is `1` to `1.06` across the first 320px of scroll.
- Mobile testimonial scale is `1` to `1.03` across the first 320px of scroll.
- The testimonial card does not float or translate vertically.
- Hero copy fades no lower than `0.35` and does not translate during scroll.
- Hero copy entrance is 20px over 500ms.
- Desktop badge drift is limited to 5px with 12s and 14s cycles; mobile badge drift is disabled.
- Primary desktop hero-button hover scale is `1.02`.
- Reduced motion disables entrance translation, card scaling, badge drift, copy fading, and pointer spotlight tracking.
- Preserve hero content, spacing, typography, colors, card composition, fixed header, and later-section animations.
- Add no dependencies.

---

### Task 1: Establish the calm hero CSS and markup contract

**Files:**
- Modify: `tests/light-mode-section-surfaces.test.mjs`
- Modify: `index.html:320-355,420-610`

**Interfaces:**
- Consumes: existing hero copy, testimonial cards, badges, and primary button.
- Produces: `.hero-copy-enter`, `.hero-badge-drift-a`, and `.hero-badge-drift-b`; stationary testimonial markup and restrained button feedback.

- [ ] **Step 1: Write the failing hero-markup test**

Add:

```js
test("uses the approved calm hero motion classes", () => {
  const heroStart = html.indexOf("Cinematic Hero Section");
  const resultsStart = html.indexOf("By The Numbers", heroStart);
  const hero = html.slice(heroStart, resultsStart);

  assert.equal((hero.match(/hero-copy-enter/g) ?? []).length, 2);
  assert.equal((hero.match(/hero-badge-drift-a/g) ?? []).length, 1);
  assert.equal((hero.match(/hero-badge-drift-b/g) ?? []).length, 1);
  assert.doesNotMatch(hero, /animate-float-(?:slow|fast)/);
  assert.doesNotMatch(hero, /hover:scale-105/);
  assert.match(hero, /hover:scale-\[1\.02\]/);

  const styles = html.slice(html.indexOf("<!-- Custom CSS classes -->"), html.indexOf("</head>"));
  assert.match(styles, /@keyframes hero-badge-drift/);
  assert.match(styles, /transform:\s*translateY\(-5px\)/);
  assert.match(styles, /animation:\s*hero-badge-drift 12s/);
  assert.match(styles, /animation:\s*hero-badge-drift 14s/);
  assert.match(styles, /@media\s*\(prefers-reduced-motion:\s*reduce\)[\s\S]*?\.hero-copy-enter/);
});
```

- [ ] **Step 2: Run the suite and confirm red**

Run: `node --test tests/light-mode-section-surfaces.test.mjs`

Expected: FAIL because the dedicated hero classes do not exist and the hero still contains floating-card classes and `hover:scale-105`.

- [ ] **Step 3: Add dedicated hero motion CSS**

Insert beside the existing custom animation CSS:

```css
.hero-copy-enter {
  animation: hero-copy-enter 500ms cubic-bezier(0.22, 1, 0.36, 1) both;
}

@keyframes hero-copy-enter {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes hero-badge-drift {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
}

@media (min-width: 1024px) and (prefers-reduced-motion: no-preference) {
  .hero-badge-drift-a { animation: hero-badge-drift 12s ease-in-out infinite; }
  .hero-badge-drift-b { animation: hero-badge-drift 14s ease-in-out infinite reverse; }
}

@media (prefers-reduced-motion: reduce) {
  .hero-copy-enter { animation: none; opacity: 1; transform: none; }
  .hero-badge-drift-a,
  .hero-badge-drift-b { animation: none; transform: none; }
}
```

- [ ] **Step 4: Update only the hero motion classes**

Apply these exact changes:

```text
#hero-copy and #hero-copy-mobile: animate-fade-in-up -> hero-copy-enter
Desktop testimonial card: remove animate-float-slow
Mobile testimonial card: remove animate-float-slow
Desktop AP badge: animate-float-fast -> hero-badge-drift-a
Desktop SAT badge: animate-float-slow -> hero-badge-drift-b
Mobile AP and SAT badges: remove animate-float-fast/slow without replacement
Desktop primary hero button: hover:scale-105 -> hover:scale-[1.02]
```

Do not change rotations, positions, card content, or mobile button feedback.

- [ ] **Step 5: Run tests and commit**

Run:

```bash
node --test tests/light-mode-section-surfaces.test.mjs
git diff --check
```

Expected: all tests PASS and diff check exits 0.

```bash
git add index.html tests/light-mode-section-surfaces.test.mjs
git commit -m "style: calm hero ambient motion"
```

### Task 2: Replace hero parallax with a scheduled scroll controller

**Files:**
- Modify: `tests/light-mode-section-surfaces.test.mjs`
- Modify: `index.html:2725-2795`

**Interfaces:**
- Consumes: `#hero-section`, `#hero-copy`, `#hero-copy-mobile`, `#hero-card-container`, `#hero-card-container-mobile`, and `#hero-spotlight`.
- Produces: `updateHeroMotion()` and `scheduleHeroMotion()` with one animation-frame scheduler and reduced-motion-aware behavior.

- [ ] **Step 1: Write the failing controller test**

Add:

```js
test("schedules bounded and reduced-motion-aware hero scroll growth", () => {
  const scriptStart = html.indexOf("// Spotlight Effect (Hero Section)");
  const scriptEnd = html.indexOf("// CountUp Animation", scriptStart);
  const heroMotion = html.slice(scriptStart, scriptEnd);

  assert.match(heroMotion, /const HERO_MOTION_RANGE = 320/);
  assert.match(heroMotion, /const desktopMaxScale = 1\.06/);
  assert.match(heroMotion, /const mobileMaxScale = 1\.03/);
  assert.match(heroMotion, /const copyOpacity = 1 - progress \* 0\.65/);
  assert.match(heroMotion, /requestAnimationFrame\(updateHeroMotion\)/);
  assert.match(heroMotion, /prefers-reduced-motion:\s*reduce/);
  assert.match(heroMotion, /scale\(\$\{scale\}\)/);
  assert.doesNotMatch(heroMotion, /translateY\(/);
  assert.doesNotMatch(heroMotion, /addEventListener\('scroll',\s*\(\)\s*=>/);
});
```

- [ ] **Step 2: Run the suite and confirm red**

Run: `node --test tests/light-mode-section-surfaces.test.mjs`

Expected: FAIL because the current unthrottled listener uses scale `1.1`, vertical translation, and no reduced-motion gate.

- [ ] **Step 3: Replace the hero spotlight and scroll block**

Use this controller, preserving the later CountUp block:

```js
// Spotlight Effect and bounded scroll growth (Hero Section)
const heroSection = document.getElementById('hero-section');
const heroSpotlight = document.getElementById('hero-spotlight');
const heroCopy = document.getElementById('hero-copy');
const heroCopyMobile = document.getElementById('hero-copy-mobile');
const heroCard = document.getElementById('hero-card-container');
const heroCardMobile = document.getElementById('hero-card-container-mobile');
const heroReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const HERO_MOTION_RANGE = 320;
let heroMotionFrame = null;
let spotlightFrame = null;

function updateHeroMotion() {
  heroMotionFrame = null;
  if (heroReducedMotion.matches) {
    [heroCopy, heroCopyMobile].forEach(element => {
      if (element) element.style.opacity = '1';
    });
    [heroCard, heroCardMobile].forEach(element => {
      if (element) element.style.transform = 'scale(1)';
    });
    return;
  }

  const progress = Math.min(Math.max(window.scrollY / HERO_MOTION_RANGE, 0), 1);
  const copyOpacity = 1 - progress * 0.65;
  const desktopMaxScale = 1.06;
  const mobileMaxScale = 1.03;
  const desktopScale = 1 + progress * (desktopMaxScale - 1);
  const mobileScale = 1 + progress * (mobileMaxScale - 1);

  if (heroCopy) heroCopy.style.opacity = String(copyOpacity);
  if (heroCopyMobile) heroCopyMobile.style.opacity = String(copyOpacity);
  if (heroCard) {
    const scale = desktopScale;
    heroCard.style.transform = `scale(${scale})`;
  }
  if (heroCardMobile) {
    const scale = mobileScale;
    heroCardMobile.style.transform = `scale(${scale})`;
  }
}

function scheduleHeroMotion() {
  if (heroMotionFrame !== null) return;
  heroMotionFrame = requestAnimationFrame(updateHeroMotion);
}

if (heroSection && heroSpotlight) {
  heroSection.addEventListener('mousemove', event => {
    if (heroReducedMotion.matches || window.innerWidth < 1024 || spotlightFrame !== null) return;
    spotlightFrame = requestAnimationFrame(() => {
      spotlightFrame = null;
      const rect = heroSection.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      heroSpotlight.style.background = `radial-gradient(800px circle at ${x}px ${y}px, rgba(99, 102, 241, 0.08), transparent 80%)`;
    });
  });
}

window.addEventListener('scroll', scheduleHeroMotion, { passive: true });
heroReducedMotion.addEventListener('change', scheduleHeroMotion);
scheduleHeroMotion();
```

- [ ] **Step 4: Run tests and commit**

Run:

```bash
node --test tests/light-mode-section-surfaces.test.mjs
git diff --check
```

Expected: all tests PASS and diff check exits 0.

```bash
git add index.html tests/light-mode-section-surfaces.test.mjs
git commit -m "perf: refine hero scroll growth"
```

### Task 3: Verify responsive and reduced-motion behavior

**Files:**
- Modify only if QA proves a defect: `index.html`, `tests/light-mode-section-surfaces.test.mjs`
- Test artifacts: `/tmp/hero-motion-*`, never committed

**Interfaces:**
- Consumes: completed hero CSS and JavaScript motion controller.
- Produces: computed transform, opacity, animation, overflow, and screenshot evidence.

- [ ] **Step 1: Verify the live preview**

Run: `curl -s -o /dev/null -w '%{http_code}\n' http://127.0.0.1:4173/index.html`

Expected: `200`.

- [ ] **Step 2: Measure desktop motion**

At `1440x900` with normal motion, record computed transforms and copy opacity at scroll positions `0`, `160`, and `320`. Confirm the desktop card scales monotonically to `1.06`, has no vertical translation, copy opacity ends at `0.35`, the main card has `animation-name: none`, and the two badges use 12s and 14s animations with no more than 5px travel.

- [ ] **Step 3: Measure mobile motion**

At `390x844`, repeat positions `0`, `160`, and `320`. Confirm the card ends at `1.03`, badges have `animation-name: none`, no horizontal overflow appears, and no hero content clips.

- [ ] **Step 4: Verify reduced motion**

Repeat desktop and mobile with `prefers-reduced-motion: reduce`. Confirm card transform remains `scale(1)`, copy opacity remains `1`, badge and entrance animations report `none`, and pointer movement does not change the spotlight background.

- [ ] **Step 5: Capture and inspect screenshots**

Save normal-motion screenshots at scroll `0` and `320` for mobile and desktop under `/tmp/hero-motion-*`. Inspect the files and confirm the card visually comes forward without downward drift, clipping, or excessive zoom.

- [ ] **Step 6: Run the final gate**

Run:

```bash
node --test tests/light-mode-section-surfaces.test.mjs
git diff --check
git status --short
curl -s -o /dev/null -w 'preview_http=%{http_code}\n' http://127.0.0.1:4173/index.html
```

Expected: all tests PASS, no diff errors, only known unrelated untracked files remain, and preview HTTP is 200.
