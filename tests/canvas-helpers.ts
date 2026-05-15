import { vi } from 'vitest';

/**
 * Create a mock canvas 2D context for jsdom tests.
 * Follows the pattern established in canvas-graph.test.tsx.
 */
export function createMockCanvasContext() {
  const mockCtx = {
    strokeStyle: '',
    lineWidth: 1,
    fillStyle: '',
    font: '',
    textAlign: '',
    beginPath: vi.fn(),
    moveTo: vi.fn(),
    lineTo: vi.fn(),
    stroke: vi.fn(),
    fillText: vi.fn(),
    fillRect: vi.fn(),
    arc: vi.fn(),
    clearRect: vi.fn(),
    closePath: vi.fn(),
    measureText: vi.fn(() => ({ width: 10 })),
    translate: vi.fn(),
    save: vi.fn(),
    restore: vi.fn(),
    fill: vi.fn(),
    strokeRect: vi.fn(),
    setLineDash: vi.fn(),
    textBaseline: '',
  };

  return mockCtx;
}

/**
 * Install the mock canvas context on HTMLCanvasElement.prototype.getContext.
 * Call this in a beforeEach block in any test file that renders canvas components.
 */
export function installMockCanvas() {
  const mockCtx = createMockCanvasContext();
  // @ts-expect-error - mock for jsdom canvas context
  HTMLCanvasElement.prototype.getContext = vi.fn(() => mockCtx);
  return mockCtx;
}

/**
 * Restore the original getContext (un-mock it).
 * Call in afterEach if needed.
 */
export function uninstallMockCanvas() {
  // @ts-expect-error - restoring original
  delete HTMLCanvasElement.prototype.getContext;
}
