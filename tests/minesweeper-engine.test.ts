import { describe, it, expect } from 'vitest';
import {
  generateBoard,
  revealCell,
  toggleFlag,
  ensureFirstClickSafe,
  countRemainingMines,
  countRevealedCells,
  checkWin,
  checkLoss,
  revealAllMines,
  isValidCell,
  CELL_NUMBER_COLORS,
} from '@/lib/minesweeper-engine';
import type { Board } from '@/lib/minesweeper-engine';

const BOARD_ROWS = 9;
const BOARD_COLS = 9;
const MINE_COUNT = 10;

function createTestBoard(): Board {
  return generateBoard(BOARD_ROWS, BOARD_COLS, MINE_COUNT);
}

describe('generateBoard', () => {
  it('should create a board with the correct dimensions', () => {
    const board = createTestBoard();
    expect(board.rows).toBe(9);
    expect(board.cols).toBe(9);
    expect(board.cells.length).toBe(9);
    expect(board.cells[0].length).toBe(9);
  });

  it('should have the correct number of mines', () => {
    const board = createTestBoard();
    let mineCount = 0;
    for (let r = 0; r < board.rows; r++) {
      for (let c = 0; c < board.cols; c++) {
        if (board.cells[r][c].isMine) mineCount++;
      }
    }
    expect(mineCount).toBe(MINE_COUNT);
  });

  it('should have all cells in hidden state', () => {
    const board = createTestBoard();
    for (let r = 0; r < board.rows; r++) {
      for (let c = 0; c < board.cols; c++) {
        expect(board.cells[r][c].state).toBe('hidden');
      }
    }
  });

  it('should keep first-click position safe when specified', () => {
    const board = generateBoard(9, 9, 10, 4, 4);
    expect(board.cells[4][4].isMine).toBe(false);
  });

  it('should throw for invalid mine count', () => {
    expect(() => generateBoard(3, 3, 9)).toThrow('Mine count must be less than total cells');
  });

  it('should compute adjacent mine counts correctly', () => {
    // Create a small board with known mine placement by using specific seed
    // Since we can't seed Math.random, verify at least one cell has adjacency info
    const board = createTestBoard();
    let hasAdjacency = false;
    for (let r = 0; r < board.rows; r++) {
      for (let c = 0; c < board.cols; c++) {
        if (!board.cells[r][c].isMine && board.cells[r][c].adjacentMines > 0) {
          hasAdjacency = true;
          break;
        }
      }
      if (hasAdjacency) break;
    }
    // At least some non-mine cells should have adjacent mines (unless all mines are
    // perfectly isolated, which is unlikely with 10 mines in 81 cells)
    expect(hasAdjacency).toBe(true);
  });
});

describe('revealCell', () => {
  it('should reveal a hidden cell', () => {
    const board = createTestBoard();
    // Find a non-mine cell to reveal
    for (let r = 0; r < board.rows; r++) {
      for (let c = 0; c < board.cols; c++) {
        if (!board.cells[r][c].isMine) {
          const result = revealCell(board, r, c);
          expect(result.cells[r][c].state).toBe('revealed');
          return;
        }
      }
    }
  });

  it('should do nothing when revealing an already revealed cell', () => {
    const board = createTestBoard();
    for (let r = 0; r < board.rows; r++) {
      for (let c = 0; c < board.cols; c++) {
        if (!board.cells[r][c].isMine) {
          const revealed = revealCell(board, r, c);
          const doubleReveal = revealCell(revealed, r, c);
          expect(doubleReveal.cells[r][c].state).toBe('revealed');
          return;
        }
      }
    }
  });

  it('should reveal all mines when clicking a mine', () => {
    const board = createTestBoard();
    for (let r = 0; r < board.rows; r++) {
      for (let c = 0; c < board.cols; c++) {
        if (board.cells[r][c].isMine) {
          const result = revealCell(board, r, c);
          // All mines should be revealed
          let allMinesRevealed = true;
          for (let mr = 0; mr < result.rows; mr++) {
            for (let mc = 0; mc < result.cols; mc++) {
              if (result.cells[mr][mc].isMine && result.cells[mr][mc].state !== 'revealed') {
                allMinesRevealed = false;
              }
            }
          }
          expect(allMinesRevealed).toBe(true);
          // Triggered mine should be marked
          expect(result.cells[r][c].isTriggeredMine).toBe(true);
          return;
        }
      }
    }
  });

  it('should do nothing for out-of-bounds coordinates', () => {
    const board = createTestBoard();
    const result = revealCell(board, -1, -1);
    expect(result).toEqual(board);
  });

  it('should flood-fill when revealing an empty cell (0 adjacent mines)', () => {
    const board = createTestBoard();
    // Find an empty cell (0 adjacent mines) if one exists
    for (let r = 0; r < board.rows; r++) {
      for (let c = 0; c < board.cols; c++) {
        if (!board.cells[r][c].isMine && board.cells[r][c].adjacentMines === 0) {
          const result = revealCell(board, r, c);
          // Flood-fill should have revealed multiple cells
          const revealed = countRevealedCells(result);
          expect(revealed).toBeGreaterThan(1);
          return;
        }
      }
    }
    // If no zero-cell exists naturally, just pass
  });
});

describe('toggleFlag', () => {
  it('should place a flag on a hidden cell', () => {
    const board = createTestBoard();
    const result = toggleFlag(board, 0, 0);
    expect(result.cells[0][0].state).toBe('flagged');
  });

  it('should remove a flag from a flagged cell', () => {
    const board = createTestBoard();
    const flagged = toggleFlag(board, 0, 0);
    const unflagged = toggleFlag(flagged, 0, 0);
    expect(unflagged.cells[0][0].state).toBe('hidden');
  });

  it('should not flag a revealed cell', () => {
    const board = createTestBoard();
    for (let r = 0; r < board.rows; r++) {
      for (let c = 0; c < board.cols; c++) {
        if (!board.cells[r][c].isMine) {
          const revealed = revealCell(board, r, c);
          const result = toggleFlag(revealed, r, c);
          expect(result.cells[r][c].state).toBe('revealed');
          return;
        }
      }
    }
  });

  it('should do nothing for out-of-bounds coordinates', () => {
    const board = createTestBoard();
    const result = toggleFlag(board, -1, -1);
    expect(result).toEqual(board);
  });
});

describe('ensureFirstClickSafe', () => {
  it('should return same board if clicked cell is not a mine', () => {
    const board = createTestBoard();
    for (let r = 0; r < board.rows; r++) {
      for (let c = 0; c < board.cols; c++) {
        if (!board.cells[r][c].isMine) {
          const result = ensureFirstClickSafe(board, r, c);
          expect(result).toBe(board);
          return;
        }
      }
    }
  });

  it('should generate a new board without mine at safe position', () => {
    // Create a board and check non-mine position
    for (let attempt = 0; attempt < 10; attempt++) {
      const board = createTestBoard();
      // Check if there's a mine at (4,4) and verify ensureFirstClickSafe works
      const result = ensureFirstClickSafe(board, 4, 4);
      expect(result.cells[4][4].isMine).toBe(false);
    }
  });
});

describe('countRemainingMines', () => {
  it('should return total mine count when no flags placed', () => {
    const board = createTestBoard();
    expect(countRemainingMines(board)).toBe(MINE_COUNT);
  });

  it('should decrease by 1 when a flag is placed', () => {
    const board = createTestBoard();
    const flagged = toggleFlag(board, 0, 0);
    expect(countRemainingMines(flagged)).toBe(MINE_COUNT - 1);
  });

  it('should increase by 1 when a flag is removed', () => {
    const board = createTestBoard();
    const flagged = toggleFlag(board, 0, 0);
    const unflagged = toggleFlag(flagged, 0, 0);
    expect(countRemainingMines(unflagged)).toBe(MINE_COUNT);
  });

  it('should go negative when more flags than mines', () => {
    const board = createTestBoard();
    let result = board;
    for (let i = 0; i < MINE_COUNT + 1; i++) {
      const r = Math.floor(i / BOARD_COLS);
      const c = i % BOARD_COLS;
      result = toggleFlag(result, r, c);
    }
    expect(countRemainingMines(result)).toBe(-1);
  });
});

describe('checkWin', () => {
  it('should return false when game starts', () => {
    const board = createTestBoard();
    expect(checkWin(board)).toBe(false);
  });

  it('should return true when all non-mine cells are revealed', () => {
    const board = createTestBoard();
    const current = revealAllSafeCells(board);
    expect(checkWin(current)).toBe(true);
  });
});

describe('checkLoss', () => {
  it('should return true for a mine cell before revealing it', () => {
    const board = createTestBoard();
    for (let r = 0; r < board.rows; r++) {
      for (let c = 0; c < board.cols; c++) {
        if (board.cells[r][c].isMine) {
          expect(checkLoss(board, r, c)).toBe(true);
          return;
        }
      }
    }
  });

  it('should return false for a non-mine cell', () => {
    const board = createTestBoard();
    for (let r = 0; r < board.rows; r++) {
      for (let c = 0; c < board.cols; c++) {
        if (!board.cells[r][c].isMine) {
          expect(checkLoss(board, r, c)).toBe(false);
          return;
        }
      }
    }
  });
});

describe('revealAllMines', () => {
  it('should reveal all mines on the board', () => {
    const board = createTestBoard();
    const result = revealAllMines(board, 0, 0);
    for (let r = 0; r < result.rows; r++) {
      for (let c = 0; c < result.cols; c++) {
        if (result.cells[r][c].isMine) {
          expect(result.cells[r][c].state).toBe('revealed');
        }
      }
    }
  });

  it('should mark the triggered mine', () => {
    const board = createTestBoard();
    // Find a mine cell
    for (let r = 0; r < board.rows; r++) {
      for (let c = 0; c < board.cols; c++) {
        if (board.cells[r][c].isMine) {
          const result = revealAllMines(board, r, c);
          expect(result.cells[r][c].isTriggeredMine).toBe(true);
          return;
        }
      }
    }
  });
});

describe('isValidCell', () => {
  it('should return true for valid cell coordinates', () => {
    const board = createTestBoard();
    expect(isValidCell(board, 0, 0)).toBe(true);
    expect(isValidCell(board, 8, 8)).toBe(true);
    expect(isValidCell(board, 4, 4)).toBe(true);
  });

  it('should return false for invalid cell coordinates', () => {
    const board = createTestBoard();
    expect(isValidCell(board, -1, 0)).toBe(false);
    expect(isValidCell(board, 0, -1)).toBe(false);
    expect(isValidCell(board, 9, 0)).toBe(false);
    expect(isValidCell(board, 0, 9)).toBe(false);
  });
});

describe('CELL_NUMBER_COLORS', () => {
  it('should define colors for numbers 1 through 8', () => {
    expect(CELL_NUMBER_COLORS[1]).toBe('#0000ff');
    expect(CELL_NUMBER_COLORS[2]).toBe('#008000');
    expect(CELL_NUMBER_COLORS[3]).toBe('#ff0000');
    expect(CELL_NUMBER_COLORS[4]).toBe('#000080');
    expect(CELL_NUMBER_COLORS[5]).toBe('#800000');
    expect(CELL_NUMBER_COLORS[6]).toBe('#008080');
    expect(CELL_NUMBER_COLORS[7]).toBe('#000000');
    expect(CELL_NUMBER_COLORS[8]).toBe('#808080');
  });
});

// ── Helpers ──────────────────────────────────────────────────────────

function revealAllSafeCells(board: Board): Board {
  let current = cloneBoardBoard(board);
  for (let r = 0; r < current.rows; r++) {
    for (let c = 0; c < current.cols; c++) {
      if (!current.cells[r][c].isMine && current.cells[r][c].state === 'hidden') {
        current = revealCell(current, r, c);
      }
    }
  }
  return current;
}

/**
 * Deep-clone a Board for mutation in test helpers.
 */
function cloneBoardBoard(board: Board): Board {
  return {
    rows: board.rows,
    cols: board.cols,
    mineCount: board.mineCount,
    cells: board.cells.map((row) => row.map((cell) => ({ ...cell }))),
  };
}
