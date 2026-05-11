import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, cleanup } from '@testing-library/react';
import type { FC } from 'react';

let WindowLayer: FC<object>;

beforeEach(async () => {
  cleanup();
  // Reset stores before each test
  const stores = await import('@/stores/windows');
  // @ts-expect-error - intentionally clearing window store for test isolation
  stores.$windows.set({});
  stores.$zCounter.set(100);
  stores.$activeWindow.set(null);
  stores.$zCounter.set(100);
  stores.$activeWindow.set(null);
  const mod = await import('@/components/window/WindowLayer');
  WindowLayer = mod.WindowLayer;
});

afterEach(() => {
  cleanup();
});

describe('WindowLayer.tsx', () => {
  it('should render nothing when no windows are open', () => {
    const { container } = render(<WindowLayer />);
    expect(container.innerHTML).toBe('');
  });

  it('should render WindowFrame for each open window', async () => {
    const stores = await import('@/stores/windows');
    stores.openWindow('explorer');
    stores.openWindow('cmd');

    const { container } = render(<WindowLayer />);
    const frames = container.querySelectorAll('[class*="xp-window-border"]');
    expect(frames.length).toBe(2);
  });

  it('should register CustomEvent listener for luna:open-window', () => {
    const addEventListenerSpy = vi.spyOn(document, 'addEventListener');
    render(<WindowLayer />);
    expect(addEventListenerSpy).toHaveBeenCalledWith('luna:open-window', expect.any(Function));
  });

  it('should open window when luna:open-window event is dispatched', async () => {
    const stores = await import('@/stores/windows');
    render(<WindowLayer />);

    document.dispatchEvent(new CustomEvent('luna:open-window', { detail: 'explorer' }));

    const windows = stores.$windows.get();
    expect(windows.explorer).toBeDefined();
    expect(windows.explorer.status).toBe('open');
  });

  it('should render correct number of WindowFrames after opening multiple windows', async () => {
    const stores = await import('@/stores/windows');
    render(<WindowLayer />);

    document.dispatchEvent(new CustomEvent('luna:open-window', { detail: 'explorer' }));
    document.dispatchEvent(new CustomEvent('luna:open-window', { detail: 'cmd' }));
    document.dispatchEvent(new CustomEvent('luna:open-window', { detail: 'mydocs' }));

    const windows = stores.$windows.get();
    expect(Object.keys(windows)).toHaveLength(3);
  });

  it('should set focus when clicking on a window frame', async () => {
    const stores = await import('@/stores/windows');
    stores.openWindow('explorer');
    stores.openWindow('cmd');

    render(<WindowLayer />);

    // Focus cmd (the last opened, so it's active)
    stores.focusWindow('cmd');
    expect(stores.$activeWindow.get()).toBe('cmd');
  });
});
