
// MiniGameRouter.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Orchestrates the full 5-stage mini-game flow:
//   1. Briefing Screen (Page 1) — Task summary, rewards, learn choice
//   2. Gamified Intro (Page 2) — Companion dialog introducing gameplay
//   3. Play Instructions (Page 3) — Pre-game rules & XP tiers
//   4. Gameplay Screen (Page 4) — Active game (30% Sidebar / 70% Play area)
//      - standard glass panels reaching to edges
//      - large Score & countdown Timer at top of left pane
//      - game expands to full 70% play area
//      - Nicer confirmation card overlay when attempting to close or quit
//   5. PostGameScreen (Page 5) — Companion debrief & results
// ─────────────────────────────────────────────────────────────────────────────
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useTTStore } from '../../store/useTTStore';
import { OvenTimingGame } from './OvenTimingGame';
import { AdventureWorld } from './explorer/AdventureWorld';
import { GearGame } from './builder/GearGame';
import { ScaffoldingGame } from './builder/ScaffoldingGame';
import { BoilerGame } from './builder/BoilerGame';
import { ThreeGearWorkbench } from './builder/ThreeGearWorkbench';
import { SteamGame } from './clinic/SteamGame';
import { HerbDeliveryGame } from './clinic/HerbDeliveryGame';
import { HerbDeliveryGameL2 } from './clinic/HerbDeliveryGameL2';
import { WagonGame } from './caravan/WagonGame';
import { MonorailGame } from './caravan/MonorailGame';
import { BubbleGame } from './cottage/BubbleGame';
import { SweepGame } from './cottage/SweepGame';
import { PlantGame } from './cottage/PlantGame';
import { SortGame } from './cottage/SortGame';
import { SkeuomorphicFrame, type SkeuomorphicTheme } from './shared/SkeuomorphicFrame';
import { PreGameScreen, PREGAME_CONFIGS, HERBS_BY_CAT, DIAGNOSTICS } from './shared/PreGameScreen';
import { PostGameScreen, type GameResult } from './shared/PostGameScreen';
import { LuckyMomentOverlay, type LuckyReward } from './shared/LuckyMoment';

interface AccordionItemProps {
  id: string;
  title: string;
  icon: string;
  activeId: string | null;
  onToggle: (id: string | null) => void;
  children: React.ReactNode;
  color?: string;
}

const AccordionItem: React.FC<AccordionItemProps> = ({ id, title, icon, activeId, onToggle, children, color }) => {
  const isOpen = activeId === id;
  return (
    <div className="border border-white/10 rounded-2xl overflow-hidden bg-neutral-900/60 shadow-md transition-all duration-300">
      <button
        onClick={() => onToggle(isOpen ? null : id)}
        className="w-full px-4 py-2.5 flex items-center justify-between bg-black/40 hover:bg-black/60 transition-colors border-b border-white/5 text-left cursor-pointer"
      >
        <div className="flex items-center gap-2 select-none pointer-events-none">
          <span className="text-sm">{icon}</span>
          <span
            style={{
              fontFamily: "'Fredoka One', cursive",
              color: color || '#fbbf24',
              textShadow: '0 1.5px 4px rgba(0,0,0,0.85)',
              fontSize: '0.95rem',
              fontWeight: 400,
            }}
          >
            {title}
          </span>
        </div>
        <span className="text-white/60 text-[9px] transform transition-transform duration-200" style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>
          ▼
        </span>
      </button>
      <div
        className={`transition-all duration-300 ease-in-out overflow-hidden ${
          isOpen ? 'max-h-[300px] opacity-100 p-3' : 'max-h-0 opacity-0 p-0'
        } bg-neutral-950/20`}
      >
        {children}
      </div>
    </div>
  );
};

// ── Types ────────────────────────────────────────────────────────────────────
interface MiniGameRouterProps {
  taskName: string;
  skillCat: string;
  dutyType?: string;
  frame?: string;
  profession?: string;
  rewards: { coins: number; xp: number; legacy: number; skill: string; };
  onSuccess: () => void;
  onFail: () => void;
}

type Stage = 'briefing' | 'intro' | 'pregame' | 'playing' | 'theend' | 'postgame';

// ── Duty → display title map ─────────────────────────────────────────────────
const TITLES: Record<string, string> = {
  gear:        'Duty: Realign Mechanical Gears ⚙️',
  wagon:       'Duty: Clear Wagon Path Obstacles 📦',
  scaffolding: 'Duty: Stack Timber Scaffolding 📐',
  boiler:      'Duty: Regulate Steam Boiler Pressure 🌡️',
  steam:       'Duty: Patch Pipe Steam Leaks 💨',
  monorail:    'Duty: Calibrate Monorail Signals 🚂',
  bubble:      'Chore: Bubble Sort Garden 🫧',
  sweep:       'Chore: Dust Bunny Sweep 🧹',
  plant:       'Chore: Balcony Plant Waterer 🌱',
  sort:        'Chore: Pantry Sort Sprint 📦',
  bakery:      'Bakery Duty: Bake Fresh Pastries 🥐',
  adventure:   'Duty: Ganache Grove Expedition 🌲',
};

// ── Duty → town benefit text (shown in PostGameScreen) ────────────────────────
const TOWN_BENEFITS: Record<string, string> = {
  gear:        'The old mill is spinning again! Ganache Grove flour production is up 12%.',
  wagon:       'The canal towpath is clear. Cargo deliveries resumed for all riverside traders.',
  scaffolding: 'Three new elevated walkways are now safe for residents to use above the root floor.',
  boiler:      'The town bathhouse is running at perfect temperature. Dr. Cedric approves.',
  steam:       'Clean water pressure restored to all cottages in the eastern grove.',
  monorail:    'Monorail is running on schedule. Pipkin says he can "almost keep up with it now".',
  bubble:      'The garden paths are vibrant and sorted — pollinators are thriving around the cottage.',
  sweep:       'Cottage hallways are spotless. The bunny colony has been relocated to the meadow.',
  plant:       'Balcony orchids are blooming! Julie Frost spotted them for the Gazette.',
  sort:        'Pantry reorganized. Cooking time reduced — family meals are tastier tonight.',
  bakery:      'Fresh pastries are available at the Bakery. The whole town smells of cinnamon.',
  adventure:   'New herb supply delivered to the clinic. Dr. Cedric can treat 3 more patients.',
};

// ── Rich, Task-Specific details, objectives, and fun facts ──────────────────
interface ExtendedDutyMeta {
  lore: string;
  objective: string;
  funFactTitle: string;
  funFactText: string;
  imgUrl: string;
}

const TOWNSFOLK_GOSSIP: Record<string, string[]> = {
  herb: [
    "Pipkin 🐿️: 'Dr. Cedric told me to stop chewing raw bark cobs, but I swear Worry-Root makes my ears wiggle cleaner!'",
    "Elder Barnaby 👴: 'My head is pounding like a clockwork boiler! That Feverfew Blossom tea better soothe my temples!'",
    "Mrs. Maple 👵: 'My hacking cough woke up the canal frogs last night. Send a flask of Silver Pine-Needles post-haste!'",
    "Farmer Oats 🌾: 'Tending the wheat with a bloated stomach is no joke. I need Ginger Snap Root to settle the gas!'"
  ],
  gear: [
    "Rowan 🔨: 'If that drive shaft slips one more time, the whole mill wheel is going to float down the canal!'",
    "Nutter 🐿️: 'I dropped my wrench in the gears. Don't tell Rowan, but it made a really funny whistle sound!'"
  ]
};

const BOTANICAL_SPOTLIGHT: Record<string, { name: string; emoji: string; desc: string }[]> = {
  herb: [
    { name: "Frostfire Petal", emoji: "❄️", desc: "Rare orchid that glows with blue flame, drawing heat out of severe grove-fevers." },
    { name: "Velvet Peppermint", emoji: "🌿", desc: "Freezing ether leaf that cools hot foreheads and breaks high temperatures." },
    { name: "Ginger Snap Root", emoji: "🫚", desc: "Warming knobby root that stops stomach spasms, nausea, and diner cramps." }
  ],
  gear: [
    { name: "Boss Gear", emoji: "⚙️", desc: "Heavy 24-tooth brass gear designed to handle maximum spindle torque." },
    { name: "Tiny Gear", emoji: "⚙️", desc: "Small 8-tooth cog used to bridge tight peg gaps in the mill chain." }
  ]
};

const DUTY_EXTENDED_DETAILS: Record<string, ExtendedDutyMeta> = {
  herb: {
    lore: "A sudden seasonal cold and digestive outbreak has struck the residents of Ganache Grove. Dr. Cedric is swamped in the clinic and needs a certified apothecary assistant to brew cures.",
    objective: "Identify botanical properties, read clinical clues, and sort rare medicinal herbs into 5 active disease cauldrons to heal the village.",
    funFactTitle: "🌿 Apothecary Clay (Fun Fact)",
    funFactText: "Fresh Velvet Peppermint is stored in dark glazed clay jars to protect its freezing ether from solar rays, preserving its fever-breaking cooling properties.",
    imgUrl: "/wallpapers/MagicalGarden.png",
  },
  gear: {
    lore: "Rowan's clockwork flour mill has seized up. The main drive shaft is slipping, causing a backup of harvested wheat crates near the river docks.",
    objective: "Arrange gears of various pinion diameters (Tiny, Cogs, or Boss) to connect the purple motor to the green spindle, restoring mechanical torque.",
    funFactTitle: "⚙️ Brass Lubrication (Fun Fact)",
    funFactText: "Ganache Grove smithies use cold-pressed walnut oil to lubricate brass cogs because it doesn't gum up under low steam temperatures.",
    imgUrl: "/Assets/Ganache Grove/Scene_0.1.png",
  },
  wagon: {
    lore: "A heavy thunderstorm has blown branches and large boulders across the caravan tracks, blocking key supply routes to Riverside Docks.",
    objective: "Help clear the trail grid by sliding large stones and fallen birch logs into side drainage ditches, letting the merchant cargo pass through.",
    funFactTitle: "📦 Pine-Wood Cargo (Fun Fact)",
    funFactText: "Caravan wagons in ToffeeTowns are built from cedar bark and light pine wood, allowing horses to pull twice the load on wet canal towpaths.",
    imgUrl: "/towns/eclair-square.png",
  },
  scaffolding: {
    lore: "The builders are paving the high Mossberry walkways but need a stable modular timber scaffold to hoist the anti-slip cedar logs safely.",
    objective: "Calibrate and stack wooden blocks sequentially as they sweep side-to-side. Drop them cleanly on top of one another to build a tall tower.",
    funFactTitle: "📐 Joint Mortises (Fun Fact)",
    funFactText: "Town carpenters use interlocking mortise-and-tenon joints instead of iron nails, which makes scaffolds flexible enough to sway safely in high wind gusts.",
    imgUrl: "/Assets/Ganache Grove/Scene_0.1.png",
  },
  boiler: {
    lore: "The geothermal heating lines at Oakenhart Clinic are spiking. Dr. Cedric needs the steam pressure regulated to keep the recovery wards warm.",
    objective: "Use the temperature dials to adjust steam flow. Keep the pressure gauge needle resting perfectly inside the green safety zone.",
    funFactTitle: "🌡️ Geothermal Steam (Fun Fact)",
    funFactText: "The village springs derive heat from tectonic sulfur beds 3 miles down. The mineral-rich steam helps speed recovery for patients suffering from grove-fever.",
    imgUrl: "/Assets/Ganache Grove/Copilot_20260425_143442.png",
  },
  steam: {
    lore: "A pipeline seam has cracked in the apothecary cellar, releasing superheated vapor. It's draining fresh water pressure from the surrounding cottages.",
    objective: "Track leaking steam clouds along the copper piping system and tap them repeatedly to patch the leaks before pressure levels bottom out.",
    funFactTitle: "💨 Condensation Traps (Fun Fact)",
    funFactText: "Village pipes are wrapped in dried linen insulation. When steam leaks are patched, the resulting condensation feeds a clean-water recycling well.",
    imgUrl: "/Assets/Ganache Grove/Copilot_20260425_143442.png",
  },
  monorail: {
    lore: "The morning monorail signals at the Post House are misaligned. The clockwork track switcher is stuck, delaying the delivery of regional letters.",
    objective: "Connect the signaling relays in matching color pathways. Align all signals to let the express postal train route safely to the station.",
    funFactTitle: "🚂 Copper Coils (Fun Fact)",
    funFactText: "Monorail signals run on low-voltage copper coils powered by solar crystals. The trains use magnetic induction to float silently over the forest canopy.",
    imgUrl: "/towns/eclair-square.png",
  },
  bubble: {
    lore: "Rainwater has collected on the cottage garden leaves, forming large, mineral-heavy morning dewdrops that block sunlight from reaching the moss orchids.",
    objective: "Pop the translucent glass bubbles in strict rainbow order (Red, Orange, Yellow, Green, Blue) to clear the leaves and tidy up the garden paths.",
    funFactTitle: "🫧 Dewdrop Refraction (Fun Fact)",
    funFactText: "Translucent dewdrops focus sunlight like micro-lenses, which can burn sensitive moss leaves. Popping them in order protects the plants.",
    imgUrl: "/wallpapers/MagicalGarden.png",
  },
  sweep: {
    lore: "A colony of fluffy, electrostatic dust bunnies has drifted in from the attic, settling in the cozy corners of the cottage living room.",
    objective: "Tap the falling lint bunnies with your broom cursor to sweep them away before they land.",
    funFactTitle: "🧹 Static Charge (Fun Fact)",
    funFactText: "Dust bunnies in ToffeeTowns are actually magical wool fibers. Sweeping them into bags helps spin yarn for warm winter socks!",
    imgUrl: "/wallpapers/MagicalGarden.png",
  },
  plant: {
    lore: "The balcony orchids are drying up in the dry afternoon air. Each pot requires varying amounts of water to maintain botanical health.",
    objective: "Monitor the soil moisture levels across the planters. Water the thirstiest plants first to help them bloom before sunset.",
    funFactTitle: "🌱 Orchid Moisture (Fun Fact)",
    funFactText: "Canopy orchids absorb nutrients from ambient moisture. The Gazette reports that misting them at sunset doubles their pollen production.",
    imgUrl: "/wallpapers/MagicalGarden.png",
  },
  sort: {
    lore: "The pantry cabinets are a mess after the baking festival. Spices, jam jars, and baking tools are mixed up on the wrong shelves.",
    objective: "Categorize incoming items and place them on the correct matching shelf category (Jars, Breads, Tools, Herbs) before the timer runs out.",
    funFactTitle: "𫱎 Herb Storage (Fun Fact)",
    funFactText: "Storing dried peppermint leaves next to honey syrup preserves the peppermint aroma and keeps sugar-ants away from the pantry.",
    imgUrl: "/wallpapers/MagicalGarden.png",
  },
  bakery: {
    lore: "Chef Caramel is preparing a triple-layer order for the seasonal festival. He needs a skilled baker to handle the wood-fired ovens.",
    objective: "Adjust temperatures of multiple ovens. Pull out bread loaves exactly when the bake progress hits the golden sweet zone.",
    funFactTitle: "🥐 Hearth Heat (Fun Fact)",
    funFactText: "Caramel's brick ovens are fired with cherry wood, giving the bread crusts a sweet, fruity fragrance that can be smelled from the village gates.",
    imgUrl: "/wallpapers/MagicalGarden.png",
  },
  adventure: {
    lore: "Dr. Cedric needs fresh canopy herbs gathered from the wild valleys of Ganache Grove to restock the clinic's apothecary cabinet.",
    objective: "Chart a path through the valley expedition grid, navigating around thickets and streams to harvest wild botanical flora.",
    funFactTitle: "🎒 Foraging Trails (Fun Fact)",
    funFactText: "Wild mint shoots grow near clear spring water. Harvesting them carefully by the root allows new plants to grow back within two weeks.",
    imgUrl: "/towns/eclair-square.png",
  },
};

// ── How-to gamification steps & tips ────────────────────────────────────────
interface GamifiedIntroMeta {
  steps: string[];
  strategy: string;
}

const GAMIFIED_STEPS: Record<string, GamifiedIntroMeta> = {
  herb: {
    steps: [
      "Read the dealt herb's properties and clinical clue carefully.",
      "Identify which of the 5 village cauldrons matches the symptoms.",
      "Tap/drop the herb to add it to the mixture.",
      "Sort exactly 2 correct herbs into each cauldron to cure the villagers."
    ],
    strategy: "Watch out for confusing herbs (like Feverfew or Peppermint) that look similar but serve different clinical targets. Check the properties first!"
  },
  gear: {
    steps: [
      "Select cog sizes (Tiny, Cogs, or Boss) from your toolbox.",
      "Fit them onto the shaft pegs to build a gear chain.",
      "Verify that the Drive gear rotates the spindle to power the mill."
    ],
    strategy: "You don't need a single size; mix and match cog diameters. Check the teeth connection carefully so no cogs overlap or slip!"
  },
  wagon: {
    steps: [
      "Analyze the towpath grid to find blocked cargo crates.",
      "Slide and drop logs and boulders into lower empty ditches.",
      "Ensure a clear path remains for the trade caravan barge."
    ],
    strategy: "Crates can only fall downward, not move sideways. Plan your sequence from bottom to top to avoid trapping logs!"
  },
  scaffolding: {
    steps: [
      "Watch the sliding timber beam swing side-to-side.",
      "Tap drop to release the beam exactly above the stack.",
      "Maintain a vertical center of gravity to prevent collapse."
    ],
    strategy: "The swing speed increases with every block. Anticipate the momentum and drop slightly before the center point!"
  },
  boiler: {
    steps: [
      "Observe the steam pressure bar rising automatically.",
      "Tap the Release Valve to vent pressure when it gets high.",
      "Maintain stable pressure in the green safety zone for 15s."
    ],
    strategy: "Do not let pressure hit 100% or it resets the timer. Light, rhythmic taps are much safer than holding the valve down!"
  },
  steam: {
    steps: [
      "Scan the copper pipeline for escaping white steam clouds.",
      "Tap each leak cloud repeatedly to tighten the line joints.",
      "Seal all leak points before system water pressure bottom out."
    ],
    strategy: "Large clouds with high numbers leak pressure faster. Prioritize sealing the major leaks before they start to multiply!"
  },
  monorail: {
    steps: [
      "Inspect the wire segments on the switching track tiles.",
      "Tap tiles to rotate their circuits 90 degrees clockwise.",
      "Form a horizontal signal wire path for electric flow."
    ],
    strategy: "Look for tiles that are already glowing yellow; these are aligned. Route the electric flow through them first!"
  },
  bubble: {
    steps: [
      "Identify the 5 colored mineral dewdrops on the leaves.",
      "Pop them in strict rainbow order: Red, Orange, Yellow, Green, Blue.",
      "Avoid wrong-color pops to maintain your score multiplier."
    ],
    strategy: "Take a second to locate the next color in the sequence before tapping. Rushing leads to accidental wrong-color resets!"
  },
  sweep: {
    steps: [
      "Watch electrostatic dust bunnies drop from the attic ceiling.",
      "Tap falling bunnies to sweep them away before they land.",
      "Protect your 3 lives; missing a bunny costs one life bar."
    ],
    strategy: "Bunnies fall faster as the room clears. Keep your eyes on the outer edges and swipe them early in their fall!"
  },
  plant: {
    steps: [
      "Check the moisture levels on all the balcony planters.",
      "Determine the descending thirst order of the orchid pots.",
      "Water the thirstiest plants first to keep them from drying."
    ],
    strategy: "Moisture levels drop constantly. Water the lowest bar first, then quickly identify the next lowest to secure streaks!"
  },
  sort: {
    steps: [
      "Inspect incoming pantry jars, tools, and herb packets.",
      "Match each item to its corresponding colored shelf.",
      "Sort all items correctly before the pantry timer hits zero."
    ],
    strategy: "Each shelf has a specific icon. Memorize the colors (Red/Blue/Green/Pink) in the first 3 items to speed up your sorting!"
  },
  bakery: {
    steps: [
      "Track the rising and falling oven temperature wave.",
      "Identify the green baking window for the active pastries.",
      "Press bake to remove pastry trays in the golden zone."
    ],
    strategy: "The temperature needle follows a rhythmic cycle. Pull the tray right as the temperature enters the green sweep!"
  },
  adventure: {
    steps: [
      "Chart a route through the valley map coordinates grid.",
      "Navigate around water streams, thickets, and cliffs.",
      "Harvest fresh herb shoots and return to the clinic."
    ],
    strategy: "Herb nodes grow back over time. If a direct path is blocked, loop back to previous path segments to forage safely!"
  }
};

// ── Game-Specific Hints ────────────────────────────────────────────────────
const DUTY_HINT_TEXTS: Record<string, string> = {
  gear:        "The driving shaft needs the most power — think big. The spindle prefers smooth, small connections. Bridge the gap wisely between them.",
  wagon:       "Stack your drops from the bottom up. Once the lowest row is clear, the rows above will have room to fall into place.",
  scaffolding: "The beam gives you a rhythm — one slow sweep, one fast return. Don't chase it. Let it come back to the center before dropping.",
  boiler:      "The needle likes little taps — not big slams. Think of it like blowing on a candle: small, steady breaths keep the flame alive.",
  steam:       "Numbers tell the urgency. The highest number means the most leaks. Tackle the loudest ones before they overwhelm the quieter pipes.",
  monorail:    "Every tile speaks to its neighbour. If a wire glows gold, it's asking for a connection. Rotate the tiles beside it to answer the call.",
  bubble:      "Nature's rainbow never lies — from warm sunrise to cool ocean, red always comes first and blue always closes the circle.",
  sweep:       "The corners are where bunnies like to hide. Keep your eyes moving side-to-side, not just at the center of the screen.",
  plant:       "A plant that's barely holding on needs water first. Look for the thinnest bar — that one is the most desperate.",
  sort:        "Every item belongs to a family. Jars store things. Bread feeds. Herbs heal. Tools build. Let the item's story tell you where it belongs.",
  bakery:      "Every oven has a heartbeat — watch it rise and fall twice. On the third rise, the green window opens. That is your moment.",
  adventure:   "Water is the compass. Where you see water tiles, healing herbs grow nearby. Step near the rivers before heading into the deep forest.",
  herb:        "Read the property badge — not just the name. The herb's true category is always hidden in its properties (Cooling, Anxiolytic, Carminative…). Names can fool you. Properties never lie.",
};

// ── XP calculation by completion tier ────────────────────────────────────────
function calcXP(dutyType: string, pct: number): { xp: number; legacy: number } {
  const cfg = PREGAME_CONFIGS[dutyType] || PREGAME_CONFIGS['gear'];
  const r = cfg.rewards;
  if (pct < 0) return { xp: r.penaltyXP, legacy: r.penaltyLegacy };
  if (pct >= 100) return { xp: r.xp100, legacy: r.legacy100 };
  if (pct >= 75)  return { xp: r.xp75,  legacy: r.legacy75  };
  if (pct >= 50)  return { xp: r.xp50,  legacy: r.legacy50  };
  return { xp: 0, legacy: 0 };
}

// ── Main Router ───────────────────────────────────────────────────────────────
export const MiniGameRouter = (props: MiniGameRouterProps) => {
  const {
    taskName, skillCat, dutyType = 'gear', frame, profession, rewards, onSuccess, onFail,
  } = props;
  const { coins, addCoins, setHeaderHidden, homeTown } = useTTStore();
  const [stage, setStage] = useState<Stage>('briefing');
  const [specsTab, setSpecsTab] = useState<'fever' | 'cough' | 'stress' | 'stomach' | 'headache'>('fever');
  const [selectedHerbId, setSelectedHerbId] = useState<number | null>(null);
  const [result, setResult] = useState<GameResult | null>(null);

  // ── Gameplay Stage State ──────────────────────────────────────────────────
  const [isPaused, setIsPaused] = useState(false);
  const [isHintRevealed, setIsHintRevealed] = useState(false);
  const [sessionLogs, setSessionLogs] = useState<{ time: string; msg: string }[]>([]);
  const [liveScore, setLiveScore] = useState(0);
  const [gameTimeLeft, setGameTimeLeft] = useState(300); // 5 mins countdown
  const [showQuitConfirm, setShowQuitConfirm] = useState(false); // Quit warning state
  const [activeAccordion, setActiveAccordion] = useState<string | null>(null);
  const logEndRef = useRef<HTMLDivElement>(null);
  const sidebarScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (stage === 'playing' && sidebarScrollRef.current) {
      sidebarScrollRef.current.scrollTop = 0;
    }
  }, [stage]);

  // ── Auto hide global navigation header on mount ───────────────────────────
  useEffect(() => {
    setHeaderHidden(true);
    return () => {
      setHeaderHidden(false);
    };
  }, [setHeaderHidden]);

  // ── Log and score hooks ───────────────────────────────────────────────────
  const addLog = useCallback((msg: string) => {
    const timeStr = new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setSessionLogs(prev => [...prev, { time: timeStr, msg }]);
  }, []);

  useEffect(() => {
    if (stage === 'playing') {
      const timeStr = new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
      setSessionLogs([{ time: timeStr, msg: "System initialized. Starting duty." }]);
      setIsHintRevealed(false);
      setIsPaused(false);
      setLiveScore(0);
      setGameTimeLeft(300);
      setShowQuitConfirm(false);
    }
  }, [stage]);

  // Countdown timer thread
  useEffect(() => {
    if (stage !== 'playing' || isPaused || showQuitConfirm) return;
    const timerId = setInterval(() => {
      setGameTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerId);
          addLog("Time limit reached! Terminating duty.");
          handleEarlyExit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timerId);
  }, [stage, isPaused, showQuitConfirm, addLog]);

  // Scroll logs to bottom
  useEffect(() => {
    if (logEndRef.current) {
      logEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [sessionLogs]);

  // ── Get hometown wallpaper for standalone background ──────────────────────
  const getWallpaper = () => {
    if (homeTown === 'ganache-grove') return '/wallpapers/MagicalGarden.png';
    if (homeTown === 'toffee-town') return '/wallpapers/AutumnForest.png';
    if (homeTown === 'eclair-square') return '/wallpapers/SereneSunset.png';
    if (homeTown === 'peppermint-peak') return '/wallpapers/Cherry blossoms.png';
    if (homeTown === 'banoffee-valley') return '/wallpapers/LakeView.png';
    return '/wallpapers/MagicalGarden.png';
  };

  // ── Hint Purchase handler ─────────────────────────────────────────────────
  const handleUseHint = () => {
    if (coins < cfg.hintCostCoins) return;
    addCoins(-cfg.hintCostCoins, 'Bought Mini-Game Hint');
    setIsHintRevealed(true);
    addLog(`Hint purchased! (-${cfg.hintCostCoins} Coins)`);
  };

  // ── Lucky Moment handler ──────────────────────────────────────────────────
  const handleLuckyReward = useCallback((reward: LuckyReward) => {
    if (reward.type === 'coins' && reward.value) {
      addCoins(reward.value, 'Lucky Moment - golden cocoa leaf tap');
      addLog(`Lucky Moment: Golden cocoa leaf tapped! (+${reward.value} Coins)`);
    }
  }, [addCoins, addLog]);
  
  const startTime = useRef(Date.now());
  const scoreRef = useRef(0);
  const hitsRef = useRef(0);
  const missesRef = useRef(0);
  const streakRef = useRef(0);

  const cfg = PREGAME_CONFIGS[dutyType] || PREGAME_CONFIGS['gear'];
  const theme = (frame || 'wooden') as SkeuomorphicTheme;
  const title = TITLES[dutyType] || taskName;

  // Immersive task metadata
  const extDetails = DUTY_EXTENDED_DETAILS[dutyType] || DUTY_EXTENDED_DETAILS['gear'];
  const gamifiedSteps = GAMIFIED_STEPS[dutyType] || GAMIFIED_STEPS['gear'];

  // format seconds to MM:SS
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  // Intercept close attempt to show warning card
  const requestEarlyExit = () => {
    setShowQuitConfirm(true);
    addLog("Close requested. Waiting for confirmation.");
  };

  // ── Companion dialogues for Solution Intro (Page 2) ───────────────────────
  const getSolutionIntro = () => {
    const isChore = dutyType === 'bubble' || dutyType === 'sweep' || dutyType === 'plant' || dutyType === 'sort';
    if (isChore) {
      return {
        npc: 'Pipkin 🐿️',
        avatar: '🐿️',
        bg: '#f97316',
        text: `Hey! Don't just tick off a box. We're going to make this cottage chore fun! Let's get the job done and log our progress through a mini-game. What do you say?`,
      };
    }
    const cat = skillCat.toLowerCase();
    if (cat === 'builder') {
      return {
        npc: 'Rowan 🔨',
        avatar: '🔨',
        bg: '#60a5fa',
        text: `The Town Council needs this sorted, but we don't just sign reports! We are going to lock the timber scaffolding or realign the gear teeth on my workshop workbench. Ready to build?`,
      };
    }
    if (cat === 'healer') {
      return {
        npc: 'Dr. Cedric 🩺',
        avatar: '🩺',
        bg: '#4ade80',
        text: `The health index depends on this checkup. Instead of reading logs, we will adjust the steam cauldron valves or sort the botanical medicine bottles correctly. Let's heal together!`,
      };
    }
    return {
      npc: 'Julie 📰',
      avatar: '📰',
      bg: '#f472b6',
      text: `Let's make this town activity headline-worthy! We'll map the route or clear the path by playing. Ready to begin?`,
    };
  };

  const introMeta = getSolutionIntro();

  // ── When the game is won (100%) ───────────────────────────────────────────
  const handleWin = (finalScore?: number, finalCuredCount?: number) => {
    const elapsed = Math.round((Date.now() - startTime.current) / 1000);
    const scoreVal = finalScore !== undefined ? finalScore : scoreRef.current;
    const curedVal = finalCuredCount !== undefined ? finalCuredCount : 3;

    let pct = 100;
    if (dutyType === 'herb' || dutyType === 'herb2') {
      const minScore = dutyType === 'herb' ? 120 : 200;
      if (curedVal >= 3 && scoreVal >= minScore) {
        if (elapsed <= 240) {
          pct = 100; // Flawless / Perfect!
        } else {
          pct = 80; // Passable / Great Resolve
        }
      } else {
        pct = 30; // Failed
      }
    }

    const { xp, legacy } = calcXP(dutyType, pct);
    setResult({
      gameId: dutyType,
      gameTitle: cfg.title,
      gameIcon: cfg.icon,
      themeColor: cfg.themeColor,
      score: scoreVal,
      maxScore: 600,
      completionPct: pct,
      xpEarned: xp,
      xpCategory: cfg.rewards.xpCategory,
      legacyEarned: legacy,
      duration: elapsed,
      hits: hitsRef.current || undefined,
      misses: missesRef.current || undefined,
      streak: streakRef.current || undefined,
      accuracy: hitsRef.current
        ? Math.round(100 * hitsRef.current / Math.max(1, hitsRef.current + missesRef.current))
        : undefined,
    });
    setStage('theend');
  };

  // ── When the player exits early ───────────────────────────────────────────
  const handleEarlyExit = (finalScore?: number, finalCuredCount?: number) => {
    const elapsed = Math.round((Date.now() - startTime.current) / 1000);
    const scoreVal = finalScore !== undefined ? finalScore : scoreRef.current;
    const curedVal = finalCuredCount !== undefined ? finalCuredCount : 0;

    let pct = 30;
    if (dutyType === 'herb' || dutyType === 'herb2') {
      const minScore = dutyType === 'herb' ? 120 : 200;
      if (curedVal >= 3 && scoreVal >= minScore) {
        if (elapsed <= 240) {
          pct = 100;
        } else {
          pct = 80;
        }
      } else {
        pct = 30; // Failed
      }
    } else {
      const totalSec = 5 * 60;
      pct = Math.round(Math.min(100, (elapsed / totalSec) * 100));
    }

    const { xp, legacy } = calcXP(dutyType, pct < 25 ? -1 : pct);
    setResult({
      gameId: dutyType,
      gameTitle: cfg.title,
      gameIcon: cfg.icon,
      themeColor: cfg.themeColor,
      score: scoreVal,
      maxScore: 600,
      completionPct: pct,
      xpEarned: xp,
      xpCategory: cfg.rewards.xpCategory,
      legacyEarned: legacy,
      duration: elapsed,
      hits: hitsRef.current || undefined,
      misses: missesRef.current || undefined,
      streak: streakRef.current || undefined,
      accuracy: hitsRef.current
        ? Math.round(100 * hitsRef.current / Math.max(1, hitsRef.current + missesRef.current))
        : undefined,
    });
    setStage('theend');
  };

  const handlePlayAgain = () => {
    scoreRef.current = 0;
    hitsRef.current = 0;
    missesRef.current = 0;
    streakRef.current = 0;
    startTime.current = Date.now();
    setResult(null);
    setStage('pregame');
  };

  const handleDone = () => {
    if (result && result.completionPct >= 50) onSuccess();
    else onFail();
  };

  // Switcher for active game component
  const renderGame = () => {
    const commonProps = { 
      onWin: handleWin, 
      onFail: handleEarlyExit,
      onScoreChange: (score: number) => {
        scoreRef.current = score;
        setLiveScore(score);
      },
      addLog,
    };
    switch (dutyType) {
      case 'gear':        return <ThreeGearWorkbench {...commonProps} />;
      case 'wagon':       return <WagonGame        {...commonProps} />;
      case 'monorail':    return <MonorailGame     {...commonProps} />;
      case 'scaffolding': return <ScaffoldingGame  {...commonProps} />;
      case 'boiler':      return <BoilerGame       {...commonProps} />;
      case 'steam':       return <SteamGame        {...commonProps} />;
      case 'bubble':      return <BubbleGame       {...commonProps} />;
      case 'sweep':       return <SweepGame        {...commonProps} />;
      case 'plant':       return <PlantGame        {...commonProps} />;
      case 'sort':        return <SortGame         {...commonProps} />;
      case 'herb':        return <HerbDeliveryGame {...commonProps} />;
      case 'herb2':       return <HerbDeliveryGameL2 {...commonProps} />;
      case 'bakery':
        return <OvenTimingGame rewards={cfg.rewards as any} onSuccess={handleWin} onFail={handleEarlyExit} onClose={requestEarlyExit} />;
      case 'adventure':
        return <AdventureWorld onClose={handleWin} />;
      default:
        return <ThreeGearWorkbench {...commonProps} />;
    }
  };

  return (
    <div 
      className="fixed inset-0 z-[400] flex items-center justify-center p-4 bg-no-repeat bg-cover bg-center animate-fade-in"
      style={{ backgroundImage: `url("${getWallpaper()}")` }}
    >
      <SkeuomorphicFrame
        theme={theme}
        title={title}
        width="92vw"
        height="99.5vh"
        isGameplay={stage === 'playing'}
        onClose={stage === 'playing' ? requestEarlyExit : (stage === 'briefing' ? onFail : handleDone)}
      >
        <div className="w-full h-full flex-grow flex items-center justify-center relative overflow-hidden bg-transparent rounded-2xl p-2">

          {/* ── PAGE 1: APOTHECARY MISSION BRIEFING (Merged Overview & Companion - 3 Columns Layout) ── */}
          {stage === 'briefing' && (() => {
            const gossipList = TOWNSFOLK_GOSSIP[dutyType] || TOWNSFOLK_GOSSIP.herb;
            const gossip = gossipList[Math.floor(Math.random() * gossipList.length)];
            const spotlightList = BOTANICAL_SPOTLIGHT[dutyType] || BOTANICAL_SPOTLIGHT.herb;
            const spotlight = spotlightList[Math.floor(Math.random() * spotlightList.length)];

            return (
              <div className="w-full h-full flex flex-col justify-between p-5 relative z-10 text-left bg-transparent overflow-y-auto custom-scrollbar">
                
                {/* Header Zone with Staggered Jumping Letters */}
                <div className="shrink-0 flex flex-col items-center text-center pb-3 border-b border-white/10 mb-2">
                  <span className="px-2.5 py-0.5 rounded-lg bg-yellow-400/20 text-yellow-400 border border-yellow-400/30 text-[9.5px] pgs-fredoka uppercase tracking-wider animate-pulse">
                    ⚡ NEW MISSION DETECTED!
                  </span>
                  <h1 className="pgs-lucky text-xl md:text-2xl uppercase leading-tight mt-1 flex flex-wrap justify-center gap-x-2"
                    style={{ filter: `drop-shadow(0 0 10px ${cfg.themeColor})` }}
                  >
                    {cfg.title.split(" ").map((word, wIdx) => (
                      <span key={wIdx} className="inline-block whitespace-nowrap">
                        {word.split("").map((char, cIdx) => (
                          <span
                            key={cIdx}
                            className="inline-block"
                            style={{
                              animation: `pgsJump 2.5s ease-in-out infinite`,
                              animationDelay: `${(wIdx * 5 + cIdx) * 0.08}s`,
                              background: `linear-gradient(90deg, ${cfg.themeColor}, #ffffff, ${cfg.themeColor})`,
                              backgroundSize: '200% auto',
                              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                            }}
                          >
                            {char}
                          </span>
                        ))}
                      </span>
                    ))}
                  </h1>
                  <p className="pgs-nunito text-[11px] text-white/50 leading-none mt-1">
                    Read your objectives and consult with your companion below before beginning.
                  </p>
                </div>

                {/* THREE COLUMN GRID FOR RICH CONTENT */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 flex-grow min-h-0 items-stretch">
                  
                  {/* Column 1: Companion Strategy Briefing & Patient Talks */}
                  <div className="flex flex-col justify-between rounded-3xl p-4 bg-black/45 backdrop-blur-md border border-white/10 shadow-lg min-h-0">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2.5xl shrink-0"
                          style={{
                            background: `${cfg.themeColor}18`,
                            border: `2.5px solid ${cfg.themeColor}35`,
                            boxShadow: `0 0 14px ${cfg.themeColor}20`
                          }}
                        >
                          {introMeta.avatar || (skillCat.toLowerCase() === 'builder' ? '🔨' : skillCat.toLowerCase() === 'healer' ? '🩺' : skillCat.toLowerCase() === 'explorer' ? '🐿️' : '📰')}
                        </div>
                        <div>
                          <span className="text-[9px] font-black uppercase tracking-wider block text-white/40 font-sans">Companion Advisor</span>
                          <h4 className="font-sans font-bold text-sm text-yellow-400 leading-tight mt-0.5">{introMeta.npc} Briefing</h4>
                        </div>
                      </div>

                      <p className="font-sans text-[12.5px] font-bold text-white/90 leading-relaxed italic bg-white/3 border border-white/5 p-3 rounded-2xl">
                        "{introMeta.text}"
                      </p>
                    </div>

                    {/* Townsfolk Gossip Section */}
                    <div className="p-3 bg-indigo-500/5 border border-indigo-500/15 rounded-2xl mt-3 text-left">
                      <span className="font-sans text-[9px] font-black uppercase tracking-wider text-indigo-300 block mb-0.5">🗣️ Patient & Townsfolk Talks</span>
                      <p className="text-indigo-200/90 text-[12.5px] italic font-semibold font-sans">"{gossip}"</p>
                    </div>
                  </div>

                  {/* Column 2: Objective Overview & Item Spotlight */}
                  <div className="flex flex-col justify-between rounded-3xl p-4 bg-black/45 backdrop-blur-md border border-white/10 shadow-lg min-h-0">
                    <div className="space-y-3">
                      <div>
                        <span className="text-[9px] font-black uppercase tracking-wider text-white/40 block font-sans">Objective Overview</span>
                        <h3 className="font-sans font-bold text-sm text-amber-100 leading-tight mt-0.5">{taskName}</h3>
                        <p className="font-sans text-[12.5px] text-white/80 leading-relaxed mt-1">
                          {extDetails.lore}
                        </p>
                      </div>

                      {/* Rare Item Spotlight Card */}
                      {spotlight && (
                        <div className="p-3 rounded-2xl bg-emerald-500/5 border border-emerald-500/15 flex items-center gap-3 mt-1.5 text-left">
                          <span className="text-3.5xl animate-pulse shrink-0">{spotlight.emoji}</span>
                          <div className="min-w-0 flex-1">
                            <span className="font-sans text-[8px] font-black uppercase tracking-wider text-emerald-400 block">Item Spotlight</span>
                            <h5 className="font-sans text-[12px] font-black text-white leading-tight mt-0.5">{spotlight.name}</h5>
                            <p className="font-sans text-[11px] text-white/60 leading-tight mt-0.5 truncate">{spotlight.desc}</p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Strategy Pro-Tip Card */}
                    <div className="p-3 bg-amber-500/5 border border-amber-500/15 rounded-2xl mt-3 text-[12.5px] leading-relaxed">
                      <span className="font-sans text-[9px] font-black uppercase tracking-wider text-amber-400 block mb-0.5">💡 Strategy Pro-Tip</span>
                      <p className="text-amber-200/90 italic font-semibold font-sans">"{gamifiedSteps.strategy}"</p>
                    </div>
                  </div>

                  {/* Column 3: Stats Details & Fun Facts */}
                  <div className="flex flex-col justify-between rounded-3xl p-4 bg-black/45 backdrop-blur-md border border-white/10 shadow-lg min-h-0">
                    <div className="space-y-3">
                      <div>
                        <span className="text-[9px] font-black uppercase tracking-wider text-white/40 block font-sans">Yield & Rewards</span>
                        <div className="grid grid-cols-2 gap-2 mt-1">
                          {[
                            { label: 'Profession', value: skillCat.toUpperCase(), color: 'text-amber-300' },
                            { label: 'Base Cost', value: rewards.coins > 0 ? `🪙 ${rewards.coins} Coins` : 'FREE', color: 'text-white' },
                            { label: 'XP Yield', value: `+${rewards.xp} XP`, color: 'text-emerald-400' },
                            { label: 'Legacy Standing', value: `+${rewards.legacy} PTS`, color: 'text-purple-400' }
                          ].map((item, i) => (
                            <div key={i} className="p-2 rounded-xl bg-white/3 border border-white/5 text-center">
                              <span className="text-[8px] font-bold text-white/40 uppercase block leading-none font-sans">{item.label}</span>
                              <span className={`text-[11px] font-black block mt-1.5 leading-none ${item.color} font-sans`}>{item.value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Fun Fact Scroll Card */}
                    <div className="p-3 bg-indigo-500/5 border border-indigo-500/15 rounded-2xl mt-3 text-[12.5px] leading-relaxed">
                      <span className="font-sans text-[9px] font-black uppercase tracking-wider text-indigo-400 block mb-0.5">
                        {extDetails.funFactTitle || 'Town Chronicles'}
                      </span>
                      <p className="text-indigo-200/90 italic font-semibold font-sans">"{extDetails.funFactText}"</p>
                    </div>
                  </div>

                </div>

                {/* Bottom Action Bar */}
                <div className="shrink-0 flex gap-4 pt-3 border-t border-white/10 mt-3">
                  <button onClick={onFail}
                    className="flex-1 py-2 rounded-xl bg-rose-950/40 border border-rose-500/35 hover:bg-rose-900/50 text-rose-200 font-sans text-xs uppercase tracking-wider font-bold transition cursor-pointer text-center">
                    Cancel Mission
                  </button>
                  <button onClick={() => setStage('pregame')}
                    className="flex-1 py-2 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-black font-sans text-xs uppercase tracking-wider font-black transition cursor-pointer shadow-md text-center">
                    Review Rules & Play!
                  </button>
                </div>

              </div>
            );
          })()}

          {/* ── PAGE 3: PLAY INSTRUCTIONS ─────────────────────────────────────── */}
          {stage === 'pregame' && (
            <PreGameScreen
              config={cfg}
              dutyType={dutyType}
              onPlay={() => { startTime.current = Date.now(); setStage('playing'); }}
              onClose={() => setStage('briefing')}
            />
          )}

          {/* ── PAGE 4: GAMEPLAY (25% Sidebar / 75% Play area - Glass Theme, No Inner Borders) ── */}
          {stage === 'playing' && (
            <div className="w-full h-full flex flex-col md:flex-row min-h-0 overflow-hidden text-left bg-transparent">
{/* Left Sidebar Pane (25%): Large Score/Timer Dashboard, Controls, Hints, Logs */}
              <div className="w-full md:w-[25%] shrink-0 p-4 flex flex-col justify-between bg-black/55 border-r border-white/10 h-full overflow-hidden select-none">
                {/* 1. STICKY / FIXED CONTENT (No scroll) */}
                <div className="space-y-3 shrink-0">
                  
                  {/* Huge Dual Dashboard (Score & Timer Stacked One After Another) */}
                  <div className="space-y-2.5">
                    {/* Score: Solid Black Box */}
                    <div className="bg-black rounded-2xl border-2 border-neutral-850 p-3.5 text-center shadow-lg transform hover:scale-[1.02] transition">
                      <span className="font-sans font-bold uppercase tracking-wider text-white/55 block text-[9.5px] tracking-widest font-black">Live Score</span>
                      <h2 className="font-sans text-[3.6rem] text-white font-black leading-none mt-1 drop-shadow-[0_0_12px_rgba(255,255,255,0.25)]">
                        {liveScore}
                      </h2>
                    </div>

                    {/* Timer: Solid Black Box */}
                    <div className="bg-black rounded-2xl border-2 border-neutral-855 p-3.5 text-center shadow-lg transform hover:scale-[1.02] transition">
                      <span className="font-sans font-bold uppercase tracking-wider text-white/55 block text-[9.5px] tracking-widest font-black">Time Remaining</span>
                      <h2 className={`font-sans text-3xl.5 leading-none mt-1 tracking-widest font-black ${gameTimeLeft <= 60 ? 'text-red-400 animate-pulse' : 'text-white'}`}>
                        {formatTime(gameTimeLeft)}
                      </h2>
                    </div>
                  </div>

                  {/* Active Duty status text block */}
                  <div className="bg-neutral-900/40 border border-white/5 rounded-xl px-3 py-2 flex justify-between items-center">
                    <div>
                      <span className="font-sans font-bold uppercase tracking-wider text-cyan-400 block" style={{ fontSize: '8px' }}>Active Duty</span>
                      <h3 className="text-[14px] font-black text-amber-100 leading-tight font-sans">{cfg.title}</h3>
                    </div>
                    <span className="text-xl shrink-0">{cfg.icon}</span>
                  </div>

                  {/* Hint Box (Directly below timer, NOT inside accordion) */}
                  <div className="bg-yellow-500/5 border-2 border-yellow-500/20 rounded-2xl p-3.5 space-y-2 shadow-md">
                    <div className="flex items-center gap-1.5">
                      <span className="text-base">💡</span>
                      <span className="font-sans font-bold uppercase tracking-wider text-yellow-400 block" style={{ fontSize: '9px' }}>System Hints</span>
                    </div>
                    {isHintRevealed ? (
                      <p className="text-yellow-200/90 text-[12px] leading-relaxed italic bg-yellow-950/30 p-2.5 rounded-xl border border-yellow-500/10 max-h-[72px] overflow-y-auto custom-scrollbar font-sans">
                        "{DUTY_HINT_TEXTS[dutyType || 'gear'] || 'Verify all joints are connected.'}"
                      </p>
                    ) : (
                      <div className="space-y-2">
                        <p className="text-white/60 text-[11px] leading-normal font-sans">
                          Need a clue? Reveal optimal moves for a small fee.
                        </p>
                        <button
                          onClick={handleUseHint}
                          disabled={coins < cfg.hintCostCoins}
                          className="w-full py-2 rounded-xl bg-yellow-400 hover:bg-yellow-300 disabled:opacity-50 disabled:cursor-not-allowed text-black font-sans font-black text-[12px] uppercase tracking-wider transition cursor-pointer shadow-md text-center border border-black"
                        >
                          Use Hint (🪙 {cfg.hintCostCoins} Coins)
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* 2. SCROLLABLE ACCORDION SECTION */}
                <div ref={sidebarScrollRef} className="flex-grow overflow-y-auto custom-scrollbar mt-3.5 space-y-3 min-h-0 pr-1">
                  
                  {/* ACCORDION 5: Workbench Specs (Only for Herbal sorting game) */}
                  {dutyType === 'herb' && (
                    <AccordionItem
                      id="herb-specs"
                      title="Workbench Specs"
                      icon="📋"
                      color="#fbbf24"
                      activeId={activeAccordion}
                      onToggle={setActiveAccordion}
                    >
                      <div className="space-y-2.5 text-left">
                        {/* 5 Tabs */}
                        <div className="grid grid-cols-5 gap-1 shrink-0">
                          {[
                            { key: 'fever',  label: 'Fever', emoji: '🏺', color: '#fca5a5' },
                            { key: 'cough',  label: 'Cough',    emoji: '🧪', color: '#5eead4' },
                            { key: 'stress', label: 'Stress',  emoji: '🔮', color: '#c4b5fd' },
                            { key: 'stomach',label: 'Stomach',    emoji: '🍵', color: '#86efac' },
                            { key: 'headache',label: 'Headache',      emoji: '🥣', color: '#93c5fd' }
                          ].map(tab => (
                            <button
                              key={tab.key}
                              type="button"
                              title={tab.label}
                              onClick={() => { setSpecsTab(tab.key as any); setSelectedHerbId(null); }}
                              className={`py-1 rounded-lg border flex flex-col items-center justify-center cursor-pointer transition active:scale-95 ${
                                specsTab === tab.key
                                  ? 'bg-neutral-850 border-yellow-500 shadow'
                                  : 'bg-black/35 border-white/5 hover:bg-black/50'
                              }`}
                            >
                              <span className="text-[15px]">{tab.emoji}</span>
                              <span className="text-[6.5px] uppercase font-black tracking-wider block" style={{ color: tab.color }}>
                                {tab.label.substring(0, 3)}
                              </span>
                            </button>
                          ))}
                        </div>

                        {/* Diagnostics */}
                        <div className="bg-black/40 p-2 rounded-xl border border-white/5 text-left">
                          <span className="text-[9px] uppercase tracking-wider font-black text-amber-400 font-sans">
                            {DIAGNOSTICS[specsTab]?.title}
                          </span>
                          <p className="font-sans text-[13px] leading-relaxed text-white/65 italic mt-0.5">
                            "{DIAGNOSTICS[specsTab]?.desc}"
                          </p>
                        </div>

                        {/* Herb list */}
                        <div className="space-y-1.5 max-h-[160px] overflow-y-auto custom-scrollbar">
                          {(HERBS_BY_CAT[specsTab] || []).map(h => {
                            const isSel = selectedHerbId === h.id;
                            return (
                              <div key={h.id} className="border border-white/5 rounded-xl overflow-hidden bg-black/20">
                                <button
                                  type="button"
                                  onClick={() => setSelectedHerbId(isSel ? null : h.id)}
                                  className="w-full px-2.5 py-1.5 flex items-center justify-between text-left hover:bg-white/5 transition"
                                >
                                  <div className="flex items-center gap-1.5">
                                    <span className="text-[13px]">{h.emoji}</span>
                                    <span className="font-bold text-[13px] text-white font-sans">{h.name}</span>
                                  </div>
                                  <span className="text-[9px] font-black uppercase text-white/30 font-sans">{isSel ? 'Hide' : 'Inspect'}</span>
                                </button>
                                {isSel && (
                                  <div className="p-2 border-t border-white/5 bg-yellow-500/5 space-y-1 text-left">
                                    <span className="text-[9.5px] font-bold text-yellow-400 uppercase font-sans">{h.property}</span>
                                    <p className="font-sans text-[13px] leading-normal text-yellow-100/90">{h.description}</p>
                                    <div className="pt-1 border-t border-white/5 text-[13px] text-white/60 leading-tight font-sans">
                                      <span className="font-bold text-amber-500">Clue:</span> {h.clue}
                                    </div>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </AccordionItem>
                  )}

                  {/* ACCORDION 1: Instructions & How to Play */}
                  <AccordionItem
                    id="briefing"
                    title="How to Play"
                    icon="📜"
                    color="#fca5a5"
                    activeId={activeAccordion}
                    onToggle={setActiveAccordion}
                  >
                    <div className="space-y-2 text-left max-h-[180px] overflow-y-auto custom-scrollbar pr-1">
                      <p className="text-[13px] text-white/65 leading-normal italic font-sans">
                        "{extDetails.objective}"
                      </p>
                      <div className="space-y-2 border-t border-white/5 pt-2">
                        {gamifiedSteps.steps.map((step, idx) => (
                          <div key={idx} className="flex gap-2.5 items-start">
                            <div className="w-5 h-5 rounded-full bg-red-400/20 border border-red-400/35 flex items-center justify-center shrink-0 mt-0.5">
                              <span className="text-[11px] font-black text-red-300">{idx + 1}</span>
                            </div>
                            <p className="text-[13px] text-white/80 leading-normal pt-0.5 font-sans">{step}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </AccordionItem>

                  {/* ACCORDION 2: Live logs */}
                  <AccordionItem
                    id="logs"
                    title="Live Duty Logs"
                    icon="📟"
                    color="#67e8f9"
                    activeId={activeAccordion}
                    onToggle={setActiveAccordion}
                  >
                    <div 
                      onClick={() => addLog("Tapped play space (Interaction logged)")}
                      className="h-28 rounded-xl bg-black/60 border border-white/5 p-2.5 overflow-y-auto custom-scrollbar font-mono text-[11px] text-cyan-300 space-y-1 cursor-pointer"
                      title="Tap play space to add an interaction log"
                    >
                      {sessionLogs.map((log, idx) => (
                        <div key={idx} className="leading-relaxed border-b border-white/3 pb-0.5">
                          <span className="text-white/30 mr-1">{log.time}</span> {log.msg}
                        </div>
                      ))}
                      <div ref={logEndRef} />
                    </div>
                  </AccordionItem>

                  {/* ACCORDION 3: Items & Mechanics */}
                  <AccordionItem
                    id="items"
                    title="Items & Mechanics"
                    icon="🎒"
                    color="#86efac"
                    activeId={activeAccordion}
                    onToggle={setActiveAccordion}
                  >
                    <div className="space-y-2 text-[13px] text-white/75 leading-relaxed text-left font-sans">
                      <p>
                        This workbench utilizes state mechanics. Maintain accuracy and speed for maximum bonus points!
                      </p>
                      <div className="bg-neutral-900/30 p-2.5 rounded-lg border border-white/5 text-[10.5px] text-white/50 space-y-1">
                        <div className="flex justify-between">
                          <span>Profession Category:</span>
                          <span className="text-white font-bold capitalize">{skillCat}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Pre-game Config Status:</span>
                          <span className="text-emerald-400 font-bold font-sans">READY</span>
                        </div>
                      </div>
                    </div>
                  </AccordionItem>

                  {/* ACCORDION 4: Shift Rewards */}
                  <AccordionItem
                    id="rewards"
                    title="Shift Rewards"
                    icon="🏆"
                    color="#fcd34d"
                    activeId={activeAccordion}
                    onToggle={setActiveAccordion}
                  >
                    <div className="space-y-2 text-[13px] font-sans">
                      <div className="flex justify-between items-center">
                        <span className="text-white/60">XP Yield:</span>
                        <span className="font-bold text-emerald-400">+{rewards.xp} XP</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-white/60">Legacy Reputation:</span>
                        <span className="font-bold text-purple-400">+{rewards.legacy} pts</span>
                      </div>
                    </div>
                  </AccordionItem>

                </div>

                {/* 3. STICKY FOOTER CONTROLS & WALLET */}
                <div className="shrink-0 mt-3 pt-2.5 border-t border-white/5 space-y-2.5">
                  <div className="flex gap-2">
                    <button 
                      onClick={() => {
                        setIsPaused(!isPaused);
                        addLog(isPaused ? "Game resumed." : "Game paused.");
                      }}
                      className="flex-1 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white font-sans text-[11px] uppercase font-bold tracking-wider transition cursor-pointer text-center"
                    >
                      {isPaused ? "▶️ Resume" : "⏸️ Pause"}
                    </button>
                    <button 
                      onClick={requestEarlyExit}
                      className="flex-1 py-2 rounded-lg bg-rose-950/40 border border-rose-500/35 text-rose-200 font-sans text-[11px] uppercase font-bold tracking-wider transition cursor-pointer text-center"
                    >
                      🚪 Quit Task
                    </button>
                  </div>


                </div>
              </div>

              {/* Right Play Area (75%): Clean glass, stretches edge-to-edge */}
              <div className="w-full md:w-[75%] flex-grow h-full flex items-center justify-center p-4 relative overflow-hidden bg-transparent">
                
                {/* ⚠️ CONFIRM QUIT OVERLAY CARD (Intercepts easy closing) */}
                {showQuitConfirm && (
                  <div className="absolute inset-0 bg-black/95 backdrop-blur-md z-50 flex items-center justify-center p-6 animate-fade-in animate-duration-150">
                    <div className="w-full max-w-sm rounded-[2rem] border border-red-500/25 bg-[#120606]/95 backdrop-blur-md p-6 text-center shadow-2xl relative">
                      <span className="text-4xl block mb-2">⚠️</span>
                      <h3 className="pgs-lucky text-amber-100 text-lg uppercase tracking-wider leading-snug">Interrupt Active Duty?</h3>
                      <p className="pgs-nunito text-xs text-white/70 mt-2.5 leading-relaxed">
                        Leaving early will result in a penalty of <span className="text-red-400 font-bold font-mono">{cfg.rewards.penaltyXP} XP</span> and <span className="text-orange-400 font-bold font-mono">{cfg.rewards.penaltyLegacy} Reputation</span> points.
                      </p>
                      <p className="pgs-nunito text-[10px] text-white/40 mt-1 leading-snug">
                        All accumulated score and progress for this run will be discarded.
                      </p>

                      <div className="flex flex-col gap-2.5 mt-5">
                        <button 
                          onClick={() => {
                            setShowQuitConfirm(false);
                            addLog("Close cancelled. Resumed playing.");
                          }}
                          className="w-full py-2.5 rounded-full bg-yellow-400 hover:bg-yellow-300 text-black font-sans font-black text-xs uppercase tracking-wider transition cursor-pointer shadow-md text-center"
                        >
                          ▶️ Resume Active Duty
                        </button>
                        <button 
                          onClick={() => {
                            setShowQuitConfirm(false);
                            addLog("Duty abandoned. Applying penalty.");
                            handleEarlyExit();
                          }}
                          className="w-full py-2.5 rounded-full bg-rose-950/50 border border-rose-500/35 hover:bg-rose-900/50 text-rose-200 font-sans font-bold text-xs uppercase tracking-wider transition cursor-pointer text-center"
                        >
                          Accept Penalty & Abandon
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {isPaused && !showQuitConfirm && (
                  <div className="absolute inset-0 bg-black/85 backdrop-blur-sm z-30 flex flex-col items-center justify-center p-8 text-center animate-fade-in animate-duration-150">
                    <span className="text-4xl mb-3 animate-pulse">⏸️</span>
                    <h3 className="text-base font-brand text-yellow-400 uppercase">Duty Paused</h3>
                    <p className="text-xs text-white/60 mt-1 max-w-xs leading-relaxed">
                      Your progress is safe. Tap Resume to return to the active task.
                    </p>
                    <button 
                      onClick={() => {
                        setIsPaused(false);
                        addLog("Game resumed.");
                      }}
                      className="mt-5 px-6 py-2 rounded-full bg-yellow-400 hover:bg-yellow-300 text-black font-sans font-black text-xs uppercase tracking-wider transition cursor-pointer shadow-md"
                    >
                      ▶️ Resume Duty
                    </button>
                  </div>
                )}

                {/* Stretches and fills 100% of the 70% container width */}
                <div className="w-full h-full flex items-center justify-center">
                  {renderGame()}
                </div>
              </div>
            </div>
          )}

          {/* ── THE END comic animation (between gameplay and postgame) ───────── */}
          {stage === 'theend' && result && (
            <PostGameScreen
              result={result}
              townBenefit={TOWN_BENEFITS[dutyType]}
              onPlayAgain={handlePlayAgain}
              onDone={handleDone}
            />
          )}

          {/* Lucky Moment overlay active during gameplay only */}
          {stage === 'playing' && !isPaused && !showQuitConfirm && (
            <LuckyMomentOverlay
              onReward={handleLuckyReward}
              minIntervalMs={25000}
              maxIntervalMs={48000}
              spawnChance={0.28}
              tapWindowMs={3800}
            />
          )}

          {/* ── PAGE 5: POST-GAME DEBRIEF & RESULTS ────────────────────────────── */}
          {stage === 'postgame' && result && (
            <PostGameScreen
              result={result}
              townBenefit={TOWN_BENEFITS[dutyType]}
              onPlayAgain={handlePlayAgain}
              onDone={handleDone}
            />
          )}

        </div>
      </SkeuomorphicFrame>
    </div>
  );
};
