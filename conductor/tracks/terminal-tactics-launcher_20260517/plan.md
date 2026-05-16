# Implementation Plan: Track 6D — Terminal Tactics Launcher

## Phase 1 — GameLauncher Component

- [ ] Task: Write tests for the GameLauncher component
  - [ ] Test: iframe renders with correct `src` prop and attributes
  - [ ] Test: Loading state displays "Loading Terminal Tactics..." before iframe load event
  - [ ] Test: Error state renders fallback "Open in new tab" link when iframe fails to load
  - [ ] Test: `aria-live="polite"` is present on loading/error state containers
- [ ] Task: Implement GameLauncher.tsx
  - [ ] Create `src/components/apps/GameLauncher.tsx` with `src` prop
  - [ ] Render `<iframe>` with `title`, `allow="fullscreen"`, `sandbox="allow-scripts allow-same-origin"`
  - [ ] Implement loading state: "Loading Terminal Tactics..." with XP-style progress bar
  - [ ] Implement error state: fallback link to `https://mansyar.itch.io/terminal-tactics`
  - [ ] Implement iframe `onLoad` event handling to transition from loading → ready
  - [ ] Add `GAME_LAUNCHER_URLS` config constant in constants or dedicated config file
- [ ] Task: Conductor - User Manual Verification 'Phase 1 — GameLauncher Component' (Protocol in workflow.md)

## Phase 2 — Window System Integration

- [ ] Task: Write tests for window integration
  - [ ] Test: WindowId type includes 'terminal-tactics'
  - [ ] Test: Default window config exists for 'terminal-tactics' (800×600, centered)
  - [ ] Test: WindowLayer renders GameLauncher when windowId === 'terminal-tactics'
- [ ] Task: Add 'terminal-tactics' to WindowId type in `src/stores/windows.ts`
- [ ] Task: Add default window config in `src/stores/windows.ts`
  - [ ] Size: 800×600, center-calculated x/y, minWidth: 600, minHeight: 400
- [ ] Task: Wire GameLauncher into WindowLayer.renderContent()
  - [ ] Import GameLauncher
  - [ ] Add case branch for `windowId === 'terminal-tactics'`
  - [ ] Pass embed URL via src prop
- [ ] Task: Conductor - User Manual Verification 'Phase 2 — Window System Integration' (Protocol in workflow.md)

## Phase 3 — Desktop Icon, Start Menu & CMD Commands

- [ ] Task: Write integration tests
  - [ ] Test: Desktop icon click opens terminal-tactics window
  - [ ] Test: CMD `terminal-tactics` command returns `{ openWindow: 'terminal-tactics' }`
  - [ ] Test: CMD `play terminal-tactics` opens game window
  - [ ] Test: CMD `play nonexistent` shows error message
- [ ] Task: Create `public/icons/terminal-tactics.svg` — 48×48 XP-styled icon
- [ ] Task: Add desktop icon to `index.astro`
- [ ] Task: Add "Terminal Tactics" to StartMenu.tsx pinned apps
- [ ] Task: Register CMD commands in `commands.ts`
  - [ ] Register `terminal-tactics` as standalone command → `{ openWindow: 'terminal-tactics' }`
  - [ ] Register `play` command with game name argument
  - [ ] Handle unknown game name error message
- [ ] Task: Conductor - User Manual Verification 'Phase 3 — Desktop Icon, Start Menu & CMD Commands' (Protocol in workflow.md)

## Phase 4 — Documentation Updates

- [ ] Task: Update PRD.md
  - [ ] §5 — Add §5.6 Game Launcher spec
  - [ ] §4 — Add "Terminal Tactics" to desktop icons table
- [ ] Task: Update TDD.md
  - [ ] §3.1 — Add `'terminal-tactics'` to WindowId union type
  - [ ] §3.2 — Add Terminal Tactics entry to default window configs
  - [ ] §6 — Add `GameLauncher` to React Islands component inventory
  - [ ] §7.1 — Add `play` and `terminal-tactics` to supported commands table
- [ ] Task: Conductor - User Manual Verification 'Phase 4 — Documentation Updates' (Protocol in workflow.md)
