import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, cleanup } from '@testing-library/react';

// jsdom doesn't implement HTMLCanvasElement.getContext fully,
// but the component should still render without throwing

beforeEach(() => {
  cleanup();
});

afterEach(() => {
  cleanup();
});

// Mock canvas getContext to avoid "Not implemented" warnings
beforeEach(() => {
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
  };
  // @ts-expect-error - mock for jsdom canvas context
  HTMLCanvasElement.prototype.getContext = vi.fn(() => mockCtx);
});

describe('CanvasGraph', () => {
  it('should render with default data when no data prop provided', async () => {
    const { CanvasGraph } = await import('@/components/apps/CanvasGraph');
    const { container } = render(<CanvasGraph label="CPU" width={200} height={100} />);
    const canvas = container.querySelector('canvas');
    expect(canvas).not.toBeNull();
    expect(container.textContent).toContain('CPU');
  });

  it('should render with provided data array', async () => {
    const { CanvasGraph } = await import('@/components/apps/CanvasGraph');
    const data = [10, 20, 30, 40, 50, 60];
    const { container } = render(
      <CanvasGraph label="Memory" width={200} height={100} data={data} />,
    );
    const canvas = container.querySelector('canvas');
    expect(canvas).not.toBeNull();
    expect(container.textContent).toContain('Memory');
  });

  it('should render with single data point (edge case)', async () => {
    const { CanvasGraph } = await import('@/components/apps/CanvasGraph');
    const data = [50];
    const { container } = render(<CanvasGraph label="Test" width={200} height={100} data={data} />);
    const canvas = container.querySelector('canvas');
    expect(canvas).not.toBeNull();
  });

  it('should render with empty data array (edge case)', async () => {
    const { CanvasGraph } = await import('@/components/apps/CanvasGraph');
    const data: number[] = [];
    const { container } = render(
      <CanvasGraph label="Empty" width={200} height={100} data={data} />,
    );
    const canvas = container.querySelector('canvas');
    expect(canvas).not.toBeNull();
  });

  it('should render label text correctly', async () => {
    const { CanvasGraph } = await import('@/components/apps/CanvasGraph');
    const { container } = render(
      <CanvasGraph label="Skills Utilization" width={300} height={150} />,
    );
    expect(container.textContent).toContain('Skills Utilization');
  });
});
