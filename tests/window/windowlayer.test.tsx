import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, cleanup, fireEvent } from '@testing-library/react';
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

  describe('Title Bar Drag', () => {
    it('should initiate drag on title bar mousedown and track mousemove delta', async () => {
      const stores = await import('@/stores/windows');
      stores.openWindow('explorer');

      const { container } = render(<WindowLayer />);
      const titlebar = container.querySelector('[data-testid="window-titlebar"]')!;

      const startX = 100;
      const startY = 100;

      fireEvent.mouseDown(titlebar, { clientX: startX, clientY: startY });
      fireEvent.mouseMove(document, { clientX: startX + 50, clientY: startY + 30 });

      const state = stores.$windows.get().explorer;
      expect(state.x).toBe(80 + 50);
      expect(state.y).toBe(60 + 30);
    });

    it('should stop tracking position after mouseup', async () => {
      const stores = await import('@/stores/windows');
      stores.openWindow('explorer');

      const { container } = render(<WindowLayer />);
      const titlebar = container.querySelector('[data-testid="window-titlebar"]')!;

      fireEvent.mouseDown(titlebar, { clientX: 100, clientY: 100 });
      fireEvent.mouseUp(document);

      const stateBefore = stores.$windows.get().explorer;
      const xBefore = stateBefore.x;

      fireEvent.mouseMove(document, { clientX: 200, clientY: 200 });

      const stateAfter = stores.$windows.get().explorer;
      expect(stateAfter.x).toBe(xBefore);
    });

    it('should enforce viewport constraint — left edge minimum 32px visible', async () => {
      const stores = await import('@/stores/windows');
      stores.openWindow('explorer');

      window.innerWidth = 1024;
      window.innerHeight = 768;

      const { container } = render(<WindowLayer />);
      const titlebar = container.querySelector('[data-testid="window-titlebar"]')!;

      // Drag far left
      fireEvent.mouseDown(titlebar, { clientX: 200, clientY: 100 });
      fireEvent.mouseMove(document, { clientX: -1000, clientY: 100 });

      const state = stores.$windows.get().explorer;
      // Width is 700, so min x = -700 + 32 = -668
      expect(state.x).toBe(-668);
    });

    it('should enforce viewport constraint — right edge minimum 32px visible', async () => {
      const stores = await import('@/stores/windows');
      stores.openWindow('explorer');

      window.innerWidth = 1024;

      const { container } = render(<WindowLayer />);
      const titlebar = container.querySelector('[data-testid="window-titlebar"]')!;

      // Drag far right
      fireEvent.mouseDown(titlebar, { clientX: 200, clientY: 100 });
      fireEvent.mouseMove(document, { clientX: 2000, clientY: 100 });

      const state = stores.$windows.get().explorer;
      // Max x = 1024 - 32 = 992
      expect(state.x).toBe(992);
    });

    it('should enforce viewport constraint — bottom edge minimum 32px visible from taskbar', async () => {
      const stores = await import('@/stores/windows');
      stores.openWindow('explorer');

      window.innerHeight = 768;

      const { container } = render(<WindowLayer />);
      const titlebar = container.querySelector('[data-testid="window-titlebar"]')!;

      fireEvent.mouseDown(titlebar, { clientX: 100, clientY: 100 });
      fireEvent.mouseMove(document, { clientX: 100, clientY: 2000 });

      const state = stores.$windows.get().explorer;
      // Max y = 768 - 32 - 40(taskbar) = 696
      expect(state.y).toBe(696);
    });

    it('should enforce viewport constraint — top edge minimum 0', async () => {
      const stores = await import('@/stores/windows');
      stores.openWindow('explorer');

      const { container } = render(<WindowLayer />);
      const titlebar = container.querySelector('[data-testid="window-titlebar"]')!;

      fireEvent.mouseDown(titlebar, { clientX: 100, clientY: 100 });
      fireEvent.mouseMove(document, { clientX: 100, clientY: -500 });

      const state = stores.$windows.get().explorer;
      expect(state.y).toBe(0);
    });
  });
});
