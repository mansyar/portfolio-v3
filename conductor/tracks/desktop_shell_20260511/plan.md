# Plan: Track 1A — Desktop Shell

**Note:** Every Phase includes the required Conductor manual verification meta-task per the project workflow protocol.

---

## Phase 1: Desktop Icon SVGs

### Task 1.1: Create Custom SVG Icon Assets

- [ ] Create `public/icons/my-computer.svg` — 48×48 custom SVG inspired by XP
- [ ] Create `public/icons/my-documents.svg` — 48×48 custom SVG
- [ ] Create `public/icons/help-support.svg` — 48×48 custom SVG
- [ ] Create `public/icons/command-prompt.svg` — 48×48 custom SVG
- [ ] Create `public/icons/recycle-bin.svg` — 48×48 custom SVG
- [ ] Verify: all 5 SVG files render with correct 48×48 viewport

- [ ] Task: Conductor - User Manual Verification 'Phase 1: Desktop Icon SVGs' (Protocol in workflow.md)

---

## Phase 2: Wallpaper Component

### Task 2.1: Write Test for Wallpaper

- [ ] Write failing test (`tests/components/wallpaper.test.ts`) verifying Wallpaper.astro renders SVG/CSS art with correct z-index and full viewport coverage

### Task 2.2: Implement Wallpaper

- [ ] Create `src/components/desktop/Wallpaper.astro` — custom SVG/CSS-generated rolling hills art inspired by XP Bliss
- [ ] Ensure full-viewport coverage with responsive sizing (100vw × 100vh)
- [ ] Ensure z-index: 0 (below all interactive content)
- [ ] Run tests: confirm Wallpaper test passes (Green phase)

### Task 2.3: Mount Wallpaper in index.astro

- [ ] Import and render Wallpaper.astro into the `#wallpaper-area` mount point in `src/pages/index.astro`

- [ ] Task: Conductor - User Manual Verification 'Phase 2: Wallpaper Component' (Protocol in workflow.md)

---

## Phase 3: Desktop Icons

### Task 3.1: Write Test for DesktopIcon

- [ ] Write failing test (`tests/components/desktop-icon.test.ts`) verifying DesktopIcon renders an SVG icon + text label below it, and shows blue hover highlight

### Task 3.2: Implement DesktopIcon Component

- [ ] Create `src/components/desktop/DesktopIcon.astro` — accepts `icon` (SVG path), `label` (text), and optional `windowId` props
- [ ] Render 48×48 SVG icon with 11px label centered below
- [ ] Implement XP-style blue selection highlight on hover (using `--xp-blue-highlight` token)
- [ ] Use `--xp-icon-text-color` and `--xp-icon-text-shadow` for readable labels
- [ ] Run tests: confirm DesktopIcon test passes

### Task 3.3: Layout Icon Grid on Desktop

- [ ] Create icon grid in `src/pages/index.astro` (or a dedicated `DesktopIcons.astro` wrapper)
- [ ] Place 5 `DesktopIcon` instances in a left-aligned vertical column at `top: 16px; left: 16px`
- [ ] Icons: My Computer, My Documents, Help & Support, Command Prompt, Recycle Bin
- [ ] Use consistent spacing (16px gap between icons)
- [ ] Verify: icons render in correct position with correct labels

- [ ] Task: Conductor - User Manual Verification 'Phase 3: Desktop Icons' (Protocol in workflow.md)

---

## Phase 4: Taskbar & Clock

### Task 4.1: Write Test for Taskbar

- [ ] Write failing test (`tests/components/taskbar.test.ts`) verifying Taskbar renders with green Start button and system tray area

### Task 4.2: Implement Clock Component

- [ ] Write failing test (`tests/components/clock.test.ts`) for Clock — verifies current time displayed in HH:MM format
- [ ] Create `src/components/taskbar/Clock.tsx` — React component using useState/useEffect
- [ ] Display current time in HH:MM format, update via setInterval (60s)
- [ ] Style with XP font size (11px), aligned right in system tray
- [ ] Run tests: confirm Clock test passes

### Task 4.3: Implement Taskbar Component

- [ ] Create `src/components/taskbar/Taskbar.tsx` — React island
- [ ] Blue gradient bar: styled with Tailwind classes using `--xp-taskbar-bg` variable
- [ ] Height: 40px, full width, positioned at bottom
- [ ] Green "Start" button on the left (button element, non-functional, styled with `--xp-start-btn-green`)
- [ ] System tray area on the right, containing `<Clock />`
- [ ] 3D outset border on top edge (apply `xp-outset` class with only top border visible)
- [ ] Run tests: confirm Taskbar test passes

### Task 4.4: Mount Taskbar in index.astro

- [ ] Import and mount Taskbar in the `#taskbar` mount point with `client:load` directive
- [ ] Verify: Taskbar appears at bottom of page with Start button and live clock

- [ ] Task: Conductor - User Manual Verification 'Phase 4: Taskbar & Clock' (Protocol in workflow.md)

---

## Phase 5: Full Integration & Verification

### Task 5.1: Write Integration Tests

- [ ] Create/update `tests/pages/index.test.ts` to verify all 3 desktop elements render in built output
- [ ] Assert: wallpaper area exists with SVG art
- [ ] Assert: 5 desktop icons appear with correct labels
- [ ] Assert: taskbar with Start button and clock appears

### Task 5.2: Final Verification

- [ ] Run full test suite: `CI=true pnpm test`
- [ ] Run typecheck: `pnpm astro check`
- [ ] Run modularity check: `node scripts/check-modularity.js`
- [ ] Run build: `CI=true pnpm build`
- [ ] Run coverage: `pnpm test:coverage` (ensure ≥80%)
- [ ] Verify: `pnpm dev` serves complete XP desktop shell

- [ ] Task: Conductor - User Manual Verification 'Phase 5: Full Integration & Verification' (Protocol in workflow.md)
