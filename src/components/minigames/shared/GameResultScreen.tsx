// GameResultScreen.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Reusable generic End of Game Report.
// Displays performance metrics, narrative feedback, and Local Personal Bests.
// ─────────────────────────────────────────────────────────────────────────────
import React from 'react';
import { FONT } from '../../../lib/uiConstants';
import type { MiniGameConfig, GameRewards } from './MiniGameConfig';

export interface ResultStat {
  label: string;
  value: string | number;
  icon?: string;
  color?: string;
}

export interface FeedbackMessage {
  icon: string;
  customerName: string;
  face: string;
  message: string;
  statusLabel: string;
  statusColor: string; // e.g. text-emerald-400, text-rose-400
}

interface GameResultScreenProps {
  config: MiniGameConfig;
  score: number;
  personalBest: number;
  isWin: boolean;
  exitedEarly: boolean;
  rewards: GameRewards;
  bonusCoins: number;
  penalties: number;
  stars: number; // 1 to 5 star rating
  stats: ResultStat[];
  feedback: FeedbackMessage[];
  onTryAgain: () => void;
  onBack: () => void;
}

export const GameResultScreen: React.FC<GameResultScreenProps> = ({
  config,
  score,
  personalBest,
  isWin,
  exitedEarly,
  rewards,
  bonusCoins,
  penalties,
  stars,
  stats,
  feedback,
  onTryAgain,
  onBack,
}) => {
  const isNewRecord = score > personalBest;
  
  const coinGain = exitedEarly ? 0 : Math.max(0, rewards.coins + bonusCoins - penalties);
  const xpGain = exitedEarly ? 0 : rewards.xp;
  const legacyGain = exitedEarly ? 0 : rewards.legacy;

  const bannerColor = exitedEarly 
    ? 'linear-gradient(90deg,#ef4444,#f87171,#ef4444)' 
    : 'linear-gradient(90deg,#f59e0b,#fbbf24,#f59e0b)';

  const resultTitle = exitedEarly 
    ? 'Shift Abandoned' 
    : isWin 
      ? 'Task Perfected!' 
      : 'Shift Completed';

  return (
    <div 
      className="absolute inset-0 z-[420] flex items-center justify-center text-white"
      style={{ backgroundImage: `url(${config.backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      <div className="absolute inset-0 bg-black/80" />
      <div 
        className="relative z-10 flex flex-col animate-fade-in overflow-hidden"
        style={{ 
          width: '720px', 
          maxWidth: '95vw', 
          maxHeight: '92vh', 
          borderRadius: '2.5rem',
          border: '2px solid rgba(255,255,255,0.1)',
          background: 'rgba(12, 6, 18, 0.98)',
          boxShadow: isWin ? '0 0 80px rgba(251,191,36,0.15)' : '0 0 60px rgba(0,0,0,0.5)'
        }}
      >
        {/* Color stripe banner */}
        <div className="h-1 shrink-0 rounded-t-[2.5rem]" style={{ background: bannerColor }} />

        {/* Top Header details */}
        <div className="px-10 pt-7 pb-4 border-b border-white/8 text-center shrink-0">
          <p className="text-[10px] uppercase tracking-[0.3em] text-amber-400/60 font-black">
            {config.title} Shift Report
          </p>
          <div className="flex justify-center gap-1 my-1.5">
            {[1, 2, 3, 4, 5].map(i => (
              <span key={i} className={`text-2xl ${i <= stars ? 'text-amber-400' : 'text-white/15'}`}>
                ★
              </span>
            ))}
          </div>
          <h2 className="text-3xl font-brand uppercase tracking-tight" style={{ fontFamily: FONT, color: isWin ? '#fcd34d' : '#f97316' }}>
            {resultTitle}
          </h2>
          {isNewRecord && (
            <div className="mt-1 flex justify-center">
              <span className="bg-amber-500 text-black text-[9px] font-black uppercase px-2 py-0.5 rounded-full animate-bounce">
                👑 New Personal Best!
              </span>
            </div>
          )}
        </div>

        {/* Detailed Stats body */}
        <div className="flex-1 overflow-y-auto custom-scrollbar px-10 py-5 space-y-5">
          
          {/* Narrative Feedback from customers */}
          {feedback.length > 0 && (
            <div className="space-y-2">
              <p className="text-[10px] uppercase tracking-[0.25em] text-amber-400 font-black">💬 Resident Comments</p>
              <div className="space-y-2">
                {feedback.map((fb, idx) => (
                  <div key={idx} className="flex gap-3 items-start p-3 bg-white/4 border border-white/8 rounded-2xl">
                    <span className="text-2xl p-1 bg-white/5 rounded-xl">{fb.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-xs font-black text-white">{fb.customerName}</p>
                        <span className="text-sm">{fb.face}</span>
                        <span className={`text-[10.5px] font-black ml-auto ${fb.statusColor}`}>
                          {fb.statusLabel}
                        </span>
                      </div>
                      <p className="text-[11px] text-white/55 italic mt-0.5" style={{ fontFamily: 'Georgia, serif' }}>
                        "{fb.message}"
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Performance Stats grid */}
          {stats.length > 0 && (
            <div className="grid grid-cols-4 gap-2">
              {stats.map((s, idx) => (
                <div key={idx} className="px-2 py-2.5 bg-white/3 border border-white/6 rounded-xl text-center">
                  {s.icon && <p className="text-lg mb-0.5">{s.icon}</p>}
                  <p className={`text-base font-black ${s.color || 'text-white'}`}>{s.value}</p>
                  <p className="text-[9px] text-white/35 uppercase font-black tracking-wide mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>
          )}

          {/* Core Rewards details */}
          <div className="rounded-2xl p-px" style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))' }}>
            <div className="rounded-2xl bg-neutral-950/95 p-4 grid grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-[9px] text-white/45 uppercase font-bold">Cocoa Coins</p>
                <p className="text-xl font-brand font-black text-amber-300 mt-0.5" style={{ fontFamily: FONT }}>
                  +{coinGain} 🪙
                </p>
                {bonusCoins > 0 && <p className="text-[8px] text-emerald-400 font-bold">+{bonusCoins} streak</p>}
                {penalties > 0 && <p className="text-[8px] text-rose-400 font-bold">-{penalties} penalty</p>}
              </div>

              <div className="text-center">
                <p className="text-[9px] text-white/45 uppercase font-bold">{rewards.skillName} XP</p>
                <p className="text-xl font-brand font-black text-rose-300 mt-0.5" style={{ fontFamily: FONT }}>
                  +{xpGain} ✦
                </p>
              </div>

              <div className="text-center">
                <p className="text-[9px] text-white/45 uppercase font-bold">Town Legacy</p>
                <p className="text-xl font-brand font-black text-purple-300 mt-0.5" style={{ fontFamily: FONT }}>
                  +{legacyGain} ◈
                </p>
              </div>
            </div>
          </div>

          {/* Record comparative info */}
          <div className="text-center text-[10px] text-white/35 pt-1">
            Personal Best: <span className="text-amber-300 font-bold">{Math.max(score, personalBest).toLocaleString()} pts</span>
            {exitedEarly && <span className="text-rose-400 font-bold ml-3">Early exit penalty applied.</span>}
          </div>
        </div>

        {/* Footer actions */}
        <div className="px-10 py-6 border-t border-white/8 flex gap-4 shrink-0 bg-black/35">
          <button 
            onClick={onBack}
            className="flex-1 py-2.5 rounded-2xl border border-white/15 text-white/60 hover:bg-white/5 transition text-xs font-bold cursor-pointer"
            style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}
          >
            ← Back to Desk
          </button>
          <button 
            onClick={onTryAgain}
            className="flex-[2] py-3 rounded-2xl font-bold text-sm text-black transition hover:scale-[1.02] active:scale-[0.97] cursor-pointer"
            style={{ 
              fontFamily: 'Georgia, serif', 
              fontStyle: 'italic',
              background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
              boxShadow: '0 4px 20px rgba(245,158,11,0.4)'
            }}
          >
            🔄 Try Another Shift
          </button>
        </div>
      </div>
    </div>
  );
};
