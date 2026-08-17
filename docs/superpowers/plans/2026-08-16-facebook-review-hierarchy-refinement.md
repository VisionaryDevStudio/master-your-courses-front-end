# Facebook Review Hierarchy Refinement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Simplify the Facebook review section to one clear heading hierarchy and give its cards a more readable DAT-inspired composition without changing the approved carousel behavior.

**Architecture:** Keep the existing section, guarded `FACEBOOK_REVIEWS` data array, native scroll-snap carousel, controller, and motion system. Make a scoped HTML/CSS/rendering refinement inside `index.html`, and add one delegated disclosure handler for compact excerpts. Extend the existing structural and VM-based tests in `tests/light-mode-section-surfaces.test.mjs` before changing production code.

**Tech Stack:** Standalone HTML, scoped CSS, vanilla JavaScript, Tailwind CDN utilities already present, Node.js built-in test runner, local browser rendering.

## Global Constraints

- Keep only the visible heading `Trusted by students and families` and supporting copy `Public feedback from families and students who learned with MasterYourCourses.`
- Keep `Facebook review excerpts` only in semantic/accessibility labels.
- Keep exactly four approved reviews and the existing local placeholder avatar.
- Keep three cards on desktop, two on tablet, and one card plus a next-card edge on mobile.
- Preserve native swipe, wheel/trackpad release, arrow controls, keyboard controls, position synchronization, no autoplay, and reduced-motion behavior.
- Show no more than two tags per review.
- Use `Read more` / `Show less` only for excerpts above the compact threshold; expansion must remain in place and expose the full approved excerpt.
- Do not add an aggregate score, review count, public-review link, remote asset, dependency, or fabricated content.
- Preserve unrelated working-tree files.

---

### Task 1: Simplify the introduction and refine review cards

**Files:**
- Modify: `tests/light-mode-section-surfaces.test.mjs:7-54`
- Modify: `index.html:1520-1566`
- Modify: `index.html:3328-3337`
- Modify: `index.html:3355-3371`

**Interfaces:**
- Consumes: existing `FACEBOOK_REVIEWS`, `escapeReviewText(value)`, `#facebook-reviews-track`, and existing carousel controls.
- Produces: `shouldCollapseFacebookReview(excerpt): boolean`, `.facebook-review-copy`, `.facebook-review-toggle`, and buttons with `data-facebook-review-toggle` plus accurate `aria-expanded` state.

- [ ] **Step 1: Write the failing hierarchy and disclosure tests**

Replace the old eyebrow assertion and add focused contracts:

```js
test("uses one visible Facebook review heading hierarchy", () => {
  const start = html.indexOf("<!-- Facebook Review Proof -->");
  const end = html.indexOf("<!-- Facebook Review Proof End -->", start);
  const section = html.slice(start, end);
  assert.equal((section.match(/Trusted by students and families/g) ?? []).length, 1);
  assert.match(section, /Public feedback from families and students who learned with MasterYourCourses\./);
  assert.doesNotMatch(section, />\s*Facebook review excerpts\s*</i);
  assert.doesNotMatch(section, /Verified Family Feedback/i);
  assert.match(section, /role="region"[^>]*aria-label="Facebook review excerpts"/);
});

test("renders compact accessible Facebook review disclosures", () => {
  assert.match(html, /function shouldCollapseFacebookReview\(excerpt\)/);
  assert.match(html, /class="facebook-review-copy"/);
  assert.match(html, /data-facebook-review-toggle/);
  assert.match(html, /aria-expanded="false"/);
  assert.match(html, /Read more/);
  assert.match(html, /Show less/);
  assert.match(html, /\.facebook-review-copy:not\(\.is-expanded\)/);
  assert.match(html, /-webkit-line-clamp:\s*4/);
});

test("limits visible review tags to two per card", () => {
  const dataSource = html.match(/const FACEBOOK_REVIEWS = Object\.freeze\(\[[\s\S]*?\]\);/)?.[0] ?? "";
  const context = {};
  runInNewContext(`${dataSource}; this.reviews = FACEBOOK_REVIEWS;`, context);
  assert.ok(context.reviews.every(review => review.tags.length <= 2));
});
```

- [ ] **Step 2: Run the focused test and verify RED**

Run:

```bash
node --test --test-name-pattern="one visible Facebook|compact accessible Facebook|limits visible review tags" tests/light-mode-section-surfaces.test.mjs
```

Expected: FAIL because the two visible labels remain, there is no disclosure contract, and Shivam still has three tags.

- [ ] **Step 3: Apply the minimal hierarchy and card implementation**

In the section introduction, retain only:

```html
<div class="facebook-reviews-intro facebook-review-stage">
  <h2 id="facebook-reviews-heading">Trusted by students and families</h2>
  <p>Public feedback from families and students who learned with MasterYourCourses.</p>
</div>
```

Remove `.facebook-source-badge`, `.facebook-source-badge-mark`, and `.facebook-review-eyebrow` rules. Set the title to have no artificial top offset and tighten the shell transition:

```css
.facebook-reviews-intro h2 {
  margin-top: 0;
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 900;
  letter-spacing: -.045em;
}
.facebook-reviews-shell { margin-top: 2rem; }
.facebook-review-source {
  color: rgb(24 119 242);
  font-size: .7rem;
  font-weight: 800;
  letter-spacing: .04em;
}
.facebook-review-copy { margin-top: 1rem; }
.facebook-review-copy blockquote { margin: 0; }
.facebook-review-copy:not(.is-expanded) blockquote {
  display: -webkit-box;
  overflow: hidden;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 4;
}
.facebook-review-toggle {
  min-height: 2.75rem;
  margin-top: .35rem;
  color: rgb(79 70 229);
  font-size: .78rem;
  font-weight: 800;
}
.facebook-review-toggle:focus-visible {
  outline: 3px solid rgb(99 102 241 / .55);
  outline-offset: 3px;
  border-radius: .35rem;
}
.dark .facebook-review-source,
.dark .facebook-review-toggle { color: rgb(165 180 252); }
```

Reduce Shivam's tags to `AP Chemistry` and `Grade Boost`. Add the compact threshold and update rendering:

```js
function shouldCollapseFacebookReview(excerpt) {
  return String(excerpt).length > 170;
}

function renderFacebookReviews() {
  const track = document.getElementById("facebook-reviews-track");
  if (!track) return;
  track.innerHTML = FACEBOOK_REVIEWS.map((review, index) => {
    const isCollapsible = shouldCollapseFacebookReview(review.excerpt);
    const quoteId = `facebook-review-quote-${index}`;
    return `
      <li class="facebook-review-card">
        <div class="facebook-reviewer">
          <span class="facebook-review-avatar"><img src="${escapeReviewText(review.avatar)}" alt="" aria-hidden="true"><span class="facebook-review-initials" aria-hidden="true">${escapeReviewText(review.initials)}</span></span>
          <div><span class="facebook-reviewer-name">${escapeReviewText(review.name)}</span><time datetime="${escapeReviewText(review.dateTime)}">${escapeReviewText(review.date)}</time></div>
        </div>
        <div class="facebook-review-stars" role="img" aria-label="5 out of 5 stars"><span aria-hidden="true">★★★★★</span></div>
        <div class="facebook-review-tags">${review.tags.map(tag => `<span>${escapeReviewText(tag)}</span>`).join("")}</div>
        <div class="facebook-review-copy${isCollapsible ? "" : " is-expanded"}">
          <blockquote id="${quoteId}">“${escapeReviewText(review.excerpt)}”</blockquote>
          ${isCollapsible ? `<button class="facebook-review-toggle" type="button" data-facebook-review-toggle aria-expanded="false" aria-controls="${quoteId}"><span>Read more</span></button>` : ""}
        </div>
        <p class="facebook-review-context"><span class="facebook-review-source">Facebook review</span><br>${escapeReviewText(review.context)}</p>
      </li>`;
  }).join("");
}
```

Add one delegated click listener after the existing `facebookReviewsTrack` constant is initialized:

```js
facebookReviewsTrack?.addEventListener("click", event => {
  const button = event.target.closest("[data-facebook-review-toggle]");
  if (!button) return;
  const copy = button.closest(".facebook-review-copy");
  const isExpanded = button.getAttribute("aria-expanded") === "true";
  copy?.classList.toggle("is-expanded", !isExpanded);
  button.setAttribute("aria-expanded", String(!isExpanded));
  button.querySelector("span").textContent = isExpanded ? "Read more" : "Show less";
});
```

- [ ] **Step 4: Run focused and full tests for GREEN**

Run:

```bash
node --test --test-name-pattern="Facebook review" tests/light-mode-section-surfaces.test.mjs
node --test tests/light-mode-section-surfaces.test.mjs
git diff --check
```

Expected: all focused tests and the complete suite pass; diff check emits no output.

- [ ] **Step 5: Commit the scoped refinement**

```bash
git add index.html tests/light-mode-section-surfaces.test.mjs
git commit -m "refine Facebook review hierarchy"
```

---

### Task 2: Rendered responsive and interaction verification

**Files:**
- Modify only if evidence exposes a defect: `index.html`
- Modify only for a reproduced regression: `tests/light-mode-section-surfaces.test.mjs`
- Create evidence report: `.superpowers/sdd/2026-08-16-facebook-review-hierarchy-refinement/task-2-report.md`

**Interfaces:**
- Consumes: Task 1's introduction, card rendering, disclosures, and all pre-existing carousel behavior.
- Produces: accepted light/dark/reduced-motion screenshots and a concise evidence report covering layout, interaction, accessibility state, and page health.

- [ ] **Step 1: Start or verify the local preview**

Run:

```bash
curl -sS -o /dev/null -w '%{http_code}\n' http://127.0.0.1:4173/index.html
```

Expected: `200`. If the server is absent, run `python3 -m http.server 4173 --bind 127.0.0.1` from `html-version` in a managed terminal session, then repeat the HTTP check.

- [ ] **Step 2: Capture and inspect the responsive matrix**

Using the in-app Browser when available, otherwise local Playwright/Chrome with the reason recorded, render the Facebook review section at:

```text
390x844  light, dark, reduced motion
768x1024 light, dark
1440x900 light, dark, reduced motion
```

For every state, verify:

```text
Only the main heading and supporting line are visible above the cards.
Card count is 1-plus-edge at 390, 2 at 768, and 3 at 1440.
No visible excerpt exceeds five calm lines while collapsed.
No card, control, advisor trigger, or expanded quote causes horizontal page overflow.
Light and dark surfaces retain readable contrast and restrained Facebook-blue attribution.
```

- [ ] **Step 3: Verify disclosure and preserved carousel behavior**

At 390 and 1440:

```text
Activate Read more by click and keyboard.
Confirm aria-expanded changes false to true, the full approved excerpt appears, and the label becomes Show less.
Activate Show less and confirm the card returns to the compact state.
Use Previous, Next, ArrowLeft, ArrowRight, native horizontal swipe, and trackpad/wheel interruption.
Confirm the visible counter, disabled boundaries, and focus remain correct.
Under reduced motion, confirm navigation and disclosures do not introduce animated transitions.
```

- [ ] **Step 4: Fix only evidence-backed defects test-first**

For each defect, add a focused assertion to `tests/light-mode-section-surfaces.test.mjs`, run it to observe the expected failure, make the smallest `index.html` correction, rerun the focused test, then rerun the full suite. Do not change the approved content, layout model, or carousel mechanics without a new design decision.

- [ ] **Step 5: Run the final gate and record evidence**

Run:

```bash
node --test tests/light-mode-section-surfaces.test.mjs
git diff --check
curl -sS -o /dev/null -w '%{http_code}\n' http://127.0.0.1:4173/index.html
```

Write `.superpowers/sdd/2026-08-16-facebook-review-hierarchy-refinement/task-2-report.md` with viewport results, screenshot paths, interaction results, console/page errors, exact command outcomes, and any environment limitations.

- [ ] **Step 6: Commit any verified QA correction**

If Task 2 required a correction:

```bash
git add index.html tests/light-mode-section-surfaces.test.mjs
git commit -m "fix Facebook review responsive polish"
```

If no product files changed, do not create an empty commit.
