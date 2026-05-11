# Implementation Plan: Window Manager

## Phase 1: Window Store & Actions

_Build the Nano Stores foundation with all window actions and default configurations._

### Task 1: Create Window Types, Store Schemas & Default Configs

- [x] **Write Tests**: Unit tests for `WindowState` interface, `WindowId` type, `DEFAULT_WINDOW_CONFIGS` constant — validate all 6 window configs have correct defaults and min sizes `d363f76`
- [x] **Implement**: Create `src/stores/windows.ts` with `WindowState`, `WindowId` types, and `DEFAULT_WINDOW_CONFIGS` map (positions, sizes, min constraints) `d363f76`
- [x] **Implement**: Create `$windows` map, `$zCounter` atom, `$activeWindow` atom, `$taskbarWindows` derived store `d363f76`
- [x] **Verify Coverage**: `CI=true pnpm test:coverage` `d363f76`
- [x] **Commit**: `feat(stores): Add window state types, default configs, and Nano Store atoms` `d363f76`

### Task 2: Implement All Window Actions

> **Note:** Installed Nano Stores is v1.3.0 (not v0.11.x as in TDD §13). Verify v1.x `map` API — `setKey(key, value)` replaces nested values, but to remove a key create a new object: `const next = { ...$windows.get() }; delete next[id]; $windows.set(next)`. The `$taskbarWindows` filter `w.status !== undefined` is a defensive guard; all entries will always have a defined status since `closeWindow` removes entries entirely.

- [x] **Write Tests**: Unit tests for `openWindow`, `closeWindow`, `minimizeWindow`, `maximizeWindow`, `restoreWindow` — verify status transitions, z-index assignment, position caching `7ee30dd`
- [x] **Write Tests**: Unit tests for `focusWindow`, `moveWindow`, `resizeWindow` — verify z-counter increment, viewport constraints, min size enforcement `7ee30dd`
- [x] **Write Tests**: Edge cases — opening already-open window, closing nonexistent window, minimize from maximized state `7ee30dd`
- [x] **Write Tests**: Test `closeWindow` with 'closing' transitional status — verify animation delay before removal from store `7ee30dd`
- [x] **Implement**: All 8 window actions in `src/stores/windows.ts` with full logic. `closeWindow` sets status='closing', triggers 120ms animation delay, then removes entry via immutable pattern `7ee30dd`
- [x] **Verify Coverage**: `CI=true pnpm test:coverage` `7ee30dd`
- [x] **Commit**: `feat(stores): Implement all window actions (open/close/minimize/maximize/restore/focus/move/resize)` `7ee30dd`

## Phase 2: Window Chrome Components

_Build the React UI components that render window chrome: TitleBar, WindowFrame, WindowLayer._

### Task 3: Create TitleBar Component

- [ ] **Write Tests**: React component test — renders icon, title text, and 3 button controls
- [ ] **Write Tests**: Test min/max/close buttons call correct store actions (`minimizeWindow`, `maximizeWindow`, `closeWindow`)
- [ ] **Write Tests**: Test active vs inactive gradient based on `isActive` prop
- [ ] **Write Tests**: Test double-click title bar calls `maximizeWindow`/`restoreWindow`
- [ ] **Implement**: Create `src/components/window/TitleBar.tsx` with XP-style gradient, icon, title text, 16×16 min/max/close buttons
- [ ] **Implement**: Wire button onClick handlers to store actions; active/inactive gradient switching
- [ ] **Verify Coverage**: `CI=true pnpm test:coverage`
- [ ] **Commit**: `feat(window): Add TitleBar component with min/max/close controls`

### Task 4: Create WindowFrame Component

> **Design note:** Accept the full `WindowState` object as a prop (passed from WindowLayer) rather than subscribing to `$windows` internally. This avoids redundant per-instance store subscriptions and ensures only WindowLayer is the single source of truth for iteration.

- [ ] **Write Tests**: React component test — renders with 3D chrome border, rounded top corners
- [ ] **Write Tests**: Test applies active/inactive title bar based on `isActive` prop
- [ ] **Write Tests**: Test renders placeholder children content
- [ ] **Implement**: Create `src/components/window/WindowFrame.tsx` — `xp-window-border` class, `--xp-shadow-lg`/`--xp-shadow-sm`, TitleBar mount, content slot, accepts full `WindowState` as prop
- [ ] **Verify Coverage**: `CI=true pnpm test:coverage`
- [ ] **Commit**: `feat(window): Add WindowFrame component with 3D chrome border`

### Task 5: Create WindowLayer Component

- [ ] **Write Tests**: React component test — renders one `WindowFrame` per entry in `$windows`
- [ ] **Write Tests**: Test registers CustomEvent listener for `luna:open-window` event
- [ ] **Write Tests**: Test displays placeholder content for all 6 window types
- [ ] **Implement**: Create `src/components/window/WindowLayer.tsx` — subscribes to `$windows`, iterates and renders `WindowFrame` for each
- [ ] **Implement**: Add CustomEvent listener in `useEffect` for desktop icon click wiring
- [ ] **Verify Coverage**: `CI=true pnpm test:coverage`
- [ ] **Commit**: `feat(window): Add WindowLayer component with store subscription and event listener`

## Phase 3: Interaction Logic

_Implement drag, resize, z-index stacking, minimize/maximize/restore animations._

### Task 6: Implement Title Bar Drag Logic

- [ ] **Write Tests**: DOM event tests — mousedown on title bar initiates drag
- [ ] **Write Tests**: Test mousemove delta updates window position
- [ ] **Write Tests**: Test viewport constraint (min 32px visible from any edge)
- [ ] **Write Tests**: Test mouseup ends drag
- [ ] **Implement**: Drag logic in `WindowFrame.tsx` — `onMouseDown` on TitleBar, `onMouseMove`/`onMouseUp` on document with cleanup in `useEffect` return
- [ ] **Verify Coverage**: `CI=true pnpm test:coverage`
- [ ] **Commit**: `feat(window): Implement viewport-constrained title bar drag`

### Task 7: Implement Edge/Corner Resize

- [ ] **Write Tests**: DOM event tests — mousedown on 8px edge/corner hit area initiates resize
- [ ] **Write Tests**: Test all 8 resize cursors render correctly
- [ ] **Write Tests**: Test minWidth/minHeight constraints are enforced
- [ ] **Implement**: Resize logic — hit area detection, cursor switching, drag-based dimension updates
- [ ] **Verify Coverage**: `CI=true pnpm test:coverage`
- [ ] **Commit**: `feat(window): Implement edge/corner resize with min size constraints`

### Task 8: Implement Z-Index Stacking & Focus-on-Click

- [ ] **Write Tests**: Test click anywhere in window calls `focusWindow()`
- [ ] **Write Tests**: Test z-index values are unique and incrementing
- [ ] **Write Tests**: Test `$activeWindow` updates correctly on focus
- [ ] **Implement**: Click handler on WindowFrame → `focusWindow()`, dynamic zIndex style, active/inactive visual state
- [ ] **Verify Coverage**: `CI=true pnpm test:coverage`
- [ ] **Commit**: `feat(window): Implement z-index stacking and focus-on-click`

### Task 9: Implement Open/Close/Minimize/Maximize/Restore with CSS Transitions

- [ ] **Write Tests**: React component test — `status='closing'` applies scale-out + fade animation (120ms ease-in), then window is removed
- [ ] **Write Tests**: Test `status='open'` with initial render applies scale-in + fade animation (150ms ease-out)
- [ ] **Write Tests**: Test `status='minimized'` applies slide-down CSS (translateY toward taskbar + opacity, 200ms ease-in)
- [ ] **Write Tests**: Test `status='maximized'` sets position/size to fill viewport minus taskbar
- [ ] **Write Tests**: Test transition from maximized back to cached position restores correctly (200ms ease-out)
- [ ] **Implement**: CSS classes for `.window-open` (scale 0.95→1.0 + opacity 0→1, 150ms ease-out), `.window-closing` (scale 1.0→0.95 + opacity 1→0, 120ms ease-in), `.window-minimized` (translateY slide-down + opacity, 200ms ease-in), `.window-maximized` (full viewport minus 40px), `.window-restored` (cached position, 200ms ease-out)
- [ ] **Verify Coverage**: `CI=true pnpm test:coverage`
- [ ] **Commit**: `feat(window): Add window open/close/minimize/maximize/restore with CSS transitions`

## Phase 4: Integration

_Wire the window manager into the existing desktop shell and taskbar._

### Task 10: Wire Desktop Icon Double-Click → openWindow() + Visual Feedback

- [ ] **Write Tests**: Integration test — clicking DesktopIcon dispatches `luna:open-window` CustomEvent
- [ ] **Write Tests**: Integration test — `WindowLayer` receives event and calls `openWindow()` with correct ID
- [ ] **Write Tests**: Test DesktopIcon applies brief color inversion on double-click (100ms CSS transition)
- [ ] **Implement**: Add `onclick` attribute to `DesktopIcon.astro` dispatching `new CustomEvent('luna:open-window', { detail: windowId })`. Add CSS class toggle or `filter: invert()` for 100ms on double-click
- [ ] **Verify Coverage**: `CI=true pnpm test:coverage`
- [ ] **Commit**: `feat(desktop): Wire desktop icon double-click to openWindow() with XP-style visual feedback`

### Task 11: Update Taskbar with Window Buttons & Toggle Behavior

- [ ] **Write Tests**: React component test — Taskbar renders buttons matching `$taskbarWindows`
- [ ] **Write Tests**: Test each button shows correct app icon and title text
- [ ] **Write Tests**: Test empty state (no open windows — no buttons rendered besides Start)
- [ ] **Write Tests**: Test click on focused window's button → minimize
- [ ] **Write Tests**: Test click on minimized window's button → restore + focus
- [ ] **Write Tests**: Test click on unfocused window's button → focus
- [ ] **Write Tests**: Test button visual state reflects window status (focused/minimized/normal)
- [ ] **Implement**: Update `Taskbar.tsx` — subscribe to `$taskbarWindows`, map to button elements in the center spacer area with toggle onClick logic checking `$activeWindow` and window status
- [ ] **Verify Coverage**: `CI=true pnpm test:coverage`
- [ ] **Commit**: `feat(taskbar): Add window buttons with toggle behavior (focus/minimize/restore)`

### Task 12: Mount WindowLayer in DesktopLayout

- [ ] **Write Tests**: Integration test — `DesktopLayout` includes `WindowLayer` with `client:load` directive
- [ ] **Write Tests**: Test z-index layering: wallpaper (z-0) < desktop icons (z-10) < window layer (z-20) < taskbar (z-50)
- [ ] **Implement**: Add `#window-layer` container in `index.astro` at z-20, mount `<WindowLayer client:load />`
- [ ] **Verify Coverage**: `CI=true pnpm test:coverage`
- [ ] **Commit**: `feat(layout): Mount WindowLayer component in DesktopLayout`

## Phase 5: Phase Completion Verification & Checkpointing

### Task 13: Conductor - User Manual Verification 'Window Manager' (Protocol in workflow.md)

- [ ] **Phase Checkpoint**: Run automated tests — `CI=true pnpm test:coverage` (verify ≥80% coverage)
- [ ] **Phase Checkpoint**: Verify all 12 tasks marked [x] with commit SHAs recorded
- [ ] **Phase Checkpoint**: Present manual verification plan for user sign-off
- [ ] **Phase Checkpoint**: Create checkpoint commit with git notes
