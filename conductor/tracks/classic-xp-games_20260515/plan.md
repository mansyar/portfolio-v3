# Implementation Plan: Classic XP Games

**Track ID:** `classic-xp-games_20260515`
**Status:** Approved

---

## Phase 1 — Pong (VS AI)

- [ ] **Task: Write Pong tests (Red phase)**
  - [ ] Test: Canvas renders game elements (paddles, ball, score)
  - [ ] Test: Ball-wall collision (top/bottom bounce)
  - [ ] Test: Ball-paddle collision (angle reflection)
  - [ ] Test: AI paddle tracks ball Y with configurable delay + error margin
  - [ ] Test: AI difficulty presets (Easy/Medium/Hard) produce distinct behaviors
  - [ ] Test: Score increments when ball passes a paddle
  - [ ] Test: First to 5 triggers `won`/`lost` state
  - [ ] Test: Game state transitions (`menu`→`waiting`→`playing`→`scored`→`won`/`lost`→`waiting`)
  - [ ] Test: Difficulty menu renders Easy/Medium/Hard buttons
  - [ ] Test: SPACE starts game from `waiting`; Escape closes window
  - [ ] Test: W/S and Arrow Up/Down both move the paddle
  - [ ] Test: `prefers-reduced-motion` caps ball speed at 60%
  - [ ] Test: Window minimize pauses rAF; restore resumes it
- [ ] **Task: Implement Pong.tsx (Green phase)**
  - [ ] Create `src/components/apps/Pong.tsx` with Canvas-based Pong
  - [ ] Implement game loop via `requestAnimationFrame` with delta-time
  - [ ] Implement difficulty selection menu (Easy/Medium/Hard buttons)
  - [ ] Implement player paddle (W/S + Arrow Up/Down)
  - [ ] Implement AI paddle with configurable reaction delay + error margin
  - [ ] Implement ball physics (angle reflection, wall bounce, speed increase)
  - [ ] Implement scoring (first to 5 wins)
  - [ ] Implement all game states (`menu`, `waiting`, `playing`, `scored`, `won`/`lost`)
  - [ ] Add XP-styled border, Tahoma font for all text
  - [ ] Add `prefers-reduced-motion` media query check → cap ball speed
  - [ ] Implement minimize pause/resume (rAF stop/start via useEffect)
  - [ ] Add keyboard handlers (Escape, Space, W/S, Arrows)
  - [ ] Verify: all 13 tests pass
- [ ] **Task: Create Pong desktop icon SVG**
  - [ ] Create `public/icons/pong.svg` — 48×48 XP-styled paddle + ball icon
- [ ] **Task: Conductor - User Manual Verification 'Phase 1 — Pong' (Protocol in workflow.md)**

## Phase 2 — Minesweeper (9×9 Beginner)

- [ ] **Task: Write Minesweeper tests (Red phase)**
  - [ ] Test: Board generation creates 9×9 grid with exactly 10 mines
  - [ ] Test: Flood-fill reveals all adjacent empty cells
  - [ ] Test: Win detection — all non-mine cells revealed
  - [ ] Test: Loss detection — clicking a mine reveals all mines, triggered mine in red
  - [ ] Test: Flag toggle — right-click places/removes flag
  - [ ] Test: Flagged cells cannot be revealed by left-click
  - [ ] Test: First-click guarantee — first click is never a mine
  - [ ] Test: Timer starts on first click and counts up
  - [ ] Test: Mine counter shows correct remaining mines
  - [ ] Test: Smiley face button cycles through states and restarts on click
  - [ ] Test: R key restarts game; Escape closes window
- [ ] **Task: Implement Minesweeper.tsx (Green phase)**
  - [ ] Create `src/components/apps/Minesweeper.tsx` with Canvas-based Minesweeper
  - [ ] Implement board generation (9×9, 10 mines, adjacent mine counting)
  - [ ] Implement left-click reveal + right-click flag
  - [ ] Implement flood-fill (recursive empty cell reveal)
  - [ ] Implement mine explosion animation (reveal all, red highlight)
  - [ ] Implement win/loss detection
  - [ ] Implement timer (counts up from 0) + mine counter
  - [ ] Implement canvas-drawn smiley face button (🙂😮😎💀)
  - [ ] Implement first-click safety (re-generate board if mine)
  - [ ] Add XP-styled border, Tahoma font for counters
  - [ ] Add keyboard handlers (R to restart, Escape to close)
  - [ ] Verify: all 11 tests pass
- [ ] **Task: Create Minesweeper desktop icon SVG**
  - [ ] Create `public/icons/minesweeper.svg` — 48×48 XP-styled mine icon
- [ ] **Task: Conductor - User Manual Verification 'Phase 2 — Minesweeper' (Protocol in workflow.md)**

## Phase 3 — Desktop Integration

- [ ] **Task: Register games in Window system**
  - [ ] Add `pong` and `minesweeper` to `WindowId` type in `src/stores/windows.ts`
  - [ ] Add default window configs (Pong: 600×450, pos (80,60); Minesweeper: 400×450, pos (120,80))
- [ ] **Task: Wire games into WindowLayer**
  - [ ] Import Pong and Minesweeper in `WindowLayer.tsx`
  - [ ] Add case branches in `renderContent()` for `'pong'` and `'minesweeper'`
- [ ] **Task: Add desktop icons to index.astro**
  - [ ] Add Pong and Minesweeper DesktopIcon components (below existing icons)
- [ ] **Task: Add games to Start Menu**
  - [ ] Add Pong and Minesweeper entries to pinned apps in `StartMenu.tsx`
- [ ] **Task: Register CMD commands**
  - [ ] Add `pong` command → opens Pong window
  - [ ] Add `minesweeper` command → opens Minesweeper window
- [ ] **Task: Add game styles to global.css**
  - [ ] Add game container styles (XP border, canvas sizing)
  - [ ] Add `prefers-reduced-motion` overrides if needed
- [ ] **Task: Write integration tests**
  - [ ] Test: Pong window opens from desktop icon
  - [ ] Test: Minesweeper window opens from desktop icon
  - [ ] Test: `pong` CMD command opens Pong window
  - [ ] Test: `minesweeper` CMD command opens Minesweeper window
  - [ ] Test: Both games + Explorer can coexist in window manager
  - [ ] Test: Minimize pauses game rAF; restore resumes it
- [ ] **Task: Conductor - User Manual Verification 'Phase 3 — Desktop Integration' (Protocol in workflow.md)**

---

## Modularity Contingency

- Pong.tsx should stay under 300 lines
- Minesweeper.tsx should stay under 400 lines
  - If minesweeper exceeds 450 lines, extract board logic into `src/lib/minesweeper-engine.ts`

## Docs Updated

- [ ] Update PRD.md — add §5.4 Pong and §5.5 Minesweeper app specs
- [ ] Update TDD.md — add pong/minesweeper to WindowId type, default configs, component inventory
- [ ] Update tech-stack.md — change log entry for Track 6B
