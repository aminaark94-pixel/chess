import React from 'react';
import { AIDifficulty, Language, PieceColor } from '../types/chess';
import { getTranslation } from '../utils/translations';
import {
  Lightbulb,
  RotateCcw,
  RefreshCw,
  ArrowUpDown,
  Swords,
  Bot,
  User,
  ShieldCheck,
  AlertTriangle,
  Award
} from 'lucide-react';

interface FreePlayControlsProps {
  difficulty: AIDifficulty;
  onChangeDifficulty: (diff: AIDifficulty) => void;
  playerColor: PieceColor;
  turnColor: PieceColor;
  isAiThinking: boolean;
  isCheck: boolean;
  isGameOver: boolean;
  gameResult: string | null;
  evalScore: number;
  moveHistory: string[];
  lang: Language;
  onAskHint: () => void;
  onUndo: () => void;
  onRestart: () => void;
  onFlipBoard: () => void;
}

export const FreePlayControls: React.FC<FreePlayControlsProps> = ({
  difficulty,
  onChangeDifficulty,
  playerColor,
  turnColor,
  isAiThinking,
  isCheck,
  isGameOver,
  gameResult,
  evalScore,
  moveHistory,
  lang,
  onAskHint,
  onUndo,
  onRestart,
  onFlipBoard
}) => {
  const t = (key: Parameters<typeof getTranslation>[1]) => getTranslation(lang, key);

  const isPlayerTurn = turnColor === playerColor;

  // Normalized eval bar (-1000 to +1000 converted to percentage 0-100)
  const evalPercentage = Math.max(5, Math.min(95, 50 + (evalScore / 800) * 50));

  return (
    <div
      id="freeplay-controls-panel"
      className="flex flex-col gap-4 w-full max-w-md bg-[#16161a] border border-slate-800 rounded-3xl p-5 shadow-2xl backdrop-blur-xl"
    >
      {/* Top Status & Turn Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shadow-md ${
              isPlayerTurn
                ? 'bg-indigo-600 text-white shadow-[0_0_15px_rgba(79,70,229,0.5)]'
                : 'bg-zinc-800 text-slate-300 border border-slate-700'
            }`}
          >
            {isPlayerTurn ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
          </div>
          <div>
            <div className="text-[11px] font-black uppercase tracking-wider text-slate-400">
              {lang === 'ur' ? 'Moqa / Turn' : 'Current Move'}
            </div>
            <div className="text-sm font-black text-white flex items-center gap-1.5">
              {isGameOver ? (
                <span className="text-amber-400 font-black">{gameResult}</span>
              ) : isAiThinking ? (
                <span className="text-indigo-400 animate-pulse">{t('aiTurn')}</span>
              ) : (
                <span className="text-indigo-400">{t('yourTurn')}</span>
              )}
            </div>
          </div>
        </div>

        {/* Check Indicator Badge */}
        {isCheck && !isGameOver && (
          <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-rose-500/20 border border-rose-500 text-rose-300 text-xs font-black animate-pulse">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>{t('inCheck')}</span>
          </div>
        )}
      </div>

      {/* Evaluation Advantage Bar */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-[11px] font-bold text-slate-400">
          <span>{lang === 'ur' ? 'Aapka Palra (White)' : 'White'}</span>
          <span className="text-indigo-400 font-mono font-bold">
            {evalScore > 0 ? `+${(evalScore / 100).toFixed(1)}` : (evalScore / 100).toFixed(1)}
          </span>
          <span>{lang === 'ur' ? 'Dushman (Black)' : 'Black'}</span>
        </div>
        <div className="w-full h-2.5 bg-zinc-950 rounded-full overflow-hidden border border-slate-800 flex">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 shadow-[0_0_10px_rgba(79,70,229,0.5)] transition-all duration-300"
            style={{ width: `${evalPercentage}%` }}
          />
          <div
            className="h-full bg-zinc-800 transition-all duration-300"
            style={{ width: `${100 - evalPercentage}%` }}
          />
        </div>
      </div>

      {/* Difficulty Selector */}
      <div>
        <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-1.5">
          {lang === 'ur' ? 'AI Ki Maharat (Difficulty)' : 'AI Difficulty Level'}
        </label>
        <div className="grid grid-cols-3 gap-1.5">
          {(['easy', 'medium', 'hard'] as AIDifficulty[]).map((d) => (
            <button
              key={d}
              id={`diff-btn-${d}`}
              onClick={() => onChangeDifficulty(d)}
              className={`py-2 px-2 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                difficulty === d
                  ? 'bg-indigo-600 border-indigo-400 text-white shadow-[0_0_15px_rgba(79,70,229,0.4)]'
                  : 'bg-zinc-900 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-zinc-800'
              }`}
            >
              {d === 'easy' && (lang === 'ur' ? 'Asaan' : 'Easy')}
              {d === 'medium' && (lang === 'ur' ? 'Darmiyana' : 'Medium')}
              {d === 'hard' && (lang === 'ur' ? 'Sakht' : 'Hard')}
            </button>
          ))}
        </div>
      </div>

      {/* Move History Log */}
      <div className="bg-zinc-950/80 rounded-2xl border border-slate-800 p-3 h-24 overflow-y-auto">
        <div className="text-[11px] font-black text-slate-400 uppercase tracking-wider mb-1">
          {lang === 'ur' ? 'Chaalon Ka Record (Move History)' : 'Move History'}
        </div>
        {moveHistory.length === 0 ? (
          <div className="text-xs text-slate-500 italic mt-2">
            {lang === 'ur' ? 'Pehli chaal chalain...' : 'Make your first move...'}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-xs font-mono text-slate-300">
            {moveHistory.map((mv, idx) => (
              <div key={idx} className="flex items-center gap-1.5">
                <span className="text-slate-500 w-4">{idx + 1}.</span>
                <span className="font-bold text-indigo-300">{mv}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 3D Tactile Action Buttons */}
      <div className="grid grid-cols-2 gap-2.5 pt-1">
        <button
          id="freeplay-hint-btn"
          onClick={onAskHint}
          disabled={isAiThinking || isGameOver}
          className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold uppercase tracking-wider text-xs shadow-lg shadow-indigo-600/20 border-b-4 border-indigo-800 active:border-b-0 active:translate-y-1 transition-all disabled:opacity-50 cursor-pointer"
        >
          <Lightbulb className="w-4 h-4" />
          <span>{t('hint')}</span>
        </button>

        <button
          id="freeplay-undo-btn"
          onClick={onUndo}
          disabled={isAiThinking || moveHistory.length === 0}
          className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-slate-300 font-bold uppercase tracking-wider text-xs border-b-4 border-zinc-950 active:border-b-0 active:translate-y-1 transition-all disabled:opacity-40 cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          <span>{t('undo')}</span>
        </button>

        <button
          id="freeplay-flip-btn"
          onClick={onFlipBoard}
          className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-slate-300 font-bold uppercase tracking-wider text-xs border border-slate-700 transition-all active:scale-95 cursor-pointer"
        >
          <ArrowUpDown className="w-4 h-4 text-indigo-400" />
          <span>{t('flipBoard')}</span>
        </button>

        <button
          id="freeplay-restart-btn"
          onClick={onRestart}
          className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-slate-300 font-bold uppercase tracking-wider text-xs border border-slate-700 transition-all active:scale-95 cursor-pointer"
        >
          <RefreshCw className="w-4 h-4 text-rose-400" />
          <span>{t('restart')}</span>
        </button>
      </div>
    </div>
  );
};
