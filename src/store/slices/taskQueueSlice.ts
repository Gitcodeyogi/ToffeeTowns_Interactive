import type { StateCreator } from 'zustand';
import type { TTStore } from '../useTTStore';
import type { TaskItem, RewardItem, StampItem, TownId } from '../types';
import { saveUserState } from '../storeUtils';

export interface TaskQueueSlice {
  lastStampedDate: string | null;
  claimedStamps: StampItem[];
  taskQueue: TaskItem[];
  pendingRewards: RewardItem[];
  completedActions: string[];
  walkwayStatus: 'pending' | 'supported' | 'ignored';

  claimDailyStamp: (townId: string, icon: string, color: string) => void;
  addToQueue: (task: Omit<TaskItem, 'id' | 'startedAt'>) => void;
  cancelTask: (taskId: string) => void;
  resolveQueue: () => void;
  dismissReward: (id: string) => void;
  completeActionDirect: (actionId: string) => void;
}

export const createTaskQueueSlice: StateCreator<
  TTStore,
  [],
  [],
  TaskQueueSlice
> = (set, get) => ({
  lastStampedDate: null,
  claimedStamps: [],
  taskQueue: [],
  pendingRewards: [],
  completedActions: [],
  walkwayStatus: 'pending',

  claimDailyStamp: (townId, icon, color) => {
    const todayStr = new Date().toISOString().slice(0, 10);
    if (get().lastStampedDate === todayStr) return;
    const newStamp = { date: todayStr, townId, icon, color };
    set((s) => ({
      lastStampedDate: todayStr,
      claimedStamps: [...s.claimedStamps, newStamp],
      coins: s.coins + 20,
      skills: { ...s.skills, explorer: (s.skills.explorer || 0) + 10 }
    }));
    const s = get();
    s.addCoins(0, `Logged Daily Presence Stamp for ${townId}`); // to log transaction
    if (s.user) saveUserState(s.user.uid, s);
  },

  addToQueue: (task) => {
    const id = Math.random().toString(36).slice(2);
    const newTask: TaskItem = {
      ...task,
      id,
      startedAt: get().taskQueue.length === 0 ? Date.now() : null, // start immediately if first
    };
    set((s) => ({ taskQueue: [...s.taskQueue, newTask] }));
    const state = get();
    if (state.user) saveUserState(state.user.uid, state);
  },

  cancelTask: (taskId) => {
    const { taskQueue } = get();
    const updated = taskQueue.filter((t) => t.id !== taskId);
    if (updated.length > 0 && updated[0].startedAt === null) {
      updated[0].startedAt = Date.now();
    }
    set({ taskQueue: updated });
    const state = get();
    if (state.user) saveUserState(state.user.uid, state);
  },

  resolveQueue: () => {
    const { taskQueue } = get();
    if (taskQueue.length === 0) return;

    let now = Date.now();
    let updatedQueue = [...taskQueue];
    let rewardsToClaim: any[] = [];
    let queueChanged = false;
    let finalHomeTown: TownId | null = null;

    while (updatedQueue.length > 0) {
      let current = { ...updatedQueue[0] };
      if (current.startedAt === null) {
        current.startedAt = now;
        updatedQueue[0] = current;
        queueChanged = true;
      }

      const elapsed = now - current.startedAt;
      if (elapsed >= current.duration) {
        // Completed!
        rewardsToClaim.push({
          id: current.id,
          name: current.name,
          coins: current.rewardCoins,
          xp: current.rewardXP,
          xpCat: current.rewardXPCat,
          legacy: current.rewardLegacy,
          type: current.type,
          actionId: current.actionId,
        });

        if (current.destinationTownId) {
          finalHomeTown = current.destinationTownId as TownId;
        }

        const completedEndTime = current.startedAt + current.duration;
        updatedQueue.shift();
        queueChanged = true;

        // Start the next one at the completion time of this one
        if (updatedQueue.length > 0) {
          updatedQueue[0] = { ...updatedQueue[0], startedAt: completedEndTime };
        }
      } else {
        break;
      }
    }

    if (queueChanged || rewardsToClaim.length > 0) {
      set((s) => {
        let nextCoins = s.coins;
        let nextLegacy = s.legacyPoints;
        let nextSkills = { ...s.skills };
        let nextCoinHistory = [...s.coinHistory];
        let nextCompletedActions = [...s.completedActions];
        let nextWalkwayStatus = s.walkwayStatus;
        let nextEarnedBadges = [...s.earnedBadges];

        rewardsToClaim.forEach((r) => {
          // Apply premium passport modifier (50% bonus legacy)
          const bonusLegacy = s.premiumPassport ? Math.ceil(r.legacy * 1.5) : r.legacy;
          
          if (r.coins > 0) {
            nextCoins += r.coins;
            nextCoinHistory.unshift({
              id: Math.random().toString(36).slice(2),
              type: 'earned',
              amount: r.coins,
              source: `Finished: ${r.name}`,
              date: new Date().toISOString(),
            });
          }
          nextLegacy += bonusLegacy;
          if (r.xp > 0 && r.xpCat) {
            nextSkills[r.xpCat] = (nextSkills[r.xpCat] || 0) + r.xp;
          }
          if (r.actionId) {
            if (!nextCompletedActions.includes(r.actionId)) {
              nextCompletedActions.push(r.actionId);
            }
            if (r.actionId === 'walkway') {
              nextWalkwayStatus = 'supported';
            }
            if (r.actionId.startsWith('opportunity-0')) {
              const dayIndex = (new Date().getDate() % 10) + 1;
              let badgeId: number | null = null;
              if (dayIndex === 1 || dayIndex === 2) badgeId = 101;
              else if (dayIndex === 3 || dayIndex === 4) badgeId = 102;
              else if (dayIndex === 5 || dayIndex === 6) badgeId = 103;
              else if (dayIndex === 7 || dayIndex === 8) badgeId = 104;

              if (badgeId && !nextEarnedBadges.includes(badgeId)) {
                nextEarnedBadges.push(badgeId);
                const hasAllFour = [101, 102, 103, 104].every(b => nextEarnedBadges.includes(b));
                if (hasAllFour && !nextEarnedBadges.includes(105)) {
                  nextEarnedBadges.push(105);
                }
              }
            }
          }
        });

        const nextPendingRewards = [...s.pendingRewards, ...rewardsToClaim];
        const updates: any = {
          coins: nextCoins,
          legacyPoints: nextLegacy,
          skills: nextSkills,
          coinHistory: nextCoinHistory,
          taskQueue: updatedQueue,
          pendingRewards: nextPendingRewards,
          completedActions: nextCompletedActions,
          walkwayStatus: nextWalkwayStatus,
          earnedBadges: nextEarnedBadges,
        };

        if (finalHomeTown) {
          updates.homeTown = finalHomeTown;
        }

        return updates;
      });

      const state = get();
      if (state.user) saveUserState(state.user.uid, state);
    }
  },

  dismissReward: (id) => {
    set((s) => ({
      pendingRewards: s.pendingRewards.filter((r) => r.id !== id),
    }));
    const state = get();
    if (state.user) saveUserState(state.user.uid, state);
  },

  completeActionDirect: (actionId) => {
    set((s) => {
      if (s.completedActions.includes(actionId)) return {};
      const nextCompleted = [...s.completedActions, actionId];
      return { completedActions: nextCompleted };
    });
    const state = get();
    if (state.user) saveUserState(state.user.uid, state);
  },
});
