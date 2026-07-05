// MiniGameConfig.ts
// ─────────────────────────────────────────────────────────────────────────────
// Type definitions for driving the ProfessionGame SDK/Framework.
// ─────────────────────────────────────────────────────────────────────────────

export type GameMode = 'select' | 'briefing' | 'prep' | 'playing' | 'result' | 'album';

export interface GameRewards {
  coins: number;
  xp: number;
  legacy: number;
  skillName: string;
}

export interface EquipmentItem {
  id: string;
  name: string;
  icon: string;
  description: string;
  cost: number;
  category: 'tool' | 'storage' | 'helper' | 'booster' | 'permanent';
  isPermanent: boolean;
  effect: {
    // Modifier flags
    catchWindowMultiplier?: number;
    capacityBonus?: number;
    timerExtension?: number;
    driftReduction?: number;
    magnetEffect?: boolean;
    rareGlow?: boolean;
    scareObstacles?: boolean;
    bakeSpeedMultiplier?: number;
    preheatSpeedMultiplier?: number;
    forgiveMistakes?: boolean;
  };
}

export interface MiniGameConfig {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  entryFee: number;
  duration: number; // in seconds
  rewards: GameRewards;
  backgroundImage: string;
  themeColor: string; // Tailwind class prefix, e.g. "amber", "purple", "emerald"
  accentColor: string; // hex color for canvas/particle effects
  equipment: EquipmentItem[];
}
