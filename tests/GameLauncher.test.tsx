import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, cleanup, screen, act } from '@testing-library/react';

let GameLauncher: React.ComponentType<{ src: string }>;

beforeEach(async () => {
  cleanup();
  vi.useFakeTimers();

  const mod = await import('@/components/apps/GameLauncher');
  GameLauncher = mod.GameLauncher;
});

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

const TEST_URL = 'https://itch.io/embed-upload/17556610?color=333333';

describe('GameLauncher.tsx', () => {
  it('should render an iframe with correct src prop', () => {
    render(<GameLauncher src={TEST_URL} />);
    const iframe = screen.getByTitle('Terminal Tactics');
    expect(iframe).toBeDefined();
    expect(iframe).toHaveAttribute('src', TEST_URL);
  });

  it('should set iframe attributes: title, allow, sandbox', () => {
    render(<GameLauncher src={TEST_URL} />);
    const iframe = screen.getByTitle('Terminal Tactics');
    expect(iframe).toHaveAttribute('title', 'Terminal Tactics');
    expect(iframe).toHaveAttribute('allow', 'fullscreen');
    expect(iframe).toHaveAttribute('sandbox', 'allow-scripts allow-same-origin');
  });

  it('should show "Loading Terminal Tactics..." before iframe load event', () => {
    render(<GameLauncher src={TEST_URL} />);
    expect(screen.getByText('Loading Terminal Tactics...')).toBeDefined();
  });

  it('should transition from loading to ready state on iframe onLoad', () => {
    render(<GameLauncher src={TEST_URL} />);

    // Initially shows loading
    expect(screen.getByText('Loading Terminal Tactics...')).toBeDefined();

    // Fire the iframe load event
    const iframe = screen.getByTitle('Terminal Tactics');
    act(() => {
      iframe.dispatchEvent(new Event('load'));
    });

    // Loading text should be gone
    expect(screen.queryByText('Loading Terminal Tactics...')).toBeNull();
  });

  it('should show error fallback after 15-second timeout when iframe does not load', () => {
    render(<GameLauncher src={TEST_URL} />);

    // Initially shows loading
    expect(screen.getByText('Loading Terminal Tactics...')).toBeDefined();

    // Advance time past the 15-second timeout
    act(() => {
      vi.advanceTimersByTime(15000);
    });

    // Error state should show with "Open in new tab" link
    expect(screen.getByText('Game failed to load.')).toBeDefined();
    const link = screen.getByText('Open in new tab');
    expect(link).toBeDefined();
    expect(link).toHaveAttribute('href', 'https://mansyar.itch.io/terminal-tactics');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('should clear timeout on successful iframe load (no error state)', () => {
    render(<GameLauncher src={TEST_URL} />);

    // Fire load event before timeout
    const iframe = screen.getByTitle('Terminal Tactics');
    act(() => {
      iframe.dispatchEvent(new Event('load'));
    });

    // Advance time past the 15-second timeout
    act(() => {
      vi.advanceTimersByTime(15000);
    });

    // Error state should NOT appear since load succeeded
    expect(screen.queryByText('Game failed to load.')).toBeNull();
    expect(screen.queryByText('Loading Terminal Tactics...')).toBeNull();
  });

  it('should have aria-live="polite" on loading state container', () => {
    render(<GameLauncher src={TEST_URL} />);
    const loadingContainer = screen
      .getByText('Loading Terminal Tactics...')
      .closest('[aria-live="polite"]');
    expect(loadingContainer).not.toBeNull();
  });

  it('should have aria-live="polite" on error state container', () => {
    render(<GameLauncher src={TEST_URL} />);

    act(() => {
      vi.advanceTimersByTime(15000);
    });

    const errorContainer = screen.getByText('Game failed to load.').closest('[aria-live="polite"]');
    expect(errorContainer).not.toBeNull();
  });
});
