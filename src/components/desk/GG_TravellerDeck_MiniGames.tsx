import React, { useState } from 'react';
import { useTTStore } from '../../store/useTTStore';
import { FONT, type SubPage } from '../../lib/uiConstants';
import { GG_TravellerDeck_Header } from './GG_TravellerDeck_Header';
import { OvenTimingGame } from '../minigames/OvenTimingGame';
import { AdventureWorld } from '../minigames/explorer/AdventureWorld';
import { MiniGameRouter } from '../minigames/MiniGameRouter';

// ── Types ─────────────────────────────────────────────────────────────────────

interface ArcadeGame {
  id: string;
  title: string;
  tagline: string;
  category: string;
  categoryIcon: string;
  categoryColor: string;
  venue: string;
  venueIcon: string;
  icon: string;
  coverGradient: string;
  difficulty: 'Relaxed' | 'Moderate' | 'Challenging';
  duration: string;
  skill: 'builder' | 'explorer' | 'healer';
  rewards: { coins: number; xp: number; legacy: number };
  badgeId: number;
  status: 'available' | 'coming-soon';
  instructions: { step: string; text: string }[];
  winCondition: string;
  failCondition: string;
  lore: string;
}

const ARCADE_GAMES: ArcadeGame[] = [
  {
    id: 'bakery',
    title: 'Oven Timing',
    tagline: 'Keep the town fed, one golden batch at a time.',
    category: 'Town Kitchen',
    categoryIcon: '🍳',
    categoryColor: 'amber',
    venue: "Chef Caramel's Bakery, Ganache Grove",
    venueIcon: '🏠',
    icon: '🥐',
    coverGradient: 'from-amber-900/60 via-orange-900/40 to-black/80',
    difficulty: 'Challenging',
    duration: '4 Minutes',
    skill: 'healer',
    rewards: { coins: 12, xp: 80, legacy: 8 },
    badgeId: 301,
    status: 'available',
    lore: "Manage the temperatures of multiple brick-fired ovens simultaneously. Pull out pastries exactly when the bake progress hits the golden sweet zone.",
    instructions: [
      { step: '1', text: 'Three ovens load automatically with town recipes. Each shows a required temperature.' },
      { step: '2', text: 'Use the −10° / −5° / +5° / +10° buttons to match the target temperature shown on each oven.' },
      { step: '3', text: 'Watch the baking progress bar. When it reaches the golden zone, pull out the tray.' },
      { step: '4', text: 'Avoid burning. Perfect temp + golden timing = best result.' },
    ],
    winCondition: 'Complete 7 items before the timer runs out.',
    failCondition: '3 burns OR timer runs out with fewer than 7 items completed.',
  },
  {
    id: 'sort',
    title: 'Pantry Sort Sprint',
    tagline: 'Sort the spices. Keep the kitchen moving.',
    category: 'Town Market',
    categoryIcon: '🏪',
    categoryColor: 'orange',
    venue: 'Mossberry Market Wharf, Ganache Grove',
    venueIcon: '🚢',
    icon: '📦',
    coverGradient: 'from-orange-950/60 via-amber-950/40 to-black/80',
    difficulty: 'Moderate',
    duration: '3 Minutes',
    skill: 'builder',
    rewards: { coins: 10, xp: 40, legacy: 2 },
    badgeId: 302,
    status: 'available',
    lore: "Match and shelf raw cooking materials, jars, and utensils into their proper shelf zones. Keep the kitchen organized before the timer runs out.",
    instructions: [
      { step: '1', text: 'Items appear at the center of the screen.' },
      { step: '2', text: 'Match the item types to their corresponding shelf categories.' },
      { step: '3', text: 'Fast sorting increases your score combo multiplier.' },
    ],
    winCondition: 'Sort 15 items correctly before the timer ends.',
    failCondition: 'Make 3 errors OR timer expires.',
  },
  {
    id: 'gear',
    title: 'Realign Mechanical Gears',
    tagline: 'Reconnect the cogs. Get the mill spinning.',
    category: 'Town Workshop',
    categoryIcon: '⚙️',
    categoryColor: 'cyan',
    venue: "Rowan's Clockwork Mill, Ganache Grove",
    venueIcon: '⚙️',
    icon: '⚙️',
    coverGradient: 'from-cyan-900/60 via-indigo-900/40 to-black/80',
    difficulty: 'Moderate',
    duration: '3 Minutes',
    skill: 'builder',
    rewards: { coins: 15, xp: 45, legacy: 3 },
    badgeId: 303,
    status: 'available',
    lore: "Arrange varying mechanical cogs on drive pegs to restore torque. Bridge the motor to the spindle and get the flour mill spinning again.",
    instructions: [
      { step: '1', text: 'Select cogs from the workbench tray.' },
      { step: '2', text: 'Place cogs onto pegs so their teeth interlock.' },
      { step: '3', text: 'Ensure the rotating gear connection matches the drive motor.' },
    ],
    winCondition: 'Bridge the drive system successfully in under 3 minutes.',
    failCondition: 'Timer runs out before cogs are fully connected.',
  },
  {
    id: 'wagon',
    title: 'Clear Wagon Path Obstacles',
    tagline: 'Remove boulders. Help wagons pass.',
    category: 'Town Logistics',
    categoryIcon: '🗺️',
    categoryColor: 'emerald',
    venue: 'Ganache Grove Transit Path',
    venueIcon: '📮',
    icon: '🚚',
    coverGradient: 'from-emerald-900/60 via-teal-900/40 to-black/80',
    difficulty: 'Relaxed',
    duration: '3 Minutes',
    skill: 'builder',
    rewards: { coins: 8, xp: 35, legacy: 2 },
    badgeId: 305,
    status: 'available',
    lore: "Help clear fallen trees, boulders, and debris blockages from the trade caravan tracks. Move obstacles into side slots so the wagon can pass.",
    instructions: [
      { step: '1', text: 'Tap path grid tiles to slide obstacles out of the main track.' },
      { step: '2', text: 'Clear a clean horizontal path for the horse wagon cargo.' },
      { step: '3', text: 'Plan steps ahead to avoid boxing yourself in.' },
    ],
    winCondition: 'Clear all blockages before the timer runs out.',
    failCondition: 'Timer expires with blocked lanes.',
  },
  {
    id: 'scaffolding',
    title: 'Stack Timber Scaffolding',
    tagline: 'Balance the planks. Secure the walkways.',
    category: 'Town Build',
    categoryIcon: '🏗️',
    categoryColor: 'amber',
    venue: 'Gossip Corner Walkways',
    venueIcon: '🪵',
    icon: '📐',
    coverGradient: 'from-yellow-950/60 via-orange-950/40 to-black/80',
    difficulty: 'Moderate',
    duration: '3 Minutes',
    skill: 'builder',
    rewards: { coins: 10, xp: 40, legacy: 3 },
    badgeId: 306,
    status: 'available',
    lore: "Stack sliding heavy cedar logs on top of each other to erect modular support scaffolds. Keep the center of gravity stable to avoid collapse.",
    instructions: [
      { step: '1', text: 'Watch the cedar beam slide side-to-side.' },
      { step: '2', text: 'Tap DROP to release the beam exactly above the stack.' },
      { step: '3', text: 'Maintain a vertical center of gravity to prevent collapse.' },
    ],
    winCondition: 'Erect a scaffolding tower of 10 blocks successfully.',
    failCondition: 'Tower collapses OR timer runs out.',
  },
  {
    id: 'boiler',
    title: 'Regulate Steam Boiler Pressure',
    tagline: 'Monitor steam levels. Vent the safety valves.',
    category: 'Town Heat',
    categoryIcon: '🌡️',
    categoryColor: 'rose',
    venue: 'Oakenhart Clinic Cellar',
    venueIcon: '⚕️',
    icon: '🌡️',
    coverGradient: 'from-red-950/60 via-rose-950/40 to-black/80',
    difficulty: 'Moderate',
    duration: '3 Minutes',
    skill: 'healer',
    rewards: { coins: 9, xp: 38, legacy: 2 },
    badgeId: 307,
    status: 'available',
    lore: "Monitor heating gauges in the Oakenhart clinic cellar. Adjust geothermal steam valves to keep the pressure needle inside the green safety zone.",
    instructions: [
      { step: '1', text: 'Tapping the valve release in single beats keeps the pressure needle steady.' },
      { step: '2', text: 'Do not hold the release down too long or the boiler will freeze.' },
      { step: '3', text: 'Keep the needle within the highlighted green range.' },
    ],
    winCondition: 'Maintain safety range for 60 seconds.',
    failCondition: 'Pressure goes completely out of safety bounds 3 times.',
  },
  {
    id: 'steam',
    title: 'Patch Pipe Steam Leaks',
    tagline: 'Locate vapor cracks. Seal the copper pipes.',
    category: 'Town Heat',
    categoryIcon: '🌡️',
    categoryColor: 'rose',
    venue: 'Apothecary Cellar Pipes',
    venueIcon: '⚕️',
    icon: '💨',
    coverGradient: 'from-rose-900/60 via-pink-900/40 to-black/80',
    difficulty: 'Challenging',
    duration: '3 Minutes',
    skill: 'healer',
    rewards: { coins: 10, xp: 40, legacy: 2 },
    badgeId: 308,
    status: 'available',
    lore: "Find and seal hot vapor cracks along the copper pipeline network. Tap high-pressure leaks quickly to restore flow to neighboring cabins.",
    instructions: [
      { step: '1', text: 'Pipes leak steam randomly.' },
      { step: '2', text: 'Tap leaking clouds to patch the seals.' },
      { step: '3', text: 'Prioritize red badges (level 4+) as they drain pressure twice as fast.' },
    ],
    winCondition: 'Patch 20 leaks before steam pressure bottoms out.',
    failCondition: 'Steam pressure bar hits 0.',
  },
  {
    id: 'monorail',
    title: 'Calibrate Monorail Signals',
    tagline: 'Align the switcher. Route the mail train.',
    category: 'Town Logistics',
    categoryIcon: '🚂',
    categoryColor: 'cyan',
    venue: 'Ganache Grove Post House',
    venueIcon: '📮',
    icon: '🚂',
    coverGradient: 'from-cyan-950/60 via-blue-950/40 to-black/80',
    difficulty: 'Moderate',
    duration: '3 Minutes',
    skill: 'explorer',
    rewards: { coins: 12, xp: 42, legacy: 3 },
    badgeId: 309,
    status: 'available',
    lore: "Connect signaling relays in matching color pathways. Rotate copper signal wires to restore connection routes for the express train.",
    instructions: [
      { step: '1', text: 'Tap junctions to rotate signals.' },
      { step: '2', text: 'Connect gold signal paths directly to active nodes.' },
      { step: '3', text: 'Complete the loop to enable train transit.' },
    ],
    winCondition: 'Re-align the tracks to complete 3 route loops.',
    failCondition: 'Timer expires.',
  },
  {
    id: 'bubble',
    title: 'Bubble Sort Garden',
    tagline: 'Pop the morning dewdrops in rainbow order.',
    category: 'Town Garden',
    categoryIcon: '🌿',
    categoryColor: 'emerald',
    venue: 'Mossberry Cottage Balcony',
    venueIcon: '🏡',
    icon: '🫧',
    coverGradient: 'from-teal-900/60 via-emerald-900/40 to-black/80',
    difficulty: 'Relaxed',
    duration: '3 Minutes',
    skill: 'healer',
    rewards: { coins: 8, xp: 35, legacy: 2 },
    badgeId: 310,
    status: 'available',
    lore: "Pop heavy morning mineral dewdrops blocking sunlight from reaching the moss orchids. Clear them in strict rainbow sequence (red to blue).",
    instructions: [
      { step: '1', text: 'Rainbow order is Red -> Orange -> Yellow -> Green -> Blue.' },
      { step: '2', text: 'Tap dewdrops in sequence. Hitting the wrong color resets the combo.' },
      { step: '3', text: 'Sort all dewdrops before the garden paths get wet.' },
    ],
    winCondition: 'Clear 3 full waves of dewdrops correctly.',
    failCondition: 'Make 3 errors OR timer expires.',
  },
  {
    id: 'sweep',
    title: 'Dust Bunny Sweep',
    tagline: 'Clear electrostatic lint. Keep cottage tidy.',
    category: 'Town Home',
    categoryIcon: '🏡',
    categoryColor: 'amber',
    venue: 'Cottage Living Room',
    venueIcon: '🏡',
    icon: '🧹',
    coverGradient: 'from-stone-900/60 via-amber-950/40 to-black/80',
    difficulty: 'Relaxed',
    duration: '3 Minutes',
    skill: 'explorer',
    rewards: { coins: 8, xp: 30, legacy: 2 },
    badgeId: 311,
    status: 'available',
    lore: "Clear static-charged dust bunnies drifting from the attic. Sweep them away with your broom cursor before they settle in living room corners.",
    instructions: [
      { step: '1', text: 'Bunnies drop from the top of the cottage.' },
      { step: '2', text: 'Tap/hover over bunnies with your cursor to sweep them.' },
      { step: '3', text: 'Focus on the screen borders where they fall faster.' },
    ],
    winCondition: 'Sweep 25 bunnies.',
    failCondition: 'Let 5 bunnies land.',
  },
  {
    id: 'plant',
    title: 'Balcony Plant Waterer',
    tagline: 'Monitor botanical levels. Water the orchids.',
    category: 'Town Garden',
    categoryIcon: '🌿',
    categoryColor: 'emerald',
    venue: 'Mossberry Cottage Balcony',
    venueIcon: '🏡',
    icon: '🌱',
    coverGradient: 'from-emerald-950/60 via-green-950/40 to-black/80',
    difficulty: 'Moderate',
    duration: '3 Minutes',
    skill: 'healer',
    rewards: { coins: 9, xp: 35, legacy: 2 },
    badgeId: 312,
    status: 'available',
    lore: "Keep moisture levels high across the drying canopy planters. Select and water the thirstiest orchids first to help them bloom before sunset.",
    instructions: [
      { step: '1', text: 'Orchids dry up at varying speeds.' },
      { step: '2', text: 'Water the thirstiest orchid first to maintain health.' },
      { step: '3', text: 'Perfect watering timing grants bonus points.' },
    ],
    winCondition: 'Maintain 5 orchids healthy for 90 seconds.',
    failCondition: 'Any orchid dries up completely.',
  },
  {
    id: 'herb',
    title: 'Herb Delivery Sorting',
    tagline: 'Medicinal forest herbs delivery program.',
    category: 'Town Apothecary',
    categoryIcon: '💊',
    categoryColor: 'rose',
    venue: 'Oakenhart Clinic Apothecary',
    venueIcon: '⚕️',
    icon: '🌿',
    coverGradient: 'from-rose-950/60 via-red-950/40 to-black/80',
    difficulty: 'Moderate',
    duration: '3 Minutes',
    skill: 'healer',
    rewards: { coins: 10, xp: 40, legacy: 2 },
    badgeId: 313,
    status: 'available',
    lore: "Classify emergency medical herbs enroute to Oakenhart Clinic. Sort Peppermint, Glowspore, and Sugar Lily into their correct remedy baskets.",
    instructions: [
      { step: '1', text: 'Read the active herb card\'s medicinal description.' },
      { step: '2', text: 'Assign it to Fever (🌡️), Cough (🫁), or Stress (🧘).' },
      { step: '3', text: 'Sort all 10 cards to complete the shipment cargo.' },
    ],
    winCondition: 'Sort all 10 herbs correctly.',
    failCondition: 'Lose 3 lives.',
  }
];

const SKILL_LABELS: Record<string, string> = {
  builder: 'Builder XP',
  explorer: 'Explorer XP',
  healer: 'Healer XP',
};

const DIFFICULTY_COLORS: Record<string, string> = {
  Relaxed: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/25',
  Moderate: 'text-amber-400 bg-amber-500/10 border-amber-500/25',
  Challenging: 'text-rose-400 bg-rose-500/10 border-rose-500/25',
};

interface GG_TravellerDeck_MiniGamesProps {
  setSubPage: (page: SubPage) => void;
  popPage: () => void;
  triggerFeedback: (msg: string) => void;
}

export const GG_TravellerDeck_MiniGames: React.FC<GG_TravellerDeck_MiniGamesProps> = ({
  setSubPage,
  popPage,
  triggerFeedback,
}) => {
  const { addCoins, addSkillXP, addLegacy, awardBadge, earnedBadges } = useTTStore();

  // Unified page state: 'categories' | 'category-list' | 'game-detail'
  const [hubState, setHubState] = useState<'categories' | 'category-list' | 'game-detail'>('categories');
  const [selectedCategory, setSelectedCategory] = useState<'healer' | 'builder' | 'explorer'>('healer');
  const [selectedId, setSelectedId] = useState<string>('bakery');
  const [activeGame, setActiveGame] = useState<string | null>(null);

  const selected = ARCADE_GAMES.find(g => g.id === selectedId) || ARCADE_GAMES[0];

  const handleGameSuccess = (game: ArcadeGame) => {
    setActiveGame(null);
    addCoins(game.rewards.coins, `Town Job: ${game.title}`);
    addSkillXP(game.skill, game.rewards.xp);
    addLegacy(game.rewards.legacy);
    awardBadge(game.badgeId);
    triggerFeedback(`Town job complete! +${game.rewards.coins} coins, +${game.rewards.xp} ${SKILL_LABELS[game.skill]}.`);
  };

  const handleGameFail = () => {
    setActiveGame(null);
    triggerFeedback('Shift ended. The town will need you to try again!');
  };

  // Active game play overlay
  if (activeGame) {
    const g = ARCADE_GAMES.find(x => x.id === activeGame)!;
    return (
      <MiniGameRouter
        taskName={g.title}
        skillCat={g.skill}
        dutyType={g.id}
        frame={g.skill === 'healer' ? 'copper' : g.skill === 'builder' ? 'wooden' : 'steel'}
        profession={g.skill}
        rewards={{ coins: g.rewards.coins, xp: g.rewards.xp, legacy: g.rewards.legacy, skill: g.skill }}
        onSuccess={() => handleGameSuccess(g)}
        onFail={handleGameFail}
      />
    );
  }

  // Filter games based on current selected category
  const categoryGames = ARCADE_GAMES.filter(g => g.skill === selectedCategory);

  // ── VIEW 1: CATEGORIES DASHBOARD ──
  if (hubState === 'categories') {
    return (
      <div className="w-full h-full flex flex-col justify-between">
        <GG_TravellerDeck_Header
          title="WELCOME TO THE GAMES STORE"
          setSubPage={setSubPage}
          popPage={popPage}
        />

        <div className="flex-grow flex flex-col justify-center px-8 py-6 select-none max-w-7xl mx-auto w-full">
          <div className="text-center mb-8 max-w-3xl mx-auto">
            {/* Header wave jumps */}
            <h3 className="text-2xl md:text-3xl font-brand text-yellow-300 uppercase tracking-widest leading-none drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)] flex items-center justify-center gap-1" style={{ fontFamily: FONT }}>
              {"ROLL UP YOUR SLEEVES, TRAVELER!".split(" ").map((word, wIdx) => (
                <span key={wIdx} className="inline-block whitespace-nowrap">
                  {word.split("").map((char, cIdx) => (
                    <span
                      key={cIdx}
                      className="inline-block hover:text-cyan-300 transition duration-150"
                      style={{
                        animation: `tt_jump 2.5s ease-in-out infinite`,
                        animationDelay: `${(wIdx * 5 + cIdx) * 0.08}s`
                      }}
                    >
                      {char}
                    </span>
                  ))}
                  &nbsp;
                </span>
              ))}
            </h3>
            
            {/* Hilarious companion subtitle */}
            <p className="text-xs md:text-sm text-neutral-250 leading-relaxed font-sans mt-3 px-4 drop-shadow">
              Welcome to the legendary Ganache Grove Arcade! The town council finally paid off the youth club's cabinet lease, 
              giving you full access to shifts that are <span className="text-cyan-300 font-bold">10% real work</span>, 
              <span className="text-rose-300 font-bold">90% panic-inducing fun</span>, and <span className="text-amber-300 font-bold">100% legal</span> (we checked the safety permits twice!). 
              Choose a career sector below to begin earning Cocoa Coins, leveling up, and dominating the local high scores!
            </p>
          </div>

          {/* 3 Categories Grid - MUCH Larger and Lovelier */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full items-stretch">
            
            {/* HEALER CARD */}
            <div 
              onClick={() => {
                setSelectedCategory('healer');
                setHubState('category-list');
              }}
              className="p-8 rounded-[2.5rem] border border-red-500/10 hover:border-red-500/40 bg-gradient-to-br from-[#3b121a]/60 via-[#1f070c]/85 to-[#0b0204]/95 hover:shadow-[0_0_40px_rgba(239,68,68,0.25)] cursor-pointer transform hover:-translate-y-2 hover:scale-[1.03] transition-all duration-300 text-center flex flex-col justify-between min-h-[46vh] relative group overflow-hidden"
            >
              {/* Decorative background glow */}
              <div className="absolute -top-12 -right-12 w-32 h-32 bg-red-500/10 rounded-full blur-3xl group-hover:bg-red-500/20 transition duration-300" />
              
              <div className="space-y-4">
                <span className="text-5xl block animate-bounce" style={{ animationDuration: '4s' }}>🩺</span>
                <h4 className="text-lg font-black uppercase tracking-wider text-red-300" style={{ fontFamily: FONT }}>
                  Health & Apothecary
                </h4>
                
                {/* Detailed high-level experience list */}
                <p className="text-[11.5px] text-white/60 leading-relaxed font-sans text-left bg-black/20 p-4 rounded-2xl border border-white/5">
                  Dive into high-precision operations, emergency sorting, and thermal calibration. Perfect for detail-oriented healers who enjoy juggling boiling test tubes, patching hot copper vapor pipelines, sorting clinic remedy herbs en route, and ensuring Chef Caramel's pastries don't turn into charcoal bricks!
                </p>

                <div className="flex flex-wrap gap-2 justify-center pt-2">
                  <span className="text-[9px] font-black uppercase tracking-wider bg-red-950/60 border border-red-900/30 text-red-300 px-2.5 py-1 rounded-full">
                    🧪 Temperature Control
                  </span>
                  <span className="text-[9px] font-black uppercase tracking-wider bg-red-950/60 border border-red-900/30 text-red-300 px-2.5 py-1 rounded-full">
                    🩹 Leak Patching
                  </span>
                  <span className="text-[9px] font-black uppercase tracking-wider bg-red-950/60 border border-red-900/30 text-red-300 px-2.5 py-1 rounded-full">
                    🌱 Moisture Timing
                  </span>
                </div>
              </div>

              <div className="mt-6 border-t border-red-950/60 pt-4 flex justify-between items-center text-left">
                <div>
                  <span className="text-[8px] uppercase tracking-wider text-red-400 font-bold block">Career Focus</span>
                  <span className="text-[10px] text-white/50 font-sans">Healer Experience & Baking badges</span>
                </div>
                <span className="text-[10.5px] font-black uppercase text-red-400 group-hover:translate-x-1.5 transition">
                  6 Games →
                </span>
              </div>
            </div>

            {/* BUILDER CARD */}
            <div 
              onClick={() => {
                setSelectedCategory('builder');
                setHubState('category-list');
              }}
              className="p-8 rounded-[2.5rem] border border-amber-500/10 hover:border-amber-500/40 bg-gradient-to-br from-[#3e2714]/60 via-[#231206]/85 to-[#0b0401]/95 hover:shadow-[0_0_40px_rgba(245,158,11,0.25)] cursor-pointer transform hover:-translate-y-2 hover:scale-[1.03] transition-all duration-300 text-center flex flex-col justify-between min-h-[46vh] relative group overflow-hidden"
            >
              {/* Decorative background glow */}
              <div className="absolute -top-12 -right-12 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl group-hover:bg-amber-500/20 transition duration-300" />
              
              <div className="space-y-4">
                <span className="text-5xl block animate-bounce" style={{ animationDuration: '4.5s' }}>🔨</span>
                <h4 className="text-lg font-black uppercase tracking-wider text-amber-300" style={{ fontFamily: FONT }}>
                  Workshop & Build
                </h4>
                
                {/* Detailed high-level experience list */}
                <p className="text-[11.5px] text-white/60 leading-relaxed font-sans text-left bg-black/20 p-4 rounded-2xl border border-white/5">
                  Unleash your inner mechanical architect with structural stacking, gears bridging, and logistics clearing. Arrange spinning brass drive cogs to restore clockwork flour mills, slide massive forest boulders off trade tracks, and drop heavy cedar scaffolding blocks with perfect center-of-gravity balance!
                </p>

                <div className="flex flex-wrap gap-2 justify-center pt-2">
                  <span className="text-[9px] font-black uppercase tracking-wider bg-amber-950/60 border border-amber-900/30 text-amber-300 px-2.5 py-1 rounded-full">
                    ⚙️ Cog Mechanics
                  </span>
                  <span className="text-[9px] font-black uppercase tracking-wider bg-amber-950/60 border border-amber-900/30 text-amber-300 px-2.5 py-1 rounded-full">
                    📐 Balance Stacking
                  </span>
                  <span className="text-[9px] font-black uppercase tracking-wider bg-amber-950/60 border border-amber-900/30 text-amber-300 px-2.5 py-1 rounded-full">
                    📦 Track Clearing
                  </span>
                </div>
              </div>

              <div className="mt-6 border-t border-amber-950/60 pt-4 flex justify-between items-center text-left">
                <div>
                  <span className="text-[8px] uppercase tracking-wider text-amber-400 font-bold block">Career Focus</span>
                  <span className="text-[10px] text-white/50 font-sans">Builder Experience & Heavy Duty badges</span>
                </div>
                <span className="text-[10.5px] font-black uppercase text-amber-400 group-hover:translate-x-1.5 transition">
                  4 Games →
                </span>
              </div>
            </div>

            {/* EXPLORER CARD */}
            <div 
              onClick={() => {
                setSelectedCategory('explorer');
                setHubState('category-list');
              }}
              className="p-8 rounded-[2.5rem] border border-cyan-500/10 hover:border-cyan-500/40 bg-gradient-to-br from-[#12313a]/60 via-[#0a1c22]/85 to-[#02090b]/95 hover:shadow-[0_0_40px_rgba(6,182,212,0.25)] cursor-pointer transform hover:-translate-y-2 hover:scale-[1.03] transition-all duration-300 text-center flex flex-col justify-between min-h-[46vh] relative group overflow-hidden"
            >
              {/* Decorative background glow */}
              <div className="absolute -top-12 -right-12 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl group-hover:bg-cyan-500/20 transition duration-300" />
              
              <div className="space-y-4">
                <span className="text-5xl block animate-bounce" style={{ animationDuration: '5s' }}>🧭</span>
                <h4 className="text-lg font-black uppercase tracking-wider text-cyan-300" style={{ fontFamily: FONT }}>
                  Logistics & Valley
                </h4>
                
                {/* Detailed high-level experience list */}
                <p className="text-[11.5px] text-white/60 leading-relaxed font-sans text-left bg-black/20 p-4 rounded-2xl border border-white/5">
                  Master town navigation, routing relays, and fast sweeping challenges. Reroute signal wires to keep the steam monorail trains running on time, chase static-charged dust bunnies around the cottage ceilings, and coordinate wilderness valley maps to forage rare forest mints en route.
                </p>

                <div className="flex flex-wrap gap-2 justify-center pt-2">
                  <span className="text-[9px] font-black uppercase tracking-wider bg-cyan-950/60 border border-cyan-900/30 text-cyan-300 px-2.5 py-1 rounded-full">
                    🚂 Signal Relays
                  </span>
                  <span className="text-[9px] font-black uppercase tracking-wider bg-cyan-950/60 border border-cyan-900/30 text-cyan-300 px-2.5 py-1 rounded-full">
                    🧹 Bunny Sweeping
                  </span>
                  <span className="text-[9px] font-black uppercase tracking-wider bg-cyan-950/60 border border-cyan-900/30 text-cyan-300 px-2.5 py-1 rounded-full">
                    🌲 Coordinates Exploration
                  </span>
                </div>
              </div>

              <div className="mt-6 border-t border-cyan-950/60 pt-4 flex justify-between items-center text-left">
                <div>
                  <span className="text-[8px] uppercase tracking-wider text-cyan-400 font-bold block">Career Focus</span>
                  <span className="text-[10px] text-white/50 font-sans">Explorer Experience & Transit badges</span>
                </div>
                <span className="text-[10.5px] font-black uppercase text-cyan-400 group-hover:translate-x-1.5 transition">
                  3 Games →
                </span>
              </div>
            </div>

          </div>

          {/* Direct Lists fallback action button */}
          <button
            onClick={() => setHubState('category-list')}
            className="mt-6 mx-auto px-10 py-3 rounded-full border border-white/10 hover:bg-white/5 text-[11px] text-white/70 font-black uppercase tracking-widest transition-all hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-2"
            style={{ fontFamily: '"Josefin Sans", sans-serif' }}
          >
            <span>🗂️</span> Browse Raw Job Archives
          </button>
        </div>
      </div>
    );
  }

  // ── VIEW 2: CATEGORY LISTING BOARD ──
  if (hubState === 'category-list') {
    return (
      <div className="w-full h-full flex flex-col justify-between">
        <GG_TravellerDeck_Header
          title={`${selectedCategory.toUpperCase()} GAMES`}
          setSubPage={setSubPage}
          popPage={popPage}
        />

        <div className="flex-grow p-8 select-none flex flex-col justify-between overflow-hidden">
          <div className="flex items-center justify-between mb-4 shrink-0">
            <button
              onClick={() => setHubState('categories')}
              className="px-5 py-2 bg-white/5 border border-white/8 hover:bg-white/10 text-white rounded-xl text-[10.5px] font-black uppercase tracking-wider transition cursor-pointer"
              style={{ fontFamily: '"Josefin Sans", sans-serif' }}
            >
              ← Back to Sectors
            </button>
            <span className="text-[10px] font-mono text-neutral-450 uppercase tracking-widest">
              Ganache Grove Arcade Cabinet
            </span>
          </div>

          {/* Spacious Listing Grid */}
          <div className="flex-grow overflow-y-auto custom-scrollbar pr-2 grid grid-cols-1 md:grid-cols-2 gap-5 items-start min-h-0">
            {categoryGames.map(game => {
              const badgeEarned = earnedBadges.includes(game.badgeId);
              return (
                <div
                  key={game.id}
                  onClick={() => {
                    setSelectedId(game.id);
                    setHubState('game-detail');
                  }}
                  className="group flex items-start gap-4 p-5 rounded-[1.8rem] bg-neutral-950/45 border border-white/5 hover:border-white/15 hover:bg-white/3 transition duration-300 transform hover:scale-[1.01] cursor-pointer"
                >
                  <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/8 flex items-center justify-center text-3xl shrink-0 group-hover:scale-105 transition">
                    {game.icon}
                  </div>
                  <div className="flex-grow min-w-0 text-left font-sans">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-xs font-black uppercase text-white tracking-wider">
                        {game.title}
                      </h4>
                      {badgeEarned && <span className="text-xs text-amber-300">★</span>}
                    </div>
                    <p className="text-[10.5px] text-white/50 mt-1 leading-normal italic">
                      "{game.lore.length > 80 ? game.lore.substring(0, 80) + '...' : game.lore}"
                    </p>
                    <div className="flex gap-2 mt-3 items-center">
                      <span className={`text-[8px] uppercase font-black px-2 py-0.5 rounded border ${DIFFICULTY_COLORS[game.difficulty]}`}>
                        {game.difficulty}
                      </span>
                      <span className="text-[9px] text-neutral-400 bg-white/5 px-2 py-0.5 rounded border border-white/5">
                        ⏱ {game.duration}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // ── VIEW 3: GAME DETAIL SHEET ──
  return (
    <div className="w-full h-full flex flex-col justify-between">
      <GG_TravellerDeck_Header
        title={selected.title.toUpperCase()}
        setSubPage={setSubPage}
        popPage={popPage}
      />

      <div className="flex-grow p-8 select-none flex flex-col justify-between overflow-hidden">
        
        {/* Navigation control */}
        <div className="flex items-center justify-between mb-4 shrink-0">
          <button
            onClick={() => setHubState('category-list')}
            className="px-5 py-2 bg-white/5 border border-white/8 hover:bg-white/10 text-white rounded-xl text-[10.5px] font-black uppercase tracking-wider transition cursor-pointer"
            style={{ fontFamily: '"Josefin Sans", sans-serif' }}
          >
            ← Back to Games
          </button>
          <span className="text-[10px] font-mono text-neutral-450 uppercase tracking-widest">
            {selected.category}
          </span>
        </div>

        {/* Spacious detail pane */}
        <div className="flex-grow overflow-y-auto pr-2 custom-scrollbar min-h-0 grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6 items-start">
          
          {/* Left panel: Lore + Instructions */}
          <div className="space-y-6 text-left">
            <div className="p-5 rounded-[2rem] bg-white/3 border border-white/8 space-y-2">
              <span className="text-[9px] font-black uppercase tracking-widest text-amber-400/80 block">Town Bulletin</span>
              <p className="text-xs text-white/70 leading-relaxed font-sans italic">
                "{selected.lore}"
              </p>
            </div>

            <div className="space-y-3.5">
              <span className="text-[9px] font-black uppercase tracking-widest text-cyan-400/80 block">How to Play</span>
              <div className="space-y-2.5">
                {selected.instructions.map((inst, i) => (
                  <div key={i} className="flex gap-3 items-start">
                    <div className="w-6 h-6 rounded-full bg-white/5 border border-white/8 flex items-center justify-center shrink-0 mt-0.5">
                      <span className="text-[10.5px] font-black text-white/50">{inst.step}</span>
                    </div>
                    <p className="text-[11.5px] text-white/60 leading-relaxed pt-0.5 font-sans">
                      {inst.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-emerald-950/20 border border-emerald-500/20 rounded-2xl space-y-1">
                <span className="text-[9px] font-black uppercase tracking-wider text-emerald-400 block">Victory Condition</span>
                <p className="text-[11px] text-white/60 font-sans leading-relaxed">{selected.winCondition}</p>
              </div>
              <div className="p-4 bg-rose-950/20 border border-rose-500/20 rounded-2xl space-y-1">
                <span className="text-[9px] font-black uppercase tracking-wider text-rose-400 block">Failure Condition</span>
                <p className="text-[11px] text-white/60 font-sans leading-relaxed">{selected.failCondition}</p>
              </div>
            </div>
          </div>

          {/* Right panel: Rewards & Start Shift Action */}
          <div className="space-y-4">
            
            {/* Rewards card */}
            <div className="bg-black/25 border border-white/10 rounded-3xl p-5 space-y-4 text-left">
              <span className="text-[9px] uppercase tracking-wider text-white/45 font-black block">Shift Rewards</span>
              
              <div className={`rounded-2xl p-px bg-gradient-to-br ${
                selected.skill === 'healer'   ? 'from-rose-500 to-pink-700' :
                selected.skill === 'builder'  ? 'from-orange-500 to-amber-700' :
                'from-cyan-500 to-teal-700'
              }`}>
                <div className="rounded-2xl bg-neutral-950/95 p-4 space-y-2.5">
                  <div className="flex justify-between items-center font-sans">
                    <span className="text-[10px] text-white/45 uppercase font-black">Cocoa Coins</span>
                    <span className="text-base font-black text-amber-300 font-mono">+{selected.rewards.coins} 🪙</span>
                  </div>
                  <div className="flex justify-between items-center font-sans">
                    <span className="text-[10px] text-white/45 uppercase font-black">{SKILL_LABELS[selected.skill]}</span>
                    <span className={`text-base font-black font-mono ${
                      selected.skill === 'healer' ? 'text-rose-300' :
                      selected.skill === 'builder' ? 'text-orange-300' : 'text-cyan-300'
                    }`}>+{selected.rewards.xp}</span>
                  </div>
                  <div className="flex justify-between items-center font-sans">
                    <span className="text-[10px] text-white/45 uppercase font-black">Legacy Points</span>
                    <span className="text-base font-black text-purple-300 font-mono">+{selected.rewards.legacy}</span>
                  </div>
                </div>
              </div>

              {/* Badge lock status */}
              <div className="flex items-center gap-3 p-3 bg-white/4 border border-white/8 rounded-xl">
                <span className="text-2xl">{earnedBadges.includes(selected.badgeId) ? '🏅' : '🔒'}</span>
                <div>
                  <p className="text-[9px] uppercase tracking-wider text-white/35 font-black">Town Job Badge</p>
                  <p className={`text-[10px] font-black mt-0.5 ${
                    earnedBadges.includes(selected.badgeId) ? 'text-amber-300' : 'text-white/30'
                  }`}>
                    {earnedBadges.includes(selected.badgeId) ? '★ Badge Earned' : `Badge #${selected.badgeId} — Locked`}
                  </p>
                </div>
              </div>
            </div>

            {/* Launch button */}
            <button
              onClick={() => setActiveGame(selected.id)}
              className="w-full py-4 rounded-2xl font-brand font-black uppercase tracking-wider text-sm bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-black hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-[0_0_24px_rgba(251,191,36,0.3)] hover:shadow-[0_0_36px_rgba(251,191,36,0.45)] cursor-pointer"
              style={{ fontFamily: FONT }}
            >
              🧤 Start Shift — {selected.title}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
