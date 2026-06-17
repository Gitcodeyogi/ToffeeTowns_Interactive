/* eslint-disable prefer-const */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AuthSlice } from './slices/authSlice';
import { createAuthSlice } from './slices/authSlice';
import type { EconomySlice } from './slices/economySlice';
import { createEconomySlice } from './slices/economySlice';
import type { ProgressionSlice } from './slices/progressionSlice';
import { createProgressionSlice } from './slices/progressionSlice';
import type { MissionsSlice } from './slices/missionsSlice';
import { createMissionsSlice } from './slices/missionsSlice';
import type { TaskQueueSlice } from './slices/taskQueueSlice';
import { createTaskQueueSlice } from './slices/taskQueueSlice';
import type { EncounterSlice } from './slices/encounterSlice';
import { createEncounterSlice } from './slices/encounterSlice';
import type { AppPage } from './types';

// Re-export all store types so that references elsewhere in the app don't break
export * from './types';
export { ENCOUNTERS_DATA } from './slices/encounterSlice';

export interface TTStore
  extends AuthSlice,
    EconomySlice,
    ProgressionSlice,
    MissionsSlice,
    TaskQueueSlice,
    EncounterSlice {
  currentPage: AppPage;
  setPage: (page: AppPage) => void;
}

export const useTTStore = create<TTStore>()(
  persist(
    (set, get, store) => ({
      // Navigation
      currentPage: 'welcome',
      setPage: (page) => set({ currentPage: page }),

      // Slices
      ...createAuthSlice(set, get, store),
      ...createEconomySlice(set, get, store),
      ...createProgressionSlice(set, get, store),
      ...createMissionsSlice(set, get, store),
      ...createTaskQueueSlice(set, get, store),
      ...createEncounterSlice(set, get, store),
    }),
    { name: 'toffeetowns-store' }
  )
);
