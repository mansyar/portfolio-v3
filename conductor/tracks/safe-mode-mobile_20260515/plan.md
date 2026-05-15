# Implementation Plan: Safe Mode Mobile Enhancement

**Track ID:** `safe-mode-mobile_20260515`
**Status:** Approved

---

## Phase 1 — View Stack Refactoring + CSS Slide Transitions [checkpoint: f40cfb0]

> Refactor TerminalNav from instant conditional rendering to a view stack that supports simultaneous outgoing/incoming animations. Add CSS slide transition classes.

- [x] **Task: Write slide transition test suite** ([12 tests written and passing](./tests/TerminalNav-transitions.test.tsx)) [f40cfb0]
  - [x] Test: forward navigation renders with `slide-in-right` on incoming view (200ms)
  - [x] Test: back navigation renders with `slide-out-right` on outgoing + `slide-in-left` on incoming (150ms)
  - [x] Test: `prefers-reduced-motion: reduce` disables transition classes (instant swap)
  - [x] Test: `navigatingForward` state is `true` for parent→child navigation
  - [x] Test: `navigatingForward` state is `false` for child→parent (back) navigation
- [x] **Task: Refactor to view stack architecture in TerminalNav.tsx** [f40cfb0]
  - [x] Replace `{currentView === 'x' && renderX()}` with a view stack that keeps the previous view mounted during its out-animation
  - [x] Track `previousView` and `currentView` — render both during transitions
  - [x] Add `isTransitioning` state flag to control animation phase
  - [x] On `transitionend` or timeout (250ms), unmount the outgoing view
  - [x] Add `navigatingForward: boolean` local state variable, set before every `setSafeModeView()` call
  - [x] Apply transition CSS classes to outgoing/incoming view containers based on direction
- [x] **Task: Implement slide transition CSS in `xp-safe-mode.css`** [f40cfb0]
  - [x] Add `.slide-in-right`: `translateX(100%) → translateX(0)`, 200ms `ease-out`
  - [x] Add `.slide-out-right`: `translateX(0) → translateX(100%)`, 150ms `ease-in`
  - [x] Add `.slide-in-left`: `translateX(-100%) → translateX(0)`, 150ms `ease-out`
  - [x] Add `.slide-out-left`: `translateX(0) → translateX(-100%)`, 200ms `ease-in` (for forward nav outgoing)
  - [x] Add `@media (prefers-reduced-motion: reduce)` overrides: set `transition-duration: 0ms`
- [ ] **Task: Conductor - User Manual Verification 'Phase 1 — View Stack + Slide Transitions' (Protocol in workflow.md)**

## Phase 2 — Swipe Gesture Handler

> Implement touch swipe detection with opacity-fade visual feedback and instant-commit back navigation in TerminalNav.tsx.

- [ ] **Task: Write swipe gesture test suite**
  - [ ] Test: touch start within 40px of left edge triggers gesture detection
  - [ ] Test: touch start beyond 40px does NOT trigger gesture
  - [ ] Test: dragging right > 80px commits back navigation instantly
  - [ ] Test: dragging right ≤ 80px snaps back with opacity restore (150ms ease-out)
  - [ ] Test: vertical drag (scroll) is ignored — no opacity change, no navigation
  - [ ] Test: opacity decreases proportionally with drag distance
  - [ ] Test: swipe-committed back does NOT fire a slide transition (instant swap)
  - [ ] Test: gestures do NOT fire on non-touch devices (pointer events)
- [ ] **Task: Implement swipe gesture handler in TerminalNav.tsx**
  - [ ] Add `touchstart`, `touchmove`, `touchend` event listeners in a dedicated `useEffect`
  - [ ] Use `useRef` for touch state (`startX`, `currentX`, `startY`, `opacity`) to avoid stale closures and unnecessary re-renders
  - [ ] Compute opacity = `clamp(1 - dragDistance / viewportWidth, 0, 1)`
  - [ ] Apply opacity via `ref.current.style.opacity` on the view container (ref-based DOM write, no re-render)
  - [ ] On commit (> 80px): call `setSafeModeView(previousView)` instantly — no slide, no delay
  - [ ] On cancel (≤ 80px): reset opacity to 1.0 with CSS transition (150ms ease-out)
  - [ ] Ensure keyboard handler (`useEffect`) and touch handler (`useEffect`) are in separate effects to avoid re-subscription conflicts
  - [ ] Verify keyboard/touch navigation no regression
- [ ] **Task: Conductor - User Manual Verification 'Phase 2 — Swipe Gesture Handler' (Protocol in workflow.md)**

## Phase 3 — Content Dimming During Transitions

> Add a subtle content dimming effect during programmatic view transitions instead of a full progress bar overlay.

- [ ] **Task: Write content dimming tests**
  - [ ] Test: content dims to opacity 0.7 during a programmatic view transition
  - [ ] Test: content returns to full opacity (1.0) when transition completes
  - [ ] Test: `prefers-reduced-motion` does NOT disable dimming (opacity ≠ motion)
  - [ ] Test: no dimming text or progress bar visible
- [ ] **Task: Implement content dimming**
  - [ ] Add `.content-dimming` CSS class: `transition: opacity 150ms ease-out`
  - [ ] Apply `.content-dimming` + `opacity: 0.7` to outgoing view during transitions
  - [ ] Remove dimming class on transition end (outgoing view unmounts, incoming view at 1.0)
  - [ ] Wire into the view stack's `isTransitioning` state
- [ ] **Task: Conductor - User Manual Verification 'Phase 3 — Content Dimming' (Protocol in workflow.md)**

## Phase 4 — Documentation Updates

> Synchronize PRD and TDD with the new mobile enhancement specifications.

- [ ] **Update PRD §3.2 (Mobile Experience)** — add swipe gesture, slide transitions, content dimming
- [ ] **Update TDD §8 (Mobile Safe Mode)** — add swipe gesture spec, view stack architecture, dimming behavior, navigation direction tracking
- [ ] **Update TDD §9 (Animations & Transitions)** — add slide transition entries (slide-in-right, slide-out-right, slide-in-left, slide-out-left) and content dimming to the animation table
- [ ] **Task: Conductor - User Manual Verification 'Phase 4 — Documentation Updates' (Protocol in workflow.md)**

---

## Modularity Contingency

`TerminalNav.tsx` is currently 311 lines. Estimated additions:

- View stack refactoring: ~30 lines
- Navigation direction tracking: ~8 lines
- Swipe gesture handler: ~45 lines
- Touch refs and effects: ~20 lines
- Content dimming integration: ~10 lines

**Estimated total: ~424 lines.** If during Phase 1 the view stack refactoring causes the component to exceed 460 lines, extract the view renderers + transition wrapper into a separate `SafeModeViewport.tsx` component in `src/components/mobile/`. The export should accept `view`, `slug`, `isTransitioning`, and `navigatingForward` as props.

---

## Key Files Modified

```
src/components/mobile/TerminalNav.tsx — View stack, swipe gesture, dimming, direction tracking
src/styles/xp-safe-mode.css — Slide transition CSS classes + reduced-motion overrides
tests/TerminalNav.test.tsx — Gesture, transition, dimming, and direction tracking tests
docs/PRD.md — §3.2 Mobile Experience updated
docs/TDD.md — §8 Mobile Safe Mode, §9 Animations & Transitions updated
```
