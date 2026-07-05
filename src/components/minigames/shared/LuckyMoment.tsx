// LuckyMoment.tsx
// ─────────────────────────────────────────────────────────────────────────────
// "Lucky Moment" overlay — a rare golden cocoa leaf drifts across the screen
// during any mini-game. If the player taps it before it floats away, they earn
// a surprise reward: coins, a sticker, a decoration, an NPC note, or a
// butterfly for their nature collection.
//
// Usage: Mount <LuckyMomentOverlay onReward={fn} /> inside your game wrapper.
// It self-manages its own appearance timing and state.
// ─────────────────────────────────────────────────────────────────────────────
import React, { useState, useEffect, useCallback, useRef } from 'react';

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Luckiest+Guy&family=Nunito:wght@700;900&display=swap');
  .lm-lucky  { font-family: 'Luckiest Guy', cursive !important; }
  .lm-nunito { font-family: 'Nunito', sans-serif !important; }

  @keyframes lmDrift {
    0%   { left: -8%; top: 55%; transform: rotate(-15deg) scale(0.8); opacity: 0; }
    8%   { opacity: 1; }
    92%  { opacity: 1; }
    100% { left: 108%; top: 25%; transform: rotate(25deg) scale(1.1); opacity: 0; }
  }
  @keyframes lmWiggle {
    0%,100% { transform: rotate(-10deg) scale(1); }
    25%     { transform: rotate(12deg)  scale(1.1); }
    75%     { transform: rotate(-8deg)  scale(0.95); }
  }
  @keyframes lmGlow {
    0%,100% { box-shadow: 0 0 20px 6px rgba(250,204,21,0.4); }
    50%     { box-shadow: 0 0 40px 14px rgba(250,204,21,0.8); }
  }
  @keyframes lmBurst {
    0%   { transform: scale(0.3);  opacity: 0; }
    40%  { transform: scale(1.35); opacity: 1; }
    70%  { transform: scale(0.9);  }
    100% { transform: scale(1);    opacity: 1; }
  }
  @keyframes lmShimmer {
    0%,100% { opacity: 0.6; }
    50%     { opacity: 1; }
  }
  @keyframes lmParticle {
    0%   { transform: translate(0,0) scale(1);   opacity: 1; }
    100% { transform: translate(var(--dx),var(--dy)) scale(0); opacity: 0; }
  }
  @keyframes lmFadeIn {
    from { opacity: 0; transform: translateY(20px) scale(0.9); }
    to   { opacity: 1; transform: translateY(0)    scale(1);   }
  }
  @keyframes lmFadeOut {
    from { opacity: 1; }
    to   { opacity: 0; transform: scale(0.85); }
  }
  @keyframes lmHint {
    0%   { transform: scale(1)    rotate(0deg); }
    30%  { transform: scale(1.15) rotate(-5deg); }
    60%  { transform: scale(1.1)  rotate(4deg); }
    100% { transform: scale(1)    rotate(0deg); }
  }
  @keyframes lmTimerShrink {
    from { width: 100%; }
    to   { width: 0%; }
  }
`;

// ── Reward pool ───────────────────────────────────────────────────────────────
export interface LuckyReward {
  type: 'coins' | 'sticker' | 'butterfly' | 'npc_note' | 'decoration';
  icon: string;
  label: string;
  desc: string;
  value?: number;
  color: string;
  bgColor: string;
}

const LUCKY_REWARDS: LuckyReward[] = [
  {
    type: 'coins', icon: '🪙', label: 'Cocoa Coin Shower!',
    desc: 'Sir Goldwhistle spotted your quick reflexes and tossed you a handful of coins!',
    value: 15, color: '#facc15', bgColor: 'rgba(250,204,21,0.15)',
  },
  {
    type: 'coins', icon: '🪙', label: 'Bonus Coins!',
    desc: 'A stray coin rolled out of Pipkin\'s prank sack and landed at your feet!',
    value: 10, color: '#fbbf24', bgColor: 'rgba(251,191,36,0.15)',
  },
  {
    type: 'sticker', icon: '⭐', label: 'Golden Star Sticker!',
    desc: 'A rare collectible sticker glowing with the warmth of Ganache Grove has been added to your album!',
    color: '#f59e0b', bgColor: 'rgba(245,158,11,0.12)',
  },
  {
    type: 'butterfly', icon: '🦋', label: 'Rare Butterfly Found!',
    desc: 'A Velvet Cocoa Butterfly has been added to your Nature Collection! Julie from the Gazette would love to see this.',
    color: '#a78bfa', bgColor: 'rgba(167,139,250,0.12)',
  },
  {
    type: 'npc_note', icon: '📜', label: 'Secret NPC Message!',
    desc: '"Keep your eyes open, dear traveller — the grove rewards the curious." — Dr. Cedric Oakenhart',
    color: '#4ade80', bgColor: 'rgba(74,222,128,0.1)',
  },
  {
    type: 'decoration', icon: '🏡', label: 'Rare Decoration Unlocked!',
    desc: 'A hand-carved Cocoa Lantern has appeared in your cottage decorations — only lucky wanderers find these!',
    color: '#f472b6', bgColor: 'rgba(244,114,182,0.12)',
  },
  {
    type: 'npc_note', icon: '📜', label: 'Whisper from the Forest!',
    desc: '"The fastest tap wins the sweetest prize — that\'s what Rowan always says!" — Pipkin Nutterby 🐿️',
    color: '#34d399', bgColor: 'rgba(52,211,153,0.1)',
  },
  {
    type: 'butterfly', icon: '🦋', label: 'Midnight Wing Butterfly!',
    desc: 'A shimmering Midnight Wing fluttered past and you caught it! It glows only when held by a true resident of ToffeeTowns.',
    color: '#60a5fa', bgColor: 'rgba(96,165,250,0.12)',
  },
];

// ── Particle burst ────────────────────────────────────────────────────────────
const PARTICLE_COLORS = ['#facc15', '#f472b6', '#60a5fa', '#4ade80', '#f97316', '#a78bfa', '#34d399'];
interface Particle { id: number; color: string; dx: string; dy: string; size: number; }

const makeBurst = (): Particle[] =>
  Array.from({ length: 20 }, (_, i) => ({
    id: i,
    color: PARTICLE_COLORS[i % PARTICLE_COLORS.length],
    dx: `${(Math.random() - 0.5) * 120}px`,
    dy: `${(Math.random() - 0.5) * 120}px`,
    size: 5 + Math.random() * 8,
  }));

// ── Types ─────────────────────────────────────────────────────────────────────
interface LuckyMomentOverlayProps {
  /** Called with the reward when the player taps the golden leaf */
  onReward: (reward: LuckyReward) => void;
  /** Time window (ms) the leaf is visible before floating away */
  tapWindowMs?: number;
  /** Minimum ms between lucky moments */
  minIntervalMs?: number;
  /** Maximum ms between lucky moments */
  maxIntervalMs?: number;
  /** Chance (0–1) of a lucky moment triggering each interval check */
  spawnChance?: number;
}

type LMPhase = 'idle' | 'floating' | 'tapped' | 'missed';

export const LuckyMomentOverlay: React.FC<LuckyMomentOverlayProps> = ({
  onReward,
  tapWindowMs = 3500,
  minIntervalMs = 22000,
  maxIntervalMs = 45000,
  spawnChance = 0.3,
}) => {
  const [phase, setPhase] = useState<LMPhase>('idle');
  const [reward, setReward] = useState<LuckyReward | null>(null);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [showReward, setShowReward] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const scheduleRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  // Pick a random reward
  const pickReward = () => LUCKY_REWARDS[Math.floor(Math.random() * LUCKY_REWARDS.length)];

  // Schedule next lucky moment
  const scheduleNext = useCallback(() => {
    const delay = minIntervalMs + Math.random() * (maxIntervalMs - minIntervalMs);
    scheduleRef.current = setTimeout(() => {
      if (Math.random() <= spawnChance) {
        setReward(pickReward());
        setPhase('floating');
        // Auto-miss if not tapped within window
        timerRef.current = setTimeout(() => {
          setPhase('missed');
          setTimeout(() => { setPhase('idle'); scheduleNext(); }, 800);
        }, tapWindowMs);
      } else {
        scheduleNext();
      }
    }, delay);
  }, [minIntervalMs, maxIntervalMs, spawnChance, tapWindowMs]);

  useEffect(() => {
    scheduleNext();
    return () => {
      clearTimeout(timerRef.current);
      clearTimeout(scheduleRef.current);
    };
  }, [scheduleNext]);

  const handleTap = () => {
    if (phase !== 'floating' || !reward) return;
    clearTimeout(timerRef.current);
    setParticles(makeBurst());
    setPhase('tapped');
    setShowReward(true);
    onReward(reward);

    // Hide reward card after 4s, then reschedule
    setTimeout(() => {
      setShowReward(false);
      setPhase('idle');
      setParticles([]);
      scheduleNext();
    }, 4200);
  };

  if (phase === 'idle') return null;

  return (
    <>
      <style>{CSS}</style>

      {/* The drifting golden cocoa leaf */}
      {phase === 'floating' && (
        <button
          onClick={handleTap}
          className="absolute z-[500] cursor-pointer select-none lm-lucky"
          style={{
            animation: `lmDrift ${tapWindowMs}ms linear both`,
            background: 'transparent',
            border: 'none',
            padding: 0,
            top: '50%',
            left: '-8%',
          }}>
          {/* Leaf container */}
          <div className="relative flex flex-col items-center gap-1"
            style={{ animation: 'lmWiggle 1.2s ease infinite' }}>
            {/* Glowing cocoa leaf */}
            <div className="relative w-16 h-16 rounded-full flex items-center justify-center"
              style={{
                background: 'radial-gradient(circle at 40% 35%, #fef08a, #facc15, #d97706)',
                animation: 'lmGlow 1.5s ease infinite',
                boxShadow: '0 0 30px rgba(250,204,21,0.7), 0 0 0 3px rgba(250,204,21,0.3)',
                border: '3px solid rgba(255,255,255,0.5)',
              }}>
              <span style={{ fontSize: '2.2rem', filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.4))' }}>🍃</span>
              {/* Shimmer sparkle */}
              <div className="absolute inset-0 rounded-full"
                style={{ background: 'linear-gradient(135deg,rgba(255,255,255,0.5) 0%,transparent 60%)', animation: 'lmShimmer 1.2s ease infinite' }} />
            </div>
            {/* Hint label */}
            <div className="px-2.5 py-1 rounded-xl lm-lucky text-[10px] text-black uppercase tracking-wider whitespace-nowrap"
              style={{
                background: 'linear-gradient(135deg,#facc15,#fbbf24)',
                boxShadow: '0 3px 0 rgba(0,0,0,0.4)',
                animation: 'lmHint 2s ease infinite',
              }}>
              ✨ TAP ME!
            </div>
            {/* Tap countdown bar */}
            <div className="w-16 h-1.5 rounded-full overflow-hidden mt-0.5" style={{ background: 'rgba(0,0,0,0.3)' }}>
              <div className="h-full rounded-full bg-yellow-400"
                style={{ animation: `lmTimerShrink ${tapWindowMs}ms linear both` }} />
            </div>
          </div>
        </button>
      )}

      {/* Missed flash */}
      {phase === 'missed' && (
        <div className="absolute z-[500] pointer-events-none lm-lucky text-yellow-400 text-sm"
          style={{ top: '30%', left: '50%', transform: 'translateX(-50%)', animation: 'lmFadeOut 0.8s ease both' }}>
          💨 Drifted away...
        </div>
      )}

      {/* Tap burst + reward card */}
      {phase === 'tapped' && (
        <div className="absolute inset-0 z-[500] flex items-center justify-center pointer-events-none">
          {/* Particle burst at center */}
          <div className="relative w-0 h-0">
            {particles.map(p => (
              <div key={p.id} className="absolute rounded-full"
                style={{
                  width: p.size, height: p.size,
                  background: p.color,
                  '--dx': p.dx, '--dy': p.dy,
                  animation: 'lmParticle 0.7s ease both',
                  transform: 'translate(-50%,-50%)',
                } as React.CSSProperties} />
            ))}
          </div>

          {/* Reward reveal card */}
          {showReward && reward && (
            <div className="absolute inset-x-4 pointer-events-auto"
              style={{ top: '20%', animation: 'lmBurst 0.5s cubic-bezier(0.34,1.56,0.64,1) both' }}>
              <div className="rounded-3xl p-5 flex flex-col items-center gap-3 text-center"
                style={{
                  background: `linear-gradient(160deg,${reward.bgColor},rgba(0,0,0,0.85))`,
                  border: `2px solid ${reward.color}50`,
                  boxShadow: `0 0 60px ${reward.color}40, 0 20px 60px rgba(0,0,0,0.7)`,
                }}>
                {/* Glow ring */}
                <div className="w-20 h-20 rounded-full flex items-center justify-center relative"
                  style={{ background: `${reward.color}20`, border: `3px solid ${reward.color}60`, boxShadow: `0 0 30px ${reward.color}50` }}>
                  <span style={{ fontSize: '2.8rem', animation: 'lmWiggle 1.5s ease infinite' }}>{reward.icon}</span>
                  <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center"
                    style={{ background: reward.color, boxShadow: `0 0 10px ${reward.color}` }}>
                    <span className="text-black text-xs lm-lucky">✨</span>
                  </div>
                </div>

                <div>
                  <p className="lm-lucky text-xl" style={{ color: reward.color, textShadow: `0 3px 0 rgba(0,0,0,0.4)` }}>
                    {reward.label}
                  </p>
                  <p className="lm-nunito text-white/70 text-xs leading-relaxed mt-1.5 max-w-xs">{reward.desc}</p>
                </div>

                {reward.value && (
                  <div className="flex items-center gap-2 px-4 py-2 rounded-2xl"
                    style={{ background: `${reward.color}20`, border: `1.5px solid ${reward.color}40` }}>
                    <span className="text-xl">🪙</span>
                    <span className="lm-lucky text-2xl" style={{ color: reward.color }}>+{reward.value}</span>
                    <span className="lm-nunito text-white/60 text-xs">Cocoa Coins</span>
                  </div>
                )}

                <div className="flex items-center gap-1.5 lm-nunito text-white/30 text-[10px]">
                  <span>✨</span><span>Lucky Moment — rare once-in-a-while surprise</span><span>✨</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};
