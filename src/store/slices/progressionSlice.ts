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
  playerAvatar: string | null;
  avatarZoom: number;
  avatarX: number;
  avatarY: number;

  // New Residency & Chronicles States
  rentPaidUntil: string | null;
  isBankrupt: boolean;
  communityServiceProgress: number;
  unlockedFragments: string[];
  donatedResources: Record<string, number>;
  skippedTaxCount: number;
  lastProvinceTaxTriggerTime: number | null;

  // Citizen Journey Roadmap States
  currentRoleId: string;
  completedMilestones: string[];

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
  setPlayerAvatar: (dataUrl: string | null) => void;
  setAvatarAdjustments: (zoom: number, x: number, y: number) => void;

  // New Residency & Chronicles Actions
  checkRentStatus: () => void;
  payRent: () => void;
  completeCommunityChore: () => void;
  findMemoryFragment: (townId: string) => string | null;
  unlockFragment: (fragmentId: string) => void;
  donateResource: (resourceId: string, amount: number) => void;
  payProvinceTax: (amount: number) => void;
  skipProvinceTax: () => void;

  // Citizen Journey Actions
  claimMilestoneReward: (milestoneId: string, coins: number, legacy: number) => void;
  promoteRole: () => void;
  setJourneyState: (roleId: string, milestones: string[]) => void;
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
  playerAvatar: null,
  avatarZoom: 1,
  avatarX: 0,
  avatarY: 0,
  legacyPoints: 0,
  legacyTitles: [],
  skills: {},
  townWelcomeShown: false,
  lastFlashNewsShownBlock: null,
  latestFlashNews: null,
  mailbox: [],
  headerHidden: false,

  // New Residency & Chronicles States Initializer
  rentPaidUntil: null,
  isBankrupt: false,
  communityServiceProgress: 0,
  unlockedFragments: [],
  donatedResources: {},
  skippedTaxCount: 0,
  lastProvinceTaxTriggerTime: null,

  // Citizen Journey Roadmap States Initializer
  currentRoleId: 'newcomer',
  completedMilestones: [],

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
    const isGolden = get().goldenCitizenPass;
    const finalXp = isGolden ? Math.round(xp * 1.5) : xp;
    set((s) => ({ skills: { ...s.skills, [trackId]: (s.skills[trackId] || 0) + finalXp } }));
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

  setPlayerAvatar: (dataUrl) => {
    set({ playerAvatar: dataUrl, avatarZoom: 1, avatarX: 0, avatarY: 0 });
    const s = get();
    if (s.user) saveUserState(s.user.uid, s);
  },

  setAvatarAdjustments: (zoom, x, y) => {
    set({ avatarZoom: zoom, avatarX: x, avatarY: y });
    const s = get();
    if (s.user) saveUserState(s.user.uid, s);
  },

  // New Residency & Chronicles Actions Implementation
  checkRentStatus: () => {
    const s = get();
    if (s.isBankrupt) return;

    if (!s.rentPaidUntil) {
      const initialRent = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
      set({ rentPaidUntil: initialRent });
      if (s.user) saveUserState(s.user.uid, get());
      return;
    }

    const now = Date.now();
    const deadline = new Date(s.rentPaidUntil).getTime();
    if (now > deadline) {
      const rentCost = 20 + s.skippedTaxCount * 15;
      if (s.coins >= rentCost) {
        s.spendCoins(rentCost, '30-Day Cottage Rent & Provisions');
        const nextRent = new Date(deadline + 30 * 24 * 60 * 60 * 1000).toISOString();
        set({ rentPaidUntil: nextRent });
        const newMail = {
          id: 'rent-pay-' + Math.random().toString(36).slice(2),
          from: 'Elder Bark (Cottage Landlord)',
          subject: 'Rent & Provisions Received ✓',
          body: `Dear Resident, thank you for your 30-day cottage rent (10 Coins) and provisions (10 Coins) payment of ${rentCost} Cocoa Coins (includes a surcharge of ${s.skippedTaxCount * 15} Coins for provincial tax avoidance). Your residency contract has been extended for another 30 days to ${new Date(nextRent).toLocaleDateString()}. Keep up the good work in your hometown!`,
          read: false,
          timestamp: new Date().toISOString()
        };
        set((prev) => ({ mailbox: [newMail, ...prev.mailbox] }));
        if (s.user) saveUserState(s.user.uid, get());
      } else {
        set({ isBankrupt: true, communityServiceProgress: 0 });
        const bankruptcyMail = {
          id: 'bankruptcy-' + Math.random().toString(36).slice(2),
          from: 'Elder Bark (Cottage Landlord)',
          subject: 'Residency Foreclosure Notice ⚠️',
          body: `Urgent: We were unable to collect the 30-day cottage rent and provisions of ${rentCost} Cocoa Coins (includes a surcharge of ${s.skippedTaxCount * 15} Coins for provincial tax avoidance). Your premium cottage privileges have been temporarily suspended under a foreclosure order. You must report to the Homestead and complete 3 Community Service Chores to clear your debt and restore your home.`,
          read: false,
          timestamp: new Date().toISOString()
        };
        set((prev) => ({ mailbox: [bankruptcyMail, ...prev.mailbox] }));
        if (s.user) saveUserState(s.user.uid, get());
      }
    }
  },

  payRent: () => {
    const s = get();
    const rentCost = 20 + s.skippedTaxCount * 15;
    if (s.coins < rentCost) return;
    s.spendCoins(rentCost, '30-Day Cottage Rent & Provisions Prepaid');
    const currentDeadline = s.rentPaidUntil ? new Date(s.rentPaidUntil).getTime() : Date.now();
    const nextRent = new Date(currentDeadline + 30 * 24 * 60 * 60 * 1000).toISOString();
    set({ rentPaidUntil: nextRent });
    const newMail = {
      id: 'rent-prepay-' + Math.random().toString(36).slice(2),
      from: 'Elder Bark (Cottage Landlord)',
      subject: 'Rent & Provisions Prepaid ✓',
      body: `We have received your pre-payment of ${rentCost} Cocoa Coins (includes a surcharge of ${s.skippedTaxCount * 15} Coins). Your residency contract is secure until ${new Date(nextRent).toLocaleDateString()}. Thank you!`,
      read: false,
      timestamp: new Date().toISOString()
    };
    set((prev) => ({ mailbox: [newMail, ...prev.mailbox] }));
    if (s.user) saveUserState(s.user.uid, get());
  },

  completeCommunityChore: () => {
    set((s) => {
      const nextProgress = s.communityServiceProgress + 1;
      if (nextProgress >= 3) {
        const nextRent = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
        const currentCoins = s.coins;
        const finalCoins = currentCoins < 0 ? 0 : currentCoins;
        
        const repMail = {
          id: 'reprieve-' + Math.random().toString(36).slice(2),
          from: 'Elder Bark (Cottage Landlord)',
          subject: 'Residency Restored! 🏡',
          body: `Excellent citizen! You have successfully completed your 3 Community Service Chores. Your account is clear of debt, and your cottage residency is fully restored for the next 30 days.`,
          read: false,
          timestamp: new Date().toISOString()
        };
        
        return {
          isBankrupt: false,
          communityServiceProgress: 0,
          rentPaidUntil: nextRent,
          coins: finalCoins,
          mailbox: [repMail, ...s.mailbox]
        };
      }
      return { communityServiceProgress: nextProgress };
    });
    const state = get();
    if (state.user) saveUserState(state.user.uid, state);
  },

  findMemoryFragment: (townId) => {
    const s = get();
    const possible = [1, 2, 3]
      .map(n => `${townId}-${n}`)
      .filter(id => !s.unlockedFragments.includes(id));
    if (possible.length === 0) return null;
    const randomFrag = possible[Math.floor(Math.random() * possible.length)];
    set((prev) => ({ unlockedFragments: [...prev.unlockedFragments, randomFrag] }));
    const state = get();
    if (state.user) saveUserState(state.user.uid, state);
    return randomFrag;
  },

  unlockFragment: (fragmentId) => {
    set((prev) => {
      if (prev.unlockedFragments.includes(fragmentId)) return {};
      return { unlockedFragments: [...prev.unlockedFragments, fragmentId] };
    });
    const state = get();
    if (state.user) saveUserState(state.user.uid, state);
  },

  donateResource: (resourceId, amount) => {
    set((prev) => {
      const prevQty = prev.donatedResources[resourceId] || 0;
      const nextDonated = { ...prev.donatedResources, [resourceId]: prevQty + amount };
      return { donatedResources: nextDonated };
    });
    const s = get();
    s.addCoins(amount * 2, `Town Hall Donation: ${resourceId} x${amount}`);
    s.addLegacy(amount * 1); // Also reduce legacy gain from 5 to 1 to match slow legacy progression
    const state = get();
    if (state.user) saveUserState(state.user.uid, state);
  },

  payProvinceTax: (amount) => {
    const s = get();
    if (s.coins < amount) return;
    s.spendCoins(amount, 'Provincial Tax Contribution');
    set({ lastProvinceTaxTriggerTime: Date.now() });
    const state = get();
    if (state.user) saveUserState(state.user.uid, state);
  },

  skipProvinceTax: () => {
    set((s) => ({
      skippedTaxCount: s.skippedTaxCount + 1,
      lastProvinceTaxTriggerTime: Date.now()
    }));
    const state = get();
    if (state.user) saveUserState(state.user.uid, state);
  },

  claimMilestoneReward: (milestoneId, coins, legacy) => {
    set((s) => {
      const alreadyClaimed = s.completedMilestones.includes(milestoneId);
      if (alreadyClaimed) return {};
      const nextCompleted = [...s.completedMilestones, milestoneId];
      const nextCoins = s.coins + coins;
      const nextLegacy = s.legacyPoints + legacy;
      const nextHistory = [
        {
          id: 'journey-' + Math.random().toString(36).slice(2),
          type: 'earned' as const,
          amount: coins,
          source: `Milestone: ${milestoneId}`,
          date: new Date().toISOString()
        },
        ...s.coinHistory
      ];
      return {
        completedMilestones: nextCompleted,
        coins: nextCoins,
        legacyPoints: nextLegacy,
        coinHistory: nextHistory
      };
    });
    const state = get();
    if (state.user) saveUserState(state.user.uid, state);
  },

  promoteRole: () => {
    const rolesOrder = ['newcomer', 'apprentice', 'resident', 'contributor', 'steward'];
    const currentId = get().currentRoleId || 'newcomer';
    const currentIndex = rolesOrder.indexOf(currentId);
    if (currentIndex !== -1 && currentIndex < rolesOrder.length - 1) {
      const nextRoleId = rolesOrder[currentIndex + 1];
      set({ currentRoleId: nextRoleId });
      const newMail = {
        id: 'promo-' + Math.random().toString(36).slice(2),
        from: 'County Registry Hall',
        subject: `Civic Promotion: ${nextRoleId.toUpperCase()}! 🎉`,
        body: `Dear Citizen, the Town Council is pleased to announce your official promotion to the rank of ${nextRoleId.toUpperCase().replace(/\b\w/g, c => c.toUpperCase())}. Your contributions to Toffee Town have been entered in the Golden Ledger. Keep building your legacy!`,
        read: false,
        timestamp: new Date().toISOString()
      };
      set((s) => ({ mailbox: [newMail, ...s.mailbox] }));
      const state = get();
      if (state.user) saveUserState(state.user.uid, state);
    }
  },

  setJourneyState: (roleId, milestones) => {
    set({ currentRoleId: roleId, completedMilestones: milestones });
    const state = get();
    if (state.user) saveUserState(state.user.uid, state);
  },
});
