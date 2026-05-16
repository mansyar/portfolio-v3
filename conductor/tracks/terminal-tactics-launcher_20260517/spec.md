# Track 6D — Terminal Tactics Launcher

## Overview

Embed the published **Terminal Tactics** game from itch.io inside an XP-styled game launcher window. The game runs as a first-class application within the XP window system — accessible via a desktop icon, Start Menu entry, and CMD `play`/`terminal-tactics` commands. The GameLauncher component renders the game in an `<iframe>` with loading/error states and XP-appropriate styling.

**Prerequisite:** Terminal Tactics published on itch.io as an HTML game. Embed URL configured in `GAME_LAUNCHER_URLS` constant.

---

## Functional Requirements

### FR1 — GameLauncher Component

- Create `src/components/apps/GameLauncher.tsx` — an iframe wrapper React component
- Accept a `src` prop for the itch.io embed URL, sourced from a config constant
- Render an `<iframe>` with proper attributes: `title="Terminal Tactics"`, `allow="fullscreen"`, `sandbox="allow-scripts allow-same-origin"`
- The iframe fills the full window content area (no scrollbars on the wrapper)
- **Loading state:** Show "Loading Terminal Tactics..." with an XP-style progress bar until the iframe fires its `load` event
- **Error state:** If the iframe fails to load (timeout or error), show "Game failed to load." with an "[Open in new tab]" fallback link pointing to `https://mansyar.itch.io/terminal-tactics`
- Escape key is handled by the WindowLayer (closes the window) — no keyboard conflicts inside the iframe

### FR2 — Window System Integration

- Add `'terminal-tactics'` to the `WindowId` type in `src/stores/windows.ts`
- Add default window config: **800×600** default size, centered on screen (`x` and `y` calculated), `minWidth: 600`, `minHeight: 400`
- Wire `GameLauncher` into `WindowLayer.renderContent()` at `windowId === 'terminal-tactics'`
- Pass the itch.io embed URL to GameLauncher via its `src` prop

### FR3 — Desktop Icon & Start Menu

- Create `public/icons/terminal-tactics.svg` — 48×48 XP-styled icon (military/terminal aesthetic)
- Add desktop icon to `index.astro` in the desktop icons list
- Add "Terminal Tactics" to Start Menu pinned apps in `StartMenu.tsx`

### FR4 — CMD Integration

- Register `terminal-tactics` as a standalone CMD command → returns `{ openWindow: 'terminal-tactics' }`
- Register `play` command that accepts a game name argument:
  - `play terminal-tactics` → opens game window
  - `play <unknown>` → shows `'<unknown>' is not a recognized game`
- Both commands work through the existing `CmdOutput.openWindow` mechanism

### FR5 — Docs Update

- **PRD §5** — Add §5.6 Game Launcher spec (Terminal Tactics iframe)
- **PRD §4** — Add "Terminal Tactics" to the desktop icons table
- **TDD §3.1** — Add `'terminal-tactics'` to the WindowId union type
- **TDD §3.2** — Add Terminal Tactics entry to default window configs (800×600, centered)
- **TDD §6** — Add `GameLauncher` to React Islands component inventory table
- **TDD §7.1** — Add `play` and `terminal-tactics` commands to the supported commands table

---

## Non-Functional Requirements

- **Performance:** The iframe loads the game from an external domain — no JS bundle impact on initial page load (GameLauncher is lazy-load-friendly for Track 6E)
- **Accessibility:** Iframe has `title` attribute for screen readers. Loading/error states announce via `aria-live="polite"`
- **Authenticity:** Loading progress bar and error state use XP-styled chrome (Tahoma font, 3D borders, blue gradients)
- **Security:** iframe uses `sandbox` attribute with minimal required permissions

---

## Acceptance Criteria

```
✅ Desktop icon "Terminal Tactics" opens XP window with iframe → itch.io embed URL
✅ iframe renders game at full window size with no scrollbars
✅ "Loading Terminal Tactics..." shown with XP progress bar until iframe loads
✅ "Game failed to load" error state offers "Open in new tab" fallback
✅ Escape key closes game window correctly
✅ CMD: `terminal-tactics` opens game window
✅ CMD: `play terminal-tactics` opens game window
✅ CMD: `play nonexistent` shows "'nonexistent' is not a recognized game"
✅ All existing tests continue to pass
✅ All src/ files under 500 lines
```

---

## Out of Scope

- Full-screen button for the iframe (browser fullscreen API is allowed via `allow="fullscreen"`)
- Save/restore game state across sessions
- Multi-game launcher (this track is Terminal Tactics only; the component is reusable)
- Sound effects or additional game-related UI
