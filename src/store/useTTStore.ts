
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
import type { WorldTimeSlice } from './slices/worldTimeSlice';
import { createWorldTimeSlice } from './slices/worldTimeSlice';
import type { AppPage } from './types';

// Re-export all store types so that references elsewhere in the app don't break
export * from './types';
export { ENCOUNTERS_DATA } from './slices/encounterSlice';
export type { WorldTimePhase, WorldTimeInfo, AmbientKey } from './slices/worldTimeSlice';
export { deriveWorldTime, LOCATION_AMBIENT } from './slices/worldTimeSlice';

export interface TTStore
  extends AuthSlice,
    EconomySlice,
    ProgressionSlice,
    MissionsSlice,
    TaskQueueSlice,
    EncounterSlice,
    WorldTimeSlice {
  currentPage: AppPage;
  setPage: (page: AppPage) => void;
  currentLocation: string;
  setCurrentLocation: (loc: string) => void;
  showHelpModal: boolean;
  setShowHelpModal: (show: boolean) => void;
  activeHelpTab: string;
  setActiveHelpTab: (tab: string) => void;
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
  activeTimedEvent: any | null;
  setActiveTimedEvent: (event: any | null) => void;
  showRoadmapModal: boolean;
  setShowRoadmapModal: (show: boolean) => void;
  roadmapNPCData: any | null;
  setRoadmapNPCData: (data: any | null) => void;
  activeEventResult: string | null;
  setActiveEventResult: (result: string | null) => void;
  showTownGuide: boolean;
  setShowTownGuide: (show: boolean) => void;
  showDailyChores: boolean;
  setShowDailyChores: (show: boolean) => void;
  showTownTour: boolean;
  setShowTownTour: (show: boolean) => void;
  tourReadNewspaper: boolean;
  setTourReadNewspaper: (read: boolean) => void;
  tourChattedTownsfolk: boolean;
  setTourChattedTownsfolk: (chatted: boolean) => void;
  tourVisitedTheatre: boolean;
  setTourVisitedTheatre: (visited: boolean) => void;
}

export const useTTStore = create<TTStore>()(
  persist(
    (set, get, store) => {
      const devSet = (partial: any, replace?: boolean) => {
        let nextState = typeof partial === 'function' ? partial(get()) : partial;
        const currentName = get().travellerName || '';
        const email = get().user?.email || '';
        const isDev = currentName.toLowerCase().includes('yogesh') || 
                      email.toLowerCase().includes('yoges') || 
                      email.toLowerCase().includes('developer') ||
                      (typeof window !== 'undefined' && window.location.hostname === 'localhost');
        if (isDev && nextState && nextState.coins !== undefined && nextState.coins < 500) {
          nextState = { ...nextState, coins: 500 };
        }
        set(nextState, replace as any);
      };

      return {
        // Navigation
        currentPage: 'welcome',
        setPage: (page) => devSet({ currentPage: page }),
        currentLocation: 'home',
        setCurrentLocation: (loc) => devSet({ currentLocation: loc }),
        showHelpModal: false,
        setShowHelpModal: (show) => devSet({ showHelpModal: show }),
        activeHelpTab: 'home',
        setActiveHelpTab: (tab) => devSet({ activeHelpTab: tab }),
        isModalOpen: false,
        setIsModalOpen: (open) => devSet({ isModalOpen: open }),
        activeTimedEvent: null,
        setActiveTimedEvent: (event) => devSet({ activeTimedEvent: event, isModalOpen: !!event }),
        activeEventResult: null,
        setActiveEventResult: (result) => devSet({ activeEventResult: result, isModalOpen: !!result }),
        showRoadmapModal: false,
        setShowRoadmapModal: (show) => devSet({ showRoadmapModal: show, isModalOpen: show }),
        roadmapNPCData: null,
        setRoadmapNPCData: (data) => devSet({ roadmapNPCData: data }),
        showTownGuide: false,
        setShowTownGuide: (show) => devSet({ showTownGuide: show, isModalOpen: show }),
        showDailyChores: false,
        setShowDailyChores: (show) => devSet({ showDailyChores: show, isModalOpen: show }),
        showTownTour: false,
        setShowTownTour: (show) => devSet({ showTownTour: show, isModalOpen: show }),
        tourReadNewspaper: false,
        setTourReadNewspaper: (read) => devSet({ tourReadNewspaper: read }),
        tourChattedTownsfolk: false,
        setTourChattedTownsfolk: (chatted) => devSet({ tourChattedTownsfolk: chatted }),
        tourVisitedTheatre: false,
        setTourVisitedTheatre: (visited) => devSet({ tourVisitedTheatre: visited }),

        // Slices
        ...createAuthSlice(devSet, get, store),
        ...createEconomySlice(devSet, get, store),
        ...createProgressionSlice(devSet, get, store),
        ...createMissionsSlice(devSet, get, store),
        ...createTaskQueueSlice(devSet, get, store),
        ...createEncounterSlice(devSet, get, store),
        ...createWorldTimeSlice(devSet, get, store),
      };
    },
    { name: 'toffeetowns-store' }
  )
);

