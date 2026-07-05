// GamePausePanel.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Reusable generic Pause Dialog for all mini-games.
// ─────────────────────────────────────────────────────────────────────────────
import React from 'react';
import { FONT } from '../../../lib/uiConstants';
import type { MiniGameConfig } from './MiniGameConfig';

export interface GamePhaseInfo {
  phase: number;
  name: string;
  icon: string;
  description: string;
  current: boolean;
  completed: boolean;
}

interface GamePausePanelProps {
  config: MiniGameConfig;
  score: number;
  timeLeft: number;
  phases: GamePhaseInfo[];
  tips: string[];
  onResume: () => void;
  onQuit: () => void;
}

export const GamePausePanel: React.FC<GamePausePanelProps> = ({
  config,
  score,
  timeLeft,
  phases,
  tips,
  onResume,
  onQuit,
}) => {
  const formatTime = (s: number): string => {
    return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
  };

  const accentColor = config.accentColor;

  return (
    <div className="absolute inset-0 z-[500] flex items-center justify-center bg-black/80">
      <div 
        className="max-w-md w-full mx-4 animate-fade-in overflow-hidden text-white"
        style={{ 
          borderRadius: '2rem', 
          border: `1px solid rgba(255,255,255,0.12)`, 
          background: 'rgba(8, 4, 12, 0.98)',
          boxShadow: `0 0 60px ${accentColor}1A` 
        }}
      >
        <div className="h-0.5 rounded-t-[2rem]" style={{ background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)` }} />
        <div className="p-8 space-y-5">
          <div className="text-center">
            <p className="text-[9px] uppercase tracking-[0.35em] text-white/30 font-black">PAUSED</p>
            <h2 className="text-3xl font-black text-white mt-0.5" style={{ fontFamily: FONT }}>
              ⏸ {config.title}
            </h2>
            <p className="text-xs text-white/40 mt-1">
              Score: {score.toLocaleString()} · {formatTime(timeLeft)} left
            </p>
          </div>

          {/* Quick Tips */}
          {tips.length > 0 && (
            <div className="space-y-1.5">
              <p className="text-[9px] uppercase tracking-[0.2em] text-white/25 font-black">Quick Reference</p>
              <div className="space-y-1.5">
                {tips.map((tip, i) => {
                  const parts = tip.split('::');
                  return (
                    <div key={i} className="flex gap-2.5 p-2 bg-white/3 border border-white/5 rounded-xl">
                      <span className="text-base shrink-0">{parts[0] || '💡'}</span>
                      <div>
                        <p className="text-[10.5px] font-black text-white">{parts[1] || ''}</p>
                        <p className="text-[9.5px] text-white/45 leading-tight">{parts[2] || ''}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Phases Progress */}
          {phases.length > 0 && (
            <div className="space-y-1.5">
              <p className="text-[9px] uppercase tracking-[0.2em] text-white/25 font-black">Shift Timeline</p>
              <div className="space-y-1">
                {phases.map(ph => (
                  <div 
                    key={ph.phase} 
                    className={`flex items-center gap-3 px-3 py-1.5 rounded-xl border text-[10.5px] ${
                      ph.current 
                        ? 'border-white/20 bg-white/6' 
                        : 'border-white/5 bg-transparent'
                    }`}
                  >
                    <span>{ph.icon}</span>
                    <p className="font-bold text-white flex-1 truncate">
                      Phase {ph.phase}: {ph.name}
                    </p>
                    {ph.completed && <span className="text-[8px] text-emerald-400 font-black">✓ Done</span>}
                    {ph.current && (
                      <span className="text-[8px] font-black uppercase tracking-wider animate-pulse" style={{ color: accentColor }}>
                        NOW
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <button 
              onClick={onQuit}
              className="py-2.5 rounded-xl border border-white/10 text-white/50 text-xs font-bold hover:bg-white/5 transition cursor-pointer"
              style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}
            >
              Quit Shift
            </button>
            <button 
              onClick={onResume}
              className="py-2.5 rounded-xl font-black text-xs text-white cursor-pointer hover:scale-[1.02] transition-all"
              style={{ 
                fontFamily: 'Josefin Sans, sans-serif',
                background: `linear-gradient(135deg, ${accentColor}, ${accentColor}99)`,
                boxShadow: `0 0 20px ${accentColor}33` 
              }}
            >
              ▶ Resume
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
