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
  - [ ] Test: No-op guard prevents `replaceState()` when serialized state hasn't changed
  - [ ] Test: Initial page load uses `replaceState()` not `pushState()` (mock history API to verify)
  - [ ] Test: `isHydrating` flag true → store subscriber does NOT write to URL
  - [ ] Test: `popstate` re-hydration respects `isHydrating` guard (does not re-write URL)

- [ ] Task: Wire `url-sync.ts` into the app
  - [ ] Call `hydrateFromUrl()` on `window.addEventListener('load', ...)` in browser context. The `isHydrating` flag prevents the store subscriber from writing back to the URL during hydration.
  - [ ] Subscribe to `$windows` store changes → on change, debounce → call `serializeState()` → if state differs from current URL, call `history.replaceState()`. Skip entirely if `isHydrating` is true.
  - [ ] Implement pushState/replaceState boundary logic:
    - **user-initiated** window open/close/focus/StartMenu → `history.pushState()`
    - **hydration-initiated** changes (initial load, popstate) → use `replaceState()` or skip (URL already correct)
    - Explorer path navigation, intermediate debounce → `replaceState()`
  - [ ] Implement 100ms debounce utility in `url-sync.ts` (or import from a shared location)
  - [ ] Implement `popstate` event listener → set `isHydrating = true` → re-parse URL params → re-hydrate stores (same sequence as FR2) → set `isHydrating = false`. The `isHydrating` guard prevents the subscriber from writing back to the URL (which the browser already updated via popstate).
  - [ ] Ensure the sync only initializes once (guard against double hydration)
  - [ ] Ensure SSR safety: guard `window` references with `if (typeof window !== 'undefined')`

- [ ] Task: Conductor — User Manual Verification 'Store Integration & History' (Protocol in workflow.md)
