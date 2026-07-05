
export type AppPage =
  | 'welcome'
  | 'choose-town'
  | 'town-talk-entrance'
  | 'desk'
  | 'leaderboard'
  | 'coins'
  | 'characters'
  | 'badges'
  | 'pipkin-chat';

export type TownId =
  | 'toffee-town'
  | 'eclair-square'
  | 'peppermint-peak'
  | 'ganache-grove'
  | 'banoffee-valley';

export interface CoinTransaction {
  id: string;
  type: 'earned' | 'spent';
  amount: number;
  source: string;
  date: string;
}

export interface Badge {
  id: number;
  name: string;
  icon: string;
  description: string;
  category: 'Story' | 'Games' | 'Coins' | 'General';
}

export interface Mission {
  key: string;
  title: string;
  reqText: string;
  titleAward: string;
  badge: number;
  prof: string;
  req: Record<string, number>;
}

export interface TaskItem {
  id: string;
  name: string;
  type: 'travel' | 'work' | 'study';
  duration: number;
  startedAt: number | null;
  rewardCoins: number;
  rewardXP: number;
  rewardXPCat: string;
  rewardLegacy: number;
  icon: string;
  targetText: string;
  destinationSubPage?: string;
  originSubPage?: string;
  destinationTownId?: string;
  encounterTriggered?: boolean;
  actionId?: string;
  transitFare?: number;
  hasMiniGame?: boolean;
  dutyType?: string;
  frame?: string;
  profession?: string;
}

export interface RewardItem {
  id: string;
  name: string;
  coins: number;
  xp: number;
  xpCat: string;
  legacy: number;
  type: string;
  destinationSubPage?: string;
  originSubPage?: string;
  actionId?: string;
  transitFare?: number;
}

export interface CompletedDuty {
  name: string;
  profession: string;
  coins: number;
  xp: number;
  xpCat: string;
  legacy: number;
  location: string;
  timestamp: number;
}

export interface WorkdayArchiveEntry {
  dayNumber: number;
  dateStr: string;
  duties: CompletedDuty[];
  totalCoins: number;
  totalXP: Record<string, number>;
  totalLegacy: number;
  prosperityGain: number;
}

export interface StampItem {
  date: string;
  townId: string;
  icon: string;
  color: string;
}

export interface EncounterOption {
  label: string;
  outcomeText: string;
  coins?: number;
  xp?: number;
  xpCat?: string;
  legacy?: number;
}

export interface Encounter {
  id: string;
  title: string;
  text: string;
  options: EncounterOption[];
}
