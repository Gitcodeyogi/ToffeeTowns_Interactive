import type { StateCreator } from 'zustand';
import type { TTStore } from '../useTTStore';
import type { CoinTransaction } from '../types';
import { saveUserState } from '../storeUtils';

export interface EconomySlice {
  coins: number;
  coinHistory: CoinTransaction[];
  ownedDecorations: string[];
  equippedDecorations: string[];
  ownedPets: string[];
  equippedPet: string | null;
  activeTransport: 'walk' | 'horse-wagon' | 'forest-train' | 'hot-air-balloon';
  ownedTransports: string[];
  ownedEstates: string[];
  activePasses: string[];
  premiumPassport: boolean;
  
  // Premium States
  gems: number;
  goldenCitizenPass: boolean;
  goldenCitizenPassExpiry: string | null;
  lastGemClaimDate: string | null;
  ownedBusinesses: string[];
  breweryRecipes: { name: string; base: string; infusion: string; brewedCount: number }[];
  raffleTickets: number;
  lastRaffleDrawDate: string | null;

  addCoins: (amount: number, source: string) => void;
  spendCoins: (amount: number, source: string, allowOverdraft?: boolean) => boolean;
  buyDecoration: (id: string, cost: number) => boolean;
  toggleDecoration: (id: string) => void;
  buyPet: (id: string, cost: number) => boolean;
  togglePet: (id: string | null) => void;
  buyTransport: (id: string, cost: number) => boolean;
  setTransport: (id: 'walk' | 'horse-wagon' | 'forest-train' | 'hot-air-balloon') => void;
  buyEstate: (id: string, cost: number) => boolean;
  buyPass: (passId: string, cost: number) => boolean;
  buyPremiumPassport: (cost: number) => boolean;

  // Premium Actions
  buyGoldenCitizenPass: () => void;
  claimDailyGems: () => { success: boolean; amount: number; message: string };
  spendGems: (amount: number, source: string) => boolean;
  buyGemsWithRealMoney: (gemAmount: number, priceRupees: number) => void;
  buyPremiumEstate: (estateId: string) => void;
  buyBusinessLicense: (businessId: string) => void;
  brewRecipe: (name: string, base: string, infusion: string) => void;
  buyRaffleTicket: (cost: number) => boolean;
  drawRaffle: () => { success: boolean; reward: string; message: string };
}

export const createEconomySlice: StateCreator<
  TTStore,
  [],
  [],
  EconomySlice
> = (set, get) => ({
  coins: 0,
  coinHistory: [],
  ownedDecorations: [],
  equippedDecorations: [],
  ownedPets: [],
  equippedPet: null,
  activeTransport: 'horse-wagon',
  ownedTransports: ['horse-wagon'],
  ownedEstates: ['mossberry-cottage'],
  activePasses: [],
  premiumPassport: false,

  // Premium Init
  gems: 0,
  goldenCitizenPass: false,
  goldenCitizenPassExpiry: null,
  lastGemClaimDate: null,
  ownedBusinesses: [],
  breweryRecipes: [],
  raffleTickets: 0,
  lastRaffleDrawDate: null,

  addCoins: (amount, source) => {
    const tx: CoinTransaction = {
      id: Math.random().toString(36).slice(2),
      type: 'earned',
      amount,
      source,
      date: new Date().toISOString(),
    };
    set((s) => ({ coins: s.coins + amount, coinHistory: [tx, ...s.coinHistory] }));
    const s = get();
    if (s.user) saveUserState(s.user.uid, s);
  },

  spendCoins: (amount, source, allowOverdraft = false) => {
    if (!allowOverdraft && get().coins < amount) return false;
    const tx: CoinTransaction = {
      id: Math.random().toString(36).slice(2),
      type: 'spent',
      amount,
      source,
      date: new Date().toISOString(),
    };
    set((s) => ({ coins: s.coins - amount, coinHistory: [tx, ...s.coinHistory] }));
    const s = get();
    if (s.user) saveUserState(s.user.uid, s);
    return true;
  },

  buyDecoration: (id, cost) => {
    const s = get();
    if (s.coins < cost) return false;
    if (s.ownedDecorations.includes(id)) return false;
    if (s.spendCoins(cost, `Purchased Home Improvement: ${id}`)) {
      set((prev) => ({
        ownedDecorations: [...prev.ownedDecorations, id],
        equippedDecorations: [...prev.equippedDecorations, id], // auto-equip
      }));
      const state = get();
      if (state.user) saveUserState(state.user.uid, state);
      return true;
    }
    return false;
  },

  toggleDecoration: (id) => {
    set((s) => {
      const isEquipped = s.equippedDecorations.includes(id);
      const nextEquipped = isEquipped
        ? s.equippedDecorations.filter((d) => d !== id)
        : [...s.equippedDecorations, id];
      return { equippedDecorations: nextEquipped };
    });
    const state = get();
    if (state.user) saveUserState(state.user.uid, state);
  },

  buyPet: (id, cost) => {
    const s = get();
    if (s.coins < cost) return false;
    if (s.ownedPets.includes(id)) return false;
    if (s.spendCoins(cost, `Welcomed Companion: ${id}`)) {
      set((prev) => ({
        ownedPets: [...prev.ownedPets, id],
        equippedPet: id, // auto-equip
      }));
      const state = get();
      if (state.user) saveUserState(state.user.uid, state);
      return true;
    }
    return false;
  },

  togglePet: (id) => {
    set({ equippedPet: id });
    const state = get();
    if (state.user) saveUserState(state.user.uid, state);
  },

  buyTransport: (id, cost) => {
    const s = get();
    if (s.coins < cost) return false;
    if (s.ownedTransports.includes(id)) return false;
    if (s.spendCoins(cost, `Acquired Transport: ${id}`)) {
      set((prev) => ({
        ownedTransports: [...prev.ownedTransports, id],
        activeTransport: id as any,
      }));
      const state = get();
      if (state.user) saveUserState(state.user.uid, state);
      return true;
    }
    return false;
  },

  setTransport: (id) => {
    set({ activeTransport: id });
    const state = get();
    if (state.user) saveUserState(state.user.uid, state);
  },

  buyEstate: (id, cost) => {
    const s = get();
    if (s.coins < cost) return false;
    if (s.ownedEstates.includes(id)) return false;
    if (s.spendCoins(cost, `Acquired Estate Land: ${id}`)) {
      set((prev) => ({
        ownedEstates: [...prev.ownedEstates, id],
      }));
      const state = get();
      if (state.user) saveUserState(state.user.uid, state);
      return true;
    }
    return false;
  },

  buyPass: (passId, cost) => {
    const s = get();
    if (s.coins < cost) return false;
    if (s.activePasses.includes(passId)) return false;
    if (s.spendCoins(cost, `Acquired Festival Entry Permit: ${passId}`)) {
      set((prev) => ({
        activePasses: [...prev.activePasses, passId],
      }));
      const state = get();
      if (state.user) saveUserState(state.user.uid, state);
      return true;
    }
    return false;
  },

  buyPremiumPassport: (cost) => {
    const s = get();
    if (s.coins < cost) return false;
    if (s.premiumPassport) return false;
    if (s.spendCoins(cost, `Acquired Premium Passport Upgrade`)) {
      set({ premiumPassport: true });
      const state = get();
      if (state.user) saveUserState(state.user.uid, state);
      return true;
    }
    return false;
  },

  buyGoldenCitizenPass: () => {
    const s = get();
    const expiryDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
    const decorations = s.ownedDecorations.includes('midsummer-blossom-sofa') 
      ? s.ownedDecorations 
      : [...s.ownedDecorations, 'midsummer-blossom-sofa'];
    
    const welcomeMail = {
      id: 'golden-welcome-' + Math.random().toString(36).slice(2),
      from: 'County Registry Hall',
      subject: 'Golden Citizen Pass Activated! 👑',
      body: `Welcome to the elite! Your Golden Citizen Pass has been activated until ${new Date(expiryDate).toLocaleDateString()}. You have been credited +100 Gems welcome bonus! You now enjoy: Daily Gems, larger warehouse (150 slots), 1.5x XP Boost on all chores/tasks, free Theatre admission, access to the Private Monorail Cabin, and exclusive festival notices. Enjoy your stay in Ganache Grove!`,
      read: false,
      timestamp: new Date().toISOString()
    };

    set({
      goldenCitizenPass: true,
      goldenCitizenPassExpiry: expiryDate,
      gems: s.gems + 100,
      ownedDecorations: decorations,
      mailbox: [welcomeMail, ...s.mailbox]
    });

    const state = get();
    if (state.user) saveUserState(state.user.uid, state);
  },

  claimDailyGems: () => {
    const s = get();
    if (!s.goldenCitizenPass) return { success: false, amount: 0, message: 'Requires Golden Citizen Pass!' };
    
    const today = new Date().toDateString();
    if (s.lastGemClaimDate === today) {
      return { success: false, amount: 0, message: 'Already claimed today!' };
    }

    set({
      gems: s.gems + 20,
      lastGemClaimDate: today
    });

    const state = get();
    if (state.user) saveUserState(state.user.uid, state);
    return { success: true, amount: 20, message: 'Claimed +20 Gems!' };
  },

  spendGems: (amount, _source) => {
    const s = get();
    if (s.gems < amount) return false;
    set({ gems: s.gems - amount });
    const state = get();
    if (state.user) saveUserState(state.user.uid, state);
    return true;
  },

  buyGemsWithRealMoney: (gemAmount, _priceRupees) => {
    set((s) => ({ gems: s.gems + gemAmount }));
    const state = get();
    if (state.user) saveUserState(state.user.uid, state);
  },

  buyPremiumEstate: (estateId) => {
    const s = get();
    if (s.ownedEstates.includes(estateId)) return;
    set((prev) => ({
      ownedEstates: [...prev.ownedEstates, estateId]
    }));
    const state = get();
    if (state.user) saveUserState(state.user.uid, state);
  },

  buyBusinessLicense: (businessId) => {
    const s = get();
    if (s.ownedBusinesses.includes(businessId)) return;
    
    const welcomeMail = {
      id: 'brewery-welcome-' + Math.random().toString(36).slice(2),
      from: 'County Commerce Registry',
      subject: 'Business License Approved! 🍺',
      body: `Congratulations! Your commercial license for the Cozy Cocoa Brewery in Ganache Grove has been approved. You can now access your brewery deck from the cottage dashboard, brew custom beverages, name your recipes, and manage deliveries to local merchants. Here's to sweet success!`,
      read: false,
      timestamp: new Date().toISOString()
    };

    set((prev) => ({
      ownedBusinesses: [...prev.ownedBusinesses, businessId],
      mailbox: [welcomeMail, ...prev.mailbox]
    }));
    const state = get();
    if (state.user) saveUserState(state.user.uid, state);
  },

  brewRecipe: (name, base, infusion) => {
    const s = get();
    const existing = s.breweryRecipes.find(r => r.name.toLowerCase() === name.toLowerCase());
    
    const nextRecipes = existing
      ? s.breweryRecipes.map(r => r.name.toLowerCase() === name.toLowerCase() ? { ...r, brewedCount: r.brewedCount + 1 } : r)
      : [...s.breweryRecipes, { name, base, infusion, brewedCount: 1 }];

    set({
      breweryRecipes: nextRecipes
    });

    s.addCoins(60, `Brewed & Sold: ${name}`);
    s.addSkillXP('builder', 25);
    const state = get();
    if (state.user) saveUserState(state.user.uid, state);
  },

  buyRaffleTicket: (cost) => {
    const s = get();
    if (s.coins < cost) return false;
    if (s.spendCoins(cost, 'Purchased County Raffle Ticket')) {
      set((prev) => ({ raffleTickets: prev.raffleTickets + 1 }));
      const state = get();
      if (state.user) saveUserState(state.user.uid, state);
      return true;
    }
    return false;
  },

  drawRaffle: () => {
    const s = get();
    if (s.raffleTickets <= 0) return { success: false, reward: '', message: 'No tickets!' };
    
    const rewards = [
      { type: 'gems', amount: 15, msg: '15 Gems! 💎' },
      { type: 'coins', amount: 100, msg: '100 Cocoa Coins! 🪙' },
      { type: 'gems', amount: 30, msg: '30 Gems! 💎' },
      { type: 'coins', amount: 200, msg: '200 Cocoa Coins! 🪙' },
      { type: 'coins', amount: 150, msg: '150 Cocoa Coins! 🪙' },
    ];
    const drawn = rewards[Math.floor(Math.random() * rewards.length)];
    
    set((prev) => ({ 
      raffleTickets: prev.raffleTickets - 1, 
      lastRaffleDrawDate: new Date().toDateString() 
    }));

    if (drawn.type === 'gems') {
      set((prev) => ({ gems: prev.gems + drawn.amount }));
    } else {
      s.addCoins(drawn.amount, 'County Raffle Prize');
    }

    const nextState = get();
    if (nextState.user) saveUserState(nextState.user.uid, nextState);
    return { success: true, reward: drawn.type, message: `Draw Success! You won ${drawn.msg}` };
  }
});
