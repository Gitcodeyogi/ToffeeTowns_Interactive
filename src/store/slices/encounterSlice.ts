import type { StateCreator } from 'zustand';
import type { TTStore } from '../useTTStore';
import type { Encounter } from '../types';
import { saveUserState } from '../storeUtils';

export interface EncounterSlice {
  currentEncounter: Encounter | null;
  triggerEncounter: (encounter: Encounter) => void;
  resolveEncounter: (optionIdx: number) => void;
  checkEncounter: () => void;
}

export const ENCOUNTERS_DATA: Encounter[] = [
  {
    id: 'enc-1',
    title: 'Acorn Investment Advice 🐿️',
    text: 'A business-minded squirrel blocks your path, wearing a miniature monocle. It points to a pinecone and squeaks about "diversified nuts." How do you proceed?',
    options: [
      {
        label: 'Listen attentively (+5 Builder XP)',
        outcomeText: 'You listen for 5 minutes. Some of it actually makes sense (something about seed storage). You gained 5 Builder XP!',
        xp: 5,
        xpCat: 'builder'
      },
      {
        label: 'Ignore & Walk past (+5 Legacy)',
        outcomeText: 'You politely wave and walk past. You gain 5 Legacy for staying focused on your residency routine.',
        legacy: 5
      },
      {
        label: 'Give Acorn (-2 Coins, +15 Coins later)',
        outcomeText: 'You hand over 2 coins. The squirrel salutes and kicks a tiny chocolate truffle bag into your hands! You gained 15 Coins!',
        coins: 13, // Net +13 coins
        legacy: 5
      }
    ]
  },
  {
    id: 'enc-2',
    title: 'Stuck Wagon Wheel 🐎',
    text: 'A merchant wagon has its rear wheel deeply wedged in a thick puddle of gooey marshmallow cream. The wagon driver is looking very stressed.',
    options: [
      {
        label: 'Help push (+10 Legacy, +10 Builder XP)',
        outcomeText: 'You push with all your might. With a satisfying *pop*, the wheel escapes! The driver thanks you profusely. +10 Legacy & +10 Builder XP!',
        legacy: 10,
        xp: 10,
        xpCat: 'builder'
      },
      {
        label: 'Offer sanitizing advice (+10 Healer XP)',
        outcomeText: 'You suggest scraping the sticky cream off with a branch. It works! +10 Healer XP.',
        xp: 10,
        xpCat: 'healer'
      },
      {
        label: 'Wish them luck & move on (+5 Legacy)',
        outcomeText: 'You wish them a good day and walk past. At least you were friendly! +5 Legacy.',
        legacy: 5
      }
    ]
  },
  {
    id: 'enc-3',
    title: 'Glowcap Fluttermoth Sighting 🦋',
    text: 'A glowing fluttermoth settles on your shoulder, humming a soft tune. Its wings are sparkling under the forest shadow.',
    options: [
      {
        label: 'Observe closely (+15 Explorer XP)',
        outcomeText: 'You carefully catalog its patterns. You learned a lot about rare forest fauna! +15 Explorer XP.',
        xp: 15,
        xpCat: 'explorer'
      },
      {
        label: 'Feed it a sugar speck (-1 Coin, +10 Coins back)',
        outcomeText: 'You drop a tiny candy crumb. It flutters happily and drops a shiny copper token it was carrying! Net +9 Coins.',
        coins: 9,
        legacy: 5
      },
      {
        label: 'Shoo it away (+5 Legacy)',
        outcomeText: 'You gently brush it away to avoid disturbing the fragile wings. +5 Legacy.',
        legacy: 5
      }
    ]
  },
  {
    id: 'enc-4',
    title: 'Mayor Truffle\'s Ribbon Dispute 🏛️',
    text: 'You run into Mayor Maple Truffle, who is frantically searching the grass. "I lost my ribbon permit!" he gasps. You spot it hanging on a low branch.',
    options: [
      {
        label: 'Point it out (+10 Legacy, +10 Coins)',
        outcomeText: 'You hand him the ribbon permit. He beams and hands you 10 coins. "You are an exemplary resident!" +10 Legacy, +10 Coins.',
        coins: 10,
        legacy: 10
      },
      {
        label: 'Climb the tree to get it (+15 Explorer XP)',
        outcomeText: 'You climb up and retrieve it gracefully. He applauds. +15 Explorer XP.',
        xp: 15,
        xpCat: 'explorer'
      }
    ]
  },
  {
    id: 'enc-5',
    title: 'A Strange Mushroom Ring 🍄',
    text: 'You pass a ring of bright blue glowing mushrooms that seem to be humming in harmony. It is a fairy circle!',
    options: [
      {
        label: 'Tiptoe around (+10 Explorer XP)',
        outcomeText: 'You walk around it carefully to not disturb the magical ring. +10 Explorer XP.',
        xp: 10,
        xpCat: 'explorer'
      },
      {
        label: 'Make a wish (-5 Coins, +20 Legacy)',
        outcomeText: 'You toss 5 coins into the ring and make a wish for the town\'s prosperity. The circle glows brightly! +20 Legacy!',
        coins: -5,
        legacy: 20
      }
    ]
  }
];

export const createEncounterSlice: StateCreator<
  TTStore,
  [],
  [],
  EncounterSlice
> = (set, get) => ({
  currentEncounter: null,

  triggerEncounter: (encounter) => {
    set({ currentEncounter: encounter });
  },

  resolveEncounter: (optionIdx) => {
    const enc = get().currentEncounter;
    if (!enc) return;
    const opt = enc.options[optionIdx];
    if (!opt) return;

    set((s) => {
      const nextCoins = Math.max(0, s.coins + (opt.coins || 0));
      const nextLegacy = Math.max(0, s.legacyPoints + (opt.legacy || 0));
      const nextSkills = { ...s.skills };
      const nextCoinHistory = [...s.coinHistory];

      if (opt.coins && opt.coins !== 0) {
        nextCoinHistory.unshift({
          id: Math.random().toString(36).slice(2),
          type: opt.coins > 0 ? 'earned' : 'spent',
          amount: Math.abs(opt.coins),
          source: `Encounter: ${enc.title}`,
          date: new Date().toISOString(),
        });
      }

      if (opt.xp && opt.xpCat) {
        nextSkills[opt.xpCat] = (nextSkills[opt.xpCat] || 0) + opt.xp;
      }

      return {
        coins: nextCoins,
        legacyPoints: nextLegacy,
        skills: nextSkills,
        coinHistory: nextCoinHistory,
        currentEncounter: null,
      };
    });

    const state = get();
    if (state.user) saveUserState(state.user.uid, state);
  },

  checkEncounter: () => {
    // Roadside encounters completely removed as requested
  },
});
