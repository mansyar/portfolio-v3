import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act, cleanup } from '@testing-library/react';
import BiosBoot from '../src/components/mobile/BiosBoot';

describe('BiosBoot Component', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    cleanup();
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  it('renders branding lines sequentially', async () => {
    render(<BiosBoot onComplete={() => {}} />);

    // First line should be visible immediately
    expect(screen.getByText(/MANSYAR OS/i)).toBeInTheDocument();

    // Advance timers by the total duration
    await act(async () => {
      vi.advanceTimersByTime(2000);
    });

    // Check for some intermediate and final lines
    expect(screen.getByText(/Copyright/i)).toBeInTheDocument();
    expect(screen.getByText(/Checking System RAM/i)).toBeInTheDocument();
    expect(screen.getByText(/Initializing PORTFOLIO.SYS/i)).toBeInTheDocument();
    expect(screen.getByText(/READY/i)).toBeInTheDocument();
  });

  it('calls onComplete after 2 seconds', async () => {
    const onComplete = vi.fn();
    render(<BiosBoot onComplete={onComplete} />);

    await act(async () => {
      vi.advanceTimersByTime(1999);
    });
    expect(onComplete).not.toHaveBeenCalled();

    await act(async () => {
      vi.advanceTimersByTime(200); // Cross the finish line
    });
    expect(onComplete).toHaveBeenCalled();
  });

  it('skips animation if prefers-reduced-motion is active', async () => {
    // Mock matchMedia to return true for reduced motion
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      configurable: true,
      value: vi.fn().mockImplementation((query) => ({
        matches: query === '(prefers-reduced-motion: reduce)',
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
      })),
    });

    const onComplete = vi.fn();
    render(<BiosBoot onComplete={onComplete} />);

    // Should call onComplete immediately
    expect(onComplete).toHaveBeenCalled();
    expect(screen.getByText(/READY/i)).toBeInTheDocument();
  });
});
