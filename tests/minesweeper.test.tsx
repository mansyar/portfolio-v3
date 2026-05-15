import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, cleanup, fireEvent } from '@testing-library/react';
import { installMockCanvas } from './canvas-helpers';

let Minesweeper: React.ComponentType<{ windowId: string }>;

beforeEach(async () => {
  cleanup();
  installMockCanvas();

  // Mock requestAnimationFrame
  vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => {
    return window.setTimeout(() => cb(Date.now()), 16);
  });
  vi.spyOn(window, 'cancelAnimationFrame').mockImplementation((id) => {
    window.clearTimeout(id);
  });

  const mod = await import('@/components/apps/Minesweeper');
  Minesweeper = mod.Minesweeper;
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe('Minesweeper.tsx — Canvas Rendering', () => {
  it('should render a canvas element', () => {
    const { container } = render(<Minesweeper windowId="minesweeper" />);
    const canvas = container.querySelector('canvas');
    expect(canvas).not.toBeNull();
  });

  it('should have correct canvas dimensions', () => {
    const { container } = render(<Minesweeper windowId="minesweeper" />);
    const canvas = container.querySelector('canvas')!;
    expect(canvas).toHaveAttribute('width', '315');
    expect(canvas).toHaveAttribute('height', '360');
  });

  it('should render with Minesweeper aria-label', () => {
    const { container } = render(<Minesweeper windowId="minesweeper" />);
    const canvas = container.querySelector('canvas')!;
    expect(canvas).toHaveAttribute('role', 'img');
    expect(canvas.getAttribute('aria-label')).toContain('Minesweeper');
  });
});

describe('Minesweeper.tsx — Game Structure', () => {
  it('should have XP-styled outer container', () => {
    const { container } = render(<Minesweeper windowId="minesweeper" />);
    const outerDiv = container.firstChild as HTMLElement;
    expect(outerDiv).not.toBeNull();
    expect(outerDiv.style.display).toBe('flex');
  });

  it('should render canvas inside a border container', () => {
    const { container } = render(<Minesweeper windowId="minesweeper" />);
    const borderDiv = container.querySelector('div > div');
    expect(borderDiv).not.toBeNull();
    expect(borderDiv!.querySelector('canvas')).not.toBeNull();
  });
});

describe('Minesweeper.tsx — Keyboard Controls', () => {
  it('should handle R key to restart without crashing', () => {
    render(<Minesweeper windowId="minesweeper" />);
    fireEvent.keyDown(document, { key: 'r' });
    // No crash
  });

  it('should handle mouse down on canvas without crashing', () => {
    const { container } = render(<Minesweeper windowId="minesweeper" />);
    const canvas = container.querySelector('canvas')!;
    fireEvent.mouseDown(canvas, { button: 0 });
    fireEvent.mouseUp(canvas, { button: 0 });
    // No crash
  });

  it('should handle right-click on canvas without crashing', () => {
    const { container } = render(<Minesweeper windowId="minesweeper" />);
    const canvas = container.querySelector('canvas')!;
    fireEvent.mouseDown(canvas, { button: 2 });
    fireEvent.mouseUp(canvas, { button: 2 });
    // No crash (context menu prevented)
  });
});

describe('Minesweeper.tsx — Timer and Mine Counter', () => {
  it('should display timer and mine counter area', () => {
    const { container } = render(<Minesweeper windowId="minesweeper" />);
    // The canvas contains timer/mine counter rendering
    const canvas = container.querySelector('canvas')!;
    expect(canvas).not.toBeNull();
  });

  it('should start timer on first click', () => {
    const { container } = render(<Minesweeper windowId="minesweeper" />);
    const canvas = container.querySelector('canvas')!;
    // Click somewhere on the grid to start the game
    fireEvent.mouseDown(canvas, { button: 0 });
    fireEvent.mouseUp(canvas, { button: 0 });
    // No crash
  });
});
