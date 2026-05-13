# Implementation Plan: Track 3B — URL State Persistence

## Phase 1 — URL Sync Module (Core Logic)

**Goal:** Create the `src/stores/url-sync.ts` module with all core URL ↔ store logic: URL parsing, state serialization, path slash conversion, and URL hydration on page load.

### Tasks

- [ ] Task: Write failing tests for URL parsing and serialization
  - [ ] Test: `parseParams()` extracts `w`, `focus`, `start`, `path` from URL search string
  - [ ] Test: `serializeState()` generates correct URL param string from current stores
  - [ ] Test: Path conversion: `C:/Software_Engineering` ↔ `C:\Software_Engineering`
  - [ ] Test: Comma-sorted `w` param is alphabetically stable
  - [ ] Test: `start` param omitted when Start Menu is closed
  - [ ] Test: `path` param omitted when Explorer not open
  - [ ] Test: Invalid path → fallback to `C:\`
  - [ ] Test: Empty URL → no hydration (clean desktop)
  - [ ] Test: `path` pointing to a file → navigates to parent directory

- [ ] Task: Implement `src/stores/url-sync.ts`
  - [ ] Define types: `UrlState` (parsed params), `PathConverter` utilities
  - [ ] Implement `parseParams(search: string): UrlState` — parse URLSearchParams into structured state
  - [ ] Implement `serializeState(): string` — read current stores and generate URLSearchParams string
  - [ ] Implement `convertPathToStore(urlPath: string): string` — forward slashes → backslashes
  - [ ] Implement `convertPathToUrl(storePath: string): string` — backslashes → forward slashes
  - [ ] Implement `hydrateFromUrl()` — on page load, parse URL and call `openWindow()`, set `$activeWindow`, `$startMenuOpen`, Explorer `explorerPath`
  - [ ] Export all functions for testing and integration

- [ ] Task: Conductor — User Manual Verification 'URL Sync Module' (Protocol in workflow.md)

---

## Phase 2 — Store Integration & History

**Goal:** Wire the URL sync module into the application lifecycle — subscribe to store changes, debounce URL updates, manage browser history (pushState vs replaceState), and handle popstate for back/forward navigation.

### Tasks

- [ ] Task: Write failing tests for store integration
  - [ ] Test: Opening a window triggers URL update via pushState (after debounce)
  - [ ] Test: Closing a window triggers URL update via pushState (after debounce)
  - [ ] Test: Focusing a window triggers URL update via pushState
  - [ ] Test: Explorer path navigation triggers URL update via replaceState
  - [ ] Test: Start Menu toggle triggers URL update via pushState
  - [ ] Test: Closing all windows → URL resets to `/`
  - [ ] Test: `popstate` event re-hydrates stores from URL
  - [ ] Test: Debounce fires at ~100ms (not instantly)
  - [ ] Test: Rapid consecutive operations only produce one URL update (debounce coalescing)

- [ ] Task: Wire `url-sync.ts` into the app
  - [ ] Call `hydrateFromUrl()` on `window.addEventListener('load', ...)` in browser context
  - [ ] Subscribe to `$windows` store changes → on change, debounce → call `serializeState()` → `replaceState()`
  - [ ] Determine pushState boundaries: window open, close, focus change, Start Menu open/close → call `history.pushState()`
  - [ ] Implement 100ms debounce utility in `url-sync.ts` (or import from a shared location)
  - [ ] Implement `popstate` event listener → re-parse URL params → re-hydrate stores
  - [ ] Ensure the sync only initializes once (guard against double hydration)
  - [ ] Ensure SSR safety: guard `window` references with `if (typeof window !== 'undefined')`

- [ ] Task: Conductor — User Manual Verification 'Store Integration & History' (Protocol in workflow.md)
