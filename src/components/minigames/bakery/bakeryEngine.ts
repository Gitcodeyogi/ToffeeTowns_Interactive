// bakeryEngine.ts
// ─────────────────────────────────────────────────────────────────────────────
// Pure utility functions for the Oven Timing game system.
// No React, no side-effects — just calculations.
// ─────────────────────────────────────────────────────────────────────────────

import type {
  OvenState, ItemQuality, BakeryLifetimeStats, DailyModifier,
} from './bakeryTypes';
import { ALL_DAILY_MODIFIERS } from './bakeryData';

// ── Constants ─────────────────────────────────────────────────────────────────
export const GOLDEN_START          = 72;
export const GOLDEN_END            = 90;
export const PREHEAT_TICKS         = 18;
export const GAME_SECONDS          = 300;   // Level 1: 5-minute shift
export const AFTER_HOURS_SECONDS   = 900;   // Level 2: 15-minute session
export const AFTER_HOURS_CHAOS     = 60;    // last 60s = Chaos Mode
export const DRIFT_EVERY           = 8;
export const EXIT_PENALTY          = 20;
export const SHIFT_FAIL_PENALTY    = 10;    // deducted on shift failure
export const AFTER_HOURS_ENTRY_FEE = 50;
export const APPRENTICE_RETRY_COST = 10;
export const APPRENTICE_MAX_FAILS  = 3;

// Phase thresholds (seconds remaining from 900)
export const AFTER_HOURS_PHASE2_AT = 600;   // 10 min remaining → Phase 2
export const AFTER_HOURS_PHASE3_AT = 300;   // 5 min remaining → Phase 3
export const AFTER_HOURS_PHASE4_AT = 60;    // 1 min remaining → Chaos
export const FLASH_ORDER_1_AT      = 480;   // Flash order #1 at ~7 min mark
export const FLASH_ORDER_2_AT      = 180;   // Flash order #2 at ~12 min mark
export const FLASH_ORDER_DURATION  = 45;    // 45-second window per flash order

// ── Core helpers ──────────────────────────────────────────────────────────────
export function shuffle<T>(a: T[]): T[] {
  const b = [...a];
  for (let i = b.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [b[i], b[j]] = [b[j], b[i]];
  }
  return b;
}

export function makeOven(): OvenState {
  return {
    recipe: null, currentTemp: 50, bakeProgress: 0, preheatProgress: 0,
    status: 'empty', lastDriftTick: 0, feedback: null, pulledQuality: null,
    frozen: false, masterTimer: false,
  };
}

export function faceFor(patience: number): string {
  if (patience > 70) return '😊';
  if (patience > 40) return '😐';
  if (patience > 15) return '😟';
  return '😡';
}

export function qualityFor(tempDiff: number, progress: number): ItemQuality {
  const tOk     = Math.abs(tempDiff) <= 10;
  const tGood   = Math.abs(tempDiff) <= 20;
  const pPerfect = progress >= GOLDEN_START && progress <= GOLDEN_START + 8;
  const pGood    = progress >= GOLDEN_START && progress <= GOLDEN_END - 4;
  if (tOk && pPerfect)  return 'perfect';
  if (tOk && pGood)     return 'great';
  if (tGood && pGood)   return 'good';
  if (pGood)            return 'ok';
  return 'poor';
}

export function starsFor(q: ItemQuality): number {
  return { perfect: 5, great: 4, good: 3, ok: 2, poor: 1 }[q];
}

export function qualityLabel(q: ItemQuality): { label: string; color: string; icon: string } {
  return {
    perfect: { label: 'PERFECT', color: 'text-amber-300',  icon: '✨' },
    great:   { label: 'GREAT',   color: 'text-yellow-300', icon: '⭐' },
    good:    { label: 'GOOD',    color: 'text-emerald-400',icon: '✅' },
    ok:      { label: 'OK',      color: 'text-cyan-400',   icon: '👍' },
    poor:    { label: 'POOR',    color: 'text-white/50',   icon: '😶' },
  }[q];
}

export function tempColor(d: number): string {
  if (d < -25) return 'text-blue-400';
  if (d < -12) return 'text-cyan-300';
  if (Math.abs(d) <= 12) return 'text-emerald-400';
  if (d <= 25) return 'text-orange-400';
  return 'text-red-400';
}

export function tempBarColor(d: number): string {
  if (d < -25) return 'bg-blue-500';
  if (d < -12) return 'bg-cyan-400';
  if (Math.abs(d) <= 12) return 'bg-emerald-500';
  if (d <= 25) return 'bg-orange-500';
  return 'bg-red-500';
}

export function formatTime(s: number): string {
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

// ── After-Hours score calculation ─────────────────────────────────────────────
export function scoreForQuality(q: ItemQuality, isGolden = false, comboMult = 1, modMult = 1): number {
  const base = { perfect: 100, great: 75, good: 50, ok: 25, poor: 10 }[q];
  const golden = isGolden ? 5 : 1;
  return Math.round(base * golden * comboMult * modMult);
}

// ── Daily modifier — seeded from today's date ──────────────────────────────────
export function getTodayModifiers(): DailyModifier[] {
  const dateStr = new Date().toDateString(); // "Sat Jun 28 2026"
  let hash = 0;
  for (let i = 0; i < dateStr.length; i++) {
    hash = (hash * 31 + dateStr.charCodeAt(i)) >>> 0;
  }
  // Pick 2 modifiers deterministically from today's hash
  const idx1 = hash % ALL_DAILY_MODIFIERS.length;
  const idx2 = (hash * 7 + 3) % ALL_DAILY_MODIFIERS.length;
  const m1 = ALL_DAILY_MODIFIERS[idx1];
  const m2 = ALL_DAILY_MODIFIERS[idx2 === idx1 ? (idx2 + 1) % ALL_DAILY_MODIFIERS.length : idx2];
  return [m1, m2].filter(Boolean);
}

export function todayDifficulty(modifiers: DailyModifier[]): number {
  const avg = modifiers.reduce((s, m) => s + m.difficulty, 0) / Math.max(1, modifiers.length);
  return Math.round(avg);
}

// ── Bakery lifetime stats — localStorage ─────────────────────────────────────
const STATS_KEY = 'toffeetowns-bakery-stats';

export function loadBakeryStats(): BakeryLifetimeStats {
  try {
    const raw = localStorage.getItem(STATS_KEY);
    if (raw) return JSON.parse(raw) as BakeryLifetimeStats;
  } catch { /* ignore */ }
  return {
    lifetimePerfectBakes: 0, lifetimeBurns: 0,
    lifetimeHighestCombo: 0, lifetimeBestScore: 0,
    lifetimeGoldenOrders: 0, minutesBaked: 0,
    shiftsCompleted: 0, juniorBakerEarned: false,
    earnedAchievements: [],
  };
}

export function saveBakeryStats(stats: BakeryLifetimeStats): void {
  try {
    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
  } catch { /* ignore */ }
}

export function mergeBakeryStats(
  prev: BakeryLifetimeStats,
  sessionPerfects: number,
  sessionBurns: number,
  sessionCombo: number,
  sessionScore: number,
  sessionGoldenOrders: number,
  sessionMinutes: number,
  isShift: boolean,
): BakeryLifetimeStats {
  return {
    ...prev,
    lifetimePerfectBakes:  prev.lifetimePerfectBakes + sessionPerfects,
    lifetimeBurns:         prev.lifetimeBurns + sessionBurns,
    lifetimeHighestCombo:  Math.max(prev.lifetimeHighestCombo, sessionCombo),
    lifetimeBestScore:     Math.max(prev.lifetimeBestScore, sessionScore),
    lifetimeGoldenOrders:  prev.lifetimeGoldenOrders + sessionGoldenOrders,
    minutesBaked:          prev.minutesBaked + sessionMinutes,
    shiftsCompleted:       isShift ? prev.shiftsCompleted + 1 : prev.shiftsCompleted,
  };
}
