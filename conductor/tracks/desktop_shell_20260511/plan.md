# Plan: Track 1A — Desktop Shell

**Note:** Every Phase includes the required Conductor manual verification meta-task per the project workflow protocol.

---

## Phase 1: Desktop Icon SVGs [checkpoint: 12162cb]

### Task 1.1: Create Custom SVG Icon Assets

- [x] Create `public/icons/my-computer.svg` — 48×48 custom SVG inspired by XP
- [x] Create `public/icons/my-documents.svg` — 48×48 custom SVG
- [x] Create `public/icons/help-support.svg` — 48×48 custom SVG
- [x] Create `public/icons/command-prompt.svg` — 48×48 custom SVG
- [x] Create `public/icons/recycle-bin.svg` — 48×48 custom SVG
- [x] Verify: all 5 SVG files render with correct 48×48 viewport `0a3bbf5`

- [x] Task: Conductor - User Manual Verification 'Phase 1: Desktop Icon SVGs' (Protocol in workflow.md) `12162cb`

---

## Phase 2: CSS Foundation Additions [checkpoint: 835d282]

> **Rationale:** The `xp-theme.css` is missing two gradient tokens defined in TDD §5.1 (`--xp-taskbar-bg`, `--xp-start-btn-green`) needed by the Taskbar. A top-edge-only border utility must also be created since `.xp-outset` applies a full perimeter border.

### Task 2.1: Add Missing XP Gradient Tokens

- [x] Add `--xp-taskbar-bg: linear-gradient(180deg, #1f3f7d 0%, #3068b6 3%, #1b54a3 6%, #1b54a3 94%, #163d82 100%)` to `:root` in `xp-theme.css` `25e11fb`
- [x] Add `--xp-start-btn-green: linear-gradient(180deg, #3b8f3f 0%, #47a84c 8%, #2d8e33 92%, #1e7a24 100%)` to `:root` in `xp-theme.css`
- [x] Verify: both tokens are accessible via `var(--xp-taskbar-bg)` and `var(--xp-start-btn-green)` in the browser

### Task 2.2: Create Taskbar Border Utility

- [x] Add `.xp-taskbar-border` class to `xp-theme.css` — applies outset colors (white top/left, shadow bottom/right) only to `border-top`
- [x] Match border color values to the existing `.xp-outset` top/left/right/bottom values
- [x] Verify: `.xp-taskbar-border` is a distinct, reusable class that doesn't conflict with `.xp-outset`

- [x] Task: Conductor - User Manual Verification 'Phase 2: CSS Foundation Additions' (Protocol in workflow.md) `835d282`

---

## Phase 3: Wallpaper Component [checkpoint: 26268be]

### Task 3.1: Write Test for Wallpaper

- [x] Write failing test (`tests/wallpaper.test.ts`) — Red phase confirmed: 5/5 tests fail as expected

### Task 3.2: Implement Wallpaper

- [x] Create `src/components/desktop/Wallpaper.astro` — custom SVG/CSS-generated rolling hills art inspired by XP Bliss `bac7b18`
- [x] Accept optional `imageSrc` prop for future fallback to a real bitmap wallpaper in `public/wallpapers/`
- [x] Ensure full-viewport coverage with responsive sizing (w-screen × h-screen)
- [x] Ensure z-index: 0 (below all interactive content)
- [x] Run tests: confirm Wallpaper test passes (Green phase) — 41/41 tests pass

### Task 3.3: Mount Wallpaper in index.astro

- [x] Import and render Wallpaper.astro into the `#wallpaper-area` mount point in `src/pages/index.astro`

- [x] Task: Conductor - User Manual Verification 'Phase 3: Wallpaper Component' (Protocol in workflow.md) `26268be`

---

## Phase 4: Desktop Icons [checkpoint: 8193507]

### Task 4.1: Write Test for DesktopIcon

- [x] Write failing test (`tests/desktop-icon.test.ts`) — Red phase confirmed: 7/7 tests fail as expected

### Task 4.2: Implement DesktopIcon Component

- [x] Create `src/components/desktop/DesktopIcon.astro` — accepts `icon` (SVG path), `label` (text), and `windowId` (string) props `6224a37`
- [x] Render 48×48 SVG icon with 11px label centered below
- [x] Include `data-window-id={windowId}` attribute on the container (e.g., `"cmd"`, `"explorer"`, `"help"`, `"mydocs"`, `"recyclebin"`)
- [x] Include `data-window-label={label}` attribute (e.g., `"Command Prompt"`, `"My Computer"`)
- [x] Implement XP-style blue selection highlight on hover (using `--xp-blue-highlight` token)
- [x] Use `--xp-icon-text-color` and `--xp-icon-text-shadow` for readable labels
- [x] Run tests: confirm DesktopIcon test passes — 48/48 tests pass

### Task 4.3: Layout Icon Grid on Desktop

- [x] Create icon grid in `src/pages/index.astro` (inline, within `#desktop-icons` container)
- [x] Place 5 `DesktopIcon` instances in a left-aligned vertical column at `left: 16px; top: 16px`
- [x] Icons: My Computer (`windowId="explorer"`), My Documents (`windowId="mydocs"`), Help & Support (`windowId="help"`), Command Prompt (`windowId="cmd"`), Recycle Bin (`windowId="recyclebin"`)
- [x] Use consistent spacing (16px gap between icons)
- [x] Verify: icons render in correct position with correct labels and data attributes

- [x] Task: Conductor - User Manual Verification 'Phase 4: Desktop Icons' (Protocol in workflow.md) `8193507`

---

## Phase 5: Taskbar & Clock

> **Note:** Task ordering follows TDD — Clock is implemented first so the Taskbar test can assert Clock renders inside the system tray.

### Task 5.1: Write Test for Clock

- [ ] Write failing test (`tests/clock.test.ts`) for Clock — verifies current time displayed in HH:MM format and updates every 60 seconds

### Task 5.2: Implement Clock Component

- [ ] Create `src/components/taskbar/Clock.tsx` — React component using useState/useEffect
- [ ] Display current time in HH:MM format, update via setInterval (60s)
- [ ] Style with XP font size (11px), aligned right in system tray
- [ ] Run tests: confirm Clock test passes

### Task 5.3: Write Test for Taskbar

- [ ] Write failing test (`tests/taskbar.test.ts`) verifying Taskbar renders with green Start button, top-edge-only outset border, and Clock component in system tray

### Task 5.4: Implement Taskbar Component

- [ ] Create `src/components/taskbar/Taskbar.tsx` — React island
- [ ] Blue gradient bar: styled using `var(--xp-taskbar-bg)` token (added in Phase 2)
- [ ] Height: 40px, full width, positioned at bottom
- [ ] Green "Start" button on the left (button element, non-functional, styled with `var(--xp-start-btn-green)` from Phase 2)
- [ ] System tray area on the right, containing `<Clock />`
- [ ] Top-edge-only 3D outset border using `.xp-taskbar-border` class (created in Phase 2)
- [ ] ARIA role: `role="toolbar"` with `aria-label="Taskbar"`
- [ ] Start button ARIA: `aria-label="Start"` (non-functional, but accessible)
- [ ] Run tests: confirm Taskbar test passes

### Task 5.5: Mount Taskbar in index.astro

- [ ] Import and mount Taskbar in the `#taskbar` mount point with `client:load` directive
- [ ] Verify: Taskbar appears at bottom of page with Start button and live clock

- [ ] Task: Conductor - User Manual Verification 'Phase 5: Taskbar & Clock' (Protocol in workflow.md)

---

## Phase 6: Full Integration & Verification

### Task 6.1: Write Integration Tests

- [ ] Update `tests/pages/index.test.ts` to verify all 3 desktop elements render in built output
- [ ] Assert: wallpaper area exists with SVG art
- [ ] Assert: 5 desktop icons appear with correct labels and `data-window-id` attributes
- [ ] Assert: taskbar with Start button and clock appears

### Task 6.2: Final Verification

- [ ] Run full test suite: `CI=true pnpm test`
- [ ] Run typecheck: `pnpm astro check`
- [ ] Run modularity check: `node scripts/check-modularity.js`
- [ ] Run build: `CI=true pnpm build`
- [ ] Run coverage: `pnpm test:coverage` (ensure ≥80%)
- [ ] Verify: `pnpm dev` serves complete XP desktop shell

- [ ] Task: Conductor - User Manual Verification 'Phase 6: Full Integration & Verification' (Protocol in workflow.md)
