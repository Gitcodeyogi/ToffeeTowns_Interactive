import React, { useEffect, useState } from 'react';
import { FONT } from '../lib/uiConstants';

interface BadgeUnlockedModalProps {
  badgeTitle: string;
  badgeIcon?: string;
  missionName: string;
  xpGained: number;
  legacyGained: number;
  onClose: () => void;
}

const CONFETTI_COLORS = [
  '#f59e0b', '#fb923c', '#c084fc', '#34d399', '#60a5fa', '#f472b6', '#facc15',
];

const BadgeUnlockedModal: React.FC<BadgeUnlockedModalProps> = ({
  badgeTitle,
  badgeIcon = '🏅',
  missionName,
  xpGained,
  legacyGained,
  onClose,
}) => {
  const [particles] = useState(() =>
    Array.from({ length: 40 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: -10 - Math.random() * 20,
      vx: (Math.random() - 0.5) * 3,
      vy: 2 + Math.random() * 3,
      color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
      size: 6 + Math.random() * 8,
      rotation: Math.random() * 360,
      delay: Math.random() * 0.8,
      duration: 0.8 + Math.random(),
    }))
  );
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Entrance animation
    const t = setTimeout(() => setVisible(true), 50);
    // Auto-close after 6s
    const ac = setTimeout(onClose, 6000);
    return () => { clearTimeout(t); clearTimeout(ac); };
  }, [onClose]);

  return (
    <div
      className={`fixed inset-0 z-[500] flex items-center justify-center p-6 transition-all duration-500 ${visible ? 'opacity-100' : 'opacity-0'}`}
      style={{ background: 'rgba(0,0,0,0.60)' }}
      onClick={onClose}
    >
      {/* Confetti particles */}
      {particles.map(p => (
        <div
          key={p.id}
          className="absolute pointer-events-none rounded-sm animate-bounce"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            background: p.color,
            transform: `rotate(${p.rotation}deg)`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            opacity: 0.85,
          }}
        />
      ))}

      {/* Modal card */}
      <div
        className={`relative max-w-sm w-full rounded-[2.5rem] border-2 border-amber-500/40 overflow-hidden shadow-[0_0_80px_rgba(245,158,11,0.3)] transition-all duration-700 ${visible ? 'scale-100 translate-y-0' : 'scale-75 translate-y-8'}`}
        style={{ background: 'linear-gradient(135deg,rgba(20,14,4,0.98) 0%,rgba(12,8,2,0.99) 100%)' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Top accent line */}
        <div className="h-[3px] w-full" style={{ background: 'linear-gradient(to right,transparent,#f59e0b 30%,#fb923c 70%,transparent)' }} />

        {/* Glow */}
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 50% 0%,rgba(245,158,11,0.12) 0%,transparent 70%)' }} />

        <div className="p-8 text-center relative z-10">
          {/* Badge icon */}
          <div className="relative inline-block mb-4">
            <div className="w-24 h-24 rounded-full bg-amber-500/10 border-2 border-amber-500/30 flex items-center justify-center text-5xl mx-auto shadow-[0_0_40px_rgba(245,158,11,0.4)]">
              {badgeIcon}
            </div>
            <div className="absolute -top-1 -right-1 w-8 h-8 rounded-full bg-amber-500 border-2 border-black flex items-center justify-center text-black text-sm font-black">
              ★
            </div>
          </div>

          <p className="text-[10px] uppercase tracking-[0.45em] text-amber-400 font-black font-sans mb-1">Badge Unlocked!</p>
          <h2 className="text-2xl font-brand text-white uppercase leading-none" style={{ fontFamily: FONT }}>
            {badgeTitle}
          </h2>
          <p className="text-[12px] text-white/55 mt-2 font-sans">{missionName}</p>

          {/* Rewards row */}
          <div className="flex items-center justify-center gap-4 mt-5 mb-5">
            {[
              { label: `+${xpGained} XP`, color: 'text-cyan-400', bg: 'bg-cyan-500/10 border-cyan-500/30' },
              { label: `+${legacyGained} Legacy`, color: 'text-amber-300', bg: 'bg-amber-500/10 border-amber-500/30' },
              { label: '+1 Badge', color: 'text-purple-300', bg: 'bg-purple-500/10 border-purple-500/30' },
            ].map(r => (
              <div key={r.label} className={`px-3 py-1.5 rounded-xl border ${r.bg} ${r.color} text-[11px] font-black font-sans`}>
                {r.label}
              </div>
            ))}
          </div>

          {/* Action */}
          <button
            onClick={onClose}
            className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-black font-black uppercase text-[11px] tracking-widest rounded-xl hover:scale-[1.02] active:scale-[0.98] transition shadow-[0_0_20px_rgba(245,158,11,0.35)]"
            style={{ fontFamily: '"Josefin Sans", sans-serif' }}
          >
            Claim Reward 🎖️
          </button>

          <p className="text-[9px] text-white/20 mt-3 font-sans">Closes automatically in 6 seconds</p>
        </div>
      </div>
    </div>
  );
};

export default BadgeUnlockedModal;
