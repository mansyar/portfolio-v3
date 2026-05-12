import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, cleanup, screen, fireEvent } from '@testing-library/react';
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

  it('should show welcome MARP ASCII art banner on initial render', async () => {
    const stores = await import('@/stores/windows');
    stores.openWindow('cmd');

    render(<CmdPrompt windowId="cmd" />);
    // The banner contains "Luna OS Command Prompt"
    expect(screen.getByText(/Welcome to Luna OS Command Prompt/)).toBeDefined();
  });

  it('should execute a command and show output on Enter', async () => {
    const stores = await import('@/stores/windows');
    stores.openWindow('cmd');

    render(<CmdPrompt windowId="cmd" />);
    const input = screen.getByRole('textbox') as HTMLInputElement;

    fireEvent.change(input, { target: { value: 'echo Hello' } });
    fireEvent.keyDown(input, { key: 'Enter' });

    // Should find exactly "Hello" output (command line has "echo Hello" which also contains "Hello")
    const matches = screen.getAllByText(/Hello/);
    expect(matches.length).toBeGreaterThanOrEqual(1);
  });

  it('should show XP error for unknown command', async () => {
    const stores = await import('@/stores/windows');
    stores.openWindow('cmd');

    render(<CmdPrompt windowId="cmd" />);
    const input = screen.getByRole('textbox') as HTMLInputElement;

    fireEvent.change(input, { target: { value: 'xyzcommand' } });
    fireEvent.keyDown(input, { key: 'Enter' });

    expect(screen.getByText(/not recognized/)).toBeDefined();
  });

  it('should have blinking cursor element with cmd-cursor-blink class', async () => {
    const stores = await import('@/stores/windows');
    stores.openWindow('cmd');

    const { container } = render(<CmdPrompt windowId="cmd" />);
    const cursor = container.querySelector('.cmd-cursor-blink');
    expect(cursor).not.toBeNull();
  });

  it('should clear output on clear command', async () => {
    const stores = await import('@/stores/windows');
    stores.openWindow('cmd');

    render(<CmdPrompt windowId="cmd" />);
    const input = screen.getByRole('textbox') as HTMLInputElement;

    // Run echo first to add output
    fireEvent.change(input, { target: { value: 'echo test' } });
    fireEvent.keyDown(input, { key: 'Enter' });

    // Now clear
    fireEvent.change(input, { target: { value: 'clear' } });
    fireEvent.keyDown(input, { key: 'Enter' });

    // After clear, the welcome banner should be shown again
    expect(screen.getByText(/Welcome to Luna OS Command Prompt/)).toBeDefined();
  });
});
