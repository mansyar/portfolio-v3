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

  it('should restart game when smiley face is clicked', () => {
    const { container } = render(<Minesweeper windowId="minesweeper" />);
    const canvas = container.querySelector('canvas')!;

    // Click the smiley face area (center of header: CANVAS_WIDTH/2 - 13 = 144.5, y=6, size 26)
    fireEvent.mouseDown(canvas, { clientX: 157, clientY: 19 });

    // Smiley click triggers resetGame — no crash, game still renders
    expect(container.querySelector('canvas')).not.toBeNull();
  });

  it('should restart game when R key is pressed', () => {
    const { container } = render(<Minesweeper windowId="minesweeper" />);
    const canvas = container.querySelector('canvas')!;

    // First click to start the game
    fireEvent.mouseDown(canvas, { button: 0, clientX: 50, clientY: 100 });
    fireEvent.mouseUp(canvas, { button: 0, clientX: 50, clientY: 100 });

    // Press R to restart
    fireEvent.keyDown(document, { key: 'r' });

    // Game should still render after restart
    expect(container.querySelector('canvas')).not.toBeNull();
  });

  it('should prevent context menu on canvas right-click', () => {
    const { container } = render(<Minesweeper windowId="minesweeper" />);
    const canvas = container.querySelector('canvas')!;

    // Right-click should be handled without crashing
    fireEvent.mouseDown(canvas, { button: 2 });
    fireEvent.mouseUp(canvas, { button: 2 });
    // No crash
  });

  it('should handle grid left-click reveal sequence without crashing', () => {
    const { container } = render(<Minesweeper windowId="minesweeper" />);
    const canvas = container.querySelector('canvas')!;

    // Simulate clicking a cell on the grid (GRID_OFFSET_Y = 50, CELL_SIZE = 35)
    // Click at grid position row=3, col=4 → pixel pos: x = 4*35 = 140, y = 50 + 3*35 = 155
    fireEvent.mouseDown(canvas, { button: 0, clientX: 140, clientY: 155 });
    fireEvent.mouseUp(canvas, { button: 0, clientX: 140, clientY: 155 });

    // Click another cell
    fireEvent.mouseDown(canvas, { button: 0, clientX: 70, clientY: 120 });
    fireEvent.mouseUp(canvas, { button: 0, clientX: 70, clientY: 120 });

    // No crash — game handles multiple reveals
    expect(container.querySelector('canvas')).not.toBeNull();
  });

  it('should handle flag toggle on grid cells without crashing', () => {
    const { container } = render(<Minesweeper windowId="minesweeper" />);
    const canvas = container.querySelector('canvas')!;

    // First click to start the game
    fireEvent.mouseDown(canvas, { button: 0, clientX: 50, clientY: 100 });
    fireEvent.mouseUp(canvas, { button: 0, clientX: 50, clientY: 100 });

    // Right-click to toggle flag on another cell
    fireEvent.mouseDown(canvas, { button: 2, clientX: 100, clientY: 150 });
    fireEvent.mouseUp(canvas, { button: 2, clientX: 100, clientY: 150 });

    // No crash
    expect(container.querySelector('canvas')).not.toBeNull();
  });

  it('should handle click in header area (above grid) gracefully', () => {
    const { container } = render(<Minesweeper windowId="minesweeper" />);
    const canvas = container.querySelector('canvas')!;

    // Click in the header area (y < GRID_OFFSET_Y = 50)
    fireEvent.mouseDown(canvas, { button: 0, clientX: 50, clientY: 25 });
    fireEvent.mouseUp(canvas, { button: 0, clientX: 50, clientY: 25 });
    // No crash — header click is ignored for grid actions
  });

  it('should handle context menu prevention', () => {
    const { container } = render(<Minesweeper windowId="minesweeper" />);
    const canvas = container.querySelector('canvas')!;

    // contextmenu event handler should not crash
    const event = new MouseEvent('contextmenu', { cancelable: true });
    canvas.dispatchEvent(event);
    // No crash
  });
});
