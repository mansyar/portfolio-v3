import { describe, it, expect } from 'vitest';

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
      title: 'Help & Support',
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
