import type { StateCreator } from 'zustand';
import type { TTStore } from '../useTTStore';
import { saveUserState } from '../storeUtils';

export interface MissionsSlice {
  completedMissions: string[];
  completedSeriesSteps: string[];
  series1StartDate: string | null;
  storyDecisions: Record<string, string>;

  completeMission: (key: string, titleAward: string, badgeId: number) => void;
  completeSeriesStep: (stepId: string, choiceLabel?: string) => void;
  initSeries1: () => void;
}

export const createMissionsSlice: StateCreator<
  TTStore,
  [],
  [],
  MissionsSlice
> = (set, get) => ({
  completedMissions: [],
  completedSeriesSteps: [],
  series1StartDate: null,
  storyDecisions: {},

  completeMission: (key, titleAward, badgeId) => {
    const s = get();
    if (s.completedMissions.includes(key)) return;
    s.awardBadge(badgeId);
    s.addTitle(titleAward);
    s.addLegacy(50);
    set((st) => ({ completedMissions: [...st.completedMissions, key] }));
    const current = get();
    if (current.user) saveUserState(current.user.uid, current);
  },

  completeSeriesStep: (stepId, choiceLabel) => {
    set((s) => {
      const nextSteps = s.completedSeriesSteps.includes(stepId)
        ? s.completedSeriesSteps
        : [...s.completedSeriesSteps, stepId];
      const nextDecisions = choiceLabel
        ? { ...s.storyDecisions, [stepId]: choiceLabel }
        : s.storyDecisions;
      return { completedSeriesSteps: nextSteps, storyDecisions: nextDecisions };
    });
    const state = get();
    if (state.user) saveUserState(state.user.uid, state);
  },

  initSeries1: () => {
    const s = get();
    if (s.series1StartDate) return; // already set — don't overwrite
    const todayStr = new Date().toISOString().slice(0, 10);
    set({ series1StartDate: todayStr });
    const state = get();
    if (state.user) saveUserState(state.user.uid, state);
  },
});

