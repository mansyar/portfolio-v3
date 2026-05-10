import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';

// This test will fail initially (Red phase) since Clock.tsx doesn't exist yet
describe('Clock.tsx', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should display current time in HH:MM format', async () => {
    // Set a fixed time: 14:30
    const mockDate = new Date(2026, 4, 11, 14, 30, 0);
    vi.setSystemTime(mockDate);

    const { default: Clock } = await import('@/components/taskbar/Clock');
    render(<Clock />);

    expect(screen.getByText('14:30')).toBeInTheDocument();
  });

  it('should update time after 60 seconds', async () => {
    const mockDate = new Date(2026, 4, 11, 9, 5, 0);
    vi.setSystemTime(mockDate);

    const { default: Clock } = await import('@/components/taskbar/Clock');
    render(<Clock />);

    expect(screen.getByText('09:05')).toBeInTheDocument();

    // Advance time by 60 seconds (to 09:06)
    act(() => {
      vi.advanceTimersByTime(60000);
    });

    expect(screen.getByText('09:06')).toBeInTheDocument();
  });

  it('should pad single-digit hours and minutes', async () => {
    const mockDate = new Date(2026, 4, 11, 3, 7, 0);
    vi.setSystemTime(mockDate);

    const { default: Clock } = await import('@/components/taskbar/Clock');
    render(<Clock />);

    expect(screen.getByText('03:07')).toBeInTheDocument();
  });
});
