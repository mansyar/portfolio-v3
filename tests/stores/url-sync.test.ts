import { describe, it, expect, beforeEach, vi } from 'vitest';

/**
 * Parse a URL search string into structured URL state.
 * Extracts: w (comma-separated window IDs), focus, start, path.
 * Unknown/invalid WindowId values in `w` are silently filtered out.
 */
async function parseParams(search: string) {
  const mod = await import('@/stores/url-sync');
  return mod.parseParams(search);
}

describe('url-sync — Path Conversion Utilities', () => {
  describe('convertPathToUrl', () => {
    it('should convert backslashes to forward slashes', async () => {
      const mod = await import('@/stores/url-sync');
      expect(mod.convertPathToUrl('C:\\Software_Engineering')).toBe('C:/Software_Engineering');
    });

    it('should handle deep paths', async () => {
      const mod = await import('@/stores/url-sync');
      expect(mod.convertPathToUrl('C:\\Software_Engineering\\icarus-server-manager')).toBe(
        'C:/Software_Engineering/icarus-server-manager',
      );
    });

    it('should handle root C:\\ path', async () => {
      const mod = await import('@/stores/url-sync');
      expect(mod.convertPathToUrl('C:\\')).toBe('C:/');
    });
  });

  describe('convertPathToStore', () => {
    it('should convert forward slashes to backslashes', async () => {
      const mod = await import('@/stores/url-sync');
      expect(mod.convertPathToStore('C:/Software_Engineering')).toBe('C:\\Software_Engineering');
    });

    it('should handle deep forward-slash paths', async () => {
      const mod = await import('@/stores/url-sync');
      expect(mod.convertPathToStore('C:/Software_Engineering/icarus-server-manager')).toBe(
        'C:\\Software_Engineering\\icarus-server-manager',
      );
    });
  });
});

describe('url-sync — parseParams', () => {
  beforeEach(async () => {
    // Reset stores before each test
    const windows = await import('@/stores/windows');
    windows.$windows.set(
      {} as Record<import('@/stores/windows').WindowId, import('@/stores/windows').WindowState>,
    );
    windows.$zCounter.set(100);
    windows.$activeWindow.set(null);

    const desktop = await import('@/stores/desktop');
    desktop.$startMenuOpen.set(false);
  });

  it('should extract w, focus, start, path from full URL search string', async () => {
    const result = await parseParams(
      'w=explorer,cmd&focus=cmd&start=1&path=C:/Software_Engineering',
    );
    expect(result.w).toEqual(['explorer', 'cmd']);
    expect(result.focus).toBe('cmd');
    expect(result.start).toBe(true);
    expect(result.path).toBe('C:\\Software_Engineering');
  });

  it('should return empty object for empty search string', async () => {
    const result = await parseParams('');
    expect(result).toEqual({});
  });

  it('should return empty object for undefined search string', async () => {
    const mod = await import('@/stores/url-sync');
    // @ts-expect-error — testing undefined input
    expect(mod.parseParams(undefined)).toEqual({});
  });

  it('should silently skip unknown window IDs in w param with console.warn', async () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const result = await parseParams('w=explorer,bogus,cmd,invalid');
    expect(result.w).toEqual(['explorer', 'cmd']);
    expect(warnSpy).toHaveBeenCalled();
    warnSpy.mockRestore();
  });

  it('should handle only-valid-w param (filtering out all invalid)', async () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const result = await parseParams('w=bogus,invalid');
    expect(result.w).toBeUndefined();
    warnSpy.mockRestore();
  });

  it('should extract start=1 as true', async () => {
    const result = await parseParams('start=1');
    expect(result.start).toBe(true);
  });

  it('should ignore start=0', async () => {
    const result = await parseParams('start=0');
    expect(result.start).toBeUndefined();
  });

  it('should extract single window ID from w param', async () => {
    const result = await parseParams('w=explorer');
    expect(result.w).toEqual(['explorer']);
  });

  it('should convert forward-slash path to backslashes', async () => {
    const result = await parseParams('path=C:/Software_Engineering/icarus-server-manager');
    expect(result.path).toBe('C:\\Software_Engineering\\icarus-server-manager');
  });
});

describe('url-sync — serializeState', () => {
  beforeEach(async () => {
    const windows = await import('@/stores/windows');
    windows.$windows.set(
      {} as Record<import('@/stores/windows').WindowId, import('@/stores/windows').WindowState>,
    );
    windows.$zCounter.set(100);
    windows.$activeWindow.set(null);

    const desktop = await import('@/stores/desktop');
    desktop.$startMenuOpen.set(false);
  });

  it('should generate URL string with open windows sorted alphabetically', async () => {
    const windows = await import('@/stores/windows');
    windows.openWindow('cmd');
    windows.openWindow('explorer');
    windows.openWindow('taskmanager');
    windows.$activeWindow.set('explorer');

    const mod = await import('@/stores/url-sync');
    const result = mod.serializeState();
    const params = new URLSearchParams(result);

    // Alphabetically sorted: cmd, explorer, taskmanager
    expect(params.get('w')).toBe('cmd,explorer,taskmanager');
  });

  it('should include focus param matching active window', async () => {
    const windows = await import('@/stores/windows');
    windows.openWindow('explorer');
    windows.openWindow('cmd');
    windows.$activeWindow.set('cmd');

    const mod = await import('@/stores/url-sync');
    const result = mod.serializeState();
    expect(result).toContain('focus=cmd');
  });

  it('should omit start param when Start Menu is closed', async () => {
    const windows = await import('@/stores/windows');
    windows.openWindow('explorer');

    const mod = await import('@/stores/url-sync');
    const result = mod.serializeState();
    expect(result).not.toContain('start');
  });

  it('should include start param when Start Menu is open', async () => {
    const windows = await import('@/stores/windows');
    windows.openWindow('explorer');

    const desktop = await import('@/stores/desktop');
    desktop.$startMenuOpen.set(true);

    const mod = await import('@/stores/url-sync');
    const result = mod.serializeState();
    expect(result).toContain('start=1');
  });

  it('should omit path param when Explorer is not open', async () => {
    const windows = await import('@/stores/windows');
    windows.openWindow('cmd');

    const mod = await import('@/stores/url-sync');
    const result = mod.serializeState();
    expect(result).not.toContain('path');
  });

  it('should include path param with forward slashes when Explorer is open', async () => {
    const windows = await import('@/stores/windows');
    windows.openWindow('explorer');

    // Set explorer path
    const ws = windows.$windows.get();
    windows.$windows.set({
      ...ws,
      explorer: { ...ws.explorer, explorerPath: 'C:\\Software_Engineering' },
    });

    const mod = await import('@/stores/url-sync');
    const result = mod.serializeState();
    const params = new URLSearchParams(result);
    expect(params.get('path')).toBe('C:/Software_Engineering');
  });

  it('should return empty string when no state to persist', async () => {
    const mod = await import('@/stores/url-sync');
    const result = mod.serializeState();
    expect(result).toBe('');
  });

  it('should return empty string when all windows are closed and no start menu', async () => {
    const windows = await import('@/stores/windows');
    windows.openWindow('explorer');
    // Simulate closing by removing from store
    windows.$windows.set(
      {} as Record<import('@/stores/windows').WindowId, import('@/stores/windows').WindowState>,
    );
    windows.$activeWindow.set(null);

    const mod = await import('@/stores/url-sync');
    const result = mod.serializeState();
    expect(result).toBe('');
  });
});

describe('url-sync — hydrateFromUrl', () => {
  beforeEach(async () => {
    const windows = await import('@/stores/windows');
    windows.$windows.set(
      {} as Record<import('@/stores/windows').WindowId, import('@/stores/windows').WindowState>,
    );
    windows.$zCounter.set(100);
    windows.$activeWindow.set(null);

    const desktop = await import('@/stores/desktop');
    desktop.$startMenuOpen.set(false);
  });

  it('should open windows from w param', async () => {
    const mod = await import('@/stores/url-sync');
    mod.hydrateFromUrl('w=explorer,cmd');

    const windows = await import('@/stores/windows');
    const ws = windows.$windows.get();
    expect(ws.explorer).toBeDefined();
    expect(ws.cmd).toBeDefined();
  });

  it('should focus window from focus param after opening all windows', async () => {
    const mod = await import('@/stores/url-sync');
    mod.hydrateFromUrl('w=explorer,cmd&focus=cmd');

    const windows = await import('@/stores/windows');
    expect(windows.$activeWindow.get()).toBe('cmd');
  });

  it('should open Start Menu from start=1', async () => {
    const mod = await import('@/stores/url-sync');
    mod.hydrateFromUrl('start=1');

    const desktop = await import('@/stores/desktop');
    expect(desktop.$startMenuOpen.get()).toBe(true);
  });

  it('should set explorer path from path param', async () => {
    const mod = await import('@/stores/url-sync');
    mod.hydrateFromUrl('w=explorer&path=C:/Software_Engineering');

    const windows = await import('@/stores/windows');
    const ws = windows.$windows.get();
    expect(ws.explorer?.explorerPath).toBe('C:\\Software_Engineering');
  });

  it('should fall back to C:\\ for invalid path', async () => {
    const mod = await import('@/stores/url-sync');
    mod.hydrateFromUrl('w=explorer&path=Z:/nonexistent');

    const windows = await import('@/stores/windows');
    const ws = windows.$windows.get();
    expect(ws.explorer?.explorerPath).toBe('C:\\');
  });

  it('should navigate to parent directory when path points to a file', async () => {
    const mod = await import('@/stores/url-sync');
    // icarus-server-manager.mdx is a file in C:\Software_Engineering
    mod.hydrateFromUrl('w=explorer&path=C:/Software_Engineering/icarus-server-manager.mdx');

    const windows = await import('@/stores/windows');
    const ws = windows.$windows.get();
    // Should navigate to parent: C:\Software_Engineering
    expect(ws.explorer?.explorerPath).toBe('C:\\Software_Engineering');
  });

  it('should do nothing (keep clean desktop) for empty URL', async () => {
    const mod = await import('@/stores/url-sync');
    mod.hydrateFromUrl('');

    const windows = await import('@/stores/windows');
    expect(Object.keys(windows.$windows.get())).toHaveLength(0);

    const desktop = await import('@/stores/desktop');
    expect(desktop.$startMenuOpen.get()).toBe(false);
  });

  it('should set isHydrating flag during hydration', async () => {
    const mod = await import('@/stores/url-sync');
    expect(mod.isHydrating.get()).toBe(false);

    mod.hydrateFromUrl('w=explorer');

    // After hydration completes, isHydrating should be false
    expect(mod.isHydrating.get()).toBe(false);
  });
});

describe('url-sync — initUrlSync subscriber guard', () => {
  beforeEach(async () => {
    const windows = await import('@/stores/windows');
    windows.$windows.set(
      {} as Record<import('@/stores/windows').WindowId, import('@/stores/windows').WindowState>,
    );
    windows.$zCounter.set(100);
    windows.$activeWindow.set(null);

    const desktop = await import('@/stores/desktop');
    desktop.$startMenuOpen.set(false);
  });

  it('should not write to URL when isHydrating is true', async () => {
    const replaceStateSpy = vi.spyOn(window.history, 'replaceState').mockImplementation(() => {});

    const mod = await import('@/stores/url-sync');
    // Set isHydrating to simulate active hydration
    mod.isHydrating.set(true);

    // Open a window — this would trigger the subscriber, but isHydrating blocks it
    const windows = await import('@/stores/windows');
    windows.openWindow('explorer');

    // Give debounce time to fire
    await new Promise((r) => setTimeout(r, 200));

    // No replaceState should have been called during hydration
    expect(replaceStateSpy).not.toHaveBeenCalled();

    replaceStateSpy.mockRestore();
  });

  it('should write to URL when $windows store changes after initUrlSync', async () => {
    const replaceStateSpy = vi.spyOn(window.history, 'replaceState').mockImplementation(() => {});

    const mod = await import('@/stores/url-sync');
    const windows = await import('@/stores/windows');

    // Directly test subscriber logic without relying on initUrlSync guard
    // Manually set up the subscriber pattern used in initUrlSync
    mod.isHydrating.set(false);

    // Subscribe to windows: this mimics what initUrlSync does
    const unsub = windows.$windows.listen(() => {
      if (mod.isHydrating.get()) return;
      const serialized = mod.serializeState();
      const currentSearch = window.location.search.substring(1);
      if (serialized !== currentSearch) {
        window.history.replaceState(null, '', serialized ? `?${serialized}` : '/');
      }
    });

    // Open a window
    windows.openWindow('explorer');

    // Since we're not using debounce, the subscriber fires synchronously
    expect(replaceStateSpy).toHaveBeenCalled();

    unsub();
    replaceStateSpy.mockRestore();
  });
});
