import React, { useState, useEffect, useCallback } from 'react';
import { useTTStore } from '../store/useTTStore';
import GlassButton from '../components/GlassButton';

// ── Slide Data ─────────────────────────────────────────────
interface StorySlide {
  id: string;
  type: 'letter' | 'snapshot' | 'cta' | 'choose-town';
  image?: string;
  character?: string;
  location?: string;
  category?: { label: string; color: string; bg: string };
  headline?: string;
  caption?: string;
  detail?: string;
  townReaction?: { pct: number; text: string }[];
  actions?: string[];
}

const SLIDES: StorySlide[] = [
  {
    id: 'letter',
    type: 'letter',
    image: '/Assets/WelcomeShow/WelcomeLetter1.png',
  },
  {
    id: 'mayor-spoon',
    type: 'snapshot',
    image: '/Assets/WelcomeShow/Theme1_TheGoldenSpoon.png',
    character: 'Mayor Pompelmoose',
    location: '🏛 Toffee Town — Grand Harbour Centre',
    category: { label: '🏛 Politics', color: 'text-yellow-300', bg: 'bg-yellow-500/20 border-yellow-500/30' },
    headline: '"The giant spoon will DEFINE this city!"',
    caption:
      'Mayor Pompelmoose has unveiled his latest grand vision: the legendary <span class="text-yellow-300 font-semibold">Golden Spoon</span>. Standing at sixty feet tall, it would become the largest monument of decorative cutlery in provincial history.\n\nWhile nobody knows its official purpose, registry officers report that <span class="text-amber-300">construction plans</span> are scheduled to begin next Thursday. Many expect it to become the fourth wonder of ChocoBrook.',
    detail: 'This project would consume 40% of the annual public works funds.',
    townReaction: [
      { pct: 42, text: "calling it 'The 4th Wonder'" },
      { pct: 31, text: 'worry if Seawall stands until finished' },
      { pct: 27, text: 'agree it is impressively spoon-shaped' },
    ],
    actions: [
      '□ Fund decorative gemstones for the spoon\'s handle.',
      '□ Insist that functioning docks are more useful than decorative cutlery.',
      '□ Launch a province-wide investigation into the original purpose of the spoon.',
    ],
  },
  {
    id: 'chucklebop-raft',
    type: 'snapshot',
    image: '/Assets/WelcomeShow/Theme2_TheRocketRuckus.png',
    character: 'Chucklebop',
    location: '🌊 Peanut Butter Falls — Rapid Racing Dock',
    category: { label: '🤪 Gossip', color: 'text-pink-300', bg: 'bg-pink-500/20 border-pink-500/30' },
    headline: '"It wasn\'t a rocket. It was a motivational device."',
    caption:
      'Chucklebop attached three pressurised <span class="text-pink-300 font-semibold">mint-cream canisters</span> to his wooden racing raft, crossing the finish line minutes before anyone reached the first bend. The rapids spectator crowd was left completely astounded.\n\nUnfortunately, two riverside guests received an unexpected cream shower, and Chucklebop is now due before the <span class="text-pink-300">Safety Commission</span>. He remains cheerful about his new high-velocity mint engine.',
    detail: 'Chucklebop has submitted a design proposal for next season.',
    townReaction: [
      { pct: 58, text: 'called it the most efficient racing strategy' },
      { pct: 27, text: 'still finding mint cream in their hair' },
      { pct: 15, text: 'claim the pigeons organised it for him' },
    ],
    actions: [
      '□ Endorse the design for next season\'s provincial races.',
      '□ File a formal complaint with the Rapids Safety Commission.',
      '□ Commission a trophy in the shape of a cream-soaked spectator.',
    ],
  },
  {
    id: 'rebels-ganache',
    type: 'snapshot',
    image: '/Assets/WelcomeShow/Theme3_Bumblebird.png',
    character: 'Pippa Bolt & Hugo Glass',
    location: '✈️ Banoffee Valley — Air Squadron Hangar',
    category: { label: '✈️ Transport', color: 'text-orange-300', bg: 'bg-orange-500/20 border-orange-500/30' },
    headline: '"Step 1: Take off. Step 2: Figure it out."',
    caption:
      'Pippa Bolt and Hugo Glass have completed construction on the <span class="text-orange-300 font-semibold">Bumblebird</span>, a hand-built aircraft powered entirely by volatile, high-pressure butterscotch fuel. The local pilots are calling it a marvel of back-alley engineering.\n\nPippa\'s pre-flight checklist is noted to be mostly optional, and their flight plan consists of taking off first and <span class="text-orange-300">figuring out the rest</span> in mid-air. Volunteers are requested for the historic test flight.',
    detail: 'Volunteers are requested to verify control surfaces.',
    townReaction: [
      { pct: 68, text: 'love the butterscotch fuel scent' },
      { pct: 22, text: 'volunteered despite the candy parachute' },
      { pct: 10, text: 'doubt it can fly without permit' },
    ],
    actions: [
      '□ Volunteer to be the test pilot for the Bumblebird.',
      '□ Review Pippa\'s pre-flight checklist and suggest safety features.',
      '□ Help load the high-pressure butterscotch fuel into the tank.',
    ],
  },
  {
    id: 'doctor-fudge-health',
    type: 'snapshot',
    image: '/Assets/WelcomeShow/Theme4_TheFever.png',
    character: 'Dr. Fudge',
    location: '🌋 Lava Cake Lake — Geothermal Springs District',
    category: { label: '💊 Health', color: 'text-red-300', bg: 'bg-red-500/20 border-red-500/30' },
    headline: '"I\'ve had Volcanic Chocolate Fever three times. It builds character."',
    caption:
      'Dr. Fudge is treating six new cases of <span class="text-red-300 font-semibold">Volcanic Chocolate Fever</span>, caused by breathing in chocolate-steam laced with sulfur from the bubbling geothermal spring. The hot vents have attracted many curious travellers.\n\nHe is actively applying <span class="text-red-300">Cooling Mint Moss</span> compresses and Frost Salamander mucus ointment, cheerfully describing each new geothermal case as more interesting and character-building than the last.',
    detail: 'The spring geysers are releasing double the usual steam.',
    townReaction: [
      { pct: 54, text: 'boiling drinking water out of caution' },
      { pct: 36, text: 'refuse to wear peppermint moss compresses' },
      { pct: 10, text: 'claim sugar cubes are a better cure' },
    ],
    actions: [
      '□ Help Dr. Fudge prepare geothermal cooling compresses.',
      '□ Enforce the safety perimeter around the central bubbling spring.',
      '□ Test the hot chocolate steam for chemical contaminants.',
    ],
  },
  {
    id: 'milo-mushrooms',
    type: 'snapshot',
    image: '/Assets/WelcomeShow/Theme5_ThedancingMushrooms.png',
    character: 'Milo Spark',
    location: '🌲 Ganache Grove — Deep Canopy Zone, Shaft 3',
    category: { label: '🔬 Discovery', color: 'text-cyan-300', bg: 'bg-cyan-500/20 border-cyan-500/30' },
    headline: '"The mushrooms are not just glowing. They are vibrating at 40 hertz."',
    caption:
      'Forest Scientist Milo Spark has documented acoustic vibrations coming from the oldest <span class="text-cyan-300 font-semibold">cocoa mushroom clusters</span>. These low-frequency hums are measurable only with specialist recording equipment.\n\nThe vibrations are consistent with ancient oral accounts of a sacred <span class="text-cyan-300">"jazz that predates jazz,"</span> though Milo remains cautious about calling it jazz. His forest research boxes need immediate funding.',
    detail: 'His research needs funding; pigeons are investigating.',
    townReaction: [
      { pct: 49, text: 'heard "sweet chords" in roots' },
      { pct: 33, text: 'worry mushrooms might collapse roots' },
      { pct: 18, text: 'suggested bringing a band to play along' },
    ],
    actions: [
      '□ Help Milo setup advanced acoustic recording equipment.',
      '□ Request research funding from the Canopy Council.',
      '□ Document the migration pattern of the curious pigeons.',
    ],
  },
  {
    id: 'province-map',
    type: 'snapshot',
    image: '/Assets/WelcomeShow/ChocoBrook_Map.png',
    character: 'Imperial Registry',
    location: '🗺 ChocoBrook — High Council Chamber',
    category: { label: '🗺 Geography', color: 'text-amber-300', bg: 'bg-amber-500/20 border-amber-500/30' },
    headline: '"A Land Shaped by Confectionery Magic"',
    caption:
      'Formed after the Great Cocoa Flood, the majestic province of <span class="text-amber-300 font-semibold">ChocoBrook</span> is built entirely upon edible landforms. Roads, hills, and buildings are woven from sugar and spice.\n\nFrom the frozen peppermint peaks to the sticky caramel tide pools, every single landmark has been <span class="text-amber-300">crafted from magical confection</span>. A neutral Traveller is requested to map and explore this wild frontier.',
    detail: 'A neutral, external Traveller is needed to explore the land.',
    townReaction: [
      { pct: 71, text: 'claim province grows via chocolate spills' },
      { pct: 19, text: 'tasted a landmark and reported it sweet' },
      { pct: 10, text: 'notice the map smells like hazelnut' },
    ],
    actions: [
      '□ Request an official copy of the Provincial Map.',
      '□ Commission a geological study of the edible landforms.',
      '□ Apply for a Traveller Residency permit at the Registry.',
    ],
  },
  {
    id: 'toffee-town',
    type: 'snapshot',
    image: '/Assets/WelcomeShow/ChocoBrook_ToffeeTown.png',
    character: 'Registry Bureau',
    location: '🏛 Toffee Town — Grand Harbour Centre',
    category: { label: '🏛 Capital', color: 'text-yellow-300', bg: 'bg-yellow-500/20 border-yellow-500/30' },
    headline: '"The Majestic Seat of Confectionery Power"',
    caption:
      'Toffee Town stands as the glorious capital of the province, a busy metropolis of high politics, grand monuments, and the <span class="text-yellow-300 font-semibold">Treasury Bureau</span>. Its streets shine with golden caramel lights.\n\nHowever, gate residency is strictly restricted here. Only recognized Citizens of standing who have earned <span class="text-yellow-300">1200+ Legacy points</span> in the outer counties may apply for a permanent entry permit.',
    detail: 'Officers monitor capital access; outer county first.',
    townReaction: [
      { pct: 82, text: 'agree capital restrictions preserve order' },
      { pct: 12, text: 'protest the strict 1200+ Legacy rule' },
      { pct: 6, text: 'bribed officers with cookies for a pass' },
    ],
    actions: [
      '□ Register with the capital gate guards.',
      '□ Check the Legacy Board for available county tasks.',
      '□ Apply for a temporary residency waiver.',
    ],
  },
  {
    id: 'cocoawood-county',
    type: 'snapshot',
    image: '/Assets/WelcomeShow/CocoawoodCounty.png',
    character: 'Olive Pine',
    location: '🌲 Ganache Grove — Deep Canopy zone',
    category: { label: '🌲 Forestry', color: 'text-emerald-300', bg: 'bg-emerald-500/20 border-emerald-500/30' },
    headline: '"Mystical Forests & Glowing Cocoa Mushrooms"',
    caption:
      'Cocoawood County is renowned for its dense, ancient canopy of <span class="text-emerald-300 font-semibold">ganache trees</span> and glowing cocoa mushroom clusters. The forest holds secrets dating back to the flood.\n\nOlive Pine and the Rebel Rangers patrol the canopy to protect travellers, while Milo Spark conducts acoustic research. New arrivals are welcomed at <span class="text-emerald-300">Ganache Grove</span> to build their legacy.',
    detail: 'Starter Town: Ganache Grove is open to all New Arrivals.',
    townReaction: [
      { pct: 68, text: 'value ganache timber conservation' },
      { pct: 22, text: 'prefer treehouses over stone houses' },
      { pct: 10, text: 'saw mysterious lights in deep canopy' },
    ],
    actions: [
      '□ Help build a canopy bridge for the Rangers.',
      '□ Catalog new glowing mushroom sub-species.',
      '□ Gather ganache wood logs for starter construction.',
    ],
  },
  {
    id: 'nutwood-county',
    type: 'snapshot',
    image: '/Assets/WelcomeShow/NutwoodCounty.png',
    character: 'Hazelnut Elder',
    location: '🌰 Hazelnut Terrace — Perpetual Bonfire',
    category: { label: '🌰 Community', color: 'text-yellow-300', bg: 'bg-yellow-500/20 border-yellow-500/30' },
    headline: '"Perpetual Bonfires & Nut-Crafting Traditions"',
    caption:
      'Nutwood County is home to the ancient nut-crafting elders, who gather every evening around the <span class="text-yellow-300 font-semibold">perpetual bonfire</span> to share gossip, trade tips, and roast fresh hazelnuts.\n\nThe warm community deeply values hard work, cozy campfire circles, and traditional wood-carving crafts. New arrivals can establish residency at the beautiful <span class="text-yellow-300">Hazelnut Terrace</span>.',
    detail: 'Starter Town: Hazelnut Terrace is open to all New Arrivals.',
    townReaction: [
      { pct: 74, text: 'attend campfires every single evening' },
      { pct: 21, text: 'prefer toasted hazelnuts over walnuts' },
      { pct: 5, text: 'complain smoke ruins clean wool shirts' },
    ],
    actions: [
      '□ Help harvest hazelnuts from the terrace slopes.',
      '□ Add fresh oak wood to the eternal bonfire.',
      '□ Learn nut-crafting techniques from the elders.',
    ],
  },
  {
    id: 'honeywood-county',
    type: 'snapshot',
    image: '/Assets/WelcomeShow/HoneywoodCounty.png',
    character: 'Caramel Sailor',
    location: '🌊 Caramel Cove — Tide-Salt Market',
    category: { label: '🌊 Coastal', color: 'text-purple-300', bg: 'bg-purple-500/20 border-purple-500/30' },
    headline: '"Sticky Coastlines & Sweet Tide-Salt Markets"',
    caption:
      'Honeywood County features sticky, sweet saltwater shorelines and busy <span class="text-purple-300 font-semibold">tide-salt markets</span>. Local sailors harvest the sweet surf under a warm golden sun.\n\nMerchants gather daily to trade caramel candies, salt crystals, and maritime goods at the busy docks. New arrivals are invited to explore the trading ports of <span class="text-purple-300">Caramel Cove</span>.',
    detail: 'Starter Town: Caramel Cove is open to all New Arrivals.',
    townReaction: [
      { pct: 79, text: 'trade sticky caramel salt daily' },
      { pct: 15, text: 'hate sticky shoes from shoreline walks' },
      { pct: 6, text: 'say caramel pools heal minor wounds' },
    ],
    actions: [
      '□ Help load caramel candy crates onto trade ships.',
      '□ Harvest tide-salt crystals from the caramel flats.',
      '□ Chart coastal shipping routes with Caramel Sailors.',
    ],
  },
  {
    id: 'creamwood-county',
    type: 'snapshot',
    image: '/Assets/WelcomeShow/CreamwoodCounty.png',
    character: 'Dr. Fudge',
    location: '🌋 Lava Cake Lake — Geothermal Springs',
    category: { label: '🏔 Glacial', color: 'text-cyan-300', bg: 'bg-cyan-500/20 border-cyan-500/30' },
    headline: '"Glacial Heights & Geothermal Springs"',
    caption:
      'Creamwood County is a dramatic land of frozen heights, hot chocolate-steam geysers, and freezing <span class="text-cyan-300 font-semibold">mint patrol squads</span> that maintain security along the glacial borders.\n\nDr. Fudge runs the local geothermal clinic near the hot springs, while guards keep watch for Frost Salamanders. New arrivals can begin their journey at the snow-capped <span class="text-cyan-300">Peppermint Peaks</span>.',
    detail: 'Starter Town: Peppermint Peaks is open to all New Arrivals.',
    townReaction: [
      { pct: 65, text: 'complain about freezing mountain winds' },
      { pct: 27, text: 'enjoy hot geysers for winter baths' },
      { pct: 8, text: 'are afraid of Frost Salamanders' },
    ],
    actions: [
      '□ Join the mint patrol for high-altitude security.',
      '□ Collect Frost Salamander mucus for the clinic.',
      '□ Keep geyser vents clear of accumulated volcanic ash.',
    ],
  },
  {
    id: 'choose-town-action',
    type: 'choose-town',
    image: '/Assets/WelcomeShow/ChocoBrook_Map.png',
  },
];



// ── Letter Decree Data ──────────────────────────────────────
const ROYAL_DECREE_PARAGRAPHS = [
  'You are now within the Chocolate era, in Confection Year 400, in the royal province of ChocoBrook - a land where the aroma of aged cocoa meets the sea-spray of the Praline coast.',
  'At the heart of this realm stands Toffee Town, the capital, where caramel-lit roads, marble-spun galleries, and ancient trade guilds gather the spirit of the province into one radiant center of gravity.',
  'Beyond the capital lie 4 great counties and 16 distinct towns. From the frozen spires of Peppermint Peak to the bustling docks of Butterscotch Port, each settlement carries its own unique history and secret.',
  'Here, laughter drifts through the markets, carried on the scent of cocoa and spice. Lanterns glow warmly at dusk, guiding travelers toward stories waiting to be discovered. And every street corner holds a promise — that wonder is never far from your touch.',
  'Within this application, you are invited to explore a living world - a tapestry of stories, trade routes, rail systems, and town level conflicts that turn beauty into narrative stakes.',
  'ChocoBrook is not merely to be read; it is to be felt. Step forth as a guest of the Crown, and let the province reveal its heart to you.'
];

const TRAVELLER_QUOTES = [
  { type: "Explorer's Discovery", text: "I once saw the cocoa rivers flowing uphill during the Great Caramel Solstice—a sight you'll never forget!", color: "amber" },
  { type: "Traveller's Log", text: "Always keep a spare toffee handy; the local squirrels are fierce barters and they won't settle for apologies!", color: "cyan" },
  { type: "Explorer's Discovery", text: "If you whistle a jazz tune near Peppermint Peak, the mountains might actually echo back in harmony.", color: "amber" },
  { type: "Traveller's Log", text: "Never ask a Nutwood baker for their 'secret' ingredient unless you're prepared to join their family for Sunday dinner.", color: "cyan" },
  { type: "Explorer's Discovery", text: "Rumor has it that the trains move faster if you whisper 'sweet dreams' to the locomotive engine.", color: "amber" },
  { type: "Traveller's Log", text: "If a pigeon offers you a map of the coast, take it—but don't be surprised if it only leads to the nearest fudge stand.", color: "cyan" },
  { type: "Explorer's Discovery", text: "The golden stars of the province don't just point north; they point toward the nearest fresh batch of pralines.", color: "amber" },
  { type: "Traveller's Log", text: "In Creamwood, the fog smells like vanilla—don't try to eat the clouds, I’ve already tried for you.", color: "cyan" }
];

// ── Main WelcomeShow ───────────────────────────────────────
const WelcomeShow: React.FC = () => {
  const { setPage, setWelcomeDone, homeTown, addCoins, addLegacy } = useTTStore();
  const [idx, setIdx] = useState(0);
  const [transitioning, setTransitioning] = useState(false);
  const [showWarning, setShowWarning] = useState(false);

  // Interactive Task & Assignment States
  const [showAssignment, setShowAssignment] = useState(false);
  const [executingTaskIdx, setExecutingTaskIdx] = useState<number | null>(null);
  const [taskProgress, setTaskProgress] = useState<number>(0);
  const [completedTasks, setCompletedTasks] = useState<Record<string, number[]>>({});

  // Pick random quotes once on mount
  const selectedQuotes = useState(() => {
    const shuffled = [...TRAVELLER_QUOTES].sort(() => 0.5 - Math.random());
    return [shuffled[0] || TRAVELLER_QUOTES[0], shuffled[1] || TRAVELLER_QUOTES[1]];
  })[0];

  const slide = SLIDES[idx];
  const isLast = idx === SLIDES.length - 1;
  const isFirst = idx === 0;

  const goTo = useCallback((next: number) => {
    if (transitioning) return;
    setTransitioning(true);
    setTimeout(() => {
      setIdx(Math.max(0, Math.min(SLIDES.length - 1, next)));
      setShowAssignment(false); // Reset assignment view on slide change
      setExecutingTaskIdx(null); // Reset active task execution
      setTaskProgress(0);
      setTransitioning(false);
    }, 300);
  }, [transitioning]);

  const handlePerformTask = (taskIdx: number) => {
    if (executingTaskIdx !== null) return; // Only allow one task at a time

    setExecutingTaskIdx(taskIdx);
    setTaskProgress(0);

    const duration = 1500; // 1.5s simulation
    const steps = 15;
    const intervalTime = duration / steps;
    let currentStep = 0;

    const interval = setInterval(() => {
      currentStep++;
      setTaskProgress((currentStep / steps) * 100);

      if (currentStep >= steps) {
        clearInterval(interval);

        // Mark as completed
        setCompletedTasks(prev => {
          const list = prev[slide.id] || [];
          if (!list.includes(taskIdx)) {
            return { ...prev, [slide.id]: [...list, taskIdx] };
          }
          return prev;
        });

        // Reward the player: +15 Coins, +5 Legacy Points
        const actionText = slide.actions ? slide.actions[taskIdx].replace(/^[□\s-]+/, '') : 'Task';
        addCoins(15, `Completed Assignment: ${actionText}`);
        addLegacy(5);

        setExecutingTaskIdx(null);
        setTaskProgress(0);
      }
    }, intervalTime);
  };

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') goTo(idx + 1);
      if (e.key === 'ArrowLeft')  goTo(idx - 1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [idx, goTo]);

  const handleSkip = () => {
    if (homeTown) {
      setWelcomeDone(true);
      setPage('desk');
    } else {
      setShowWarning(true);
    }
  };

  const handleChooseTown = () => {
    setWelcomeDone(true);
    setPage('choose-town');
  };

  return (
    <div className="relative w-full h-screen flex items-center justify-center p-4 md:p-8 overflow-hidden select-none">
      <div
        className="relative z-10 w-[92vw] h-[96vh] max-h-[96vh] rounded-[2.5rem] border-2 border-white/35 bg-black/60 shadow-[inset_0_1px_2px_rgba(255,255,255,0.25),_0_40px_120px_rgba(0,0,0,0.65)] overflow-hidden flex flex-row"
        style={{ backdropFilter: 'none', WebkitBackdropFilter: 'none' }}
      >
        {/* ── Slide: Letter ── */}
        {slide.type === 'letter' && (
          <div className="h-full w-full flex flex-col p-8 lg:p-12 justify-between select-none font-body overflow-y-auto custom-scrollbar">
            {/* Inner Content Grid */}
            <div className="flex-1 w-full grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 overflow-visible">
              
              {/* LEFT COLUMN: Decree Intro, Warning, Decree Part 1, Discovery */}
              <div className="flex flex-col gap-4 justify-start">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.5em] text-amber-400 mb-1.5">
                    ChocoBrook Provincial Entry
                  </p>
                  <h2 
                    className="text-4xl lg:text-[3.2rem] font-brand text-white uppercase leading-[0.95] tracking-tight"
                    style={{ fontFamily: '"Josefin Sans", sans-serif' }}
                  >
                    Welcome <span className="text-amber-300">Traveller,</span>
                  </h2>
                  <div className="h-[3px] w-40 bg-gradient-to-r from-amber-400 via-amber-200 to-transparent mt-3" />
                </div>

                {/* Warning box */}
                <div className="rounded-2xl border border-white/10 bg-white/5 px-6 py-4 flex flex-col justify-center shrink-0">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-400 mb-0.5">Warning</h3>
                  <p className="italic text-white/80 text-[0.95rem] leading-snug font-body">
                    This place is sweet, strange, and slightly unpredictable... Proceed with Smile!
                  </p>
                </div>

                {/* Decree paragraphs 1-3 */}
                <div className="space-y-4 text-[1rem] leading-relaxed text-white/85 font-body">
                  {ROYAL_DECREE_PARAGRAPHS.slice(0, 3).map((paragraph, idx) => (
                    <p key={idx}>
                      {idx === 0 ? (
                        <>
                          <span className="text-5xl font-serif italic float-left mt-0.5 mr-3 leading-none text-amber-400 border-b border-amber-200">Y</span>
                          {paragraph.startsWith('You') 
                            ? `ou are now within the Chocolate era, ${paragraph.split(',').slice(1).join(',')}` 
                            : paragraph}
                        </>
                      ) : (
                        paragraph
                      )}
                    </p>
                  ))}
                </div>

                {/* Discovery Box */}
                <div className="mt-4 shrink-0">
                  <div className="rounded-2xl border border-amber-400/25 bg-amber-400/5 px-5 py-3 flex items-center gap-4 shadow-sm">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-amber-400/20 border border-amber-400/30 flex items-center justify-center shadow-inner">
                      <span className="material-icons-round text-amber-400 text-sm">star</span>
                    </div>
                    <p className="text-[12.5px] font-body italic text-white/70 leading-relaxed">
                      <span className="font-black text-amber-400 not-italic uppercase tracking-[0.2em] text-[9px] block mb-0.5">
                        Traveller's Discovery
                      </span>
                      "{selectedQuotes[0].text}"
                    </p>
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN: Decree Part 2, Fun Fact, Signature card, Buttons */}
              <div className="flex flex-col gap-4 justify-between">
                {/* Decree paragraphs 4-6 */}
                <div className="space-y-4 text-[1rem] leading-relaxed text-white/85 font-body">
                  {ROYAL_DECREE_PARAGRAPHS.slice(3).map((paragraph, idx) => (
                    <p key={idx}>{paragraph}</p>
                  ))}
                </div>

                {/* Fun Fact Box */}
                <div className="shrink-0">
                  <div className="rounded-2xl border border-cyan-400/25 bg-cyan-400/5 px-5 py-3 flex items-center gap-4 shadow-sm">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-cyan-400/20 border border-cyan-400/30 flex items-center justify-center shadow-inner">
                      <span className="material-icons-round text-cyan-300 text-sm">star</span>
                    </div>
                    <p className="text-[12.5px] font-body italic text-white/70 leading-relaxed">
                      <span className="font-black text-cyan-300 not-italic uppercase tracking-[0.2em] text-[9px] block mb-0.5">
                        Traveller's Fun Fact
                      </span>
                      "{selectedQuotes[1].text}"
                    </p>
                  </div>
                </div>

                {/* Signature Box */}
                <div className="flex items-center justify-between gap-6 rounded-2xl border border-white/10 bg-black/40 p-5 shadow-xl backdrop-blur-md transition-all hover:scale-[1.01]">
                  <div className="space-y-1">
                    <div className="opacity-40 text-[8px] font-black uppercase tracking-[0.6em] text-white leading-none">
                      With Warm Regards,
                    </div>
                    <div 
                      className="font-brand text-3xl text-white uppercase tracking-widest leading-none pt-2"
                      style={{ fontFamily: '"Josefin Sans", sans-serif' }}
                    >
                      Yogesh S Iyer
                    </div>
                    <div className="text-[9px] font-bold text-amber-300/80 tracking-[0.3em] uppercase mt-1">
                      BONBON STUDIOS
                    </div>
                  </div>
                  <div className="h-10 w-px bg-white/10 mx-1" />
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500 shadow-[0_8px_20px_rgba(245,158,11,0.3)] border border-white/20 transition-transform hover:rotate-12 cursor-pointer group">
                    <span className="material-icons-round text-black text-2xl group-hover:scale-110 transition-transform">star</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-6 w-full pt-2">
                  <GlassButton
                    label={
                      <span className="flex items-center justify-center gap-2">
                        <span className="material-icons-round text-base">home</span>
                        Skip to Homepage
                      </span>
                    }
                    onClick={handleSkip}
                    variant="secondary"
                    className="!w-full !min-w-0"
                  />
                  <GlassButton
                    label="Enter the World →"
                    onClick={() => goTo(1)}
                    variant="primary"
                    className="!w-full !min-w-0"
                  />
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ── Slide: Choose Town ── */}
        {slide.type === 'choose-town' && (
          <>
            {/* LEFT: Header + Image panel (Strictly 70%, flex flex-col) */}
            <div className="relative w-[70%] shrink-0 h-full overflow-hidden bg-black/20 flex flex-col p-8 gap-4">
              {/* Top Left Header (Two lines) */}
              <div className="text-left shrink-0">
                <div className="text-[10px] font-black uppercase tracking-[0.35em] text-white/40">
                  The Imperial Province of Chocobrook
                </div>
                <div className="text-sm font-semibold text-amber-300 font-body mt-1">
                  Territorial Map
                </div>
              </div>

              {/* Image Container */}
              <div className="flex-1 w-full overflow-hidden flex items-center justify-center">
                {slide.image && (
                  <img
                    src={slide.image}
                    alt="ChocoBrook Map"
                    className="max-w-full max-h-full object-contain rounded-2xl"
                  />
                )}
              </div>
            </div>

            {/* RIGHT: Text panel (Strictly 30%) */}
            <div
              className={`w-[30%] shrink-0 h-full overflow-y-auto custom-scrollbar flex flex-col p-6 gap-6 border-l border-white/15 bg-black/25 transition-opacity duration-300 ${transitioning ? 'opacity-0' : 'opacity-100'}`}
            >
              <div>
                <div className="text-[10px] font-black uppercase tracking-[0.35em] text-white/40 mb-1">
                  The Province Awaits
                </div>
                <h1
                  className="font-brand text-3xl text-white uppercase tracking-tight leading-tight"
                  style={{ fontFamily: '"Luckiest Guy", cursive' }}
                >
                  Your Path
                </h1>
              </div>
              <p className="text-white/80 font-body italic text-sm leading-relaxed flex-grow">
                You have seen the land, the politics, the characters, and the crises.
                <br /><br />
                It is time to choose your home town and begin your Traveller legacy.
              </p>

              <div className="flex items-center gap-2 justify-center my-2 shrink-0">
                {SLIDES.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => goTo(i)}
                    className={`rounded-full transition-all duration-300 ${i === idx ? 'w-5 h-2 bg-amber-400' : 'w-2 h-2 bg-white/20 hover:bg-white/40'}`}
                  />
                ))}
              </div>

              <div className="mt-auto pt-4 flex flex-col gap-3 shrink-0">
                <GlassButton
                  label="🏘 Choose Your Town →"
                  onClick={handleChooseTown}
                  className="w-full !rounded-xl"
                />
                <button
                  onClick={() => goTo(idx - 1)}
                  className="text-white/40 hover:text-white/70 text-xs font-bold uppercase tracking-widest transition-colors mt-2"
                >
                  ← Go Back
                </button>
              </div>
            </div>
          </>
        )}

        {/* ── Slide: Standard Narrative Snapshot ── */}
        {slide.type === 'snapshot' && (
          <>
            {/* Toggle Button on the vertical split edge */}
            <button
              onClick={() => {
                setShowAssignment(!showAssignment);
                setExecutingTaskIdx(null); // Reset execution states
              }}
              className="absolute top-1/2 left-[70%] -translate-y-1/2 -translate-x-1/2 z-20 flex items-center justify-center gap-2 px-5 py-2.5 bg-neutral-900 border-2 border-amber-400 text-amber-300 font-brand text-[11px] uppercase tracking-widest rounded-full hover:bg-neutral-800 hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(251,191,36,0.85)] animate-bounce-subtle cursor-pointer"
              style={{ animationDuration: '4s' }}
            >
              <span className="material-icons-round text-sm">
                {showAssignment ? 'image' : 'assignment'}
              </span>
              <span>{showAssignment ? 'View Scene' : 'Perform Tasks'}</span>
            </button>

            {/* LEFT Panel (70%) */}
            {!showAssignment ? (
              /* Image View (Default) */
              <div className="relative w-[70%] shrink-0 h-full overflow-hidden bg-black/20 flex flex-col p-8 gap-4 animate-fade-in">
                {/* Top Left Header (Two lines) */}
                <div className="text-left shrink-0">
                  <div className="text-[10px] font-black uppercase tracking-[0.35em] text-white/40">
                    The Imperial Province of Chocobrook
                  </div>
                  <div className="text-sm font-semibold text-amber-300 font-body mt-1">
                    {slide.location}
                  </div>
                </div>

                {/* Image Container */}
                <div
                  className="flex-1 w-full overflow-hidden flex items-center justify-center transition-opacity duration-300 relative"
                  style={{ opacity: transitioning ? 0 : 1 }}
                >
                  {slide.image && (
                    <img
                      src={slide.image}
                      alt={slide.headline}
                      className="max-w-full max-h-full object-contain rounded-2xl"
                    />
                  )}
                  {/* Subtle pulsing tip overlay on the image */}
                  <div className="absolute bottom-4 right-4 bg-black/85 border border-amber-400/40 px-3 py-1.5 rounded-xl text-[10.5px] text-white/90 shadow-md backdrop-blur-sm animate-pulse flex items-center gap-1.5 pointer-events-none select-none">
                    <span className="material-icons-round text-amber-400 text-xs animate-float">lightbulb</span>
                    <span>Click <strong>"Perform Tasks"</strong> on the right border to run operations!</span>
                  </div>
                </div>
              </div>
            ) : (
              /* Sub-page View (Text & interactive assignments area - No Image) */
              <div className="relative w-[70%] shrink-0 h-full overflow-hidden bg-neutral-950/95 border-r border-white/5 flex flex-col p-8 gap-6 justify-between animate-fade-in font-body">
                {/* Header */}
                <div className="flex justify-between items-start shrink-0">
                  <div>
                    <div className="text-[10px] font-black uppercase tracking-[0.35em] text-amber-400">
                      Assignment & Action Portal
                    </div>
                    <h2 className="text-2xl font-brand text-white uppercase mt-1" style={{ fontFamily: '"Luckiest Guy", cursive' }}>
                      {slide.character ? `${slide.character}'s Request` : 'Local Assignment'}
                    </h2>
                  </div>
                  {slide.category && (
                    <span className={`text-[9px] font-black uppercase tracking-wider px-3 py-1.5 rounded-full border ${slide.category.bg} ${slide.category.color}`}>
                      {slide.category.label}
                    </span>
                  )}
                </div>

                {/* Cooperative alert panel */}
                <div className="rounded-2xl border border-amber-500/25 bg-amber-500/10 px-5 py-3.5 flex items-start gap-3.5 shadow-md shrink-0">
                  <span className="material-icons-round text-amber-300 text-xl mt-0.5 animate-float">assignment</span>
                  <div className="flex flex-col gap-0.5 text-left">
                    <h4 className="text-[11px] font-black uppercase tracking-widest text-amber-300">Cozy Citizen Operation</h4>
                    <p className="text-[12px] text-white/85 leading-relaxed">
                      Review the dossier narrative, then perform each assignment to help the local representative. Completing operations rewards you with <span className="text-emerald-400 font-semibold font-sans">+15 Coins</span> and <span className="text-amber-300 font-semibold font-sans">+5 Legacy</span>.
                    </p>
                  </div>
                </div>

                {/* Story Narrative Scroll Box */}
                <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar pr-2 flex flex-col gap-4 text-white/90 text-sm leading-relaxed">
                  <div className="border-l-2 border-amber-400/30 pl-4 py-1.5 italic bg-white/5 rounded-r-xl p-3.5">
                    <h4 className="text-xs font-black uppercase tracking-wider text-amber-300 mb-1">Dossier Narrative</h4>
                    {slide.caption?.split('\n\n').map((para, i) => (
                      <p key={i} className="mb-2 last:mb-0" dangerouslySetInnerHTML={{ __html: para }} />
                    ))}
                  </div>

                  {/* Assignment Task List */}
                  <div className="mt-2 flex flex-col gap-3.5">
                    <h3 className="text-xs font-black uppercase tracking-[0.2em] text-white/50">Tasks & Operations</h3>

                    {slide.actions && slide.actions.length > 0 ? (
                      slide.actions.map((act, taskIdx) => {
                        const cleanAct = act.replace(/^[□\s-]+/, '').trim();
                        const isCompleted = (completedTasks[slide.id] || []).includes(taskIdx);
                        const isExecuting = executingTaskIdx === taskIdx;

                        return (
                          <div
                            key={taskIdx}
                            className={`relative border rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between transition-all duration-300 bg-black/60 hover:scale-[1.01]
                              ${isCompleted ? 'border-emerald-500/40 bg-emerald-950/5' : isExecuting ? 'border-amber-400/40 bg-amber-950/5' : 'border-white/10 hover:border-amber-400/30'}`}
                          >
                            <div className="flex items-start gap-3.5 flex-1 mr-4">
                              <span className={`material-icons-round text-xl mt-0.5 shrink-0 ${isCompleted ? 'text-emerald-400' : isExecuting ? 'text-amber-400 animate-spin-slow' : 'text-neutral-500'}`}>
                                {isCompleted ? 'check_circle' : isExecuting ? 'rotate_right' : 'radio_button_unchecked'}
                              </span>
                              <div className="flex flex-col">
                                <span className={`text-[13.5px] font-medium leading-snug ${isCompleted ? 'text-white/60 line-through' : 'text-white'}`}>
                                  {cleanAct}
                                </span>
                                {isCompleted && (
                                  <div className="flex items-center gap-1 bg-emerald-950/40 border border-emerald-500/30 px-3 py-1 rounded-lg text-emerald-300 font-bold uppercase tracking-wider text-[9px] mt-2.5 w-fit">
                                    <span className="material-icons-round text-[11px]">check_circle</span>
                                    <span>Operation Executed: +15 Coins, +5 Legacy added to Ledger</span>
                                  </div>
                                )}
                                {isExecuting && (
                                  <div className="w-56 bg-neutral-800 rounded-full h-1 mt-2.5 overflow-hidden">
                                    <div className="bg-amber-400 h-full transition-all duration-100" style={{ width: `${taskProgress}%` }} />
                                  </div>
                                )}
                              </div>
                            </div>

                            <button
                              disabled={isCompleted || executingTaskIdx !== null}
                              onClick={() => handlePerformTask(taskIdx)}
                              className={`mt-3 sm:mt-0 px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all duration-200 shrink-0 cursor-pointer
                                ${isCompleted
                                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 cursor-default'
                                  : isExecuting
                                    ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20 cursor-default'
                                    : executingTaskIdx !== null
                                      ? 'bg-neutral-800 text-neutral-500 border border-neutral-700 cursor-not-allowed'
                                      : 'bg-amber-500 hover:bg-amber-400 text-black shadow-md hover:scale-105 active:scale-95'}`}
                              style={{ fontFamily: '"Josefin Sans", sans-serif' }}
                            >
                              {isCompleted ? 'Finished' : isExecuting ? `Loading ${Math.round(taskProgress)}%` : 'Perform Task'}
                            </button>
                          </div>
                        );
                      })
                    ) : (
                      <div className="text-xs text-white/40 italic">No operations listed for this slide.</div>
                    )}
                  </div>
                </div>

                {/* Quick tip footer */}
                <div className="text-[10px] text-white/30 italic text-center shrink-0 border-t border-white/5 pt-2">
                  Completing tasks boosts your residency standing and rewards you with real coins.
                </div>
              </div>
            )}

            {/* RIGHT Panel (30%) */}
            <div
              className={`w-[30%] shrink-0 h-full overflow-y-auto custom-scrollbar flex flex-col p-6 gap-4 border-l border-white/15 bg-black/25 transition-opacity duration-300 ${transitioning ? 'opacity-0' : 'opacity-100'}`}
            >
              {/* Header location */}
              <div className="flex flex-col gap-1 shrink-0">
                <span className="text-[9px] font-black uppercase tracking-[0.25em] text-white/40">
                  {slide.location ? slide.location.split(' — ')[0].trim() : 'ChocoBrook'}
                </span>
                {slide.category && (
                  <div className="inline-flex w-fit text-[9px] font-black uppercase tracking-[0.2em] px-2.5 py-1 rounded-full border bg-neutral-900 border-white/10 text-amber-300">
                    {slide.category.label}
                  </div>
                )}
              </div>

              {/* Headline */}
              <h2 className="font-brand text-lg text-white leading-snug shrink-0 font-bold mt-1">
                {slide.headline}
              </h2>

              {/* Key Details Summary */}
              <div className="text-white/80 font-body text-xs leading-relaxed space-y-2">
                <div className="font-black text-amber-400 uppercase tracking-widest text-[9px] border-b border-white/5 pb-1">
                  Important Info
                </div>
                <div className="flex gap-2">
                  <span className="text-amber-300">✦</span>
                  <span><strong>Resident Agent:</strong> {slide.character || 'Imperial Registry'}</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-amber-300">✦</span>
                  <span><strong>Locality:</strong> {slide.location || 'Outer County Area'}</span>
                </div>
              </div>

              {/* Town Pulse or Fun Fact */}
              {slide.detail && (
                <div className="border border-cyan-400/20 rounded-2xl bg-cyan-500/5 p-3 text-xs">
                  <div className="text-[9px] font-black uppercase tracking-[0.3em] text-cyan-400 mb-1">Registry Fact</div>
                  <p className="text-white/70 font-body italic leading-normal">
                    {slide.detail}
                  </p>
                </div>
              )}

              {slide.townReaction && (
                <div className="border border-amber-400/20 rounded-2xl bg-amber-500/5 p-3 text-xs">
                  <div className="text-[9px] font-black uppercase tracking-[0.3em] text-amber-400 mb-2">Town Pulse</div>
                  <div className="flex flex-col gap-1.5">
                    {slide.townReaction.slice(0, 2).map((r, i) => (
                      <div key={i} className="flex gap-2 text-white/80 text-[11px] leading-snug">
                        <span className="font-black text-amber-300 shrink-0">{r.pct}%</span>
                        <span className="truncate">{r.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Preview Player Action list */}
              <div className="border border-white/5 rounded-2xl bg-white/5 p-3 text-xs">
                <div className="text-[9px] font-black uppercase tracking-[0.3em] text-white/50 mb-2">Assignments List</div>
                <div className="flex flex-col gap-1.5 font-body text-[11.5px] text-white/70">
                  {slide.actions && slide.actions.length > 0 ? (
                    slide.actions.map((act, i) => {
                      const isCompleted = (completedTasks[slide.id] || []).includes(i);
                      return (
                        <div key={i} className="flex items-start gap-1.5">
                          <span className={`material-icons-round text-[13px] mt-0.5 shrink-0 ${isCompleted ? 'text-emerald-400' : 'text-neutral-500'}`}>
                            {isCompleted ? 'check_circle' : 'pending_actions'}
                          </span>
                          <span className={`truncate ${isCompleted ? 'line-through text-white/40' : ''}`}>
                            {act.replace(/^[□\s-]+/, '')}
                          </span>
                        </div>
                      );
                    })
                  ) : (
                    <div className="italic text-white/40">No actions required.</div>
                  )}
                </div>
              </div>

              {/* Bottom Navigation */}
              <div className="mt-auto shrink-0 pt-4 flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => goTo(idx - 1)}
                    disabled={isFirst}
                    className={`w-9 h-9 rounded-full flex items-center justify-center border transition-all duration-200
                      ${isFirst
                        ? 'border-white/10 text-white/20 cursor-not-allowed'
                        : 'border-white/20 text-white hover:bg-white/10 hover:scale-110'}`}
                  >
                    <span className="material-icons-round text-base">chevron_left</span>
                  </button>

                  <div className="flex items-center gap-1.5 flex-1 justify-center">
                    {SLIDES.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => goTo(i)}
                        className={`rounded-full transition-all duration-300 ${i === idx ? 'w-4 h-1.5 bg-amber-400' : 'w-1.5 h-1.5 bg-white/20 hover:bg-white/40'}`}
                      />
                    ))}
                  </div>

                  <button
                    onClick={() => isLast ? handleChooseTown() : goTo(idx + 1)}
                    className="w-9 h-9 rounded-full flex items-center justify-center border border-amber-400/40 text-amber-400 hover:bg-amber-500/10 hover:scale-110 transition-all duration-200"
                  >
                    <span className="material-icons-round text-base">{isLast ? 'flag' : 'chevron_right'}</span>
                  </button>
                </div>

                <div className="flex justify-center">
                  <button
                    onClick={handleSkip}
                    className="text-white font-black text-[9px] uppercase tracking-[0.25em] px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-all"
                  >
                    Skip to Town Selection →
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Warning Modal */}
      {showWarning && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/80">
          <div className="relative z-10 max-w-md w-full rounded-3xl border border-amber-400/30 bg-neutral-900 p-8 flex flex-col gap-6 shadow-[0_0_60px_rgba(251,191,36,0.15)] text-center animate-fade-in-up">
            <div className="text-5xl">⚠️</div>
            <h3 className="font-brand text-2xl text-amber-400 uppercase tracking-wider leading-none" style={{ fontFamily: '"Luckiest Guy", cursive' }}>
              Town Required!
            </h3>
            <p className="text-white/80 text-sm font-body leading-relaxed">
              You haven't chosen your home town yet! To explore the province, complete missions, and earn legacy points, you must first select a town.
            </p>
            <div className="flex flex-col gap-3">
              <GlassButton
                label="🏘 Select Home Town"
                onClick={() => {
                  setShowWarning(false);
                  setWelcomeDone(true);
                  setPage('choose-town');
                }}
                variant="primary"
                className="w-full animate-pulse-glow"
              />
              <button
                onClick={() => setShowWarning(false)}
                className="text-white/40 hover:text-white/70 text-xs font-bold uppercase tracking-widest transition-colors underline"
              >
                Close Warning
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WelcomeShow;
