/**
 * Pure Minesweeper engine — no DOM, no Canvas dependencies.
 *
 * All functions are pure: given the same inputs, they return the same outputs.
 * Designed for independent testability.
 */

// ── Types ──────────────────────────────────────────────────────────

export type CellState = 'hidden' | 'revealed' | 'flagged';

export interface Cell {
  isMine: boolean;
  adjacentMines: number;
  state: CellState;
  isTriggeredMine?: boolean;
}

export interface Board {
  rows: number;
  cols: number;
  cells: Cell[][];
  mineCount: number;
}

// ── Board Generation ───────────────────────────────────────────────

/**
 * Generate a Minesweeper board with the given dimensions and mine count.
 * If `safeRow` and `safeCol` are provided, the board guarantees no mine at that position
 * (first-click safety via re-generation rather than post-hoc shifting).
 */
export function generateBoard(
  rows: number,
  cols: number,
  mineCount: number,
  safeRow?: number,
  safeCol?: number,
): Board {
  if (mineCount >= rows * cols) {
    throw new Error('Mine count must be less than total cells');
  }

  // Initialize empty grid
  const cells: Cell[][] = Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => ({
      isMine: false,
      adjacentMines: 0,
      state: 'hidden' as CellState,
    })),
  );

  // Place mines randomly, avoiding safe position
  let minesPlaced = 0;
  const rng = createRNG();

  while (minesPlaced < mineCount) {
    const row = Math.floor(rng() * rows);
    const col = Math.floor(rng() * cols);

    // Skip if already a mine or at safe position
    if (cells[row][col].isMine) continue;
    if (safeRow !== undefined && safeCol !== undefined && row === safeRow && col === safeCol)
      continue;

    cells[row][col].isMine = true;
    minesPlaced++;
  }

  // Calculate adjacency counts
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (cells[r][c].isMine) continue;
      cells[r][c].adjacentMines = countAdjacentMines(cells, r, c, rows, cols);
    }
  }

  return { rows, cols, cells, mineCount };
}

/**
 * Simple deterministic-ish PRNG (seeded with Date.now() fallback,
 * but uses Math.random for true randomness).
 */
function createRNG(): () => number {
  return () => Math.random();
}

/**
 * Count the number of mines adjacent to a cell.
 */
function countAdjacentMines(
  cells: Cell[][],
  row: number,
  col: number,
  rows: number,
  cols: number,
): number {
  let count = 0;
  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      if (dr === 0 && dc === 0) continue;
      const nr = row + dr;
      const nc = col + dc;
      if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && cells[nr][nc].isMine) {
        count++;
      }
    }
  }
  return count;
}

// ── Game Actions ───────────────────────────────────────────────────

/**
 * Reveal a cell at the given position.
 * Returns a new board with the cell revealed (and flood-fill applied if empty).
 */
export function revealCell(board: Board, row: number, col: number): Board {
  if (row < 0 || row >= board.rows || col < 0 || col >= board.cols) return board;
  const cell = board.cells[row][col];
  if (cell.state !== 'hidden') return board;

  // Create a deep copy of cells
  const newCells = deepCopyCells(board.cells);

  // If it's a mine, reveal all mines and mark triggered one
  if (newCells[row][col].isMine) {
    return revealAllMines({ ...board, cells: newCells }, row, col);
  }

  // Reveal the cell
  newCells[row][col].state = 'revealed';

  // Flood-fill if adjacent mines is 0
  if (newCells[row][col].adjacentMines === 0) {
    floodFill(newCells, row, col, board.rows, board.cols);
  }

  return { ...board, cells: newCells };
}

/**
 * Toggle a flag on a hidden cell.
 * Cannot flag revealed cells.
 */
export function toggleFlag(board: Board, row: number, col: number): Board {
  if (row < 0 || row >= board.rows || col < 0 || col >= board.cols) return board;
  const cell = board.cells[row][col];
  if (cell.state === 'revealed') return board;

  const newCells = deepCopyCells(board.cells);
  newCells[row][col].state = cell.state === 'flagged' ? 'hidden' : 'flagged';

  return { ...board, cells: newCells };
}

/**
 * Ensure first-click safety: if the clicked cell is a mine, regenerate the board.
 * Returns a new board guaranteed to have no mine at (row, col).
 */
export function ensureFirstClickSafe(board: Board, row: number, col: number): Board {
  if (!board.cells[row][col].isMine) return board;

  return generateBoard(board.rows, board.cols, board.mineCount, row, col);
}

/**
 * Count remaining mines (total mines - flags placed).
 */
export function countRemainingMines(board: Board): number {
  let flagCount = 0;
  for (let r = 0; r < board.rows; r++) {
    for (let c = 0; c < board.cols; c++) {
      if (board.cells[r][c].state === 'flagged') {
        flagCount++;
      }
    }
  }
  return board.mineCount - flagCount;
}

/**
 * Count revealed cells.
 */
export function countRevealedCells(board: Board): number {
  let count = 0;
  for (let r = 0; r < board.rows; r++) {
    for (let c = 0; c < board.cols; c++) {
      if (board.cells[r][c].state === 'revealed') {
        count++;
      }
    }
  }
  return count;
}

/**
 * Check if the player has won: all non-mine cells are revealed.
 */
export function checkWin(board: Board): boolean {
  const totalSafeCells = board.rows * board.cols - board.mineCount;
  return countRevealedCells(board) >= totalSafeCells;
}

/**
 * Check if the player has lost: a mine was revealed.
 * (The loss state is triggered when a mine is revealed via `revealCell`.)
 */
export function checkLoss(board: Board, row: number, col: number): boolean {
  return board.cells[row][col].isMine;
}

// ── Helpers ────────────────────────────────────────────────────────

/**
 * Deep copy the 2D cells array.
 */
function deepCopyCells(cells: Cell[][]): Cell[][] {
  return cells.map((row) => row.map((cell) => ({ ...cell })));
}

/**
 * Flood-fill: recursively reveal all adjacent cells when an empty cell (0 adjacent mines)
 * is revealed. Uses iterative BFS to avoid stack overflow.
 */
function floodFill(
  cells: Cell[][],
  startRow: number,
  startCol: number,
  rows: number,
  cols: number,
): void {
  const queue: Array<[number, number]> = [[startRow, startCol]];
  const visited = new Set<string>();

  while (queue.length > 0) {
    const [r, c] = queue.shift()!;
    const key = `${r},${c}`;
    if (visited.has(key)) continue;
    visited.add(key);

    // Reveal current cell
    cells[r][c].state = 'revealed';

    // If this cell has no adjacent mines, add neighbors to queue
    if (cells[r][c].adjacentMines === 0) {
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          if (dr === 0 && dc === 0) continue;
          const nr = r + dr;
          const nc = c + dc;
          if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
            const nKey = `${nr},${nc}`;
            if (!visited.has(nKey) && cells[nr][nc].state === 'hidden' && !cells[nr][nc].isMine) {
              queue.push([nr, nc]);
            }
          }
        }
      }
    }
  }
}

/**
 * Reveal all mines on the board (used on loss).
 * The mine at (triggeredRow, triggeredCol) is marked as isTriggeredMine.
 */
export function revealAllMines(board: Board, triggeredRow: number, triggeredCol: number): Board {
  const newCells = deepCopyCells(board.cells);

  for (let r = 0; r < board.rows; r++) {
    for (let c = 0; c < board.cols; c++) {
      if (newCells[r][c].isMine) {
        newCells[r][c].state = 'revealed';
        if (r === triggeredRow && c === triggeredCol) {
          newCells[r][c].isTriggeredMine = true;
        }
      }
    }
  }

  return { ...board, cells: newCells };
}

/**
 * Get the display number for a cell (1-8) or 0 for unnumbered.
 * Classic Minesweeper color scheme:
 *   1: blue, 2: green, 3: red, 4: dark blue, 5: dark red, 6: teal, 7: black, 8: gray
 */
export function getCellDisplayNumber(adjacentMines: number): number {
  return adjacentMines;
}

export const CELL_NUMBER_COLORS: Record<number, string> = {
  1: '#0000ff',
  2: '#008000',
  3: '#ff0000',
  4: '#000080',
  5: '#800000',
  6: '#008080',
  7: '#000000',
  8: '#808080',
};

/**
 * Check if a cell index is valid for the board.
 */
export function isValidCell(board: Board, row: number, col: number): boolean {
  return row >= 0 && row < board.rows && col >= 0 && col < board.cols;
}
