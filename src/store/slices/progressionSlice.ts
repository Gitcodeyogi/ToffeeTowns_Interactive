import type { StateCreator } from 'zustand';
import type { TTStore } from '../useTTStore';
import type { TownId } from '../types';
import { saveUserState } from '../storeUtils';

export interface ProgressionSlice {
  travellerName: string;
  homeTown: TownId | null;
  welcomeDone: boolean;
  earnedBadges: number[];
  legacyPoints: number;
  legacyTitles: string[];
  skills: Record<string, number>;
  townWelcomeShown: boolean;
  lastFlashNewsShownBlock: number | null;
  latestFlashNews: string | null;
  mailbox: { id: string; from: string; subject: string; body: string; read: boolean; timestamp: string }[];
  headerHidden: boolean;

  setTravellerName: (name: string) => void;
  setHomeTown: (town: TownId) => void;
  setWelcomeDone: (done: boolean) => void;
  awardBadge: (id: number) => void;
  addLegacy: (pts: number) => void;
  addTitle: (title: string) => void;
  addSkillXP: (trackId: string, xp: number) => void;
  markMailRead: (id: string) => void;
  setTownWelcomeShown: (shown: boolean) => void;
  setFlashNewsShown: (block: number, news: string) => void;
  setHeaderHidden: (hidden: boolean) => void;
}

export const createProgressionSlice: StateCreator<
  TTStore,
  [],
  [],
  ProgressionSlice
> = (set, get) => ({
  travellerName: '',
  homeTown: null,
  welcomeDone: false,
  earnedBadges: [],
  legacyPoints: 0,
  legacyTitles: [],
  skills: {},
  townWelcomeShown: false,
  lastFlashNewsShownBlock: null,
  latestFlashNews: null,
  mailbox: [],
  headerHidden: false,

  setTravellerName: (name) => {
    set({ travellerName: name });
    const s = get();
    if (s.user) saveUserState(s.user.uid, s);
  },

  setHomeTown: (town) => {
    set({ homeTown: town });
    const s = get();
    if (s.user) saveUserState(s.user.uid, s);
  },

  setWelcomeDone: (done) => {
    set({ welcomeDone: done });
    const s = get();
    if (s.user) saveUserState(s.user.uid, s);
  },

  awardBadge: (id) => {
    set((s) => ({ earnedBadges: s.earnedBadges.includes(id) ? s.earnedBadges : [...s.earnedBadges, id] }));
    const s = get();
    if (s.user) saveUserState(s.user.uid, s);
  },

  addLegacy: (pts) => {
    set((s) => ({ legacyPoints: s.legacyPoints + pts }));
    const s = get();
    if (s.user) saveUserState(s.user.uid, s);
  },

  addTitle: (title) => {
    set((s) => ({ legacyTitles: s.legacyTitles.includes(title) ? s.legacyTitles : [...s.legacyTitles, title] }));
    const s = get();
    if (s.user) saveUserState(s.user.uid, s);
  },

  addSkillXP: (trackId, xp) => {
    set((s) => ({ skills: { ...s.skills, [trackId]: (s.skills[trackId] || 0) + xp } }));
    const s = get();
    if (s.user) saveUserState(s.user.uid, s);
  },

  markMailRead: (id) => {
    set((s) => ({ mailbox: s.mailbox.map((m) => (m.id === id ? { ...m, read: true } : m)) }));
    const s = get();
    if (s.user) saveUserState(s.user.uid, s);
  },

  setTownWelcomeShown: (shown) => {
    set({ townWelcomeShown: shown });
    const s = get();
    if (s.user) saveUserState(s.user.uid, s);
  },

  setFlashNewsShown: (block, news) => {
    set({ lastFlashNewsShownBlock: block, latestFlashNews: news });
    const s = get();
    if (s.user) saveUserState(s.user.uid, s);
  },

  setHeaderHidden: (hidden) => set({ headerHidden: hidden }),
});
