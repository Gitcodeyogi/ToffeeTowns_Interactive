/**
 * TownEventModal.tsx
 * ─────────────────────────────────────────────────────────────
 * Unified premium pop-up modal for all ToffeeTowns timed events.
 *
 * Layout:  85vw × 85vh
 * Left:    55% — 3:2 image slot (1536×1024 ratio) + category info
 * Right:   45% — scrollable title, guide, narrative & choice buttons
 *
 * Rulebook compliance: bg-black/85 backdrop, rounded-[2.5rem]
 * ─────────────────────────────────────────────────────────────
 */

import React, { useState } from 'react';
import type { TownEvent, EventChoice, EventType } from '../data/events/townEvents';

// ── Per-type visual theme map ─────────────────────────────────
const THEMES: Record<EventType, {
  imageTint:    string;   // CSS colour overlay on image
  accent:       string;   // primary accent hex
  badgeBg:      string;
  badgeColor:   string;
  guideAccent:  string;   // text colour for guide lines
  choiceBorder: string;   // resting border on choice buttons
  choiceHoverBg:string;   // hover bg
  choiceHoverBorder: string;
  ribbonGrad:   string;   // bottom ribbon gradient
}> = {
  flash_news: {
    imageTint:       'rgba(110,60,0,0.35)',
    accent:          '#f59e0b',
    badgeBg:         '#f59e0b',
    badgeColor:      '#000',
    guideAccent:     '#d97706',
    choiceBorder:    'rgba(245,158,11,0.20)',
    choiceHoverBg:   'rgba(245,158,11,0.09)',
    choiceHoverBorder:'rgba(245,158,11,0.50)',
    ribbonGrad:      'from-amber-600 via-orange-500 to-amber-600',
  },
  gossip_drop: {
    imageTint:       'rgba(110,0,130,0.35)',
    accent:          '#e879f9',
    badgeBg:         '#e879f9',
    badgeColor:      '#000',
    guideAccent:     '#c026d3',
    choiceBorder:    'rgba(232,121,249,0.20)',
    choiceHoverBg:   'rgba(232,121,249,0.09)',
    choiceHoverBorder:'rgba(232,121,249,0.55)',
    ribbonGrad:      'from-fuchsia-600 via-pink-500 to-fuchsia-600',
  },
  transport_update: {
    imageTint:       'rgba(0,70,130,0.35)',
    accent:          '#38bdf8',
    badgeBg:         '#38bdf8',
    badgeColor:      '#000',
    guideAccent:     '#0284c7',
    choiceBorder:    'rgba(56,189,248,0.20)',
    choiceHoverBg:   'rgba(56,189,248,0.09)',
    choiceHoverBorder:'rgba(56,189,248,0.55)',
    ribbonGrad:      'from-sky-500 via-cyan-400 to-sky-500',
  },
  politics_brief: {
    imageTint:       'rgba(40,15,110,0.35)',
    accent:          '#818cf8',
    badgeBg:         '#818cf8',
    badgeColor:      '#fff',
    guideAccent:     '#6366f1',
    choiceBorder:    'rgba(129,140,248,0.20)',
    choiceHoverBg:   'rgba(129,140,248,0.09)',
    choiceHoverBorder:'rgba(129,140,248,0.55)',
    ribbonGrad:      'from-indigo-600 via-violet-500 to-indigo-600',
  },
  trade_signal: {
    imageTint:       'rgba(0,90,65,0.35)',
    accent:          '#34d399',
    badgeBg:         '#34d399',
    badgeColor:      '#000',
    guideAccent:     '#059669',
    choiceBorder:    'rgba(52,211,153,0.20)',
    choiceHoverBg:   'rgba(52,211,153,0.09)',
    choiceHoverBorder:'rgba(52,211,153,0.55)',
    ribbonGrad:      'from-emerald-500 via-teal-400 to-emerald-500',
  },
  tax_notice: {
    imageTint:       'rgba(130,45,0,0.35)',
    accent:          '#f97316',
    badgeBg:         '#f97316',
    badgeColor:      '#000',
    guideAccent:     '#c2410c',
    choiceBorder:    'rgba(249,115,22,0.20)',
    choiceHoverBg:   'rgba(249,115,22,0.09)',
    choiceHoverBorder:'rgba(249,115,22,0.55)',
    ribbonGrad:      'from-orange-600 via-red-500 to-orange-600',
  },
  npc_encounter: {
    imageTint:       'rgba(100,55,0,0.35)',
    accent:          '#fb923c',
    badgeBg:         '#fb923c',
    badgeColor:      '#000',
    guideAccent:     '#ea580c',
    choiceBorder:    'rgba(251,146,60,0.20)',
    choiceHoverBg:   'rgba(251,146,60,0.09)',
    choiceHoverBorder:'rgba(251,146,60,0.55)',
    ribbonGrad:      'from-orange-500 via-amber-400 to-orange-500',
  },
};

// ── 3-line guide copy ─────────────────────────────────────────
const GUIDE: Record<EventType, [string, string, string]> = {
  flash_news:       [
    '1. Read the latest broadcast from the Ganache Gazette wire.',
    '2. Review the recommended civic actions listed in this bulletin.',
    '3. Acknowledge to record receipt and continue your activities.',
  ],
  gossip_drop:      [
    '1. Fresh town gossip has reached your ears via the Grove network.',
    '2. Choose your response — your choices affect your standing and coins.',
    '3. Some options earn Cocoa Coins or Legacy; others build character.',
  ],
  transport_update: [
    '1. The Transit Authority has issued a new route or service bulletin.',
    '2. Review travel changes and decide your next transport plan.',
    '3. Active civic participation earns XP, coins, or legacy points.',
  ],
  politics_brief:   [
    '1. The Town Council has issued a political update or active vote.',
    '2. Consider the implications and cast your civic position wisely.',
    '3. Your stance contributes to your Provincial Legacy standing record.',
  ],
  trade_signal:     [
    '1. The Mossberry Market has a trading opportunity requiring action.',
    '2. Act quickly — market conditions change by the next bell.',
    '3. Smart trades earn coins; strategic moves earn legacy reputation.',
  ],
  tax_notice:       [
    '1. Sir Goldwhistle has formally delivered a tax or levy notice.',
    '2. Review the assessed amount and choose your payment path wisely.',
    '3. Full payment earns Legacy; disputes trigger formal proceedings.',
  ],
  npc_encounter:    [
    '1. A Ganache Grove character has arrived with something to say.',
    '2. Choose your response — each option carries different outcomes.',
    '3. Your interactions shape your long-term reputation in the Grove.',
  ],
};

// ── Component ─────────────────────────────────────────────────
interface TownEventModalProps {
  event:    TownEvent;
  onChoice: (choice: EventChoice) => void;
  onClose:  () => void;
  coins:    number;
}

export const TownEventModal: React.FC<TownEventModalProps> = ({
  event,
  onChoice,
  onClose,
  coins,
}) => {
  const T     = THEMES[event.type] ?? THEMES.flash_news;
  const guide = GUIDE[event.type]  ?? GUIDE.flash_news;
  const acc   = T.accent;

  // ── Donation State ──────────────────────────────────────────
  const [selectedChoice, setSelectedChoice] = useState<EventChoice | null>(null);
  const [showDonation, setShowDonation] = useState(false);

  // ── Effect-badge helper ──────────────────────────────────────
  const EffectBadge = ({
    children,
    bg,
    color,
  }: { children: React.ReactNode; bg: string; color: string }) => (
    <span
      className="text-[10px] font-black px-2 py-[3px] rounded-lg whitespace-nowrap"
      style={{ background: bg, color }}
    >
      {children}
    </span>
  );

  return (
    /*
     * ── OUTER SHELL ──────────────────────────────────────────
     * 85 × 85 per rulebook-extension request.
     * Fully standalone: bg-black/85 backdrop handled by parent.
     */
    <div
      className="flex overflow-hidden shadow-[0_40px_140px_rgba(0,0,0,0.8)] animate-fade-in"
      style={{
        width:        '85vw',
        height:       '85vh',
        borderRadius: '2.5rem',
        border:       '1.5px solid rgba(255,255,255,0.15)',
        background:   'rgba(24,24,28,0.85)',
      }}
    >

      {/* ══════════════════════════════════════════════════════
          LEFT PANEL — 55% width
          ══════════════════════════════════════════════════ */}
      <div
        className="relative shrink-0 flex flex-col overflow-hidden"
        style={{
          width:       '55%',
          height:      '100%',
          borderRight: '1px solid rgba(255,255,255,0.07)',
          background:  '#09090b',
        }}
      >
        {/* ── 3:2 Image Slot ───────────────────────────────── */}
        <div
          className="relative w-full shrink-0 overflow-hidden"
          style={{ aspectRatio: '3/2' }}   /* 1536 × 1024 ratio */
        >
          {/* Base image */}
          <img
            src={event.image}
            alt={event.category}
            className="absolute inset-0 w-full h-full"
            style={{ objectFit: 'cover', objectPosition: 'center top' }}
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                '/Assets/Ganache Grove/Scene_0.1.png';
            }}
          />

          {/* Top-left: icon */}
          <div className="absolute top-5 left-5 z-10 bg-black/60 border border-white/10 p-2.5 rounded-2xl shadow-lg flex items-center justify-center">
            <span className="text-4xl select-none leading-none">
              {event.icon}
            </span>
          </div>

          {/* Bottom-left: category label + live badge */}
          <div className="absolute bottom-4 left-5 z-10 bg-black/60 border border-white/10 p-3 rounded-2xl shadow-lg space-y-1 text-left">
            <span
              className="text-[9px] font-black uppercase tracking-[0.22em] text-white block"
              style={{ fontFamily: '"Josefin Sans", sans-serif' }}
            >
              {event.leftLabel}
            </span>
            <span
              className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[9px] font-black uppercase tracking-widest rounded-full animate-pulse select-none"
              style={{ background: T.badgeBg, color: T.badgeColor }}
            >
              {event.badgeText}
            </span>
          </div>
        </div>

        {/* ── Info section below image ────────────────────── */}
        <div
          className="flex-1 flex flex-col justify-between px-6 py-4 min-h-0 overflow-hidden"
          style={{ background: 'rgba(0,0,0,0.4)' }}
        >
          {/* Category name */}
          <p
            className="text-[11px] font-black uppercase tracking-[0.22em] mb-1"
            style={{ color: acc }}
          >
            {event.category}
          </p>

          {/* Accent accent line */}
          <div
            className="h-px mb-3 rounded-full"
            style={{
              background: `linear-gradient(to right, ${acc}70, transparent)`,
            }}
          />

          {/* NPC character chip (NPC encounters only) */}
          {event.npcName && (
            <div
              className="flex items-start gap-3 p-3 rounded-2xl mb-3"
              style={{
                background:  'rgba(255,255,255,0.04)',
                border:      `1px solid ${acc}35`,
              }}
            >
              <div className="text-3xl select-none shrink-0">🧑‍🌾</div>
              <div className="min-w-0">
                <p
                  className="font-black text-white text-sm leading-tight truncate"
                  style={{ fontFamily: '"Josefin Sans", sans-serif' }}
                >
                  {event.npcName}
                </p>
                <p className="text-white/50 text-[10px] mt-0.5 font-sans leading-snug">
                  {event.npcRole}
                </p>
              </div>
            </div>
          )}

          {/* Decorative image-dimensions label */}
          <p
            className="text-[9px] font-mono text-white/20 uppercase tracking-widest mt-auto"
          >
            Image Slot 3:2 · 1536 × 1024
          </p>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════
          RIGHT PANEL — 45% width
          ══════════════════════════════════════════════════ */}
      <div
        className="flex flex-col"
        style={{
          width:      '45%',
          height:     '100%',
          background: 'rgba(0,0,0,0.6)',
        }}
      >
        {/* ── Fixed header ─────────────────────────────────── */}
        <div
          className="shrink-0 px-8 pt-8 pb-5"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
        >
          {/* Category chip */}
          <span
            className="text-[9px] font-black uppercase tracking-[0.28em] block mb-2"
            style={{ color: acc }}
          >
            {event.category}
          </span>

          {/* Big title */}
          <div className="flex items-start justify-between gap-3">
            <h2
              className="text-[1.55rem] font-black text-white uppercase leading-tight tracking-wide flex-1"
              style={{ fontFamily: '"Josefin Sans", sans-serif' }}
            >
              {showDonation ? 'Support Fund' : event.title}
            </h2>

            {/* Close button */}
            <button
              onClick={onClose}
              aria-label="Close"
              className="w-9 h-9 shrink-0 flex items-center justify-center rounded-full border text-white/50 hover:text-white transition-all duration-200 hover:scale-110 active:scale-95 mt-0.5"
              style={{
                background:   'rgba(255,255,255,0.04)',
                borderColor:  'rgba(255,255,255,0.12)',
              }}
            >
              ✕
            </button>
          </div>

          {/* Accent underline */}
          <div
            className="h-[2.5px] mt-3 rounded-full"
            style={{
              width:      '5rem',
              background: `linear-gradient(to right, ${acc}, ${acc}00)`,
            }}
          />
        </div>

        {/* ── Scrollable body ───────────────────────────────── */}
        <div
          className="flex-1 overflow-y-auto px-8 py-6 space-y-5"
          style={{ scrollbarWidth: 'thin', scrollbarColor: `${acc}40 transparent` }}
        >
          {showDonation ? (
            /* ── OPTIONAL DONATION SCREEN FOR POLITICS ── */
            <div className="space-y-6 animate-fade-in text-left">
              <div
                className="p-5 rounded-2xl space-y-3"
                style={{
                  background:  'rgba(129,140,248,0.06)',
                  border:      '1px solid rgba(129,140,248,0.25)',
                }}
              >
                <h3 className="text-base font-bold text-indigo-300 font-sans">
                  🏛️ Support the Community Fund?
                </h3>
                <p className="text-xs text-white/85 leading-relaxed font-sans">
                  Your vote has been recorded. To further support this initiative, you may optionally make a donation to the town's public works fund. 
                  <br /><br />
                  Donations are entirely voluntary and reward you with additional **Town Legacy**.
                </p>
              </div>

              <div className="space-y-3">
                {[
                  { amount: 5, legacy: 2, label: 'Standard Contribution', desc: 'Earns a special brass plaque from the Mayor.' },
                  { amount: 10, legacy: 5, label: 'Silver Patron', desc: 'Name engraved on the town hall contributor board.' },
                  { amount: 20, legacy: 12, label: 'Gold Benefactor', desc: 'A permanent bronze plaque mounted in the square.' },
                ].map((opt) => {
                  const canAffordDonation = coins >= opt.amount;
                  return (
                    <button
                      key={opt.amount}
                      disabled={!canAffordDonation}
                      onClick={() => {
                        if (selectedChoice) {
                          const finalChoice = {
                            ...selectedChoice,
                            coinCost: opt.amount,
                            legacyGain: (selectedChoice.legacyGain || 0) + opt.legacy,
                            result: selectedChoice.result + `\n\n💖 Thank you! You donated ${opt.amount} Cocoa Coins to the community fund. ${opt.desc} (+${opt.legacy} Legacy)`,
                          };
                          onChoice(finalChoice);
                        }
                      }}
                      className="w-full text-left p-4 rounded-2xl border transition-all duration-200"
                      style={{
                        background: canAffordDonation ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.018)',
                        borderColor: canAffordDonation ? 'rgba(129,140,248,0.2)' : 'rgba(255,255,255,0.05)',
                        opacity: canAffordDonation ? 1 : 0.5,
                        cursor: canAffordDonation ? 'pointer' : 'not-allowed',
                      }}
                      onMouseEnter={(e) => {
                        if (!canAffordDonation) return;
                        const el = e.currentTarget as HTMLButtonElement;
                        el.style.background = 'rgba(129,140,248,0.09)';
                        el.style.borderColor = 'rgba(129,140,248,0.55)';
                      }}
                      onMouseLeave={(e) => {
                        if (!canAffordDonation) return;
                        const el = e.currentTarget as HTMLButtonElement;
                        el.style.background = 'rgba(255,255,255,0.04)';
                        el.style.borderColor = 'rgba(129,140,248,0.2)';
                      }}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="text-xs font-bold text-white font-sans">{opt.label}</h4>
                          <p className="text-[10.5px] text-white/50 font-sans mt-0.5">{opt.desc}</p>
                        </div>
                        <div className="flex gap-2 shrink-0">
                          <span className="text-[10px] font-black px-2 py-0.5 rounded-lg bg-orange-500/10 border border-orange-500/20 text-orange-400 font-sans">
                            -{opt.amount} 🪙
                          </span>
                          <span className="text-[10px] font-black px-2 py-0.5 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 font-sans">
                            +{opt.legacy} ⭐
                          </span>
                        </div>
                      </div>
                    </button>
                  );
                })}

                <button
                  onClick={() => {
                    if (selectedChoice) {
                      onChoice(selectedChoice);
                    }
                  }}
                  className="w-full text-center py-3 rounded-2xl border border-white/10 bg-white/5 text-white/80 hover:bg-white/10 text-xs font-bold transition-all duration-200 cursor-pointer font-sans"
                >
                  Skip Donation (Free)
                </button>
              </div>
            </div>
          ) : (
            /* ── NORMAL NARRATIVE & CHOICES SCREEN ── */
            <>
              {/* 3-line guide box */}
              <div
                className="p-4 rounded-2xl space-y-1.5"
                style={{
                  background:  `${acc}0d`,
                  border:      `1px solid ${acc}30`,
                }}
              >
                <p
                  className="text-[9px] font-black uppercase tracking-[0.2em] mb-2"
                  style={{ color: acc, fontFamily: '"Josefin Sans", sans-serif' }}
                >
                  How to Proceed
                </p>
                {guide.map((line, i) => (
                  <p
                    key={i}
                    className="text-[11.5px] leading-relaxed font-sans"
                    style={{ color: T.guideAccent }}
                  >
                    {line}
                  </p>
                ))}
              </div>

              {/* Main narrative text */}
              <div
                className="p-5 rounded-2xl"
                style={{
                  background: 'rgba(255,255,255,0.032)',
                  border:     '1px solid rgba(255,255,255,0.065)',
                }}
              >
                <p className="text-[13px] text-white/88 leading-[1.85] font-sans whitespace-pre-line">
                  {event.mainText}
                </p>
              </div>

              {/* Choices */}
              <div className="space-y-2.5">
                <p
                  className="text-[9px] font-black uppercase tracking-[0.22em] mb-3"
                  style={{ color: acc, fontFamily: '"Josefin Sans", sans-serif' }}
                >
                  Your Response ↓
                </p>

                {event.choices.map((choice) => {
                  const canAfford = !choice.coinCost || coins >= choice.coinCost;

                  return (
                    <button
                      key={choice.id}
                      onClick={() => {
                        if (canAfford) {
                          if (event.type === 'politics_brief') {
                            setSelectedChoice(choice);
                            setShowDonation(true);
                          } else {
                            onChoice(choice);
                          }
                        }
                      }}
                      disabled={!canAfford}
                      className="w-full text-left rounded-2xl transition-all duration-200 select-none"
                      style={{
                        padding:     '0.9rem 1.1rem',
                        background:  canAfford ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.018)',
                        border:      `1.5px solid ${canAfford ? T.choiceBorder : 'rgba(255,255,255,0.05)'}`,
                        cursor:      canAfford ? 'pointer' : 'not-allowed',
                        opacity:     canAfford ? 1 : 0.42,
                      }}
                      onMouseEnter={(e) => {
                        if (!canAfford) return;
                        const el = e.currentTarget as HTMLButtonElement;
                        el.style.background    = T.choiceHoverBg;
                        el.style.borderColor   = T.choiceHoverBorder;
                        el.style.transform     = 'translateY(-1px)';
                        el.style.boxShadow     = `0 6px 24px ${acc}20`;
                      }}
                      onMouseLeave={(e) => {
                        if (!canAfford) return;
                        const el = e.currentTarget as HTMLButtonElement;
                        el.style.background    = 'rgba(255,255,255,0.04)';
                        el.style.borderColor   = T.choiceBorder;
                        el.style.transform     = 'none';
                        el.style.boxShadow     = 'none';
                      }}
                    >
                      {/* Choice row */}
                      <div className="flex items-center gap-3 flex-wrap">
                        {/* Emoji */}
                        <span className="text-xl shrink-0 select-none">
                          {choice.icon}
                        </span>

                        {/* Label */}
                        <div className="flex-1 flex flex-col items-start min-w-0 text-left">
                          <span
                            className="text-[12.5px] font-semibold leading-snug font-sans"
                            style={{ color: canAfford ? 'rgba(255,255,255,0.88)' : 'rgba(255,255,255,0.30)' }}
                          >
                            {choice.label}
                          </span>
                          {choice.subtitle && (
                            <span className="text-[10.5px] text-white/50 font-sans mt-0.5 leading-normal">
                              {choice.subtitle}
                            </span>
                          )}
                        </div>

                        {/* Effect badges */}
                        <div className="flex flex-wrap gap-1 shrink-0">
                          {choice.coinCost && (
                            <EffectBadge
                              bg={canAfford ? 'rgba(249,115,22,0.18)' : 'rgba(220,38,38,0.15)'}
                              color={canAfford ? '#fb923c' : '#f87171'}
                            >
                              -{choice.coinCost} 🪙
                            </EffectBadge>
                          )}
                          {choice.coinGain && (
                            <EffectBadge bg="rgba(52,211,153,0.18)" color="#34d399">
                              +{choice.coinGain} 🪙
                            </EffectBadge>
                          )}
                          {choice.xpGain && (
                            <EffectBadge bg="rgba(56,189,248,0.18)" color="#38bdf8">
                              +{choice.xpGain} XP
                            </EffectBadge>
                          )}
                          {choice.legacyGain && (
                            <EffectBadge bg="rgba(250,204,21,0.18)" color="#facc15">
                              +{choice.legacyGain} ⭐
                            </EffectBadge>
                          )}
                          {!choice.coinCost &&
                           !choice.coinGain &&
                           !choice.xpGain   &&
                           !choice.legacyGain && (
                            <span className="text-[11px] text-white/20 font-mono select-none">→</span>
                          )}
                        </div>
                      </div>

                      {/* Can't-afford note */}
                      {!canAfford && choice.coinCost && (
                        <p className="mt-1 text-[10px] font-sans ml-9 text-red-400">
                          ❌ Not enough Coins — need {choice.coinCost} 🪙
                        </p>
                      )}
                    </button>
                  );
                })}
              </div>
            </>
          )}

          {/* Bottom padding */}
          <div className="h-3" />
        </div>

        {/* ── Glowing footer ribbon (per-type gradient) ──── */}
        <div
          className={`shrink-0 h-[3px] bg-gradient-to-r ${T.ribbonGrad} opacity-70`}
        />
      </div>
    </div>
  );
};

export default TownEventModal;
