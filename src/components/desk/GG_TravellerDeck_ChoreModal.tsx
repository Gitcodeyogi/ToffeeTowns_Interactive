// GG_TravellerDeck_ChoreModal.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Replaces the old text-input puzzle UI with the mini-game router.
// Each cottage hotspot area maps to 2 distinct game types (alternating by
// choreIndex so each hotspot gets variety).
//
// Area → game mapping:
//   exterior  (ext-*)  → steam / bubble
//   livingroom (liv-*) → sweep / monorail
//   bedroom   (bed-*)  → plant / boiler
//   kitchen   (kit-*)  → bubble / boiler
//   balcony   (bal-*)  → plant / steam
//   lawn      (law-*)  → sort  / gear
// ─────────────────────────────────────────────────────────────────────────────
import React from 'react';
import type { ChorePuzzle, HotspotConfig } from './GG_TravellerDeck_Home';
import { MiniGameRouter } from '../minigames/MiniGameRouter';

interface GG_TravellerDeck_ChoreModalProps {
  activePuzzleChore: { hotspot: HotspotConfig; chore: ChorePuzzle; expiresAt: number; choreIndex: number };
  setActivePuzzleChore: (val: any) => void;
  triggerFeedback: (msg: string) => void;
  onChoreComplete: (hotspotId: string) => void;
}

// ── Area → [game for chore 0, game for chore 1] ───────────────────────────
const AREA_GAME_MAP: Record<string, [string, string]> = {
  ext:  ['steam',  'bakery'],
  liv:  ['bakery', 'monorail'],
  bed:  ['plant',  'boiler'],
  kit:  ['bakery', 'boiler'],
  bal:  ['plant',  'steam'],
  law:  ['sort',   'gear'],
};

function getDutyType(hotspotId: string, choreIndex: number, choreTitle?: string): string {
  if (choreTitle) {
    const title = choreTitle.toLowerCase();
    
    // 1. Semantic keyword matching for high robustness
    if (title.includes('spice heat') || title.includes('organize') || title.includes('chronology') || title.includes('order') || title.includes('brush') || title.includes('groom') || title.includes('books') || title.includes('shelf')) {
      return 'sort'; // Pantry Sort Sprint
    }
    if (title.includes('molasses') || title.includes('boiler') || title.includes('pressure') || title.includes('fire') || title.includes('hearth') || title.includes('fondue')) {
      return 'boiler'; // Steam Boiler Pressure
    }
    if (title.includes('leak') || title.includes('pipe') || title.includes('latch') || title.includes('valves') || title.includes('steam')) {
      return 'steam'; // Patch Pipe Leaks
    }
    if (title.includes('water') || title.includes('plant') || title.includes('orchid') || title.includes('flower') || title.includes('ivy') || title.includes('weed') || title.includes('garden')) {
      return 'plant'; // Plant Waterer
    }
    if (title.includes('polish') || title.includes('clean') || title.includes('dust') || title.includes('sweep') || title.includes('kettle') || title.includes('pans') || title.includes('mirror') || title.includes('carpet')) {
      return 'bakery'; // Replaced Dust Bunny Sweep with Bakery Oven Timing!
    }
    if (title.includes('comet') || title.includes('angle') || title.includes('lenses') || title.includes('calibrate') || title.includes('gear') || title.includes('pinion')) {
      return 'gear'; // Realign Mechanical Gears
    }
    if (title.includes('train') || title.includes('monorail') || title.includes('signal') || title.includes('tracks')) {
      return 'monorail'; // Monorail Signals
    }
    if (title.includes('ratio') || title.includes('calculation') || title.includes('nutrient') || title.includes('mix')) {
      return 'bakery'; // Replaced Bubble Sort with Bakery Oven Timing!
    }
  }

  const prefix = hotspotId.split('-')[0]; // e.g. 'ext', 'kit', 'bal'
  const games = AREA_GAME_MAP[prefix] || ['gear', 'steam'];
  return games[choreIndex % 2];
}

function getFrame(dutyType: string): string {
  const frameMap: Record<string, string> = {
    bubble: 'pink',   sweep:   'ledger', plant: 'blueprint',
    sort:   'wooden', steam:   'copper', gear:  'copper',
    monorail: 'steel', boiler: 'copper', scaffold: 'wooden',
    bakery: 'hearth',
  };
  return frameMap[dutyType] || 'wooden';
}

export const GG_TravellerDeck_ChoreModal: React.FC<GG_TravellerDeck_ChoreModalProps> = ({
  activePuzzleChore,
  setActivePuzzleChore,
  triggerFeedback,
  onChoreComplete,
}) => {
  const { hotspot, chore, choreIndex } = activePuzzleChore;
  const dutyType = getDutyType(hotspot.id, choreIndex, chore.title);
  const frame = getFrame(dutyType);

  const handleSuccess = () => {
    triggerFeedback(`✅ ${chore.title} complete! +${chore.xpReward} ${chore.xpCategory.toUpperCase()} XP`);
    onChoreComplete(hotspot.id);
    setActivePuzzleChore(null);
  };

  const handleFail = () => {
    triggerFeedback(`❌ Chore abandoned. Some XP penalty applied.`);
    setActivePuzzleChore(null);
  };

  return (
    <MiniGameRouter
      taskName={chore.title}
      skillCat={chore.xpCategory}
      dutyType={dutyType}
      frame={frame}
      profession={chore.xpCategory}
      rewards={{
        coins: 0,
        xp: chore.xpReward,
        legacy: 2,
        skill: chore.xpCategory,
      }}
      onSuccess={handleSuccess}
      onFail={handleFail}
    />
  );
};
