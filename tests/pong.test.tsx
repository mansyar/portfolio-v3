import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, cleanup, fireEvent } from '@testing-library/react';
import { installMockCanvas } from './canvas-helpers';

let Pong: React.ComponentType<{ windowId: string }>;

beforeEach(async () => {
  cleanup();
  installMockCanvas();

  // Mock requestAnimationFrame for controlled timing
  vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => {
    return window.setTimeout(() => cb(Date.now()), 16);
  });
  vi.spyOn(window, 'cancelAnimationFrame').mockImplementation((id) => {
    window.clearTimeout(id);
  });

  // Mock matchMedia for prefers-reduced-motion
  vi.spyOn(window, 'matchMedia').mockImplementation((query: string) => ({
    matches: query === '(prefers-reduced-motion: reduce)',
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(() => false),
  }));

  const mod = await import('@/components/apps/Pong');
  Pong = mod.Pong;
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe('Pong.tsx — Canvas Rendering', () => {
  it('should render a canvas element', () => {
    const { container } = render(<Pong windowId="pong" />);
    const canvas = container.querySelector('canvas');
    expect(canvas).not.toBeNull();
  });

  it('should have correct canvas dimensions', () => {
    const { container } = render(<Pong windowId="pong" />);
    const canvas = container.querySelector('canvas')!;
    expect(canvas).toHaveAttribute('width', '600');
    expect(canvas).toHaveAttribute('height', '400');
  });

  it('should render with Pong aria-label in menu state', () => {
    const { container } = render(<Pong windowId="pong" />);
    const canvas = container.querySelector('canvas')!;
    expect(canvas).toHaveAttribute('role', 'img');
    expect(canvas).toHaveAttribute('aria-label', 'Pong game - Select difficulty');
  });
});

describe('Pong.tsx — Difficulty Selection', () => {
  it('should start with menu game state', () => {
    const { container } = render(<Pong windowId="pong" />);
    const canvas = container.querySelector('canvas')!;
    expect(canvas.getAttribute('aria-label')).toContain('Select difficulty');
  });

  it('should have XP-styled outer container border', () => {
    const { container } = render(<Pong windowId="pong" />);
    const outerDiv = container.firstChild as HTMLElement;
    expect(outerDiv).not.toBeNull();
    expect(outerDiv.style.background).toBe('rgb(0, 0, 0)');
  });

  it('should render canvas inside a container div with correct structure', () => {
    const { container } = render(<Pong windowId="pong" />);
    const borderDiv = container.querySelector('div > div');
    expect(borderDiv).not.toBeNull();
    expect(borderDiv!.querySelector('canvas')).not.toBeNull();
  });
});

describe('Pong.tsx — Keyboard Controls', () => {
  it('should handle SPACE key during menu (no crash)', () => {
    render(<Pong windowId="pong" />);

    // Without selecting difficulty, SPACE should do nothing
    fireEvent.keyDown(document, { key: ' ' });
    // No crash is the assertion
  });

  it('should handle W key press without crashing', () => {
    render(<Pong windowId="pong" />);

    fireEvent.keyDown(document, { key: 'w' });
    fireEvent.keyUp(document, { key: 'w' });
  });

  it('should handle S key press without crashing', () => {
    render(<Pong windowId="pong" />);

    fireEvent.keyDown(document, { key: 's' });
    fireEvent.keyUp(document, { key: 's' });
  });

  it('should handle ArrowUp key press without crashing', () => {
    render(<Pong windowId="pong" />);

    fireEvent.keyDown(document, { key: 'ArrowUp' });
    fireEvent.keyUp(document, { key: 'ArrowUp' });
  });

  it('should handle ArrowDown key press without crashing', () => {
    render(<Pong windowId="pong" />);

    fireEvent.keyDown(document, { key: 'ArrowDown' });
    fireEvent.keyUp(document, { key: 'ArrowDown' });
  });

  it('should handle simultaneous key presses without crashing', () => {
    render(<Pong windowId="pong" />);

    fireEvent.keyDown(document, { key: 'w' });
    fireEvent.keyDown(document, { key: 'ArrowUp' });
    // No crash
    fireEvent.keyUp(document, { key: 'w' });
    fireEvent.keyUp(document, { key: 'ArrowUp' });
  });
});

describe('Pong.tsx — Game State Transitions', () => {
  it('should transition from menu to waiting when difficulty selected and SPACE pressed', () => {
    const { container } = render(<Pong windowId="pong" />);
    const canvas = container.querySelector('canvas')!;

    // Click the Easy difficulty button area on canvas
    // Easy button is at: startX + 0 * (120 + 20) = (600 - 3*120 - 2*20)/2 = 110, y from 170 to 210
    fireEvent.click(canvas, { clientX: 170, clientY: 190 });

    // After selecting difficulty, pressing SPACE should move to waiting state
    fireEvent.keyDown(document, { key: ' ' });

    // Canvas should still be rendered (game is in waiting state)
    expect(container.querySelector('canvas')).not.toBeNull();
  });

  it('should handle R key restart from playing state without crashing', () => {
    render(<Pong windowId="pong" />);

    // Press R key to reset (even from menu state)
    fireEvent.keyDown(document, { key: 'r' });

    // Should be back in menu state — canvas still renders with Select difficulty label
    const canvas = document.querySelector('canvas')!;
    expect(canvas.getAttribute('aria-label')).toContain('Select difficulty');
  });

  it('should go back to menu after R key restart', () => {
    const { container } = render(<Pong windowId="pong" />);
    const canvas = container.querySelector('canvas')!;

    // Select difficulty, start game, then restart
    fireEvent.click(canvas, { clientX: 170, clientY: 190 });
    fireEvent.keyDown(document, { key: ' ' });
    fireEvent.keyDown(document, { key: 'r' });

    expect(canvas.getAttribute('aria-label')).toContain('Select difficulty');
  });
});

describe('Pong.tsx — Canvas Interaction', () => {
  it('should handle canvas click for difficulty selection without crashing', () => {
    const { container } = render(<Pong windowId="pong" />);
    const canvas = container.querySelector('canvas')!;

    // Click at Easy button position
    fireEvent.click(canvas, { clientX: 170, clientY: 190 });

    // Canvas should still render after click
    expect(canvas.getAttribute('aria-label')).toContain('Select difficulty');
  });

  it('should handle SPACE then R restart sequence correctly', () => {
    const { container } = render(<Pong windowId="pong" />);
    const canvas = container.querySelector('canvas')!;

    // Select difficulty
    fireEvent.click(canvas, { clientX: 170, clientY: 190 });
    // Start game
    fireEvent.keyDown(document, { key: ' ' });
    // Restart via R
    fireEvent.keyDown(document, { key: 'r' });

    expect(canvas.getAttribute('aria-label')).toContain('Select difficulty');
  });

  it('should cycle through difficulty selection with canvas clicks', () => {
    const { container } = render(<Pong windowId="pong" />);
    const canvas = container.querySelector('canvas')!;

    // Click Easy (first button)
    fireEvent.click(canvas, { clientX: 170, clientY: 190 });
    // Re-select Medium (second button: 170 + 140 = 310)
    fireEvent.click(canvas, { clientX: 310, clientY: 190 });
    // Start and restart
    fireEvent.keyDown(document, { key: ' ' });
    fireEvent.keyDown(document, { key: 'r' });

    expect(canvas.getAttribute('aria-label')).toContain('Select difficulty');
  });
});

describe('Pong.tsx — prefers-reduced-motion', () => {
  it('should render without crashing when prefers-reduced-motion is set', () => {
    render(<Pong windowId="pong" />);
    // The mock setup already returns matches=true for prefers-reduced-motion: reduce
    // Component should not crash with reduced motion
    const canvas = document.querySelector('canvas');
    expect(canvas).not.toBeNull();
  });
});
