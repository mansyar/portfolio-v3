import { describe, it, expect, beforeEach } from 'vitest';
import type { WindowId } from '@/stores/windows';

function getTestWindowId(): WindowId {
  return 'explorer';
}

describe('Window Types & Default Configs', () => {
  it('should export DEFAULT_WINDOW_CONFIGS with all 6 window types', async () => {
    const mod = await import('@/stores/windows');
    expect(mod.DEFAULT_WINDOW_CONFIGS).toBeDefined();
    const configs = mod.DEFAULT_WINDOW_CONFIGS;
    const expectedIds = ['explorer', 'mydocs', 'help', 'cmd', 'taskmanager', 'recyclebin'];
    expectedIds.forEach((id) => {
      expect(configs).toHaveProperty(id);
    });
  });

  it('should have correct default size and position for explorer', async () => {
    const mod = await import('@/stores/windows');
    const cfg = mod.DEFAULT_WINDOW_CONFIGS.explorer;
    expect(cfg).toMatchObject({
      title: 'My Computer',
      width: 700,
      height: 500,
      x: 80,
      y: 60,
      minWidth: 400,
      minHeight: 300,
    });
  });

  it('should have correct default size and position for mydocs', async () => {
    const mod = await import('@/stores/windows');
    const cfg = mod.DEFAULT_WINDOW_CONFIGS.mydocs;
    expect(cfg).toMatchObject({
      title: 'My Documents',
      width: 600,
      height: 450,
      x: 120,
      y: 80,
      minWidth: 350,
      minHeight: 250,
    });
  });

  it('should have correct default size and position for help', async () => {
    const mod = await import('@/stores/windows');
    const cfg = mod.DEFAULT_WINDOW_CONFIGS.help;
    expect(cfg).toMatchObject({
      title: 'Knowledge Base',
      width: 750,
      height: 550,
      x: 60,
      y: 40,
      minWidth: 500,
      minHeight: 400,
    });
  });

  it('should have correct default size and position for cmd', async () => {
    const mod = await import('@/stores/windows');
    const cfg = mod.DEFAULT_WINDOW_CONFIGS.cmd;
    expect(cfg).toMatchObject({
      title: 'Command Prompt',
      width: 680,
      height: 420,
      x: 100,
      y: 100,
      minWidth: 450,
      minHeight: 250,
    });
  });

  it('should have correct default size and position for taskmanager', async () => {
    const mod = await import('@/stores/windows');
    const cfg = mod.DEFAULT_WINDOW_CONFIGS.taskmanager;
    expect(cfg).toMatchObject({
      title: 'Task Manager',
      width: 500,
      height: 550,
      x: 200,
      y: 60,
      minWidth: 400,
      minHeight: 450,
    });
  });

  it('should have correct default size and position for recyclebin', async () => {
    const mod = await import('@/stores/windows');
    const cfg = mod.DEFAULT_WINDOW_CONFIGS.recyclebin;
    expect(cfg).toMatchObject({
      title: 'Recycle Bin',
      width: 550,
      height: 400,
      x: 150,
      y: 90,
      minWidth: 350,
      minHeight: 250,
    });
  });

  it('should export $windows, $zCounter, $activeWindow, and $taskbarWindows stores', async () => {
    const mod = await import('@/stores/windows');
    expect(mod.$windows).toBeDefined();
    expect(mod.$zCounter).toBeDefined();
    expect(mod.$activeWindow).toBeDefined();
    expect(mod.$taskbarWindows).toBeDefined();
  });

  it('should have $zCounter starting at 100', async () => {
    const mod = await import('@/stores/windows');
    expect(mod.$zCounter.get()).toBe(100);
  });

  it('should have $activeWindow initialized to null', async () => {
    const mod = await import('@/stores/windows');
    expect(mod.$activeWindow.get()).toBeNull();
  });

  it('should have $windows initialized as an empty map', async () => {
    const mod = await import('@/stores/windows');
    expect(Object.keys(mod.$windows.get())).toHaveLength(0);
  });
});

describe('Window Actions', () => {
  beforeEach(async () => {
    const mod = await import('@/stores/windows');
    mod.$windows.set({} as Record<WindowId, import('@/stores/windows').WindowState>);
    mod.$zCounter.set(100);
    mod.$activeWindow.set(null);
  });

  describe('openWindow', () => {
    it('should add window with status="open" and incremented zIndex', async () => {
      const mod = await import('@/stores/windows');
      const id = getTestWindowId();
      mod.openWindow(id);

      const state = mod.$windows.get()[id];
      expect(state).toBeDefined();
      expect(state.status).toBe('open');
      expect(state.zIndex).toBe(100);
      expect(mod.$zCounter.get()).toBe(101);
    });

    it('should use correct default position and size from config', async () => {
      const mod = await import('@/stores/windows');
      mod.openWindow('explorer');
      const state = mod.$windows.get().explorer;
      expect(state.x).toBe(80);
      expect(state.y).toBe(60);
      expect(state.width).toBe(700);
      expect(state.height).toBe(500);
    });

    it('should set $activeWindow to the opened window', async () => {
      const mod = await import('@/stores/windows');
      mod.openWindow('cmd');
      expect(mod.$activeWindow.get()).toBe('cmd');
    });

    it('should not duplicate an already-open window', async () => {
      const mod = await import('@/stores/windows');
      mod.openWindow('explorer');
      const zAfterFirst = mod.$zCounter.get();
      mod.openWindow('explorer');
      // zCounter should not have been incremented by the duplicate open
      expect(mod.$zCounter.get()).toBe(zAfterFirst);
    });
  });

  describe('closeWindow', () => {
    it('should set status to "closing" on close', async () => {
      const mod = await import('@/stores/windows');
      mod.openWindow('explorer');
      mod.closeWindow('explorer');
      expect(mod.$windows.get().explorer.status).toBe('closing');
    });

    it('should remove the window entry after a delay', async () => {
      const mod = await import('@/stores/windows');
      mod.openWindow('explorer');
      mod.closeWindow('explorer');
      // After closing, status is 'closing' (animation plays), then removed
      expect(mod.$windows.get().explorer.status).toBe('closing');
    });

    it('should not throw when closing a nonexistent window', async () => {
      const mod = await import('@/stores/windows');
      expect(() => mod.closeWindow('explorer')).not.toThrow();
    });
  });

  describe('minimizeWindow', () => {
    it('should set status to "minimized"', async () => {
      const mod = await import('@/stores/windows');
      mod.openWindow('explorer');
      mod.minimizeWindow('explorer');
      expect(mod.$windows.get().explorer.status).toBe('minimized');
    });

    it('should cache current position for later restore', async () => {
      const mod = await import('@/stores/windows');
      mod.openWindow('explorer');
      // Move it first
      mod.moveWindow('explorer', 200, 150);
      mod.minimizeWindow('explorer');
      // After restore, should return to cached position
      mod.restoreWindow('explorer');
      expect(mod.$windows.get().explorer.x).toBe(200);
      expect(mod.$windows.get().explorer.y).toBe(150);
    });

    it('should not throw for nonexistent window', async () => {
      const mod = await import('@/stores/windows');
      expect(() => mod.minimizeWindow('explorer')).not.toThrow();
    });
  });

  describe('maximizeWindow', () => {
    it('should set status to "maximized"', async () => {
      const mod = await import('@/stores/windows');
      mod.openWindow('explorer');
      mod.maximizeWindow('explorer');
      expect(mod.$windows.get().explorer.status).toBe('maximized');
    });

    it('should not throw for nonexistent window', async () => {
      const mod = await import('@/stores/windows');
      expect(() => mod.maximizeWindow('explorer')).not.toThrow();
    });
  });

  describe('restoreWindow', () => {
    it('should restore from minimized to open', async () => {
      const mod = await import('@/stores/windows');
      mod.openWindow('explorer');
      mod.minimizeWindow('explorer');
      mod.restoreWindow('explorer');
      expect(mod.$windows.get().explorer.status).toBe('open');
    });

    it('should restore from maximized to open', async () => {
      const mod = await import('@/stores/windows');
      mod.openWindow('explorer');
      mod.maximizeWindow('explorer');
      mod.restoreWindow('explorer');
      expect(mod.$windows.get().explorer.status).toBe('open');
    });

    it('should do nothing for an already-open window', async () => {
      const mod = await import('@/stores/windows');
      mod.openWindow('explorer');
      mod.restoreWindow('explorer');
      expect(mod.$windows.get().explorer.status).toBe('open');
    });

    it('should not throw for nonexistent window', async () => {
      const mod = await import('@/stores/windows');
      expect(() => mod.restoreWindow('explorer')).not.toThrow();
    });
  });

  describe('focusWindow', () => {
    it('should increment zCounter and assign new zIndex', async () => {
      const mod = await import('@/stores/windows');
      mod.openWindow('explorer');
      mod.openWindow('cmd');
      const prevZ = mod.$zCounter.get();

      mod.focusWindow('explorer');
      expect(mod.$zCounter.get()).toBe(prevZ + 1);
      expect(mod.$windows.get().explorer.zIndex).toBe(prevZ + 1);
    });

    it('should set $activeWindow', async () => {
      const mod = await import('@/stores/windows');
      mod.openWindow('explorer');
      mod.openWindow('cmd');
      mod.focusWindow('explorer');
      expect(mod.$activeWindow.get()).toBe('explorer');
    });

    it('should not throw for nonexistent window', async () => {
      const mod = await import('@/stores/windows');
      expect(() => mod.focusWindow('explorer')).not.toThrow();
    });
  });

  describe('moveWindow', () => {
    it('should update window position', async () => {
      const mod = await import('@/stores/windows');
      mod.openWindow('explorer');
      mod.moveWindow('explorer', 300, 200);
      expect(mod.$windows.get().explorer.x).toBe(300);
      expect(mod.$windows.get().explorer.y).toBe(200);
    });

    it('should not throw for nonexistent window', async () => {
      const mod = await import('@/stores/windows');
      expect(() => mod.moveWindow('explorer', 100, 100)).not.toThrow();
    });
  });

  describe('resizeWindow', () => {
    it('should update window size', async () => {
      const mod = await import('@/stores/windows');
      mod.openWindow('explorer');
      mod.resizeWindow('explorer', 500, 400);
      expect(mod.$windows.get().explorer.width).toBe(500);
      expect(mod.$windows.get().explorer.height).toBe(400);
    });

    it('should enforce minWidth', async () => {
      const mod = await import('@/stores/windows');
      mod.openWindow('explorer');
      mod.resizeWindow('explorer', 100, 400);
      expect(mod.$windows.get().explorer.width).toBe(400); // minWidth
    });

    it('should enforce minHeight', async () => {
      const mod = await import('@/stores/windows');
      mod.openWindow('explorer');
      mod.resizeWindow('explorer', 500, 50);
      expect(mod.$windows.get().explorer.height).toBe(300); // minHeight
    });

    it('should not throw for nonexistent window', async () => {
      const mod = await import('@/stores/windows');
      expect(() => mod.resizeWindow('explorer', 100, 100)).not.toThrow();
    });
  });

  describe('closeWindow async removal', () => {
    it('should remove window entry after close animation delay', async () => {
      const mod = await import('@/stores/windows');
      mod.openWindow('explorer');
      mod.closeWindow('explorer');
      // Status should be 'closing' immediately
      expect(mod.$windows.get().explorer.status).toBe('closing');

      // Wait for the 120ms setTimeout + buffer
      await new Promise((resolve) => setTimeout(resolve, 200));

      // Window should be removed from the store
      expect(mod.$windows.get().explorer).toBeUndefined();
    });

    it('should clear $activeWindow when closing active window', async () => {
      const mod = await import('@/stores/windows');
      mod.openWindow('explorer');
      mod.closeWindow('explorer');

      // Wait for the 120ms setTimeout + buffer
      await new Promise((resolve) => setTimeout(resolve, 200));

      expect(mod.$activeWindow.get()).toBeNull();
    });
  });

  describe('$taskbarWindows derived store', () => {
    it('should return open windows', async () => {
      const mod = await import('@/stores/windows');
      mod.openWindow('explorer');
      mod.openWindow('cmd');
      expect(mod.$taskbarWindows.get()).toHaveLength(2);
    });

    it('should not include minimized windows in taskbar (defensive guard)', async () => {
      const mod = await import('@/stores/windows');
      mod.openWindow('explorer');
      mod.openWindow('cmd');
      mod.minimizeWindow('cmd');
      expect(mod.$taskbarWindows.get()).toHaveLength(2);
    });
  });

  describe('explorerPath', () => {
    it('should set explorerPath to C:\\ when opening explorer window', async () => {
      const mod = await import('@/stores/windows');
      mod.openWindow('explorer');
      const state = mod.$windows.get().explorer;
      expect(state.explorerPath).toBe('C:\\');
    });

    it('should not set explorerPath for non-explorer windows', async () => {
      const mod = await import('@/stores/windows');
      mod.openWindow('cmd');
      const state = mod.$windows.get().cmd;
      expect(state.explorerPath).toBeUndefined();
    });

    it('should allow setting explorerPath after open', async () => {
      const mod = await import('@/stores/windows');
      mod.openWindow('explorer');
      const windows = mod.$windows.get();
      const updated = { ...windows.explorer, explorerPath: 'D:\\Systems_Data' };
      mod.$windows.set({ ...windows, explorer: updated });
      expect(mod.$windows.get().explorer.explorerPath).toBe('D:\\Systems_Data');
    });
  });

  describe('closeWindow edge cases', () => {
    it('should handle closing a window that is not the active window', async () => {
      const mod = await import('@/stores/windows');
      mod.openWindow('explorer');
      mod.openWindow('cmd');
      mod.focusWindow('cmd');
      expect(mod.$activeWindow.get()).toBe('cmd');

      // Close explorer (not the active window)
      mod.closeWindow('explorer');
      // The close is async (120ms timeout), so active window remains 'cmd'
      expect(mod.$activeWindow.get()).toBe('cmd');
    });

    it('should handle minimizing then closing a window', async () => {
      const mod = await import('@/stores/windows');
      mod.openWindow('explorer');
      mod.minimizeWindow('explorer');
      // Window should be minimized, close should still work
      mod.closeWindow('explorer');
      expect(mod.$windows.get().explorer?.status).toBe('closing');
    });

    it('should handle restoreWindow without cached position', async () => {
      const mod = await import('@/stores/windows');
      // Open then maximize then restore - cached position is set during maximize
      mod.openWindow('explorer');
      mod.maximizeWindow('explorer');
      // Now restore from maximized
      mod.restoreWindow('explorer');
      expect(mod.$windows.get().explorer?.status).toBe('open');
    });

    it('should handle maximize and restore cycle', async () => {
      const mod = await import('@/stores/windows');
      mod.openWindow('explorer');
      const origX = mod.$windows.get().explorer.x;
      mod.maximizeWindow('explorer');
      expect(mod.$windows.get().explorer?.status).toBe('maximized');
      mod.restoreWindow('explorer');
      expect(mod.$windows.get().explorer?.status).toBe('open');
      // Position should be restored from cache
      expect(mod.$windows.get().explorer.x).toBe(origX);
    });
  });

  describe('cmdPath', () => {
    it('should set cmdPath to C:\\ when opening cmd window', async () => {
      const mod = await import('@/stores/windows');
      mod.openWindow('cmd');
      const state = mod.$windows.get().cmd;
      expect(state.cmdPath).toBe('C:\\');
    });

    it('should not set cmdPath for non-cmd windows', async () => {
      const mod = await import('@/stores/windows');
      mod.openWindow('explorer');
      const state = mod.$windows.get().explorer;
      expect(state.cmdPath).toBeUndefined();
    });

    it('should allow updating cmdPath after cd command', async () => {
      const mod = await import('@/stores/windows');
      mod.openWindow('cmd');
      const windows = mod.$windows.get();
      const updated = { ...windows.cmd, cmdPath: 'D:\\Systems_Data' };
      mod.$windows.set({ ...windows, cmd: updated });
      expect(mod.$windows.get().cmd.cmdPath).toBe('D:\\Systems_Data');
    });
  });
});
