import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, cleanup, screen } from '@testing-library/react';
import type { FC } from 'react';

let CmdPrompt: FC<{ windowId: string }>;

beforeEach(async () => {
  cleanup();
  // Reset stores
  const stores = await import('@/stores/windows');
  // @ts-expect-error - intentional reset
  stores.$windows.set({});
  stores.$zCounter.set(100);
  stores.$activeWindow.set(null);
  const mod = await import('@/components/apps/CmdPrompt');
  CmdPrompt = mod.CmdPrompt;
});

afterEach(() => {
  cleanup();
});

describe('CmdPrompt component', () => {
  it('should render with black background and green monospace text', async () => {
    const stores = await import('@/stores/windows');
    stores.openWindow('cmd');

    const { container } = render(<CmdPrompt windowId="cmd" />);
    const terminal = container.firstElementChild as HTMLElement;

    expect(terminal).toBeDefined();
    expect(terminal.style.backgroundColor).toBe('rgb(0, 0, 0)');
    expect(terminal.style.color).toBe('rgb(0, 170, 0)');
  });

  it('should display C:\\MANSYAR> prompt', async () => {
    const stores = await import('@/stores/windows');
    stores.openWindow('cmd');

    render(<CmdPrompt windowId="cmd" />);
    // The prompt should be visible in the output area
    expect(screen.getByText(/C:\\MANSYAR>/)).toBeDefined();
  });

  it('should render an input element for typing commands', async () => {
    const stores = await import('@/stores/windows');
    stores.openWindow('cmd');

    render(<CmdPrompt windowId="cmd" />);
    const input = screen.getByRole('textbox');
    expect(input).toBeDefined();
  });

  it('should have role="terminal" for accessibility', async () => {
    const stores = await import('@/stores/windows');
    stores.openWindow('cmd');

    render(<CmdPrompt windowId="cmd" />);
    const terminal = screen.getByRole('terminal');
    expect(terminal).toBeDefined();
  });
});
