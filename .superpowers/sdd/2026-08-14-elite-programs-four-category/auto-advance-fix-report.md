# Auto-Advance Focus Fix Report — Elite Programs

## Root Cause

`updateUI()` synchronizes the desktop selector's `aria-pressed` and roving `tabindex` values from `activeProgram`. The desktop interval continued to advance `activeProgram` every five seconds whenever pointer hover was absent, including while keyboard focus remained in `#programs-list`. A keyboard user's focused control could therefore become unpressed and `tabindex="-1"` without focus moving.

The interval now checks `#programs-list:focus-within` before advancing. This keeps the existing hover pause unchanged, pauses during keyboard interaction, and resumes from the retained progress state once focus leaves the selector.

## RED / GREEN

- **RED:** `node --test --test-name-pattern='pauses desktop Elite Program auto-advance' tests/light-mode-section-surfaces.test.mjs` failed with the focused item at index 1 advancing to index 2 at `progressVal = 99`.
- **GREEN:** The same executable interval regression passes after adding the native `:focus-within` gate; it also verifies that the next tick advances only after focus leaves the list.

## Verification

- Focused Elite Programs contracts: 6 passed, 0 failed.
- Full static suite and `git diff --check`: recorded with this fix before commit.
- Preview: `http://127.0.0.1:4174/index.html` returned HTTP 200.

## Rendered QA

The in-app Browser route was attempted first, but this runtime does not expose the required Node REPL `js` tool. Local Chrome DevTools Protocol fallback evidence is retained in `evidence/auto-advance-qa.json`.

- At 1440px, a real ArrowRight keyboard event focused 1-on-1 Tutoring. At the auto-advance boundary, focus, `aria-pressed`, and roving `tabindex` remained on index 1, with the visible focus ring confirmed.
- Moving focus to the stage CTA resumed auto-advance to SAT Prep without moving that external focus.
- Actual pointer hover still paused at the boundary; moving the pointer out resumed it.
- At 390px, AP Prep remained the default without page overflow, and ArrowLeft still wrapped to Competition Prep with synchronized mobile state.
- No selector-related runtime errors were recorded. The only console messages were Tailwind CDN production-use warnings.

Visual evidence: `evidence/1440-desktop-auto-advance-focus-stable.png` and `evidence/390-mobile-auto-advance-regression.png`.

## Commit

`HEAD` — `fix: pause elite program auto-advance on focus`

## Self-Review

- The production change is limited to the existing auto-advance predicate.
- Hover pause, pointer activation, the shared four-category state path, and mobile behavior are unchanged.
- The regression executes the real extracted interval body against focus-within and blur states, so removing the focus gate recreates the original failure.
- Independent code review found no Critical, Important, or Minor issues.

## Concerns

- The in-app Browser runtime was unavailable; Chrome DevTools fallback was used and retained.
- Resume intentionally retains existing progress rather than resetting it. Once focus is outside the selector, an almost-complete cycle can advance on the next interval tick, but it cannot change the roving tab stop under keyboard focus.
