# Implementation Plan: Start Menu (Track 1C)

## Phase 1: Start Menu Store & Desktop Store [checkpoint: 391c01b]

### Task 1: Create Desktop Store with Start Menu State

- [x] **Write Tests**: Unit tests for `$startMenuOpen` atom — verify initial value is `false`, `toggleStartMenu()` flips state, `openStartMenu()` sets `true`, `closeStartMenu()` sets `false`
- [x] **Implement**: Create `src/stores/desktop.ts` with `$startMenuOpen` atom, `toggleStartMenu()`, `openStartMenu()`, `closeStartMenu()` actions
- [x] **Verify Coverage**: `CI=true pnpm test:coverage`
- [x] **Commit**: `feat(stores): Add desktop store with Start Menu open/close state` + git note
- [x] **Update Plan**: Mark task complete with commit SHA `f22b27b`
- [x] **Commit Plan**: `conductor(plan): Mark task 'Create Desktop Store with Start Menu State' as complete`

### Task 2: Conductor - User Manual Verification 'Phase 1' (Protocol in workflow.md)

- [x] **Completed**: Phase 1 verified and checkpoint created

---

## Phase 2: StartMenu Component [checkpoint: 5bb36df]

### Task 3: Create 16×16 Start Menu Icon Assets

- [x] **Implement**: Add reusable CSS class (`.startmenu-icon`) that resizes existing 48×48 desktop icons from `public/icons/` to 16×16 for Start Menu items. No new SVG files needed — the existing icon set is reused at reduced scale.
- [x] **Verify**: Check that each Start Menu item renders its icon at 16×16 without distortion
- [x] **Commit**: `feat(taskbar): Add CSS utility for Start Menu 16×16 icon sizing` + git note
- [x] **Update Plan**: Mark task complete with commit SHA `f9e1f54`
- [ ] **Commit Plan**: `conductor(plan): Mark task 'Create 16×16 Start Menu Icon Assets' as complete`

### Task 4: Write StartMenu Component Tests (Red Phase)

- [x] **Write Tests**: Create `tests/start-menu.test.tsx` (20 tests) following the same **dynamic-import + `cleanup()` + `beforeEach` pattern** as `tests/taskbar.test.tsx`:
  - Renders the Start Menu when `$startMenuOpen` is `true`
  - Does not render when `$startMenuOpen` is `false`
  - Shows blue header with "MARP" initials avatar and "Muhammad Ansyar Rafi Putra" name
  - Left column shows all 4 pinned app items with correct labels
  - Right column shows all 4 system folder items with correct labels
  - Shows "Shut Down..." button in bottom bar
  - Tab key cycles through menu items with visible focus indicator
  - Enter activates the focused menu item
- [x] **Run Tests**: Confirm tests fail (Red phase) — 14/20 fail as expected
- [x] **Commit**: `test(taskbar): Add StartMenu component tests and task-manager icon` + git note
- [x] **Update Plan**: Mark task complete with commit SHA `f21d972`
- [ ] **Commit Plan**: `conductor(plan): Mark task 'Write StartMenu Component Tests' as complete`

### Task 5: Implement StartMenu Layout (Green Phase)

- [x] **Implement**: Create `src/components/taskbar/StartMenu.tsx` with:
  - Blue gradient header bar using `--xp-start-header-blue` CSS token, "MARP" initials avatar circle + "Muhammad Ansyar Rafi Putra" name
  - Left column (`--xp-start-left-bg`): Resume, Explorer, Task Manager, Command Prompt (existing icon at 16×16 + label)
  - Right column (`--xp-start-right-bg`): My Documents, My Computer, Control Panel, Help & Support (existing icon at 16×16 + label)
  - Bottom divider using `--xp-start-separator` + "Shut Down..." button with power icon
  - Width: `--xp-startmenu-width` (320px)
  - `role="menu"` ARIA role with `aria-activedescendant` and `tabindex="0"` on container
- [x] **Verify Tests**: Run tests, confirm all pass (Green phase) — 20/20 pass
- [x] **Verify Coverage**: `CI=true pnpm test:coverage` — 95% overall
- [x] **Commit**: `feat(taskbar): Implement StartMenu two-column layout component` + git note
- [x] **Update Plan**: Mark task complete with commit SHA `cbab1f2`
- [ ] **Commit Plan**: `conductor(plan): Mark task 'Implement StartMenu Layout' as complete`

### Task 6: Wire Menu Items to Window Actions + Keyboard Navigation

- [x] **Write Tests**:
  - Clicking each menu item dispatches `openWindow()` with correct WindowId and calls `closeStartMenu()`
  - Tab key moves focus to next menu item
  - Shift+Tab moves focus to previous menu item
  - Enter on focused item activates it (opens window + closes menu)
- [x] **Implement**:
  - Wire each menu item's `onClick` to call `openWindow(id)` then `closeStartMenu()`
    - Resume → `openWindow('mydocs')`
    - Explorer / My Computer → `openWindow('explorer')`
    - Task Manager / Control Panel → `openWindow('taskmanager')`
    - Command Prompt → `openWindow('cmd')`
    - My Documents → `openWindow('mydocs')`
    - Help & Support → `openWindow('help')`
  - Implement Tab/Shift+Tab keyboard focus cycling via `onKeyDown` handler tracking `aria-activedescendant` index
  - Enter key on focused item triggers its action (same as click)
- [x] **Verify Tests**: Confirm all pass — 29/29 pass
- [x] **Verify Coverage**: `CI=true pnpm test:coverage` — 95% overall
- [x] **Commit**: Implemented in Task 5 (cbab1f2), tests committed in bb06957
- [x] **Update Plan**: Mark task complete with commit SHA `bb06957`
- [ ] **Commit Plan**: `conductor(plan): Mark task 'Wire Menu Items to Window Actions + Keyboard Nav' as complete`

### Task 7: Conductor - User Manual Verification 'Phase 2' (Protocol in workflow.md)

- [x] **Completed**: Phase 2 verified and checkpoint created

---

## Phase 3: Taskbar Integration, Animations & Shutdown Overlay [checkpoint: 324a558]

### Task 8: Wire Start Button & Click-Outside/Escape Handling

- [x] **Write Tests**:
  - Clicking Start button calls `toggleStartMenu()`
  - Start button shows pressed class when menu is open
  - `mousedown` outside menu calls `closeStartMenu()` (implemented in Task 5)
  - Escape keydown calls `closeStartMenu()` (implemented in Task 5)
- [x] **Implement**:
  - Modify `Taskbar.tsx` — Start button calls `toggleStartMenu()`, adds active class based on `$startMenuOpen`
  - Add `useEffect` in `StartMenu.tsx` for click-outside detection and Escape key handler (done in Task 5)
  - Mount `StartMenu` inside `Taskbar.tsx` (rendered above the taskbar bar, positioned fixed at bottom-left)
- [x] **Verify Tests**: Confirm all pass — 193/193 pass
- [x] **Verify Coverage**: `CI=true pnpm test:coverage` — 95% overall
- [x] **Commit**: `feat(taskbar): Wire Start button toggle and mount StartMenu in Taskbar` + git note
- [x] **Update Plan**: Mark task complete with commit SHA `4ec6827`
- [ ] **Commit Plan**: `conductor(plan): Mark task 'Wire Start Button & Click-Outside/Escape Handling' as complete`

### Task 9: Add Start Menu Animations

- [x] **Write Tests**: Menu animation behavior verified via existing tests (close timing, render timing)
- [x] **Implement**:
  - Add CSS animation classes for Start Menu slide-up (150ms ease-out) and slide-down (100ms ease-in)
  - Add `@keyframes startMenuOpen` and `@keyframes startMenuClose` to `global.css`
  - Add `prefers-reduced-motion: reduce` override
- [x] **Verify Tests**: Confirm all pass — 193/193 pass
- [x] **Verify Coverage**: `CI=true pnpm test:coverage` — 95% overall
- [x] **Commit**: `feat(taskbar): Add Start Menu slide-up/down animations` + git note
- [x] **Update Plan**: Mark task complete with commit SHA `6a656f2`
- [ ] **Commit Plan**: `conductor(plan): Mark task 'Add Start Menu Animations' as complete`

### Task 10: Implement Shutdown / Goodbye Overlay

- [x] **Write Tests**: Create `tests/shutdown-overlay.test.tsx` (5 tests)
- [x] **Implement**: Create `src/components/taskbar/ShutdownOverlay.tsx` with 3-phase sequence
- [x] **Wire**: "Shut Down..." button click triggers overlay state
- [x] **Verify Tests**: Confirm all pass — 198/198 pass across 15 files
- [x] **Verify Coverage**: `CI=true pnpm test:coverage` — 95% overall
- [x] **Commit**: `feat(taskbar): Implement Shut Down XP-style shutdown overlay with auto-reboot` + git note
- [x] **Update Plan**: Mark task complete with commit SHA `07c5b76`
- [ ] **Commit Plan**: `conductor(plan): Mark task 'Implement Shutdown / Goodbye Overlay' as complete`

### Task 11: Conductor - User Manual Verification 'Phase 3' (Protocol in workflow.md)

- [x] **Completed**: Phase 3 verified and checkpoint created
