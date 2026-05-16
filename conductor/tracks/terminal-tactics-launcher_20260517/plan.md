# Implementation Plan: Track 6D — Terminal Tactics Launcher

## Phase 1 — GameLauncher Component & Config [checkpoint: f1ca8ab]

- [x] Task: Write tests for the GameLauncher component [5d18e97]
  - [x] Test: iframe renders with correct `src` prop and attributes (`title`, `allow`, `sandbox`)
  - [x] Test: Loading state displays "Loading Terminal Tactics..." before iframe load event
  - [x] Test: Error state renders fallback "Open in new tab" link after 15-second timeout
  - [x] Test: Timeout clears on successful iframe `onLoad` (no error state shown)
  - [x] Test: `aria-live="polite"` is present on loading/error state containers
- [x] Task: Create `src/lib/game-launcher-config.ts` [5d18e97]
  - [x] Export `GAME_LAUNCHER_URLS: Record<string, string>` with `terminal-tactics` → itch.io embed URL
  - [x] This keeps iframe URLs in a single, easy-to-update location separate from `constants.ts`
- [x] Task: Implement GameLauncher.tsx [5d18e97]
  - [x] Create `src/components/apps/GameLauncher.tsx` with `src` prop
  - [x] Render `<iframe>` with `title="Terminal Tactics"`, `allow="fullscreen"`, `sandbox="allow-scripts allow-same-origin"`
  - [x] Implement loading state: "Loading Terminal Tactics..." with XP-style progress bar
  - [x] Implement error state with 15-second timeout: fallback link to `https://mansyar.itch.io/terminal-tactics`
  - [x] Implement iframe `onLoad` event → clear timeout, transition from loading → ready
  - [x] Fill full window content area (no scrollbars on wrapper)
- [x] Task: Conductor - User Manual Verification 'Phase 1 — GameLauncher Component & Config' (Protocol in workflow.md)

## Phase 2 — Window System Integration & URL Deep-Linking

- [x] Task: Write tests for window integration [970fac0]
  - [x] Test: WindowId type includes 'terminal-tactics'
  - [x] Test: Default window config exists for 'terminal-tactics' (800×600, x:160, y:60, min 600×400)
  - [x] Test: `VALID_WINDOW_IDS` in url-sync.ts includes 'terminal-tactics'
  - [x] Test: `VALID_WINDOW_IDS` includes 'pong' and 'minesweeper' (fix pre-existing gap)
  - [x] Test: WindowLayer renders GameLauncher when windowId === 'terminal-tactics'
  - [x] Test: URL serialization includes 'terminal-tactics' in `w` param when window is open
  - [x] Test: URL deserialization opens 'terminal-tactics' from `?w=terminal-tactics`
- [x] Task: Add 'terminal-tactics' to WindowId type in `src/stores/windows.ts` [970fac0]
- [x] Task: Add default window config in `src/stores/windows.ts` [970fac0]
  - [x] Size: 800×600, x:160, y:60, minWidth: 600, minHeight: 400
- [x] Task: Fix VALID_WINDOW_IDS in `src/stores/url-sync.ts` [970fac0]
  - [x] Add 'terminal-tactics', 'pong', and 'minesweeper' to the whitelist set
- [x] Task: Wire GameLauncher into WindowLayer.renderContent() [970fac0]
  - [x] Import GameLauncher from `@/components/apps/GameLauncher`
  - [x] Import `GAME_LAUNCHER_URLS` from `@/lib/game-launcher-config`
  - [x] Add case branch for `windowId === 'terminal-tactics'`
  - [x] Pass embed URL via src prop: `GAME_LAUNCHER_URLS['terminal-tactics']`
- [ ] Task: Conductor - User Manual Verification 'Phase 2 — Window System Integration & URL Deep-Linking' (Protocol in workflow.md)

## Phase 3 — Desktop Icon, Start Menu & CMD Command

- [ ] Task: Write unit test for CMD command handler
  - [ ] Test in `tests/lib/commands.test.ts`: `COMMAND_REGISTRY['terminal-tactics']` returns `{ lines: ['Starting Terminal Tactics...'], openWindow: 'terminal-tactics' }`
  - [ ] Test: `COMMANDS` object includes 'terminal-tactics' key with description
- [ ] Task: Write integration tests
  - [ ] Test: Desktop icon click opens terminal-tactics window (via `luna:open-window` event)
  - [ ] Test: CMD `terminal-tactics` command opens game window (via CmdPrompt integration test)
  - [ ] Test: Start Menu "Terminal Tactics" item opens the correct window
- [ ] Task: Create `public/icons/terminal-tactics.svg` — 48×48 XP-styled icon (military/terminal aesthetic)
- [ ] Task: Add desktop icon to `index.astro` in desktop icons list
- [ ] Task: Add "Terminal Tactics" to StartMenu.tsx LEFT_ITEMS pinned apps
- [ ] Task: Register CMD command in `commands.ts`
  - [ ] Add `'terminal-tactics': 'Starts the Terminal Tactics game'` to `COMMANDS` metadata
  - [ ] Create `handlerTerminalTactics` → returns `{ lines: ['Starting Terminal Tactics...'], openWindow: 'terminal-tactics' }`
  - [ ] Register `terminal-tactics` → `handlerTerminalTactics` in `COMMAND_REGISTRY`
  - [ ] Follows exact same pattern as `pong`/`minesweeper` (standalone, no `play` subcommand)
- [ ] Task: Conductor - User Manual Verification 'Phase 3 — Desktop Icon, Start Menu & CMD Command' (Protocol in workflow.md)

## Phase 4 — Documentation Updates

- [ ] Task: Update PRD.md
  - [ ] §5 — Add §5.6 Game Launcher spec (Terminal Tactics iframe with loading/error states)
  - [ ] §4 — Add "Terminal Tactics" to desktop icons table
- [ ] Task: Update TDD.md
  - [ ] §2 (URL Strategy) — Document `VALID_WINDOW_IDS` whitelist; note that new WindowIds must be added to it for deep-linking support
  - [ ] §3.1 — Add `'terminal-tactics'` to WindowId union type
  - [ ] §3.2 — Add Terminal Tactics entry to default window configs (800×600, x:160, y:60, min 600×400)
  - [ ] §6 — Add `GameLauncher` to React Islands component inventory table
  - [ ] §7.1 — Add `terminal-tactics` to supported commands table
- [ ] Task: Conductor - User Manual Verification 'Phase 4 — Documentation Updates' (Protocol in workflow.md)
