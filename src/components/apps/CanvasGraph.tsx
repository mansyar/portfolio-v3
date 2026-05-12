import { useRef, useEffect } from 'react';

interface CanvasGraphProps {
  /** Label displayed above the graph */
  label: string;
  /** Width of the canvas in pixels */
  width: number;
  /** Height of the canvas in pixels */
  height: number;
  /** Initial data points to fill the buffer */
  data?: number[];
}

const GRAPH_COLOR = '#00ff00';
const BG_COLOR = '#000000';
const GRID_COLOR = '#003300';
const MAX_POINTS = 60;

function drawGrid(ctx: CanvasRenderingContext2D, width: number, height: number) {
  ctx.strokeStyle = GRID_COLOR;
  ctx.lineWidth = 0.5;

  // Horizontal grid lines (5 divisions)
  for (let i = 0; i <= 4; i++) {
    const y = (height / 4) * i;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }

  // Vertical grid lines (6 divisions)
  for (let i = 0; i <= 6; i++) {
    const x = (width / 6) * i;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }
}

function drawLine(ctx: CanvasRenderingContext2D, data: number[], width: number, height: number) {
  if (data.length < 2) return;

  ctx.strokeStyle = GRAPH_COLOR;
  ctx.lineWidth = 1.5;
  ctx.beginPath();

  const stepX = data.length > 1 ? width / (data.length - 1) : width;

  data.forEach((val, i) => {
    const x = i * stepX;
    const y = height - (val / 100) * height;
    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  });

  ctx.stroke();
}

function drawYLabels(ctx: CanvasRenderingContext2D, width: number, height: number) {
  ctx.fillStyle = GRAPH_COLOR;
  ctx.font = '9px "Tahoma", sans-serif';
  ctx.textAlign = 'right';

  for (let i = 0; i <= 4; i++) {
    const y = (height / 4) * i;
    const label = `${100 - i * 25}%`;
    ctx.fillText(label, width - 4, y + 3);
  }
}

export function CanvasGraph({ label, width, height, data }: CanvasGraphProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dataRef = useRef<number[]>(data ?? []);

  // Initialize data buffer
  useEffect(() => {
    if (data && data.length > 0) {
      dataRef.current = data.slice(-MAX_POINTS);
    } else {
      // Fill with 50% default
      dataRef.current = Array.from({ length: MAX_POINTS }, () => 50);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Draw on mount
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set actual canvas dimensions
    canvas.width = width;
    canvas.height = height;

    // Clear
    ctx.fillStyle = BG_COLOR;
    ctx.fillRect(0, 0, width, height);

    // Draw grid
    drawGrid(ctx, width, height);

    // Draw line
    drawLine(ctx, dataRef.current, width, height);

    // Draw Y-axis labels
    drawYLabels(ctx, width, height);
  }, [width, height]);

  return (
    <div style={{ marginBottom: 8 }}>
      <div
        style={{
          fontFamily: '"Tahoma", sans-serif',
          fontSize: 11,
          fontWeight: 700,
          marginBottom: 2,
          color: '#000000',
        }}
      >
        {label}
      </div>
      <canvas
        ref={canvasRef}
        style={{
          border: '1px solid #808080',
          display: 'block',
          width,
          height,
        }}
      />
    </div>
  );
}
