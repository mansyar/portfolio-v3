# Implementation Plan: Start Menu (Track 1C)

## Phase 1: Start Menu Store & Desktop Store

### Task 1: Create Desktop Store with Start Menu State

- [x] **Write Tests**: Unit tests for `$startMenuOpen` atom — verify initial value is `false`, `toggleStartMenu()` flips state, `openStartMenu()` sets `true`, `closeStartMenu()` sets `false`
- [x] **Implement**: Create `src/stores/desktop.ts` with `$startMenuOpen` atom, `toggleStartMenu()`, `openStartMenu()`, `closeStartMenu()` actions
- [x] **Verify Coverage**: `CI=true pnpm test:coverage`
- [x] **Commit**: `feat(stores): Add desktop store with Start Menu open/close state` + git note
- [x] **Update Plan**: Mark task complete with commit SHA `f22b27b`
- [ ] **Commit Plan**: `conductor(plan): Mark task 'Create Desktop Store with Start Menu State' as complete`

### Task 2: Conductor - User Manual Verification 'Phase 1' (Protocol in workflow.md)

---

## Phase 2: StartMenu Component

### Task 3: Create 16×16 Start Menu Icon Assets

- [ ] **Implement**: Add reusable CSS class (`.startmenu-icon`) that resizes existing 48×48 desktop icons from `public/icons/` to 16×16 for Start Menu items. No new SVG files needed — the existing icon set is reused at reduced scale.
- [ ] **Verify**: Check that each Start Menu item renders its icon at 16×16 without distortion
- [ ] **Commit**: `feat(taskbar): Add CSS utility for Start Menu 16×16 icon sizing` + git note
- [ ] **Update Plan**: Mark task complete with commit SHA
- [ ] **Commit Plan**: `conductor(plan): Mark task 'Create 16×16 Start Menu Icon Assets' as complete`

### Task 4: Write StartMenu Component Tests (Red Phase)

- [ ] **Write Tests**: Create `tests/start-menu.test.tsx` following the same **dynamic-import + `cleanup()` + `beforeEach` pattern** as `tests/taskbar.test.tsx`:
  - Renders the Start Menu when `$startMenuOpen` is `true`
  - Does not render when `$startMenuOpen` is `false`
  - Shows blue header with "MARP" initials avatar and "Ansyar Muh Amrulloh" name
  - Left column shows all 4 pinned app items with correct labels
  - Right column shows all 4 system folder items with correct labels
  - Shows "Shut Down..." button in bottom bar
  - Tab key cycles through menu items with visible focus indicator
  - Enter activates the focused menu item
- [ ] **Run Tests**: Confirm tests fail (Red phase)
- [ ] **Commit**: `test(taskbar): Add StartMenu component tests` + git note
- [ ] **Update Plan**: Mark task complete with commit SHA
- [ ] **Commit Plan**: `conductor(plan): Mark task 'Write StartMenu Component Tests' as complete`

### Task 5: Implement StartMenu Layout (Green Phase)

- [ ] **Implement**: Create `src/components/taskbar/StartMenu.tsx` with:
  - Blue gradient header bar using `--xp-start-header-blue` CSS token, "MARP" initials avatar circle + "Ansyar Muh Amrulloh" name
  - Left column (`--xp-start-left-bg`): Resume, Explorer, Task Manager, Command Prompt (existing icon at 16×16 + label)
  - Right column (`--xp-start-right-bg`): My Documents, My Computer, Control Panel, Help & Support (existing icon at 16×16 + label)
  - Bottom divider using `--xp-start-separator` + "Shut Down..." button with power icon
  - Width: `--xp-startmenu-width` (320px)
  - `role="menu"` ARIA role with `aria-activedescendant` and `tabindex="0"` on container
- [ ] **Verify Tests**: Run tests, confirm all pass (Green phase)
- [ ] **Verify Coverage**: `CI=true pnpm test:coverage`
- [ ] **Commit**: `feat(taskbar): Implement StartMenu two-column layout component` + git note
- [ ] **Update Plan**: Mark task complete with commit SHA
- [ ] **Commit Plan**: `conductor(plan): Mark task 'Implement StartMenu Layout' as complete`

### Task 6: Wire Menu Items to Window Actions + Keyboard Navigation

- [ ] **Write Tests**:
  - Clicking each menu item dispatches `openWindow()` with correct WindowId and calls `closeStartMenu()`
  - Tab key moves focus to next menu item
  - Shift+Tab moves focus to previous menu item
  - Enter on focused item activates it (opens window + closes menu)
- [ ] **Implement**:
  - Wire each menu item's `onClick` to call `openWindow(id)` then `closeStartMenu()`
    - Resume → `openWindow('mydocs')`
    - Explorer / My Computer → `openWindow('explorer')`
    - Task Manager / Control Panel → `openWindow('taskmanager')`
    - Command Prompt → `openWindow('cmd')`
    - My Documents → `openWindow('mydocs')`
    - Help & Support → `openWindow('help')`
  - Implement Tab/Shift+Tab keyboard focus cycling via `onKeyDown` handler tracking `aria-activedescendant` index
  - Enter key on focused item triggers its action (same as click)
- [ ] **Verify Tests**: Confirm all pass
- [ ] **Verify Coverage**: `CI=true pnpm test:coverage`
- [ ] **Commit**: `feat(taskbar): Wire Start Menu items to window actions and add keyboard nav` + git note
- [ ] **Update Plan**: Mark task complete with commit SHA
- [ ] **Commit Plan**: `conductor(plan): Mark task 'Wire Menu Items to Window Actions + Keyboard Nav' as complete`

### Task 7: Conductor - User Manual Verification 'Phase 2' (Protocol in workflow.md)

---

## Phase 3: Taskbar Integration, Animations & Shutdown Overlay

### Task 8: Wire Start Button & Click-Outside/Escape Handling

- [ ] **Write Tests**:
  - Clicking Start button calls `toggleStartMenu()`
  - Start button shows pressed class when menu is open
  - `mousedown` outside menu calls `closeStartMenu()`
  - Escape keydown calls `closeStartMenu()`
- [ ] **Implement**:
  - Modify `Taskbar.tsx` — Start button calls `toggleStartMenu()`, adds active class based on `$startMenuOpen`
  - Add `useEffect` in `StartMenu.tsx` for click-outside detection and Escape key handler
  - Mount `StartMenu` inside `Taskbar.tsx` (rendered above the taskbar bar, positioned fixed at bottom-left)
- [ ] **Verify Tests**: Confirm all pass
- [ ] **Verify Coverage**: `CI=true pnpm test:coverage`
- [ ] **Commit**: `feat(taskbar): Wire Start button toggle and add click-outside/Escape close` + git note
- [ ] **Update Plan**: Mark task complete with commit SHA
- [ ] **Commit Plan**: `conductor(plan): Mark task 'Wire Start Button & Click-Outside/Escape Handling' as complete`

### Task 9: Add Start Menu Animations

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

### Task 10: Implement Shutdown / Goodbye Overlay

- [ ] **Write Tests**: Create `tests/shutdown-overlay.test.tsx` with:
  - Renders dark shutdown overlay with "Windows is shutting down..." text when triggered
  - Shows an indeterminate animated progress bar
  - Auto-dismisses and restores desktop after full sequence (~6s total)
  - Does not render when not triggered
  - Cleanup: component unmount clears timeouts
- [ ] **Implement**: Create Shutdown overlay component inline in `StartMenu.tsx`:
  - **Phase 1 (0-3s):** Full-screen dark overlay fading in over 500ms, "Windows is shutting down..." centered text (Tahoma, white), indeterminate progress bar (XP blue gradient, smooth scroll)
  - **Phase 2 (3-4s):** Fade to solid black over 1 second
  - **Phase 3 (4-6s):** Hold black for 2 seconds, then remove overlay (simulates reboot back to desktop)
  - **Note:** NOT a BSOD — BSOD visual is reserved for the 404 error page (TDD §11 / Track 4C). This is an authentic XP "Windows is shutting down" experience.
  - Respects `prefers-reduced-motion` (skip animations, instant transitions)
- [ ] **Wire**: "Shut Down..." button click triggers overlay state
- [ ] **Verify Tests**: Confirm all pass
- [ ] **Verify Coverage**: `CI=true pnpm test:coverage`
- [ ] **Commit**: `feat(taskbar): Implement Shut Down XP-style shutdown overlay with auto-reboot` + git note
- [ ] **Update Plan**: Mark task complete with commit SHA
- [ ] **Commit Plan**: `conductor(plan): Mark task 'Implement Shutdown / Goodbye Overlay' as complete`

### Task 11: Conductor - User Manual Verification 'Phase 3' (Protocol in workflow.md)
