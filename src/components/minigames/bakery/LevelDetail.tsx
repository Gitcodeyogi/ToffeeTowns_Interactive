// LevelDetail.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Beautiful pre-game instruction screen for each level.
// Shown AFTER choosing a level but BEFORE the game starts.
// Contains story, how-to steps, rules, and "Let's Bake!" CTA.
// ─────────────────────────────────────────────────────────────────────────────
import React, { useState } from 'react';
import { FONT } from '../../../lib/uiConstants';
import { BakeryMode } from './bakeryTypes';

interface LevelDetailProps {
  mode: 'apprenticeship' | 'shift' | 'after-hours';
  onStart: () => void;
  onBack: () => void;
}

// ── Level configs ─────────────────────────────────────────────────────────────
const LEVEL_CONFIG = {
  apprenticeship: {
    badge: '0',
    emoji: '🎓',
    name: 'Bakery Apprenticeship',
    tagline: 'Learn the craft. Earn your apron.',
    accentFrom: '#0891b2',
    accentTo: '#06b6d4',
    borderColor: 'rgba(6,182,212,0.35)',
    bgColor: 'rgba(8,25,40,0.95)',
    glowColor: 'rgba(6,182,212,0.12)',
    ovenDisplay: '1 oven active · 3 locked',
    ovenBadge: '1 oven',
    ovenIcon: '🟢🔒🔒🔒',
    story: [
      'Every legendary baker in Ganache Grove started right here — in this kitchen, with one oven, one recipe, and a patient teacher.',
      'Chef Caramel will guide you through every step. There is no timer pressure. No customer waiting. Just you, the oven, and the smell of something warm and golden.',
      'Complete this training and you will earn the Junior Baker badge — the key to the real bakery shift.',
    ],
    steps: [
      { icon: '🌾', title: 'Tour the Bakery', desc: 'Chef Caramel will point out the five essential stations you must know. Click each one when highlighted.' },
      { icon: '🔥', title: 'Load the Oven', desc: 'Click the oven door to place the prepared dough inside. Watch it preheat to the right temperature.' },
      { icon: '🌡️', title: 'Manage Temperature', desc: 'Use the +5°, +10°, −5°, −10° buttons to keep the temperature near the target. It drifts on its own!' },
      { icon: '🟡', title: 'Watch for the Golden Zone', desc: 'The progress bar fills as the dough bakes. When it glows amber (72–90%), the PULL button activates.' },
      { icon: '🧤', title: 'Pull at the Right Moment', desc: 'Click PULL OUT exactly when the bar is golden for the best quality rating.' },
      { icon: '🔔', title: 'Handle One Incident', desc: 'A kitchen event will interrupt you. Read it carefully and choose the right response.' },
    ],
    earn: [
      '🏅 Junior Baker Badge — unlocks the daily Bakery Shift',
      '📚 Full understanding of every oven mechanic',
      '🎓 Graduation ceremony with Chef Caramel',
    ],
    rules: [
      { bad: false, text: 'No time limit — take as long as you need.' },
      { bad: false, text: 'No coins required to start. It\'s always free.' },
      { bad: true,  text: 'If you fail 3 times in a row, the session ends. A retry costs 10 🪙.' },
      { bad: true,  text: 'Let the oven burn and Chef Caramel will lose patience.' },
    ],
    ctaLabel: '🎓 Begin Apprenticeship',
    ctaStyle: { background: 'linear-gradient(135deg, #0891b2, #06b6d4)', boxShadow: '0 0 30px rgba(6,182,212,0.4)' },
  },
  shift: {
    badge: '1',
    emoji: '🧤',
    name: 'Bakery Shift',
    tagline: 'Feed the town. Earn your coins.',
    accentFrom: '#d97706',
    accentTo: '#fbbf24',
    borderColor: 'rgba(251,191,36,0.35)',
    bgColor: 'rgba(14,10,0,0.95)',
    glowColor: 'rgba(251,191,36,0.1)',
    ovenDisplay: '3 ovens active · 1 locked',
    ovenBadge: '3 ovens',
    ovenIcon: '🟢🟢🟢🔒',
    story: [
      'The town wakes early. The Traveller\'s Inn needs pastries by sunrise. Oakenhart Clinic is out of desserts. And the Festival Committee — they never stop ordering.',
      'Three ovens, three customers, and 5 minutes on the clock. Fill the orders, manage the temperature drifts, handle whatever the kitchen throws at you.',
      'Pull perfect batches, build a streak, and earn Cocoa Coins, XP and Legacy for the town.',
    ],
    steps: [
      { icon: '📦', title: 'Know Your Orders', desc: 'Three customers need specific categories — pastries, desserts, and loaves. Check the right panel.' },
      { icon: '🌡️', title: 'Manage Three Ovens', desc: 'Each oven runs a different recipe. Temperatures drift independently. Stay sharp across all three!' },
      { icon: '⏱️', title: '5-Minute Shift', desc: 'You have exactly 5 minutes. Fill all orders before the clock runs out to win the full reward.' },
      { icon: '🟡', title: 'Hit the Golden Zone', desc: 'Each recipe has its own golden window (72–90% progress). Pull perfectly for bonus coins.' },
      { icon: '🔥', title: 'Avoid Burns', desc: '4 burns = shift over. Each burn costs −3 bonus coins. Keep the temp stable!' },
      { icon: '🔔', title: 'React to Events', desc: 'Kitchen incidents appear mid-shift. Choose wisely — they affect customer patience and coin bonuses.' },
    ],
    earn: [
      '🪙 Cocoa Coins — base reward + quality bonuses',
      '✦ Healer XP — proportional to orders filled',
      '◈ Legacy Points — for each happy customer',
      '🔥 Streak bonuses — x2 multiplier at 3+ perfects',
    ],
    rules: [
      { bad: true,  text: 'Failing (4 burns or time out without orders) deducts 10 🪙 from your wallet.' },
      { bad: true,  text: 'Leaving early costs 20 🪙 union exit penalty.' },
      { bad: false, text: 'Completing all 3 orders before time = full reward, regardless of how much time remains.' },
      { bad: false, text: 'Quality bonus: each 5-star bake adds +5 coins to the shift total.' },
    ],
    ctaLabel: '🧤 Start the Shift — Let\'s Bake!',
    ctaStyle: { background: 'linear-gradient(135deg, #d97706, #fbbf24)', boxShadow: '0 0 30px rgba(251,191,36,0.4)', color: '#000' },
  },
  'after-hours': {
    badge: '2',
    emoji: '🌙',
    name: 'After-Hours Bakery',
    tagline: 'Bake for love. Score for glory.',
    accentFrom: '#7c3aed',
    accentTo: '#a855f7',
    borderColor: 'rgba(168,85,247,0.35)',
    bgColor: 'rgba(8,3,18,0.95)',
    glowColor: 'rgba(168,85,247,0.12)',
    ovenDisplay: 'All 4 ovens active',
    ovenBadge: '4 ovens',
    ovenIcon: '🟢🟢🟢🟢',
    story: [
      'The town is asleep. The last customer left an hour ago. But Chef Caramel has left a spare key on the hook by the door — and the ovens are still warm.',
      'This is not about money. Not about orders. Tonight is about how good you really are. Four ovens, daily modifiers, a Chaos Mode finale, and your personal best to beat.',
      'The bakery is yours for 15 minutes. What will you make of it?',
    ],
    steps: [
      { icon: '🌟', title: 'Tonight\'s Challenge', desc: 'Two random daily modifiers (seeded from today\'s date) change the rules. Everyone faces the same challenge.' },
      { icon: '🍳', title: 'All 4 Ovens Running', desc: 'Manage all four simultaneously. Each starts with a random recipe from the full menu.' },
      { icon: '🏆', title: 'Score-Based Only', desc: 'No coins, XP or Legacy. Just points. Perfect bake = 100pts. Golden order = 5× multiplier.' },
      { icon: '🔥', title: 'Combo & Sugar Rush', desc: 'Chain perfect bakes to build a combo. Fill the Sugar Rush meter for 1.5× speed boost.' },
      { icon: '⛈️', title: 'Chaos Mode (last 60s)', desc: 'Temperature drifts faster. Baking speeds up. Everything intensifies for the final minute.' },
      { icon: '🛒', title: 'Bakery Shelf Hints', desc: 'Spend Cocoa Coins mid-game for power-ups: Freeze Oven, Auto Stir, Lucky Clover, and more.' },
    ],
    earn: [
      '🏆 Personal best score — tracked lifetime',
      '🎖️ Cosmetic unlocks at 500, 1000, 2000, 3500 pts',
      '🏅 Achievements for perfects, combos and golden orders',
      '🍬 No economy impact — pure fun, zero risk',
    ],
    rules: [
      { bad: true,  text: '50 🪙 entry fee deducted when you enter. No refund if you quit.' },
      { bad: false, text: 'No "failure" in After-Hours — the session always ends on time.' },
      { bad: false, text: 'Burns deduct 50 points from your score but don\'t end the game.' },
      { bad: false, text: 'Play again at any time (costs another 50 🪙 entry).' },
    ],
    ctaLabel: '🌙 Rent the Ovens — 50 🪙 — Let\'s Bake!',
    ctaStyle: { background: 'linear-gradient(135deg, #7c3aed, #a855f7)', boxShadow: '0 0 30px rgba(168,85,247,0.4)' },
  },
};

function StepCard({ step, index }: { step: { icon: string; title: string; desc: string }; index: number }) {
  return (
    <div className="flex gap-4 p-4 rounded-2xl border border-white/8 bg-white/3 hover:border-white/15 hover:bg-white/5 transition-all duration-300">
      <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-xl border border-white/10 bg-white/6">
        {step.icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="text-[10px] font-black uppercase tracking-widest text-white/25">STEP {index + 1}</span>
        </div>
        <p className="text-[14px] font-black text-white leading-tight">{step.title}</p>
        <p className="text-[12px] text-white/55 leading-relaxed mt-0.5" style={{ fontFamily: 'Georgia,serif' }}>{step.desc}</p>
      </div>
    </div>
  );
}

export const LevelDetail: React.FC<LevelDetailProps> = ({ mode, onStart, onBack }) => {
  const [tab, setTab] = useState<'how' | 'rules'>('how');
  const cfg = LEVEL_CONFIG[mode];
  const coins = parseInt(localStorage.getItem('toffeetowns-coins') || '100');

  const canAfford = mode !== 'after-hours' || coins >= 50;

  return (
    <div className="w-full h-full flex overflow-hidden relative">
      {/* Accent top strip */}
      <div className="absolute top-0 left-0 right-0 h-0.5 rounded-t-[2.5rem]"
        style={{ background: `linear-gradient(90deg, ${cfg.accentFrom}, ${cfg.accentTo}, ${cfg.accentFrom})` }} />

      {/* ── Left column (Story & Details) ── */}
      <div className="w-[350px] shrink-0 flex flex-col border-r border-white/8 overflow-hidden relative">
        
        {/* Level badge header */}
        <div className="p-6 border-b border-white/8">
          <button onClick={onBack}
            className="flex items-center gap-2 text-white/40 hover:text-white/70 transition text-[12px] font-bold mb-4 cursor-pointer group">
            <span className="group-hover:-translate-x-0.5 transition-transform">←</span> Back to Levels
          </button>

          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center font-black text-3xl text-black shrink-0"
              style={{ background: `linear-gradient(135deg, ${cfg.accentFrom}, ${cfg.accentTo})` }}>
              {cfg.badge}
            </div>
            <div>
              <p className="text-[9px] uppercase tracking-[0.3em] text-white/30 font-black">Level {cfg.badge}</p>
              <p className="text-2xl font-black text-white leading-tight" style={{ fontFamily: FONT }}>{cfg.emoji} {cfg.name}</p>
            </div>
          </div>

          <p className="text-[13px] italic text-white/60 leading-snug" style={{ fontFamily: 'Georgia,serif' }}>
            "{cfg.tagline}"
          </p>
        </div>

        {/* Story */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
          <div>
            <p className="text-[10px] uppercase tracking-[0.25em] text-white/30 font-black mb-2">The Story</p>
            {cfg.story.map((para: string, i: number) => (
              <p key={i} className="text-[13px] text-white/65 leading-relaxed mb-3 italic" style={{ fontFamily: 'Georgia,serif' }}>
                {para}
              </p>
            ))}
          </div>

          {/* Oven display */}
          <div className="p-3 bg-white/4 border border-white/8 rounded-2xl text-center">
            <p className="text-2xl tracking-widest mb-1">{cfg.ovenIcon}</p>
            <p className="text-[11px] font-black text-white">{cfg.ovenBadge}</p>
            <p className="text-[10px] text-white/35">{cfg.ovenDisplay}</p>
          </div>

          {/* What you earn */}
          <div>
            <p className="text-[10px] uppercase tracking-[0.25em] text-white/30 font-black mb-2">You\'ll Earn</p>
            {cfg.earn.map((e: string, i: number) => (
              <div key={i} className="flex items-start gap-2 text-[12px] text-white/60 mb-1.5">
                <span className="shrink-0 mt-0.5">{e.split(' ')[0]}</span>
                <span>{e.split(' ').slice(1).join(' ')}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="p-5 border-t border-white/8">
          <button
            onClick={onStart}
            disabled={!canAfford}
            className={`w-full py-4 rounded-2xl font-black text-base uppercase tracking-widest transition-all ${
              canAfford ? 'cursor-pointer hover:scale-[1.02] active:scale-[0.97]' : 'opacity-40 cursor-not-allowed'
            }`}
            style={{ fontFamily: 'Josefin Sans, sans-serif', color: mode === BakeryMode.Shift ? '#000' : '#fff', ...cfg.ctaStyle }}
          >
            {cfg.ctaLabel}
          </button>
          {!canAfford && (
            <p className="text-[11px] text-rose-400 text-center mt-2">Not enough Cocoa Coins</p>
          )}
        </div>
      </div>

      {/* ── Right column (Tabs & Content) ── */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        {/* Tabs */}
        <div className="flex border-b border-white/8 shrink-0">
          {(['how', 'rules'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`flex-1 py-4 text-[12px] font-black uppercase tracking-[0.2em] transition-all cursor-pointer ${
                tab === t
                  ? 'text-white border-b-2'
                  : 'text-white/35 hover:text-white/60 border-b-2 border-transparent'
              }`}
              style={tab === t ? { borderColor: cfg.accentTo } : {}}>
              {t === 'how' ? '📋 How to Play' : '⚠️ Rules & Rewards'}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          {tab === 'how' ? (
            <div className="space-y-2.5">
              <p className="text-[12px] text-white/35 italic mb-4" style={{ fontFamily: 'Georgia,serif' }}>
                Follow these steps to bake like a pro. You can always pause the game to re-read them.
              </p>
              {cfg.steps.map((step: any, i: number) => (
                <StepCard key={i} step={step} index={i} />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {/* Rules */}
              <div>
                <p className="text-[10px] uppercase tracking-[0.25em] text-white/30 font-black mb-3">Important Rules</p>
                <div className="space-y-2">
                  {cfg.rules.map((r: any, i: number) => (
                    <div key={i} className={`flex items-start gap-3 p-3 rounded-xl border ${
                      r.bad
                        ? 'border-rose-500/20 bg-rose-950/15'
                        : 'border-emerald-500/15 bg-emerald-950/10'
                    }`}>
                      <span className="text-base shrink-0 mt-0.5">{r.bad ? '⚠️' : '✅'}</span>
                      <p className="text-[13px] text-white/65 leading-snug" style={{ fontFamily: 'Georgia,serif' }}>{r.text}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tips */}
              <div>
                <p className="text-[10px] uppercase tracking-[0.25em] text-white/30 font-black mb-3">Pro Tips</p>
                <div className="space-y-2">
                  {[
                    ['🎯', 'Watch the golden zone marker on the progress bar. It\'s highlighted in amber.'],
                    ['🌡️', 'Temperature drifts every 8 ticks. Adjust in small steps, don\'t overcorrect.'],
                    ['⏸️', 'Use the Pause button anytime to re-read instructions without losing progress.'],
                    ['🧤', 'Pull slightly early if temperature is off — a "Good" is better than a burn.'],
                  ].map(([icon, tip], i) => (
                    <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-white/3 border border-white/6">
                      <span className="text-lg shrink-0">{icon}</span>
                      <p className="text-[12px] text-white/55 leading-snug" style={{ fontFamily: 'Georgia,serif' }}>{tip}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Oven legend */}
              <div className="p-4 bg-white/3 border border-white/8 rounded-2xl">
                <p className="text-[10px] uppercase tracking-[0.25em] text-white/30 font-black mb-3">Oven Legend</p>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    ['🟡 Golden', 'Pull now — perfect window'],
                    ['🔥 Burnt', 'Missed — wait for reset'],
                    ['♨️ Heating', 'Preheating — stand by'],
                    ['⏳ Baking', 'Monitor temperature'],
                    ['🔒 Locked', 'Not available at this level'],
                    ['✅ Done', 'Cleared — next recipe loads'],
                  ].map(([label, desc]) => (
                    <div key={label} className="text-[11px]">
                      <p className="font-black text-white/70">{label}</p>
                      <p className="text-white/30">{desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
