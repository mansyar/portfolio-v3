import { atom } from 'nanostores';
import { $windows, $activeWindow, openWindow, focusWindow, type WindowId } from '@/stores/windows';
import { $startMenuOpen, openStartMenu } from '@/stores/desktop';
import { normalize, resolvePath, getParent } from '@/lib/filesystem';

// ─── Types ──────────────────────────────────────────────────────────────────

export interface UrlState {
  w?: WindowId[];
  focus?: WindowId;
  start?: boolean;
  path?: string;
}

// ─── Internal State ─────────────────────────────────────────────────────────

/** Flag that prevents the store subscriber from writing back to the URL during hydration. */
export const isHydrating = atom<boolean>(false);

/** Tracks whether the next URL update should use pushState (user-initiated) or replaceState (intermediate). */
let pendingUrlAction: 'push' | 'replace' = 'replace';

/** Set the next history action to pushState (used by components before user-initiated actions). */
export function setPendingPushState(): void {
  pendingUrlAction = 'push';
}

/** The set of valid WindowId values for validation. */
const VALID_WINDOW_IDS = new Set<WindowId>([
  'explorer',
  'mydocs',
  'help',
  'cmd',
  'taskmanager',
  'recyclebin',
]);

// ─── Path Conversion Utilities ──────────────────────────────────────────────

/**
 * Convert a store path (backslashes) to a URL path (forward slashes).
 * `C:\Software_Engineering` → `C:/Software_Engineering`
 */
export function convertPathToUrl(storePath: string): string {
  return storePath.replace(/\\/g, '/');
}

/**
 * Convert a URL path (forward slashes) to a store path (backslashes).
 * `C:/Software_Engineering` → `C:\Software_Engineering`
 * Delegates to the existing `normalize()` function from `filesystem.ts`.
 */
export function convertPathToStore(urlPath: string): string {
  return normalize(urlPath);
}

// ─── URL Parsing ────────────────────────────────────────────────────────────

/**
 * Parse a URL search string into structured URL state.
 *
 * Extracts `w` (comma-separated window IDs), `focus`, `start`, and `path` params.
 * Unknown/invalid `WindowId` values in the `w` param are silently filtered out
 * with a `console.warn()` for debugging visibility.
 *
 * @param search — The URL search string (without leading `?`), or empty string.
 * @returns Parsed `UrlState` — an empty object if no params are recognized.
 */
export function parseParams(search: string): UrlState {
  if (!search) return {};

  // Ensure we strip a leading '?' if present
  const cleanSearch = search.startsWith('?') ? search.slice(1) : search;
  const params = new URLSearchParams(cleanSearch);
  const state: UrlState = {};

  // ── Parse `w` param ───────────────────────────────────────────────────
  const wRaw = params.get('w');
  if (wRaw) {
    const ids = wRaw
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const validIds: WindowId[] = [];
    for (const id of ids) {
      if (VALID_WINDOW_IDS.has(id as WindowId)) {
        validIds.push(id as WindowId);
      } else {
        console.warn(`[url-sync] Unknown window ID in URL param: "${id}" — skipping`);
      }
    }

    if (validIds.length > 0) {
      state.w = validIds;
    }
  }

  // ── Parse `focus` param ───────────────────────────────────────────────
  const focusRaw = params.get('focus');
  if (focusRaw && VALID_WINDOW_IDS.has(focusRaw as WindowId)) {
    state.focus = focusRaw as WindowId;
  }

  // ── Parse `start` param ───────────────────────────────────────────────
  const startRaw = params.get('start');
  if (startRaw === '1') {
    state.start = true;
  }

  // ── Parse `path` param ────────────────────────────────────────────────
  const pathRaw = params.get('path');
  if (pathRaw) {
    state.path = convertPathToStore(pathRaw);
  }

  return state;
}

// ─── State Serialization ────────────────────────────────────────────────────

/**
 * Serialize the current store state into a URLSearchParams string.
 *
 * Reads `$windows`, `$activeWindow`, and `$startMenuOpen` to generate
 * `w`, `focus`, `start`, and `path` params.
 *
 * @returns URL search string (without leading `?`), or empty string if no state.
 */
export function serializeState(): string {
  const windows = $windows.get();
  const activeWindow = $activeWindow.get();
  const startMenuOpen = $startMenuOpen.get();

  const openWindowIds = Object.values(windows)
    .filter((w) => w.status !== 'closing')
    .map((w) => w.id)
    .sort();

  if (openWindowIds.length === 0 && !startMenuOpen) {
    return '';
  }

  const params = new URLSearchParams();

  // ── `w` param ─────────────────────────────────────────────────────────
  if (openWindowIds.length > 0) {
    params.set('w', openWindowIds.join(','));
  }

  // ── `focus` param ─────────────────────────────────────────────────────
  if (activeWindow && windows[activeWindow]?.status !== 'closing') {
    params.set('focus', activeWindow);
  }

  // ── `start` param ─────────────────────────────────────────────────────
  if (startMenuOpen) {
    params.set('start', '1');
  }

  // ── `path` param ──────────────────────────────────────────────────────
  const explorer = windows.explorer;
  if (explorer && explorer.status !== 'closing' && explorer.explorerPath) {
    params.set('path', convertPathToUrl(explorer.explorerPath));
  }

  return params.toString();
}

// ─── Hydration ──────────────────────────────────────────────────────────────

/**
 * Hydrate stores from a URL search string.
 *
 * Executes hydration in this exact order:
 * 1. Parse `w` param → open windows
 * 2. Parse `focus` param → focus window (corrects z-index ordering)
 * 3. Parse `path` param → set explorer path
 * 4. Parse `start` param → open Start Menu
 *
 * Sets `isHydrating` flag during the entire process to prevent the store
 * subscriber from writing back to the URL.
 *
 * @param search — URL search string (without `?`). Falls back to
 *                `window.location.search` if not provided.
 */
export function hydrateFromUrl(search?: string): void {
  if (isHydrating.get()) return; // prevent re-entry

  isHydrating.set(true);

  const searchStr =
    search ?? (typeof window !== 'undefined' ? window.location.search.substring(1) : '');
  const params = parseParams(searchStr);

  // Step 1: Open windows from `w` param
  if (params.w && params.w.length > 0) {
    for (const id of params.w) {
      openWindow(id);
    }
  }

  // Step 2: Focus window — called AFTER all windows are opened so the
  // focused window gets the highest z-index.
  if (params.focus) {
    focusWindow(params.focus);
  }

  // Step 3: Set explorer path
  if (params.path && params.w?.includes('explorer')) {
    const windows = $windows.get();
    const explorer = windows.explorer;
    if (explorer) {
      const resolvedNode = resolvePath(params.path);
      if (resolvedNode) {
        const rawPath = resolvedNode.type === 'file' ? getParent(params.path) : params.path;
        const finalPath = normalize(rawPath);
        $windows.set({
          ...windows,
          explorer: { ...explorer, explorerPath: finalPath },
        });
      } else {
        // Invalid path — fall back to C:\
        $windows.set({
          ...windows,
          explorer: { ...explorer, explorerPath: 'C:\\' },
        });
      }
    }
  }

  // Step 4: Open Start Menu
  if (params.start) {
    openStartMenu();
  }

  isHydrating.set(false);
}

// ─── Debounce Utility ───────────────────────────────────────────────────────

function debounce(fn: () => void, ms: number): () => void {
  let timer: ReturnType<typeof setTimeout> | null = null;
  return () => {
    if (timer !== null) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      try {
        fn();
      } finally {
        timer = null;
      }
    }, ms);
  };
}

// ─── Initialization ─────────────────────────────────────────────────────────

let initialized = false;

/**
 * Initialize URL ↔ store synchronization.
 *
 * Must be called once on application startup in a browser context.
 * - Hydrates stores from current URL on page load (uses `replaceState`).
 * - Subscribes to store changes with 100ms debounce to update URL.
 * - Listens to `popstate` events for browser back/forward navigation.
 *
 * @returns An `unsubscribe` function for cleanup, or `undefined` if called
 *          outside a browser or already initialized.
 */
export function initUrlSync(): (() => void) | undefined {
  if (typeof window === 'undefined') return undefined;
  if (initialized) return undefined;

  initialized = true;

  // ── Hydrate from current URL on page load ─────────────────────────────
  hydrateFromUrl();

  // ── Debounced URL updater ──────────────────────────────────────────────
  const debouncedUpdate = debounce(() => {
    if (isHydrating.get()) return;

    const serialized = serializeState();
    const currentSearch = window.location.search.substring(1);

    // No-op guard: skip if state hasn't changed
    if (serialized === currentSearch) return;

    const action = pendingUrlAction;
    pendingUrlAction = 'replace'; // reset after consuming

    if (action === 'push') {
      window.history.pushState(null, '', serialized ? `?${serialized}` : '/');
    } else {
      window.history.replaceState(null, '', serialized ? `?${serialized}` : '/');
    }
  }, 100);

  // ── Subscribe to store changes ────────────────────────────────────────
  // Intentionally does NOT subscribe to $shuttingDown:
  // shutdown state is transient and should never be persisted in the URL.
  const unsubWindows = $windows.listen(() => {
    debouncedUpdate();
  });

  const unsubDesktop = $startMenuOpen.listen(() => {
    debouncedUpdate();
  });

  // ── Subscribe to $activeWindow changes (for focus tracking) ───────────
  const unsubActive = $activeWindow.listen(() => {
    debouncedUpdate();
  });

  // ── Popstate listener for browser back/forward ────────────────────────
  const onPopState = (): void => {
    // Re-hydrate stores from the URL the browser navigated to.
    // isHydrating flag prevents the subscriber from writing back to the URL.
    const search = window.location.search.substring(1);
    hydrateFromUrl(search);
  };
  window.addEventListener('popstate', onPopState);

  // Return cleanup function
  return () => {
    unsubWindows();
    unsubDesktop();
    unsubActive();
    window.removeEventListener('popstate', onPopState);
    initialized = false;
  };
}
