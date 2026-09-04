import React from 'react';
import { motion } from 'motion/react';
import { BoardState, SquareCoord, PieceColor, BoardTheme } from '../types/chess';
import { ChessPieceSvg } from './ChessPieceSvg';
import { areCoordsEqual, coordToAlgebraic } from '../utils/chessLogic';
import { Gem, Sparkles, AlertCircle } from 'lucide-react';

interface ChessBoardProps {
  board: BoardState;
  selectedSquare: SquareCoord | null;
  validMoves: SquareCoord[];
  lastMove?: { from: SquareCoord; to: SquareCoord } | null;
  hintSquare?: SquareCoord | null;
  gems?: SquareCoord[];
  kingInCheckCoord?: SquareCoord | null;
  playerColor?: PieceColor;
  isFlipped?: boolean;
  theme?: BoardTheme;
  interactive?: boolean;
  onSquareClick: (coord: SquareCoord) => void;
  allowedPieces?: SquareCoord[];
}

export const ChessBoard: React.FC<ChessBoardProps> = ({
  board,
  selectedSquare,
  validMoves,
  lastMove,
  hintSquare,
  gems = [],
  kingInCheckCoord,
  playerColor = 'w',
  isFlipped = false,
  theme = 'cyber',
  interactive = true,
  onSquareClick,
  allowedPieces
}) => {
  // Determine square color based on theme
  const getSquareColor = (row: number, col: number) => {
    const isLight = (row + col) % 2 === 0;
    if (theme === 'wood') {
      return isLight ? 'bg-[#f3ebd7] text-[#78350f]' : 'bg-[#a8783d] text-[#fef3c7]';
    }
    if (theme === 'slate') {
      return isLight ? 'bg-[#cbd5e1] text-[#0f172a]' : 'bg-[#475569] text-[#f8fafc]';
    }
    // Sleek Interface Theme (Default)
    return isLight ? 'bg-[#e2e8f0] text-zinc-900' : 'bg-[#3a3a44] text-slate-300';
  };

  const ranks = isFlipped ? [0, 1, 2, 3, 4, 5, 6, 7] : [0, 1, 2, 3, 4, 5, 6, 7];
  const files = isFlipped ? [7, 6, 5, 4, 3, 2, 1, 0] : [0, 1, 2, 3, 4, 5, 6, 7];

  const handleCellClick = (row: number, col: number) => {
    if (!interactive) return;
    onSquareClick({ row, col });
  };

  return (
    <div
      id="chess-board-wrapper"
      className="relative flex flex-col items-center justify-center select-none w-full max-w-[480px] sm:max-w-[540px] aspect-square p-2.5 sm:p-3.5 rounded-3xl bg-[#1a1a20] border border-white/5 shadow-2xl overflow-hidden"
    >
      {/* Background Dot Grid */}
      <div className="absolute inset-0 opacity-10 bg-dot-grid pointer-events-none" />

      {/* Heavy Bezel Board Frame */}
      <div
        id="chess-board-grid"
        className="relative z-10 w-full h-full border-[10px] sm:border-[12px] border-[#2c2c34] rounded-2xl shadow-2xl grid grid-cols-8 grid-rows-8 overflow-hidden"
      >
        {ranks.map((r) =>
          files.map((c) => {
            const piece = board[r][c];
            const isSelected = areCoordsEqual(selectedSquare, { row: r, col: c });
            const isValidMove = validMoves.some((m) => areCoordsEqual(m, { row: r, col: c }));
            const isLastMoveFrom = areCoordsEqual(lastMove?.from, { row: r, col: c });
            const isLastMoveTo = areCoordsEqual(lastMove?.to, { row: r, col: c });
            const isHint = areCoordsEqual(hintSquare, { row: r, col: c });
            const isCheck = areCoordsEqual(kingInCheckCoord, { row: r, col: c });
            const hasGem = gems.some((g) => areCoordsEqual(g, { row: r, col: c }));
            const isSelectablePiece =
              piece &&
              piece.color === playerColor &&
              (!allowedPieces || allowedPieces.some((ap) => areCoordsEqual(ap, { row: r, col: c })));

            return (
              <div
                key={`${r}-${c}`}
                id={`square-${coordToAlgebraic(r, c)}`}
                onClick={() => handleCellClick(r, c)}
                className={`relative flex items-center justify-center cursor-pointer transition-colors duration-150 ${getSquareColor(
                  r,
                  c
                )} ${
                  isSelected
                    ? 'border-4 border-indigo-500 shadow-[0_0_20px_rgba(79,70,229,0.5)] z-20'
                    : isLastMoveTo || isLastMoveFrom
                    ? 'bg-indigo-500/20'
                    : ''
                }`}
              >
                {/* Board Rank & File Labels (on edges) */}
                {c === (isFlipped ? 7 : 0) && (
                  <span className="absolute top-0.5 left-1 text-[10px] font-bold opacity-50 pointer-events-none">
                    {8 - r}
                  </span>
                )}
                {r === (isFlipped ? 0 : 7) && (
                  <span className="absolute bottom-0.5 right-1 text-[10px] font-bold opacity-50 pointer-events-none">
                    {String.fromCharCode(97 + c)}
                  </span>
                )}

                {/* King in Check Danger Aura */}
                {isCheck && (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: [1, 1.15, 1], opacity: [0.8, 1, 0.8] }}
                    transition={{ repeat: Infinity, duration: 1.2 }}
                    className="absolute inset-0 bg-red-600/50 rounded-sm z-10 flex items-center justify-center"
                  >
                    <AlertCircle className="w-8 h-8 text-red-100 drop-shadow-lg animate-pulse" />
                  </motion.div>
                )}

                {/* Collectible Gem (Level Stage Objectives) */}
                {hasGem && !piece && (
                  <motion.div
                    initial={{ scale: 0.8 }}
                    animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="relative z-10 flex items-center justify-center"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center shadow-[0_0_12px_rgba(79,70,229,0.7)] border border-indigo-200">
                      <Gem className="w-5 h-5 text-white" />
                    </div>
                  </motion.div>
                )}

                {/* Valid Move Highlight (Sleek Indigo Pulsing Indicators) */}
                {isValidMove && (
                  <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                    {piece ? (
                      // Capture target ring (Rose/Indigo pulsing ring)
                      <motion.div
                        initial={{ scale: 0.6 }}
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ repeat: Infinity, duration: 1 }}
                        className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-4 border-rose-500 bg-rose-500/20 shadow-[0_0_15px_rgba(244,63,94,0.6)]"
                      />
                    ) : (
                      // Quiet move node (Sleek Indigo halo dot)
                      <div className="relative w-8 h-8 flex items-center justify-center">
                        <div className="absolute inset-0 bg-indigo-500/30 border-2 border-indigo-400 rounded-sm" />
                        <div className="w-4 h-4 rounded-full border-2 border-indigo-400 bg-indigo-400/40 shadow-[0_0_10px_rgba(79,70,229,0.7)] animate-pulse" />
                      </div>
                    )}
                  </div>
                )}

                {/* Hint Marker (Indigo & Amber Glowing Aura) */}
                {isHint && (
                  <motion.div
                    initial={{ scale: 0.7, opacity: 0 }}
                    animate={{ scale: [0.9, 1.15, 0.9], opacity: [0.6, 1, 0.6] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    className="absolute inset-1 rounded-lg border-2 border-dashed border-indigo-400 bg-indigo-500/30 z-10 flex items-center justify-center pointer-events-none shadow-[0_0_15px_rgba(79,70,229,0.5)]"
                  >
                    <Sparkles className="w-5 h-5 text-indigo-200 animate-spin" />
                  </motion.div>
                )}

                {/* Chess Piece Graphic */}
                {piece && (
                  <motion.div
                    id={`piece-${coordToAlgebraic(r, c)}`}
                    layoutId={`piece-${r}-${c}-${piece.type}-${piece.color}`}
                    transition={{ type: 'spring', stiffness: 350, damping: 28 }}
                    className={`relative z-10 w-[84%] h-[84%] flex items-center justify-center ${
                      isSelectablePiece ? 'hover:scale-105 transition-transform' : ''
                    }`}
                  >
                    <ChessPieceSvg
                      type={piece.type}
                      color={piece.color}
                      isGlowing={isSelectablePiece && isSelected}
                    />
                  </motion.div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
