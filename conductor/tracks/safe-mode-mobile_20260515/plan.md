# Implementation Plan: Safe Mode Mobile Enhancement

**Track ID:** `safe-mode-mobile_20260515`
**Status:** Approved

---

## Phase 1 — View Stack Refactoring + Cross-Fade Transitions [checkpoint: cfae6ea]

> Refactor TerminalNav from instant conditional rendering to a view stack that supports simultaneous outgoing/incoming cross-fade animations. Replaced original slide transition design with BIOS-style cross-fade per user preference.

- [x] **Task: Write cross-fade transition test suite** (4 tests passing) [cfae6ea]
  - [x] Test: forward navigation applies `crossfade` class
  - [x] Test: back navigation applies `crossfade` class
  - [x] Test: `prefers-reduced-motion: reduce` disables crossfade (instant swap)
  - [x] Test: both outgoing and incoming views rendered simultaneously during crossfade
- [x] **Task: Refactor to view stack architecture in TerminalNav.tsx** [f40cfb0]
  - [x] Replace `{currentView === 'x' && renderX()}` with a view stack that keeps the previous view mounted during its out-animation
  - [x] Track `previousView` and `currentView` — render both during transitions
  - [x] Add `isTransitioning` state flag to control animation phase
  - [x] On timeout (250ms), unmount the outgoing view
  - [x] Apply `crossfade` CSS class to container during transitions
  - [x] ALL navigation directions use the same cross-fade (BIOS feel)
- [x] **Task: Implement cross-fade CSS in `xp-safe-mode.css`** [f40cfb0]
  - [x] Add `.crossfade` container class with `display: grid` for view overlay
  - [x] Add `fadeOut` keyframe: opacity 1→0 (outgoing view, 200ms ease-out)
  - [x] Add `fadeIn` keyframe: opacity 0→1 (incoming view, 200ms ease-out)
  - [x] Both views stacked in same grid cell (`grid-area: 1 / 1`) during transition
  - [x] Add `@media (prefers-reduced-motion: reduce)` override: 0ms duration
- [x] **Task: Conductor - User Manual Verification 'Phase 1 — View Stack + Cross-Fade Transitions' (Protocol in workflow.md)** [67f8423]

## Phase 2 — Swipe Gesture Handler [checkpoint: 2b9d1b2]

> Implement touch swipe detection with opacity-fade visual feedback and instant-commit back navigation in TerminalNav.tsx.

- [x] **Task: Write swipe gesture test suite** (8 tests passing) [2b9d1b2]
  - [x] Test: touch start within 40px of left edge triggers gesture detection
  - [x] Test: touch start beyond 40px does NOT trigger gesture
  - [x] Test: dragging right > 80px commits back navigation instantly
  - [x] Test: dragging right ≤ 80px snaps back with opacity restore (150ms ease-out)
  - [x] Test: vertical drag (scroll) is ignored — no opacity change, no navigation
  - [x] Test: opacity decreases proportionally with drag distance
  - [x] Test: swipe-committed back does NOT fire a cross-fade transition (instant swap)
  - [x] Test: gestures do NOT fire on non-touch devices (pointer events)
- [x] **Task: Implement swipe gesture handler in TerminalNav.tsx** [2b9d1b2]
  - [x] Add `touchstart`, `touchmove`, `touchend` event listeners in a dedicated `useEffect`
  - [x] Use `useRef` for touch state (`startX`, `currentX`, `startY`, `opacity`) to avoid stale closures and unnecessary re-renders
  - [x] Compute opacity = `clamp(1 - dragDistance / viewportWidth, 0, 1)`
  - [x] Apply opacity via `ref.current.style.opacity` on the view container (ref-based DOM write, no re-render)
  - [x] On commit (> 80px): navigate back instantly — no cross-fade, no delay
  - [x] On cancel (≤ 80px): reset opacity to 1.0 with CSS transition (150ms ease-out)
  - [x] Ensure keyboard handler (`useEffect`) and touch handler (`useEffect`) are in separate effects to avoid re-subscription conflicts
  - [x] All 19 tests pass (7 original + 4 cross-fade + 8 swipe)
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
