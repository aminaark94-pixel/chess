import React from 'react';
import { AppMode, Language, BoardTheme, UserProgress } from '../types/chess';
import { getTranslation } from '../utils/translations';
import { playSound } from '../utils/audio';
import {
  Flame,
  Star,
  Zap,
  Globe,
  Volume2,
  VolumeX,
  Palette,
  Swords,
  BookOpen,
  Map
} from 'lucide-react';

interface NavbarProps {
  mode: AppMode;
  onSelectMode: (mode: AppMode) => void;
  lang: Language;
  onToggleLanguage: () => void;
  theme: BoardTheme;
  onCycleTheme: () => void;
  progress: UserProgress;
  soundOn: boolean;
  onToggleSound: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  mode,
  onSelectMode,
  lang,
  onToggleLanguage,
  theme,
  onCycleTheme,
  progress,
  soundOn,
  onToggleSound
}) => {
  const t = (key: Parameters<typeof getTranslation>[1]) => getTranslation(lang, key);

  return (
    <header
      id="app-header"
      className="w-full bg-[#16161a] border-b border-slate-800/90 shadow-xl sticky top-0 z-50 transition-all"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3.5 flex flex-col md:flex-row items-center justify-between gap-3.5">
        {/* Brand Identity & Game Title */}
        <div className="flex items-center justify-between w-full md:w-auto">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(79,70,229,0.5)] flex-shrink-0">
              <span className="text-2xl font-black leading-none text-white select-none">♞</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-black tracking-tight uppercase text-white">
                  CheckMate <span className="text-indigo-400">Adventure</span>
                </h1>
                <span className="text-[10px] text-slate-400 uppercase tracking-[0.2em] font-bold px-2 py-0.5 rounded bg-zinc-900 border border-slate-800 hidden sm:inline-block">
                  Level {progress.unlockedLevel}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-semibold tracking-wider uppercase">
                {lang === 'ur' ? 'Shatranj Seekhein Aur Khelein' : 'Learn & Master Chess Quests'}
              </p>
            </div>
          </div>

          {/* Mobile Quick Stats */}
          <div className="flex items-center gap-2 md:hidden">
            <div className="flex items-center gap-2 bg-zinc-900 px-3 py-1 rounded-full border border-slate-800 text-xs font-bold">
              <span className="text-amber-400">★ {progress.totalStars}</span>
              <div className="w-[1px] h-3 bg-slate-700"></div>
              <span className="text-indigo-400">Lvl {progress.unlockedLevel}</span>
            </div>
          </div>
        </div>

        {/* Navigation Mode Tabs */}
        <nav className="flex items-center p-1 rounded-xl bg-zinc-900/90 border border-slate-800 shadow-inner overflow-x-auto max-w-full">
          <button
            id="nav-tab-adventure"
            onClick={() => {
              playSound.hint();
              onSelectMode('adventure');
            }}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-bold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
              mode === 'adventure'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-white hover:bg-zinc-800/60'
            }`}
          >
            <Map className="w-4 h-4" />
            {t('adventureMode')}
          </button>

          <button
            id="nav-tab-freeplay"
            onClick={() => {
              playSound.hint();
              onSelectMode('freeplay');
            }}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-bold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
              mode === 'freeplay'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-white hover:bg-zinc-800/60'
            }`}
          >
            <Swords className="w-4 h-4" />
            {t('freePlayMode')}
          </button>

          <button
            id="nav-tab-academy"
            onClick={() => {
              playSound.hint();
              onSelectMode('encyclopedia');
            }}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-bold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
              mode === 'encyclopedia'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-white hover:bg-zinc-800/60'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            {t('encyclopediaMode')}
          </button>
        </nav>

        {/* Right Tools & Language Switcher */}
        <div className="flex items-center gap-3">
          {/* Desktop Sleek Pill Stats */}
          <div className="hidden md:flex items-center gap-3 bg-zinc-900 px-4 py-1.5 rounded-full border border-slate-800">
            <span className="text-amber-400 text-xs sm:text-sm font-bold flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              {progress.totalStars}
            </span>
            <div className="w-[1px] h-4 bg-slate-700"></div>
            <span className="text-indigo-400 text-xs sm:text-sm font-bold flex items-center gap-1">
              <Zap className="w-3.5 h-3.5" />
              {progress.xp} XP
            </span>
            <div className="w-[1px] h-4 bg-slate-700"></div>
            <span className="text-purple-400 text-xs sm:text-sm font-bold">
              Lvl {progress.unlockedLevel}
            </span>
          </div>

          {/* Bilingual Switcher Segmented Control */}
          <div className="flex bg-zinc-800 rounded-lg p-1 border border-slate-700">
            <button
              id="lang-btn-en"
              onClick={() => {
                if (lang !== 'en') onToggleLanguage();
              }}
              className={`px-3 py-1 text-xs font-bold rounded transition-all cursor-pointer ${
                lang === 'en'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              EN
            </button>
            <button
              id="lang-btn-ur"
              onClick={() => {
                if (lang !== 'ur') onToggleLanguage();
              }}
              className={`px-3 py-1 text-xs font-bold rounded transition-all cursor-pointer ${
                lang === 'ur'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              UR
            </button>
          </div>

          {/* Sound Toggle */}
          <button
            id="sound-toggle-btn"
            onClick={onToggleSound}
            aria-label="Toggle Sound"
            className={`p-2 rounded-lg border transition-all cursor-pointer ${
              soundOn
                ? 'bg-zinc-800 text-indigo-400 border-indigo-500/40 hover:bg-zinc-700'
                : 'bg-zinc-900 text-slate-500 border-slate-800 hover:text-slate-300'
            }`}
          >
            {soundOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Board Theme Toggle */}
          <button
            id="theme-toggle-btn"
            onClick={onCycleTheme}
            title={`Current Theme: ${theme}`}
            className="p-2 rounded-lg bg-zinc-800 text-slate-300 hover:text-white border border-slate-700 hover:bg-zinc-700 transition-all cursor-pointer"
          >
            <Palette className="w-4 h-4 text-indigo-400" />
          </button>
        </div>
      </div>
    </header>
  );
};
