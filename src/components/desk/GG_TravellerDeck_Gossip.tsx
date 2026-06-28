import React, { useState, useEffect, useCallback } from 'react';
import { useTTStore } from '../../store/useTTStore';
import { GG_TravellerDeck_Header } from './GG_TravellerDeck_Header';
import { type SubPage } from '../../lib/uiConstants';

interface Props {
  setSubPage: (p: SubPage) => void;
  popPage: () => void;
  triggerFeedback: (msg: string) => void;
}

interface Rumor {
  id: string;
  text: string;
  source: string;
  category: 'clan' | 'pranks' | 'secrets' | 'bureaucracy';
  leakReaction: string;
  speaker: string;
  dialogue: string;
  actionLabel: string;
  actionReward: string;
}

// ── Dynamic Town Chronicle headlines ─────────────────────────────────────────
// These are live-feeling entries that reference real residents and town events.
interface ChronicleEntry {
  id: string;
  headline: string;
  body: string;
  tag: string;
  tagColor: string;
  icon: string;
  author: string;
  timeHint: string; // e.g. "Morning Edition"
  phase?: 'morning' | 'afternoon' | 'sunset' | 'night' | 'any';
}

const CHRONICLE_POOL: ChronicleEntry[] = [
  {
    id: 'c-theo-pine',
    headline: 'Theo Sold Pine Planks for 300 Coins',
    body: 'Merchant Theo Bramblethorn completed a record-breaking timber deal at the Trade Hub this morning, moving 30 bundles of seasoned pine planks to the Wharf Builders\' guild.',
    tag: 'TRADE',
    tagColor: 'text-emerald-400 bg-emerald-500/15 border-emerald-500/30',
    icon: '🪵',
    author: 'Julie Frost · Gazette Desk',
    timeHint: 'Morning Edition',
    phase: 'morning',
  },
  {
    id: 'c-junia-theatre',
    headline: 'Junia Visited the Theatre Last Evening',
    body: 'Junia Coralwood was spotted front-row at the Town Theatre\'s twilight performance of "The Sugarcane Chronicles." She reportedly stayed for all three acts.',
    tag: 'SOCIETY',
    tagColor: 'text-purple-400 bg-purple-500/15 border-purple-500/30',
    icon: '🎭',
    author: 'Social Desk · Gossip Corner',
    timeHint: 'Evening Edition',
    phase: 'sunset',
  },
  {
    id: 'c-market-butter',
    headline: 'Market Predicts High Butter Prices This Week',
    body: 'The Cocoa Commodity Board issued an advisory that velvet butter creamery output has dipped by 18%. Traders at Mossberry Wharf expect pricing to spike by midweek.',
    tag: 'MARKET',
    tagColor: 'text-amber-400 bg-amber-500/15 border-amber-500/30',
    icon: '🧈',
    author: 'Trade Beat · Chocobrook Ledger',
    timeHint: 'Market Open',
    phase: 'morning',
  },
  {
    id: 'c-pipkin-pie',
    headline: 'Pipkin Won the Annual Pie Contest!',
    body: 'Pipkin Nutterby took home the Golden Rolling Pin at the 22nd Ganache Grove Pie Bake-off with his spectacular ganache-caramel tart. "I dedicate this to the cows," said Pipkin.',
    tag: 'EVENTS',
    tagColor: 'text-pink-400 bg-pink-500/15 border-pink-500/30',
    icon: '🥧',
    author: 'Community Beat · Nutterby Post',
    timeHint: 'Afternoon Special',
    phase: 'afternoon',
  },
  {
    id: 'c-rowan-canal',
    headline: 'Rowan Reports Canal Repair at 70% Complete',
    body: 'Chief Volunteer Engineer Rowan Thistle confirmed milestone progress on the Chocobrook Canal restoration. An emergency volunteer call goes out for 20 more sandbag setters.',
    tag: 'CIVIC',
    tagColor: 'text-cyan-400 bg-cyan-500/15 border-cyan-500/30',
    icon: '🌊',
    author: 'Civic Affairs · Canal Bureau',
    timeHint: 'Daily Briefing',
    phase: 'any',
  },
  {
    id: 'c-train-delay',
    headline: 'Rail Station Bell Malfunctioned at Dawn',
    body: 'Forest Train Station\'s signature bell failed to ring at 6:00 AM, leaving commuters stranded for 40 minutes. Mechanic Crumblewise blamed a rogue squirrel in the bell tower.',
    tag: 'TRANSPORT',
    tagColor: 'text-orange-400 bg-orange-500/15 border-orange-500/30',
    icon: '🚂',
    author: 'Transit Desk · Station Bulletin',
    timeHint: 'Morning Rush',
    phase: 'morning',
  },
  {
    id: 'c-clinic-closed',
    headline: 'Dr. Cedric\'s Clinic Runs Night Remedies',
    body: 'After two residents complained of forest-spore allergies, Dr. Cedric Oakenhart extended clinic hours until 10 PM, offering moonlight tonic consultations on the back porch.',
    tag: 'HEALTH',
    tagColor: 'text-teal-400 bg-teal-500/15 border-teal-500/30',
    icon: '🏥',
    author: 'Health Desk · Oak Clinic Notice',
    timeHint: 'Evening Health Brief',
    phase: 'sunset',
  },
  {
    id: 'c-night-patrol',
    headline: 'Night Wardens Caught Three Squirrels Stealing Rope',
    body: 'Forest Warden Captain Olive Pine\'s nightly patrol intercepted three hyperactive squirrels hauling hemp ropes from the cargo belfry. "Cute but criminal," Pine noted in her log.',
    tag: 'PATROL',
    tagColor: 'text-indigo-400 bg-indigo-500/15 border-indigo-500/30',
    icon: '🌙',
    author: 'Night Watch · Mossberry Patrol',
    timeHint: 'Late Night Dispatch',
    phase: 'night',
  },
  {
    id: 'c-gossip-coin',
    headline: 'Gossip Corner Reports Record Foot Traffic',
    body: 'Niglet the mouse reportedly sold a rumour about the Mayor\'s velvet coat sleeve incident — for a wedge of aged cheddar. The Gossip Corner saw 42 visitors before noon.',
    tag: 'GOSSIP',
    tagColor: 'text-rose-400 bg-rose-500/15 border-rose-500/30',
    icon: '🗣️',
    author: 'Rumour Desk · Corner Chronicles',
    timeHint: 'Any Hour',
    phase: 'any',
  },
  {
    id: 'c-workshop-fire',
    headline: 'Workshop Forge Sparks New Tool Design',
    body: 'Blacksmith Crumblewise unveiled a prototype triple-pulley lifting rig at the Ganache Grove Workshop. Builders\' Guild members were invited to test it on a boulder demo.',
    tag: 'CRAFTS',
    tagColor: 'text-yellow-400 bg-yellow-500/15 border-yellow-500/30',
    icon: '🔨',
    author: 'Trades Desk · Workshop Bulletin',
    timeHint: 'Afternoon Edition',
    phase: 'afternoon',
  },
];

const WHISPERS_POOL: Rumor[] = [
  {
    id: 'rumor_1',
    text: 'Sir Goldwhistle was seen buying extra large suspenders to hide his sugar coin pouches.',
    source: 'Gossip Corner Stable-hands',
    category: 'bureaucracy',
    leakReaction: "Sir Goldwhistle's budget margins are always suspender-tight! This will make a brilliant audit caricature.",
    speaker: 'Sir Goldwhistle',
    dialogue: '"Suspenders? Preposterous! My suspenders are purely structural to hold my dignity, not to hide pouches!"',
    actionLabel: 'Audit the pouches',
    actionReward: 'Pay 10🪙 to audit. Earns 18🪙 and +2 Legacy.',
  },
  {
    id: 'rumor_2',
    text: "Mrs. Petalworth uses code names for flower arrangements — blue lilies mean the tax collectors are nearby.",
    source: 'Market Florist Runners',
    category: 'clan',
    leakReaction: 'Fascinating! Floral cryptography under our very noses. I must order a bouquet of blue lilies immediately.',
    speaker: 'Mrs. Petalworth',
    dialogue: '"My dear, flowers speak their own language. Blue lilies simply signify caution... and a touch of elegance."',
    actionLabel: 'Deliver caution bouquet',
    actionReward: 'Earns 3🪙 and +15 Healer XP.',
  },
  {
    id: 'rumor_3',
    text: "Pipkin Nutterby is planning to swap Baker Mortimer's baking salt with powdered glaze sugar.",
    source: 'Canopy Kids Playgroup',
    category: 'pranks',
    leakReaction: "Oh dear, a sweet disaster in the oven! I'll tip off Mortimer — after I get a photo of the resulting buns!",
    speaker: 'Pipkin Nutterby',
    dialogue: '"Shh! If you tell Mortimer, he\'ll glaze my ears! It was just a tiny, sweet prank!"',
    actionLabel: 'Alert Baker Mortimer',
    actionReward: 'Earns 4🪙 and +15 Builder XP.',
  },
  {
    id: 'rumor_4',
    text: "Dr. Cedric's latest glowing moss remedy is actually just sweetened river sediment with peppermint leaf.",
    source: 'Clinic Lobby Patients',
    category: 'secrets',
    leakReaction: 'Placebo or potion? That explains why his patients recover with such sweet-smelling breath!',
    speaker: 'Dr. Cedric Oakenhart',
    dialogue: '"Placebo is a powerful catalyst, my child. The sweet sediment holds healing memories of the river bed."',
    actionLabel: 'Analyze sediment',
    actionReward: 'Pay 5🪙 to test. Earns +20 Healer XP.',
  },
  {
    id: 'rumor_5',
    text: 'Olive Pine was spotted sleeping in a giant hollow maple tree during her ranger night guard shift.',
    source: 'Forest Scouts Patrol',
    category: 'clan',
    leakReaction: "Ranger Captain caught napping! I'll keep this off the front page if she grants me an exclusive canopy interview.",
    speaker: 'Olive Pine',
    dialogue: '"I wasn\'t sleeping, I was... acoustically monitoring the canopy root networks from a horizontal position!"',
    actionLabel: 'Cover her night shift',
    actionReward: 'Earns 4🪙 and +20 Explorer XP.',
  },
  {
    id: 'rumor_6',
    text: 'Rowan Thistle drew a blueprint for a secret monorail escape pod inside the Town Hall chimney flue.',
    source: 'Workshop Wood-cutters',
    category: 'secrets',
    leakReaction: 'Rowan is always over-engineering! Imagine flying out of the chimney in a candy pod.',
    speaker: 'Rowan Thistle',
    dialogue: '"It\'s a structural necessity! What if a honeyberry flood blocks all exits? One must calculate the angles!"',
    actionLabel: 'Help build escape pod',
    actionReward: 'Pay 20🪙 for materials. Earns +40 Builder XP and +3 Legacy.',
  },
  {
    id: 'rumor_7',
    text: "The Mayor once got his heavy velvet coat sleeve stuck in a Monorail door during the ribbon-cutting opening ceremony.",
    source: 'Transit Attendants log',
    category: 'bureaucracy',
    leakReaction: "Glorious! Dignitary stuck in the sliding doors! This goes straight to the page 2 comic section.",
    speaker: 'Mayor Aide',
    dialogue: '"Ah, that coat was premium velvet. A real structural tragedy, but we don\'t speak of the ribbon-cutting event!"',
    actionLabel: 'Free stuck sleeve',
    actionReward: 'Earns 3🪙.',
  },
  {
    id: 'rumor_8',
    text: 'Millady Flutterby talks to her caramel cows in ancient Confectioner runes to make them produce sweeter cream.',
    source: 'Pasture Cow-herds',
    category: 'secrets',
    leakReaction: 'Ancient runes for dairy production? I knew there was a magical variable in that velvet cream cake!',
    speaker: 'Millady Flutterby',
    dialogue: '"The runes harmonize the milk fats, dear. Science and magic are two sides of the same caramel recipe!"',
    actionLabel: 'Serenade caramel cows',
    actionReward: 'Earns 4🪙 and +1 Legacy.',
  },
];

const CATEGORY_COLORS: Record<string, string> = {
  clan: 'text-sky-400 bg-sky-500/15 border-sky-500/30',
  pranks: 'text-yellow-400 bg-yellow-500/15 border-yellow-500/30',
  secrets: 'text-rose-400 bg-rose-500/15 border-rose-500/30',
  bureaucracy: 'text-purple-400 bg-purple-500/15 border-purple-500/30',
};

// Pick today's chronicle entries (phase-filtered + time-seeded)
function getTodayChronicles(phase: string): ChronicleEntry[] {
  const todayStr = new Date().toISOString().slice(0, 10);
  let seed = 0;
  for (let i = 0; i < todayStr.length; i++) seed = (seed * 31 + todayStr.charCodeAt(i)) >>> 0;
  const rng = () => { seed ^= seed << 13; seed ^= seed >> 17; seed ^= seed << 5; return (seed >>> 0) / 4294967296; };

  // Filter: pick phase-matching + 'any', shuffle deterministically
  const relevant = CHRONICLE_POOL.filter(c => c.phase === phase || c.phase === 'any');
  const rest = CHRONICLE_POOL.filter(c => c.phase !== phase && c.phase !== 'any');
  const all = [...relevant, ...rest];
  // Fisher-Yates with seeded rng
  for (let i = all.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [all[i], all[j]] = [all[j], all[i]];
  }
  return all.slice(0, 5);
}

export const GG_TravellerDeck_Gossip: React.FC<Props> = ({
  setSubPage,
  popPage,
  triggerFeedback,
}) => {
  const { addSkillXP, addCoins, addLegacy, spendCoins, coins, worldTime } = useTTStore();

  const phase = worldTime?.phase ?? 'morning';
  const [todayChronicles] = useState<ChronicleEntry[]>(() => getTodayChronicles(phase));
  const [activeTab, setActiveTab] = useState<'chronicle' | 'whispers'>('chronicle');
  const [scanning, setScanning] = useState<boolean>(false);
  const [activeWhisper, setActiveWhisper] = useState<Rumor | null>(null);
  const [tickingHeadline, setTickingHeadline] = useState(0);

  const [discoveredRumors, setDiscoveredRumors] = useState<string[]>(() => {
    const saved = localStorage.getItem('tt_discovered_rumors');
    return saved ? JSON.parse(saved) : [];
  });
  const [leakedRumors, setLeakedRumors] = useState<string[]>(() => {
    const saved = localStorage.getItem('tt_leaked_rumors');
    return saved ? JSON.parse(saved) : [];
  });
  const [resolvedGossip, setResolvedGossip] = useState<string[]>(() => {
    const saved = localStorage.getItem('tt_resolved_gossip');
    return saved ? JSON.parse(saved) : [];
  });

  const [reporterQuote, setReporterQuote] = useState<string>('Welcome to the news desk! Scan Gossip Corner or leak a lead to earn influence.');
  const [activeChat, setActiveChat] = useState<{ speaker: string; text: string } | null>(null);

  // Ticker — rotate headline every 4 s
  useEffect(() => {
    const id = setInterval(() => setTickingHeadline(p => (p + 1) % todayChronicles.length), 4000);
    return () => clearInterval(id);
  }, [todayChronicles.length]);

  const saveToLocalStorage = (key: string, data: unknown) => {
    localStorage.setItem(key, JSON.stringify(data));
  };

  const handleEavesdrop = useCallback(() => {
    setScanning(true);
    setActiveWhisper(null);
    setTimeout(() => {
      setScanning(false);
      const randomIndex = Math.floor(Math.random() * WHISPERS_POOL.length);
      const rumor = WHISPERS_POOL[randomIndex];
      setActiveWhisper(rumor);
      if (!discoveredRumors.includes(rumor.id)) {
        const next = [...discoveredRumors, rumor.id];
        setDiscoveredRumors(next);
        saveToLocalStorage('tt_discovered_rumors', next);
        addSkillXP('explorer', 10);
        addCoins(1, 'Eavesdropped Gossip Corner'); // Reduced from 5 to 1
        triggerFeedback('🗣️ Eavesdropped a new whisper! +10 Explorer XP, +1 Coin.');
      } else {
        triggerFeedback('🗣️ Overheard some familiar chatter.');
      }
    }, 2500);
  }, [discoveredRumors, addSkillXP, addCoins, triggerFeedback]);

  const handleLeakScoop = (rumor: Rumor) => {
    if (leakedRumors.includes(rumor.id)) return;
    const next = [...leakedRumors, rumor.id];
    setLeakedRumors(next);
    saveToLocalStorage('tt_leaked_rumors', next);
    addLegacy(1); // Reduced from 15 to 1
    addCoins(2, 'Leaked Scoop to Julie Frost'); // Reduced from 10 to 2
    setReporterQuote(`Julie Frost: "${rumor.leakReaction}"`);
    triggerFeedback('✍️ Leaked scoop to Julie! Earned 2 Coins and +1 Standing.');
  };

  const handleAction = (rumor: Rumor) => {
    if (resolvedGossip.includes(rumor.id)) return;
    if (rumor.id === 'rumor_1') {
      if (coins < 10) { triggerFeedback('❌ Need 10 Coins!'); return; }
      spendCoins(10, 'Audited Sir Goldwhistle', true); addCoins(18, 'Audited Sir Goldwhistle'); addLegacy(2);
    } else if (rumor.id === 'rumor_2') {
      addCoins(3, 'Delivered Caution Bouquet'); addSkillXP('healer', 15);
    } else if (rumor.id === 'rumor_3') {
      addCoins(4, 'Alerted Baker Mortimer'); addSkillXP('builder', 15);
    } else if (rumor.id === 'rumor_4') {
      if (coins < 5) { triggerFeedback('❌ Need 5 Coins!'); return; }
      spendCoins(5, 'Analyzed Sediment', true); addSkillXP('healer', 20);
    } else if (rumor.id === 'rumor_5') {
      addCoins(4, 'Covered Olive Shift'); addSkillXP('explorer', 20);
    } else if (rumor.id === 'rumor_6') {
      if (coins < 20) { triggerFeedback('❌ Need 20 Coins!'); return; }
      spendCoins(20, 'Built Escape Pod', true); addSkillXP('builder', 40); addLegacy(3);
    } else if (rumor.id === 'rumor_7') {
      addCoins(3, 'Freed Mayor Sleeve');
    } else if (rumor.id === 'rumor_8') {
      addCoins(4, 'Serenaded Cows'); addLegacy(1);
    }
    const next = [...resolvedGossip, rumor.id];
    setResolvedGossip(next);
    saveToLocalStorage('tt_resolved_gossip', next);
    triggerFeedback(`✅ Resolved whisper! ${rumor.actionLabel} completed.`);
  };

  const currentChronicle = todayChronicles[tickingHeadline];

  return (
    <div className="w-full flex-grow flex flex-col min-h-0 overflow-hidden text-white">
      {/* Header */}
      <GG_TravellerDeck_Header
        title="🗣️ GOSSIP CORNER & TOWN CHRONICLE"
        setSubPage={setSubPage}
        popPage={popPage}
        currentSubPage="gossip"
      />

      {/* ── Live Ticker Bar ── */}
      <div className="shrink-0 mb-3 px-1">
        <div className="flex items-center gap-3 bg-amber-950/40 border border-amber-500/25 rounded-2xl px-4 py-2 overflow-hidden">
          <span className="text-[9px] font-black uppercase tracking-widest text-amber-400 shrink-0 bg-amber-500/20 px-2 py-0.5 rounded-lg border border-amber-500/30">
            📰 LIVE
          </span>
          <p className="text-[11px] text-amber-100/90 font-medium truncate animate-fade-in">
            {currentChronicle?.icon} {currentChronicle?.headline}
          </p>
          <div className="flex gap-1 ml-auto shrink-0">
            {todayChronicles.map((_, i) => (
              <button
                key={i}
                onClick={() => setTickingHeadline(i)}
                className={`w-1.5 h-1.5 rounded-full transition-all ${i === tickingHeadline ? 'bg-amber-400 scale-125' : 'bg-white/20'}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ── Tab Bar ── */}
      <div className="shrink-0 flex gap-2 mb-4">
        <button
          onClick={() => setActiveTab('chronicle')}
          className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
            activeTab === 'chronicle'
              ? 'bg-amber-500 text-black shadow-[0_0_12px_rgba(245,158,11,0.5)]'
              : 'bg-white/5 text-white/50 hover:bg-white/10'
          }`}
          style={{ fontFamily: '"Josefin Sans", sans-serif' }}
        >
          📰 Town Chronicle
        </button>
        <button
          onClick={() => setActiveTab('whispers')}
          className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
            activeTab === 'whispers'
              ? 'bg-purple-500 text-white shadow-[0_0_12px_rgba(168,85,247,0.5)]'
              : 'bg-white/5 text-white/50 hover:bg-white/10'
          }`}
          style={{ fontFamily: '"Josefin Sans", sans-serif' }}
        >
          🎧 Whisper Scanner
        </button>
        <div className="ml-auto flex items-center gap-2">
          <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-1 rounded-lg border ${
            worldTime?.phase === 'morning' ? 'text-amber-400 border-amber-400/30 bg-amber-400/10' :
            worldTime?.phase === 'afternoon' ? 'text-sky-400 border-sky-400/30 bg-sky-400/10' :
            worldTime?.phase === 'sunset' ? 'text-orange-400 border-orange-400/30 bg-orange-400/10' :
            'text-indigo-400 border-indigo-400/30 bg-indigo-400/10'
          }`}>
            {worldTime?.emoji} {worldTime?.label} Edition
          </span>
        </div>
      </div>

      {/* ── CHRONICLE TAB ── */}
      {activeTab === 'chronicle' && (
        <div className="flex-grow min-h-0 overflow-hidden flex flex-col xl:flex-row gap-4">
          
          {/* Featured Story (left, 55%) */}
          <div className="w-full xl:w-[55%] flex flex-col gap-3 shrink-0">
            {/* Main featured card */}
            <div className="flex-grow bg-gradient-to-br from-black/50 to-black/30 border border-white/10 rounded-[2rem] p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-2xl">{currentChronicle?.icon}</span>
                  <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-lg border ${currentChronicle?.tagColor}`}>
                    {currentChronicle?.tag}
                  </span>
                  <span className="text-[9px] text-white/30 ml-auto font-mono">{currentChronicle?.timeHint}</span>
                </div>
                <h3 className="text-[15px] font-black text-white leading-snug mb-3 tracking-tight">
                  {currentChronicle?.headline}
                </h3>
                <p className="text-[11px] text-white/70 leading-relaxed font-body italic">
                  {currentChronicle?.body}
                </p>
              </div>
              <div className="flex items-center justify-between border-t border-white/8 pt-3 mt-3">
                <span className="text-[10px] text-white/35 font-mono">{currentChronicle?.author}</span>
                <span className="text-[9px] text-amber-400/70 font-bold uppercase tracking-wider">
                  {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                </span>
              </div>
            </div>

            {/* Julie Frost newsdesk */}
            <div className="shrink-0 bg-purple-950/20 border border-purple-500/20 rounded-2xl p-4 flex items-start gap-3">
              <span className="text-xl shrink-0">✍️</span>
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[11px] font-bold text-white">Julie Frost</span>
                  <span className="text-[8px] text-purple-300 uppercase font-black tracking-widest">Broadcaster · Press Room</span>
                </div>
                <p className="text-[10.5px] text-purple-200/75 italic font-body leading-relaxed">
                  {reporterQuote}
                </p>
              </div>
            </div>
          </div>

          {/* Side: All Chronicle entries (right, 45%) */}
          <div className="flex-grow bg-black/30 border border-white/8 rounded-[2rem] p-4 flex flex-col min-h-0 overflow-hidden">
            <span className="text-[10px] font-black uppercase tracking-widest text-white/50 block mb-3">
              📋 Today's Full Chronicle
            </span>
            <div className="flex-grow overflow-y-auto custom-scrollbar space-y-2 pr-1">
              {todayChronicles.map((entry, i) => (
                <button
                  key={entry.id}
                  onClick={() => setTickingHeadline(i)}
                  className={`w-full text-left p-3 rounded-xl transition-all hover:bg-white/5 border ${
                    i === tickingHeadline ? 'border-amber-500/40 bg-amber-500/5' : 'border-white/5 bg-transparent'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <span className="text-base shrink-0 mt-0.5">{entry.icon}</span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className={`text-[8px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded border ${entry.tagColor}`}>
                          {entry.tag}
                        </span>
                        <span className="text-[8px] text-white/25 font-mono">{entry.timeHint}</span>
                      </div>
                      <p className="text-[11px] text-white/80 font-semibold leading-snug truncate">{entry.headline}</p>
                      <p className="text-[9.5px] text-white/35 mt-0.5 font-body line-clamp-2">{entry.body.substring(0, 80)}...</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Fun fact box */}
            <div className="shrink-0 mt-3 p-3 bg-amber-500/8 border border-amber-500/15 rounded-xl">
              <span className="text-[10px] font-bold text-amber-300 block mb-0.5">💡 Gossip Fun Fact</span>
              <p className="text-[9.5px] text-amber-200/80 italic font-body leading-relaxed">
                Niglet the mouse knows 90% of town secrets — but only shares them for aged cheddar.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ── WHISPERS TAB ── */}
      {activeTab === 'whispers' && (
        <div className="flex-grow min-h-0 overflow-hidden flex flex-col xl:flex-row gap-5 mb-3">

          {/* LEFT: Eavesdrop Scanner (40%) */}
          <div className="w-full xl:w-[40%] bg-black/45 border border-white/10 rounded-[2rem] p-5 flex flex-col justify-between shrink-0">
            <div>
              <span className="text-[8px] font-black uppercase tracking-[0.25em] text-cyan-400 block mb-2">
                🎧 Gossip Receiver
              </span>
              <div className="p-4 bg-gradient-to-br from-amber-950/20 via-amber-900/10 to-stone-900 border border-amber-500/20 rounded-2xl text-center space-y-4">
                <p className="text-[11px] text-white/70 leading-relaxed font-sans">
                  Tune your acoustic receivers to Gossip Corner. Filter out the wind and cocoa-drip hums to isolate resident dialogue!
                </p>

                {scanning ? (
                  <div className="py-5 space-y-2">
                    <div className="text-[10px] text-amber-300 font-bold uppercase animate-pulse">Isolating frequencies...</div>
                    <div className="w-full h-2 bg-neutral-900 rounded-full overflow-hidden relative">
                      <div className="h-full bg-amber-500 animate-pulse" style={{ width: '60%' }} />
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={handleEavesdrop}
                    className="py-2.5 px-5 bg-amber-500 hover:bg-amber-400 text-black font-brand font-black uppercase text-[10px] tracking-wider rounded-xl transition shadow-glow cursor-pointer"
                    style={{ fontFamily: '"Josefin Sans", sans-serif' }}
                  >
                    🎧 Listen at Gossip Corner
                  </button>
                )}

                {activeWhisper && (
                  <div className="p-3 bg-black/50 border border-white/10 rounded-xl text-left animate-fade-in-up">
                    <span className="text-[10px] text-cyan-300 uppercase font-black tracking-wider block mb-1">
                      Overheard: {activeWhisper.category.toUpperCase()}
                    </span>
                    <p className="text-[12px] text-orange-100 font-serif italic mt-1 leading-normal">
                      "{activeWhisper.text}"
                    </p>
                    <span className="text-[11px] text-white/35 block mt-2 text-right">— Source: {activeWhisper.source}</span>
                  </div>
                )}
              </div>

              {/* Julie Desk Commentary */}
              <div className="mt-4 p-4 bg-purple-950/15 border border-purple-500/20 rounded-2xl">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">✍️</span>
                  <div>
                    <h6 className="font-bold text-white text-[12px] leading-none">Julie's Gazette desk</h6>
                    <span className="text-[9px] text-purple-300 uppercase font-black block mt-0.5">Broadcaster Press Room</span>
                  </div>
                </div>
                <p className="text-[11px] text-purple-200/80 italic font-body leading-relaxed">
                  {reporterQuote}
                </p>
              </div>
            </div>

            <div className="text-[11px] text-white/40 text-center border-t border-white/5 pt-3">
              Whisper archive: <span className="text-cyan-400 font-bold">{discoveredRumors.length} / {WHISPERS_POOL.length}</span>
            </div>
          </div>

          {/* RIGHT: Discovered Whispers Ledger (60%) */}
          <div className="flex-grow bg-black/35 border border-white/10 rounded-[2rem] p-5 flex flex-col min-h-0">
            <span className="text-[12px] font-black uppercase tracking-[0.25em] text-cyan-400 block mb-3">
              📜 Discovered Rumors Ledger
            </span>

            <div className="flex-grow overflow-y-auto custom-scrollbar space-y-3 pr-1">
              {discoveredRumors.length > 0 ? (
                discoveredRumors.map((id) => {
                  const r = WHISPERS_POOL.find(x => x.id === id);
                  if (!r) return null;
                  const isLeaked = leakedRumors.includes(id);
                  const isResolved = resolvedGossip.includes(id);
                  const catStyle = CATEGORY_COLORS[r.category] || 'text-white/60';

                  return (
                    <div key={r.id} className="p-4 bg-white/5 border border-white/5 rounded-2xl flex flex-col justify-between gap-3 text-xs">
                      <div className="space-y-1">
                        <div className="flex justify-between items-center">
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border uppercase tracking-wider ${catStyle}`}>
                            {r.category}
                          </span>
                          <span className="text-[10.5px] text-white/40">Source: {r.source}</span>
                        </div>
                        <p className="text-[12px] text-white/85 leading-normal mt-1 italic font-serif">"{r.text}"</p>
                      </div>

                      <div className="flex flex-wrap gap-2 pt-2 border-t border-white/5">
                        {isLeaked ? (
                          <span className="px-2 py-1 bg-purple-500/10 border border-purple-500/30 text-purple-300 rounded-lg text-[9px] uppercase font-bold tracking-wider">
                            Leaked ✓
                          </span>
                        ) : (
                          <button
                            onClick={() => handleLeakScoop(r)}
                            className="px-2.5 py-1 bg-purple-700 hover:bg-purple-600 text-white rounded-lg font-black uppercase text-[9px] tracking-wider transition cursor-pointer"
                          >
                            Leak Lead ✍️
                          </button>
                        )}

                        <button
                          onClick={() => setActiveChat({ speaker: r.speaker, text: r.dialogue })}
                          className="px-2.5 py-1 bg-amber-500 hover:bg-amber-400 text-black rounded-lg font-black uppercase text-[9px] tracking-wider transition cursor-pointer"
                        >
                          Chat 💬
                        </button>

                        {isResolved ? (
                          <span className="px-2 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 rounded-lg text-[9px] uppercase font-bold tracking-wider">
                            Actioned ✓
                          </span>
                        ) : (
                          <button
                            onClick={() => handleAction(r)}
                            className="px-2.5 py-1 bg-cyan-700 hover:bg-cyan-600 text-white rounded-lg font-black uppercase text-[9px] tracking-wider transition cursor-pointer"
                          >
                            Action: {r.actionLabel} 🛠️
                          </button>
                        )}
                      </div>

                      {!isResolved && (
                        <span className="text-[9.5px] text-cyan-300/80 font-semibold block mt-1">
                          Task Reward: {r.actionReward}
                        </span>
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-white/30 text-[11px] italic gap-3">
                  <span className="text-4xl">🎧</span>
                  <span>Switch to Whisper Scanner and eavesdrop at the Corner to discover rumors.</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Chat Popover */}
      {activeChat && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[300] p-4 select-none animate-fade-in">
          <div className="relative bg-neutral-900 border border-amber-500/40 rounded-3xl p-6 w-[450px] max-w-full shadow-2xl flex flex-col gap-4 text-left">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <h4 className="text-sm font-brand text-amber-400 font-bold uppercase">{activeChat.speaker}</h4>
              <span className="text-[9px] text-white/45">Character Dialogue</span>
            </div>
            <p className="text-xs text-white leading-relaxed font-serif italic bg-white/5 p-4 rounded-xl border border-white/5">
              {activeChat.text}
            </p>
            <button
              onClick={() => setActiveChat(null)}
              className="w-full py-2 bg-amber-500 hover:bg-amber-400 text-black font-brand font-black uppercase text-[10px] tracking-wider rounded-xl transition cursor-pointer"
            >
              Close Dialog
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="p-2 border-t border-white/10 text-center text-[11px] text-white/30 shrink-0">
        "All dispatches must be verified by two sources before printing. Remember: gossip is currency."
      </div>
    </div>
  );
};
