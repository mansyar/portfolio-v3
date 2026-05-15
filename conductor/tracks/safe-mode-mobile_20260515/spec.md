# Specification: Safe Mode Mobile Enhancement

**Track ID:** `safe-mode-mobile_20260515`
**Type:** Feature
**Status:** Approved

---

## Overview

Touch gesture support, CSS slide transitions, and a content-dimming loading indicator for the mobile Safe Mode (< 768px viewport) experience. Turns the functional-but-abrupt terminal view navigation into a polished, app-like interface with swipe-to-go-back (opacity fade + instant commit), animated forward/back programmatic transitions, and subtle content dimming during navigation.

---

## Functional Requirements

### FR1 — Swipe-to-Go-Back Gesture

- **Detection:** Touch start within 40px of the left edge of the viewport triggers "back" gesture detection.
- **Tracking:** While dragging, track horizontal (`touch.clientX`) movement. Vertical movement is ignored — scrolling still works.
- **Visual Feedback:** As the user drags right, the current view's opacity decreases linearly from 1.0 (at 0px drag) to 0.0 (at max drag). No sliding/translation — only opacity fade.
- **Commit Threshold:** On `touchend`:
  - If cumulative horizontal drag > 80px → execute back navigation **instantly** (no slide animation — the opacity fade was the visual feedback).
  - If drag ≤ 80px → snap back (opacity returns to 1.0 over 150ms ease-out, no navigation).
- **Cancellation:** If the user drags vertically (scroll) the gesture is ignored — no opacity change, no navigation.
- **No slide animation on swipe commit:** The swipe gesture uses opacity fade as its sole visual language. Slide transitions (FR2) are reserved for programmatic navigation only.
- **Haptic Feedback:** No haptic feedback (keeps it simple).

### FR2 — CSS Slide Transitions (Programmatic Navigation Only)

- **Scope:** Slide transitions apply to **programmatic navigation** only — keyboard shortcuts (`1-5`, `0`), button clicks, and `onRestart`. They do NOT fire on swipe-committed back (FR1).
- **Forward navigation** (e.g., Project Detail from Project List): New content slides in from the right edge over 200ms `ease-out`.
- **Back navigation** (e.g., Project List from Project Detail):
  - Outgoing view slides out to the right edge over 150ms `ease-in`.
  - Incoming view simultaneously slides in from the left edge over 150ms `ease-out`.
- **View stack requirement:** Both outgoing and incoming views must be rendered simultaneously during the transition. This requires refactoring from the current conditional rendering pattern (`{currentView === 'x' && renderX()}`) to a view stack that keeps the previous view mounted during its out-animation.
- **Reduced Motion:** When `prefers-reduced-motion: reduce` is active, all slide transitions are disabled (0ms duration, instant swap).

### FR3 — Content Dimming During Transitions

- **Trigger:** Shown briefly during all programmatic view transitions.
- **Position:** Overlay within the Safe Mode content area.
- **Visual:**
  - Current content dims to opacity 0.7 over 150ms.
  - Content stays dimmed during the slide transition.
  - Incoming content fades in from opacity 0.7 → 1.0 (or 0 → 1.0 if using opacity-based animation).
  - No text, no progress bar — just a subtle brightness change.
- **Minimum Duration:** At least 100ms to prevent flash. The dimming naturally lasts the duration of the slide transition (150–200ms).
- **Reduced Motion:** Dimming still functions (opacity changes are not "motion" per WCAG guidelines).

### FR4 — Store Integration

- Swipe gesture state (touch positions, opacity) is managed in local component state via `useRef` (no Nano Store addition needed).
- Navigation works through the existing store atoms:
  - `$safeModeView` — the active view (e.g., `'main'`, `'projects'`, `'project-detail'`, etc.)
  - `$safeModeSlug` — the selected project/article slug
- Back navigation calls `setSafeModeView(view)` to switch to the previous view.
- Loading/dimming state is local to `TerminalNav.tsx` — a simple `isTransitioning` state flag coordinated with animation timing.

### FR5 — Navigation Direction Tracking

- A local state variable `navigatingForward: boolean` (or `'forward' | 'back'` enum) is introduced to determine which CSS transition class to apply.
- This flag is set before every `setSafeModeView()` call:
  - `true` when going from parent → child (main → projects, projects → project-detail, etc.)
  - `false` when going back (project-detail → projects, projects → main, etc.)

### FR6 — Reduced Motion Compliance

- Slide transitions (FR2) are disabled entirely under `prefers-reduced-motion: reduce`.
- Swipe gesture visual feedback (opacity fade) still functions — opacity changes are not "motion" per WCAG guidelines.
- Content dimming (FR3) still functions for the same reason.
- Existing keyboard/touch navigation must not regress.

---

## Non-Functional Requirements

- **Performance:** Swipe detection must feel instant (< 16ms latency). No additional JS bundle overhead beyond the existing `TerminalNav.tsx` component.
- **Accessibility:** All existing ARIA roles, focus management, and keyboard navigation must remain intact. Swipe gesture must not interfere with screen reader swipe gestures.
- **Compatibility:** Must work on iOS Safari, Chrome Android, and Samsung Internet (all modern mobile browsers).
- **Modularity:** `TerminalNav.tsx` must stay under 500 lines. If the view stack refactoring pushes it past 450 lines, extract the view rendering + transition wrapper into a separate `SafeModeViewport.tsx` component.

---

## Acceptance Criteria

```
✅ Swiping right from the left edge (within 40px) navigates back one view level
✅ Swipe < 80px snaps back with no navigation (cancel gesture)
✅ Opacity fade (1→0) provides visual feedback during drag
✅ Swipe-committed back navigation is instant (no slide animation)
✅ Vertical swipes are ignored (scrolling still works)
✅ Forward programmatic navigation: content slides in from the right (200ms ease-out)
✅ Back programmatic navigation: content slides out to the right, previous view slides in from left (150ms)
✅ Both outgoing and incoming views render simultaneously during slide transitions
✅ Content dims briefly during transitions (opacity 0.7, no text/progress bar)
✅ navigatingForward state correctly determines transition direction
✅ prefers-reduced-motion disables all slide transitions
✅ All existing Safe Mode tests continue to pass
✅ All src/ files under 500 lines
```

---

## Out of Scope

- Haptic feedback (vibration API)
- Swipe-to-go-forward (only back gesture)
- Swipe from right edge
- Pull-to-refresh
- Touch gesture anywhere other than left edge
- Nano Store changes for swipe state (local state only)
- Changes to desktop view mode
- XP-styled progress bar loading animation (replaced by content dimming)
