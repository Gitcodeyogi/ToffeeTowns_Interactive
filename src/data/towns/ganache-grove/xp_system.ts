/**
 * Ganache Grove - Official Imperial XP & Progression System Ledger
 * Registered under the Cocoawood County Registry
 * 
 * "Effort makes the Citizen, not clicks!"
 */

export interface RankDefinition {
  level: number;
  title: string;
  emoji: string;
  xpRequired: number;
  description: string;
  audienceFunFact: string;
}

export const GANACHE_GROVE_RANKS: RankDefinition[] = [
  {
    level: 1,
    title: "Probationer",
    emoji: "🏡",
    xpRequired: 0,
    description: "A newly arrived traveller learning the ways of Ganache Grove, mostly trying not to get stuck in the hot caramel mud pits.",
    audienceFunFact: "Currently has zero authority. Even the local sugarbirds refuse to take them seriously."
  },
  {
    level: 2,
    title: "Resident",
    emoji: "🌿",
    xpRequired: 1000,
    description: "Officially welcomed into the community. You get a key to a cottage on Mossberry Lane (latches may need tightening).",
    audienceFunFact: "You no longer require a visitor pass to breathe the forest spores, but you must still bow to the mayor's squirrel."
  },
  {
    level: 3,
    title: "Contributor",
    emoji: "🍃",
    xpRequired: 3000,
    description: "Known for helping with local projects and town activities, carrying heavy logs, and distributing clinic pamphlets.",
    audienceFunFact: "Congratulations! You have been promoted to a level where people will actually ask you to do their manual labor for free."
  },
  {
    level: 4,
    title: "Steward",
    emoji: "🌳",
    xpRequired: 6000,
    description: "Entrusted with caring for important community matters and keeping hyperactive squirrels away from the hemp ropes.",
    audienceFunFact: "You are now responsible for the environmental state of the grove. Don't let the gnomes pave it with chocolate slabs!"
  },
  {
    level: 5,
    title: "Benefactor",
    emoji: "🎁",
    xpRequired: 10000,
    description: "Actively improves the town through service, trade, and funding harvest festivals or chocolate river dredging.",
    audienceFunFact: "You are officially rich enough to sponsor gourmet cocoa tasting stands. The local gnomes now view you as a walking coin bag."
  },
  {
    level: 6,
    title: "Champion",
    emoji: "⭐",
    xpRequired: 15000,
    description: "Represents the very best of Ganache Grove and is recognized across the county as a leading chocolate advocate.",
    audienceFunFact: "You have won several forest debate cups and can officially speak squirrel at a high conversational level."
  },
  {
    level: 7,
    title: "Citizen",
    emoji: "👑",
    xpRequired: 21000,
    description: "A fully honored citizen whose name is remembered throughout the province. Prestige, manor upgrades, and respect await.",
    audienceFunFact: "You have completed the long road. You get a fancy forest manor, a permanent seat at the town hall, and gnomes will write songs about your legendary deeds."
  }
];

export interface ProfessionInfo {
  name: string;
  allowedFromLevel: number;
  description: string;
  funnyRequirement: string;
}

export const GANACHE_GROVE_CAREERS: ProfessionInfo[] = [
  {
    name: "Builder Apprentice",
    allowedFromLevel: 1,
    description: "Supports local path constructions and fixes broken fences.",
    funnyRequirement: "Must be able to carry three wet chocolate logs simultaneously without licking them."
  },
  {
    name: "Market Helper",
    allowedFromLevel: 1,
    description: "Sorts mossberry crates and checks daily molasses commodity prices.",
    funnyRequirement: "Must distinguish between sticky cocoa butter and regular garden mud by taste alone."
  },
  {
    name: "Explorer Assistant",
    allowedFromLevel: 1,
    description: "Assists rangers in tracking weird blue lights in the belfry.",
    funnyRequirement: "Must possess shoes that are 100% resistant to warm ganache drizzles."
  },
  {
    name: "Junior Reporter",
    allowedFromLevel: 1,
    description: "Interviews local residents and drafts short summaries for the Gazette.",
    funnyRequirement: "Capable of writing articles while being actively heckled by mischievous forest gnomes."
  }
];
