import { BoardState, SquareCoord, Piece, PieceColor, PieceType, Move } from '../types/chess';

export function createEmptyBoard(): BoardState {
  return Array(8).fill(null).map(() => Array(8).fill(null));
}

// Convert row, col to algebraic square notation (e.g. 7, 4 -> e1)
export function coordToAlgebraic(row: number, col: number): string {
  const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  const rank = 8 - row;
  return `${files[col]}${rank}`;
}

// Convert algebraic notation (e.g. 'e4') to SquareCoord
export function algebraicToCoord(algebraic: string): SquareCoord {
  const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  const col = files.indexOf(algebraic[0].toLowerCase());
  const rank = parseInt(algebraic[1], 10);
  const row = 8 - rank;
  return { row, col };
}

export function isInsideBoard(row: number, col: number): boolean {
  return row >= 0 && row < 8 && col >= 0 && col < 8;
}

export function areCoordsEqual(a?: SquareCoord | null, b?: SquareCoord | null): boolean {
  if (!a || !b) return false;
  return a.row === b.row && a.col === b.col;
}

// Clone board state
export function cloneBoard(board: BoardState): BoardState {
  return board.map(row => row.map(cell => (cell ? { ...cell } : null)));
}

// Get raw candidate moves without check filtering (for basic movement rules)
export function getRawMovesForPiece(
  board: BoardState,
  from: SquareCoord,
  allowFreeMarch: boolean = false
): SquareCoord[] {
  const piece = board[from.row][from.col];
  if (!piece) return [];

  const moves: SquareCoord[] = [];
  const { color, type } = piece;
  const forward = color === 'w' ? -1 : 1;
  const startRow = color === 'w' ? 6 : 1;

  switch (type) {
    case 'p': {
      // 1. One step forward
      const r1 = from.row + forward;
      if (isInsideBoard(r1, from.col) && !board[r1][from.col]) {
        moves.push({ row: r1, col: from.col });

        // 2. Two steps forward from starting rank
        const r2 = from.row + 2 * forward;
        if (from.row === startRow && isInsideBoard(r2, from.col) && !board[r2][from.col]) {
          moves.push({ row: r2, col: from.col });
        }
      }

      // 3. Diagonal Captures
      const captureCols = [from.col - 1, from.col + 1];
      captureCols.forEach(c => {
        if (isInsideBoard(r1, c)) {
          const target = board[r1][c];
          if (target && target.color !== color) {
            moves.push({ row: r1, col: c });
          } else if (allowFreeMarch && !target) {
            // For certain mini-lessons if needed
          }
        }
      });
      break;
    }

    case 'n': {
      // 8 'L' shapes
      const knightOffsets = [
        [-2, -1], [-2, 1], [-1, -2], [-1, 2],
        [1, -2], [1, 2], [2, -1], [2, 1]
      ];
      knightOffsets.forEach(([dr, dc]) => {
        const nr = from.row + dr;
        const nc = from.col + dc;
        if (isInsideBoard(nr, nc)) {
          const target = board[nr][nc];
          if (!target || target.color !== color) {
            moves.push({ row: nr, col: nc });
          }
        }
      });
      break;
    }

    case 'b': {
      // 4 diagonals
      const bishopDirs = [[-1, -1], [-1, 1], [1, -1], [1, 1]];
      bishopDirs.forEach(([dr, dc]) => {
        let nr = from.row + dr;
        let nc = from.col + dc;
        while (isInsideBoard(nr, nc)) {
          const target = board[nr][nc];
          if (!target) {
            moves.push({ row: nr, col: nc });
          } else {
            if (target.color !== color) {
              moves.push({ row: nr, col: nc });
            }
            break; // ray blocked
          }
          nr += dr;
          nc += dc;
        }
      });
      break;
    }

    case 'r': {
      // 4 straight directions
      const rookDirs = [[-1, 0], [1, 0], [0, -1], [0, 1]];
      rookDirs.forEach(([dr, dc]) => {
        let nr = from.row + dr;
        let nc = from.col + dc;
        while (isInsideBoard(nr, nc)) {
          const target = board[nr][nc];
          if (!target) {
            moves.push({ row: nr, col: nc });
          } else {
            if (target.color !== color) {
              moves.push({ row: nr, col: nc });
            }
            break; // ray blocked
          }
          nr += dr;
          nc += dc;
        }
      });
      break;
    }

    case 'q': {
      // 8 directions (Rook + Bishop)
      const queenDirs = [
        [-1, -1], [-1, 1], [1, -1], [1, 1],
        [-1, 0], [1, 0], [0, -1], [0, 1]
      ];
      queenDirs.forEach(([dr, dc]) => {
        let nr = from.row + dr;
        let nc = from.col + dc;
        while (isInsideBoard(nr, nc)) {
          const target = board[nr][nc];
          if (!target) {
            moves.push({ row: nr, col: nc });
          } else {
            if (target.color !== color) {
              moves.push({ row: nr, col: nc });
            }
            break; // ray blocked
          }
          nr += dr;
          nc += dc;
        }
      });
      break;
    }

    case 'k': {
      // 1 square in any of 8 directions
      const kingDirs = [
        [-1, -1], [-1, 0], [-1, 1],
        [0, -1],           [0, 1],
        [1, -1],  [1, 0],  [1, 1]
      ];
      kingDirs.forEach(([dr, dc]) => {
        const nr = from.row + dr;
        const nc = from.col + dc;
        if (isInsideBoard(nr, nc)) {
          const target = board[nr][nc];
          if (!target || target.color !== color) {
            moves.push({ row: nr, col: nc });
          }
        }
      });
      break;
    }
  }

  return moves;
}

// Find position of king of given color
export function findKing(board: BoardState, color: PieceColor): SquareCoord | null {
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const piece = board[r][c];
      if (piece && piece.type === 'k' && piece.color === color) {
        return { row: r, col: c };
      }
    }
  }
  return null;
}

// Check if square is attacked by opponent
export function isSquareAttacked(
  board: BoardState,
  targetSquare: SquareCoord,
  attackerColor: PieceColor
): boolean {
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const piece = board[r][c];
      if (piece && piece.color === attackerColor) {
        const moves = getRawMovesForPiece(board, { row: r, col: c });
        if (moves.some(m => m.row === targetSquare.row && m.col === targetSquare.col)) {
          return true;
        }
      }
    }
  }
  return false;
}

// Check if King of given color is in check
export function isKingInCheck(board: BoardState, kingColor: PieceColor): boolean {
  const kingPos = findKing(board, kingColor);
  if (!kingPos) return false;
  const opponentColor: PieceColor = kingColor === 'w' ? 'b' : 'w';
  return isSquareAttacked(board, kingPos, opponentColor);
}

// Get all strictly legal moves for a piece (verifies move doesn't leave own King in check if King exists)
export function getLegalMovesForPiece(
  board: BoardState,
  from: SquareCoord,
  hasKingCheckRules: boolean = true
): SquareCoord[] {
  const piece = board[from.row][from.col];
  if (!piece) return [];

  const rawMoves = getRawMovesForPiece(board, from);
  const ownKing = findKing(board, piece.color);

  // In basic puzzle stages where no King exists, raw moves are strictly legal
  if (!hasKingCheckRules || !ownKing) {
    return rawMoves;
  }

  return rawMoves.filter(to => {
    // Simulate move
    const testBoard = cloneBoard(board);
    testBoard[to.row][to.col] = testBoard[from.row][from.col];
    testBoard[from.row][from.col] = null;

    // Check if own king is in check after move
    return !isKingInCheck(testBoard, piece.color);
  });
}

// Execute move on board and return new board state + details
export function applyMove(
  board: BoardState,
  from: SquareCoord,
  to: SquareCoord,
  autoPromote: boolean = true
): { newBoard: BoardState; move: Move; isCheck: boolean } {
  const newBoard = cloneBoard(board);
  const movingPiece = newBoard[from.row][from.col];
  const captured = newBoard[to.row][to.col];

  if (!movingPiece) {
    return { newBoard, move: { from, to }, isCheck: false };
  }

  let promotionPiece: PieceType | undefined = undefined;

  // Pawn promotion check
  if (movingPiece.type === 'p') {
    const promoRank = movingPiece.color === 'w' ? 0 : 7;
    if (to.row === promoRank && autoPromote) {
      movingPiece.type = 'q'; // Default promote to Queen
      promotionPiece = 'q';
    }
  }

  newBoard[to.row][to.col] = movingPiece;
  newBoard[from.row][from.col] = null;

  const opponentColor: PieceColor = movingPiece.color === 'w' ? 'b' : 'w';
  const isCheck = isKingInCheck(newBoard, opponentColor);

  return {
    newBoard,
    move: {
      from,
      to,
      captured,
      promotion: promotionPiece,
      isCheck
    },
    isCheck
  };
}

// Get initial standard chess board
export function getStandardInitialBoard(): BoardState {
  const board = createEmptyBoard();
  
  // Black pieces (Rank 8: row 0)
  board[0][0] = { type: 'r', color: 'b' };
  board[0][1] = { type: 'n', color: 'b' };
  board[0][2] = { type: 'b', color: 'b' };
  board[0][3] = { type: 'q', color: 'b' };
  board[0][4] = { type: 'k', color: 'b' };
  board[0][5] = { type: 'b', color: 'b' };
  board[0][6] = { type: 'n', color: 'b' };
  board[0][7] = { type: 'r', color: 'b' };

  // Black pawns (Rank 7: row 1)
  for (let c = 0; c < 8; c++) {
    board[1][c] = { type: 'p', color: 'b' };
  }

  // White pawns (Rank 2: row 6)
  for (let c = 0; c < 8; c++) {
    board[6][c] = { type: 'p', color: 'w' };
  }

  // White pieces (Rank 1: row 7)
  board[7][0] = { type: 'r', color: 'w' };
  board[7][1] = { type: 'n', color: 'w' };
  board[7][2] = { type: 'b', color: 'w' };
  board[7][3] = { type: 'q', color: 'w' };
  board[7][4] = { type: 'k', color: 'w' };
  board[7][5] = { type: 'b', color: 'w' };
  board[7][6] = { type: 'n', color: 'w' };
  board[7][7] = { type: 'r', color: 'w' };

  return board;
}
