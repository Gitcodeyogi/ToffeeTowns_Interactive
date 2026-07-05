import type { StateCreator } from 'zustand';
import type { TTStore } from '../useTTStore';
import type { TaskItem, RewardItem, StampItem, TownId, CompletedDuty, WorkdayArchiveEntry } from '../types';
import { saveUserState } from '../storeUtils';
import { updateResidentJournal } from '../../utils/journalHelper';

export interface TaskQueueSlice {
  lastStampedDate: string | null;
  claimedStamps: StampItem[];
  taskQueue: TaskItem[];
  pendingRewards: RewardItem[];
  completedActions: string[];
  walkwayStatus: 'pending' | 'supported' | 'ignored';
  completedDutiesToday: CompletedDuty[];
  workdayArchive: WorkdayArchiveEntry[];
  sleepAndCompleteWorkday: () => void;

  // Residency Task Flow States
  activeResidencyTask: {
    workTask: Omit<TaskItem, 'id' | 'startedAt'>;
    travelTask?: Omit<TaskItem, 'id' | 'startedAt'>;
    startDeductions?: {
      coins: number;
      inventory: Record<string, number>;
    };
    hintPaid: boolean;
    riddleSolved: boolean;
  } | null;
  residencyTaskStage: 'pre-start' | 'progress' | 'completed' | 'failed' | null;

  claimDailyStamp: (townId: string, icon: string, color: string) => void;
  addToQueue: (task: Omit<TaskItem, 'id' | 'startedAt'>) => void;
  cancelTask: (taskId: string) => void;
  resolveQueue: () => void;
  dismissReward: (id: string) => void;
  completeActionDirect: (actionId: string) => void;
  speedUpTask: (taskId: string, amountMs: number) => void;

  // Residency Task Actions
  startResidencyTaskFlow: (taskFlow: {
    workTask: Omit<TaskItem, 'id' | 'startedAt'>;
    travelTask?: Omit<TaskItem, 'id' | 'startedAt'>;
    startDeductions?: {
      coins: number;
      inventory: Record<string, number>;
    };
  }) => void;
  payResidencyTaskHint: () => void;
  beginResidencyTask: () => void;
  solveResidencyTaskRiddle: () => void;
  failResidencyTask: () => void;
  dismissResidencyTaskModal: () => void;
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
  completedDutiesToday: [],
  workdayArchive: [],
  activeResidencyTask: null,
  residencyTaskStage: null,

  sleepAndCompleteWorkday: () => {
    const s = get();
    const duties = s.completedDutiesToday;
    if (duties.length === 0) return;

    const totalCoins = duties.reduce((acc, d) => acc + d.coins, 0);
    const totalLegacy = duties.reduce((acc, d) => acc + d.legacy, 0);
    
    // Group XP by category
    const totalXP: Record<string, number> = {};
    duties.forEach(d => {
      if (d.xp > 0 && d.xpCat) {
        totalXP[d.xpCat] = (totalXP[d.xpCat] || 0) + d.xp;
      }
    });

    const dayNumber = s.workdayArchive.length + 1;
    
    // Use local time for the calendar entry date string
    const dateStr = new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });

    // Prosperity is +1.5% per duty, max +10%
    const prosperityGain = Math.min(10, Number((duties.length * 1.5).toFixed(1)));

    const newArchiveEntry: WorkdayArchiveEntry = {
      dayNumber,
      dateStr,
      duties,
      totalCoins,
      totalXP,
      totalLegacy,
      prosperityGain
    };

    // Award bonus legacy points (+10 standing points for completing the day!)
    const nextLegacy = s.legacyPoints + 10;

    set(state => ({
      completedDutiesToday: [],
      workdayArchive: [...state.workdayArchive, newArchiveEntry],
      legacyPoints: nextLegacy
    }));

    const nextState = get();
    if (nextState.user) saveUserState(nextState.user.uid, nextState);
  },

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
    
    updateResidentJournal('stamp', {
      coins: 20,
      legacy: 0,
      phaseName: 'Daily Stamp',
      description: `Logged daily presence in ${townId.replace('-', ' ').replace(/\b\w/g, (c) => c.toUpperCase())}`
    });

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

    const now = Date.now();
    const updatedQueue = [...taskQueue];
    const rewardsToClaim: any[] = [];
    let queueChanged = false;
    let finalHomeTown: TownId | null = null;

    while (updatedQueue.length > 0) {
      const current = { ...updatedQueue[0] };
      if (current.startedAt === null) {
        current.startedAt = now;
        updatedQueue[0] = current;
        queueChanged = true;
      }

      const elapsed = now - current.startedAt;
      if (elapsed >= current.duration) {
        // Prevent auto-completion of work/study tasks unless solved
        if ((current.type === 'work' || current.type === 'study') && !get().activeResidencyTask?.riddleSolved) {
          break;
        }
        rewardsToClaim.push({
          id: current.id,
          name: current.name,
          coins: current.rewardCoins,
          xp: current.rewardXP,
          xpCat: current.rewardXPCat,
          legacy: current.rewardLegacy,
          type: current.type,
          actionId: current.actionId,
          destinationSubPage: current.destinationSubPage,
          originSubPage: current.originSubPage,
          transitFare: current.transitFare,
          targetText: current.targetText,
          profession: current.profession,
          dutyType: current.dutyType,
          frame: current.frame,
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
        const nextSkills = { ...s.skills };
        const nextCoinHistory = [...s.coinHistory];
        const nextCompletedActions = [...s.completedActions];
        let nextWalkwayStatus = s.walkwayStatus;
        const nextEarnedBadges = [...s.earnedBadges];
        let nextLocation = s.currentLocation || 'home';
        const nextCompletedDutiesToday = [...s.completedDutiesToday];

        rewardsToClaim.forEach((r) => {
          // Apply premium passport modifier (50% bonus legacy)
          const bonusLegacy = s.premiumPassport ? Math.ceil(r.legacy * 1.5) : r.legacy;

          if (r.type === 'work' || r.type === 'study') {
            const duty: CompletedDuty = {
              name: r.name,
              profession: (r as any).profession || 'general',
              coins: r.coins,
              xp: r.xp,
              xpCat: r.xpCat || 'general',
              legacy: bonusLegacy,
              location: (r as any).targetText || 'Ganache Grove',
              timestamp: Date.now()
            };
            nextCompletedDutiesToday.push(duty);
          }
          
          if (r.destinationSubPage) {
            nextLocation = r.destinationSubPage;
          }
          
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
          currentLocation: nextLocation,
          completedDutiesToday: nextCompletedDutiesToday,
        };

        if (finalHomeTown) {
          updates.homeTown = finalHomeTown;
        }

        return updates;
      });

      // Log completed dispatches
      rewardsToClaim.forEach((r) => {
        const s = get();
        const bonusLegacy = s.premiumPassport ? Math.ceil(r.legacy * 1.5) : r.legacy;
        updateResidentJournal('dispatch', {
          coins: r.coins,
          legacy: bonusLegacy,
          phaseName: `Dispatch: ${r.name}`,
          description: `Successfully completed the dispatch "${r.name}"`
        });
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

  speedUpTask: (taskId, amountMs) => {
    set((s) => {
      const updatedQueue = s.taskQueue.map((t) => {
        if (t.id === taskId) {
          const nextStartedAt = t.startedAt !== null ? t.startedAt - amountMs : null;
          return { ...t, startedAt: nextStartedAt };
        }
        return t;
      });
      return { taskQueue: updatedQueue };
    });
    get().resolveQueue();
  },

  startResidencyTaskFlow: (taskFlow) => {
    set({
      activeResidencyTask: {
        ...taskFlow,
        hintPaid: false,
        riddleSolved: false,
      },
      residencyTaskStage: 'pre-start',
    });
  },

  payResidencyTaskHint: () => {
    const s = get();
    if (!s.activeResidencyTask || s.activeResidencyTask.hintPaid) return;
    if (s.coins < 5) return;
    s.spendCoins(5, `Hint purchased for task: ${s.activeResidencyTask.workTask.name}`);
    set((state) => ({
      activeResidencyTask: state.activeResidencyTask ? {
        ...state.activeResidencyTask,
        hintPaid: true
      } : null
    }));
    const nextState = get();
    if (nextState.user) saveUserState(nextState.user.uid, nextState);
  },

  beginResidencyTask: () => {
    const s = get();
    const taskFlow = s.activeResidencyTask;
    if (!taskFlow) return;

    // Apply start deductions (coins only at store level)
    if (taskFlow.startDeductions) {
      const { coins: costCoins } = taskFlow.startDeductions;
      if (costCoins > 0) {
        s.spendCoins(costCoins, `Funded residency task: ${taskFlow.workTask.name}`);
      }
    }

    // Queue travel task if present
    if (taskFlow.travelTask) {
      s.addToQueue(taskFlow.travelTask);
    }
    // Queue work/study task
    s.addToQueue(taskFlow.workTask);

    // If there is travel, modal closes while traveling
    if (taskFlow.travelTask) {
      set({ residencyTaskStage: null });
    } else {
      set({ residencyTaskStage: 'progress' });
    }
    const nextState = get();
    if (nextState.user) saveUserState(nextState.user.uid, nextState);
  },

  solveResidencyTaskRiddle: () => {
    const s = get();
    const taskFlow = s.activeResidencyTask;
    if (!taskFlow) return;

    // Mark solved in state first
    set((state) => ({
      activeResidencyTask: state.activeResidencyTask ? {
        ...state.activeResidencyTask,
        riddleSolved: true
      } : null
    }));

    // Find active task in queue (which should be the work/study task at index 0)
    const active = s.taskQueue[0];
    if (active && (active.type === 'work' || active.type === 'study')) {
      // Speed up task duration to complete immediately
      s.speedUpTask(active.id, active.duration);
    }

    set({ residencyTaskStage: 'completed' });
    const nextState = get();
    if (nextState.user) saveUserState(nextState.user.uid, nextState);
  },

  failResidencyTask: () => {
    const s = get();
    const taskFlow = s.activeResidencyTask;
    if (!taskFlow) return;

    const xpCat = taskFlow.workTask.rewardXPCat;
    set((state) => {
      const nextSkills = { ...state.skills };
      if (xpCat) {
        nextSkills[xpCat] = Math.max(0, (nextSkills[xpCat] || 0) - 10);
      }
      return {
        coins: Math.max(0, state.coins - 10),
        skills: nextSkills,
      };
    });

    s.addCoins(0, `Penalty: -10 Coins and -10 XP for task failure: ${taskFlow.workTask.name}`); // log transaction

    // Cancel the active task (removes from queue)
    const active = s.taskQueue[0];
    if (active && (active.type === 'work' || active.type === 'study')) {
      s.cancelTask(active.id);
    }

    set({ residencyTaskStage: 'failed' });
    const nextState = get();
    if (nextState.user) saveUserState(nextState.user.uid, nextState);
  },

  dismissResidencyTaskModal: () => {
    const s = get();
    const taskFlow = s.activeResidencyTask;
    if (taskFlow) {
      const reward = s.pendingRewards.find(r => r.name === taskFlow.workTask.name);
      if (reward) {
        s.dismissReward(reward.id);
      }
    }
    set({
      activeResidencyTask: null,
      residencyTaskStage: null,
    });
    const nextState = get();
    if (nextState.user) saveUserState(nextState.user.uid, nextState);
  },
});
