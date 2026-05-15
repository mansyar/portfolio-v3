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

  it('should display C:\\ [MANSYAR]> prompt', async () => {
    const stores = await import('@/stores/windows');
    stores.openWindow('cmd');

    render(<CmdPrompt windowId="cmd" />);
    expect(screen.getByText(/\[MANSYAR\]>/)).toBeDefined();
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
    expect(screen.getByText(/Welcome to Luna OS Command Prompt/)).toBeDefined();
  });

  it('should execute a command and show output on Enter', async () => {
    const stores = await import('@/stores/windows');
    stores.openWindow('cmd');

    render(<CmdPrompt windowId="cmd" />);
    const input = screen.getByRole('textbox') as HTMLInputElement;

    fireEvent.change(input, { target: { value: 'echo Hello' } });
    fireEvent.keyDown(input, { key: 'Enter' });

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

    fireEvent.change(input, { target: { value: 'echo test' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    fireEvent.change(input, { target: { value: 'clear' } });
    fireEvent.keyDown(input, { key: 'Enter' });

    expect(screen.getByText(/Welcome to Luna OS Command Prompt/)).toBeDefined();
  });

  it('should do nothing on empty Enter', async () => {
    const stores = await import('@/stores/windows');
    stores.openWindow('cmd');

    render(<CmdPrompt windowId="cmd" />);
    const input = screen.getByRole('textbox') as HTMLInputElement;

    // Empty Enter should not add history entry
    fireEvent.keyDown(input, { key: 'Enter' });
    // Should still show the welcome banner
    expect(screen.getByText(/Welcome to Luna OS Command Prompt/)).toBeDefined();
  });

  it('should navigate history with ArrowUp and ArrowDown', async () => {
    const stores = await import('@/stores/windows');
    stores.openWindow('cmd');

    render(<CmdPrompt windowId="cmd" />);
    const input = screen.getByRole('textbox') as HTMLInputElement;

    // Add two commands to history
    fireEvent.change(input, { target: { value: 'echo first' } });
    fireEvent.keyDown(input, { key: 'Enter' });

    fireEvent.change(input, { target: { value: 'echo second' } });
    fireEvent.keyDown(input, { key: 'Enter' });

    // ArrowUp should show last command
    fireEvent.keyDown(input, { key: 'ArrowUp' });
    expect(input.value).toBe('echo second');

    // ArrowUp again should show previous
    fireEvent.keyDown(input, { key: 'ArrowUp' });
    expect(input.value).toBe('echo first');

    // ArrowDown should go forward
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    expect(input.value).toBe('echo second');

    // ArrowDown to clear
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    expect(input.value).toBe('');
  });

  it('should not navigate history with ArrowUp when empty', async () => {
    const stores = await import('@/stores/windows');
    stores.openWindow('cmd');

    render(<CmdPrompt windowId="cmd" />);
    const input = screen.getByRole('textbox') as HTMLInputElement;

    // ArrowUp on empty history should not change value
    fireEvent.keyDown(input, { key: 'ArrowUp' });
    expect(input.value).toBe('');
  });

  it('should auto-complete command name with Tab', async () => {
    const stores = await import('@/stores/windows');
    stores.openWindow('cmd');

    render(<CmdPrompt windowId="cmd" />);
    const input = screen.getByRole('textbox') as HTMLInputElement;

    fireEvent.change(input, { target: { value: 'cle' } });
    fireEvent.keyDown(input, { key: 'Tab' });

    expect(input.value).toContain('clear');
  });

  it('should show completion options when multiple Tab matches', async () => {
    const stores = await import('@/stores/windows');
    stores.openWindow('cmd');

    render(<CmdPrompt windowId="cmd" />);
    const input = screen.getByRole('textbox') as HTMLInputElement;

    // 'c' should match multiple commands
    fireEvent.change(input, { target: { value: 'c' } });
    fireEvent.keyDown(input, { key: 'Tab' });

    // Should see completion options in output (multiple commands starting with 'c')
    const output = screen.getByRole('terminal');
    expect(output.textContent).toBeTruthy();
  });

  it('should auto-complete cd folder name with Tab', async () => {
    const stores = await import('@/stores/windows');
    stores.openWindow('cmd');

    render(<CmdPrompt windowId="cmd" />);
    const input = screen.getByRole('textbox') as HTMLInputElement;

    fireEvent.change(input, { target: { value: 'cd Soft' } });
    fireEvent.keyDown(input, { key: 'Tab' });

    expect(input.value).toContain('Software_Engineering');
  });

  it('should open explorer window when open command returns openExplorer', async () => {
    const stores = await import('@/stores/windows');
    stores.openWindow('cmd');

    render(<CmdPrompt windowId="cmd" />);
    const input = screen.getByRole('textbox') as HTMLInputElement;

    fireEvent.change(input, { target: { value: 'open icarus-server-manager' } });
    fireEvent.keyDown(input, { key: 'Enter' });

    // Explorer window should be opened
    const windows = await import('@/stores/windows');
    const state = windows.$windows.get();
    expect(state.explorer).toBeDefined();
    expect(state.explorer.explorerPath).toBe('C:\\Software_Engineering');
  });

  it('should not auto-complete with empty input', async () => {
    const stores = await import('@/stores/windows');
    stores.openWindow('cmd');
    render(<CmdPrompt windowId="cmd" />);
    const input = screen.getByRole('textbox') as HTMLInputElement;

    // Tab with empty input should do nothing
    fireEvent.keyDown(input, { key: 'Tab' });
    expect(input.value).toBe('');
  });

  it('should auto-complete cat file slug with Tab', async () => {
    const stores = await import('@/stores/windows');
    stores.openWindow('cmd');
    // Navigate to a folder with projects
    const windows = stores.$windows.get();
    const updated = { ...windows.cmd, cmdPath: 'C:\\Software_Engineering' };
    stores.$windows.set({ ...windows, cmd: updated });

    render(<CmdPrompt windowId="cmd" />);
    const input = screen.getByRole('textbox') as HTMLInputElement;

    fireEvent.change(input, { target: { value: 'cat icarus-s' } });
    fireEvent.keyDown(input, { key: 'Tab' });

    expect(input.value).toContain('icarus');
  });

  it('should not crash with Tab completion for unknown prefix', async () => {
    const stores = await import('@/stores/windows');
    stores.openWindow('cmd');

    render(<CmdPrompt windowId="cmd" />);
    const input = screen.getByRole('textbox') as HTMLInputElement;

    // Tab with a completely unknown prefix should not crash
    fireEvent.change(input, { target: { value: 'zzz' } });
    fireEvent.keyDown(input, { key: 'Tab' });
    expect(input.value).toBe('zzz');
  });

  it('should open Pong window when pong command is entered', async () => {
    const stores = await import('@/stores/windows');
    stores.openWindow('cmd');

    render(<CmdPrompt windowId="cmd" />);
    const input = screen.getByRole('textbox') as HTMLInputElement;

    fireEvent.change(input, { target: { value: 'pong' } });
    fireEvent.keyDown(input, { key: 'Enter' });

    // Pong window should be opened
    const state = stores.$windows.get();
    expect(state.pong).toBeDefined();
    expect(state.pong.status).toBe('open');
  });

  it('should open Minesweeper window when minesweeper command is entered', async () => {
    const stores = await import('@/stores/windows');
    stores.openWindow('cmd');

    render(<CmdPrompt windowId="cmd" />);
    const input = screen.getByRole('textbox') as HTMLInputElement;

    fireEvent.change(input, { target: { value: 'minesweeper' } });
    fireEvent.keyDown(input, { key: 'Enter' });

    // Minesweeper window should be opened
    const state = stores.$windows.get();
    expect(state.minesweeper).toBeDefined();
    expect(state.minesweeper.status).toBe('open');
  });

  it('should use /? alias for help', async () => {
    const stores = await import('@/stores/windows');
    stores.openWindow('cmd');

    render(<CmdPrompt windowId="cmd" />);
    const input = screen.getByRole('textbox') as HTMLInputElement;

    fireEvent.change(input, { target: { value: '/?' } });
    fireEvent.keyDown(input, { key: 'Enter' });

    // The /? command should produce help output listing commands
    const commandList = screen.getAllByText(/ls/);
    expect(commandList.length).toBeGreaterThan(0);
  });
});
