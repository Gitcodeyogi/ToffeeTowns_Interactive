import type { TalkCategory, GameContext, Page } from '../types';
import smartTalkData from '../quotes.json';

type SmartTalkData = {
  quotes: Record<TalkCategory, string[]>;
  gameTips: Record<GameContext, string[]>;
  pageQuotes: Partial<Record<Page, string[]>>;
};

const data = smartTalkData as SmartTalkData;

export const QUOTES: Record<TalkCategory, string[]> = data.quotes;
export const GAME_TIPS: Record<GameContext, string[]> = data.gameTips;
export const PAGE_QUOTES: Partial<Record<Page, string[]>> = data.pageQuotes;
