# Specification: Classic XP Games

**Track ID:** `classic-xp-games_20260515`
**Type:** Feature
**Status:** Approved

---

## Overview

Two native canvas-based games — **Pong** (VS AI) and **Minesweeper** (9×9 Beginner) — running directly inside the XP window system as first-class apps. Both games use HTML5 Canvas for rendering, integrate as React islands within Astro's WindowLayer, and include desktop icons, CMD commands, and Start Menu entries for full XP desktop immersion.

**Desktop only** — not available in mobile Safe Mode.

## References

- [ROADMAP_v1.1 &#x24E7;Track 6B](../docs/ROADMAP_v1.1.md)
- [ROADMAP_v1 &#x24E7;Track 2C](../docs/archive/ROADMAP_v1.md#track-2c--task-manager-) (Canvas precedent)
- [PRD &#x24E7;5](../docs/PRD.md#5-interactive-applications) (Application Specs)
- [TDD &#x24E7;3.1](../docs/TDD.md#31-window-state-schema) (WindowId type)
- [TDD &#x24E7;3.2](../docs/TDD.md#32-default-window-configs) (Default Window Configs)
- [TDD &#x24E7;6](../docs/TDD.md#6-component-inventory) (Component Inventory)

## Architecture Decisions

- **Canvas-based rendering:** Both games use HTML5 Canvas API (no game engine dependencies). `requestAnimationFrame` for Pong, direct draw for Minesweeper. Follows precedent set by `CanvasGraph.tsx` in Task Manager.
- **Game logic separated from rendering:** Game state is a plain object updated each frame; rendering is a pure function of state. Pure game logic (physics, board generation, AI) is extracted into separate modules (`pong-physics.ts`, `minesweeper-engine.ts`) for independent testability without canvas mocking.
- **Window minimize &#x2192; pause:** On minimize, `requestAnimationFrame` stops. On restore, resumes. No unnecessary CPU usage.
- **Escape key:** Handled globally by `WindowLayer.tsx` — games do NOT register their own Escape listeners. Relies on existing WindowLayer global Escape handler (closes active window).
- **No new dependencies:** Pure React + Canvas — zero new packages.

## Functional Requirements

### FR1 — Pong Game

1. **Game Loop:** `requestAnimationFrame` with delta-time for frame-independent physics.
2. **Player Paddle:** Controlled by W/S or Arrow Up/Down keys. Constrained within canvas bounds.
3. **AI Paddle:** Tracks ball Y position with configurable reaction delay + error margin.
4. **Difficulty Selection Menu:** Pre-game screen showing Easy / Medium / Hard buttons. User selects, then presses SPACE to play.
   - **Easy:** AI reaction delay ~300ms, error margin ±60px
   - **Medium:** AI reaction delay ~150ms, error margin ±30px
   - **Hard:** AI reaction delay ~50ms, error margin ±10px
5. **Ball Physics:** Angle reflection off paddles and walls. Speed increases slightly per paddle hit.
6. **Scoring:** First to 5 wins. Score displayed at canvas top in Tahoma font.
7. **Game States:** `menu` (difficulty select), `waiting` ("Press SPACE to start"), `playing`, `scored` (brief pause), `won`/`lost` (result + "Press SPACE to restart").
8. **XP-styled border** around canvas. Tahoma font for all text.
9. **`prefers-reduced-motion`:** Cap ball speed at 60% of normal max.
10. **Minimize behavior:** Pause rAF loop on minimize; resume on restore.
11. **Keyboard:** Space to start/restart, W/S or Arrow Up/Down for paddle. Escape is handled by the global WindowLayer handler (closes the active window).

### FR2 — Minesweeper (9x9 Beginner)

1. **Board:** 9x9 grid, 10 mines. Standard Minesweeper rules.
2. **Left-click:** Reveal cell. **Right-click:** Toggle flag.
3. **Flood-fill:** Revealing an empty cell auto-reveals all adjacent empty cells recursively.
4. **Mine explosion:** On loss, reveal all mines. Highlight the triggered mine in red.
5. **Win detection:** All non-mine cells revealed = win.
6. **Timer:** Counts up from 0 in seconds, displayed in header area. Starts on first click.
7. **Mine counter:** Shows remaining mines (total - flags placed).
8. **Smiley face button:** Canvas-drawn 🙂 (playing), 😮 (clicking), 😎 (won), 💀 (lost). Click to restart.
9. **First click guarantee:** First click is never a mine — re-generate board if needed.
10. **XP-styled border** around game area. Tahoma font for counter/timer.
11. **Keyboard:** R to restart. Escape is handled by the global WindowLayer handler (closes the active window).
12. **Canvas rendering:** Grid lines, numbered cells (1-8 with classic blue colors), flag/mine icons.

### FR3 — Desktop Integration

1. **Window Registration:** Add `pong` and `minesweeper` to `WindowId` type in `stores/windows.ts`.
2. **Default Configs:** Pong ~600x450, Minesweeper ~400x450 (with default positions).
3. **WindowLayer:** Wire both games into `renderContent()`.
4. **Desktop Icons:** `public/icons/pong.svg` + `public/icons/minesweeper.svg` (48x48 XP-styled).
5. **Start Menu:** Add both games to pinned apps list.
6. **CMD Commands:** Register `pong` and `minesweeper` &#x2192; open respective window. This requires adding an `openWindow?: WindowId` field to the `CmdOutput` interface in `commands.ts` and handling it in `CmdPrompt.tsx`.
7. **Multi-window:** Games + Explorer + CMD can coexist.
8. **Minimize/restore:** Both pause/resume rAF correctly.

## Acceptance Criteria

```
✅ Pong opens in XP window (~600x450), first-to-5, AI opponent
✅ Pre-game difficulty menu (Easy/Medium/Hard)
✅ W/S or Arrow Up/Down paddle control
✅ Accurate ball-paddle and ball-wall collision
✅ SPACE to start/restart, Escape (global) closes window
✅ AI beatable on Easy/Medium
✅ Pause on minimize, resume on restore
✅ Minesweeper 9x9, 10 mines, standard rules
✅ Left-click reveal, Right-click flag
✅ Flood-fill, first-click safety
✅ Timer + mine counter
✅ Canvas-drawn smiley face
✅ R to restart; Escape (global) closes window
✅ Desktop icons + Start Menu entries
✅ pong/minesweeper CMD commands
✅ Multi-window works
✅ prefers-reduced-motion respected
✅ All existing tests pass, all src/ files under 500 lines
```

## Out of Scope

- Two-player Pong, larger boards, sound, leaderboards, touch/mobile, state persistence.
- Games are not filesystem entries — launched from desktop icons, Start Menu, and CMD only. No virtual `C:\Program Files\Games\` entry.

## Key Files Created

```
src/components/apps/Pong.tsx — Canvas Pong with AI + difficulty menu
src/components/apps/Minesweeper.tsx — Canvas Minesweeper 9x9
src/lib/pong-physics.ts — Pure Pong physics: collision detection, AI behavior, ball math
src/lib/minesweeper-engine.ts — Pure Minesweeper logic: board gen, flood-fill, win/loss, first-click safety
public/icons/pong.svg — 48x48 XP-styled icon
public/icons/minesweeper.svg — 48x48 XP-styled icon
tests/pong.test.tsx — Pong unit tests (physics + component)
tests/minesweeper.test.tsx — Minesweeper unit tests (engine + component)
tests/canvas-helpers.ts — Shared canvas mock utility for jsdom tests
```

## Key Files Modified

```
src/stores/windows.ts — WindowId type + default configs
src/components/window/WindowLayer.tsx — Game component mapping
src/pages/index.astro — Desktop icons
src/components/taskbar/StartMenu.tsx — Pinned apps
src/lib/commands.ts — CMD commands
src/styles/global.css — Game animations, reduced-motion
tests/window/windowlayer.test.tsx — Game integration tests
```
