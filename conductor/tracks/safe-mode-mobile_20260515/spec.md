# Specification: Safe Mode Mobile Enhancement

**Track ID:** `safe-mode-mobile_20260515`
**Type:** Feature
**Status:** Draft

---

## Overview

Touch gesture support, CSS slide transitions, and loading indicators for the mobile Safe Mode (< 768px viewport) experience. Turns the functional-but-abrupt terminal view navigation into a polished, app-like interface with swipe-to-go-back, animated forward/back transitions, and XP-styled loading progress bars.

---

## Functional Requirements

### FR1 — Swipe-to-Go-Back Gesture

- **Detection:** Touch start within 40px of the left edge of the viewport triggers "back" gesture detection.
- **Tracking:** While dragging, track horizontal (`touch.clientX`) movement. Vertical movement is ignored — scrolling still works.
- **Visual Feedback:** As the user drags right, the current view's opacity decreases linearly from 1.0 (at 0px drag) to 0.0 (at max drag). No sliding/translation — only opacity fade.
- **Commit Threshold:** On `touchend`:
  - If cumulative horizontal drag > 80px → execute back navigation (go to previous view).
  - If drag ≤ 80px → snap back (opacity returns to 1.0, no navigation).
- **Cancellation:** If the user drags vertically (scroll) the gesture is ignored — no opacity change, no navigation.
- **Haptic Feedback:** No haptic feedback on swipe completion (keeps it simple).

### FR2 — CSS Slide Transitions

- **Forward navigation** (e.g., Project Detail from Project List): New content slides in from the right edge over 200ms `ease-out`.
- **Back navigation** (e.g., Project List from Project Detail): Current content slides out to the right edge over 150ms `ease-in`, revealing the previous view.
- **Reduced Motion:** When `prefers-reduced-motion: reduce` is active, all slide transitions are disabled (0ms duration, instant swap).

### FR3 — Loading Indicator (XP-Styled Progress Bar)

- **Trigger:** Shown during all view transitions (forward and back) when switching between views.
- **Position:** Full overlay, centered vertically and horizontally within the Safe Mode content area.
- **Visual:**
  - Background: Semi-transparent black overlay (`rgba(0, 0, 0, 0.7)`) covering the content area.
  - Progress bar: XP-styled animated blue bar — a repeating CSS animation that simulates an indeterminate progress bar (marquee-style blue blocks sliding left-to-right).
  - Text: "Loading..." in `--safe-mode-text` green (`#00ff41`) monospace font below the bar.
- **Minimum Duration:** At least 200ms to prevent flash-for-empty (if the content is ready quickly, the loading indicator still shows for 200ms).
- **Transition to Content:** When loading completes, the progress bar fades out (opacity 1→0 over 150ms) and the content fades in (opacity 0→1 over 150ms). These fade transitions are **not** affected by `prefers-reduced-motion`.

### FR4 — Store Integration

- Swipe gesture state is managed in a local component state (no Nano Store addition needed).
- The existing `$safeMode` store (from `TerminalNav.tsx`) already manages:
  - `currentView` — the active view (e.g., `'main'`, `'projects'`, `'project-detail'`, etc.)
  - `selectedSlug` — the selected project/article slug
- The swipe gesture hooks into the existing `navigateTo(view, slug?)` function for back navigation.
- Loading state is local to `TerminalNav.tsx` — a simple `isLoading` state flag with `setTimeout` based minimum display time.

### FR5 — Reduced Motion Compliance

- Slide transitions (FR2) are disabled entirely under `prefers-reduced-motion: reduce`.
- Swipe gesture visual feedback (opacity fade) still functions — opacity changes are not "motion" per WCAG guidelines.
- Loading progress bar animation is disabled (static bar with no marquee animation) under reduced motion.
- Existing keyboard/touch navigation must not regress.

---

## Non-Functional Requirements

- **Performance:** Swipe detection must feel instant (< 16ms latency). No additional JS bundle overhead beyond the existing `TerminalNav.tsx` component.
- **Accessibility:** All existing ARIA roles, focus management, and keyboard navigation must remain intact. Swipe gesture must not interfere with screen reader swipe gestures.
- **Compatibility:** Must work on iOS Safari, Chrome Android, and Samsung Internet (all modern mobile browsers).
- **Modularity:** `TerminalNav.tsx` must stay under 500 lines (existing file modularity rule).

---

## Acceptance Criteria

```
✅ Swiping right from the left edge (within 40px) navigates back one view level
✅ Swipe < 80px snaps back with no navigation (cancel gesture)
✅ Opacity fade (1→0) provides visual feedback during drag
✅ Vertical swipes are ignored (scrolling still works)
✅ Forward navigation slides content in from the right (200ms ease-out)
✅ Back navigation slides content out to the right (150ms ease-in)
✅ XP-styled indeterminate progress bar shown as full overlay during transitions
✅ "Loading..." text below progress bar in green monospace
✅ Minimum 200ms loading display prevents flash-for-empty
✅ Content fades in (150ms) after loading completes
✅ prefers-reduced-motion disables slide transitions and progress bar animation
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
