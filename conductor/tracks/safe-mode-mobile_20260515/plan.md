# Implementation Plan: Safe Mode Mobile Enhancement

**Track ID:** `safe-mode-mobile_20260515`
**Status:** Draft

---

## Phase 1 — Swipe Gesture Handler

> Implement touch swipe detection, opacity-fade visual feedback, and back-navigation commit logic in `TerminalNav.tsx`.

- [ ] **Task: Write swipe gesture test suite**
  - [ ] Test: touch start within 40px of left edge triggers gesture detection
  - [ ] Test: touch start beyond 40px does NOT trigger gesture
  - [ ] Test: dragging right > 80px commits back navigation
  - [ ] Test: dragging right ≤ 80px snaps back (no navigation)
  - [ ] Test: vertical drag (scroll) is ignored
  - [ ] Test: opacity decreases proportionally with drag distance
  - [ ] Test: gestures do NOT fire on non-touch devices (pointer events)
- [ ] **Task: Implement swipe gesture handler in TerminalNav.tsx**
  - [ ] Add `touchstart`, `touchmove`, `touchend` event listeners
  - [ ] Track `startX`, `currentX`, `startY` for horizontal-only detection
  - [ ] Compute opacity = `clamp(1 - dragDistance / viewportWidth, 0, 1)`
  - [ ] On commit: call existing `navigateTo(view)` for back navigation
  - [ ] On cancel: reset opacity to 1.0 with 150ms ease-out
  - [ ] Verify keyboard/touch navigation no regression
- [ ] **Task: Conductor - User Manual Verification 'Phase 1 — Swipe Gesture Handler' (Protocol in workflow.md)**

## Phase 2 — CSS Slide Transitions

> Add forward/back slide animations to Safe Mode view transitions in `xp-safe-mode.css`, respecting reduced motion.

- [ ] **Task: Write slide transition tests**
  - [ ] Test: forward navigation renders with `slide-in-right` class (200ms)
  - [ ] Test: back navigation renders with `slide-out-right` class (150ms)
  - [ ] Test: `prefers-reduced-motion: reduce` disables transition classes
- [ ] **Task: Implement slide transition CSS**
  - [ ] Add `.slide-in-right` class: `transform: translateX(100%) → translateX(0)`, 200ms `ease-out`
  - [ ] Add `.slide-out-right` class: `transform: translateX(0) → translateX(100%)`, 150ms `ease-in`
  - [ ] Add `.slide-in-left` (back navigation incoming view): `translateX(-100%) → translateX(0)`, 150ms `ease-out`
  - [ ] Add `@media (prefers-reduced-motion: reduce)` overrides to disable all slide transitions
  - [ ] Wire transition classes into `TerminalNav.tsx` view container based on navigation direction
- [ ] **Task: Conductor - User Manual Verification 'Phase 2 — CSS Slide Transitions' (Protocol in workflow.md)**

## Phase 3 — Loading Indicator (XP Progress Bar)

> Add XP-styled indeterminate progress bar overlay during view transitions.

- [ ] **Task: Write loading indicator tests**
  - [ ] Test: loading overlay renders on view transition
  - [ ] Test: loading overlay shows XP progress bar + "Loading..." text
  - [ ] Test: minimum 200ms display before content shows
  - [ ] Test: progress bar fades out (150ms), content fades in (150ms)
  - [ ] Test: `prefers-reduced-motion` disables progress bar animation (static bar)
- [ ] **Task: Implement loading indicator component and CSS**
  - [ ] Add loading overlay HTML: full overlay with `rgba(0,0,0,0.7)` background
  - [ ] Add XP-styled indeterminate progress bar CSS (marquee blue blocks animation)
  - [ ] Add "Loading..." text below progress bar in `--safe-mode-text` green
  - [ ] Add `isLoading` state with `setTimeout(200ms)` minimum display
  - [ ] Add content fade-in (opacity 0→1, 150ms) when loading completes
  - [ ] Add progress bar fade-out (opacity 1→0, 150ms) before content fade-in
  - [ ] Add `@media (prefers-reduced-motion: reduce)` override to show static bar
- [ ] **Task: Conductor - User Manual Verification 'Phase 3 — Loading Indicator' (Protocol in workflow.md)**

## Phase 4 — Documentation Updates

> Synchronize PRD and TDD with the new mobile enhancement specifications.

- [ ] **Update PRD §3.2 (Mobile Experience)** — add swipe gesture, slide transitions, loading states
- [ ] **Update TDD §8 (Mobile Safe Mode)** — add swipe gesture spec, transition timing, loading behavior
- [ ] **Task: Conductor - User Manual Verification 'Phase 4 — Documentation Updates' (Protocol in workflow.md)**

---

## Key Files Modified

```
src/components/mobile/TerminalNav.tsx — Swipe gesture handler + loading state
src/styles/xp-safe-mode.css — Slide transition CSS classes + reduced-motion overrides
tests/TerminalNav.test.tsx — Gesture, transition, and loading state tests
docs/PRD.md — §3.2 Mobile Experience updated
docs/TDD.md — §8 Mobile Safe Mode updated
```
