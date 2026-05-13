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
- Use an internal `isHydrating` boolean flag. Set `true` before hydration starts, `false` after it completes. The store subscriber (FR3) checks this flag and skips all URL writes during hydration (prevents feedback loop where `openWindow()` store writes trigger redundant URL updates).
- Recognized params:
  | Param | Format | Example | Store Target |
  |---------|---------------------------------|--------------------------------|---------------------------------------------------|
  | `w` | Comma-separated `WindowId` list | `w=cmd,taskmanager` | `openWindow()` each ID (skip unknown IDs silently) |
  | `focus` | Single `WindowId` | `focus=cmd` | `focusWindow()` (not just `$activeWindow.set()`) |
  | `start` | `0` or `1` | `start=1` | `openStartMenu()` |
  | `path` | Forward-slash path string | `path=C:/Software_Engineering` | Explorer's `explorerPath` (after window opens) |
- **Hydration sequence matters.** Execute in this exact order:
  1. **Parse `w` param:** Call `openWindow(id)` for each comma-separated ID. Unknown/invalid IDs are silently skipped.
  2. **Parse `focus` param:** Call `focusWindow(id)` **after** all windows are opened. This correctly adjusts both `$activeWindow` and z-index ordering — ensuring the focused window is visually on top. (`openWindow()` internally sets `$activeWindow` to the last-opened window, which would incorrectly override the focus param without this step.)
  3. **Parse `path` param:** Set Explorer's `explorerPath` in the store **after** the window is already open (otherwise the store entry doesn't exist yet).
  4. **Parse `start` param:** Call `openStartMenu()` last. If `$startMenuOpen` is set too early, the subscriber could write a partial URL state before other stores are hydrated.
- Hydrate ONLY on initial page load. Do NOT re-hydrate on subsequent `popstate` events — those are handled by history navigation (FR4).
- If no URL params present, desktop starts clean (no windows, Start Menu closed, Explorer at `C:\`).

### FR3: Debounced URL Updates on Store Changes

- Subscribe to `$windows` and `$startMenuOpen` / `$shuttingDown` stores.
- On store change, debounce URL updates at **100ms**.
- Always use `window.history.replaceState()` for rapid/intermediate changes (drag, resize, path navigation, Start Menu toggle).
- **No-op guard:** Before calling `replaceState()`, compare the newly serialized URL string against `window.location.search.substring(1)`. If they are identical, skip the call entirely. This eliminates all spurious URL writes during drag/resize (which change store positions but not the serialized params).
- Maintain a serialized representation of current state as a `URLSearchParams` string.
- Generate the URL params:
  - `w`: Comma-join all open (non-closing) window IDs, sorted alphabetically for stable URLs.
  - `focus`: The current `$activeWindow` value.
  - `start`: `$startMenuOpen` → `1` if true, omit if false.
  - `path`: Only include if Explorer is open. Read `explorerPath`, convert `\` to `/`.

### FR4: Browser History Navigation

- **Initial page load hydration uses `replaceState()`** — the URL the user navigated to already reflects the desired state. Using `pushState` would create a duplicate history entry. Only subsequent **user-initiated** actions use `pushState`.

- **pushState boundaries** (meaningful, user-initiated state changes that create history entries):
  - Window open (clicking desktop icon, Start Menu item, or `open` CMD command)
  - Window close (clicking close button)
  - Window focus change (clicking a different window title bar)
  - Start Menu open/close
- **replaceState operations** (updates current history entry — non-meaningful or intermediate changes):
  - Explorer path navigation
  - Rapid intermediate states during debounce window
  - Initial hydration on page load
- Listen to `window.addEventListener('popstate', ...)` to detect browser back/forward.
- On `popstate`: re-read the URL params and apply full hydration (same sequence as FR2), BUT do NOT write to history again (the browser already updated the URL). The `isHydrating` guard (FR2) naturally prevents writes during popstate as well.
- When all windows are closed and Start Menu is closed, URL returns to clean `/` (no search params).

### FR5: Start Menu State Sync

- `?start=1` opens the Start Menu on page load.
- On Start Menu open → URL updated (pushState).
- On Start Menu close → URL updated with `start` param removed (pushState if previously was open).

### FR6: Path Handling with Slash Conversion

- **Store → URL:** `C:\Software_Engineering\icarus-server-manager` → `C:/Software_Engineering/icarus-server-manager` (backslash → forward slash). Implement as `convertPathToUrl()`.
- **URL → Store:** `C:/Software_Engineering` → `C:\Software_Engineering` (forward slash → backslash). Implement as `convertPathToStore()`. **Note:** Can delegate to the existing `normalize()` function in `src/lib/filesystem.ts` (line 7-14), which already handles `forwardSlash → backslash` conversion: `path.replace(/\//g, '\\')`.
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
- **NFR4 — Graceful Parse Errors:** If URL params contain unknown or invalid values (e.g., `?w=bogus_window_id`, `?focus=invalid`), those values are silently skipped. Only valid `WindowId` values are passed to store actions. Malformed params never cause exceptions. A `console.warn()` is emitted for debugging visibility.

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
✅ No spurious `replaceState()` calls during drag/resize (no-op guard)
✅ Unknown window IDs in URL params are silently skipped with console warning
✅ Initial hydration uses `replaceState()` — browser back button doesn't show duplicate states
✅ Hydration order is correct: `focusWindow()` called last so focused window has highest z-index
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
