# Track 3B — URL State Persistence

## Overview

Sync the Nano Stores window state (`windows.ts`, `desktop.ts`) to URL search params for deep-linking, shareability, and browser history navigation. When a user visits a URL like `/?w=cmd,explorer&focus=cmd&path=C:/Software_Engineering`, the stores hydrate to restore that exact desktop state — windows open, focused, and Explorer navigated to the right path.

This also fulfills the deferred Explorer path persistence from Track 2A (see ROADMAP §Track 3B Notes).

## Functional Requirements

### FR1: Dedicated URL Sync Module

- Create `src/stores/url-sync.ts` — a self-contained module that owns all URL ↔ store synchronization logic.
- Responsibilities: (1) hydrate stores from URL on page load, (2) subscribe to store changes and debounce-update the URL, (3) manage `pushState` vs `replaceState` call boundaries.

### FR2: URL Hydration on Page Load

- On `window.addEventListener('load', ...)`, parse `URLSearchParams` from `window.location.search`.
- Recognized params:
  | Param | Format | Example | Store Target |
  |---------|---------------------------------|--------------------------------|--------------------------|
  | `w` | Comma-separated `WindowId` list | `w=cmd,taskmanager` | `openWindow()` each ID |
  | `focus` | Single `WindowId` | `focus=cmd` | `$activeWindow` |
  | `start` | `0` or `1` | `start=1` | `$startMenuOpen` |
  | `path` | Forward-slash path string | `path=C:/Software_Engineering` | Explorer's `explorerPath` |
- Hydrate ONLY on initial page load. Do NOT re-hydrate on subsequent `popstate` events — those are handled by history navigation (FR4).
- If no URL params present, desktop starts clean (no windows, Start Menu closed, Explorer at `C:\`).

### FR3: Debounced URL Updates on Store Changes

- Subscribe to `$windows` and `$startMenuOpen` / `$shuttingDown` stores.
- On store change, debounce URL updates at **100ms**.
- Always use `window.history.replaceState()` for rapid/intermediate changes (drag, resize, path navigation, Start Menu toggle).
- Maintain a serialized representation of current state as a `URLSearchParams` string.
- Generate the URL params:
  - `w`: Comma-join all open (non-closing) window IDs, sorted alphabetically for stable URLs.
  - `focus`: The current `$activeWindow` value.
  - `start`: `$startMenuOpen` → `1` if true, omit if false.
  - `path`: Only include if Explorer is open. Read `explorerPath`, convert `\` to `/`.

### FR4: Browser History Navigation

- **pushState boundaries** (meaningful state changes that create history entries):
  - Window open/close
  - Window focus change
  - Start Menu open/close
- **replaceState operations** (updates current history entry):
  - Window drag (x, y position changes — though positions aren't persisted, the `w` param doesn't change either, so no-op)
  - Window resize
  - Explorer path navigation
  - Rapid intermediate states during debounce window
- Listen to `window.addEventListener('popstate', ...)` to detect browser back/forward.
- On `popstate`: re-read the URL params and apply full hydration (same as initial load).
- When all windows are closed and Start Menu is closed, URL returns to clean `/` (no search params).

### FR5: Start Menu State Sync

- `?start=1` opens the Start Menu on page load.
- On Start Menu open → URL updated (pushState).
- On Start Menu close → URL updated with `start` param removed (pushState if previously was open).

### FR6: Path Handling with Slash Conversion

- **Store → URL:** `C:\Software_Engineering\icarus-server-manager` → `C:/Software_Engineering/icarus-server-manager` (backslash → forward slash).
- **URL → Store:** `C:/Software_Engineering` → `C:\Software_Engineering` (forward slash → backslash).
- If `?path=` points to a file (not a folder), navigate Explorer to the file's parent directory.
- If `?path=` is invalid or doesn't exist in the filesystem tree, fall back to `C:\`.
- Only include `?path=` param when Explorer window is open (`w` includes `explorer`).

### FR7: Closing All Windows

- When the last window is closed, the URL resets to `/` (no params).
- Closing the Start Menu removes `start` param.

## Non-Functional Requirements

- **NFR1 — Performance:** URL sync must not cause visible jank. The 100ms debounce ensures store operations are never blocked by URL updates.
- **NFR2 — No Page Reload:** All URL updates use `pushState` / `replaceState` (not `location.href` or `location.assign`). The page never reloads.
- **NFR3 — Immutable Store Logic:** The URL sync module is an observer layer — it reads stores and writes URL state but does NOT modify the stores directly (except during initial hydration). Controls remain in `windows.ts` / `desktop.ts`.

## Acceptance Criteria

```
✅ Opening windows updates the URL with correct params
✅ Pasting a URL with `?w=explorer&path=C:/Software_Engineering` opens Explorer to that path
✅ Pasting a URL with `?w=cmd,taskmanager&focus=cmd` opens both windows with CMD focused
✅ Pasting a URL with `?start=1` opens the Start Menu on load
✅ Closing all windows returns URL to clean `/`
✅ Browser back/forward navigates window state history correctly
✅ Start Menu state is reflected in URL (`?start=1`)
✅ Path uses forward slashes in URL, backslashes in store
✅ Invalid paths fall back to `C:\` gracefully
✅ No page reload occurs during any URL update
✅ URL updates are debounced at 100ms — no spamming during rapid operations
```

## Out of Scope

- Persisting window positions/sizes in URL (uses defaults on restore).
- Persisting CMD's current working directory (`cmdPath`) in URL.
- Persisting task manager tab state or selection state.
- URL shortening or compression of param strings.

## References

- [TDD §2 — Routing & URL Strategy](../../docs/TDD.md#2-routing--url-strategy)
- [ROADMAP §Track 3B](../../docs/ROADMAP.md#track-3b--url-state-persistence)
- [PRD §2 — Technical Stack (Nano Stores + URL Params)](../../docs/PRD.md#2-technical-stack--infrastructure)
