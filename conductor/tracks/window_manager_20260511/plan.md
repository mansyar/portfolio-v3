# Implementation Plan: Window Manager

## Phase 1: Window Store & Actions

_Build the Nano Stores foundation with all window actions and default configurations._

### Task 1: Create Window Types, Store Schemas & Default Configs

- [ ] **Write Tests**: Unit tests for `WindowState` interface, `WindowId` type, `DEFAULT_WINDOW_CONFIGS` constant — validate all 6 window configs have correct defaults and min sizes
- [ ] **Implement**: Create `src/stores/windows.ts` with `WindowState`, `WindowId` types, and `DEFAULT_WINDOW_CONFIGS` map (positions, sizes, min constraints)
- [ ] **Implement**: Create `$windows` map, `$zCounter` atom, `$activeWindow` atom, `$taskbarWindows` derived store
- [ ] **Verify Coverage**: `CI=true pnpm test:coverage`
- [ ] **Commit**: `feat(stores): Add window state types, default configs, and Nano Store atoms`

### Task 2: Implement All Window Actions

- [ ] **Write Tests**: Unit tests for `openWindow`, `closeWindow`, `minimizeWindow`, `maximizeWindow`, `restoreWindow` — verify status transitions, z-index assignment, position caching
- [ ] **Write Tests**: Unit tests for `focusWindow`, `moveWindow`, `resizeWindow` — verify z-counter increment, viewport constraints, min size enforcement
- [ ] **Write Tests**: Edge cases — opening already-open window, closing nonexistent window, minimize from maximized state
- [ ] **Implement**: All 8 window actions in `src/stores/windows.ts` with full logic
- [ ] **Verify Coverage**: `CI=true pnpm test:coverage`
- [ ] **Commit**: `feat(stores): Implement all window actions (open/close/minimize/maximize/restore/focus/move/resize)`

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

- [ ] **Write Tests**: React component test — renders with 3D chrome border, rounded top corners
- [ ] **Write Tests**: Test applies active/inactive title bar based on `isActive` prop
- [ ] **Write Tests**: Test renders placeholder children content
- [ ] **Implement**: Create `src/components/window/WindowFrame.tsx` — `xp-window-border` class, `--xp-shadow-lg`/`--xp-shadow-sm`, TitleBar mount, content slot
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

### Task 9: Implement Minimize/Maximize/Restore with CSS Transitions

- [ ] **Write Tests**: React component test — `status='minimized'` applies CSS that hides window
- [ ] **Write Tests**: Test `status='maximized'` sets position/size to fill viewport minus taskbar
- [ ] **Write Tests**: Test transition from maximized back to cached position restores correctly
- [ ] **Implement**: CSS classes for `.window-minimized` (translateY slide-down + opacity, 200ms ease-out), `.window-maximized` (full viewport minus 40px), `.window-restored` (cached position)
- [ ] **Verify Coverage**: `CI=true pnpm test:coverage`
- [ ] **Commit**: `feat(window): Add minimize/maximize/restore with CSS transitions`

## Phase 4: Integration

_Wire the window manager into the existing desktop shell and taskbar._

### Task 10: Wire Desktop Icon Double-Click → openWindow()

- [ ] **Write Tests**: Integration test — clicking DesktopIcon dispatches `luna:open-window` CustomEvent
- [ ] **Write Tests**: Integration test — `WindowLayer` receives event and calls `openWindow()` with correct ID
- [ ] **Implement**: Add `onclick` attribute to `DesktopIcon.astro` dispatching `new CustomEvent('luna:open-window', { detail: windowId })`
- [ ] **Verify Coverage**: `CI=true pnpm test:coverage`
- [ ] **Commit**: `feat(desktop): Wire desktop icon double-click to openWindow() via CustomEvent`

### Task 11: Update Taskbar to Show Open Window Buttons

- [ ] **Write Tests**: React component test — Taskbar renders buttons matching `$taskbarWindows`
- [ ] **Write Tests**: Test each button shows correct app icon and title text
- [ ] **Write Tests**: Test empty state (no open windows — no buttons rendered besides Start)
- [ ] **Implement**: Update `Taskbar.tsx` — subscribe to `$taskbarWindows`, map to button elements in the center spacer area
- [ ] **Verify Coverage**: `CI=true pnpm test:coverage`
- [ ] **Commit**: `feat(taskbar): Show buttons for all open windows`

### Task 12: Implement Taskbar Button Toggle Behavior

- [ ] **Write Tests**: Test click on focused window's button → minimize
- [ ] **Write Tests**: Test click on minimized window's button → restore + focus
- [ ] **Write Tests**: Test click on unfocused window's button → focus
- [ ] **Write Tests**: Test button visual state reflects window status (focused/minimized/normal)
- [ ] **Implement**: Toggle logic in Taskbar button onClick — check `$activeWindow` and window status to determine action
- [ ] **Verify Coverage**: `CI=true pnpm test:coverage`
- [ ] **Commit**: `feat(taskbar): Implement window button toggle behavior`

### Task 13: Mount WindowLayer in DesktopLayout

- [ ] **Write Tests**: Integration test — `DesktopLayout` includes `WindowLayer` with `client:load` directive
- [ ] **Write Tests**: Test z-index layering: wallpaper (z-0) < desktop icons (z-10) < window layer (z-20) < taskbar (z-50)
- [ ] **Implement**: Add `#window-layer` container in `index.astro` at z-20, mount `<WindowLayer client:load />`
- [ ] **Verify Coverage**: `CI=true pnpm test:coverage`
- [ ] **Commit**: `feat(layout): Mount WindowLayer component in DesktopLayout`

## Phase 5: Phase Completion Verification & Checkpointing

### Task 14: Conductor - User Manual Verification 'Window Manager' (Protocol in workflow.md)

- [ ] **Phase Checkpoint**: Run automated tests — `CI=true pnpm test:coverage` (verify ≥80% coverage)
- [ ] **Phase Checkpoint**: Verify all 13 tasks marked [x] with commit SHAs recorded
- [ ] **Phase Checkpoint**: Present manual verification plan for user sign-off
- [ ] **Phase Checkpoint**: Create checkpoint commit with git notes
