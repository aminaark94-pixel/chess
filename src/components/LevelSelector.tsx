import React from 'react';
import { motion } from 'motion/react';
import { LevelCategory, LevelStage, Language, UserProgress } from '../types/chess';
import { ChessPieceSvg } from './ChessPieceSvg';
import { getTranslation } from '../utils/translations';
import { playSound } from '../utils/audio';
import {
  Lock,
  Star,
  Play,
  Sparkles,
  Trophy
} from 'lucide-react';

interface LevelSelectorProps {
  levels: LevelCategory[];
  progress: UserProgress;
  lang: Language;
  onSelectStage: (level: LevelCategory, stage: LevelStage) => void;
}

export const LevelSelector: React.FC<LevelSelectorProps> = ({
  levels,
  progress,
  lang,
  onSelectStage
}) => {
  const t = (key: Parameters<typeof getTranslation>[1]) => getTranslation(lang, key);

  // Check if stage is unlocked
  const isStageUnlocked = (levelId: number, stageIndex: number): boolean => {
    if (levelId < progress.unlockedLevel) return true;
    if (levelId === progress.unlockedLevel) {
      const maxStageForThisLevel = progress.unlockedStage[levelId] ?? 0;
      return stageIndex <= maxStageForThisLevel;
    }
    return false;
  };

  return (
    <div id="adventure-map-container" className="w-full max-w-5xl mx-auto px-4 py-6">
      {/* Adventure Header Banner */}
      <div className="relative mb-8 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-indigo-950 via-[#16161a] to-purple-950 border border-indigo-500/30 shadow-2xl overflow-hidden">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-black uppercase tracking-wider mb-2 border border-indigo-500/30">
              <Sparkles className="w-3.5 h-3.5" />
              {lang === 'ur' ? 'Grandmaster Safar' : 'Grandmaster Quest'}
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight uppercase">
              {lang === 'ur' ? 'Shatranj Ke 5 Bunyadi Maraahil' : 'The 5 Legendary Chess Realms'}
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-xl leading-relaxed">
              {lang === 'ur'
                ? 'Har level par naye mohray ki chaal seekhein aur interactive puzzles hal karke sitaray (stars) jeetein!'
                : 'Conquer levels, unlock powerful piece mechanics, and master checkmate strategies through interactive gameplay!'}
            </p>
          </div>

          <div className="flex items-center gap-4 bg-zinc-900/90 p-4 rounded-2xl border border-slate-800 backdrop-blur-md shadow-xl">
            <div className="text-center px-2">
              <div className="text-2xl font-black text-amber-400 flex items-center justify-center gap-1">
                <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                {progress.totalStars}
              </div>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                {t('stars')}
              </div>
            </div>
            <div className="h-8 w-px bg-slate-800" />
            <div className="text-center px-2">
              <div className="text-2xl font-black text-indigo-400">{progress.completedStages.length} / 15</div>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                {lang === 'ur' ? 'Mukammal' : 'Completed'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Levels Pathway list */}
      <div className="space-y-8">
        {levels.map((level) => {
          const isLevelUnlocked = level.id <= progress.unlockedLevel;

          return (
            <div
              key={level.id}
              id={`level-card-${level.id}`}
              className={`rounded-3xl border transition-all duration-300 overflow-hidden ${
                isLevelUnlocked
                  ? 'bg-[#16161a] border-slate-800 shadow-xl'
                  : 'bg-zinc-950/60 border-slate-900 opacity-60'
              }`}
            >
              {/* Level Category Banner */}
              <div className="p-5 sm:p-6 border-b border-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div
                    className={`w-14 h-14 rounded-2xl bg-indigo-600 p-0.5 shadow-lg shadow-indigo-600/30 flex items-center justify-center flex-shrink-0`}
                  >
                    <div className="w-full h-full bg-[#16161a] rounded-[14px] flex items-center justify-center p-2">
                      <ChessPieceSvg type={level.piece} color="w" />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg sm:text-xl font-black text-white">
                        {lang === 'ur' ? level.nameUr : level.nameEn}
                      </h3>
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-zinc-900 text-indigo-400 border border-slate-800">
                        {level.badge}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                      {lang === 'ur' ? level.descriptionUr : level.descriptionEn}
                    </p>
                  </div>
                </div>

                {!isLevelUnlocked && (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-900 text-slate-500 text-xs font-bold border border-slate-800">
                    <Lock className="w-4 h-4" />
                    {lang === 'ur' ? 'Band (Locked)' : 'Locked'}
                  </div>
                )}
              </div>

              {/* Stage Sub-Challenges Grid */}
              <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-3 gap-4 bg-zinc-950/40">
                {level.stages.map((stage, stageIdx) => {
                  const unlocked = isStageUnlocked(level.id, stageIdx);
                  const isCompleted = progress.completedStages.includes(stage.id);
                  const stars = progress.stageStars[stage.id] ?? 0;

                  return (
                    <motion.div
                      key={stage.id}
                      id={`stage-card-${stage.id}`}
                      whileHover={unlocked ? { y: -3 } : {}}
                      onClick={() => {
                        if (unlocked) {
                          playSound.hint();
                          onSelectStage(level, stage);
                        } else {
                          playSound.error();
                        }
                      }}
                      className={`relative p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between min-h-[140px] ${
                        unlocked
                          ? isCompleted
                            ? 'bg-zinc-900/90 border-emerald-500/30 hover:border-emerald-400 shadow-md'
                            : 'bg-zinc-900/90 border-slate-800 hover:border-indigo-500/60 shadow-md hover:shadow-indigo-500/10'
                          : 'bg-zinc-950/40 border-slate-900 cursor-not-allowed opacity-50'
                      }`}
                    >
                      <div>
                        {/* Stage Number & Status */}
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-black uppercase tracking-wider text-indigo-400">
                            {lang === 'ur' ? `Marhala ${stageIdx + 1}` : `Stage ${stageIdx + 1}`}
                          </span>

                          {unlocked ? (
                            isCompleted ? (
                              <div className="flex items-center gap-0.5">
                                {[1, 2, 3].map((s) => (
                                  <Star
                                    key={s}
                                    className={`w-3.5 h-3.5 ${
                                      s <= stars
                                        ? 'text-amber-400 fill-amber-400'
                                        : 'text-slate-700'
                                    }`}
                                  />
                                ))}
                              </div>
                            ) : (
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-bold border border-indigo-500/30">
                                {lang === 'ur' ? 'Khelain' : 'Ready'}
                              </span>
                            )
                          ) : (
                            <Lock className="w-3.5 h-3.5 text-slate-600" />
                          )}
                        </div>

                        {/* Title & Subtitle */}
                        <h4 className="text-sm font-bold text-white leading-snug">
                          {lang === 'ur' ? stage.titleUr : stage.titleEn}
                        </h4>
                        <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                          {lang === 'ur' ? stage.subtitleUr : stage.subtitleEn}
                        </p>
                      </div>

                      {/* Action CTA bar */}
                      <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs font-bold">
                        {unlocked ? (
                          <>
                            <span className={isCompleted ? 'text-emerald-400' : 'text-indigo-400'}>
                              {isCompleted
                                ? lang === 'ur'
                                  ? 'Dobara Khelein'
                                  : 'Replay Stage'
                                : lang === 'ur'
                                ? 'Shuru Karein'
                                : 'Start Stage'}
                            </span>
                            <div
                              className={`w-6 h-6 rounded-lg flex items-center justify-center ${
                                isCompleted
                                  ? 'bg-emerald-500/20 text-emerald-300'
                                  : 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                              }`}
                            >
                              <Play className="w-3 h-3 fill-current ml-0.5" />
                            </div>
                          </>
                        ) : (
                          <span className="text-slate-600">
                            {lang === 'ur' ? 'Pehle pichla marhala jeetein' : 'Complete previous stage'}
                          </span>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
