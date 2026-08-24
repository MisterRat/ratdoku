import { Difficulty, GameMode, HintInfo, SudokuPuzzle } from '../types';

// Seeded PRNG (Mulberry32)
export function createPRNG(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Convert a string (e.g. "2026-08-23-easy") to a numeric 32-bit seed
export function stringToSeed(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

// Helper to shuffle an array using a given random generator
function shuffle<T>(array: T[], rng: () => number): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Check if placing num at (row, col) is valid on the grid
export function isValidPlacement(grid: number[][], row: number, col: number, num: number): boolean {
  // Check row
  for (let c = 0; c < 9; c++) {
    if (c !== col && grid[row][c] === num) return false;
  }

  // Check column
  for (let r = 0; r < 9; r++) {
    if (r !== row && grid[r][col] === num) return false;
  }

  // Check 3x3 box
  const startRow = Math.floor(row / 3) * 3;
  const startCol = Math.floor(col / 3) * 3;
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      const currR = startRow + r;
      const currC = startCol + c;
      if ((currR !== row || currC !== col) && grid[currR][currC] === num) {
        return false;
      }
    }
  }

  return true;
}

// Solve Sudoku with randomized backtracking to generate full valid boards
function solveGrid(grid: number[][], rng: () => number = Math.random): boolean {
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (grid[r][c] === 0) {
        const nums = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9], rng);
        for (const num of nums) {
          if (isValidPlacement(grid, r, c, num)) {
            grid[r][c] = num;
            if (solveGrid(grid, rng)) return true;
            grid[r][c] = 0;
          }
        }
        return false;
      }
    }
  }
  return true;
}

// Count solutions to ensure unique solution (stops early if count > 1)
function countSolutions(grid: number[][], count = { total: 0 }): number {
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (grid[r][c] === 0) {
        for (let num = 1; num <= 9; num++) {
          if (isValidPlacement(grid, r, c, num)) {
            grid[r][c] = num;
            countSolutions(grid, count);
            grid[r][c] = 0;
            if (count.total >= 2) return count.total;
          }
        }
        return count.total;
      }
    }
  }
  count.total++;
  return count.total;
}

// Generate a complete solved 9x9 grid
export function generateFullSolvedBoard(rng: () => number = Math.random): number[][] {
  const grid: number[][] = Array.from({ length: 9 }, () => Array(9).fill(0));
  solveGrid(grid, rng);
  return grid;
}

// Difficulty target clue counts
const DIFFICULTY_CONFIG: Record<Difficulty, { targetClues: number; maxAttempts: number }> = {
  easy: { targetClues: 38, maxAttempts: 30 },
  medium: { targetClues: 31, maxAttempts: 45 },
  hard: { targetClues: 26, maxAttempts: 60 },
};

/**
 * Generates a playable Sudoku puzzle with a unique solution.
 */
export function generateSudokuPuzzle(
  difficulty: Difficulty,
  mode: GameMode = 'classic',
  dateKey?: string
): SudokuPuzzle {
  const seed = mode === 'daily' && dateKey ? stringToSeed(`${dateKey}-${difficulty}`) : Math.floor(Math.random() * 1000000000);
  const rng = createPRNG(seed);

  const solutionGrid = generateFullSolvedBoard(rng);
  const puzzleGrid: number[][] = solutionGrid.map((row) => [...row]);

  // Create list of all 81 cell coordinates and shuffle
  const cells: [number, number][] = [];
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      cells.push([r, c]);
    }
  }
  const shuffledCells = shuffle(cells, rng);

  const config = DIFFICULTY_CONFIG[difficulty];
  let cluesCount = 81;

  for (const [r, c] of shuffledCells) {
    if (cluesCount <= config.targetClues) break;

    const temp = puzzleGrid[r][c];
    puzzleGrid[r][c] = 0;

    // Check if unique solution remains
    const copyGrid = puzzleGrid.map((row) => [...row]);
    const solCount = countSolutions(copyGrid, { total: 0 });

    if (solCount === 1) {
      cluesCount--;
    } else {
      // Revert if removal causes multiple solutions
      puzzleGrid[r][c] = temp;
    }
  }

  const id = mode === 'daily' ? `daily-${dateKey}-${difficulty}` : `puzzle-${Date.now()}-${Math.floor(rng() * 10000)}`;

  return {
    id,
    difficulty,
    mode,
    dateKey,
    initialGrid: puzzleGrid,
    solutionGrid,
    seed,
  };
}

/**
 * Calculate available candidate numbers for a specific cell based on standard Sudoku rules
 */
export function getPossibleCandidates(grid: number[][], row: number, col: number): number[] {
  if (grid[row][col] !== 0) return [];
  const candidates: number[] = [];
  for (let num = 1; num <= 9; num++) {
    if (isValidPlacement(grid, row, col, num)) {
      candidates.push(num);
    }
  }
  return candidates;
}

/**
 * Intelligent Hint Engine
 * Finds educational logical deductions first, explaining why a number belongs in a cell.
 */
export function findSmartHint(
  currentGrid: number[][],
  solutionGrid: number[][],
  selectedRow: number | null = null,
  selectedCol: number | null = null
): HintInfo | null {
  // 1. Check if user has wrong filled values
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      const val = currentGrid[r][c];
      if (val !== 0 && val !== solutionGrid[r][c]) {
        return {
          type: 'rule_elimination',
          row: r,
          col: c,
          suggestedValue: solutionGrid[r][c],
          title: 'Incorrect Entry Detected',
          explanation: `The number ${val} at Row ${r + 1}, Column ${c + 1} conflicts with the puzzle solution. Clearing this cell will help you proceed correctly.`,
          technique: 'Error Correction',
          highlights: [{ row: r, col: c, type: 'target', label: `Incorrect ${val}` }],
        };
      }
    }
  }

  // 2. If a specific cell is selected and it is empty, check if it has a direct logic deduction
  if (selectedRow !== null && selectedCol !== null && currentGrid[selectedRow][selectedCol] === 0) {
    const candidates = getPossibleCandidates(currentGrid, selectedRow, selectedCol);
    if (candidates.length === 1) {
      const val = candidates[0];
      return buildNakedSingleHint(currentGrid, selectedRow, selectedCol, val);
    }
  }

  // 3. Search for Naked Singles across the whole board (Cells with only 1 possible legal number)
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (currentGrid[r][c] === 0) {
        const candidates = getPossibleCandidates(currentGrid, r, c);
        if (candidates.length === 1) {
          return buildNakedSingleHint(currentGrid, r, c, candidates[0]);
        }
      }
    }
  }

  // 4. Search for Hidden Singles in Rows
  for (let r = 0; r < 9; r++) {
    for (let num = 1; num <= 9; num++) {
      const possibleCols: number[] = [];
      let alreadyInRow = false;
      for (let c = 0; c < 9; c++) {
        if (currentGrid[r][c] === num) {
          alreadyInRow = true;
          break;
        }
        if (currentGrid[r][c] === 0 && isValidPlacement(currentGrid, r, c, num)) {
          possibleCols.push(c);
        }
      }
      if (!alreadyInRow && possibleCols.length === 1) {
        const col = possibleCols[0];
        return {
          type: 'hidden_single',
          row: r,
          col,
          suggestedValue: num,
          title: `Hidden Single in Row ${r + 1}`,
          explanation: `In Row ${r + 1}, the number ${num} can only be placed in Column ${col + 1} because other positions in this row are blocked by existing column or box numbers.`,
          technique: 'Hidden Single (Row)',
          highlights: [
            { row: r, col, type: 'target', label: `${num}` },
            ...Array.from({ length: 9 }, (_, i) => ({ row: r, col: i, type: 'peer' as const })),
          ],
        };
      }
    }
  }

  // 5. Search for Hidden Singles in Columns
  for (let c = 0; c < 9; c++) {
    for (let num = 1; num <= 9; num++) {
      const possibleRows: number[] = [];
      let alreadyInCol = false;
      for (let r = 0; r < 9; r++) {
        if (currentGrid[r][c] === num) {
          alreadyInCol = true;
          break;
        }
        if (currentGrid[r][c] === 0 && isValidPlacement(currentGrid, r, c, num)) {
          possibleRows.push(r);
        }
      }
      if (!alreadyInCol && possibleRows.length === 1) {
        const row = possibleRows[0];
        return {
          type: 'hidden_single',
          row,
          col: c,
          suggestedValue: num,
          title: `Hidden Single in Column ${c + 1}`,
          explanation: `In Column ${c + 1}, the number ${num} has only one valid spot at Row ${row + 1}. All other empty cells in this column are constrained by row or box numbers.`,
          technique: 'Hidden Single (Column)',
          highlights: [
            { row, col: c, type: 'target', label: `${num}` },
            ...Array.from({ length: 9 }, (_, i) => ({ row: i, col: c, type: 'peer' as const })),
          ],
        };
      }
    }
  }

  // 6. Search for Hidden Singles in 3x3 Boxes
  for (let b = 0; b < 9; b++) {
    const startRow = Math.floor(b / 3) * 3;
    const startCol = (b % 3) * 3;
    for (let num = 1; num <= 9; num++) {
      const possibleSpots: [number, number][] = [];
      let alreadyInBox = false;

      for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 3; c++) {
          const currR = startRow + r;
          const currC = startCol + c;
          if (currentGrid[currR][currC] === num) {
            alreadyInBox = true;
            break;
          }
          if (currentGrid[currR][currC] === 0 && isValidPlacement(currentGrid, currR, currC, num)) {
            possibleSpots.push([currR, currC]);
          }
        }
        if (alreadyInBox) break;
      }

      if (!alreadyInBox && possibleSpots.length === 1) {
        const [row, col] = possibleSpots[0];
        const boxNumber = b + 1;
        return {
          type: 'hidden_single',
          row,
          col,
          suggestedValue: num,
          title: `Hidden Single in 3×3 Box ${boxNumber}`,
          explanation: `Inside 3×3 Box ${boxNumber}, ${num} can only be placed at Row ${row + 1}, Column ${col + 1}. Every other cell in this box is already occupied or blocked.`,
          technique: 'Hidden Single (Box)',
          highlights: [
            { row, col, type: 'target', label: `${num}` },
            ...getBoxCells(startRow, startCol).map(([r, c]) => ({ row: r, col: c, type: 'peer' as const })),
          ],
        };
      }
    }
  }

  // 7. General fallback: Pick the empty cell with the fewest candidate options
  let bestR = -1;
  let bestC = -1;
  let minCandidates = 10;
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (currentGrid[r][c] === 0) {
        const cand = getPossibleCandidates(currentGrid, r, c);
        if (cand.length > 0 && cand.length < minCandidates) {
          minCandidates = cand.length;
          bestR = r;
          bestC = c;
        }
      }
    }
  }

  if (bestR !== -1 && bestC !== -1) {
    const val = solutionGrid[bestR][bestC];
    return {
      type: 'only_square',
      row: bestR,
      col: bestC,
      suggestedValue: val,
      title: `Logical Next Step`,
      explanation: `At Row ${bestR + 1}, Column ${bestC + 1}, placing ${val} allows the puzzle to unravel smoothly. It has very few candidates (${minCandidates}) remaining.`,
      technique: 'Candidate Elimination',
      highlights: [{ row: bestR, col: bestC, type: 'target', label: `${val}` }],
    };
  }

  return null;
}

function getBoxCells(startRow: number, startCol: number): [number, number][] {
  const cells: [number, number][] = [];
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      cells.push([startRow + r, startCol + c]);
    }
  }
  return cells;
}

function buildNakedSingleHint(
  currentGrid: number[][],
  row: number,
  col: number,
  val: number
): HintInfo {
  const highlights: HintInfo['highlights'] = [{ row, col, type: 'target', label: `${val}` }];

  // Find cells that eliminate other numbers
  const startRow = Math.floor(row / 3) * 3;
  const startCol = Math.floor(col / 3) * 3;

  for (let c = 0; c < 9; c++) {
    if (c !== col && currentGrid[row][c] !== 0) {
      highlights.push({ row, col: c, type: 'cause' });
    }
  }
  for (let r = 0; r < 9; r++) {
    if (r !== row && currentGrid[r][col] !== 0) {
      highlights.push({ row: r, col, type: 'cause' });
    }
  }
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      const currR = startRow + r;
      const currC = startCol + c;
      if ((currR !== row || currC !== col) && currentGrid[currR][currC] !== 0) {
        if (!highlights.some((h) => h.row === currR && h.col === currC)) {
          highlights.push({ row: currR, col: currC, type: 'cause' });
        }
      }
    }
  }

  return {
    type: 'naked_single',
    row,
    col,
    suggestedValue: val,
    title: `Naked Single at Row ${row + 1}, Col ${col + 1}`,
    explanation: `This cell has only one possible candidate remaining: ${val}. All other numbers (1-9) are eliminated by its row, column, or 3×3 box peers.`,
    technique: 'Naked Single',
    highlights,
  };
}
