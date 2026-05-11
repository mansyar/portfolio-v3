import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import type { ComponentType } from 'react';

let Taskbar: ComponentType;

beforeEach(async () => {
  cleanup();
  // Reset stores
  const stores = await import('@/stores/windows');
  // @ts-expect-error - intentional reset
  stores.$windows.set({});
  stores.$zCounter.set(100);
  stores.$activeWindow.set(null);
  // Reset desktop store
  const desktop = await import('@/stores/desktop');
  desktop.$startMenuOpen.set(false);
  const mod = await import('@/components/taskbar/Taskbar');
  Taskbar = mod.Taskbar;
});

describe('Taskbar.tsx', () => {
  it('should render a taskbar element', () => {
    const { container } = render(<Taskbar />);
    expect(container.firstChild).not.toBeNull();
  });

  it('should have role="toolbar" and aria-label="Taskbar"', () => {
    render(<Taskbar />);
    const toolbar = screen.getByRole('toolbar', { name: 'Taskbar' });
    expect(toolbar).toBeInTheDocument();
  });

  it('should render a green Start button with aria-label', () => {
    render(<Taskbar />);
    const startBtn = screen.getByRole('button', { name: 'Start' });
    expect(startBtn).toBeInTheDocument();
    expect(startBtn).toHaveTextContent('Start');
  });

  it('should toggle Start Menu when Start button is clicked', async () => {
    render(<Taskbar />);
    const startBtn = screen.getByRole('button', { name: 'Start' });

    // Menu starts closed
    const desktop = await import('@/stores/desktop');
    expect(desktop.$startMenuOpen.get()).toBe(false);

    // Click opens menu
    fireEvent.click(startBtn);
    expect(desktop.$startMenuOpen.get()).toBe(true);

    // Click again closes menu
    fireEvent.click(startBtn);
    expect(desktop.$startMenuOpen.get()).toBe(false);
  });

  it('should show active style on Start button when menu is open', async () => {
    render(<Taskbar />);
    const startBtn = screen.getByRole('button', { name: 'Start' });

    // Menu closed — no active class
    expect(startBtn.className).not.toContain('active');

    // Open menu — should have active class
    const desktop = await import('@/stores/desktop');
    desktop.$startMenuOpen.set(true);

    // Re-render to reflect store change
    cleanup();
    render(<Taskbar />);
    const updatedBtn = screen.getByRole('button', { name: 'Start' });
    expect(updatedBtn.className).toContain('active');
  });

  it('should render a Clock component in the system tray', () => {
    render(<Taskbar />);
    const toolbar = screen.getByRole('toolbar', { name: 'Taskbar' });
    expect(toolbar).toBeInTheDocument();
    expect(toolbar.textContent).toMatch(/\d{2}:\d{2}/);
  });

  describe('Taskbar Window Buttons', () => {
    it('should render buttons for each open window', async () => {
      const stores = await import('@/stores/windows');
      stores.openWindow('explorer');
      stores.openWindow('cmd');

      render(<Taskbar />);

      expect(screen.getByText('My Computer')).toBeInTheDocument();
      expect(screen.getByText('Command Prompt')).toBeInTheDocument();
    });

    it('should show window icon in taskbar buttons', async () => {
      const stores = await import('@/stores/windows');
      stores.openWindow('explorer');

      render(<Taskbar />);

      const btn = screen.getByText('My Computer').closest('button');
      const img = btn?.querySelector('img');
      expect(img).toHaveAttribute('src', '/icons/my-computer.svg');
    });

    it('should render no window buttons when no windows are open', () => {
      render(<Taskbar />);
      expect(screen.getByText('Start')).toBeInTheDocument();
    });

    it('should minimize focused window on click', async () => {
      const stores = await import('@/stores/windows');
      stores.openWindow('explorer');
      stores.$activeWindow.set('explorer');

      render(<Taskbar />);
      fireEvent.click(screen.getByText('My Computer'));

      expect(stores.$windows.get().explorer.status).toBe('minimized');
    });

    it('should restore + focus minimized window on click', async () => {
      const stores = await import('@/stores/windows');
      stores.openWindow('explorer');
      stores.minimizeWindow('explorer');

      render(<Taskbar />);
      fireEvent.click(screen.getByText('My Computer'));

      const state = stores.$windows.get().explorer;
      expect(state.status).toBe('open');
      expect(stores.$activeWindow.get()).toBe('explorer');
    });

    it('should focus unfocused window on click', async () => {
      const stores = await import('@/stores/windows');
      stores.openWindow('explorer');
      stores.openWindow('cmd');
      stores.$activeWindow.set('explorer');

      render(<Taskbar />);
      fireEvent.click(screen.getByText('Command Prompt'));

      expect(stores.$activeWindow.get()).toBe('cmd');
    });

    it('should apply active visual state for focused window button', async () => {
      const stores = await import('@/stores/windows');
      stores.openWindow('explorer');
      stores.openWindow('cmd');
      stores.$activeWindow.set('explorer');

      render(<Taskbar />);

      const explorerBtn = screen.getByText('My Computer').closest('button');
      const cmdBtn = screen.getByText('Command Prompt').closest('button');

      expect(explorerBtn?.className).toContain('active');
      expect(cmdBtn?.className).not.toContain('active');
    });
  });
});
