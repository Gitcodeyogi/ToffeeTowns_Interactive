// PostGameScreen.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Rebuilt premium Post-Game Screen — transparent, glassmorphic, and open to
// the background wallpaper. Details are organized in a detailed 3-column
// layout matching the pregame briefing screen, featuring Josefin Sans fonts,
// large score animations, and blueprint specifications.
// ─────────────────────────────────────────────────────────────────────────────
import React, { useState, useEffect } from 'react';
import { useTTStore } from '../../../store/useTTStore';
import { cozyAudio } from '../../../utils/audioHelper';
import { WorkbenchSpecsModal } from './PreGameScreen';

/* ─── CSS Animations & Styles ────────────────────────────────────────────── */
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@700;900&family=Fredoka+One&display=swap');
  .pgf-fredoka { font-family: 'Fredoka One', cursive !important; }
  .pgf-nunito  { font-family: 'Nunito', sans-serif !important; }

  @keyframes pgfSpringIn {
    0% { transform: scale(0.3) translateY(-120px) rotate(-12deg); opacity: 0; filter: blur(8px); }
    60% { transform: scale(1.15) translateY(12px) rotate(3deg); }
    85% { transform: scale(0.96) translateY(-4px) rotate(-1deg); }
    100% { transform: scale(1) translateY(0) rotate(0deg); opacity: 1; filter: none; }
  }
  @keyframes pgfZoom     { 0%{transform:scale(.05) rotate(-10deg);opacity:0} 60%{transform:scale(1.1) rotate(2deg);opacity:1} 100%{transform:scale(1) rotate(0);opacity:1} }
  @keyframes pgfSlideUp  { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:none} }
  @keyframes pgfBounce   { 0%,100%{transform:scale(1)} 50%{transform:scale(1.05)} }
  @keyframes pgfFloat    { 0%,100%{transform:translateY(0) rotate(-2deg)} 50%{transform:translateY(-8px) rotate(2deg)} }
  @keyframes pgfWiggle   { 0%,100%{transform:rotate(0)} 25%{transform:rotate(-6deg)} 75%{transform:rotate(6deg)} }
  @keyframes pgfPulse    { 0%,100%{opacity:.35;transform:scale(.95)} 50%{opacity:1;transform:scale(1.05)} }
  @keyframes pgfCardIn   { from{opacity:0;transform:translateY(12px) scale(.96)} to{opacity:1;transform:none} }
  @keyframes pgfJump     { 0%,100%{transform:translateY(0) scale(1)} 50%{transform:translateY(-12px) scale(1.06)} }
  @keyframes pgfSpin      { to { transform: rotate(360deg); } }

  @keyframes pgfMagicFall {
    0% {
      transform: translateY(-40px) rotate(0deg) scale(0.85);
      opacity: 0;
    }
    15% {
      opacity: 0.9;
    }
    85% {
      opacity: 0.9;
    }
    100% {
      transform: translateY(105vh) rotate(360deg) scale(0.85);
      opacity: 0;
    }
  }

  .pgf-btn { transition:all .2s cubic-bezier(.175,.885,.32,1.275); }
  .pgf-btn:hover { transform:scale(1.04); }
  .pgf-btn:active { transform:scale(.96); }
`;

/* ─── AnimatedNumber ──────────────────────────────────────────────── */
const AnimatedNumber: React.FC<{ value:number; suffix?:string; prefix?:string; duration?:number }> = ({
  value, suffix='', prefix='', duration=1100
}) => {
  const [cur, setCur] = useState(0);
  useEffect(() => {
    if (!value) return;
    let start: number|null = null;
    let raf: number;
    const tick = (now: number) => {
      if (!start) start = now;
      const p = Math.min((now-start)/duration, 1);
      setCur(Math.floor(p*(2-p)*value));
      if (p < 1) raf = requestAnimationFrame(tick);
      else setCur(value);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, duration]);
  return <span>{prefix}{cur}{suffix}</span>;
};

/* ─── Interfaces ──────────────────────────────────────────────────── */
export interface GameResult {
  gameId?: string;
  gameTitle: string;
  gameIcon: string;
  themeColor: string;
  score: number;
  maxScore: number;
  accuracy?: number;
  streak?: number;
  duration: number;
  completionPct: number;
  xpEarned: number;
  legacyEarned: number;
  xpCategory: string;
  hits?: number;
  misses?: number;
}

interface PostGameProps {
  result: GameResult;
  townBenefit: string;
  lore?: string;
  funFactTitle?: string;
  funFactText?: string;
  onPlayAgain: () => void;
  onDone: () => void;
}

const TIER_DATA = {
  perfect: {
    headline: "🎉 FLAWLESS VICTORY!",
    color: "#f59e0b",
    praise: "Outstanding! You performed with 100% precision. The healers guild is in absolute awe of your capabilities!",
    companion: [
      "I have never witnessed such clinical execution! You sorted every leaf with healer mastery.",
      "The potion cauldrons are perfectly balanced. Dr. Cedric is writing a praise letter to the Gazette!",
      "A flawless shift! The patients are sitting up and smiling already. Truly remarkable!"
    ]
  },
  great: {
    headline: "⭐ GREAT RESOLVE!",
    color: "#34d399",
    praise: "Tremendous job! You successfully cured the major outbreaks with high accuracy and neat coordination.",
    companion: [
      "Splendid sorting! The clinic runs smoothly with your sharp eye on duty.",
      "Most herbs hit their target cauldrons. The recovery rate in Oakenhart is spiking!",
      "A very successful shift! Pipkin says his stomach aches are completely resolved."
    ]
  },
  okay: {
    headline: "👍 PASSABLE SHIFT",
    color: "#60a5fa",
    praise: "Well done. You resolved the core symptoms, though there is minor room for diagnostic improvement.",
    companion: [
      "A decent shift! Be careful not to mix Velvet Peppermint with Bitter Feverbark next run.",
      "The cauldrons are simmering. Keep studying the botanical guide to speed up your sorting.",
      "Good recovery. Let's aim for higher accuracy in our next dispensary rotation!"
    ]
  },
  poor: {
    headline: "🩹 RECOVERY NEEDED",
    color: "#f87171",
    praise: "The batch has ended. Several medical mismatch mistakes occurred, costing lives. Let's study and retry!",
    companion: [
      "A tough shift. The villagers are resting, but we need cleaner sorting next time.",
      "Keep practicing! Read the properties of each leaf carefully before dropping them.",
      "Our diagnostic accuracy must improve. Let's review the workbench specs together!"
    ]
  }
};

const COMPANIONS = [
  { name: 'Dr. Cedric', role: 'Chief Healer', emoji: '🩺', cat: 'healer' },
  { name: 'Rowan', role: 'Chief Carpenter', emoji: '🔨', cat: 'builder' },
  { name: 'Pipkin', role: 'Grove Scout', emoji: '🐿️', cat: 'explorer' }
];

const FUN_FACTS: Record<string, string[]> = {
  healer: [
    "Feverfew tea has been used since ancient times. Healers boil it with wild honey to reduce high temperatures.",
    "Linalool vapors released by fresh lavender trigger brain relaxants to reduce stressful overthinking.",
    "Ginger Snap Root contains gingerol compounds that promote stomach enzyme production, easing digestion."
  ],
  builder: [
    "Old pine wood expands slightly when wet, creating watertight seams along canal caravan boats.",
    "Mortise joints distribute stress across building timbers, keeping canopy bridges safe during storms."
  ],
  explorer: [
    "Exploring Ganache Grove at night reveals glowing moonspores that guide travelers safely back to the high road.",
    "Barge cargo canals utilize mechanical waterlocks to raise fully loaded timber rafts up the high hill slope."
  ]
};

/* ─── Consolidated PostGameScreen Component ───────────────────────── */
export const PostGameScreen: React.FC<PostGameProps> = ({
  result,
  townBenefit,
  lore,
  funFactTitle,
  funFactText,
  onPlayAgain,
  onDone,
}) => {
  const { setPage } = useTTStore();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submittedFeedback, setSubmittedFeedback] = useState(false);
  const [magicParticles, setMagicParticles] = useState<any[]>([]);
  const [showSpecsModal, setShowSpecsModal] = useState(false);
  const [trivia, setTrivia] = useState('');

  // Initialize magic celebration particles (Disabled falling particles for a clean layout)
  useEffect(() => {
    setMagicParticles([]);

    // Pick a random fun fact
    const catKey = result.xpCategory.toLowerCase();
    const facts = FUN_FACTS[catKey] || FUN_FACTS.healer;
    setTrivia(facts[Math.floor(Math.random() * facts.length)]);
  }, [result.xpCategory]);

  // Pick Tier
  const tier = result.completionPct >= 95 ? TIER_DATA.perfect
             : result.completionPct >= 70 ? TIER_DATA.great
             : result.completionPct >= 45 ? TIER_DATA.okay
             : TIER_DATA.poor;

  // Pick Companion
  const cat = result.xpCategory.toLowerCase();
  const comp = COMPANIONS.find(c => c.cat === cat) ?? COMPANIONS[2];
  const compLine = tier.companion[Math.floor(Math.random() * tier.companion.length)];

  // Badges Earned
  const badges: { emoji: string; title: string; desc: string; color: string }[] = [];
  if (result.completionPct >= 95) badges.push({ emoji: '🏆', title: 'FLAWLESS', desc: '100% completion!', color: '#fbbf24' });
  if ((result.accuracy ?? 0) >= 90) badges.push({ emoji: '🎯', title: 'SHARP EYE', desc: 'High accuracy!', color: '#34d399' });
  if ((result.streak ?? 0) >= 4) badges.push({ emoji: '🔥', title: 'COMBO', desc: '4x streak!', color: '#f97316' });
  if (result.duration <= 60) badges.push({ emoji: '⚡', title: 'SPEEDY', desc: 'Fast resolve!', color: '#facc15' });
  if (badges.length === 0) badges.push({ emoji: '🏡', title: 'CITIZEN', desc: 'Grove contributor', color: '#60a5fa' });

  const isHerbGame = result.gameId === 'herb' || result.gameTitle.includes('Herb');

  // Define flying box statement based on performance tier
  const statement = result.completionPct >= 95
    ? { text: "🏆 FLAWLESS SHIFT! AWESOME!", color: "#fbbf24", bg: "rgba(251,191,36,0.12)", border: "rgba(251,191,36,0.5)" }
    : result.completionPct >= 70
    ? { text: "🌟 WELL DONE! SPLENDID HEALING!", color: "#34d399", bg: "rgba(52,211,153,0.12)", border: "rgba(52,211,153,0.5)" }
    : result.completionPct >= 45
    ? { text: "👍 PASSABLE SHIFT! GOOD EFFORT!", color: "#60a5fa", bg: "rgba(96,165,250,0.12)", border: "rgba(96,165,250,0.5)" }
    : { text: "🩹 DON'T WORRY! RETRY & EXCEL!", color: "#f87171", bg: "rgba(248,113,113,0.12)", border: "rgba(248,113,113,0.5)" };

  const handleSubmitFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) return;
    setSubmittedFeedback(true);
    cozyAudio.playSuccess?.();
  };

  return (
    <div className="w-full h-full flex flex-col overflow-hidden relative select-none text-white"
      style={{
        background: 'rgba(0,0,0,0.75)',
        backdropFilter: 'blur(14px)',
      }}
    >
      <style>{CSS}</style>



      {/* ══════════ HEADER ══════════ */}
      <div className="shrink-0 flex items-center justify-between px-5 pt-3 pb-2 border-b border-white/10 relative z-10">
        <div className="text-left">
          <span className="inline-block px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[9px] font-sans font-black uppercase tracking-wider animate-pulse">
            ✓ DUTY COMPLETE!
          </span>
          <h2 className="font-sans font-bold text-lg text-white mt-0.5 uppercase tracking-wide flex items-center gap-2">
            <span style={{ animation: 'pgfWiggle 3s ease-in-out infinite', display: 'inline-block' }}>{result.gameIcon}</span>
            <span style={{ textShadow: `0 0 12px ${result.themeColor}50` }}>{result.gameTitle}</span>
          </h2>
          <p className="font-sans text-[11px] text-white/50 leading-none mt-0.5">
            Excellent progress, <span className="text-emerald-400 font-black">Apprentice Healer!</span> The town honors your dedication.
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={onPlayAgain}
            className="pgf-btn px-4 py-2 rounded-xl font-sans text-white text-[11px] uppercase tracking-wider cursor-pointer font-bold border"
            style={{ background:'linear-gradient(135deg,#3b0a0a,#7f1d1d)', borderColor:'rgba(239,68,68,0.4)', boxShadow:'0 0 12px rgba(239,68,68,0.2)' }}
          >Replay Duty</button>
          <button onClick={onDone}
            className="pgf-btn px-5 py-2 rounded-xl font-sans text-black text-[11px] uppercase tracking-wider cursor-pointer font-black"
            style={{ background:'linear-gradient(135deg,#fbbf24,#f59e0b)', boxShadow:'0 0 16px rgba(251,191,36,0.4)' }}
          >Exit &amp; Return</button>
        </div>
      </div>

      {/* ══════════ 3-COLUMN BODY ══════════ */}
      <div className="grid grid-cols-3 gap-3 flex-grow min-h-0 px-4 py-2 relative z-10 overflow-hidden">

        {/* ── COL 1: Healer Praise & Chronicles (14px Text) ── */}
        <div className="flex flex-col gap-2.5 min-h-0 overflow-y-auto custom-scrollbar pr-1">

          {/* Level Evaluation Box */}
          <div className="rounded-2xl bg-white/5 border border-white/10 px-4 py-3 flex flex-col gap-1.5">
            <span className="font-sans text-[9px] font-black uppercase tracking-widest text-emerald-400">🏆 Level Evaluation</span>
            <div className="flex items-start gap-3">
              <span className="text-3.5xl shrink-0" style={{ animation:'pgfBounce 3s ease-in-out infinite' }}>🎉</span>
              <div>
                <h3 className="font-sans font-bold text-base uppercase leading-tight tracking-wider" style={{ color:tier.color, textShadow:`0 0 10px ${tier.color}40` }}>
                  {tier.headline}
                </h3>
                <p className="font-sans text-[14px] text-white/90 leading-relaxed mt-1">{tier.praise}</p>
              </div>
            </div>
          </div>

          {/* Companion Speech Box */}
          <div className="rounded-2xl bg-white/5 border border-white/10 px-4 py-3 flex flex-col gap-1.5">
            <span className="font-sans text-[9px] font-black uppercase tracking-widest text-amber-400">💬 Healers Feedback</span>
            <div className="flex items-start gap-3">
              <span className="text-3xl shrink-0" style={{ animation:'pgfWiggle 3s ease-in-out infinite' }}>{comp.emoji}</span>
              <div className="flex-1 min-w-0">
                <span className="font-sans text-[9.5px] font-black uppercase tracking-widest block text-amber-400/80">{comp.name} · {comp.role}</span>
                <p className="font-sans text-[14px] text-white/90 leading-relaxed italic mt-1">"{compLine}"</p>
              </div>
            </div>
          </div>

          {/* Chronicles Trivia Box */}
          <div className="rounded-2xl bg-indigo-500/8 border border-indigo-500/18 px-4 py-3 flex flex-col gap-1.5 flex-grow">
            <span className="font-sans text-[9px] font-black uppercase tracking-widest text-indigo-300">📖 Town Chronicles</span>
            <div className="flex items-start gap-3">
              <span className="text-3xl shrink-0" style={{ animation:'pgfFloat 4s ease-in-out infinite' }}>💡</span>
              <div className="flex-1">
                <span className="font-sans text-[10px] text-indigo-400 font-bold block mb-0.5">Apothecary Lore</span>
                <p className="font-sans text-[14px] text-indigo-100/90 leading-relaxed italic">"{trivia}"</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── COL 2: Performance Stats & Feedback ── */}
        <div className="flex flex-col gap-2.5 min-h-0 overflow-y-auto custom-scrollbar pr-1 justify-between">
          
          <div className="space-y-2.5">
            {/* Subtle Motivational Header Box */}
            <div className="rounded-2xl border-2 px-4 py-2 text-center shrink-0 relative overflow-hidden"
              style={{
                background: statement.bg,
                borderColor: statement.border,
                boxShadow: `0 0 12px ${statement.color}15, inset 0 1px 0 rgba(255,255,255,0.05)`,
                animation: 'pgfBounce 4s ease-in-out infinite',
              }}
            >
              <span className="hdg-luckiest text-[17px] uppercase tracking-wider block"
                style={{
                  color: statement.color,
                  textShadow: `0 0 8px ${statement.color}50`,
                }}
              >
                {statement.text}
              </span>
            </div>

            {/* Performance Stats */}
            <div className="rounded-2xl bg-white/5 border border-white/10 px-4 py-3">
              <span className="font-sans text-[9px] uppercase tracking-wider text-white/40 font-black block mb-2">📊 Shift Performance Stats</span>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label:'Score',      value: result.score,                       num: result.score,          suffix:'',  color:'#fca5a5' },
                  { label:'Completion', value:`${result.completionPct}%`,           num: result.completionPct,  suffix:'%', color:'#86efac' },
                  { label:'Duration',   value:`${Math.floor(result.duration)}s`,    num: Math.floor(result.duration), suffix:'s', color:'#93c5fd' },
                ].map((s,i) => (
                  <div key={i} className="rounded-xl bg-black/30 border border-white/8 p-2 text-center">
                    <span className="font-sans text-[8px] font-black uppercase tracking-wider text-white/35 block">{s.label}</span>
                    <span className="block mt-1 leading-none font-black text-[1.6rem]" style={{ color:s.color, fontFamily:"'Luckiest Guy',cursive" }}>
                      <AnimatedNumber value={s.num} suffix={s.suffix} />
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* XP & Reputation Cards */}
            <div className="grid grid-cols-2 gap-2.5">
              <div className="rounded-2xl bg-gradient-to-br from-emerald-950/60 to-teal-950/60 border border-emerald-500/25 p-3 flex flex-col items-center justify-center text-center gap-1">
                <span className="text-2xl" style={{ animation:'pgfBounce 2.5s ease-in-out infinite' }}>🌿</span>
                <span className="font-sans text-[8px] text-white/40 tracking-widest font-black uppercase">XP Earned</span>
                <span className="font-black text-emerald-300 text-[1.3rem] leading-none" style={{ fontFamily:"'Luckiest Guy',cursive" }}>+{result.xpEarned}</span>
                <span className="font-sans text-[9px] text-emerald-400">XP</span>
              </div>
              <div className="rounded-2xl bg-gradient-to-br from-purple-950/60 to-indigo-950/60 border border-purple-500/25 p-3 flex flex-col items-center justify-center text-center gap-1">
                <span className="text-2xl" style={{ animation:'pgfBounce 3s ease-in-out infinite', animationDelay:'0.3s' }}>🔮</span>
                <span className="font-sans text-[8px] text-white/40 tracking-widest font-black uppercase">Reputation</span>
                <span className="font-black text-purple-300 text-[1.3rem] leading-none" style={{ fontFamily:"'Luckiest Guy',cursive" }}>+{result.legacyEarned}</span>
                <span className="font-sans text-[9px] text-purple-400">Legacy pts</span>
              </div>
            </div>
          </div>

          {/* Golden Framed Feedback Form */}
          <div className="rounded-2xl border-2 px-4 py-2.5 shrink-0"
            style={{
              background: 'rgba(251, 191, 36, 0.05)',
              borderColor: 'rgba(251, 191, 36, 0.55)',
              boxShadow: '0 0 16px rgba(251,191,36,0.15)',
            }}
          >
            {submittedFeedback ? (
              <div className="flex flex-col items-center justify-center text-center py-2 animate-fade-in">
                <span className="text-2.5xl animate-bounce">💖</span>
                <p className="font-sans text-amber-300 text-[13px] font-black mt-1">Review Submitted!</p>
                <p className="font-sans text-white/80 text-[11.5px]">Your rating has been saved. Thank you!</p>
              </div>
            ) : (
              <form onSubmit={handleSubmitFeedback} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-sans text-[10px] text-amber-300 font-black uppercase tracking-wider">Leave a Rating:</span>
                  <div className="flex gap-1">
                    {[1,2,3,4,5].map(star => (
                      <button type="button" key={star}
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="text-2xl transition-transform hover:scale-125 focus:outline-none cursor-pointer"
                        style={{ color: (hoverRating || rating) >= star ? '#fbbf24' : 'rgba(255,255,255,0.15)' }}
                      >★</button>
                    ))}
                  </div>
                </div>
                <textarea
                  value={comment}
                  onChange={e=>setComment(e.target.value)}
                  placeholder="Tell us what you liked about this shift..."
                  className="w-full h-10 bg-black/60 border border-white/15 rounded-xl px-2.5 py-1 text-[11.5px] text-white placeholder-white/30 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 resize-none font-sans"
                  style={{ color: '#ffffff' }}
                />
                <button type="submit" disabled={rating===0}
                  className="w-full py-1.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 disabled:opacity-40 disabled:cursor-not-allowed text-black font-sans font-black text-[11px] uppercase tracking-wider transition cursor-pointer shadow-md border border-amber-500"
                >Submit Review</button>
              </form>
            )}
          </div>
        </div>

        {/* ── COL 3: Badges, Impact & Navigation ── */}
        <div className="flex flex-col gap-3 min-h-0 overflow-y-auto custom-scrollbar pr-1 justify-between">
          
          <div className="space-y-3">
            {/* Badges Earned list with detailed cards */}
            <div className="rounded-2xl bg-white/5 border border-white/10 px-4 py-3">
              <span className="font-sans text-[9px] font-black uppercase tracking-wider text-amber-400 block mb-2.5">🏅 Earned Badges</span>
              <div className="space-y-2 max-h-[160px] overflow-y-auto custom-scrollbar pr-1">
                {badges.map((b,i) => (
                  <div key={i} className="flex items-center gap-3 p-2.5 rounded-xl bg-black/20 border border-white/5 shadow-sm">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center text-xl shadow"
                      style={{ background:`rgba(0,0,0,0.35)`, border:`1px solid ${b.color}35`, boxShadow:`0 0 10px ${b.color}20` }}
                    >{b.emoji}</div>
                    <div className="flex-1 text-left min-w-0">
                      <h4 className="font-sans font-black text-[11px] uppercase leading-tight" style={{ color: b.color }}>{b.title}</h4>
                      <p className="font-sans text-[10.5px] text-white/60 leading-none mt-0.5 truncate">{b.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Town Impact */}
            <div className="rounded-2xl bg-white/5 border border-white/10 px-4 py-3">
              <span className="font-sans text-[9px] font-black uppercase tracking-wider text-indigo-300 block mb-1">🏡 Town Impact</span>
              <p className="font-sans text-[13px] text-white/95 leading-relaxed font-medium">{townBenefit}</p>
            </div>

            {/* Shift Details */}
            <div className="rounded-2xl bg-white/5 border border-white/10 px-4 py-3">
              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-xl bg-black/25 border border-white/8 p-2 text-center">
                  <span className="font-sans text-[8px] text-white/40 uppercase tracking-wider font-black block">Profession</span>
                  <span className="font-sans text-[10px] text-amber-300 font-black block mt-0.5 uppercase">{result.xpCategory}</span>
                </div>
                <div className="rounded-xl bg-black/25 border border-white/8 p-2 text-center">
                  <span className="font-sans text-[8px] text-white/40 uppercase tracking-wider font-black block">Max Score</span>
                  <span className="font-black text-white/70 text-[12px] block mt-0.5" style={{ fontFamily:"'Luckiest Guy',cursive" }}>{result.maxScore}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Action Navigation Buttons */}
          <div className="grid grid-cols-2 gap-2.5 mt-2 shrink-0">
            <button onClick={() => setPage('badges')}
              className="py-2.5 rounded-xl border border-amber-400/40 hover:border-amber-400 bg-amber-400/10 hover:bg-amber-400/20 text-amber-300 font-sans font-black text-[10.5px] uppercase tracking-wider transition cursor-pointer text-center"
            >
              🏅 Badges Room
            </button>
            <button onClick={() => setPage('leaderboard')}
              className="py-2.5 rounded-xl border border-indigo-400/40 hover:border-indigo-400 bg-indigo-400/10 hover:bg-indigo-400/20 text-indigo-300 font-sans font-black text-[10.5px] uppercase tracking-wider transition cursor-pointer text-center"
            >
              🏆 Leaders Hall
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
// Done
