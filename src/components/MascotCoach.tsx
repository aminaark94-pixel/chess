import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Lightbulb } from 'lucide-react';
import { Language } from '../types/chess';
import { playSound } from '../utils/audio';

interface MascotCoachProps {
  messageEn: string;
  messageUr: string;
  lang: Language;
  onAskHint?: () => void;
  hintAvailable?: boolean;
}

export const MascotCoach: React.FC<MascotCoachProps> = ({
  messageEn,
  messageUr,
  lang,
  onAskHint,
  hintAvailable = true
}) => {
  const currentMessage = lang === 'ur' ? messageUr : messageEn;

  const handleMascotClick = () => {
    playSound.hint();
  };

  return (
    <div
      id="mascot-coach-container"
      className="relative flex items-center gap-3.5 p-4 sm:p-5 rounded-2xl bg-indigo-600/10 border border-indigo-500/30 backdrop-blur-md shadow-xl max-w-2xl w-full"
    >
      {/* Background Decorative Ambient Glow */}
      <div className="absolute top-0 right-0 -mt-8 -mr-8 w-36 h-36 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Animated Mascot Character */}
      <motion.button
        id="mascot-avatar-btn"
        onClick={handleMascotClick}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Coach Chekky"
        className="relative flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 p-0.5 shadow-lg shadow-indigo-600/30 cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-400"
      >
        <div className="w-full h-full bg-[#16161a] rounded-[10px] flex items-center justify-center relative overflow-hidden">
          {/* Owl / Grandmaster Mascot Face */}
          <svg viewBox="0 0 60 60" className="w-10 h-10 sm:w-12 sm:h-12" fill="none">
            {/* Body */}
            <circle cx="30" cy="34" r="20" fill="#6366f1" />
            <circle cx="30" cy="36" r="16" fill="#818cf8" />
            {/* Eyes */}
            <circle cx="23" cy="30" r="6" fill="#ffffff" stroke="#312e81" strokeWidth="1.5" />
            <circle cx="37" cy="30" r="6" fill="#ffffff" stroke="#312e81" strokeWidth="1.5" />
            <circle cx="24" cy="30" r="3" fill="#0f172a" />
            <circle cx="36" cy="30" r="3" fill="#0f172a" />
            <circle cx="25" cy="28.5" r="1" fill="#ffffff" />
            <circle cx="37" cy="28.5" r="1" fill="#ffffff" />
            {/* Glasses */}
            <path d="M17 30H29M31 30H43" stroke="#312e81" strokeWidth="1.5" />
            {/* Beak */}
            <polygon points="30,34 26,40 34,40" fill="#fbbf24" />
            {/* Grandmaster Crown */}
            <path
              d="M20 18L24 24L30 16L36 24L40 18V26H20V18Z"
              fill="#fbbf24"
              stroke="#b45309"
              strokeWidth="1.5"
            />
            <circle cx="30" cy="15" r="2" fill="#ef4444" />
            <circle cx="20" cy="17" r="1.5" fill="#38bdf8" />
            <circle cx="40" cy="17" r="1.5" fill="#38bdf8" />
          </svg>

          {/* Online badge */}
          <span className="absolute bottom-1 right-1 w-2.5 h-2.5 bg-emerald-500 border-2 border-[#16161a] rounded-full" />
        </div>
      </motion.button>

      {/* Speech Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase tracking-wider text-indigo-400 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              Coach Chekky
            </span>
            <span className="text-[10px] text-slate-400 font-bold px-1.5 py-0.5 rounded bg-zinc-900 border border-slate-800">
              {lang === 'ur' ? 'Shatranj Ustaad' : 'Guide'}
            </span>
          </div>

          {hintAvailable && onAskHint && (
            <button
              id="coach-hint-btn"
              onClick={onAskHint}
              className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/30 border-b-2 border-indigo-800 active:border-b-0 active:translate-y-0.5 transition-all cursor-pointer"
            >
              <Lightbulb className="w-3.5 h-3.5" />
              {lang === 'ur' ? 'Ishara' : 'Hint'}
            </button>
          )}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentMessage}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2 }}
            className="text-xs sm:text-sm text-slate-200 font-medium leading-relaxed"
          >
            {currentMessage}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};
