# Implementation Plan: Window Manager

## Phase 1: Window Store & Actions [checkpoint: db1fec6]

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

- [x] **Write Tests**: React component test — renders icon, title text, and 3 button controls `3a26310`
- [x] **Write Tests**: Test min/max/close buttons call correct store actions (`minimizeWindow`, `maximizeWindow`, `closeWindow`) `3a26310`
- [x] **Write Tests**: Test active vs inactive gradient based on `isActive` prop `3a26310`
- [x] **Write Tests**: Test double-click title bar calls `maximizeWindow`/`restoreWindow` `3a26310`
- [x] **Implement**: Create `src/components/window/TitleBar.tsx` with XP-style gradient, icon, title text, 16×16 min/max/close buttons `3a26310`
- [x] **Implement**: Wire button onClick handlers to store actions; active/inactive gradient switching `3a26310`
- [x] **Verify Coverage**: `CI=true pnpm test:coverage` `3a26310`
- [x] **Commit**: `feat(window): Add TitleBar component with min/max/close controls` `3a26310`

### Task 4: Create WindowFrame Component

> **Design note:** Accept the full `WindowState` object as a prop (passed from WindowLayer) rather than subscribing to `$windows` internally. This avoids redundant per-instance store subscriptions and ensures only WindowLayer is the single source of truth for iteration.

- [x] **Write Tests**: React component test — renders with 3D chrome border, rounded top corners `8eaac00`
- [x] **Write Tests**: Test applies active/inactive title bar based on `isActive` prop `8eaac00`
- [x] **Write Tests**: Test renders placeholder children content `8eaac00`
- [x] **Implement**: Create `src/components/window/WindowFrame.tsx` — `xp-window-border` class, `--xp-shadow-lg`/`--xp-shadow-sm`, TitleBar mount, content slot, accepts full `WindowState` as prop `8eaac00`
- [x] **Verify Coverage**: `CI=true pnpm test:coverage` `8eaac00`
- [x] **Commit**: `feat(window): Add WindowFrame component with 3D chrome border` `8eaac00`

### Task 5: Create WindowLayer Component

- [x] **Write Tests**: React component test — renders one `WindowFrame` per entry in `$windows` `6511f92`
- [x] **Write Tests**: Test registers CustomEvent listener for `luna:open-window` event `6511f92`
- [x] **Write Tests**: Test displays placeholder content for all 6 window types `6511f92`
- [x] **Implement**: Create `src/components/window/WindowLayer.tsx` — subscribes to `$windows`, iterates and renders `WindowFrame` for each `6511f92`
- [x] **Implement**: Add CustomEvent listener in `useEffect` for desktop icon click wiring `6511f92`
- [x] **Verify Coverage**: `CI=true pnpm test:coverage` `6511f92`
- [x] **Commit**: `feat(window): Add WindowLayer component with store subscription and event listener` `6511f92`

## Phase 3: Interaction Logic

_Implement drag, resize, z-index stacking, minimize/maximize/restore animations._

### Task 6: Implement Title Bar Drag Logic

- [x] **Write Tests**: DOM event tests — mousedown on title bar initiates drag `02a5239`
- [x] **Write Tests**: Test mousemove delta updates window position `02a5239`
- [x] **Write Tests**: Test viewport constraint (min 32px visible from any edge) `02a5239`
- [x] **Write Tests**: Test mouseup ends drag `02a5239`
- [x] **Implement**: Drag logic in `WindowLayer.tsx` — `onDragStart` prop on TitleBar, `onMouseMove`/`onMouseUp` on document with cleanup `02a5239`
- [x] **Verify Coverage**: `pnpm test:coverage` `02a5239`
- [x] **Commit**: `feat(window): Implement viewport-constrained title bar drag` `02a5239`

### Task 7: Implement Edge/Corner Resize

- [x] **Write Tests**: DOM event tests — mousedown on 8px edge/corner hit area initiates resize `36eea35`
- [x] **Write Tests**: Test all 8 resize cursors render correctly `36eea35`
- [x] **Write Tests**: Test minWidth/minHeight constraints are enforced `36eea35`
- [x] **Implement**: Resize logic — hit area detection, cursor switching, drag-based dimension updates `36eea35`
- [x] **Verify Coverage**: `pnpm test:coverage` `36eea35`
- [x] **Commit**: `feat(window): Implement edge/corner resize with min size constraints` `36eea35`

### Task 8: Implement Z-Index Stacking & Focus-on-Click

- [x] **Write Tests**: Test click anywhere in window calls `focusWindow()` `da6317c`
- [x] **Write Tests**: Test z-index values are unique and incrementing `da6317c`
- [x] **Write Tests**: Test `$activeWindow` updates correctly on focus `da6317c`
- [x] **Implement**: Click handler on WindowFrame → `focusWindow()`, dynamic zIndex style, active/inactive visual state `da6317c`
- [x] **Verify Coverage**: `pnpm test:coverage` `da6317c`
- [x] **Commit**: `feat(window): Implement z-index stacking and focus-on-click` `da6317c`

### Task 9: Implement Open/Close/Minimize/Maximize/Restore with CSS Transitions

- [x] **Write Tests**: React component test — `status='closing'` applies scale-out + fade animation class `02b0260`
- [x] **Write Tests**: Test `status='open'` with initial render applies scale-in + fade animation class `02b0260`
- [x] **Write Tests**: Test `status='minimized'` applies slide-down CSS class `02b0260`
- [x] **Write Tests**: Test `status='maximized'` sets position/size to fill viewport minus taskbar `02b0260`
- [x] **Implement**: CSS classes & keyframes for `.window-open`, `.window-closing`, `.window-minimized`, `.window-maximized` `02b0260`
- [x] **Verify Coverage**: `pnpm test:coverage` `02b0260`
- [x] **Commit**: `feat(window): Add window open/close/minimize/maximize/restore with CSS transitions` `02b0260`

## Phase 4: Integration

_Wire the window manager into the existing desktop shell and taskbar._

### Task 10: Wire Desktop Icon Double-Click → openWindow() + Visual Feedback

- [x] **Write Tests**: Integration test — DesktopIcon renders onclick handler with CustomEvent `1360f7f`
- [x] **Write Tests**: Test DesktopIcon includes ondblclick handler for visual feedback `1360f7f`
- [x] **Implement**: Add onclick dispatching `CustomEvent('luna:open-window')`; add ondblclick with `filter: invert()` toggling via `desktop-icon--active` class for 100ms `1360f7f`
- [x] **Verify Coverage**: `pnpm test:coverage` `1360f7f`
- [x] **Commit**: `feat(desktop): Wire desktop icon click to openWindow() with XP-style visual feedback` `1360f7f`

### Task 11: Update Taskbar with Window Buttons & Toggle Behavior

- [x] **Write Tests**: React component test — Taskbar renders buttons matching open windows `f209fae`
- [x] **Write Tests**: Test each button shows correct app icon and title text `f209fae`
- [x] **Write Tests**: Test empty state (no open windows — no buttons rendered besides Start) `f209fae`
- [x] **Write Tests**: Test click on focused window's button → minimize `f209fae`
- [x] **Write Tests**: Test click on minimized window's button → restore + focus `f209fae`
- [x] **Write Tests**: Test click on unfocused window's button → focus `f209fae`
- [x] **Write Tests**: Test button visual state reflects window status (focused/minimized/normal) `f209fae`
- [x] **Implement**: Update `Taskbar.tsx` — subscribe to `$taskbarWindows`/`$activeWindow`, render window buttons with toggle logic `f209fae`
- [x] **Verify Coverage**: `pnpm test:coverage` `f209fae`
- [x] **Commit**: `feat(taskbar): Add window buttons with toggle behavior (focus/minimize/restore)` `f209fae`

### Task 12: Mount WindowLayer in DesktopLayout

- [x] **Write Tests**: Integration test — `index.astro` includes `#window-layer` mount point with `client="load"` directive `5237bc7`
- [x] **Write Tests**: Test z-index layering: wallpaper (z-0) < desktop icons (z-10) < window layer (z-20) < taskbar (z-50) `5237bc7`
- [x] **Implement**: Add `#window-layer` container in `index.astro` at z-20, mount `<WindowLayer client:load />` `5237bc7`
- [x] **Verify Coverage**: `pnpm test:coverage` `5237bc7`
- [x] **Commit**: `feat(layout): Mount WindowLayer component in DesktopLayout` `5237bc7`

## Phase 5: Phase Completion Verification & Checkpointing

### Task 13: Conductor - User Manual Verification 'Window Manager' (Protocol in workflow.md)

- [x] **Phase Checkpoint**: Run automated tests — `pnpm test:coverage` — 156 tests pass, 96.94% statements, 86.73% branches (≥80%) `[current]`
- [x] **Phase Checkpoint**: Verify all 12 tasks marked [x] with commit SHAs recorded `[current]`
- [x] **Phase Checkpoint**: Present manual verification plan for user sign-off `[current]`
- [x] **Phase Checkpoint**: Create checkpoint commit with git notes `[current]`

## Phase 6: Review Fixes

- [x] **Task**: Apply review suggestions (prefers-reduced-motion, closeWindow race condition, type safety, accessibility, test cleanup) `fc6301c`
