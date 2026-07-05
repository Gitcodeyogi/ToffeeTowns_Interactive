// bakeryTypes.ts
// ─────────────────────────────────────────────────────────────────────────────
// All shared types, enums and interfaces for the Oven Timing mini-game system.
// ─────────────────────────────────────────────────────────────────────────────

export const BakeryMode = {
  Select: 'select',
  Apprenticeship: 'apprenticeship',
  Shift: 'shift',
  AfterHours: 'after-hours',
} as const;

export type BakeryMode = typeof BakeryMode[keyof typeof BakeryMode];

// ── Core game types ────────────────────────────────────────────────────────────
export type GamePhase   = 'briefing' | 'playing' | 'event' | 'exit_confirm' | 'result';
export type OvenStatus  = 'empty' | 'preheating' | 'baking' | 'golden' | 'burnt' | 'done' | 'cooling';
export type ItemQuality = 'perfect' | 'great' | 'good' | 'ok' | 'poor';

// ── Domain interfaces ──────────────────────────────────────────────────────────
export interface Recipe {
  id: number; name: string; icon: string; requiredTemp: number;
  bakeDuration: number; story: string; tempLabel: string;
  driftSpeed: number; burnSpeed: number; goldenWidth: number;
  phrases: string[];
  category: 'pastry' | 'dessert' | 'loaf';
  afterHoursOnly?: boolean;
}

export interface OvenState {
  recipe: Recipe | null; currentTemp: number;
  bakeProgress: number; preheatProgress: number;
  status: OvenStatus; lastDriftTick: number;
  feedback: { quality: ItemQuality; name: string } | null;
  pulledQuality: ItemQuality | null;
  frozen?: boolean;        // hint: Freeze Oven
  masterTimer?: boolean;   // hint: Master Timer (wider golden display)
}

export interface OrderGroup {
  id: string; customer: string; icon: string; face: string;
  need: number; done: number; patience: number;
  category: 'pastry' | 'dessert' | 'loaf';
  comment: string;
  isGolden?: boolean;  // after-hours: golden order = ×5 score
}

export interface GameEvent {
  id: string; icon: string; title: string; body: string;
  choices: { label: string; good: boolean }[];
  timeLimit: number; resolved: boolean;
  afterHoursOnly?: boolean;
}

export interface PulledItem {
  quality: ItemQuality; recipeName: string;
}

// ── Rewards ───────────────────────────────────────────────────────────────────
export interface OvenTimingRewards {
  coins: number; xp: number; legacy: number; skill: string;
}

// ── Daily modifier (roguelike condition seeded from date) ──────────────────────
export interface DailyModifier {
  id: string;
  name: string;
  icon: string;
  description: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
  effects: {
    driftMultiplier?: number;
    goldenChanceBonus?: number;
    burnPenaltyMultiplier?: number;
    bakingSpeedMultiplier?: number;
    extraCustomers?: number;
    moreGoldenOrders?: boolean;
    noButterSpill?: boolean;
    catEventsFrequent?: boolean;
    scoreMultiplier?: number;
    widerGoldenZone?: boolean;
  };
}

// ── Bakery lifetime statistics ─────────────────────────────────────────────────
export interface BakeryLifetimeStats {
  lifetimePerfectBakes:  number;
  lifetimeBurns:         number;
  lifetimeHighestCombo:  number;
  lifetimeBestScore:     number;
  lifetimeGoldenOrders:  number;
  minutesBaked:          number;
  shiftsCompleted:       number;   // gate for After-Hours unlock
  juniorBakerEarned:     boolean;  // gate for After-Hours unlock
  earnedAchievements:    string[]; // achievement ids
}

// ── Achievement definition ─────────────────────────────────────────────────────
export interface BakeryAchievement {
  id: string;
  name: string;
  icon: string;
  description: string;
  check: (stats: BakeryLifetimeStats, sessionBurns?: number, sessionCombo?: number) => boolean;
}

// ── Apprenticeship chapter ─────────────────────────────────────────────────────
export interface ApprenticeChapter {
  id: number;
  title: string;
  chefSays: string;
  spotlight: string | null; // element id to highlight
  action: 'click' | 'adjust' | 'wait' | 'watch' | 'none';
  clickTarget?: string;     // what element to click to advance
}

// ── Profession interface (for future Clinic, Railway, Carpenter etc.) ──────────
export interface ProfessionGameProps {
  rewards: OvenTimingRewards;
  onSuccess: () => void;
  onFail: () => void;
  onClose?: () => void;
}
