// ComboMeter.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Visual combo burst strip for After-Hours mode.
// Shows current streak, sugar rush meter, and combo multiplier.
// ─────────────────────────────────────────────────────────────────────────────
import React from 'react';

interface ComboMeterProps {
  combo: number;
  maxCombo: number;
  sugarRushFill: number;   // 0-100 — fills with each perfect bake
  sugarRushActive: boolean;
}

export const ComboMeter: React.FC<ComboMeterProps> = ({
  combo, maxCombo, sugarRushFill, sugarRushActive,
}) => {
  const dots = 5;
  const filled = Math.min(dots, combo);

  return (
    <div className="flex items-center gap-3 px-4 py-2 bg-black/30 border-b border-white/6">
      {/* Combo dots */}
      <div className="flex items-center gap-1.5">
        <span className="text-[8px] uppercase tracking-widest text-white/25 font-black">Combo</span>
        <div className="flex gap-1">
          {Array.from({ length: dots }).map((_, i) => (
            <div
              key={i}
              className={`w-3 h-3 rounded-full border transition-all duration-300 ${
                i < filled
                  ? 'border-amber-400 bg-amber-400 shadow-[0_0_6px_rgba(251,191,36,0.6)]'
                  : 'border-white/15 bg-transparent'
              }`}
            />
          ))}
        </div>
        {combo > 0 && (
          <span className={`text-sm font-black ml-1 ${
            combo >= 5 ? 'text-amber-300 animate-pulse' : 'text-amber-400/70'
          }`}>×{combo}</span>
        )}
      </div>

      {/* Best combo this session */}
      {maxCombo >= 3 && (
        <div className="text-[9px] text-white/30">
          Best <span className="text-orange-400 font-black">×{maxCombo}</span>
        </div>
      )}

      {/* Sugar Rush meter */}
      <div className="flex-1 flex items-center gap-2 ml-2">
        <span className="text-[8px] text-white/25 uppercase font-black shrink-0">🍬 Rush</span>
        <div className="flex-1 h-2 bg-white/8 rounded-full overflow-hidden relative">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              sugarRushActive
                ? 'bg-gradient-to-r from-pink-500 to-purple-400 animate-pulse'
                : 'bg-gradient-to-r from-rose-700 to-pink-500'
            }`}
            style={{ width: `${sugarRushFill}%` }}
          />
        </div>

        {sugarRushActive && (
          <span className="text-[9px] font-black text-pink-300 animate-pulse shrink-0">
            RUSH! 🍬
          </span>
        )}
      </div>

      {/* Multiplier badge */}
      {(combo >= 3 || sugarRushActive) && (
        <div
          className={`px-2 py-1 rounded-lg border text-center shrink-0 transition-all ${
            sugarRushActive
              ? 'border-pink-500/50 bg-pink-950/25 animate-bounce'
              : 'border-amber-500/30 bg-amber-950/15'
          }`}
        >
          <p className="text-[7px] uppercase text-white/30 font-black">Mult</p>
          <p className={`text-xs font-black ${sugarRushActive ? 'text-pink-300' : 'text-amber-300'}`}>
            ×{sugarRushActive ? '1.5+' : combo >= 5 ? '1.5' : '1.2'}
          </p>
        </div>
      )}
    </div>
  );
};

// ── Score Display ──────────────────────────────────────────────────────────────
interface ScoreDisplayProps {
  score: number;
  personalBest: number;
  isNewRecord: boolean;
}

export const ScoreDisplay: React.FC<ScoreDisplayProps> = ({
  score, personalBest, isNewRecord,
}) => (
  <div className="flex items-center gap-3 px-4">
    <div className="text-center">
      <p className="text-[8px] uppercase tracking-widest text-white/25 font-black">Score</p>
      <p className={`text-2xl font-black tabular-nums ${
        isNewRecord ? 'text-amber-300 drop-shadow-[0_0_8px_rgba(251,191,36,0.4)]' : 'text-white'
      }`}>
        {score.toLocaleString()}
      </p>
    </div>
    {isNewRecord && (
      <span className="text-[9px] font-black text-amber-400 bg-amber-500/10 border border-amber-500/25 px-2 py-0.5 rounded-full animate-pulse">
        🏆 NEW BEST!
      </span>
    )}
    {!isNewRecord && personalBest > 0 && (
      <div className="text-[9px] text-white/20">
        Best <span className="text-white/40 font-black">{personalBest.toLocaleString()}</span>
      </div>
    )}
  </div>
);
