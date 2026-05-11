# Implementation Plan: Start Menu (Track 1C)

## Phase 1: Start Menu Store & Desktop Store

### Task 1: Create Desktop Store with Start Menu State

- [ ] **Write Tests**: Unit tests for `$startMenuOpen` atom — verify initial value is `false`, `toggleStartMenu()` flips state, `openStartMenu()` sets `true`, `closeStartMenu()` sets `false`
- [ ] **Implement**: Create `src/stores/desktop.ts` with `$startMenuOpen` atom, `toggleStartMenu()`, `openStartMenu()`, `closeStartMenu()` actions
- [ ] **Verify Coverage**: `CI=true pnpm test:coverage`
- [ ] **Commit**: `feat(stores): Add desktop store with Start Menu open/close state` + git note
- [ ] **Update Plan**: Mark task complete with commit SHA
- [ ] **Commit Plan**: `conductor(plan): Mark task 'Create Desktop Store with Start Menu State' as complete`

### Task 2: Conductor - User Manual Verification 'Phase 1' (Protocol in workflow.md)

---

## Phase 2: StartMenu Component

### Task 3: Write StartMenu Component Tests (Red Phase)

- [ ] **Write Tests**: Create `tests/start-menu.test.tsx` with:
  - Renders the Start Menu when `$startMenuOpen` is `true`
  - Does not render when `$startMenuOpen` is `false`
  - Shows blue header with "MARP" initials avatar and "Ansyar Muh Amrulloh" name
  - Left column shows all 4 pinned app items with correct labels
  - Right column shows all 4 system folder items with correct labels
  - Shows "Shut Down..." button in bottom bar
  - Clicking a menu item calls `openWindow()` with correct WindowId and closes menu
  - Clicking outside the menu calls `closeStartMenu()`
  - Pressing Escape calls `closeStartMenu()`
- [ ] **Run Tests**: Confirm tests fail (Red phase)
- [ ] **Commit**: `test(taskbar): Add StartMenu component tests` + git note
- [ ] **Update Plan**: Mark task complete with commit SHA
- [ ] **Commit Plan**: `conductor(plan): Mark task 'Write StartMenu Component Tests' as complete`

### Task 4: Implement StartMenu Layout (Green Phase)

- [ ] **Implement**: Create `src/components/taskbar/StartMenu.tsx` with:
  - Blue gradient header bar with "MARP" initials avatar circle + "Ansyar Muh Amrulloh" name
  - Left column: Resume, Explorer, Task Manager, Command Prompt (16×16 icon + label)
  - Right column: My Documents, My Computer, Control Panel, Help & Support (16×16 icon + label)
  - Gray divider + "Shut Down..." button with power icon in bottom bar
  - Column backgrounds: white left, light blue right (XP classic)
  - `role="menu"` ARIA role
- [ ] **Verify Tests**: Run tests, confirm all pass (Green phase)
- [ ] **Verify Coverage**: `CI=true pnpm test:coverage`
- [ ] **Commit**: `feat(taskbar): Implement StartMenu two-column layout component` + git note
- [ ] **Update Plan**: Mark task complete with commit SHA
- [ ] **Commit Plan**: `conductor(plan): Mark task 'Implement StartMenu Layout' as complete`

### Task 5: Wire Menu Items to Window Actions

- [ ] **Write Tests**: Test that clicking each menu item dispatches `openWindow()` with correct WindowId and calls `closeStartMenu()`
- [ ] **Implement**: Wire each menu item's `onClick` to call `openWindow(id)` then `closeStartMenu()`
  - Resume → `openWindow('mydocs')`
  - Explorer / My Computer → `openWindow('explorer')`
  - Task Manager / Control Panel → `openWindow('taskmanager')`
  - Command Prompt → `openWindow('cmd')`
  - My Documents → `openWindow('mydocs')`
  - Help & Support → `openWindow('help')`
- [ ] **Verify Tests**: Confirm all pass
- [ ] **Verify Coverage**: `CI=true pnpm test:coverage`
- [ ] **Commit**: `feat(taskbar): Wire Start Menu items to window open actions` + git note
- [ ] **Update Plan**: Mark task complete with commit SHA
- [ ] **Commit Plan**: `conductor(plan): Mark task 'Wire Menu Items to Window Actions' as complete`

### Task 6: Conductor - User Manual Verification 'Phase 2' (Protocol in workflow.md)

---

## Phase 3: Taskbar Integration, Animations & BSOD

### Task 7: Wire Start Button & Click-Outside/Escape Handling

- [ ] **Write Tests**:
  - Clicking Start button calls `toggleStartMenu()`
  - Start button shows pressed class when menu is open
  - `mousedown` outside menu calls `closeStartMenu()`
  - Escape keydown calls `closeStartMenu()`
- [ ] **Implement**:
  - Modify `Taskbar.tsx` — Start button calls `toggleStartMenu()`, adds active class based on `$startMenuOpen`
  - Add `useEffect` in `StartMenu.tsx` for click-outside detection and Escape key handler
  - Mount `StartMenu` in the Taskbar area (above the taskbar, positioned fixed at bottom-left)
- [ ] **Verify Tests**: Confirm all pass
- [ ] **Verify Coverage**: `CI=true pnpm test:coverage`
- [ ] **Commit**: `feat(taskbar): Wire Start button toggle and add click-outside/Escape close` + git note
- [ ] **Update Plan**: Mark task complete with commit SHA
- [ ] **Commit Plan**: `conductor(plan): Mark task 'Wire Start Button & Click-Outside/Escape Handling' as complete`

### Task 8: Add Start Menu Animations

- [ ] **Write Tests**:
  - Menu has correct animation class when open (slide-up)
  - Menu has correct animation class when closing (slide-down)
- [ ] **Implement**:
  - Add CSS animation classes for Start Menu slide-up (150ms ease-out) and slide-down (100ms ease-in)
  - Add `@keyframes startMenuOpen` and `@keyframes startMenuClose` to `global.css`
  - Add `prefers-reduced-motion: reduce` override
- [ ] **Verify Tests**: Confirm all pass
- [ ] **Verify Coverage**: `CI=true pnpm test:coverage`
- [ ] **Commit**: `feat(taskbar): Add Start Menu slide-up/down animations` + git note
- [ ] **Update Plan**: Mark task complete with commit SHA
- [ ] **Commit Plan**: `conductor(plan): Mark task 'Add Start Menu Animations' as complete`

### Task 9: Implement BSOD / Goodbye Overlay

- [ ] **Write Tests**: Create `tests/bsod-overlay.test.tsx` with:
  - Renders full-screen blue overlay with error text when triggered
  - Auto-dismisses after 4 seconds
  - Does not render when not triggered
- [ ] **Implement**: Create BSOD overlay component (inline in `StartMenu.tsx`):
  - Full-screen `#0000aa` blue background with white monospace text
  - STOP error message with technical details
  - Auto-dismiss via `setTimeout` after 4 seconds (fade to black)
  - Cleanup timeout on unmount
- [ ] **Wire**: "Shut Down..." button click triggers BSOD state
- [ ] **Verify Tests**: Confirm all pass
- [ ] **Verify Coverage**: `CI=true pnpm test:coverage`
- [ ] **Commit**: `feat(taskbar): Implement Shut Down BSOD overlay` + git note
- [ ] **Update Plan**: Mark task complete with commit SHA
- [ ] **Commit Plan**: `conductor(plan): Mark task 'Implement BSOD / Goodbye Overlay' as complete`

### Task 10: Conductor - User Manual Verification 'Phase 3' (Protocol in workflow.md)
