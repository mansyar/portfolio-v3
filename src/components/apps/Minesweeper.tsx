import { useState, useEffect, useRef, useCallback } from 'react';
import {
  generateBoard,
  revealCell,
  toggleFlag,
  ensureFirstClickSafe,
  countRemainingMines,
  checkWin,
  CELL_NUMBER_COLORS,
} from '@/lib/minesweeper-engine';
import type { Board, Cell } from '@/lib/minesweeper-engine';

const CELL_SIZE = 35;
const HEADER_HEIGHT = 45;
const GRID_OFFSET_Y = HEADER_HEIGHT + 5;
const BOARD_SIZE = 9;
const MINE_COUNT = 10;
const CANVAS_WIDTH = 315; // 9 * 35
const CANVAS_HEIGHT = 360; // HEADER_HEIGHT + GRID_OFFSET_Y + 9*35

interface MinesweeperProps {
  windowId: string;
}

type SmileyState = 'playing' | 'clicking' | 'won' | 'lost';

export function Minesweeper(props: MinesweeperProps) {
  void props;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const boardRef = useRef<Board>(generateBoard(BOARD_SIZE, BOARD_SIZE, MINE_COUNT));
  const gameOverRef = useRef(false);
  const firstClickRef = useRef(true);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timerSecondsRef = useRef(0);
  const smileyStateRef = useRef<SmileyState>('playing');
  const isMouseDownRef = useRef(false);

  const [remainingMines, setRemainingMines] = useState(MINE_COUNT);
  const [smileyState, setSmileyState] = useState<SmileyState>('playing');
  const [gameOver, setGameOver] = useState(false);

  // Draw the entire game
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const board = boardRef.current;

    // Clear canvas
    ctx.fillStyle = '#c0c0c0';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw header area
    drawHeader(ctx, board);

    // Draw grid
    drawGrid(ctx, board);

    // Draw cells
    for (let r = 0; r < board.rows; r++) {
      for (let c = 0; c < board.cols; c++) {
        drawCell(ctx, board.cells[r][c], r, c);
      }
    }
  }, []);

  function drawHeader(ctx: CanvasRenderingContext2D, board: Board) {
    // Mine counter (left side)
    ctx.fillStyle = '#000000';
    ctx.fillRect(10, 8, 50, 30);
    ctx.fillStyle = '#ff0000';
    ctx.font = 'bold 20px "Courier New", monospace';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    const mines = countRemainingMines(board);
    ctx.fillText(String(mines).padStart(3, '0'), 14, 23);

    // Timer (right side)
    ctx.fillStyle = '#000000';
    ctx.fillRect(CANVAS_WIDTH - 60, 8, 50, 30);
    ctx.fillStyle = '#ff0000';
    ctx.fillText(String(timerSecondsRef.current).padStart(3, '0'), CANVAS_WIDTH - 56, 23);

    // Smiley face button (center)
    drawSmiley(ctx, CANVAS_WIDTH / 2 - 13, 6);
  }

  function drawSmiley(ctx: CanvasRenderingContext2D, x: number, y: number) {
    const size = 26;
    const state = smileyStateRef.current;

    // Button background
    ctx.fillStyle = '#c0c0c0';
    ctx.fillRect(x, y, size, size);

    // 3D border
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1;
    ctx.strokeRect(x, y, size, size);

    // Face
    ctx.fillStyle = '#ffff00';
    ctx.beginPath();
    ctx.arc(x + size / 2, y + size / 2, 9, 0, Math.PI * 2);
    ctx.fill();

    // Eyes
    ctx.fillStyle = '#000000';
    ctx.fillRect(x + 8, y + 9, 2, 3);
    ctx.fillRect(x + 16, y + 9, 2, 3);

    // Mouth based on state
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    if (state === 'playing') {
      // 🙂 smile
      ctx.arc(x + size / 2, y + size / 2 + 2, 5, 0.1, Math.PI - 0.1);
    } else if (state === 'clicking') {
      // 😮 open mouth
      ctx.arc(x + size / 2, y + size / 2 + 3, 3, 0, Math.PI * 2);
    } else if (state === 'won') {
      // 😎 cool smile
      ctx.arc(x + size / 2, y + size / 2 + 2, 5, 0.1, Math.PI - 0.1);
    } else if (state === 'lost') {
      // 💀 dead
      ctx.arc(x + size / 2, y + size / 2 + 5, 5, Math.PI + 0.1, -0.1);
    }
    ctx.stroke();
  }

  function drawGrid(ctx: CanvasRenderingContext2D, board: Board) {
    ctx.strokeStyle = '#808080';
    ctx.lineWidth = 1;

    for (let r = 0; r <= board.rows; r++) {
      ctx.beginPath();
      ctx.moveTo(0, GRID_OFFSET_Y + r * CELL_SIZE);
      ctx.lineTo(CANVAS_WIDTH, GRID_OFFSET_Y + r * CELL_SIZE);
      ctx.stroke();
    }

    for (let c = 0; c <= board.cols; c++) {
      ctx.beginPath();
      ctx.moveTo(c * CELL_SIZE, GRID_OFFSET_Y);
      ctx.lineTo(c * CELL_SIZE, CANVAS_HEIGHT);
      ctx.stroke();
    }
  }

  function drawCell(ctx: CanvasRenderingContext2D, cell: Cell, row: number, col: number) {
    const x = col * CELL_SIZE;
    const y = GRID_OFFSET_Y + row * CELL_SIZE;

    if (cell.state === 'hidden' || cell.state === 'flagged') {
      // Unpressed cell with 3D raised border
      ctx.fillStyle = '#c0c0c0';
      ctx.fillRect(x + 1, y + 1, CELL_SIZE - 2, CELL_SIZE - 2);

      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x, y + CELL_SIZE);
      ctx.lineTo(x, y);
      ctx.lineTo(x + CELL_SIZE, y);
      ctx.stroke();

      ctx.strokeStyle = '#808080';
      ctx.beginPath();
      ctx.moveTo(x + CELL_SIZE, y);
      ctx.lineTo(x + CELL_SIZE, y + CELL_SIZE);
      ctx.lineTo(x, y + CELL_SIZE);
      ctx.stroke();

      if (cell.state === 'flagged') {
        // Draw flag
        ctx.fillStyle = '#ff0000';
        ctx.beginPath();
        ctx.moveTo(x + 10, y + 8);
        ctx.lineTo(x + 22, y + 11);
        ctx.lineTo(x + 10, y + 16);
        ctx.fill();

        // Flag pole
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x + 10, y + 8);
        ctx.lineTo(x + 10, y + 28);
        ctx.stroke();
      }
    } else if (cell.state === 'revealed') {
      // Pressed cell
      ctx.fillStyle = '#d4d0c8';
      ctx.fillRect(x + 1, y + 1, CELL_SIZE - 2, CELL_SIZE - 2);

      if (cell.isMine) {
        // Draw mine
        if (cell.isTriggeredMine) {
          ctx.fillStyle = '#ff0000';
          ctx.fillRect(x + 1, y + 1, CELL_SIZE - 2, CELL_SIZE - 2);
        }

        ctx.fillStyle = '#000000';
        ctx.beginPath();
        ctx.arc(x + CELL_SIZE / 2, y + CELL_SIZE / 2, 5, 0, Math.PI * 2);
        ctx.fill();

        // Mine spokes
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 1.5;
        const cx = x + CELL_SIZE / 2;
        const cy = y + CELL_SIZE / 2;
        for (let angle = 0; angle < 8; angle++) {
          const rad = (angle * Math.PI) / 4;
          ctx.beginPath();
          ctx.moveTo(cx + Math.cos(rad) * 7, cy + Math.sin(rad) * 7);
          ctx.lineTo(cx + Math.cos(rad) * 11, cy + Math.sin(rad) * 11);
          ctx.stroke();
        }
      } else if (cell.adjacentMines > 0) {
        // Draw number
        ctx.font = 'bold 16px "Courier New", monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = CELL_NUMBER_COLORS[cell.adjacentMines] || '#000000';
        ctx.fillText(String(cell.adjacentMines), x + CELL_SIZE / 2, y + CELL_SIZE / 2);
      }
    }
  }

  // Game loop (redraw)
  const gameLoop = useCallback(() => {
    draw();
    requestAnimationFrame(gameLoop);
  }, [draw]);

  // Start game loop
  useEffect(() => {
    const raf = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(raf);
  }, [gameLoop]);

  // Handle canvas click
  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Check smiley face click — must work even when game is over
      const smileyX = CANVAS_WIDTH / 2 - 13;
      const smileyY = 6;
      if (x >= smileyX && x <= smileyX + 26 && y >= smileyY && y <= smileyY + 26) {
        resetGame();
        return;
      }

      if (gameOverRef.current) return;

      // Check grid click
      if (y < GRID_OFFSET_Y) return;
      const col = Math.floor(x / CELL_SIZE);
      const row = Math.floor((y - GRID_OFFSET_Y) / CELL_SIZE);
      if (row < 0 || row >= BOARD_SIZE || col < 0 || col >= BOARD_SIZE) return;

      if (e.button === 2) {
        // Right-click: toggle flag
        e.preventDefault();
        if (!firstClickRef.current) {
          const result = toggleFlag(boardRef.current, row, col);
          boardRef.current = result;
          setRemainingMines(countRemainingMines(result));
          draw();
        }
        return;
      }

      if (e.button === 0) {
        // Left-click: reveal cell
        isMouseDownRef.current = true;
        smileyStateRef.current = 'clicking';
        setSmileyState('clicking');
        draw();
      }
    },
    [draw],
  );

  const handleMouseUp = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (!isMouseDownRef.current) return;
      isMouseDownRef.current = false;

      if (gameOverRef.current) return;

      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Reset smiley
      smileyStateRef.current = 'playing';
      setSmileyState('playing');

      if (y < GRID_OFFSET_Y) {
        draw();
        return;
      }

      const col = Math.floor(x / CELL_SIZE);
      const row = Math.floor((y - GRID_OFFSET_Y) / CELL_SIZE);
      if (row < 0 || row >= BOARD_SIZE || col < 0 || col >= BOARD_SIZE) {
        draw();
        return;
      }

      // Check if cell is flagged — don't reveal
      if (boardRef.current.cells[row][col].state === 'flagged') {
        draw();
        return;
      }

      let board = boardRef.current;

      // First-click safety
      if (firstClickRef.current) {
        board = ensureFirstClickSafe(board, row, col);
        firstClickRef.current = false;
        startTimer();
      }

      // Reveal cell
      const result = revealCell(board, row, col);
      boardRef.current = result;
      setRemainingMines(countRemainingMines(result));

      // Check game over
      if (result.cells[row][col].isMine) {
        // Lost
        gameOverRef.current = true;
        setGameOver(true);
        stopTimer();
        smileyStateRef.current = 'lost';
        setSmileyState('lost');
      } else if (checkWin(result)) {
        // Won - auto-flag all mines
        const flaggedBoard = autoFlagMines(result);
        boardRef.current = flaggedBoard;
        setRemainingMines(0);
        gameOverRef.current = true;
        setGameOver(true);
        stopTimer();
        smileyStateRef.current = 'won';
        setSmileyState('won');
      }

      draw();
    },
    [draw],
  );

  function autoFlagMines(board: Board): Board {
    const newCells = board.cells.map((row) =>
      row.map((cell) => ({
        ...cell,
        state: cell.isMine && cell.state === 'hidden' ? ('flagged' as const) : cell.state,
      })),
    );
    return { ...board, cells: newCells };
  }

  function startTimer() {
    timerRef.current = setInterval(() => {
      timerSecondsRef.current += 1;
      draw();
    }, 1000);
  }

  function stopTimer() {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }

  function resetGame() {
    stopTimer();
    timerSecondsRef.current = 0;
    firstClickRef.current = true;
    gameOverRef.current = false;
    setGameOver(false);
    smileyStateRef.current = 'playing';
    setSmileyState('playing');
    boardRef.current = generateBoard(BOARD_SIZE, BOARD_SIZE, MINE_COUNT);
    setRemainingMines(MINE_COUNT);
    draw();
  }

  // Keyboard handler — R to restart
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'r') {
        e.preventDefault();
        resetGame();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Prevent context menu on canvas
  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
  }, []);

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        background: '#c0c0c0',
        padding: '4px',
      }}
    >
      <div
        style={{
          border: '2px solid #808080',
          borderTopColor: '#ffffff',
          borderLeftColor: '#ffffff',
          borderBottomColor: '#404040',
          borderRightColor: '#404040',
          display: 'inline-block',
        }}
      >
        <canvas
          ref={canvasRef}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onContextMenu={handleContextMenu}
          style={{ display: 'block' }}
          role="img"
          aria-label={`Minesweeper - ${gameOver ? (smileyState === 'won' ? 'You won!' : 'Game over') : `${remainingMines} mines remaining`}`}
        />
      </div>
    </div>
  );
}
