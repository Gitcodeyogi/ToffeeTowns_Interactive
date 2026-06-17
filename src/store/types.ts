
export type AppPage =
  | 'welcome'
  | 'choose-town'
  | 'desk'
  | 'leaderboard'
  | 'coins'
  | 'characters'
  | 'badges'
  | 'cocoa-chat';

export type TownId =
  | 'toffee-town'
  | 'eclair-square'
  | 'peppermint-peak'
  | 'ganache-grove';

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
  destinationTownId?: string;
  encounterTriggered?: boolean;
  actionId?: string;
}

export interface RewardItem {
  id: string;
  name: string;
  coins: number;
  xp: number;
  xpCat: string;
  legacy: number;
  type: string;
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
