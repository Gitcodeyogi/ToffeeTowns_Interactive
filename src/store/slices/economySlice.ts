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
  activeTransport: 'walk',
  ownedTransports: ['walk'],
  ownedEstates: ['mossberry-cottage'],
  activePasses: [],
  premiumPassport: false,

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
});
