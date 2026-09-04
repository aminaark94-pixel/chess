import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { Star, Trophy, ArrowRight, RotateCcw, Map, Zap, Sparkles } from 'lucide-react';
import { Language } from '../types/chess';
import { getTranslation } from '../utils/translations';
import { playSound } from '../utils/audio';

interface VictoryModalProps {
  isOpen: boolean;
  stars: number;
  xpGained: number;
  titleEn: string;
  titleUr: string;
  coachSuccessEn: string;
  coachSuccessUr: string;
  lang: Language;
  hasNextStage: boolean;
  onNextStage: () => void;
  onRetry: () => void;
  onBackToMap: () => void;
}

export const VictoryModal: React.FC<VictoryModalProps> = ({
  isOpen,
  stars,
  xpGained,
  titleEn,
  titleUr,
  coachSuccessEn,
  coachSuccessUr,
  lang,
  hasNextStage,
  onNextStage,
  onRetry,
  onBackToMap
}) => {
  const t = (key: Parameters<typeof getTranslation>[1]) => getTranslation(lang, key);

  useEffect(() => {
    if (isOpen) {
      playSound.victory();
      // Confetti burst
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {
        // Ignore if confetti fails in iframe
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div
        id="victory-modal-overlay"
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
      >
        <motion.div
          id="victory-modal-content"
          initial={{ scale: 0.85, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.85, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 350, damping: 25 }}
          className="relative w-full max-w-md bg-[#16161a] rounded-3xl border border-slate-800 p-6 sm:p-8 shadow-2xl text-center overflow-hidden"
        >
          {/* Background Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -mt-16 w-56 h-56 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />

          {/* Trophy Header Icon */}
          <div className="relative mx-auto w-20 h-20 rounded-3xl bg-indigo-600 p-1 shadow-lg shadow-indigo-600/40 flex items-center justify-center mb-4">
            <div className="w-full h-full bg-[#16161a] rounded-[20px] flex items-center justify-center">
              <Trophy className="w-10 h-10 text-indigo-400 animate-bounce" />
            </div>
          </div>

          {/* Title */}
          <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight uppercase">
            {t('stageComplete')}
          </h3>
          <p className="text-sm font-bold text-indigo-400 mt-0.5">
            {lang === 'ur' ? titleUr : titleEn}
          </p>

          {/* Stars Array */}
          <div className="flex items-center justify-center gap-3 my-4">
            {[1, 2, 3].map((starNum) => (
              <motion.div
                key={starNum}
                initial={{ scale: 0, rotate: -30 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.2 + starNum * 0.15, type: 'spring' }}
              >
                <Star
                  className={`w-10 h-10 ${
                    starNum <= stars
                      ? 'text-amber-400 fill-amber-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.6)]'
                      : 'text-zinc-800'
                  }`}
                />
              </motion.div>
            ))}
          </div>

          {/* XP & Rewards Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-sm font-black mb-4">
            <Zap className="w-4 h-4 text-indigo-400" />
            <span>+{xpGained} XP</span>
            <span className="text-slate-600">•</span>
            <span className="text-emerald-400">{t('accuracy')}</span>
          </div>

          {/* Coach Advice */}
          <div className="p-4 rounded-2xl bg-zinc-900/90 border border-slate-800 text-xs sm:text-sm text-slate-200 font-medium mb-6 leading-relaxed text-left">
            <span className="text-indigo-400 font-bold block mb-1">
              {lang === 'ur' ? '💡 Ustaad Chekky Ki Tareef:' : '💡 Coach Chekky Says:'}
            </span>
            "{lang === 'ur' ? coachSuccessUr : coachSuccessEn}"
          </div>

          {/* 3D Tactile Action Buttons */}
          <div className="space-y-2.5">
            {hasNextStage ? (
              <button
                id="victory-next-btn"
                onClick={onNextStage}
                className="w-full py-3.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold uppercase tracking-wider text-sm shadow-lg shadow-indigo-600/30 border-b-4 border-indigo-800 active:border-b-0 active:translate-y-1 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <span>{t('nextStage')}</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            ) : (
              <button
                id="victory-map-btn-complete"
                onClick={onBackToMap}
                className="w-full py-3.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold uppercase tracking-wider text-sm shadow-lg shadow-indigo-600/30 border-b-4 border-indigo-800 active:border-b-0 active:translate-y-1 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Trophy className="w-5 h-5" />
                <span>{t('backToMap')}</span>
              </button>
            )}

            <div className="grid grid-cols-2 gap-2">
              <button
                id="victory-retry-btn"
                onClick={onRetry}
                className="py-2.5 px-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-slate-300 font-bold uppercase tracking-wider text-xs flex items-center justify-center gap-1.5 border-b-4 border-zinc-950 active:border-b-0 active:translate-y-1 transition-all cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{t('playAgain')}</span>
              </button>

              <button
                id="victory-map-btn"
                onClick={onBackToMap}
                className="py-2.5 px-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-slate-300 font-bold uppercase tracking-wider text-xs flex items-center justify-center gap-1.5 border-b-4 border-zinc-950 active:border-b-0 active:translate-y-1 transition-all cursor-pointer"
              >
                <Map className="w-3.5 h-3.5" />
                <span>{t('backToMap')}</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
