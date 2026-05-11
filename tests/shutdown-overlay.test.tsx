import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { render, screen, cleanup, act } from '@testing-library/react';
import type { ComponentType } from 'react';

let ShutdownOverlay: ComponentType<{ onClose?: () => void }>;

beforeEach(async () => {
  cleanup();
  vi.useFakeTimers();
  const mod = await import('@/components/taskbar/ShutdownOverlay');
  ShutdownOverlay = mod.ShutdownOverlay;
});

afterEach(() => {
  vi.useRealTimers();
});

describe('ShutdownOverlay', () => {
  it('should render dark overlay with "Windows is shutting down..." text', () => {
    render(<ShutdownOverlay />);
    expect(screen.getByText('Windows is shutting down...')).toBeInTheDocument();
  });

  it('should show an indeterminate progress bar', () => {
    render(<ShutdownOverlay />);
    const overlay = screen.getByText('Windows is shutting down...').closest('[role="status"]');
    expect(overlay).toBeInTheDocument();
    const progressBar = document.querySelector('.shutdown-progress');
    expect(progressBar).toBeInTheDocument();
  });

  it('should call onClose after shutdown sequence completes', () => {
    const onClose = vi.fn();
    render(<ShutdownOverlay onClose={onClose} />);

    // Text should be visible immediately (Phase 1)
    expect(screen.getByText('Windows is shutting down...')).toBeInTheDocument();

    // Advance through full sequence: 3s (shutting down) + 1s (fade) + 2s (black)
    act(() => {
      vi.advanceTimersByTime(6000);
    });

    // Should call onClose after full sequence
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('should not crash when rendered without onClose prop', () => {
    expect(() => render(<ShutdownOverlay />)).not.toThrow();
  });

  it('should clean up timeouts on unmount', () => {
    const onClose = vi.fn();
    const { unmount } = render(<ShutdownOverlay onClose={onClose} />);

    unmount();

    // Advance time past the full sequence
    act(() => {
      vi.advanceTimersByTime(6000);
    });

    // onClose should not be called after unmount
    expect(onClose).not.toHaveBeenCalled();
  });
});
