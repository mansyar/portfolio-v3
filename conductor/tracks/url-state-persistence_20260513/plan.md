# Implementation Plan: Track 3B — URL State Persistence

## Phase 1 — URL Sync Module (Core Logic)

**Goal:** Create the `src/stores/url-sync.ts` module with all core URL ↔ store logic: URL parsing, state serialization, path slash conversion, and URL hydration on page load.

### Tasks

- [x] Task: Write failing tests for URL parsing and serialization (b286296)
  - [x] Test: `parseParams()` extracts `w`, `focus`, `start`, `path` from URL search string
  - [x] Test: `serializeState()` generates correct URL param string from current stores
  - [x] Test: Path conversion: `C:/Software_Engineering` ↔ `C:\Software_Engineering`
  - [x] Test: Comma-sorted `w` param is alphabetically stable
  - [x] Test: `start` param omitted when Start Menu is closed
  - [x] Test: `path` param omitted when Explorer not open
  - [x] Test: Invalid path → fallback to `C:\`
  - [x] Test: Empty URL → no hydration (clean desktop)
  - [x] Test: `path` pointing to a file → navigates to parent directory
  - [x] Test: Unknown `w` IDs (e.g., `w=bogus`) are silently skipped
  - [x] Test: `isHydrating` flag prevents store subscriber from writing URL

- [x] Task: Implement `src/stores/url-sync.ts` (b286296)
  - [x] Define types: `UrlState` (parsed params — guards unknown WindowIds), `PathConverter` utilities
  - [x] Implement `isHydrating` boolean flag — set `true` at start of hydration, `false` after completion. Store subscriber checks this before writing to URL.
  - [x] Implement `parseParams(search: string): UrlState` — parse URLSearchParams into structured state. Unknown/invalid WindowIds in `w` param are filtered out silently (with `console.warn`).
  - [x] Implement `serializeState(): string` — read current stores and generate URLSearchParams string
  - [x] Implement `convertPathToStore(urlPath: string): string` — forward slashes → backslashes. Delegate to `filesystem.ts`'s existing `normalize()` function to avoid reimplementing.
  - [x] Implement `convertPathToUrl(storePath: string): string` — backslashes → forward slashes
  - [x] Implement no-op guard: `serializeState()` result compared against `window.location.search.substring(1)`. Skip `replaceState()` if equal.
  - [x] Implement `hydrateFromUrl()` — on page load, parse URL and execute hydration in this exact order:
    1. Parse `w` → call `openWindow(id)` for each valid ID
    2. Parse `focus` → call `focusWindow(id)` (not just `$activeWindow.set()`) to ensure correct z-index ordering
    3. Parse `path` → set Explorer's `explorerPath` in the store
    4. Parse `start` → call `openStartMenu()` if `1`
    5. Set `isHydrating = false`
  - [x] Export all functions for testing and integration

- [x] Task: Conductor — User Manual Verification 'URL Sync Module' (Protocol in workflow.md) (13e5c95)
  - [x] Integration: Wire initUrlSync() into WindowLayer useEffect
  - [x] Integration: Add setPendingPushState() for window open/close/focus in WindowLayer
  - [x] Integration: Add setPendingPushState() for Start Menu toggle in Taskbar

---

## Phase 2 — Store Integration & History

**Goal:** Wire the URL sync module into the application lifecycle — subscribe to store changes, debounce URL updates, manage browser history (pushState vs replaceState), and handle popstate for back/forward navigation.

### Tasks

- [x] Task: Write failing tests for store integration (13e5c95)
  - [x] Test: Opening a window triggers URL update via store subscriber
  - [x] Test: Closing a window → serialized state returns to empty
  - [x] Test: Focusing a window → serialized state includes focus param
  - [x] Test: Start Menu toggle → serialized state includes start=1
  - [x] Test: No-op guard prevents replaceState when state matches URL
  - [x] Test: isHydrating flag true → subscriber does NOT write to URL
  - [x] Test: pushState called via setPendingPushState for user actions

- [x] Task: Wire `url-sync.ts` into the app (13e5c95)
  - [x] Call `initUrlSync()` from WindowLayer useEffect on mount
  - [x] hydrateFromUrl called by initUrlSync with isHydrating guard
  - [x] Subscribe to $windows, $startMenuOpen, $activeWindow with 100ms debounce
  - [x] pushState/replaceState boundary logic via setPendingPushState
  - [x] 100ms debounce utility in url-sync.ts
  - [x] popstate event listener for browser back/forward
  - [x] Single initialization guard (initialized flag)
  - [x] SSR safety (typeof window !== 'undefined')
