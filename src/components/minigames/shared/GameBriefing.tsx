// GameBriefing.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Reusable pre-game narrative and guidelines panel.
// ─────────────────────────────────────────────────────────────────────────────
import React from 'react';
import { FONT } from '../../../lib/uiConstants';
import type { MiniGameConfig } from './MiniGameConfig';

interface GameBriefingProps {
  config: MiniGameConfig;
  narratorName: string;
  narratorFace: string;
  storyText: string;
  instructions: string[];
  rewardsDescription: {
    icon: string;
    title: string;
    description: string;
    color: string;
  }[];
  rules: string[];
  onStart: () => void;
  onLater: () => void;
}

export const GameBriefing: React.FC<GameBriefingProps> = ({
  config,
  narratorName,
  narratorFace,
  storyText,
  instructions,
  rewardsDescription,
  rules,
  onStart,
  onLater,
}) => {
  return (
    <div 
      className="absolute inset-0 z-[400] flex items-center justify-center p-4"
      style={{ backgroundImage: `url(${config.backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      <div className="absolute inset-0 bg-black/40" />
      <div 
        className="relative z-10 flex flex-col overflow-hidden animate-fade-in w-[1040px] max-w-[95vw] max-h-[92vh] text-white"
        style={{ 
          borderRadius: '2.5rem', 
          border: '1px solid rgba(255,255,255,0.15)', 
          background: 'rgba(0,0,0,0.65)',
          backdropFilter: 'blur(16px)', 
          boxShadow: `0 25px 50px -12px rgba(0,0,0,0.5), 0 0 50px ${config.accentColor}1A` 
        }}
      >
        {/* Title Header */}
        <div className="px-8 pt-6 pb-4 border-b border-white/10 text-center relative shrink-0">
          <span className="text-[9px] uppercase tracking-[0.3em] font-black text-amber-400 font-brand">
            {narratorName}
          </span>
          <h1 className="text-3xl font-black text-white uppercase mt-1 tracking-tight flex items-center justify-center gap-2" style={{ fontFamily: FONT }}>
            <span>{narratorFace}</span> {config.title} Challenge
          </h1>
          <p className="text-[12px] text-amber-200/80 italic mt-1 font-serif max-w-xl mx-auto">
            {storyText}
          </p>
        </div>

        {/* Contents */}
        <div className="flex-grow overflow-y-auto px-8 py-6 space-y-6 custom-scrollbar min-h-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            
            {/* Left Column: Instructions */}
            <div className="space-y-6">
              <div className="space-y-3">
                <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-cyan-300">
                  🎮 How to Manage the Job
                </h3>
                <div className="grid grid-cols-1 gap-2 text-xs text-white/80 leading-relaxed">
                  {instructions.map((inst, i) => {
                    const parts = inst.split('::');
                    const icon = parts[0] || '👉';
                    const title = parts[1] || 'Action';
                    const desc = parts[2] || '';
                    return (
                      <div key={i} className="flex gap-3 items-start p-2.5 bg-white/5 border border-white/5 rounded-xl">
                        <div className="w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center shrink-0 mt-0.5">
                          <span className="text-sm">{icon}</span>
                        </div>
                        <div>
                          <h5 className="text-[11px] font-bold text-cyan-300 leading-tight">{title}</h5>
                          <p className="text-[10.5px] text-white/60 mt-0.5 leading-normal">{desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right Column: Rewards & Rules */}
            <div className="space-y-6">
              <div className="p-5 bg-gradient-to-br from-emerald-950/20 via-emerald-900/10 to-stone-900 border border-emerald-500/20 rounded-3xl space-y-4">
                <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">
                  ✨ Shift Rewards & Bonuses
                </h3>
                <div className="space-y-2.5 text-[11.5px] text-white/75 leading-normal">
                  {rewardsDescription.map((reward, i) => (
                    <div key={i} className="flex items-start gap-2.5">
                      <span className={`text-base ${reward.color}`}>{reward.icon}</span>
                      <p>
                        <span className="font-bold text-white">{reward.title}</span>{' '}
                        <span className={`${reward.color} font-bold`}>{reward.description}</span>
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {rules.length > 0 && (
                <div className="p-5 bg-gradient-to-br from-rose-950/20 via-rose-900/10 to-stone-900 border border-rose-500/20 rounded-3xl space-y-3">
                  <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-red-500">
                    ⚠️ Safety Rules & Penalties
                  </h3>
                  <div className="space-y-2 text-[11.5px] text-white/75 leading-relaxed">
                    {rules.map((rule, i) => {
                      const parts = rule.split('::');
                      return (
                        <div key={i} className="flex items-start gap-2.5">
                          <span className="text-base text-rose-400">{parts[0] || '⚠️'}</span>
                          <p>
                            <span className="font-bold text-white">{parts[1] || ''}</span>{' '}
                            <span className="text-rose-200/80 font-bold">{parts[2] || ''}</span>
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Footer actions */}
        <div className="px-8 py-5 border-t border-white/10 flex gap-4 shrink-0 bg-black/40">
          <button 
            onClick={onLater}
            className="flex-1 py-2.5 rounded-2xl border border-white/10 text-white/60 hover:bg-white/5 transition-all text-xs font-bold uppercase tracking-wider cursor-pointer"
          >
            ⏳ Try Later
          </button>
          <button 
            onClick={onStart}
            className={`flex-[2] py-2.5 rounded-2xl font-black uppercase text-xs tracking-widest text-black transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer`}
            style={{ 
              background: `linear-gradient(135deg, #fbbf24, #f59e0b)`,
              boxShadow: '0 4px 20px rgba(245,158,11,0.4)' 
            }}
          >
            🧤 Let's Begin the Job!
          </button>
        </div>
      </div>
    </div>
  );
};
