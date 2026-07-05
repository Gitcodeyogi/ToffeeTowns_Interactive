/* eslint-disable react-refresh/only-export-components */
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { SoundSynth } from '../shared/SoundSynth';

export interface GameProps {
  onWin: () => void;
  onFail?: () => void;
  onScoreChange?: (score: number) => void;
  addLog?: (msg: string) => void;
  difficulty?: 1 | 2 | 3;
  easyMode?: boolean;
}

interface FxEntry { id: string; text: string; color: string; x: number; y: number; big?: boolean; }


export function useEffects() {
  const [effects, setEffects] = useState<FxEntry[]>([]);
  const addEffect = useCallback((text: string, color: string, x = 50, y = 42, big = false) => {
    const id = `${Date.now()}${Math.random()}`;
    setEffects(e => [...e, { id, text, color, x, y, big }]);
    setTimeout(() => setEffects(e => e.filter(ef => ef.id !== id)), 1200);
  }, []);
  return { effects, addEffect };
}


export function EffectLayer({ effects }: { effects: FxEntry[] }) {
  return (
    <>
      {effects.map(e => (
        <span key={e.id} className="absolute pointer-events-none select-none z-50 mg-lucky animate-bounce"
          style={{
            left: `${e.x}%`, top: `${e.y}%`,
            color: e.color,
            fontSize: e.big ? '2rem' : '1.4rem',
            transform: 'translate(-50%, -50%)',
            textShadow: `0 3px 10px rgba(0,0,0,0.9), 0 0 20px ${e.color}`,
            whiteSpace: 'nowrap',
            letterSpacing: '0.03em',
          }}>
          {e.text}
        </span>
      ))}
    </>
  );
}

// ── Uniform Top Bar ───────────────────────────────────────────────────────────

interface TopBarProps {
  icon: string;
  title: string;
  score: number;
  scoreColor?: string;
  timer?: number | null;
  progress?: { current: number; total: number; label?: string };
  extra?: React.ReactNode;
}


export function TopBar({ icon, title, score, scoreColor = '#fde047', timer = null, progress, extra }: TopBarProps) {
  const timerColor = timer !== null ? (timer <= 10 ? '#f87171' : timer <= 30 ? '#fb923c' : '#86efac') : '#86efac';
  return (
    <div className="flex items-center gap-3 px-4 py-2.5 rounded-2xl mb-3 shrink-0"
      style={{ background: 'linear-gradient(135deg,rgba(0,0,0,0.5),rgba(0,0,0,0.3))', border: '2px solid rgba(255,255,255,0.08)' }}>
      <div className="text-3xl shrink-0" style={{ animation: 'mgBounce 2s ease infinite' }}>{icon}</div>
      <div className="flex-1 min-w-0">
        <p className="mg-nunito font-black text-white text-sm uppercase tracking-wide truncate leading-tight">{title}</p>
        {progress && (
          <div className="flex items-center gap-1.5 mt-1">
            <div className="flex-1 h-2 rounded-full bg-white/10 overflow-hidden">
              <div className="h-full rounded-full transition-all duration-500"
                style={{ width: `${(progress.current / progress.total) * 100}%`, background: 'linear-gradient(90deg,#34d399,#059669)' }} />
            </div>
            <span className="mg-lucky text-[10px] text-emerald-300 shrink-0">
              {progress.current}/{progress.total}
            </span>
          </div>
        )}
      </div>
      <div className="flex flex-col items-center shrink-0">
        <span className="mg-lucky leading-none" style={{ fontSize: '1.8rem', color: scoreColor, textShadow: `0 4px 0 rgba(0,0,0,0.6), 0 0 20px ${scoreColor}` }}>
          {score}
        </span>
        <span className="mg-nunito text-[9px] text-white/50 uppercase tracking-widest -mt-0.5">pts</span>
      </div>
      {extra}
    </div>
  );
}

// ── Win Banner & Fail Banner ──────────────────────────────────────────────

export function useCountdown(seconds: number) {
  const [left, setLeft] = useState(seconds);
  useEffect(() => {
    if (left <= 0) return;
    const id = setInterval(() => setLeft(n => Math.max(0, n - 1)), 1000);
    return () => clearInterval(id);
  }, [left]);
  return left;
}


export function WinBanner({ message, score, stats }: { message: string; score: number; stats?: { label: string; value: string | number; color: string }[] }) {
  const left = useCountdown(10);
  const pct  = (left / 10) * 100;
  const confettiColors = ['#4ade80','#fbbf24','#60a5fa','#f472b6','#34d399','#a78bfa'];
  return (
    <div className="absolute inset-0 z-40 flex flex-col items-center justify-center overflow-hidden"
      style={{ background:'radial-gradient(ellipse at 50% -10%, #0a2e1a 0%, #042a14 55%, #020d07 100%)', borderRadius:'2rem', animation:'mgBounceIn .55s cubic-bezier(.34,1.56,.64,1) both' }}>
      <div className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, #34d399 2px, transparent 2px)',
          backgroundSize: '16px 16px',
          animation: 'halftonePulse 2s ease infinite',
        }} />
      {Array.from({length:20}).map((_,i) => (
        <div key={i} className="absolute top-0 rounded-sm pointer-events-none"
          style={{ left:`${4+i*4.8}%`, width:7+(i%3)*3, height:7+(i%3)*3, background:confettiColors[i%6], animation:`mgConfetti ${1.3+(i%3)*.35}s ease ${i*.09}s infinite`, opacity:.85 }}
        />
      ))}
      <div className="relative z-10 flex flex-col items-center px-6 py-4 gap-3 w-full text-center">
        <span style={{ fontSize:'4.5rem', filter:'drop-shadow(0 0 24px rgba(52,211,153,.8))' }}>🏆</span>
        <div className="px-6 py-2.5 rounded-2xl" style={{ background:'linear-gradient(135deg,rgba(52,211,153,.18),rgba(52,211,153,.07))', border:'1.5px solid rgba(52,211,153,.5)' }}>
          <p className="mg-lucky text-2xl text-emerald-300 uppercase tracking-wider">{message}</p>
        </div>
        <p className="mg-lucky text-5xl text-yellow-300">+{score} PTS</p>
        {stats && (
          <div className="flex flex-wrap justify-center gap-2">
            {stats.map((s,i) => (
              <div key={i} className="px-3 py-1.5 rounded-xl flex items-center gap-1.5" style={{ background:'rgba(255,255,255,.05)', border:`1px solid ${s.color}40` }}>
                <span className="mg-lucky text-sm" style={{ color:s.color }}>{s.value}</span>
                <span className="mg-nunito text-[9px] font-black uppercase text-white/40">{s.label}</span>
              </div>
            ))}
          </div>
        )}
        <div className="w-full max-w-[260px] mt-2">
          <div className="flex justify-between items-center mb-1">
            <span className="mg-nunito text-[9px] font-black uppercase text-emerald-300/60">Moving to results in…</span>
            <span className="mg-lucky text-sm text-emerald-300">{left}s</span>
          </div>
          <div className="h-2.5 rounded-full overflow-hidden" style={{ background:'rgba(255,255,255,.08)', border:'1px solid rgba(52,211,153,.2)' }}>
            <div className="h-full rounded-full transition-all duration-1000 ease-linear" style={{ width:`${pct}%`, background:'linear-gradient(90deg,#34d399,#059669)' }} />
          </div>
        </div>
      </div>
    </div>
  );
}


export function FailBanner({ message, subtitle, score }: { message: string; subtitle: string; score?: number }) {
  const left = useCountdown(10);
  const pct  = (left / 10) * 100;
  return (
    <div className="absolute inset-0 z-40 flex flex-col items-center justify-center overflow-hidden"
      style={{ background:'radial-gradient(ellipse at 50% -10%, #2a0a0a 0%, #1a0404 55%, #070202 100%)', borderRadius:'2rem', animation:'mgBounceIn .55s cubic-bezier(.34,1.56,.64,1) both' }}>
      <div className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, #ef4444 2px, transparent 2px)',
          backgroundSize: '16px 16px',
          animation: 'halftonePulse 2s ease infinite',
        }} />
      <div className="relative z-10 flex flex-col items-center px-6 py-4 gap-3 w-full text-center">
        <span style={{ fontSize:'4.5rem', filter:'drop-shadow(0 0 24px rgba(239,68,68,.8))' }}>💔</span>
        <div className="px-6 py-2.5 rounded-2xl" style={{ background:'linear-gradient(135deg,rgba(239,68,68,.18),rgba(239,68,68,.07))', border:'1.5px solid rgba(239,68,68,.5)' }}>
          <p className="mg-lucky text-2xl text-red-300 uppercase tracking-wider">{message}</p>
        </div>
        <p className="mg-nunito text-sm font-black text-white/70">{subtitle}</p>
        {score !== undefined && score > 0 && <p className="mg-lucky text-3xl text-yellow-300">{score} PTS earned</p>}
        <div className="w-full max-w-[260px] mt-2">
          <div className="flex justify-between items-center mb-1">
            <span className="mg-nunito text-[9px] font-black uppercase text-red-300/60">Moving to results in…</span>
            <span className="mg-lucky text-sm text-red-300">{left}s</span>
          </div>
          <div className="h-2.5 rounded-full overflow-hidden" style={{ background:'rgba(255,255,255,.08)', border:'1px solid rgba(239,68,68,.2)' }}>
            <div className="h-full rounded-full transition-all duration-1000 ease-linear" style={{ width:`${pct}%`, background:'linear-gradient(90deg,#ef4444,#7f1d1d)' }} />
          </div>
        </div>
      </div>
    </div>
  );
}


export const GAME_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Luckiest+Guy&family=Nunito:wght@700;900&display=swap');
  .mg-lucky { font-family: 'Luckiest Guy', cursive !important; }
  .mg-nunito { font-family: 'Nunito', sans-serif !important; }
  @keyframes mgBounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
  @keyframes mgBounceIn { 0%{transform:scale(.3);opacity:0} 60%{transform:scale(1.1)} 100%{transform:scale(1);opacity:1} }
  @keyframes mgPulse { 0%,100%{opacity:1} 50%{opacity:.6} }
  @keyframes halftonePulse { 0%,100%{opacity:.15} 50%{opacity:.3} }
`;

export function GameWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full h-full flex flex-col p-4 bg-neutral-900 border-4 border-black rounded-[2rem] shadow-[inset_0_4px_20px_rgba(0,0,0,0.8),_8px_8px_0_rgba(0,0,0,0.95)] overflow-hidden relative"
      style={{
        background: 'radial-gradient(circle at center, #27211e 0%, #0f0c0b 100%)',
        boxSizing: 'border-box'
      }}
    >
      {/* Stud corners */}
      {['top-4 left-4', 'top-4 right-4', 'bottom-4 left-4', 'bottom-4 right-4'].map((pos, i) => (
        <div key={i} className={`absolute w-3 h-3 rounded-full border border-black/80 bg-neutral-600 shadow-[inset_0_1px_2px_rgba(255,255,255,0.3)] ${pos}`}
          style={{ background: 'radial-gradient(circle, #5e4f45, #1e1815)' }} />
      ))}
      <div className="w-full h-full relative z-10 flex flex-col min-h-0 bg-transparent">
        {children}
      </div>
    </div>
  );
}


export function SVGGear({ size, color, teeth, speed = 0 }: { size: number; color: string; teeth: number; speed?: number }) {
  const toothPoints = [];
  const rOuter = size / 2;
  const rInner = size * 0.35;
  for (let i = 0; i < teeth; i++) {
    const angle = (i * 2 * Math.PI) / teeth;
    const angleNext = ((i + 0.5) * 2 * Math.PI) / teeth;
    const angleNext2 = ((i + 1) * 2 * Math.PI) / teeth;
    toothPoints.push(`${rOuter * Math.cos(angle)},${rOuter * Math.sin(angle)}`);
    toothPoints.push(`${rOuter * Math.cos(angleNext)},${rOuter * Math.sin(angleNext)}`);
    toothPoints.push(`${rInner * Math.cos(angleNext)},${rInner * Math.sin(angleNext)}`);
    toothPoints.push(`${rInner * Math.cos(angleNext2)},${rInner * Math.sin(angleNext2)}`);
  }
  return (
    <svg width={size} height={size} viewBox={`-${size/2} -${size/2} ${size} ${size}`} className="overflow-visible"
      style={{
        animation: speed > 0 ? `mgSpin ${speed}s linear infinite` : 'none',
        filter: `drop-shadow(0 0 10px ${color})`
      }}
    >
      <path d={`M 0,-${rInner} A ${rInner} ${rInner} 0 1 1 0,${rInner} A ${rInner} ${rInner} 0 1 1 0,-${rInner} Z`} fill={color} />
      <polygon points={toothPoints.join(' ')} fill={color} opacity="0.95" stroke="#111" strokeWidth="0.5" />
      <circle cx="0" cy="0" r={rInner * 0.45} fill="#111" stroke={color} strokeWidth="1.5" />
      <circle cx="0" cy="0" r="3.5" fill={color} />
    </svg>
  );
}
