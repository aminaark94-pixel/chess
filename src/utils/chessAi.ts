import { BoardState, SquareCoord, PieceColor, PieceType, AIDifficulty, Language } from '../types/chess';
import { getLegalMovesForPiece, applyMove, cloneBoard, isKingInCheck, isSquareAttacked, coordToAlgebraic } from './chessLogic';

// Piece value heuristics
const PIECE_VALUES: Record<PieceType, number> = {
  p: 100,
  n: 320,
  b: 330,
  r: 500,
  q: 900,
  k: 20000
};

// Positional bonuses for pieces (center control, progression)
const PAWN_TABLE_WHITE = [
  [0,  0,  0,  0,  0,  0,  0,  0],
  [50, 50, 50, 50, 50, 50, 50, 50],
  [10, 10, 20, 30, 30, 20, 10, 10],
  [5,  5, 10, 25, 25, 10,  5,  5],
  [0,  0,  0, 20, 20,  0,  0,  0],
  [5, -5,-10,  0,  0,-10, -5,  5],
  [5, 10, 10,-20,-20, 10, 10,  5],
  [0,  0,  0,  0,  0,  0,  0,  0]
];

const KNIGHT_TABLE = [
  [-50,-40,-30,-30,-30,-30,-40,-50],
  [-40,-20,  0,  0,  0,  0,-20,-40],
  [-30,  0, 10, 15, 15, 10,  0,-30],
  [-30,  5, 15, 20, 20, 15,  5,-30],
  [-30,  0, 15, 20, 20, 15,  0,-30],
  [-30,  5, 10, 15, 15, 10,  5,-30],
  [-40,-20,  0,  5,  5,  0,-20,-40],
  [-50,-40,-30,-30,-30,-30,-40,-50]
];

// Evaluate total board score for White (+ positive) or Black (- negative)
export function evaluateBoard(board: BoardState): number {
  let score = 0;

  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const piece = board[r][c];
      if (!piece) continue;

      let pieceVal = PIECE_VALUES[piece.type];
      let posVal = 0;

      if (piece.type === 'p') {
        posVal = piece.color === 'w' ? PAWN_TABLE_WHITE[r][c] : PAWN_TABLE_WHITE[7 - r][c];
      } else if (piece.type === 'n') {
        posVal = KNIGHT_TABLE[r][c];
      } else if (piece.type === 'k') {
        posVal = 0;
      }

      const totalPieceScore = pieceVal + posVal;
      score += piece.color === 'w' ? totalPieceScore : -totalPieceScore;
    }
  }

  return score;
}

export interface ScoredMove {
  from: SquareCoord;
  to: SquareCoord;
  score: number;
}

// Generate all legal moves for a given player color
export function getAllLegalMoves(board: BoardState, color: PieceColor): Array<{ from: SquareCoord; to: SquareCoord }> {
  const moves: Array<{ from: SquareCoord; to: SquareCoord }> = [];

  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const piece = board[r][c];
      if (piece && piece.color === color) {
        const dests = getLegalMovesForPiece(board, { row: r, col: c }, true);
        dests.forEach(to => {
          moves.push({ from: { row: r, col: c }, to });
        });
      }
    }
  }

  return moves;
}

// Minimax with Alpha-Beta Pruning
function minimax(
  board: BoardState,
  depth: number,
  alpha: number,
  beta: number,
  isMaximizing: boolean
): number {
  if (depth === 0) {
    return evaluateBoard(board);
  }

  const currentColor: PieceColor = isMaximizing ? 'w' : 'b';
  const legalMoves = getAllLegalMoves(board, currentColor);

  if (legalMoves.length === 0) {
    // Checkmate or Stalemate
    if (isKingInCheck(board, currentColor)) {
      return isMaximizing ? -99999 + (5 - depth) : 99999 - (5 - depth);
    }
    return 0; // stalemate
  }

  if (isMaximizing) {
    let maxEval = -Infinity;
    for (const move of legalMoves) {
      const { newBoard } = applyMove(board, move.from, move.to);
      const evalScore = minimax(newBoard, depth - 1, alpha, beta, false);
      maxEval = Math.max(maxEval, evalScore);
      alpha = Math.max(alpha, evalScore);
      if (beta <= alpha) break;
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    for (const move of legalMoves) {
      const { newBoard } = applyMove(board, move.from, move.to);
      const evalScore = minimax(newBoard, depth - 1, alpha, beta, true);
      minEval = Math.min(minEval, evalScore);
      beta = Math.min(beta, evalScore);
      if (beta <= alpha) break;
    }
    return minEval;
  }
}

// AI decision maker based on difficulty
export function getAIMove(
  board: BoardState,
  aiColor: PieceColor,
  difficulty: AIDifficulty
): { from: SquareCoord; to: SquareCoord } | null {
  const legalMoves = getAllLegalMoves(board, aiColor);
  if (legalMoves.length === 0) return null;

  // Easy: 60% random or simple captures
  if (difficulty === 'easy') {
    // Prefer captures 40% of the time, else random
    const captures = legalMoves.filter(m => !!board[m.to.row][m.to.col]);
    if (captures.length > 0 && Math.random() < 0.4) {
      return captures[Math.floor(Math.random() * captures.length)];
    }
    return legalMoves[Math.floor(Math.random() * legalMoves.length)];
  }

  // Medium: Depth 1 + basic piece valuation
  if (difficulty === 'medium') {
    const isMax = aiColor === 'w';
    let bestScore = isMax ? -Infinity : Infinity;
    let candidates: Array<{ from: SquareCoord; to: SquareCoord }> = [];

    for (const move of legalMoves) {
      const { newBoard } = applyMove(board, move.from, move.to);
      // add small random jitter for variety
      const evalScore = evaluateBoard(newBoard) + (Math.random() * 20 - 10);

      if (isMax) {
        if (evalScore > bestScore) {
          bestScore = evalScore;
          candidates = [move];
        } else if (Math.abs(evalScore - bestScore) < 5) {
          candidates.push(move);
        }
      } else {
        if (evalScore < bestScore) {
          bestScore = evalScore;
          candidates = [move];
        } else if (Math.abs(evalScore - bestScore) < 5) {
          candidates.push(move);
        }
      }
    }

    return candidates[Math.floor(Math.random() * candidates.length)] || legalMoves[0];
  }

  // Hard: Minimax depth 2-3 search
  const isMax = aiColor === 'w';
  let bestScore = isMax ? -Infinity : Infinity;
  let bestMove = legalMoves[0];

  for (const move of legalMoves) {
    const { newBoard } = applyMove(board, move.from, move.to);
    const score = minimax(newBoard, 2, -Infinity, Infinity, !isMax);

    if (isMax) {
      if (score > bestScore) {
        bestScore = score;
        bestMove = move;
      }
    } else {
      if (score < bestScore) {
        bestScore = score;
        bestMove = move;
      }
    }
  }

  return bestMove;
}

// Find best hint for player
export function getBestMoveHint(
  board: BoardState,
  playerColor: PieceColor,
  lang: Language
): { from: SquareCoord; to: SquareCoord; text: string } | null {
  const legalMoves = getAllLegalMoves(board, playerColor);
  if (legalMoves.length === 0) return null;

  const isMax = playerColor === 'w';
  let bestScore = isMax ? -Infinity : Infinity;
  let bestMove = legalMoves[0];

  for (const move of legalMoves) {
    const { newBoard } = applyMove(board, move.from, move.to);
    const score = evaluateBoard(newBoard);

    if (isMax) {
      if (score > bestScore) {
        bestScore = score;
        bestMove = move;
      }
    } else {
      if (score < bestScore) {
        bestScore = score;
        bestMove = move;
      }
    }
  }

  const piece = board[bestMove.from.row][bestMove.from.col];
  const target = board[bestMove.to.row][bestMove.to.col];
  const fromAlg = coordToAlgebraic(bestMove.from.row, bestMove.from.col);
  const toAlg = coordToAlgebraic(bestMove.to.row, bestMove.to.col);

  let text = '';
  if (lang === 'ur') {
    if (target) {
      text = `Behtareen chaal: ${fromAlg} se ${toAlg} par dushman ke mohray ko capture karein!`;
    } else {
      text = `Behtareen chaal: ${fromAlg} wale mohray ko ${toAlg} par chalain taakay center par control ho!`;
    }
  } else {
    if (target) {
      text = `Best move: Strike target on ${toAlg} using piece on ${fromAlg}!`;
    } else {
      text = `Best move: Advance piece from ${fromAlg} to ${toAlg} for superior control!`;
    }
  }

  return {
    from: bestMove.from,
    to: bestMove.to,
    text
  };
}
