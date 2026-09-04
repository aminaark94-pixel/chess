export type Language = 'en' | 'ur'; // en: English, ur: Roman Urdu

export type PieceType = 'p' | 'n' | 'b' | 'r' | 'q' | 'k';
export type PieceColor = 'w' | 'b';

export interface Piece {
  type: PieceType;
  color: PieceColor;
}

export type BoardState = (Piece | null)[][]; // 8x8 grid [row][col], row 0 is rank 8, row 7 is rank 1

export interface SquareCoord {
  row: number; // 0 to 7
  col: number; // 0 to 7
}

export interface Move {
  from: SquareCoord;
  to: SquareCoord;
  promotion?: PieceType;
  captured?: Piece | null;
  notation?: string;
  isCheck?: boolean;
  isCheckmate?: boolean;
}

export interface LevelGoal {
  type: 'capture_all' | 'reach_square' | 'deliver_check' | 'deliver_checkmate' | 'custom' | 'collect_gems';
  targetSquares?: SquareCoord[];
  gems?: SquareCoord[];
  maxMoves?: number;
  descriptionEn: string;
  descriptionUr: string;
}

export interface LevelStage {
  id: string;
  titleEn: string;
  titleUr: string;
  subtitleEn: string;
  subtitleUr: string;
  explanationEn: string[];
  explanationUr: string[];
  initialBoard: BoardState;
  playerColor: PieceColor;
  goal: LevelGoal;
  allowedPieces?: SquareCoord[]; // Only these pieces can be moved, if specified
  aiMoves?: { [moveIndex: number]: { from: SquareCoord; to: SquareCoord } }; // predefined AI responses
  coachInitialEn: string;
  coachInitialUr: string;
  coachSuccessEn: string;
  coachSuccessUr: string;
  coachHintEn: string;
  coachHintUr: string;
  bestMoves?: SquareCoord[]; // Optimal path or next best square
}

export interface LevelCategory {
  id: number;
  slug: string;
  nameEn: string;
  nameUr: string;
  piece: PieceType;
  iconName: string;
  badge: string;
  colorTheme: string;
  descriptionEn: string;
  descriptionUr: string;
  stages: LevelStage[];
}

export interface UserProgress {
  unlockedLevel: number;
  unlockedStage: { [levelId: number]: number };
  stageStars: { [stageId: string]: number }; // 1-3 stars
  totalStars: number;
  xp: number;
  streak: number;
  lastPlayedDate: string;
  completedStages: string[];
  solvedPuzzlesCount: number;
}

export type BoardTheme = 'cyber' | 'wood' | 'slate';
export type AppMode = 'adventure' | 'freeplay' | 'encyclopedia';
export type AIDifficulty = 'easy' | 'medium' | 'hard';
