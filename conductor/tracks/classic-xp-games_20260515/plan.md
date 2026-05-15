# Implementation Plan: Classic XP Games

**Track ID:** `classic-xp-games_20260515`
**Status:** Approved

---

## Phase 1 — Pong (VS AI)

- [x] **Task: Create shared canvas test infrastructure** [9b903bf]
  - [x] Create `tests/canvas-helpers.ts` — `mockCanvasContext()` utility that stubs `HTMLCanvasElement.prototype.getContext` for jsdom (following `canvas-graph.test.tsx` precedent)
  - [x] Export a reusable `mockCtx` object with all needed canvas methods (beginPath, moveTo, lineTo, stroke, fillRect, fillText, arc, etc.)
- [x] **Task: Extract Pong physics engine** [9b903bf]
  - [x] Create `src/lib/pong-physics.ts` with pure functions:
    - [x] `checkBallWallCollision(ball, canvasHeight)` — top/bottom bounce detection
    - [x] `checkBallPaddleCollision(ball, paddle)` — angle reflection, no canvas dependency
    - [x] `updateAIPaddle(aiPaddle, ball, difficulty, deltaTime)` — tracking with delay + error margin
    - [x] `getDifficultyConfig(difficulty: 'easy'|'medium'|'hard')` — returns delay/error values
    - [x] `checkScored(ball, canvasWidth)` — returns 'left' | 'right' | null
    - [x] `resetBall()` — center ball with random direction
  - [x] Write isolated unit tests for each pure function (no canvas, no DOM)
  - [x] 32 tests pass
- [x] **Task: Write Pong component tests (Red phase)**
  - [x] Test: Canvas renders with correct dimensions (600×400)
  - [x] Test: Pong aria-label in menu state
  - [x] Test: XP-styled outer container border and structure
  - [x] Test: Keyboard controls (W/S/Arrow keys) don't crash
  - [x] Test: SPACE key handling doesn't crash in menu state
  - [x] Test: prefers-reduced-motion doesn't crash
  - [x] 13 component tests pass
- [x] **Task: Implement Pong.tsx (Green phase)**
  - [x] Import physics functions from `pong-physics.ts`
  - [x] Create `src/components/apps/Pong.tsx` with Canvas-based Pong
  - [x] Implement game loop via `requestAnimationFrame` with delta-time
  - [x] Implement difficulty selection menu (Easy/Medium/Hard buttons)
  - [x] Implement player paddle (W/S + Arrow Up/Down)
  - [x] Implement AI paddle with configurable reaction delay + error margin
  - [x] Implement ball physics (angle reflection, wall bounce, speed increase)
  - [x] Implement scoring (first to 5 wins)
  - [x] Implement all game states (`menu`, `waiting`, `playing`, `scored`, `won`/`lost`)
  - [x] Add XP-styled border, Tahoma font for all text
  - [x] Add `prefers-reduced-motion` media query check → cap ball speed
  - [x] Implement minimize pause/resume (rAF stop/start via useEffect)
  - [x] Add keyboard handlers (Space, W/S, Arrows) — Escape NOT added (handled by WindowLayer globally)
  - [x] Verify: all physics + component tests pass (13 + 32 = 45 tests)
- [x] **Task: Create Pong desktop icon SVG**
  - [x] Create `public/icons/pong.svg` — 48×48 XP-styled paddle + ball icon
- [ ] **Task: Conductor - User Manual Verification 'Phase 1 — Pong' (Protocol in workflow.md)**

## Phase 2 — Minesweeper (9×9 Beginner)

- [ ] **Task: Extract Minesweeper engine**
  - [ ] Create `src/lib/minesweeper-engine.ts` with pure functions:
    - [ ] `generateBoard(rows, cols, mines, firstClick?)` — creates grid, places mines, counts adjacency
    - [ ] `floodFill(board, row, col)` — reveals all connected empty cells (BFS/DFS, no canvas)
    - [ ] `checkWin(board)` — returns boolean: all non-mine cells revealed?
    - [ ] `checkLoss(board, row, col)` — returns boolean: clicked a mine?
    - [ ] `toggleFlag(board, row, col)` — places/removes flag
    - [ ] `ensureFirstClickSafe(board, row, col)` — re-generates if mine, guarantee not on first click
    - [ ] `revealAllMines(board)` — reveals all mine positions (used on loss)
  - [ ] Write isolated unit tests for each pure function (no canvas, no DOM)
- [ ] **Task: Write Minesweeper component tests (Red phase)**
  - [ ] Test: Board renders 9×9 grid with correct mine count (via mocked canvas)
  - [ ] Test: Left-click reveals cell; right-click toggles flag
  - [ ] Test: Flood-fill reveals empty regions on click
  - [ ] Test: Loss shows all mines with triggered mine in red
  - [ ] Test: Win triggers celebration state
  - [ ] Test: Timer starts on first click and counts up
  - [ ] Test: Mine counter shows correct remaining mines
  - [ ] Test: Smiley face button cycles through states and restarts on click
  - [ ] Test: R key restarts game
- [ ] **Task: Implement Minesweeper.tsx (Green phase)**
  - [ ] Import engine functions from `minesweeper-engine.ts`
  - [ ] Create `src/components/apps/Minesweeper.tsx` with Canvas-based Minesweeper
  - [ ] Initialize board via `generateBoard()` on mount
  - [ ] Implement left-click reveal + right-click flag via engine functions
  - [ ] Implement flood-fill via `floodFill()` engine call
  - [ ] Implement mine explosion animation (reveal all, red highlight)
  - [ ] Implement win/loss detection via engine checkWin/checkLoss
  - [ ] Implement timer (counts up from 0) + mine counter display
  - [ ] Implement canvas-drawn smiley face button (🙂😮😎💀)
  - [ ] Implement first-click safety via `ensureFirstClickSafe()`
  - [ ] Add XP-styled border, Tahoma font for counters
  - [ ] Add keyboard handlers (R to restart) — Escape NOT added (handled by WindowLayer globally)
  - [ ] Verify: all engine + component tests pass
- [ ] **Task: Create Minesweeper desktop icon SVG**
  - [ ] Create `public/icons/minesweeper.svg` — 48×48 XP-styled mine icon
- [ ] **Task: Conductor - User Manual Verification 'Phase 2 — Minesweeper' (Protocol in workflow.md)**

## Phase 3 — Desktop Integration

- [ ] **Task: Add `openWindow` support to CMD output**
  - [ ] Add `openWindow?: WindowId` field to `CmdOutput` interface in `src/lib/commands.ts`
  - [ ] Update `CmdPrompt.tsx` to call `openWindow(cmdOutput.openWindow)` when this field is present
  - [ ] Write tests verifying CmdPrompt opens game windows
- [ ] **Task: Register games in Window system**
  - [ ] Add `pong` and `minesweeper` to `WindowId` type in `src/stores/windows.ts`
  - [ ] Add default window configs (Pong: 600×450, pos (80,60); Minesweeper: 400×450, pos (120,80))
- [ ] **Task: Wire games into WindowLayer**
  - [ ] Import Pong and Minesweeper in `WindowLayer.tsx`
  - [ ] Add case branches in `renderContent()` for `'pong'` and `'minesweeper'`
- [ ] **Task: Add desktop icons to index.astro**
  - [ ] Add Pong and Minesweeper DesktopIcon components (below existing icons, after Recycle Bin)
- [ ] **Task: Add games to Start Menu**
  - [ ] Strategy: Add "Pong" and "Minesweeper" as new items in the left column (pinned apps), placed after "Command Prompt" — expands column from 4 to 6 items. Right column (system folders) stays at 4.
  - [ ] Update `StartMenu.tsx` `LEFT_ITEMS` array with game entries
  - [ ] Create game icon SVG references in menu item configs
- [ ] **Task: Register CMD commands**
  - [ ] Add `pong` command handler → returns `{ openWindow: 'pong' }`
  - [ ] Add `minesweeper` command handler → returns `{ openWindow: 'minesweeper' }`
- [ ] **Task: Add game styles to global.css**
  - [ ] Add game container styles (XP border, canvas sizing)
  - [ ] Add `prefers-reduced-motion` overrides if needed
- [ ] **Task: Write integration tests**
  - [ ] Test: Pong window opens from desktop icon via luna:open-window event
  - [ ] Test: Minesweeper window opens from desktop icon
  - [ ] Test: `pong` CMD command opens Pong window (via new `openWindow` field)
  - [ ] Test: `minesweeper` CMD command opens Minesweeper window
  - [ ] Test: Both games + Explorer can coexist in window manager
  - [ ] Test: Minimize pauses game rAF; restore resumes it
- [ ] **Task: Conductor - User Manual Verification 'Phase 3 — Desktop Integration' (Protocol in workflow.md)**

---

## Modularity Contingency

- `src/lib/pong-physics.ts` — pure functions, < 150 lines
- `src/lib/minesweeper-engine.ts` — pure functions, < 200 lines
- `src/components/apps/Pong.tsx` — Canvas component referencing physics lib, < 250 lines
- `src/components/apps/Minesweeper.tsx` — Canvas component referencing engine, < 300 lines
  - If Minesweeper.tsx exceeds 350 lines, extract canvas rendering helpers into a separate utility

## Docs Updated

- [ ] **PRD.md** — Add §5.4 Pong and §5.5 Minesweeper app specs; update §3.1 Start Menu description to mention games; update §4 Desktop Icons table with Pong + Minesweeper entries
- [ ] **TDD.md** — Add pong/minesweeper to §2 URL Schema (`w` param values); add to §3.1 WindowId type; add to §3.2 Default Window Configs table; add to §6 Component Inventory (React Islands table)
- [ ] **tech-stack.md** — Change log entry for Track 6B with packages added (none), files created, and tests added count
