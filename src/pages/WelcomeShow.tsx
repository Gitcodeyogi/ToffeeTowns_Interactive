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
    detail: 'Pompelmoose\'s budget: 40% golden spoons, 0% working roads.',
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
    detail: 'Seeking corporate sponsorship from local dentists after a wild mint-cream crash.',
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
    detail: 'Volunteers wanted! Warning: Candy parachutes are mostly decorative.',
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
    detail: 'Volcanic steam warning: May cause severe chocolate cravings and peppermint hair.',
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
    detail: 'Forest scientist Milo Spark is looking for people to sing jazz to glowing fungi.',
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
    detail: 'Caution: Off-trail walking may lead to sticky caramel shoes and crumbs.',
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
    detail: 'Gate security is sweet but strict—no entrance without 1200+ Legacy points!',
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
    detail: 'Pack your bags for cozy treehouses, glowing trails, and ranger tax collectors.',
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
    detail: 'Bring a warm blanket and a big appetite for toasted campfire gossip!',
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
    detail: 'Sweet shorelines, sticky sea trade, and endless caramel taffy pools!',
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
    detail: 'Glacial heights and cozy hot springs—bring both a parka and a swimsuit!',
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
  }
];



// ── Letter Decree Data ──────────────────────────────────────
const ROYAL_DECREE_PARAGRAPHS = [
  'We\'ve been expecting you... Word of your arrival reached us before you did.',
  'Our border squirrels spotted you carrying a suitcase of big dreams (and hopefully, cookies!).',
  'Welcome to ChocoBrook, our cozy fantasy province where you can join the fun and write your own story.',
  'Here, laughter drifts through the markets on the scent of warm cocoa. Lanterns glow at dusk, guiding you toward cozy stories, while friendly townsfolk wait with open arms. Every corner holds a promise of magic.',
  'Ready to jump in? Pick your favorite starter town, move into a cute customizable cottage, and decorate it to make it the coziest nest in the province!',
  'Don\'t get too comfy in that hammock! There\'s plenty of neighborhood drama to solve. Team up for community construction projects, investigate woodland mysteries, and sponsor grand campaigns.',
  'Get ready to meet unforgettable characters like Pipkin, Rowan, Julie, and other lovely folks you\'ll adore!',
  'Help out to earn shiny Cocoa Coins for adorable new decor! Keep your passport handy to log your presence, collect colorful stamps, and unlock prestigious badges.',
  'Earn Legacy points to rank up as a master Builder, Healer, or Explorer, and climb the global leaderboard. Your sweet choices will write tomorrow\'s headlines!',
  'Chat with Cocoa the Lore Keeper, swap tips with friends, and check the bulletins. ChocoBrook is a living, growing world shaped by you. Grab a cup of cocoa and let\'s begin!'
];

const TRAVELLER_QUOTES = [
  // ── Explorer's Discovery (15) ──
  { type: "Explorer's Discovery", text: "I once saw the cocoa rivers of Cocoawood County flow backwards during the Solstice—a sight you'll never forget!", color: "amber" },
  { type: "Explorer's Discovery", text: "If you whistle a sweet jazz tune near Peppermint Peak, the icy mountains will echo back a three-part harmony.", color: "amber" },
  { type: "Explorer's Discovery", text: "The golden stars of Toffee Town don't point north; they pivot toward the nearest batch of hot pralines.", color: "amber" },
  { type: "Explorer's Discovery", text: "If you leave a marshmallow overnight in Ganache Grove, it will sprout tiny candy wings by sunrise!", color: "amber" },
  { type: "Explorer's Discovery", text: "The bubbling springs of Lava Cake Lake are actually 70% dark chocolate—highly recommended for warm dips!", color: "amber" },
  { type: "Explorer's Discovery", text: "During the winter solstice, the stars above Caramel Cove align to form a giant, glowing caramel pretzel.", color: "amber" },
  { type: "Explorer's Discovery", text: "I discovered that hazelnut trees in Hazelnut Terrace grow faster when you tell them wholesome bedtime stories.", color: "amber" },
  { type: "Explorer's Discovery", text: "Deep inside the Ganache Grove canopy, there's a secret branch that plays acoustic harp sounds when wind passes.", color: "amber" },
  { type: "Explorer's Discovery", text: "If you stand still in Caramel Cove at noon, the ocean waves sound like sticky syrup gently bubbling.", color: "amber" },
  { type: "Explorer's Discovery", text: "The geothermal vents of Lava Cake Lake blow chocolate-scented smoke rings that float for miles.", color: "amber" },
  { type: "Explorer's Discovery", text: "At the peak of Peppermint Heights, the snow is actually sweet mint-shavings—bring a spoon with you!", color: "amber" },
  { type: "Explorer's Discovery", text: "The cobblestones of Toffee Town are made of polished hard butterscotch, making step-dancing incredibly clicky!", color: "amber" },
  { type: "Explorer's Discovery", text: "Underneath Hazelnut Terrace, ancient crystal deposits hum at a pitch that makes squirrels start waltzing.", color: "amber" },
  { type: "Explorer's Discovery", text: "I found a hidden lagoon near Caramel Cove where the sand is entirely composed of golden brown sugar.", color: "amber" },
  { type: "Explorer's Discovery", text: "Deep within Peppermint Peaks, the glacial ice holds fossilized mint leaves from the Great Cocoa Flood.", color: "amber" },

  // ── Traveller's Log / Fun Fact (15) ──
  { type: "Traveller's Log", text: "Always keep a spare piece of toffee handy; the squirrels of Cocoawood County are fierce, sweet-toothed negotiators!", color: "cyan" },
  { type: "Traveller's Log", text: "Never ask a Hazelnut Terrace elder for their secret recipe unless you're ready to marry into the baking clan!", color: "cyan" },
  { type: "Traveller's Log", text: "If a beach pigeon in Caramel Cove offers you a map, don't follow it—it only leads to the nearest fudge stand.", color: "cyan" },
  { type: "Traveller's Log", text: "In the frosted county of Creamwood, the mountain fog smells like pure vanilla—don't try to eat the clouds!", color: "cyan" },
  { type: "Traveller's Log", text: "Don't try to race the gingerbread rabbits of Hazelnut Terrace. They curl into balls and roll aerodynamically!", color: "cyan" },
  { type: "Traveller's Log", text: "If Pippa Bolt offers you a test flight on the Bumblebird aircraft, make sure you bring a candy parachute!", color: "cyan" },
  { type: "Traveller's Log", text: "Never make direct eye contact with a Ganache Grove forest ranger while eating chocolate, or prepare to pay a tax.", color: "cyan" },
  { type: "Traveller's Log", text: "The street sweepers of Toffee Town are officially paid in caramel drops, which makes it the cleanest capital around.", color: "cyan" },
  { type: "Traveller's Log", text: "If you drop a marshmallow in the Lava Cake Lake springs, it immediately inflates to the size of a pillow!", color: "cyan" },
  { type: "Traveller's Log", text: "In Caramel Cove, the sea-crabs walk sideways to avoid getting their little claws stuck in the warm shoreline syrup.", color: "cyan" },
  { type: "Traveller's Log", text: "The guard towers in Peppermint Peaks are built from giant candy canes—tasty, but terrible in a heatwave!", color: "cyan" },
  { type: "Traveller's Log", text: "Elders in Hazelnut Terrace claim that holding a toasted nut to your ear lets you hear the local forest gossip.", color: "cyan" },
  { type: "Traveller's Log", text: "If Chucklebop invites you to race on his rocket-powered raft, wrap your hair tightly—mint cream is hard to wash out!", color: "cyan" },
  { type: "Traveller's Log", text: "The mayor of Toffee Town once banned broccoli, replacing it with green-colored white chocolate for administrative peace.", color: "cyan" },
  { type: "Traveller's Log", text: "Acoustic scientist Milo Spark swears the Ganache Grove mushrooms only dance when they hear upbeat jazz tunes.", color: "cyan" }
];

// ── Main WelcomeShow ───────────────────────────────────────
const WelcomeShow: React.FC = () => {
  const { setPage, setWelcomeDone, homeTown } = useTTStore();
  const [idx, setIdx] = useState(0);
  const [transitioning, setTransitioning] = useState(false);
  const [showWarning, setShowWarning] = useState(false);



  // Pick random quotes once on mount, filtering by type to match layout headers
  const selectedQuotes = useState(() => {
    const discoveries = TRAVELLER_QUOTES.filter(q => q.type === "Explorer's Discovery");
    const logs = TRAVELLER_QUOTES.filter(q => q.type === "Traveller's Log");
    const randomDiscovery = discoveries[Math.floor(Math.random() * discoveries.length)];
    const randomLog = logs[Math.floor(Math.random() * logs.length)];
    return [
      randomDiscovery || TRAVELLER_QUOTES[0],
      randomLog || TRAVELLER_QUOTES[1]
    ];
  })[0];

  const slide = SLIDES[idx];
  const isLast = idx === SLIDES.length - 1;
  const isFirst = idx === 0;

  const goTo = useCallback((next: number) => {
    if (transitioning) return;
    setTransitioning(true);
    setTimeout(() => {
      setIdx(Math.max(0, Math.min(SLIDES.length - 1, next)));
      setTransitioning(false);
    }, 300);
  }, [transitioning]);



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
      setPage('town-talk-entrance');
    } else {
      setWelcomeDone(true);
      setPage('choose-town');
    }
  };

  const handleChooseTown = () => {
    setWelcomeDone(true);
    setPage('choose-town');
  };

  const handleSkipToSelection = () => {
    setWelcomeDone(true);
    setPage('choose-town');
  };

  return (
    <div className="relative w-full h-screen flex items-center justify-center p-4 md:p-8 overflow-hidden select-none">
      <div
        className="relative z-10 w-[92vw] h-[96vh] max-h-[96vh] rounded-[2.5rem] border-2 border-white/35 bg-black/60 shadow-[inset_0_1px_2px_rgba(255,255,255,0.25),_0_40px_120px_rgba(0,0,0,0.65)] overflow-hidden flex flex-row"
        style={{ backdropFilter: 'none', WebkitBackdropFilter: 'none' }}
      >
        {/* Top Absolute Navigation Overlays */}
        {slide.type !== 'letter' && (
          <div className="absolute top-6 left-10 right-10 z-30 pointer-events-none flex justify-between items-center">
            {/* Top Left: Back to Welcome Page */}
            <button
              onClick={() => goTo(0)}
              className="pointer-events-auto flex items-center gap-2 px-4.5 py-2 rounded-full bg-[#111116]/85 hover:bg-[#181822]/90 border border-white/10 hover:border-amber-400/50 text-white font-brand text-[11px] uppercase tracking-wider transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-[0_4px_15px_rgba(0,0,0,0.4)]"
            >
              <span className="material-icons-round text-xs text-amber-400">arrow_back</span>
              <span>Back to Welcome Page</span>
            </button>

            {/* Top Right: Skip to Town Selection */}
            <button
              onClick={handleSkipToSelection}
              className="pointer-events-auto flex items-center gap-2 px-4.5 py-2 rounded-full bg-amber-400/10 hover:bg-amber-400/20 border border-amber-400/35 hover:border-amber-400 text-amber-300 font-brand text-[11px] uppercase tracking-wider transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-[0_4px_15px_rgba(251,191,36,0.15)]"
            >
              <span>Skip for Town Selection</span>
              <span className="material-icons-round text-xs text-amber-300">double_arrow</span>
            </button>
          </div>
        )}
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
                    className="text-4xl lg:text-[3.5rem] font-brand uppercase leading-[0.95] tracking-wide drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]"
                    style={{ fontFamily: '"Luckiest Guy", cursive' }}
                  >
                    <span className="text-emerald-400">Welcome</span> <span className="text-yellow-300">Traveller,</span>
                  </h2>
                  <div className="h-[3px] w-40 bg-gradient-to-r from-amber-400 via-amber-200 to-transparent mt-3" />
                  <p className="text-[11.5px] font-medium text-amber-100/90 italic leading-relaxed mt-3 bg-white/5 border border-white/10 px-4 py-2.5 rounded-2xl shadow-inner max-w-xl text-left">
                    "A cozy storybook province where you build a life, experience everyday town tales, and make ChocoBrook your home."
                  </p>
                </div>

                {/* Decree paragraphs 1-5 */}
                <div className="space-y-3 text-[0.95rem] leading-relaxed text-white/85 font-body">
                  {ROYAL_DECREE_PARAGRAPHS.slice(0, 5).map((paragraph, idx) => (
                    <p key={idx} className={idx === 0 ? "flow-root" : ""}>
                      {idx === 0 ? (
                        <>
                          <span className="text-5xl font-serif italic float-left mt-0.5 mr-3 leading-none text-amber-400 border-b border-amber-200">
                            {paragraph.charAt(0)}
                          </span>
                          {paragraph.slice(1)}
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
              <div className="flex flex-col gap-3 justify-between">
                {/* Decree paragraphs 6-9 */}
                <div className="space-y-3 text-[0.95rem] leading-relaxed text-white/85 font-body">
                  {ROYAL_DECREE_PARAGRAPHS.slice(5).map((paragraph, idx) => (
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

                 {/* Combined Signature & Action Panel */}
                <div 
                  className="flex flex-row items-center justify-between gap-6 rounded-3xl border border-white/20 bg-black/60 p-5 shadow-2xl transition-all hover:scale-[1.01] select-none mb-4 md:mb-6"
                  style={{ backdropFilter: 'none', WebkitBackdropFilter: 'none' }}
                >
                  {/* Left Column: Signature */}
                  <div className="space-y-1.5 flex flex-col justify-center shrink-0">
                    <div 
                      className="text-white/80 text-[14px] md:text-[16px] tracking-wide leading-none"
                      style={{ fontFamily: '"Luckiest Guy", cursive' }}
                    >
                      With Warm Regards,
                    </div>
                    <div 
                      className="text-white text-[14px] md:text-[16px] tracking-wide leading-none"
                      style={{ fontFamily: '"Luckiest Guy", cursive' }}
                    >
                      Yogesh S Iyer
                    </div>
                    <div 
                      className="flex items-center text-yellow-300 text-[14px] md:text-[16px] tracking-wide leading-none"
                      style={{ fontFamily: '"Luckiest Guy", cursive' }}
                    >
                      <div className="inline-grid grid-cols-2 gap-[2px] w-[12px] h-[12px] mr-1.5 shrink-0">
                        <div className="bg-white rounded-[1px]" />
                        <div className="bg-orange-500 rounded-[1px]" />
                        <div className="bg-orange-500 rounded-[1px]" />
                        <div className="bg-white rounded-[1px]" />
                      </div>
                      <span>SparrowX Studios</span>
                    </div>
                  </div>

                  {/* Middle Column: 3 Stars horizontally centered between two lines */}
                  <div className="flex items-center justify-center gap-3 flex-grow mx-4">
                    <div className="h-px bg-white/20 flex-grow" />
                    <div className="flex items-center gap-1.5 shrink-0 select-none">
                      <span className="material-icons-round text-yellow-300 text-[1.4rem] hover:scale-125 transition-transform duration-300 cursor-pointer">star</span>
                      <span className="material-icons-round text-emerald-400 text-[1.6rem] hover:scale-125 transition-transform duration-300 cursor-pointer">star</span>
                      <span className="material-icons-round text-cyan-300 text-[1.4rem] hover:scale-125 transition-transform duration-300 cursor-pointer">star</span>
                    </div>
                    <div className="h-px bg-white/20 flex-grow" />
                  </div>

                  {/* Right Column: Vertically stacked buttons */}
                  <div className="flex flex-col gap-2.5 w-[180px] sm:w-[220px] shrink-0">
                    {homeTown ? (
                      <>
                        <GlassButton
                          label="Enter the World →"
                          onClick={() => goTo(1)}
                          variant="primary"
                          className="!w-full !min-w-0 !h-10 !min-h-10 !py-0 !px-4 !normal-case text-[13px] md:text-[14px]"
                          style={{ fontFamily: '"Luckiest Guy", cursive' }}
                        />
                        <GlassButton
                          label={
                            <span className="flex items-center justify-center gap-1.5">
                              <span className="material-icons-round text-sm">home</span>
                              Skip to Home Town
                            </span>
                          }
                          onClick={handleSkip}
                          variant="secondary"
                          className="!w-full !min-w-0 !h-10 !min-h-10 !py-0 !px-4 !normal-case text-[13px] md:text-[14px]"
                          style={{ fontFamily: '"Luckiest Guy", cursive' }}
                        />
                      </>
                    ) : (
                      <>
                        <GlassButton
                          label="Choose Your Town →"
                          onClick={handleChooseTown}
                          variant="primary"
                          className="!w-full !min-w-0 !h-10 !min-h-10 !py-0 !px-4 !normal-case text-[13px] md:text-[14px]"
                          style={{ fontFamily: '"Luckiest Guy", cursive' }}
                        />
                        <GlassButton
                          label={
                            <span className="flex items-center justify-center gap-1.5">
                              <span className="material-icons-round text-sm">menu_book</span>
                              Read Welcome Story
                            </span>
                          }
                          onClick={() => goTo(1)}
                          variant="secondary"
                          className="!w-full !min-w-0 !h-10 !min-h-10 !py-0 !px-4 !normal-case text-[13px] md:text-[14px]"
                          style={{ fontFamily: '"Luckiest Guy", cursive' }}
                        />
                      </>
                    )}
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ── Slide: Choose Town ── */}
        {slide.type === 'choose-town' && (
          <>
            {/* LEFT Panel (70% - Framed Map Container) */}
            <div className="relative w-[70%] shrink-0 h-full overflow-hidden p-6 lg:p-8 flex items-center justify-center bg-black/10">
              <div 
                className="relative w-full h-full rounded-[2.5rem] border-4 border-white/20 bg-neutral-900/60 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7),_inset_0_2px_4px_rgba(255,255,255,0.1)] overflow-hidden flex items-center justify-center p-4"
                style={{ outline: '1px solid rgba(251, 191, 36, 0.25)', outlineOffset: '-10px' }}
              >
                {slide.image && (
                  <img
                    src={slide.image}
                    alt="ChocoBrook Map"
                    className="max-w-full max-h-full object-contain rounded-[1.8rem]"
                  />
                )}
              </div>
            </div>

            {/* RIGHT Panel (30% - Framed Details) */}
            <div
              className={`w-[30%] shrink-0 h-full ml-[-1.5rem] lg:ml-[-2rem] pl-2 lg:pl-3 pr-2 lg:pr-3 py-6 lg:py-8 flex items-center justify-center bg-black/10 transition-opacity duration-300 ${transitioning ? 'opacity-0' : 'opacity-100'}`}
            >
              <div 
                className="relative w-full h-full rounded-[2.5rem] border-4 border-white/20 bg-neutral-900/60 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7),_inset_0_2px_4px_rgba(255,255,255,0.1)] overflow-y-auto custom-scrollbar pt-16 pb-6 px-6 flex flex-col gap-6"
                style={{ outline: '1px solid rgba(251, 191, 36, 0.25)', outlineOffset: '-10px' }}
              >
                <div>
                  <div className="text-[10px] font-black uppercase tracking-[0.35em] text-white/40 mb-1">
                    The Province Awaits
                  </div>
                  <h1
                    className="font-brand text-3xl uppercase tracking-tight leading-tight bg-gradient-to-r from-emerald-400 to-yellow-300 bg-clip-text text-transparent"
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
            </div>
          </>
        )}

        {/* ── Slide: Standard Narrative Snapshot ── */}
        {slide.type === 'snapshot' && (
          <>
            {/* LEFT Panel (70% - Framed Image) */}
            <div className="relative w-[70%] shrink-0 h-full overflow-hidden p-6 lg:p-8 flex items-center justify-center bg-black/10">
              <div 
                className="relative w-full h-full rounded-[2.5rem] border-4 border-white/20 bg-neutral-900/60 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7),_inset_0_2px_4px_rgba(255,255,255,0.1)] overflow-hidden flex items-center justify-center p-2"
                style={{ outline: '1px solid rgba(251, 191, 36, 0.25)', outlineOffset: '-10px' }}
              >
                {slide.image && (
                  <img
                    src={slide.image}
                    alt={slide.headline || 'Town View'}
                    className="w-full h-full object-cover rounded-[1.8rem] transition-transform duration-700 hover:scale-[1.03]"
                  />
                )}
              </div>
            </div>

            {/* RIGHT Panel (30% - Framed Details) */}
            <div
              className={`w-[30%] shrink-0 h-full ml-[-1.5rem] lg:ml-[-2rem] pl-2 lg:pl-3 pr-2 lg:pr-3 py-6 lg:py-8 flex items-center justify-center bg-black/10 transition-opacity duration-300 ${transitioning ? 'opacity-0' : 'opacity-100'}`}
            >
              <div 
                className="relative w-full h-full rounded-[2.5rem] border-4 border-white/20 bg-neutral-900/60 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7),_inset_0_2px_4px_rgba(255,255,255,0.1)] overflow-y-auto custom-scrollbar pt-16 pb-6 px-6 flex flex-col gap-4"
                style={{ outline: '1px solid rgba(251, 191, 36, 0.25)', outlineOffset: '-10px' }}
              >
                {/* Header location */}
                <div className="flex flex-col gap-1.5 shrink-0 border-b border-white/10 pb-3">
                  <span className="font-brand text-[13px] md:text-sm tracking-wide text-amber-400 uppercase">
                    ✨ What's Happening in {slide.location ? slide.location.split(' — ')[0].replace(/^[^\w\s]+/, '').trim() : 'ChocoBrook'}?
                  </span>
                </div>

                {/* Headline & Tagline */}
                <div className="shrink-0">
                  <h2 className={`font-brand text-lg leading-snug font-bold mt-1 tracking-wide drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] ${slide.category?.color || 'text-white'}`}>
                    {slide.headline}
                  </h2>
                </div>

                {/* 2 Paras Narrative Caption */}
                {slide.caption && (
                  <div className="font-body text-[12.5px] leading-relaxed text-white/80 space-y-3 shrink-0">
                    {slide.caption.split('\n\n').map((para, i) => (
                      <p 
                        key={i} 
                        className="first-letter:text-lg first-letter:font-brand first-letter:text-amber-400 first-letter:mr-0.5"
                        dangerouslySetInnerHTML={{ __html: para }} 
                      />
                    ))}
                  </div>
                )}

                {/* Fun Fact Block */}
                {slide.detail && (
                  <div className="rounded-2xl border border-cyan-400/25 bg-gradient-to-br from-cyan-950/40 to-neutral-900/60 p-3.5 flex items-start gap-3 shadow-md shrink-0">
                    <span className="text-xl select-none filter drop-shadow-[0_2px_8px_rgba(34,211,238,0.4)]">💡</span>
                    <div className="flex-1 min-w-0">
                      <span className="font-black text-cyan-300 uppercase tracking-widest text-[9px] block mb-1">
                        Town Fun Fact
                      </span>
                      <p className="text-[12px] font-body italic text-white/90 leading-relaxed">
                        "{slide.detail}"
                      </p>
                    </div>
                  </div>
                )}

                {/* Few More Details (Agent & Headquarters) */}
                <div className="grid grid-cols-2 gap-3 shrink-0">
                  <div className="rounded-2xl border border-white/5 bg-neutral-950/30 p-3 flex flex-col gap-1 shadow-inner">
                    <span className="text-[9px] font-black uppercase tracking-[0.15em] text-amber-400">
                      📍 Headquarters
                    </span>
                    <span className="text-[11px] font-body text-white/95 font-medium leading-tight mt-0.5">
                      {slide.location ? slide.location.split(' — ')[1] || slide.location : 'Outer County'}
                    </span>
                  </div>

                  <div className="rounded-2xl border border-white/5 bg-neutral-950/30 p-3 flex flex-col gap-1 shadow-inner">
                    <span className="text-[9px] font-black uppercase tracking-[0.15em] text-emerald-400">
                      👤 Local Agent
                    </span>
                    <span className="text-[11px] font-body text-white/95 font-medium leading-tight mt-0.5">
                      {slide.character || 'Imperial Registry'}
                    </span>
                  </div>
                </div>

                {/* Gossip Poll / Reactions */}
                {slide.townReaction && (
                  <div className="rounded-2xl border border-amber-400/20 bg-gradient-to-br from-amber-955/30 to-neutral-900/60 p-4 shrink-0 shadow-lg">
                    <div className="text-[9px] font-black uppercase tracking-[0.2em] text-amber-400 mb-3 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">📊 Local Gossip Poll</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    </div>
                    <div className="space-y-3">
                      {slide.townReaction.slice(0, 3).map((r, i) => (
                        <div key={i} className="flex flex-col gap-1.5">
                          <div className="flex justify-between items-center text-[10.5px] leading-snug">
                            <span className="text-white/80 font-body">{r.text}</span>
                            <span className="font-bold text-amber-300 font-brand shrink-0 pl-2">{r.pct}%</span>
                          </div>
                          {/* Progress bar */}
                          <div className="w-full h-1.5 bg-black/45 rounded-full overflow-hidden border border-white/5 shadow-inner">
                            <div 
                              className="h-full bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-300 rounded-full" 
                              style={{ width: `${r.pct}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

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
