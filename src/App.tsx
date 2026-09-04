import React, { useState, useEffect, useCallback } from 'react';
import {
  AppMode,
  Language,
  BoardTheme,
  UserProgress,
  LevelCategory,
  LevelStage,
  BoardState,
  SquareCoord,
  AIDifficulty,
  PieceColor,
  Move
} from './types/chess';
import { Navbar } from './components/Navbar';
import { MascotCoach } from './components/MascotCoach';
import { ChessBoard } from './components/ChessBoard';
import { LevelSelector } from './components/LevelSelector';
import { VictoryModal } from './components/VictoryModal';
import { PieceGuideModal } from './components/PieceGuideModal';
import { FreePlayControls } from './components/FreePlayControls';
import { LEVELS_DATA } from './utils/levelsData';
import { getTranslation } from './utils/translations';
import { playSound, setSoundEnabled, isSoundEnabled } from './utils/audio';
import {
  getLegalMovesForPiece,
  applyMove,
  cloneBoard,
  getStandardInitialBoard,
  isKingInCheck,
  areCoordsEqual,
  coordToAlgebraic
} from './utils/chessLogic';
import { getAIMove, getBestMoveHint, evaluateBoard } from './utils/chessAi';
import {
  Map,
  RotateCcw,
  Lightbulb,
  Sparkles,
  ArrowLeft,
  Flame,
  Star,
  Zap,
  HelpCircle
} from 'lucide-react';

const STORAGE_KEY_PROGRESS = 'chess_quest_progress_v1';
const STORAGE_KEY_LANG = 'chess_quest_lang';
const STORAGE_KEY_THEME = 'chess_quest_theme';

const INITIAL_PROGRESS: UserProgress = {
  unlockedLevel: 1,
  unlockedStage: { 1: 0 },
  stageStars: {},
  totalStars: 0,
  xp: 0,
  streak: 1,
  lastPlayedDate: new Date().toISOString().split('T')[0],
  completedStages: [],
  solvedPuzzlesCount: 0
};

export default function App() {
  // App Configuration States
  const [mode, setMode] = useState<AppMode>('adventure');
  const [lang, setLang] = useState<Language>(() => {
    return (localStorage.getItem(STORAGE_KEY_LANG) as Language) || 'en';
  });
  const [theme, setTheme] = useState<BoardTheme>(() => {
    return (localStorage.getItem(STORAGE_KEY_THEME) as BoardTheme) || 'cyber';
  });
  const [soundOn, setSoundOn] = useState<boolean>(() => isSoundEnabled());

  // User Progression State
  const [progress, setProgress] = useState<UserProgress>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PROGRESS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_PROGRESS;
      }
    }
    return INITIAL_PROGRESS;
  });

  // Save Progress
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PROGRESS, JSON.stringify(progress));
  }, [progress]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_LANG, lang);
  }, [lang]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_THEME, theme);
  }, [theme]);

  // ================= ADVENTURE LEVEL STATE =================
  const [currentLevel, setCurrentLevel] = useState<LevelCategory | null>(null);
  const [currentStage, setCurrentStage] = useState<LevelStage | null>(null);
  const [board, setBoard] = useState<BoardState>(() => LEVELS_DATA[0].stages[0].initialBoard);
  const [selectedSquare, setSelectedSquare] = useState<SquareCoord | null>(null);
  const [validMoves, setValidMoves] = useState<SquareCoord[]>([]);
  const [lastMove, setLastMove] = useState<{ from: SquareCoord; to: SquareCoord } | null>(null);
  const [hintSquare, setHintSquare] = useState<SquareCoord | null>(null);
  const [gems, setGems] = useState<SquareCoord[]>([]);
  const [movesCount, setMovesCount] = useState<number>(0);
  const [isStageWon, setIsStageWon] = useState<boolean>(false);
  const [victoryModalOpen, setVictoryModalOpen] = useState<boolean>(false);
  const [coachMsg, setCoachMsg] = useState<{ en: string; ur: string }>({
    en: LEVELS_DATA[0].stages[0].coachInitialEn,
    ur: LEVELS_DATA[0].stages[0].coachInitialUr
  });

  // ================= FREE PLAY (AI ARENA) STATE =================
  const [fpBoard, setFpBoard] = useState<BoardState>(getStandardInitialBoard);
  const [fpTurn, setFpTurn] = useState<PieceColor>('w');
  const [fpSelectedSquare, setFpSelectedSquare] = useState<SquareCoord | null>(null);
  const [fpValidMoves, setFpValidMoves] = useState<SquareCoord[]>([]);
  const [fpLastMove, setFpLastMove] = useState<{ from: SquareCoord; to: SquareCoord } | null>(null);
  const [fpHintSquare, setFpHintSquare] = useState<SquareCoord | null>(null);
  const [fpDifficulty, setFpDifficulty] = useState<AIDifficulty>('medium');
  const [fpHistory, setFpHistory] = useState<Array<{ board: BoardState; move: Move }>>([]);
  const [fpNotationHistory, setFpNotationHistory] = useState<string[]>([]);
  const [fpIsAiThinking, setFpIsAiThinking] = useState<boolean>(false);
  const [fpIsCheck, setFpIsCheck] = useState<boolean>(false);
  const [fpIsGameOver, setFpIsGameOver] = useState<boolean>(false);
  const [fpGameResult, setFpGameResult] = useState<string | null>(null);
  const [fpIsFlipped, setFpIsFlipped] = useState<boolean>(false);
  const [fpEval, setFpEval] = useState<number>(0);

  // Helper translator
  const t = (key: Parameters<typeof getTranslation>[1]) => getTranslation(lang, key);

  // Toggle Language Handler
  const handleToggleLanguage = () => {
    const nextLang = lang === 'en' ? 'ur' : 'en';
    setLang(nextLang);
    playSound.hint();
  };

  // Cycle Theme Handler
  const handleCycleTheme = () => {
    const themes: BoardTheme[] = ['cyber', 'wood', 'slate'];
    const nextIdx = (themes.indexOf(theme) + 1) % themes.length;
    setTheme(themes[nextIdx]);
    playSound.move();
  };

  // Toggle Sound Handler
  const handleToggleSound = () => {
    const next = !soundOn;
    setSoundOn(next);
    setSoundEnabled(next);
    if (next) playSound.move();
  };

  // ================= ADVENTURE LEVEL SELECTION & INIT =================
  const startStage = useCallback((level: LevelCategory, stage: LevelStage) => {
    setCurrentLevel(level);
    setCurrentStage(stage);
    setBoard(cloneBoard(stage.initialBoard));
    setSelectedSquare(null);
    setValidMoves([]);
    setLastMove(null);
    setHintSquare(null);
    setGems(stage.goal.gems ? [...stage.goal.gems] : []);
    setMovesCount(0);
    setIsStageWon(false);
    setVictoryModalOpen(false);
    setCoachMsg({
      en: stage.coachInitialEn,
      ur: stage.coachInitialUr
    });
  }, []);

  const restartCurrentStage = () => {
    if (currentLevel && currentStage) {
      playSound.undo();
      startStage(currentLevel, currentStage);
    }
  };

  // Ask Hint in Adventure Mode
  const handleAdventureHint = () => {
    if (!currentStage) return;
    playSound.hint();
    if (currentStage.bestMoves && currentStage.bestMoves.length > 0) {
      setHintSquare(currentStage.bestMoves[0]);
    }
    setCoachMsg({
      en: currentStage.coachHintEn,
      ur: currentStage.coachHintUr
    });
  };

  // Handle stage completion
  const handleStageVictory = useCallback(() => {
    if (!currentLevel || !currentStage) return;

    setIsStageWon(true);
    setVictoryModalOpen(true);

    const starsEarned = 3;
    const xpGained = 50;

    setProgress((prev) => {
      const isNewCompletion = !prev.completedStages.includes(currentStage.id);
      const stageIdx = currentLevel.stages.findIndex((s) => s.id === currentStage.id);
      const nextStageIdx = stageIdx + 1;

      let nextUnlockedLevel = prev.unlockedLevel;
      const updatedUnlockedStage = { ...prev.unlockedStage };

      if (nextStageIdx < currentLevel.stages.length) {
        // Unlock next stage in current level
        updatedUnlockedStage[currentLevel.id] = Math.max(
          updatedUnlockedStage[currentLevel.id] ?? 0,
          nextStageIdx
        );
      } else {
        // Unlocked all stages in this level, unlock next level
        if (currentLevel.id >= prev.unlockedLevel && currentLevel.id < 5) {
          nextUnlockedLevel = currentLevel.id + 1;
          updatedUnlockedStage[nextUnlockedLevel] = 0;
        }
      }

      const updatedCompleted = isNewCompletion
        ? [...prev.completedStages, currentStage.id]
        : prev.completedStages;

      const oldStars = prev.stageStars[currentStage.id] ?? 0;
      const starDiff = Math.max(0, starsEarned - oldStars);

      return {
        ...prev,
        unlockedLevel: nextUnlockedLevel,
        unlockedStage: updatedUnlockedStage,
        stageStars: {
          ...prev.stageStars,
          [currentStage.id]: Math.max(oldStars, starsEarned)
        },
        totalStars: prev.totalStars + starDiff,
        xp: prev.xp + (isNewCompletion ? xpGained : 15),
        completedStages: updatedCompleted,
        solvedPuzzlesCount: prev.solvedPuzzlesCount + 1
      };
    });
  }, [currentLevel, currentStage]);

  // Handle Adventure Square Click
  const handleAdventureSquareClick = (coord: SquareCoord) => {
    if (!currentStage || isStageWon) return;

    const clickedPiece = board[coord.row][coord.col];

    // If clicking on own selectable piece
    if (clickedPiece && clickedPiece.color === currentStage.playerColor) {
      if (
        currentStage.allowedPieces &&
        !currentStage.allowedPieces.some((ap) => areCoordsEqual(ap, coord))
      ) {
        playSound.error();
        return;
      }

      playSound.hint();
      setSelectedSquare(coord);
      const legal = getLegalMovesForPiece(board, coord, currentStage.goal.type !== 'collect_gems');
      setValidMoves(legal);
      return;
    }

    // If a piece was selected and clicking on a destination square
    if (selectedSquare) {
      const isDestinationValid = validMoves.some((m) => areCoordsEqual(m, coord));

      if (isDestinationValid) {
        // Execute move
        const { newBoard, move, isCheck } = applyMove(board, selectedSquare, coord);
        const movingPiece = board[selectedSquare.row][selectedSquare.col];

        // Check if collected gem
        let updatedGems = [...gems];
        const gemIdx = updatedGems.findIndex((g) => areCoordsEqual(g, coord));
        if (gemIdx >= 0) {
          updatedGems.splice(gemIdx, 1);
          setGems(updatedGems);
          playSound.gemCollect();
        } else if (move.captured) {
          playSound.capture();
        } else {
          playSound.move();
        }

        setBoard(newBoard);
        setLastMove({ from: selectedSquare, to: coord });
        setSelectedSquare(null);
        setValidMoves([]);
        setHintSquare(null);
        setMovesCount((prev) => prev + 1);

        // Check Goal Completion
        const { goal } = currentStage;
        let isGoalMet = false;

        if (goal.type === 'collect_gems') {
          if (updatedGems.length === 0) {
            isGoalMet = true;
          }
        } else if (goal.type === 'capture_all') {
          // Check if any black pieces remain
          const hasBlackPieces = newBoard.some((row) =>
            row.some((cell) => cell && cell.color === 'b')
          );
          if (!hasBlackPieces) {
            isGoalMet = true;
          }
        } else if (goal.type === 'deliver_check') {
          if (isCheck) {
            playSound.check();
            isGoalMet = true;
          }
        } else if (goal.type === 'deliver_checkmate') {
          // In level 5-3, queen to d8 gives back rank mate
          if (coord.row === 0 && coord.col === 3) {
            playSound.check();
            isGoalMet = true;
          }
        }

        if (isGoalMet) {
          setCoachMsg({
            en: currentStage.coachSuccessEn,
            ur: currentStage.coachSuccessUr
          });
          setTimeout(() => {
            handleStageVictory();
          }, 400);
        } else {
          // Encouraging coach reaction for intermediate steps
          if (movingPiece?.type === 'p') {
            setCoachMsg({
              en: currentStage.coachInitialEn,
              ur: currentStage.coachInitialUr
            });
          }
        }
      } else {
        // Invalid destination
        setSelectedSquare(null);
        setValidMoves([]);
      }
    }
  };

  // Next Stage Handler
  const handleNextStage = () => {
    if (!currentLevel || !currentStage) return;
    const stageIdx = currentLevel.stages.findIndex((s) => s.id === currentStage.id);
    if (stageIdx + 1 < currentLevel.stages.length) {
      startStage(currentLevel, currentLevel.stages[stageIdx + 1]);
    } else {
      // Find next level
      const nextLevel = LEVELS_DATA.find((l) => l.id === currentLevel.id + 1);
      if (nextLevel && nextLevel.stages.length > 0) {
        startStage(nextLevel, nextLevel.stages[0]);
      } else {
        // Conquered all levels!
        setCurrentLevel(null);
        setCurrentStage(null);
      }
    }
  };

  // ================= FREE PLAY / AI ARENA HANDLERS =================
  const restartFreePlay = () => {
    playSound.undo();
    setFpBoard(getStandardInitialBoard());
    setFpTurn('w');
    setFpSelectedSquare(null);
    setFpValidMoves([]);
    setFpLastMove(null);
    setFpHintSquare(null);
    setFpHistory([]);
    setFpNotationHistory([]);
    setFpIsAiThinking(false);
    setFpIsCheck(false);
    setFpIsGameOver(false);
    setFpGameResult(null);
    setFpEval(0);
  };

  const handleFreePlayUndo = () => {
    if (fpHistory.length === 0 || fpIsAiThinking) return;
    playSound.undo();

    // Revert 2 moves (Player + AI) or 1 move
    const stepsToRevert = fpHistory.length >= 2 ? 2 : 1;
    const newHistory = fpHistory.slice(0, fpHistory.length - stepsToRevert);
    const newNotation = fpNotationHistory.slice(0, fpNotationHistory.length - stepsToRevert);

    if (newHistory.length > 0) {
      const lastState = newHistory[newHistory.length - 1];
      setFpBoard(lastState.board);
      setFpLastMove(lastState.move);
      setFpTurn('w');
    } else {
      setFpBoard(getStandardInitialBoard());
      setFpLastMove(null);
      setFpTurn('w');
    }

    setFpHistory(newHistory);
    setFpNotationHistory(newNotation);
    setFpSelectedSquare(null);
    setFpValidMoves([]);
    setFpHintSquare(null);
    setFpIsGameOver(false);
    setFpGameResult(null);
    setFpIsCheck(false);
  };

  const handleFreePlayHint = () => {
    if (fpIsGameOver || fpIsAiThinking) return;
    const hint = getBestMoveHint(fpBoard, fpTurn, lang);
    if (hint) {
      playSound.hint();
      setFpHintSquare(hint.to);
      setCoachMsg({
        en: hint.text,
        ur: hint.text
      });
    }
  };

  // AI Move Runner Effect
  useEffect(() => {
    if (mode !== 'freeplay' || fpTurn !== 'b' || fpIsGameOver) return;

    setFpIsAiThinking(true);
    const timer = setTimeout(() => {
      const aiMove = getAIMove(fpBoard, 'b', fpDifficulty);

      if (aiMove) {
        const { newBoard, move, isCheck } = applyMove(fpBoard, aiMove.from, aiMove.to);
        const movingPiece = fpBoard[aiMove.from.row][aiMove.from.col];

        if (move.captured) {
          playSound.capture();
        } else {
          playSound.move();
        }

        if (isCheck) {
          playSound.check();
        }

        const notation = `${movingPiece?.type.toUpperCase() || 'P'}${coordToAlgebraic(
          aiMove.to.row,
          aiMove.to.col
        )}`;

        setFpBoard(newBoard);
        setFpLastMove({ from: aiMove.from, to: aiMove.to });
        setFpHistory((prev) => [...prev, { board: newBoard, move }]);
        setFpNotationHistory((prev) => [...prev, notation]);
        setFpIsCheck(isCheck);
        setFpTurn('w');
        setFpEval(evaluateBoard(newBoard));

        // Check if player has legal moves left
        const playerMoves = getLegalMovesForPiece(newBoard, { row: 0, col: 0 }, true);
        const allPlayerMoves = newBoard.flatMap((row, r) =>
          row.flatMap((cell, c) =>
            cell && cell.color === 'w' ? getLegalMovesForPiece(newBoard, { row: r, col: c }, true) : []
          )
        );

        if (allPlayerMoves.length === 0) {
          setFpIsGameOver(true);
          if (isCheck) {
            setFpGameResult(lang === 'ur' ? 'Dushman Ne Maat Kar Di!' : 'AI Delivered Checkmate!');
          } else {
            setFpGameResult(lang === 'ur' ? 'Barabar (Stalemate)' : 'Draw (Stalemate)');
          }
        }
      }

      setFpIsAiThinking(false);
    }, 600);

    return () => clearTimeout(timer);
  }, [mode, fpTurn, fpBoard, fpDifficulty, fpIsGameOver, lang]);

  // Handle Free Play Square Click
  const handleFreePlaySquareClick = (coord: SquareCoord) => {
    if (fpIsGameOver || fpIsAiThinking || fpTurn !== 'w') return;

    const clickedPiece = fpBoard[coord.row][coord.col];

    // Clicking own piece
    if (clickedPiece && clickedPiece.color === 'w') {
      playSound.hint();
      setFpSelectedSquare(coord);
      const legal = getLegalMovesForPiece(fpBoard, coord, true);
      setFpValidMoves(legal);
      return;
    }

    // Clicking destination
    if (fpSelectedSquare) {
      const isLegal = fpValidMoves.some((m) => areCoordsEqual(m, coord));

      if (isLegal) {
        const { newBoard, move, isCheck } = applyMove(fpBoard, fpSelectedSquare, coord);
        const movingPiece = fpBoard[fpSelectedSquare.row][fpSelectedSquare.col];

        if (move.captured) {
          playSound.capture();
        } else {
          playSound.move();
        }

        if (isCheck) {
          playSound.check();
        }

        const notation = `${movingPiece?.type.toUpperCase() || 'P'}${coordToAlgebraic(
          coord.row,
          coord.col
        )}`;

        setFpBoard(newBoard);
        setFpLastMove({ from: fpSelectedSquare, to: coord });
        setFpHistory((prev) => [...prev, { board: newBoard, move }]);
        setFpNotationHistory((prev) => [...prev, notation]);
        setFpSelectedSquare(null);
        setFpValidMoves([]);
        setFpHintSquare(null);
        setFpIsCheck(isCheck);
        setFpTurn('b');
        setFpEval(evaluateBoard(newBoard));

        // Check if Black is in checkmate
        const blackMoves = newBoard.flatMap((row, r) =>
          row.flatMap((cell, c) =>
            cell && cell.color === 'b' ? getLegalMovesForPiece(newBoard, { row: r, col: c }, true) : []
          )
        );

        if (blackMoves.length === 0) {
          setFpIsGameOver(true);
          if (isCheck) {
            playSound.victory();
            setFpGameResult(
              lang === 'ur'
                ? 'Mubarak! Aap Ne Checkmate Kar Diya!'
                : 'VICTORY! You Checkmated the AI!'
            );
          } else {
            setFpGameResult(lang === 'ur' ? 'Barabar (Stalemate)' : 'Draw (Stalemate)');
          }
        }
      } else {
        setFpSelectedSquare(null);
        setFpValidMoves([]);
      }
    }
  };

  // Keyboard Shortcuts (Desktop / Windows experience)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'z' || e.key === 'Z') {
        if (mode === 'freeplay') handleFreePlayUndo();
        if (mode === 'adventure') restartCurrentStage();
      } else if (e.key === 'h' || e.key === 'H') {
        if (mode === 'freeplay') handleFreePlayHint();
        if (mode === 'adventure') handleAdventureHint();
      } else if (e.key === 'r' || e.key === 'R') {
        if (mode === 'freeplay') restartFreePlay();
        if (mode === 'adventure') restartCurrentStage();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  return (
    <div
      id="chess-app-root"
      className="min-h-screen bg-[#0c0c0e] text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white bg-dot-grid"
    >
      {/* Top Navigation */}
      <Navbar
        mode={mode}
        onSelectMode={(m) => {
          setMode(m);
          if (m === 'adventure' && !currentLevel) {
            // Keep map open
          }
        }}
        lang={lang}
        onToggleLanguage={handleToggleLanguage}
        theme={theme}
        onCycleTheme={handleCycleTheme}
        progress={progress}
        soundOn={soundOn}
        onToggleSound={handleToggleSound}
      />

      {/* Main Body */}
      <main className="flex-1 flex flex-col items-center justify-start p-3 sm:p-6 max-w-7xl mx-auto w-full">
        {/* ================= MODE 1: ADVENTURE ================= */}
        {mode === 'adventure' && (
          <>
            {currentLevel && currentStage ? (
              // ACTIVE ADVENTURE STAGE VIEW
              <div
                id="active-stage-view"
                className="w-full flex flex-col items-center gap-6 max-w-5xl"
              >
                {/* Top Stage Header & Back to Map bar */}
                <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-2xl bg-[#16161a] border border-slate-800 backdrop-blur-md shadow-xl">
                  <div className="flex items-center gap-3">
                    <button
                      id="back-to-map-btn"
                      onClick={() => {
                        playSound.undo();
                        setCurrentLevel(null);
                        setCurrentStage(null);
                      }}
                      className="p-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-slate-300 hover:text-white border border-slate-700 transition-all flex items-center gap-1.5 text-xs font-bold cursor-pointer"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>{t('backToMap')}</span>
                    </button>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-indigo-400 uppercase tracking-wider">
                          {lang === 'ur' ? currentLevel.nameUr : currentLevel.nameEn}
                        </span>
                        <span className="text-slate-600">•</span>
                        <span className="text-xs text-slate-400 font-bold">
                          {lang === 'ur' ? currentStage.titleUr : currentStage.titleEn}
                        </span>
                      </div>
                      <p className="text-sm font-black text-white">
                        {lang === 'ur'
                          ? currentStage.goal.descriptionUr
                          : currentStage.goal.descriptionEn}
                      </p>
                    </div>
                  </div>

                  {/* Stage Action quick triggers */}
                  <div className="flex items-center gap-2">
                    {currentStage.goal.gems && currentStage.goal.gems.length > 0 && (
                      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-black">
                        <Sparkles className="w-4 h-4 text-indigo-400" />
                        <span>
                          {t('gemsRemaining')} {gems.length}
                        </span>
                      </div>
                    )}

                    <button
                      id="stage-restart-btn"
                      onClick={restartCurrentStage}
                      title="Restart Stage"
                      className="p-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-slate-300 border border-slate-700 transition-all cursor-pointer"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Main Interactive Stage Grid (Board + Mascot Coach) */}
                <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6 items-center justify-items-center">
                  {/* Left Coach & Lesson Explanations */}
                  <div className="lg:col-span-6 w-full flex flex-col gap-4">
                    <MascotCoach
                      messageEn={coachMsg.en}
                      messageUr={coachMsg.ur}
                      lang={lang}
                      onAskHint={handleAdventureHint}
                      hintAvailable={!isStageWon}
                    />

                    {/* Lesson Explanations Box */}
                    <div className="p-4 rounded-2xl bg-[#16161a] border border-slate-800 text-xs sm:text-sm space-y-2 shadow-xl">
                      <div className="flex items-center gap-2 text-indigo-400 font-bold uppercase tracking-wider text-xs">
                        <HelpCircle className="w-4 h-4" />
                        {lang === 'ur' ? 'Mohray Ka Qanoon:' : 'Lesson Objective:'}
                      </div>
                      <ul className="space-y-1.5 text-slate-300">
                        {(lang === 'ur'
                          ? currentStage.explanationUr
                          : currentStage.explanationEn
                        ).map((exp, idx) => (
                          <li key={idx} className="flex items-start gap-2 leading-relaxed">
                            <span className="text-indigo-400 font-bold">•</span>
                            <span>{exp}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Right Chessboard */}
                  <div className="lg:col-span-6 flex flex-col items-center justify-center w-full">
                    <ChessBoard
                      board={board}
                      selectedSquare={selectedSquare}
                      validMoves={validMoves}
                      lastMove={lastMove}
                      hintSquare={hintSquare}
                      gems={gems}
                      theme={theme}
                      playerColor={currentStage.playerColor}
                      onSquareClick={handleAdventureSquareClick}
                      allowedPieces={currentStage.allowedPieces}
                    />
                  </div>
                </div>
              </div>
            ) : (
              // ADVENTURE LEVEL SELECTION MAP
              <LevelSelector
                levels={LEVELS_DATA}
                progress={progress}
                lang={lang}
                onSelectStage={startStage}
              />
            )}
          </>
        )}

        {/* ================= MODE 2: FREE PLAY / AI ARENA ================= */}
        {mode === 'freeplay' && (
          <div
            id="freeplay-arena-container"
            className="w-full flex flex-col items-center gap-6 max-w-5xl"
          >
            {/* Mascot Coach Guidance for AI arena */}
            <div className="w-full flex justify-center">
              <MascotCoach
                messageEn={
                  fpIsGameOver
                    ? fpGameResult || 'Match Concluded!'
                    : coachMsg.en || t('coachDefault')
                }
                messageUr={
                  fpIsGameOver
                    ? fpGameResult || 'Khel Khatam!'
                    : coachMsg.ur || t('coachDefault')
                }
                lang={lang}
                onAskHint={handleFreePlayHint}
                hintAvailable={!fpIsGameOver && !fpIsAiThinking}
              />
            </div>

            {/* Board & Control Panel Grid */}
            <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-start justify-items-center">
              {/* Chessboard */}
              <div className="lg:col-span-7 flex justify-center w-full">
                <ChessBoard
                  board={fpBoard}
                  selectedSquare={fpSelectedSquare}
                  validMoves={fpValidMoves}
                  lastMove={fpLastMove}
                  hintSquare={fpHintSquare}
                  isFlipped={fpIsFlipped}
                  theme={theme}
                  playerColor="w"
                  kingInCheckCoord={
                    fpIsCheck
                      ? fpTurn === 'w'
                        ? null
                        : null
                      : null
                  }
                  onSquareClick={handleFreePlaySquareClick}
                />
              </div>

              {/* Match Controls & History */}
              <div className="lg:col-span-5 w-full flex justify-center">
                <FreePlayControls
                  difficulty={fpDifficulty}
                  onChangeDifficulty={(d) => {
                    playSound.hint();
                    setFpDifficulty(d);
                  }}
                  playerColor="w"
                  turnColor={fpTurn}
                  isAiThinking={fpIsAiThinking}
                  isCheck={fpIsCheck}
                  isGameOver={fpIsGameOver}
                  gameResult={fpGameResult}
                  evalScore={fpEval}
                  moveHistory={fpNotationHistory}
                  lang={lang}
                  onAskHint={handleFreePlayHint}
                  onUndo={handleFreePlayUndo}
                  onRestart={restartFreePlay}
                  onFlipBoard={() => {
                    playSound.move();
                    setFpIsFlipped(!fpIsFlipped);
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {/* ================= MODE 3: PIECE ACADEMY ================= */}
        {mode === 'encyclopedia' && <PieceGuideModal lang={lang} />}
      </main>

      {/* Victory Celebration Modal */}
      {currentStage && (
        <VictoryModal
          isOpen={victoryModalOpen}
          stars={3}
          xpGained={50}
          titleEn={currentStage.titleEn}
          titleUr={currentStage.titleUr}
          coachSuccessEn={currentStage.coachSuccessEn}
          coachSuccessUr={currentStage.coachSuccessUr}
          lang={lang}
          hasNextStage={true}
          onNextStage={handleNextStage}
          onRetry={restartCurrentStage}
          onBackToMap={() => {
            setVictoryModalOpen(false);
            setCurrentLevel(null);
            setCurrentStage(null);
          }}
        />
      )}
    </div>
  );
}
