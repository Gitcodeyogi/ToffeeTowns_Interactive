import React, { useState, useEffect, useRef } from 'react';
import { FONT, FLASH_NEWS_DATA } from '../lib/uiConstants';
import { useTTStore } from '../store/useTTStore';
import { cozyAudio } from '../utils/audioHelper';
import { DAILY_ROTATION_DATA } from '../data/newspaper_rotation';
import { getChocoDate } from '../utils/chocoCalendar';

const HARSH_WORDS = [
  'fuck', 'shit', 'damn', 'bitch', 'bastard', 'hate', 'stupid', 'jerk',
  'fool', 'idiot', 'asshole', 'crap', 'dick', 'suck', 'useless', 'worst',
  'garbage', 'trash', 'horrible', 'shut up', 'kill', 'die', 'dumb', 'rubbish', 'wrongly'
];

import { TALK_CHARACTERS } from '../constants/talkCharactersData';

export interface Message {
  sender: 'player' | 'npc' | 'system';
  text: string;
  time: string;
}

export interface CharacterTalk {
  id: string;
  name: string;
  role: string;
  avatar: string;
  color: string;
  greeting: string;
  lovedItems: string[];
  dislikedItems: string[];
  loveReaction: string;
  normalReaction: string;
  responses: {
    secret: string[];
    joke: string[];
    chore: string[];
    default: string[];
  };
  keywords: { keys: string[]; replies: string[] }[];
}

export interface CallingCardRequest {
  request: string;
  opt1Label: string;
  opt1Reply: string;
  opt1RewardCoins?: number;
  opt1RewardLegacy?: number;
  opt1RewardXPCat?: string;
  opt1RewardXPVal?: number;
  opt2Label: string;
  opt2Reply: string;
  opt2CostKey?: string;
  opt2CostVal?: number;
  opt2RewardLegacy?: number;
}

const CALLING_CARD_REQUESTS: Record<string, CallingCardRequest> = {
  goldwhistle: {
    request: "Residency ledger compliance check is overdue.",
    opt1Label: "✍️ Sign Resident Registry (+20 Legacy)",
    opt1Reply: "Excellent compliance, Yogesh! I have stamped your profile as compliant.",
    opt1RewardLegacy: 20,
    opt2Label: "🪙 Pay Compliance Stamp (5 Coins)",
    opt2Reply: "Quarterly stamp paid. Marked as Benefactor in ledger (+35 Legacy).",
    opt2CostKey: "coins",
    opt2CostVal: 5,
    opt2RewardLegacy: 35
  },
  pipkin: {
    request: "Slingshot calibration target pinecones missing.",
    opt1Label: "🌲 Gather Garden Pinecones (+10 Coins)",
    opt1Reply: "Yay! Pinecones ready! Teapot targets beware (+5 Healer XP).",
    opt1RewardCoins: 10,
    opt1RewardXPCat: "healer",
    opt1RewardXPVal: 5,
    opt2Label: "🔧 Give 1 Chewy Bolt",
    opt2Reply: "Slingshot tension bolts upgraded! High range calibrated (+15 Legacy).",
    opt2CostKey: "bolts",
    opt2CostVal: 1,
    opt2RewardLegacy: 15
  },
  rowan: {
    request: "Boardwalk elevated support checks pending.",
    opt1Label: "📐 Verify Truss Safety (+12 Builder XP)",
    opt1Reply: "Math verified! Stress load holds perfect under monorail pressure.",
    opt1RewardXPCat: "builder",
    opt1RewardXPVal: 12,
    opt2Label: "🪵 Donate 2 Timber Logs",
    opt2Reply: "Truss beams reinforced! Ganache Boardwalk is safe (+25 Legacy).",
    opt2CostKey: "wood",
    opt2CostVal: 2,
    opt2RewardLegacy: 25
  },
  winston: {
    request: "Mossberry Wharf shipping ledgers pending catalog.",
    opt1Label: "📋 Audit Manifest (+10 Coins)",
    opt1Reply: "Cargo logs cataloged. Docks are running (+5 Explorer XP).",
    opt1RewardCoins: 10,
    opt1RewardXPCat: "explorer",
    opt1RewardXPVal: 5,
    opt2Label: "✉️ Deliver Docks Letter (+15 Legacy)",
    opt2Reply: "Letter delivered safely to the County registry. Standing increased!",
    opt2RewardLegacy: 15,
    opt2CostVal: 0
  },
  sheriff: {
    request: "Bramble wood-parasites detected on lawn hedges.",
    opt1Label: "🧹 Scrub Hedge Weeds (+10 Coins)",
    opt1Reply: "Hedges cleaned! Clear pathway visibility restored (+5 Healer XP).",
    opt1RewardCoins: 10,
    opt1RewardXPCat: "healer",
    opt1RewardXPVal: 5,
    opt2Label: "🧪 Give 1 Salamander Mucus",
    opt2Reply: "Spore shield ointment applied! Hedgerow infections solved (+15 Legacy).",
    opt2CostKey: "mucus",
    opt2CostVal: 1,
    opt2RewardLegacy: 15
  },
  petalworth: {
    request: "Balcony orchid floral nutrition checks.",
    opt1Label: "💧 Mist Sugar Lilies (+12 Healer XP)",
    opt1Reply: "Bioluminescent orchids are blooming beautifully now!",
    opt1RewardXPCat: "healer",
    opt1RewardXPVal: 12,
    opt2Label: "🌿 Give 1 Cooling Moss",
    opt2Reply: "Soil insulated! Orchid moisture levels stabilized (+25 Legacy).",
    opt2CostKey: "moss",
    opt2CostVal: 1,
    opt2RewardLegacy: 25
  }
};

const SLOT_POSITIONS = [
  { top: '7%', left: '2%' },       // Slot 0: 1st (Left Top)
  { top: '7%', right: '2%' },      // Slot 1: 3rd (Right Top)
  { top: '16%', left: '35%' },     // Slot 2: 2nd (Center Top, little down)
  { top: '42%', left: '16%' },     // Slot 3: 4th (Left Inner Middle)
  { top: '42%', right: '16%' },    // Slot 4: 5th (Right Inner Middle)
  { top: '68%', left: '2%' },      // Slot 5: 6th (Left Outside Bottom)
  { top: '68%', right: '2%' },     // Slot 6: 7th (Right Outside Bottom)
];

const BUBBLE_PLATES = [
  { bg: 'bg-[#451a03]/50', text: 'text-amber-100', name: 'text-amber-300' },     // Slot 0: Amber
  { bg: 'bg-[#4c0519]/50', text: 'text-rose-100', name: 'text-rose-300' },       // Slot 1: Rose
  { bg: 'bg-[#064e3b]/50', text: 'text-emerald-100', name: 'text-emerald-300' }, // Slot 2: Emerald
  { bg: 'bg-[#172554]/50', text: 'text-blue-100', name: 'text-blue-300' },       // Slot 3: Blue
  { bg: 'bg-[#3b0764]/50', text: 'text-purple-100', name: 'text-purple-300' },   // Slot 4: Violet
  { bg: 'bg-[#083344]/50', text: 'text-cyan-100', name: 'text-cyan-300' },       // Slot 5: Cyan
  { bg: 'bg-[#431407]/50', text: 'text-orange-100', name: 'text-orange-300' },   // Slot 6: Orange
];

const getDailyDialogueText = (charId: string, userName: string, headline: string) => {
  const name = userName || 'Resident';
  switch (charId) {
    case 'goldwhistle':
      return `Ah, ${name}! The Town Gazette reports "${headline}". This is a serious regulatory concern! We must audit the local ledgers immediately to ensure compliance. Shall we go over the numbers, or are you too busy with your chores?`;
    case 'pipkin':
      return `${name}! Oh my gosh, did you read the news? "${headline}"! I have the most amazing prank involving sugar syrup and Sir Goldwhistle's favorite pen. Come on, let's talk and plan it together!`;
    case 'winston':
      return `Ahoy, ${name}! The morning winds brought rumors of "${headline}". As the town detective, I suspect there's a hidden clue near the wharf. I could use a sharp mind like yours to crack this case. What say you?`;
    case 'percival':
      return `Greetings, ${name}. The council is currently reviewing the implications of "${headline}". As Town Head, I value your perspective on how we should allocate our resources today. Let's discuss this matter.`;
    case 'rowan':
      return `Hey, ${name}! I'm working on the new structural plans following the news about "${headline}". I want to make sure the walkways are reinforced properly. Can you help me check these calculations?`;
    case 'sheriff':
      return `Halt, ${name}! In light of the recent report: "${headline}", I've increased patrols around the grove. I need to ask if you've seen anything unusual. Let's step into the office and chat.`;
    case 'frill':
      return `Hello, ${name}. I'm preparing curfew citations related to "${headline}". Everyone must remain safe. Do you have any updates on the path conditions to share?`;
    case 'qrill':
      return `Good day, ${name}. I am analyzing monorail signal data in response to "${headline}". The safety grids must be calibrated. Shall we review the coordinates?`;
    case 'petalworth':
      return `Hello, sweet ${name}! The beautiful blossoms are reacting to "${headline}". I'm brewing a special honey-flower tea to celebrate. Come, sit with me and let's share some warm gossip!`;
    case 'maribel':
      return `Oh, hello ${name}! I'm sewing new curtains to match the mood of "${headline}". I could really use a friend's advice on the fabrics and colors. Would you like to chat?`;
    case 'page':
      return `${name}, thank goodness you're here! I've been so anxious since reading about "${headline}". The neighborhood noise has been unbearable. Can we talk about what is happening?`;
    case 'crumbleton':
      return `Welcome, ${name}! The ovens are hot and everyone is talking about "${headline}". I've baked a special batch of sugar-buns to go with the news. Come in, let's have a bite and talk!`;
    case 'cedric_w':
      return `Ah, ${name}. The Academy is discussing the historical context of "${headline}" today. A bright student of the town must have an opinion on this. Let's examine the chronicles together.`;
    case 'horace':
      return `${name}, the monorail schedules are completely jumbled after "${headline}"! I'm trying to coordinate the arrivals at the wharf. Let's talk and get the trains back on track!`;
    case 'hazel':
      return `Hello, ${name}. I've prepared a soothing peppermint infusion. Today's news about "${headline}" has everyone in the clinic feeling restless. Let's talk about how you're feeling.`;
    case 'hugo':
      return `${name}! The forge is burning hot. We're casting heavy iron trusses to support the town after "${headline}". I need your thoughts on the load limits. Let's talk shop!`;
    case 'cinder':
      return `Well, look who it is! ${name}, the Hearthstone Inn is packed with travelers gossiping about "${headline}". Grab a warm mug and let's talk about what they're saying!`;
    case 'finch':
      return `Ah, ${name}, my favorite business partner! The news of "${headline}" has created a massive market opportunity for cocoa exports. Let's talk numbers and make some coins!`;
    default:
      return `Hello, ${name}! Did you hear the news about "${headline}"? Let's chat about what is happening in Toffee Towns today!`;
  }
};

const getShortDailyDialogue = (charId: string, userName: string, headline: string) => {
  const name = userName || 'Resident';
  const cleanHeadline = headline.replace(/[".]/g, '');
  switch (charId) {
    case 'goldwhistle':
      return `${name}! The news about "${cleanHeadline}" has serious tax implications. Let's audit your ledger!`;
    case 'pipkin':
      return `Hey ${name}! Have you heard about "${cleanHeadline}"? I need your help loading my slingshot!`;
    case 'winston':
      return `Ahoy, ${name}! I'm tracing clues regarding "${cleanHeadline}". Come to the docks and help me investigate.`;
    case 'percival':
      return `Greetings, ${name}. The Town Council is debating "${cleanHeadline}". I require your vote on this matter.`;
    case 'rowan':
      return `${name}, the blueprints for "${cleanHeadline}" need a safety check. Let's review the calculations.`;
    case 'sheriff':
      return `Halt, ${name}! Keep alert regarding "${cleanHeadline}". Report any suspicious activities to me.`;
    case 'frill':
      return `Hello, ${name}. Ensure your path permits are up to date for "${cleanHeadline}". Stay safe!`;
    case 'qrill':
      return `${name}, monorail safety grid calibration is critical during "${cleanHeadline}". Let's check the coordinates.`;
    case 'petalworth':
      return `Hello, sweet ${name}! My sugar lilies are blooming for "${cleanHeadline}". Come share a warm cup of tea!`;
    case 'maribel':
      return `${name}, I'm sewing custom banners for "${cleanHeadline}". Which fabric color do you prefer?`;
    case 'page':
      return `${name}, the neighborhood is so noisy since "${cleanHeadline}"! Can we talk about these disturbances?`;
    case 'crumbleton':
      return `${name}, I've baked fresh honey-buns to go with today's news of "${cleanHeadline}". Come get one!`;
    case 'cedric_w':
      return `${name}, today's lesson at the Academy is on the history of "${cleanHeadline}". Don't be late!`;
    case 'horace':
      return `${name}, the monorail schedules are delayed due to "${cleanHeadline}"! Let's coordinate the signals.`;
    case 'hazel':
      return `${name}, I have a fresh peppermint infusion ready. Let's talk about wellness during "${cleanHeadline}".`;
    case 'hugo':
      return `${name}! The forge is hot. We're casting parts for "${cleanHeadline}". I need your opinion!`;
    case 'cinder':
      return `${name}! The inn is buzzing with rumors about "${cleanHeadline}". Come hear what they're saying!`;
    case 'finch':
      return `${name}, my friend! We have a lucrative trade opportunity arising from "${cleanHeadline}". Let's talk business!`;
    default:
      return `Hello, ${name}! Let's chat about "${cleanHeadline}" and what is happening in town today!`;
  }
};

const getFriendship = (charId: string) => {
  const raw = localStorage.getItem(`tt_friendship_${charId}`);
  return raw ? JSON.parse(raw) : { level: 1, xp: 0 };
};

const generateMailId = () => 'mail-friend-' + Math.random().toString(36).slice(2);

const getCharacterReply = (char: CharacterTalk, text: string): string => {
  const cleanText = text.toLowerCase();

  // 1. Vote / Voting query check
  const isVoteQuery = [
    'vote', 'voting', 'ballot', 'why should i', 'why do i', 'why i need', 
    'opinion', 'choose', 'decision', 'elect', 'poll'
  ].some(k => cleanText.includes(k));

  if (isVoteQuery) {
    const characterVoteReplies: Record<string, string> = {
      goldwhistle: "Gnomes must express their civic duties through formal ballots! Today, our vote is critical to maintain regulatory compliance regarding the town's latest issue. Your signature on the register ensures your citizen standing stays active!",
      winston: "Every vote counts in keeping our trails and waterways in order. Today, we need your opinion on how to handle the latest dispatch. A structured vote prevents cargo delays and keeps logistics running!",
      rowan: "We need your vote to approve the structural plans! Building walkways, clearing gear blocks, or designing shelters requires the town's official consent. Your vote helps me get the lumber and tools needed to start working!",
      petalworth: "Oh, honey! Voting is how we protect our lovely blossoms and sugar lilies. If we don't vote to guide the construction crews, they might lay walkways right over our garden beds! Please vote to keep our Grove green.",
      pipkin: "Voting is super fun! It's like choosing which slingshot target to hit. If you vote, you get to decide what happens next in the town. Plus, sometimes they hand out sweet rolls at the ballot box!",
      sheriff: "Official voting keeps order in Ganache Grove. Today, the town council is debating a regulatory action. Your vote helps us enforce the local bylaws and maintain safety. Do not neglect your civic duty, citizen!",
      frill: "Your vote is like a warm hug for the community, Yogesh! It helps us decide how to allocate resources, like sending mint tea to the school or setting up cozy lanterns. Every ballot makes our town lovelier!",
      qrill: "Voting is a decision-making algorithm that aggregates citizen preferences. Today's vote calibrates our community priorities. Your input stabilizes the social coordinates and ensures optimal resource distribution.",
      maribel: "Stitching a community together requires everyone's thread, Yogesh! Voting is how we decide which patterns and colors to use for the town's future. It keeps our fabric strong and beautiful.",
      page: "I normally prefer tending my orchids in peace, but voting is necessary to prevent loud, disruptive construction near the green houses. We must vote to establish quiet hours and protect our rare flora!",
      crumbleton: "A good town is like a well-baked cake—it needs every ingredient! Your vote is your ingredient, Yogesh. It helps us decide which community baking and festive events to fund next.",
      cedric_w: "In school, we teach that democracy is the foundation of structured society. Today's vote teaches our students the value of civic engagement. Your ballot is a lesson in county governance!",
      hazel: "Voting affects our collective well-being, Yogesh. Whether it's funding wellness masks, cleaning the water reservoirs, or scheduling spire maintenance, your vote directly impacts the health and safety of our gnomes.",
      hugo: "Hard steel needs a solid mold, and a town needs a solid vote. We vote to authorize metal quotas and boiler audits. Your ballot is the hammer that shapes our local laws!",
      cinder: "The travelers at the inn always talk about how wonderful our local voting system is. It brings everyone together in the tavern to celebrate! Let's make sure your voice is heard today.",
      finch: "Order is coins, and voting is how we regulate the market tariffs and harbor dues. Your vote helps stabilize the local economy and ensures trade remains highly profitable for all of us!",
      percival: "As Town Head, I can tell you that citizen votes are the lifeblood of Ganache Grove. We are currently deciding on critical community matters. Your vote today directly determines whether we approve the new budget or modify our bylaws. It is the highest duty of a Trusted Citizen!"
    };

    const reply = characterVoteReplies[char.id];
    if (reply) return reply;
  }

  // 2. News / Gossip / Incident / Event Keyword query check
  const dayIndex = (new Date().getDate() % 10) + 1;
  let activeEventKeywords: string[];
  if (dayIndex <= 3) {
    activeEventKeywords = ['walkway', 'permit', 'council', 'stalled', 'build', 'construction', 'wood', 'lumber', 'planks'];
  } else if (dayIndex <= 6) {
    activeEventKeywords = ['outbreak', 'sneezles', 'moss', 'sick', 'mint', 'clinic', 'cough', 'tea', 'doctor', 'cedric', 'wellness', 'medicine'];
  } else if (dayIndex <= 8) {
    activeEventKeywords = ['moth', 'fluttermoth', 'sanctuary', 'eco-tourism', 'tourism', 'glowing', 'ruins', 'park', 'butterfly'];
  } else {
    activeEventKeywords = ['clock', 'spire', 'chime', 'repair', 'repairing', 'fix', 'fixing', 'stopped', 'ticking', 'gears', 'fudge', 'spindle'];
  }

  const isEventKeywordQuery = activeEventKeywords.some(k => cleanText.includes(k));

  const isNewsQuery = isEventKeywordQuery || [
    'news', 'gazette', 'talk of town', 'talk of the town', 'gossip', 
    'rumor', 'rumour', 'rumors', 'rumours', 'what is going on', 
    'what\'s going on', 'saying', 'happening', 'today', 'headline', 
    'incident', 'event', 'accident', 'situation', 'tell me about', 'what happened',
    'what is talk', 'talk of the town'
  ].some(k => cleanText.includes(k));

  if (isNewsQuery) {
    const dayContent = DAILY_ROTATION_DATA.find(d => d.day === dayIndex) || DAILY_ROTATION_DATA[0];
    
    const characterNewsReplies: Record<string, string> = {
      goldwhistle: (() => {
        if (dayIndex <= 3) return "The elevated walkway permit has been stamped. Progress requires civic dues, and gnomes must pay their compliance levy!";
        if (dayIndex <= 6) return "Emergency funds for Forest Academy student masks have been authorized. Health compliance is non-negotiable!";
        if (dayIndex <= 8) return "Eco-tourism passes for the fluttermoth sanctuary must be registered at the Town Hall. There is no tax exemption for moth-watching!";
        return "The clock tower spire gears are running. A thorough audit is underway regarding the chocolate fudge deposit. Sabotage is a county offense!";
      })(),
      winston: (() => {
        if (dayIndex <= 3) return "I'm helping Rowan map the coordinates for the new suspended walkway at Gossip Corner. Watch out for deep mud pools!";
        if (dayIndex <= 6) return "I'm checking Mossberry Wharf cargo pods. We need clean linen shipments to curb this spore sneezle outbreak.";
        if (dayIndex <= 8) return "Mysterious white glows reported in the deep park ruins. I'm investigating the trails for safety. Take a sturdy lantern!";
        return "Gear mesh inspection is complete. I'm trailing clues to find how that sticky fudge ended up inside the clock tower main gear!";
      })(),
      rowan: (() => {
        if (dayIndex <= 3) return "We're building the elevated walkway! I'm measuring spruce planks and securing them with springy wafer nodes to absorb vibrations.";
        if (dayIndex <= 6) return "I've set up wooden drying racks in the clinic yard to process fresh mint leaves as fast as citizens can harvest them.";
        if (dayIndex <= 8) return "The fluttermoths are nesting! I've installed protective fencing and warning signs to keep nesting zones safe.";
        return "I scaled the clock tower scaffolding and cleared out the chocolate gear blocks. The chimes are ringing on schedule again!";
      })(),
      petalworth: (() => {
        if (dayIndex <= 3) return "We must protect the sugar lily roots from walkway construction! Rowan promised to route the path safely around our blossoms.";
        if (dayIndex <= 6) return "I'm guiding foraging parties near the riverbanks to collect fresh wild mint. Dr. Cedric needs them for healing teas.";
        if (dayIndex <= 8) return "The glowing moths are divine! I'm hanging sweet lanterns to welcome them, and safeguarding my sugar lilies.";
        return "The clock is fixed! I baked a big batch of chocolate croissants to celebrate, and I've got extra copper brackets.";
      })(),
      pipkin: (() => {
        if (dayIndex <= 3) return "Rowan's elevated walkway is great for slingshot practice! I can launch pinecones from the high deck.";
        if (dayIndex <= 6) return "Dr. Cedric says to drink mint tea, but I think mixing molasses and soda causes bigger bubbles! Want to try?";
        if (dayIndex <= 8) return "The glowing moths look like flying sugar-plums! I tried to catch one in my cap, but it tickled my nose.";
        return "Goldwhistle thinks the clock gear fudge was sabotage, but I was just trying to keep the gears well-lubricated with chocolate!";
      })(),
      sheriff: (() => {
        if (dayIndex <= 3) return "We are monitoring the walkway debates in the square. Loitering or shouting near the permit boards will be cited!";
        if (dayIndex <= 6) return "Quarantine protocols are active at the Forest Academy. Wash your hands and wear clean linen masks on pathways.";
        if (dayIndex <= 8) return "Mossberry park ruins are closed at night to protect nesting moths. Guided tours only with official lanterns.";
        return "Scaffolding safety guidelines must be followed. The clock spire is open, but do not touch the regulatory mesh!";
      })(),
      frill: (() => {
        if (dayIndex <= 3) return "I'm directing walkway traffic. Keep the center lane clear so Rowan's workers can carry heavy lumber!";
        if (dayIndex <= 6) return "I'm delivering warm mint syrup vials to the isolation ward. Stay safe and keep your nose clean, dear!";
        if (dayIndex <= 8) return "I have written six curfew warning tickets to night explorers in the ruins. Let's keep it safe, gnomes!";
        return "The celebratory chime was music to my ears! Be sure to sweep any flour dust from the bakery steps.";
      })(),
      qrill: (() => {
        if (dayIndex <= 3) return "Walkway structural checks are in progress. Load distribution is stable under current pedestrian cycles.";
        if (dayIndex <= 6) return "Mint distribution routes are optimized. Spore count in the classroom corridor has dropped by 45%.";
        if (dayIndex <= 8) return "Sanctuary coordinate locks are active. Tourists must remain behind the timber fence margins.";
        return "Spire clock gears have been calibrated for micro-precision. Clock drift is down to zero seconds.";
      })(),
      maribel: (() => {
        if (dayIndex <= 3) return "Rowan needs strong canvas tool bags for the walkway workers. I'm stitching them this morning.";
        if (dayIndex <= 6) return "I'm sewing double-layered linen face masks for the academy children. They have lavender-infused liners.";
        if (dayIndex <= 8) return "I'm weaving shimmering moth-silk ribbons for the festival dresses. The texture is absolutely lovely!";
        return "I made custom safety harness straps for Rowan's climb up the clock tower. Only double-buckle leather!";
      })(),
      page: (() => {
        if (dayIndex <= 3) return "Walkway noise has disturbed my garden weeding three times today. Rowan's hammer is entirely too loud!";
        if (dayIndex <= 6) return "I hope nobody harvests my private mint patches by mistake. Wild mint is for my rare orchids, not sneezles!";
        if (dayIndex <= 8) return "Glowcap moths nested right next to my greenhouse. I'm cataloging their glowing cycles. Quite fascinating.";
        return "The clock chime is ringing again. It's helpful for scheduling, but my orchids prefer quiet evenings.";
      })(),
      crumbleton: (() => {
        if (dayIndex <= 3) return "I'm baking sugar honey rolls for the walkway construction crew. Sturdy builders need good oven energy!";
        if (dayIndex <= 6) return "Dr. Cedric wants fresh mint, so I'm baking hot mint-cream buns. The sweet aroma helps clear green noses!";
        if (dayIndex <= 8) return "Tourists are flocking to see the ruins! I've set up an outdoor tea stand near the park entrance.";
        return "The spire clock stopped, so my oven alarms failed! I sent celebratory croissants to Rowan for fixing it.";
      })(),
      cedric_w: (() => {
        if (dayIndex <= 3) return "Walkway history dates back to the first settlement. Understanding civic logs is key to path planning.";
        if (dayIndex <= 6) return "Outbreak warning! Spore sneezles are stabilizing, but daily wash drills are mandatory in the classroom.";
        if (dayIndex <= 8) return "Wing dust study shows high bioluminescence. Students must not look directly at the moths without filters.";
        return "The chime restoring is a relief. Punctuality is the foundation of structured county education.";
      })(),
      hazel: (() => {
        if (dayIndex <= 3) return "Mud pools can cause damp chills. Walkways are a sound health investment for gnomes.";
        if (dayIndex <= 6) return "Outbreak cases are steady. Drink your mint tea, rest under the canopy, and wash your hands in spring water!";
        if (dayIndex <= 8) return "Glowing moth wing dust can cause eye irritation. Wear protective glass goggles when walking in the ruins.";
        return "Sleep schedules suffer when clocks freeze. Glad Rowan cleared the fudge. Sleep soundly tonight!";
      })(),
      hugo: (() => {
        if (dayIndex <= 3) return "Steel iron brackets forged for Rowan's path. Sturdy brackets hold walkways straight. Timber alone decays.";
        if (dayIndex <= 6) return "I forged steel support bars for the academy sanitizing basins. Basin taps must be heavy brass.";
        if (dayIndex <= 8) return "I'm making custom gear pins for night lanterns. Guided tour groups need double-wick oil chambers.";
        return "Fudge in the regulator gear? Soft fudge ruins hard steel. Replaced the gear pins with tempered brass.";
      })(),
      cinder: (() => {
        if (dayIndex <= 3) return "Walkway crews are staying at the inn. The hearth is warm and cocoa stew is simmering.";
        if (dayIndex <= 6) return "We are disinfecting all guest blankets. Mint tea is available free in the lobby for travelers.";
        if (dayIndex <= 8) return "Inn rooms are fully booked with moth watching tourists! The canopy views are beautiful tonight.";
        return "Bramble sent fresh croissants for breakfast! Celebrations are active in the tavern.";
      })(),
      finch: (() => {
        if (dayIndex <= 3) return "Walkway permit approval is boosting lumber planks value by 8.5%. Good trade days ahead!";
        if (dayIndex <= 6) return "Mint leaf prices rose by 12%. I'm coordinating shipping lines for emergency herb imports.";
        if (dayIndex <= 8) return "Entry permits for the ruins eco-tours are selling fast. Tourism is highly profitable this week.";
        return "Clock repair has restored trading manifests synchronization at the harbor docks. Order is coins!";
      })(),
      percival: (() => {
        if (dayIndex <= 3) return "As Town Head, I signed the walkway authorization. We balanced conservation with trade infrastructure.";
        if (dayIndex <= 6) return "The Council approved emergency wellness funds. We must keep classroom hygiene at peak standards.";
        if (dayIndex <= 8) return "The ruins sanctuary is officially established. Eco-tourism is permitted, but nature zones are closed.";
        return "Heritage preservation is key. The mechanical clock spire chimes have been restored by official vote.";
      })()
    };

    const reaction = characterNewsReplies[char.id] || "";
    return `Regarding the news of "${dayContent.headline}": ${reaction}`;
  }

  // 3. Name query check
  if (cleanText.includes('name') || cleanText.includes('who are you') || cleanText.includes('who is this')) {
    if (char.id === 'frill') {
      return "I am Marshal Frill, your friendly sheriff deputy! I make sure our lovely Ganache Grove paths are safe and cozy for everyone, Yogesh. I'm always happy to help our residents find their way!";
    }
    if (char.id === 'qrill') {
      return "I am Marshal Qrill, sheriff deputy in charge of route safety and optimization. It is an absolute pleasure to assist you today, Yogesh! Let me know if you need path instructions.";
    }
    return `I am ${char.name}, the ${char.role} here in Ganache Grove. It is wonderful to chat with you, Yogesh!`;
  }

  // 3. Conversational greetings
  const isGreeting = ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'greetings', 'yo'].some(k => cleanText.startsWith(k) || cleanText === k);
  if (isGreeting) {
    const greetings: Record<string, string> = {
      goldwhistle: "Greetings, Yogesh! I am busy auditing the municipal ledgers, but I always have time for an official citizen consultation. How can the Town Hall assist you today?",
      winston: "Ahoy, Yogesh! Good to see you. I just got back from patrolling the canopy trails. How are your travels going today?",
      rowan: "Hey, Yogesh! Glad you stopped by. I'm just organizing my timber joints and wafer nodes. What can I help you build today?",
      petalworth: "Hello, sweet Yogesh! What a beautiful day in the Grove. I was just misting the sugar lilies. Would you like a warm cup of herbal tea?",
      pipkin: "Hey, Yogesh! *zoom!* Did you see that? I'm practicing my double-bounce slingshot shots. Whatcha up to?",
      sheriff: "Good day, Yogesh. Just conducting my daily safety rounds. Remember to keep the pathways clear. How can the Sheriff's office help you today?",
      frill: "Hello, dear Yogesh! You look wonderful today. I've got a fresh pot of mint cocoa brewing. What brings you by my station?",
      qrill: "Greetings, Yogesh. Traffic flow and coordinate grids are currently stable. Initiating chat sequence. How may I assist your transit today?",
      maribel: "Oh, hello, Yogesh! I was just choosing some lovely golden threads for a new tapestry. It's so nice of you to chat with me!",
      page: "Good day, Yogesh. I am carefully cataloging some rare orchid spores. Please watch your step around the glass cases. How can I help you?",
      crumbleton: "Hello, Yogesh! Welcome to the bakery. The ovens are hot and the scent of fresh cinnamon buns is in the air. What treats are you craving today?",
      cedric_w: "Greetings, Yogesh. The students are currently reading their history logs, so we have a quiet moment. What educational queries do you have today?",
      hazel: "Hello, Yogesh. I'm just stocking the clinic shelves with fresh wild mint ointment. How are you feeling today? Any aches or chills?",
      hugo: "Hmph. Greetings, Yogesh. The forge is hot, so speak up over the hammer. What ironwork or boiler parts do you need today?",
      cinder: "Welcome, Yogesh! The hearth is warm, the cocoa stew is hot, and a cozy chair is waiting for you. What can I get you today?",
      finch: "Ah, Yogesh! Excellent timing. Planks and cocoa bean futures are looking very profitable today. What business shall we discuss?",
      percival: "Greetings, Yogesh. As Town Head, I always welcome discussions with our trusted citizens. What matters of community interest shall we address today?"
    };
    return greetings[char.id] || `Hello, Yogesh! It is wonderful to chat with you today. How can I help you?`;
  }

  // 4. Conversational gratitude
  if (cleanText.includes('thank') || cleanText.includes('thanks') || cleanText.includes('appreciate')) {
    return `You are very welcome, Yogesh! It is always a pleasure talking to you. We are lucky to have you in Ganache Grove!`;
  }

  // 5. Laughter / Playful reactions
  if (cleanText.includes('haha') || cleanText.includes('hehe') || cleanText.includes('lol') || cleanText.includes('funny') || cleanText.includes('joke')) {
    const laughter: Record<string, string> = {
      pipkin: "Hehehe! Right? High-five! Let's cause some harmless mischief together later!",
      petalworth: "Hehe, oh you sweet soul! Your laughter is as bright as a fresh sugar lily in the morning sun.",
      goldwhistle: "Ahem. While humor is not officially taxable, a cheerful citizen is a compliant citizen. Keep up the high spirits!",
      percival: "Haha! It is good to share a laugh, Yogesh. A cheerful heart keeps our community strong."
    };
    return laughter[char.id] || "Haha! You always know how to bring a smile to my face, Yogesh. What else is on your mind?";
  }

  // Recommended action items sync
  if (cleanText.includes('recommended action') || cleanText.includes('what should i do') || cleanText.includes('action item')) {
    const dayIndex = (new Date().getDate() % 10) + 1;
    const dayContent = DAILY_ROTATION_DATA.find(d => d.day === dayIndex) || DAILY_ROTATION_DATA[0];
    return `According to the Gazette, today's primary activity is: "${dayContent.activityName}" at the ${dayContent.activityPlace}. You can access it from your Gazette desk interface!`;
  }

  for (const kw of char.keywords) {
    if (kw.keys.some(k => cleanText.includes(k))) {
      const idx = Math.floor(Math.random() * kw.replies.length);
      return kw.replies[idx];
    }
  }

  if (cleanText.includes('secret') || cleanText.includes('hidden') || cleanText.includes('lore')) {
    const idx = Math.floor(Math.random() * char.responses.secret.length);
    return char.responses.secret[idx];
  }
  if (cleanText.includes('chore') || cleanText.includes('task') || cleanText.includes('work') || cleanText.includes('help')) {
    const idx = Math.floor(Math.random() * char.responses.chore.length);
    return char.responses.chore[idx];
  }

  // Cozy, personalized fallback responses
  const defaultReplies: Record<string, string[]> = {
    goldwhistle: [
      "I must return to my ledger sheets shortly, Yogesh, but I am listening. What else do you need audited?",
      "Every detail must be documented! Tell me more, Yogesh, so I can note it in the official town log.",
      "A tidy town is a happy town. Let's make sure our paperwork is in order!"
    ],
    winston: [
      "That's a fascinating trail to explore, Yogesh! I'll check my maps and compass for coordinates.",
      "The canopy is full of mysteries today. Let's keep our eyes open as we navigate the paths!",
      "A true explorer never stops asking questions! What's our next destination?"
    ],
    rowan: [
      "I'll need to measure that twice, Yogesh! Let's make sure our foundations are sturdy.",
      "That sounds like a fun building project! We can secure it with spruce brackets and wafer pins.",
      "Crafting takes patience, but the results are always worth it. What should we design next?"
    ],
    petalworth: [
      "What a lovely thought, sweet Yogesh! It makes my heart bloom just like my sugar lilies.",
      "I'll think about that while I tend to the orchids. They require so much gentle care!",
      "Nature always has the best answers. Shall we take a stroll through the blossoms later?"
    ],
    pipkin: [
      "Whoa, that's awesome, Yogesh! Can I launch it with my slingshot to see how far it goes?",
      "Hehe, you have the best ideas! Let's go find Chucklebop and tell him about it.",
      "I'm always ready for an adventure! Let's go explore the secret hollows!"
    ],
    sheriff: [
      "I will note that in my daily patrol report, Yogesh. Keep practicing safety on the pathways.",
      "Ganache Grove is peaceful because we all look out for each other. Thank you for sharing.",
      "Remain vigilant, citizen. Let me know if you observe any unauthorized activities."
    ],
    frill: [
      "Oh, how cozy, Yogesh! Let's talk more about it over another cup of warm mint cocoa.",
      "You always have such nice things to say! It warms my heart like a fresh hearth fire.",
      "Let's make sure everyone in the Grove feels welcome and happy today!"
    ],
    qrill: [
      "Processing input. Your query has been logged in the central coordinate database, Yogesh.",
      "Route optimization is proceeding smoothly. Let's maintain this efficient communication flow.",
      "Telemetry checks are stable. What other coordinate data do you require?"
    ],
    maribel: [
      "That is a beautiful pattern, Yogesh! I could stitch that design into a cozy woolen scarf.",
      "Stitching takes time and care, just like a good friendship. I'm so glad we are talking.",
      "Let's weave some more colorful ideas together! What do you think?"
    ],
    page: [
      "I will catalog that thought next to my rare orchid studies, Yogesh. It is quite unique.",
      "The greenhouse is a quiet place for deep thoughts. Thank you for sharing yours.",
      "Let's keep exploring the wonders of Ganache Grove's flora and fauna."
    ],
    crumbleton: [
      "That sounds as sweet as my honey rolls, Yogesh! I might need to create a new recipe for it.",
      "A warm oven and a good conversation—there's nothing better in the Grove!",
      "I'll whip up another batch of treats while we talk. What's your favorite flavor?"
    ],
    cedric_w: [
      "That is an excellent topic for a classroom essay, Yogesh. It shows great intellectual curiosity.",
      "Learning is a lifelong journey. Let's continue exploring this subject together.",
      "I will add that reference to the school library archives. Excellent observation!"
    ],
    hazel: [
      "That is a very healthy perspective, Yogesh. Taking care of your mind is as important as your body.",
      "Remember to rest, drink plenty of fresh spring water, and keep cozy!",
      "I'm always here to help you stay in peak health. Let me know how you feel."
    ],
    hugo: [
      "Tempering steel takes heat and hammer strikes, Yogesh. Good ideas take time to forge too.",
      "I'll hammer out that detail on the anvil. Speak up if you have more suggestions.",
      "Tempered brass holds its shape. Let's keep our plans sturdy."
    ],
    cinder: [
      "That's the talk of the tavern tonight, Yogesh! Everyone is sharing stories by the fire.",
      "A cozy room and a friendly chat—you're always welcome here at the inn.",
      "Let's raise a mug of hot cocoa to that! Cheers to good friends!"
    ],
    finch: [
      "That sounds like a highly profitable venture, Yogesh! Let's calculate the tariff margins.",
      "A smart merchant always listens to good advice. What are your terms?",
      "Let's keep our trade routes open and our balances high!"
    ],
    percival: [
      "As Town Head, I value your counsel, Yogesh. It helps me lead the Grove in the right direction.",
      "Let's work together to keep our community prosperous, orderly, and beautiful.",
      "Your citizenship is a credit to Ganache Grove. Thank you for discussing this with me."
    ]
  };

  const list = defaultReplies[char.id] || char.responses.default;
  const idx = Math.floor(Math.random() * list.length);
  return list[idx];
};

interface TownTalkModalProps {
  initialCharacterId: string;
  onClose: () => void;
  inventory: Record<string, number>;
  setInventory: React.Dispatch<React.SetStateAction<Record<string, number>>>;
  triggerFeedback?: (msg: string) => void;
  size?: 'normal' | 'large';
  startInChat?: boolean;
  entranceMode?: boolean;
  onStartHerbGame?: () => void;
}

export const TownTalkModal: React.FC<TownTalkModalProps> = ({
  initialCharacterId,
  onClose,
  inventory,
  setInventory,
  triggerFeedback,
  size = 'large',
  startInChat = false,
  entranceMode = false,
  onStartHerbGame
}) => {
  const [selectedCharId, setSelectedCharId] = useState(() => {
    if (initialCharacterId === 'goldwhistle') {
      const currentHour = new Date().getHours();
      const currentBlock = Math.floor(currentHour / 3);
      const blockCharacters: Record<number, string[]> = {
        0: ['pipkin', 'sheriff', 'hazel'],        // Night Whispers (Belfry/Lights/Spore moss)
        1: ['winston', 'finch'],                  // Logistics/Wharf/molasses
        2: ['rowan', 'winston'],                  // Dam Release/Water Gate/River
        3: ['finch', 'goldwhistle', 'percival'],  // Tariffs/Brokers/Tax
        4: ['crumbleton', 'hazel'],               // High Heat/Spoiling cocoa/Baker
        5: ['horace', 'frill', 'qrill'],          // Sunset Traffic/Highlands Caravan/Patrol
        6: ['goldwhistle', 'percival'],           // Weekly Address/Market Square
        7: ['hugo', 'cinder'],                    // Boiler audits/Boiler pump coal
      };
      const options = blockCharacters[currentBlock] || ['goldwhistle'];
      return options[Math.floor(Math.random() * options.length)];
    }
    return initialCharacterId || 'goldwhistle';
  });
  const [chatLogs, setChatLogs] = useState<Record<string, Message[]>>(() => {
    try {
      const stored = localStorage.getItem('tt_npc_chat_logs');
      return stored ? JSON.parse(stored) : {};
    } catch (e) {
      return {};
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('tt_npc_chat_logs', JSON.stringify(chatLogs));
    } catch (e) {
      console.error('Failed to save chat logs to localStorage:', e);
    }
  }, [chatLogs]);

  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showBondsDrawer, setShowBondsDrawer] = useState(!entranceMode);
  const [heartAnim, setHeartAnim] = useState<{ active: boolean; xp: number } | null>(null);
  const [, setTick] = useState(0); // Trigger force re-renders
  const [showLeftPanel, setShowLeftPanel] = useState(!entranceMode);
  const [showPenaltyCard, setShowPenaltyCard] = useState(false);
  const [penaltyMessage, setPenaltyMessage] = useState('');
  const [activeNewsIdx, setActiveNewsIdx] = useState(0);
  const [activeAccordion, setActiveAccordion] = useState<string | null>('directory');

  // Auto-cycle news every 6 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveNewsIdx(prev => (prev + 1) % FLASH_NEWS_DATA.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const { addCoins, addLegacy, addSkillXP, coins, spendCoins } = useTTStore();
  const chatEndRef = useRef<HTMLDivElement>(null);
  
  // Resolve current active character
  const currentChar = TALK_CHARACTERS.find(c => c.id === selectedCharId) || TALK_CHARACTERS[0];

  const [viewMode, setViewMode] = useState<'intro' | 'chat'>(entranceMode || startInChat ? 'chat' : 'intro');
  const travellerName = useTTStore(state => state.travellerName) || 'Resident';
  const dayIndex = (new Date().getDate() % 10) + 1;
  const dayContent = DAILY_ROTATION_DATA.find(d => d.day === dayIndex) || DAILY_ROTATION_DATA[0];
  const chocoDate = getChocoDate();

  // Dummy read to satisfy TypeScript unused-locals check
  useEffect(() => {
    const list = [getDailyDialogueText, dayContent, chocoDate];
    if (list.length === 0) {
      console.log(list);
    }
  }, [dayContent, chocoDate]);

  const [activeCallers, setActiveCallers] = useState<CharacterTalk[]>([]);
  const [visibleIds, setVisibleIds] = useState<string[]>([]);

  // Initialize active callers and staggered 10-second fade-in
  useEffect(() => {
    const others = TALK_CHARACTERS.filter(c => c.id !== selectedCharId);
    const shuffled = [...others].sort(() => 0.5 - Math.random());
    const callers = [currentChar, ...shuffled.slice(0, 6)]; // 7 callers in total!
    setActiveCallers(callers);
    
    setVisibleIds([]);
    // Assign a 10-second stagger delay to each caller
    const timers = callers.map((caller, idx) => {
      const delay = idx * 10000; // 0s, 10s, 20s, 30s, 40s, 50s, 60s
      return setTimeout(() => {
        setVisibleIds(prev => {
          if (prev.includes(caller.id)) return prev;
          // Play a soft chime for subsequent callers
          if (prev.length > 0) {
            try { cozyAudio.playChime(); } catch(e) { /* ignore */ }
          }
          return [...prev, caller.id];
        });
      }, delay);
    });
    
    return () => timers.forEach(clearTimeout);
  }, [selectedCharId, currentChar]);

  const handleExecuteCallingCardAction = (charId: string, option: 'opt1' | 'opt2') => {
    const requestData = CALLING_CARD_REQUESTS[charId];
    if (!requestData) return;
    
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    if (option === 'opt1') {
      if (requestData.opt1RewardCoins) {
        addCoins(requestData.opt1RewardCoins, `Calling Card: ${requestData.opt1Label}`);
      }
      if (requestData.opt1RewardLegacy) {
        addLegacy(requestData.opt1RewardLegacy);
      }
      if (requestData.opt1RewardXPCat && requestData.opt1RewardXPVal) {
        const { addSkillXP } = useTTStore.getState();
        addSkillXP(requestData.opt1RewardXPCat, requestData.opt1RewardXPVal);
      }
      
      addMessageToLog(charId, {
        sender: 'player',
        text: `⚡ [Act: Chosen option - ${requestData.opt1Label}]`,
        time: timeStr
      });

      try { cozyAudio.playChime(); } catch(e) { /* ignore chime play errors */ }
      
      setTimeout(() => {
        addMessageToLog(charId, {
          sender: 'npc',
          text: requestData.opt1Reply,
          time: timeStr
        });
      }, 600);
      
    } else if (option === 'opt2') {
      if (requestData.opt2CostKey === 'coins') {
        if (coins < (requestData.opt2CostVal || 0)) {
          triggerFeedback?.('❌ Not enough coins!');
          return;
        }
        spendCoins(requestData.opt2CostVal || 0, `Calling Card: ${requestData.opt2Label}`);
      } else if (requestData.opt2CostKey) {
        const costKey = requestData.opt2CostKey;
        const costVal = requestData.opt2CostVal || 0;
        if ((inventory[costKey] || 0) < costVal) {
          triggerFeedback?.(`❌ Not enough resources! Need x${costVal} ${costKey}`);
          return;
        }
        setInventory(prev => ({
          ...prev,
          [costKey]: Math.max(0, (prev[costKey] || 0) - costVal)
        }));
      }
      
      if (requestData.opt2RewardLegacy) {
        addLegacy(requestData.opt2RewardLegacy);
      }
      
      addMessageToLog(charId, {
        sender: 'player',
        text: `⚡ [Act: Chosen option - ${requestData.opt2Label}]`,
        time: timeStr
      });

      try { cozyAudio.playCoins(); } catch(e) { /* ignore coin play errors */ }
      try { cozyAudio.playChime(); } catch(e) { /* ignore chime play errors */ }
      
      setTimeout(() => {
        addMessageToLog(charId, {
          sender: 'npc',
          text: requestData.opt2Reply,
          time: timeStr
        });
      }, 600);
    }
    
    localStorage.setItem(`tt_calling_card_resolved_${charId}`, 'true');
    setTick(t => t + 1);
  };

  // Load Friendship State
  const [friendship, setFriendship] = useState<{ level: number; xp: number }>(() => {
    return getFriendship(selectedCharId);
  });

  useEffect(() => {
    const raw = localStorage.getItem(`tt_friendship_${selectedCharId}`);
    setFriendship(raw ? JSON.parse(raw) : { level: 1, xp: 0 });
  }, [selectedCharId]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatLogs, isTyping, selectedCharId]);

  // Initial greeting message load (synchronized with calling card dialogues)
  useEffect(() => {
    setChatLogs(prev => {
      if (prev[selectedCharId]) return prev;
      const now = new Date();
      const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      
      // Resolve the exact same calling card dialogue bubble text
      const callerIdx = activeCallers.findIndex(c => c.id === selectedCharId);
      const idx = callerIdx !== -1 ? callerIdx : 0;
      const headline = (DAILY_ROTATION_DATA[(dayIndex - 1 + idx) % 10] || DAILY_ROTATION_DATA[0]).headline;
      const initialText = getShortDailyDialogue(selectedCharId, travellerName, headline);

      return {
        ...prev,
        [selectedCharId]: [
          { sender: 'npc', text: initialText, time: timeStr }
        ]
      };
    });
  }, [selectedCharId, currentChar, activeCallers, travellerName, dayIndex]);

  const addMessageToLog = (charId: string, message: Message) => {
    // Dynamically replace hardcoded "Yogesh" developer name with travelerName
    const cleanText = message.text.replace(/Yogesh/g, travellerName);
    setChatLogs(prev => ({
      ...prev,
      [charId]: [...(prev[charId] || []), { ...message, text: cleanText }]
    }));
  };

  const handleSend = (text: string) => {
    if (!text.trim()) return;
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    addMessageToLog(selectedCharId, { sender: 'player', text, time: timeStr });
    setInputText('');
    
    // Check for harsh words
    const lowerText = text.toLowerCase();
    const containsHarsh = HARSH_WORDS.some(word => lowerText.includes(word));

    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      const respTime = new Date();
      const respTimeStr = respTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      
      if (containsHarsh) {
        const reply = "I think I have other work to do. We will talk later.";
        addMessageToLog(selectedCharId, { sender: 'npc', text: reply, time: respTimeStr });
        cozyAudio.playClick();
        
        // Deduct 50 coins
        spendCoins(50, 'Rude Conduct Fine', true);
        
        // Show penalty card
        setPenaltyMessage(`Marshal Frill has issued a ticket to ${travellerName} for rude/inappropriate language. Obey the local bylaws!`);
        setShowPenaltyCard(true);
        
        setTimeout(() => {
          onClose();
        }, 3000);
      } else {
        const reply = getCharacterReply(currentChar, text);
        addMessageToLog(selectedCharId, { sender: 'npc', text: reply, time: respTimeStr });
        cozyAudio.playClick();
      }
    }, 700);
  };

  // ── Gossip Action ──
  const checkGossipAvailable = () => {
    const todayStr = new Date().toISOString().slice(0, 10);
    const key = `tt_talk_gossip_${selectedCharId}_${todayStr}`;
    return localStorage.getItem(key) !== 'true';
  };

  const handleShareGossip = () => {
    if (!checkGossipAvailable()) return;
    const todayStr = new Date().toISOString().slice(0, 10);
    localStorage.setItem(`tt_talk_gossip_${selectedCharId}_${todayStr}`, 'true');

    // Add dialog
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    addMessageToLog(selectedCharId, {
      sender: 'player',
      text: "Hey! Did you hear about the new trade routes or the local forest whispers today?",
      time: timeStr
    });

    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const responses = [
        "Fascinating! I love some fresh gossip over tea. That helps clear up a few rumors!",
        "Aha! That explains what the forest rangers were talking about earlier! Thanks for the scoop.",
        "A juicy slice of information! The town hall records will certainly look interesting tomorrow."
      ];
      const reply = responses[Math.floor(Math.random() * responses.length)];
      addMessageToLog(selectedCharId, { sender: 'npc', text: reply, time: timeStr });
      
      // Reward FP
      awardFriendshipPoints(10);
    }, 600);
  };

  // â”€â”€ Gifting Action â”€â”€
  const handleGiftItem = (itemKey: string) => {
    if ((inventory[itemKey] || 0) <= 0) return;

    // Deduct item
    setInventory(prev => ({
      ...prev,
      [itemKey]: Math.max(0, (prev[itemKey] || 0) - 1)
    }));

    const isLoved = currentChar.lovedItems.includes(itemKey);
    const isDisliked = currentChar.dislikedItems.includes(itemKey);
    const xpReward = isLoved ? 20 : isDisliked ? 2 : 8;

    const itemLabels: Record<string, string> = {
      wood: 'Ganache Wood 🪵',
      bolts: 'Chewy Bolts 🔩',
      moss: 'Cooling Moss 🌿',
      mucus: 'Salamander Mucus 🧪',
      parchment: 'Parchment Paper 📄',
      ink: 'Sweet Ink ✒️'
    };

    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    // Player message
    addMessageToLog(selectedCharId, {
      sender: 'player',
      text: `🎁 [Gift Offered: ${itemLabels[itemKey] || itemKey}]`,
      time: timeStr
    });

    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const reply = isLoved 
        ? currentChar.loveReaction
        : isDisliked 
          ? "Hmph. I suppose this is technically an item, but I don't really have any use for it."
          : currentChar.normalReaction;
      
      addMessageToLog(selectedCharId, { sender: 'npc', text: reply, time: timeStr });
      
      // Award FP
      awardFriendshipPoints(xpReward);
    }, 600);
  };

  const awardFriendshipPoints = (pts: number) => {
    // Play sound and trigger heart burst animation
    cozyAudio.playChime();
    setHeartAnim({ active: true, xp: pts });
    setTimeout(() => setHeartAnim(null), 1800);

    const oldFriendship = getFriendship(selectedCharId);
    let nextXP = oldFriendship.xp + pts;
    let nextLvl = oldFriendship.level;
    let leveledUp = false;

    while (nextXP >= 100 && nextLvl < 5) {
      nextXP -= 100;
      nextLvl += 1;
      leveledUp = true;
    }

    if (nextLvl === 5) nextXP = 0;

    const updated = { level: nextLvl, xp: nextXP };
    localStorage.setItem(`tt_friendship_${selectedCharId}`, JSON.stringify(updated));
    setFriendship(updated);

    if (leveledUp) {
      // Award coins
      addCoins(8, `Leveled up friendship with ${currentChar.name}`);
      addLegacy(5);
      addSkillXP('explorer', 40);
      
      // Add system message
      const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      addMessageToLog(selectedCharId, {
        sender: 'system',
        text: `❤️ Friendship Level Up! You are now Level ${nextLvl} with ${currentChar.name}. Gained +8 Cocoa Coins, +40 Explorer XP & +5 Legacy!`,
        time: timeStr
      });

      // Send Mail letter
      const mailId = generateMailId();
      const levelTitles: Record<number, string> = {
        2: 'Warm Friend',
        3: 'Kind Companion',
        4: 'Trusted Ally',
        5: 'Townsfolk Soulmate'
      };
      
      const newMail = {
        id: mailId,
        from: currentChar.name,
        subject: `To My Friend ${useTTStore.getState().travellerName || 'Resident'} 💌`,
        body: `Dear friend, our chats and gifts have truly made my days in the Grove so much brighter. I now consider you a true ${levelTitles[nextLvl] || 'Companion'}. Please accept these 30 Cocoa Coins as a small token of my gratitude. Let's keep making our home a warmer place for everyone!`,
        read: false,
        timestamp: new Date().toISOString()
      };
      
      useTTStore.setState((state) => ({
        mailbox: [newMail, ...state.mailbox]
      }));
    }
  };

  const currentMessages = chatLogs[selectedCharId] || [];
  const levelNames: Record<number, string> = {
    1: 'Acquaintance 🏡',
    2: 'Warm Neighbor 🍂',
    3: 'Cozy Companion 🍯',
    4: 'Trusted Citizen 🌳',
    5: 'BFF / Town Soulmate 💝'
  };

  const sizeClasses = entranceMode
    ? 'w-[82vw] h-[82vh] rounded-[2.2rem]'
    : size === 'large'
      ? 'w-[90vw] h-[90vh] rounded-[2.2rem]'
      : 'w-[85vw] h-[85vh] rounded-[2.2rem]';

  return (
    <div className={`${sizeClasses} overflow-hidden flex flex-col relative text-left select-none`}
      style={{
        background: 'rgba(0, 0, 0, 0.60)',
        border: '1.5px solid rgba(251,191,36,0.25)',
        boxShadow: '0 0 0 1px rgba(255,255,255,0.04) inset, 0 50px 140px rgba(0,0,0,0.9), 0 0 60px rgba(251,191,36,0.06)'
      }}
    >
      {/* ── CUSTOM HEADERS ANIMATION STYLES ── */}
      <style>{`
        @keyframes ttTalkHeaderJump {
          0%, 100% { transform: translateY(0); }
          50%      { transform: translateY(-4px); }
        }
        .animate-talk-header-jump {
          animation: ttTalkHeaderJump 2.8s ease-in-out infinite;
        }
      `}</style>

      {/* ── DECORATIVE TOP GLOW LINE ── */}
      <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-amber-400/60 to-transparent pointer-events-none z-20" />

      {/* ── HEADER BAR ── */}
      <div className="w-full shrink-0 relative z-10 overflow-hidden"
        style={{ background: 'linear-gradient(90deg, rgba(30,18,4,0.7) 0%, rgba(40,24,6,0.6) 50%, rgba(30,18,4,0.7) 100%)' }}
      >
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: 'repeating-linear-gradient(45deg, #fff 0, #fff 1px, transparent 0, transparent 50%)', backgroundSize: '8px 8px' }}
        />
        <div className="relative flex items-center justify-between px-6 py-4 gap-4">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-lg"
              style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)', boxShadow: '0 4px 16px rgba(245,158,11,0.4)' }}
            >
              <span className="text-xl">🏡</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg md:text-xl font-brand text-amber-300 uppercase tracking-[0.18em] leading-none flex items-center"
                  style={{ fontFamily: FONT, textShadow: '0 0 20px rgba(251,191,36,0.5)' }}
                >
                  {(entranceMode ? "Enroute to Ganache Grove" : "Townsfolk Calling").split('').map((char, index) => (
                    <span
                      key={index}
                      className="inline-block animate-talk-header-jump hover:text-yellow-300 transition-colors duration-200"
                      style={{ animationDelay: `${index * 0.04}s` }}
                    >
                      {char === ' ' ? '\u00A0' : char}
                    </span>
                  ))}
                </h2>
                <span className="px-2 py-0.5 bg-amber-400/15 border border-amber-400/30 text-amber-300 text-[8px] font-black uppercase tracking-widest rounded-full">
                  {entranceMode ? "Briefing" : "Live"}
                </span>
              </div>
              <p className="text-[10px] text-amber-100/45 font-sans mt-0.5 leading-snug max-w-lg">
                {entranceMode 
                  ? "A local resident has stopped you to chat. Verify your agenda or chat one-on-one."
                  : "Your neighbours are home! Chat daily, share gossip & gifts, complete calling cards to level up your bonds. 💌"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="bg-transparent hover:text-yellow-300 text-yellow-400 font-brand font-black uppercase text-sm tracking-widest transition-all hover:scale-105 active:scale-95 cursor-pointer border-none flex items-center gap-1.5"
            style={{ fontFamily: '"Josefin Sans", sans-serif' }}
          >
            {entranceMode ? "🚪 Enter Cottage - ✕" : "Close & Enter Town - ✕"}
          </button>
        </div>
        <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />
      </div>

      {viewMode === 'intro' ? (
        <div className="flex-grow min-h-0 w-full relative select-none overflow-hidden border-t-2 border-b-2 border-amber-500/25 shadow-[inset_0_4px_20px_rgba(0,0,0,0.8),inset_0_-4px_20px_rgba(0,0,0,0.8)]"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.60)' }}
        >
          {/* Custom style block for floating animations */}
          <style>{`
            @keyframes floatSlow {
              0%, 100% { transform: translateY(0px) scale(1); }
              50% { transform: translateY(-6px) scale(1.006); }
            }
            .animate-float-1 { animation: floatSlow 6s ease-in-out infinite; }
            .animate-float-2 { animation: floatSlow 7s ease-in-out infinite 0.5s; }
            .animate-float-3 { animation: floatSlow 6.5s ease-in-out infinite 1s; }
            .animate-float-4 { animation: floatSlow 7.5s ease-in-out infinite 1.5s; }
            .animate-float-5 { animation: floatSlow 5.8s ease-in-out infinite 2s; }
            .animate-float-6 { animation: floatSlow 6.2s ease-in-out infinite 2.5s; }
            .animate-float-7 { animation: floatSlow 6.8s ease-in-out infinite 3s; }
          `}</style>

          {/* Subtle background ambient circles */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/5 rounded-full filter blur-[80px] pointer-events-none animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-500/5 rounded-full filter blur-[80px] pointer-events-none animate-pulse" />

          {/* 7 Permanent Scattered Slots */}
          {activeCallers.map((caller, idx) => {
            const isVisible = visibleIds.includes(caller.id);
            const pos = SLOT_POSITIONS[idx] || { top: '50%', left: '50%' };
            const animClass = `animate-float-${(idx % 7) + 1}`;
            const isPrimary = idx === 0;
            const isReverse = idx % 2 !== 0;

            return (
              <div
                key={caller.id}
                className={`absolute flex items-start gap-2.5 transition-all duration-700 transform ${animClass} ${
                  isReverse ? 'flex-row-reverse' : 'flex-row'
                } ${
                  isVisible 
                    ? 'opacity-100 scale-100 translate-y-0' 
                    : 'opacity-0 scale-90 translate-y-4 pointer-events-none'
                }`}
                style={{
                  top: pos.top,
                  left: pos.left,
                  right: pos.right,
                }}
              >
                {/* Round face avatar (w-[110px] h-[110px] size, matching bubble height) */}
                <div className={`w-[110px] h-[110px] rounded-full overflow-hidden bg-black ring-2 shrink-0 transition-transform hover:scale-110 duration-300 ${
                  isPrimary 
                    ? 'ring-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.5)]' 
                    : 'ring-amber-400/60 shadow-[0_0_8px_rgba(245,158,11,0.2)]'
                }`}>
                  <img
                    src={caller.avatar}
                    alt={caller.name}
                    className="w-full h-full object-contain"
                    onError={(e) => { (e.target as HTMLImageElement).src = '/Assets/Ganache Grove/Scene_0.1.png'; }}
                  />
                </div>

                {/* Golden Framed Dialogue Bubble with Unique Color Plate (Standard Uniform Size) */}
                <div className={`w-[300px] h-[110px] rounded-2xl p-3 text-left border-2 transition-all flex flex-col justify-between ${
                  isReverse ? 'rounded-tr-none' : 'rounded-tl-none'
                } ${BUBBLE_PLATES[idx % 7].bg} ${BUBBLE_PLATES[idx % 7].text} ${
                  isPrimary 
                    ? 'border-amber-400 shadow-[0_0_18px_rgba(245,158,11,0.4)]' 
                    : 'border-amber-400/60 shadow-[0_0_12px_rgba(245,158,11,0.2)]'
                }`}>
                  {/* Tiny bubble triangle centered to larger avatar */}
                  {isReverse ? (
                    <div className={`absolute top-[50px] -right-1.5 w-0 h-0 border-t-[5px] border-t-transparent border-l-[7px] border-b-[5px] border-b-transparent ${
                      isPrimary ? 'border-l-amber-400' : 'border-l-amber-400/60'
                    }`} />
                  ) : (
                    <div className={`absolute top-[50px] -left-1.5 w-0 h-0 border-t-[5px] border-t-transparent border-r-[7px] border-b-[5px] border-b-transparent ${
                      isPrimary ? 'border-r-amber-400' : 'border-r-amber-400/60'
                    }`} />
                  )}
                  
                  <div className="flex items-center justify-between gap-2 mb-1 select-none">
                    <span className={`text-[9.5px] font-black uppercase tracking-wider ${BUBBLE_PLATES[idx % 7].name}`}>
                      {caller.name} <span className="text-[7.5px] text-white font-semibold">({caller.role})</span>
                    </span>
                    {isPrimary && (
                      <span className="px-1.5 py-0.2 bg-amber-400/20 border border-amber-400/30 text-amber-300 text-[6.5px] font-black uppercase tracking-widest rounded select-none">
                        Primary
                      </span>
                    )}
                  </div>
                  
                  <p className="text-[11px] font-sans leading-relaxed italic">
                    "{getShortDailyDialogue(caller.id, travellerName, (DAILY_ROTATION_DATA[(dayIndex - 1 + idx) % 10] || DAILY_ROTATION_DATA[0]).headline)}"
                  </p>
                </div>
              </div>
            );
          })}

          {/* Bottom Center Action Buttons */}
          <div className="absolute bottom-[20px] left-1/2 -translate-x-1/2 flex items-center justify-center gap-4 z-30">
            <button
              onClick={() => {
                cozyAudio.playClick();
                setViewMode('chat');
              }}
              className="px-8 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-neutral-950 font-brand text-[10.5px] font-black uppercase tracking-widest rounded-2xl shadow-[0_6px_24px_rgba(245,158,11,0.35)] hover:scale-105 active:scale-95 transition-all cursor-pointer"
              style={{ fontFamily: '"Josefin Sans", sans-serif' }}
            >
              💬 Let's Talk
            </button>

            <button
              onClick={onClose}
              className="px-8 py-2.5 bg-neutral-900 hover:bg-neutral-850 border border-white/10 text-white/80 hover:text-white font-brand text-[10.5px] font-black uppercase tracking-widest rounded-2xl shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer"
              style={{ fontFamily: '"Josefin Sans", sans-serif' }}
            >
              🏡 Skip to Cottage
            </button>
          </div>
        </div>
      ) : (
        <div className="flex-grow w-full flex flex-col md:flex-row min-h-0 overflow-hidden">

        {/* ── LEFT: Active Caller Portrait (26%) ── */}
        {showLeftPanel && (
          <div className="w-full md:w-[26%] flex flex-col shrink-0 h-[30%] md:h-full relative overflow-hidden"
            style={{ background: 'rgba(0, 0, 0, 0.60)' }}
          >
            {/* Left Hide button moved to center panel */}
            <div className="hidden md:block w-full h-full p-3 shrink-0">
              <div className="w-full h-full relative overflow-hidden rounded-3xl border-2 border-amber-500/40 shadow-[0_0_20px_rgba(251,191,36,0.15)] bg-black/40">
                <img
                  src={currentChar.avatar}
                  alt={currentChar.name}
                  className="w-full h-full object-contain transition-all duration-700"
                  onError={(e) => { (e.target as HTMLImageElement).src = '/Assets/Ganache Grove/Scene_0.1.png'; }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-3 right-3">
                  <div className="flex items-end justify-between">
                    <div>
                      <span className="text-[15px] font-black uppercase tracking-[0.2em] text-amber-400 block">Active Caller</span>
                      <h4 className="text-[16px] font-brand text-yellow-300 uppercase leading-tight mt-1"
                        style={{ fontFamily: FONT, textShadow: '0 2px 8px rgba(0,0,0,0.9)' }}
                      >{currentChar.name}</h4>
                      <span className="text-[15px] text-amber-300/70 font-sans">{currentChar.role}</span>
                    </div>
                    <div className="flex flex-col items-center gap-0.5 bg-black/60 border border-rose-400/30 px-2 py-1 rounded-xl">
                      <span className="text-base leading-none">❤️</span>
                      <span className="text-[15px] font-black text-rose-300 leading-none">Lv {friendship.level}</span>
                    </div>
                  </div>
                  <div className="mt-2.5 w-full bg-white/10 rounded-full h-1 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-rose-500 to-pink-400 transition-all duration-700 rounded-full"
                      style={{ width: `${Math.min(100, friendship.xp)}%`, boxShadow: '0 0 8px rgba(244,63,94,0.6)' }}
                    />
                  </div>
                  <span className="text-[15px] text-white/30 font-sans mt-1 block">{friendship.xp}/100 XP to next level</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── CENTER: Chat Area ── */}
        <div className="flex-grow flex flex-col min-w-0 relative h-[70%] md:h-full"
          style={{ background: 'rgba(0, 0, 0, 0.60)' }}
        >
          {!showLeftPanel && (
            <button
              onClick={() => { cozyAudio.playClick(); setShowLeftPanel(true); }}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-30 py-4 px-1.5 rounded-r-xl bg-orange-500 hover:bg-orange-400 text-black font-brand text-[10px] uppercase tracking-widest cursor-pointer shadow-md select-none transition-all duration-200 border-y border-r border-orange-600 border-l-0"
              style={{ writingMode: 'vertical-rl', textOrientation: 'mixed', fontFamily: '"Josefin Sans", sans-serif' }}
            >
              Unhide
            </button>
          )}
          {showLeftPanel && (
            <button
              onClick={() => { cozyAudio.playClick(); setShowLeftPanel(false); }}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-30 py-4 px-1.5 rounded-r-xl bg-orange-500 hover:bg-orange-400 text-black font-brand text-[10px] uppercase tracking-widest cursor-pointer shadow-md select-none transition-all duration-200 border-y border-r border-orange-600 border-l-0"
              style={{ writingMode: 'vertical-rl', textOrientation: 'mixed', fontFamily: '"Josefin Sans", sans-serif' }}
            >
              Hide
            </button>
          )}
          {showBondsDrawer && (
            <button
              onClick={() => { cozyAudio.playClick(); setShowBondsDrawer(false); }}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-30 py-4 px-1.5 rounded-l-xl bg-orange-500 hover:bg-orange-400 text-black font-brand text-[10px] uppercase tracking-widest cursor-pointer shadow-md select-none transition-all duration-200 border-y border-l border-orange-600 border-r-0"
              style={{ writingMode: 'vertical-rl', textOrientation: 'mixed', fontFamily: '"Josefin Sans", sans-serif' }}
            >
              Hide
            </button>
          )}
          {!showBondsDrawer && (
            <button
              onClick={() => { cozyAudio.playClick(); setShowBondsDrawer(true); }}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-30 py-4 px-1.5 rounded-l-xl bg-orange-500 hover:bg-orange-400 text-black font-brand text-[10px] uppercase tracking-widest cursor-pointer shadow-md select-none transition-all duration-200 border-y border-l border-orange-600 border-r-0"
              style={{ writingMode: 'vertical-rl', textOrientation: 'mixed', fontFamily: '"Josefin Sans", sans-serif' }}
            >
              Unhide
            </button>
          )}
          {/* Floating friendship XP popup */}
          {heartAnim && (
            <div className="absolute inset-0 flex items-center justify-center z-50 pointer-events-none">
              <div className="flex flex-col items-center gap-1 animate-bounce">
                <div className="bg-gradient-to-r from-rose-600 to-pink-500 text-white font-brand text-sm px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-2 border border-rose-400/30"
                  style={{ boxShadow: '0 8px 32px rgba(244,63,94,0.5)' }}
                >
                  <span className="text-xl">💖</span>
                  <span>+{heartAnim.xp} Friendship XP!</span>
                </div>
                <span className="text-[9px] text-rose-300/70 font-sans">Bond strengthened! ✨</span>
              </div>
            </div>
          )}

          {/* Chat header */}
          <div className="px-4 py-3 border-b shrink-0 flex items-center justify-between"
            style={{ borderColor: 'rgba(251,191,36,0.08)', background: 'transparent' }}
          >
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full overflow-hidden bg-black shrink-0 ring-2 ring-amber-500/40 transition-all`}
                style={{ boxShadow: '0 0 0 2px rgba(251,191,36,0.3), 0 0 16px rgba(251,191,36,0.15)' }}
              >
                <img
                  src={currentChar.avatar}
                  alt={currentChar.name}
                  className="w-full h-full object-contain"
                  onError={(e) => { (e.target as HTMLImageElement).src = '/Assets/Ganache Grove/Scene_0.1.png'; }}
                />
              </div>
              <div>
                <h3 className="text-sm font-brand text-yellow-300 leading-none" style={{ fontFamily: FONT }}>{currentChar.name}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[9px] font-semibold px-2 py-0.5 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-300">{currentChar.role}</span>
                  <span className="text-[9px] text-rose-400 font-bold flex items-center gap-0.5">
                    ❤️ Level {friendship.level}
                    <span className="text-white/30 ml-1">({friendship.xp}/100)</span>
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  cozyAudio.playClick();
                  useTTStore.getState().setShowTownTour(true);
                }}
                className="px-3.5 py-1.5 text-[11px] font-black rounded-xl border border-rose-500/40 text-rose-350 bg-rose-500/10 hover:bg-rose-500/25 transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
                style={{ fontFamily: '"Josefin Sans", sans-serif' }}
              >
                📖 Verify Agenda
              </button>

              {entranceMode && (
                <button
                  onClick={() => {
                    cozyAudio.playClick();
                    setShowLeftPanel(p => !p);
                    setShowBondsDrawer(p => !p);
                  }}
                  className={`px-3.5 py-1.5 text-[11px] font-black rounded-xl border transition-all flex items-center gap-1.5 cursor-pointer ${
                    showLeftPanel && showBondsDrawer
                      ? 'bg-amber-500/20 border-amber-400/40 text-amber-300 shadow-[0_0_12px_rgba(251,191,36,0.2)]'
                      : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/8'
                  }`}
                  style={{ fontFamily: '"Josefin Sans", sans-serif' }}
                >
                  💬 Townsfolk Calling
                </button>
              )}

              <button
                onClick={() => { cozyAudio.playClick(); setShowBondsDrawer(!showBondsDrawer); }}
                className={`px-3.5 py-1.5 text-[11px] font-black rounded-xl border transition-all flex items-center gap-1.5 cursor-pointer ${
                  showBondsDrawer
                    ? 'bg-amber-500/20 border-amber-400/40 text-amber-300 shadow-[0_0_12px_rgba(251,191,36,0.2)]'
                    : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/8'
                }`}
                style={{ fontFamily: '"Josefin Sans", sans-serif' }}
              >
                💝 Bonds &amp; Gifts
              </button>
            </div>
          </div>

          {/* Message log */}
          <div className="flex-grow overflow-y-auto custom-scrollbar px-4 py-4 space-y-3 min-h-0">
            {/* Live Town news sync banner */}
            {(() => {
              const dayIndex = (new Date().getDate() % 10) + 1;
              const dayContent = DAILY_ROTATION_DATA.find(d => d.day === dayIndex) || DAILY_ROTATION_DATA[0];
              return (
                <div className="mb-4 p-3 bg-amber-500/10 border border-amber-500/25 rounded-2xl flex items-start gap-2.5 shadow-md">
                  <span className="text-base select-none">📰</span>
                  <div className="flex-1 min-w-0">
                    <span className="text-[7.5px] font-black uppercase tracking-[0.2em] text-amber-300 block mb-0.5">Ganache Gazette Daily Edition</span>
                    <p className="text-[10px] text-amber-100/75 leading-relaxed font-sans italic">
                      "{dayContent.headline}"
                    </p>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className="text-[7.5px] font-black text-cyan-300 uppercase tracking-wider">Today's Activity:</span>
                      <span className="text-[8px] text-cyan-200/80 font-sans truncate">{dayContent.activityName}</span>
                    </div>
                  </div>
                </div>
              );
            })()}

            {currentMessages.map((msg, index) => {
              const isPlayer = msg.sender === 'player';
              const isSystem = msg.sender === 'system';

              if (isSystem) {
                return (
                  <div key={index} className="flex justify-center my-2">
                    <div className="px-5 py-2 rounded-2xl text-[14px] font-semibold font-sans text-center border"
                      style={{ background: 'rgba(244,63,94,0.08)', borderColor: 'rgba(244,63,94,0.25)', color: '#fca5a5' }}
                    >
                      {msg.text}
                    </div>
                  </div>
                );
              }

              return (
                <div key={index} className={`flex gap-2.5 max-w-[82%] ${isPlayer ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}>
                  {!isPlayer && (
                    <div className="w-8 h-8 rounded-full overflow-hidden bg-black shrink-0 ring-1 ring-amber-400/20 mt-1">
                      <img src={currentChar.avatar} alt={currentChar.name} className="w-full h-full object-contain"
                        onError={(e) => { (e.target as HTMLImageElement).src = '/Assets/Ganache Grove/Scene_0.1.png'; }}
                      />
                    </div>
                  )}
                  <div className="text-left">
                    <div className={`px-4 py-2.5 rounded-2xl text-[15px] font-medium leading-relaxed font-sans shadow-lg ${
                      isPlayer
                        ? 'rounded-tr-sm text-black font-semibold'
                        : 'rounded-tl-sm text-amber-100/95 border border-white/8'
                    }`}
                      style={isPlayer
                        ? { background: 'linear-gradient(135deg, #f59e0b, #d97706)', boxShadow: '0 4px 16px rgba(245,158,11,0.3)' }
                        : { background: 'rgba(255,255,255,0.06)' }
                      }
                    >
                      {msg.text}
                    </div>
                    <span className={`text-[7.5px] text-white/25 block mt-0.5 font-sans ${isPlayer ? 'text-right' : 'text-left'}`}>
                      {msg.time}
                    </span>
                  </div>
                </div>
              );
            })}

            {isTyping && (
              <div className="flex gap-2.5 mr-auto items-center">
                <div className="w-8 h-8 rounded-full overflow-hidden bg-black shrink-0 ring-1 ring-amber-400/20">
                  <img src={currentChar.avatar} alt={currentChar.name} className="w-full h-full object-contain"
                    onError={(e) => { (e.target as HTMLImageElement).src = '/Assets/Ganache Grove/Scene_0.1.png'; }}
                  />
                </div>
                <div className="px-4 py-3 rounded-2xl rounded-tl-sm border border-white/8 flex gap-1.5 items-center"
                  style={{ background: 'rgba(255,255,255,0.06)' }}
                >
                  {[0, 150, 300].map(delay => (
                    <span key={delay} className="h-1.5 w-1.5 bg-amber-400/60 rounded-full animate-bounce" style={{ animationDelay: `${delay}ms` }} />
                  ))}
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* ── Calling Card panel ── */}
          {(() => {
            const isResolved = localStorage.getItem(`tt_calling_card_resolved_${selectedCharId}`) === 'true';
            const requestData = CALLING_CARD_REQUESTS[selectedCharId];
            if (!requestData) return null;
            return (
              <div className="px-4 py-3 shrink-0 relative overflow-hidden border-t"
                style={{ borderColor: 'rgba(251,191,36,0.12)', background: 'rgba(0, 0, 0, 0.40)' }}
              >
                <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" />
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2 flex-grow min-w-0">
                    <span className="text-lg shrink-0 mt-0.5">📮</span>
                    <div className="min-w-0">
                      <span className="text-[11px] font-black uppercase tracking-[0.25em] text-orange-400 block">Calling Card</span>
                      <p className="text-[15px] text-yellow-100 font-semibold font-sans leading-snug mt-0.5 truncate">{requestData.request}</p>
                    </div>
                  </div>
                  {isResolved && (
                    <span className="px-2 py-0.5 rounded-lg text-[8px] font-black uppercase shrink-0 mt-1"
                      style={{ background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.3)', color: '#6ee7b7' }}
                    >✓ Done</span>
                  )}
                </div>
                {!isResolved && (
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <button
                      onClick={() => handleExecuteCallingCardAction(selectedCharId, 'opt1')}
                      className="py-2 px-3 rounded-xl text-[15px] font-semibold text-center transition active:scale-95 border font-sans text-white/85 hover:text-white cursor-pointer"
                      style={{ background: 'rgba(255,255,255,0.06)', borderColor: 'rgba(255,255,255,0.1)' }}
                    >
                      {requestData.opt1Label}
                    </button>
                    <button
                      disabled={requestData.opt2CostKey === 'coins' && coins < (requestData.opt2CostVal || 0)}
                      onClick={() => handleExecuteCallingCardAction(selectedCharId, 'opt2')}
                      className={`py-2 px-3 rounded-xl text-[15px] font-black text-center transition active:scale-95 font-sans cursor-pointer ${
                        requestData.opt2CostKey === 'coins' && coins < (requestData.opt2CostVal || 0)
                          ? 'bg-neutral-800 text-white/20 cursor-not-allowed border border-neutral-700'
                          : 'text-black border-0 hover:brightness-110'
                      }`}
                      style={!(requestData.opt2CostKey === 'coins' && coins < (requestData.opt2CostVal || 0))
                        ? { background: 'linear-gradient(135deg, #f59e0b, #d97706)', boxShadow: '0 4px 12px rgba(245,158,11,0.35)' } : {}}
                    >
                      {requestData.opt2Label}
                    </button>
                  </div>
                )}
              </div>
            );
          })()}

          {/* ── Quick dialogue chips ── */}
          <div className="px-4 py-2 shrink-0 flex flex-wrap gap-1.5 border-t" style={{ borderColor: 'rgba(255,255,255,0.04)', background: 'transparent' }}>
            {(() => {
              const base = [
                { label: '🤫 Ask a Secret', msg: 'Tell me a town secret!', isSpecial: false },
                { label: '🎭 Tell a Joke', msg: 'Do you have a joke for me?', isSpecial: false },
                { label: '🧹 Need a Chore?', msg: 'Is there any chore I can help with?', isSpecial: false },
                { label: '📰 Ask about news', msg: "What's your take on the latest town news?", isSpecial: false },
                { label: '📋 Action Item?', msg: 'Are there any recommended action items for me?', isSpecial: false },
              ];
              if (currentChar.id === 'cedric' && entranceMode && onStartHerbGame) {
                return [
                  { label: '📦 Deliver Herbs (Mini-Game)', msg: '', isSpecial: true },
                  ...base
                ];
              }
              return base;
            })().map(chip => (
              <button 
                key={chip.label} 
                onClick={() => {
                  if (chip.isSpecial && onStartHerbGame) {
                    onStartHerbGame();
                  } else {
                    handleSend(chip.msg);
                  }
                }}
                className="px-3 py-1 rounded-xl text-[15px] font-semibold border transition-all hover:scale-105 active:scale-95 font-sans text-amber-200/85 hover:text-amber-350 cursor-pointer border-amber-500/20 hover:border-amber-400/30"
                style={{ background: 'rgba(255,255,255,0.04)' }}
              >
                {chip.label}
              </button>
            ))}
          </div>

          {/* ── Chat input ── */}
          <form onSubmit={(e) => { e.preventDefault(); handleSend(inputText); }}
            className="px-4 py-3 shrink-0 flex gap-2 items-center border-t"
            style={{ borderColor: 'rgba(255,255,255,0.06)', background: 'rgba(0, 0, 0, 0.20)' }}
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={`Chat with ${currentChar.name}...`}
              className="flex-grow rounded-xl px-4 py-2.5 text-[15px] text-white placeholder-white/25 focus:outline-none font-sans transition-all"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', ...(inputText ? { borderColor: 'rgba(251,191,36,0.35)' } : {}) }}
            />
            <button type="submit" disabled={!inputText.trim()}
              className="px-4 py-2.5 rounded-xl text-[15px] font-black uppercase tracking-wider transition hover:scale-105 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed font-sans cursor-pointer"
              style={{ fontFamily: '"Josefin Sans", sans-serif',
                background: inputText.trim() ? 'linear-gradient(135deg, #f59e0b, #d97706)' : 'rgba(50,40,20,0.6)',
                color: inputText.trim() ? '#000' : 'rgba(255,255,255,0.2)',
                boxShadow: inputText.trim() ? '0 4px 16px rgba(245,158,11,0.35)' : 'none'
              }}
            >
              Send 🚀
            </button>
          </form>

          {/* ── Bottom nav bar ── */}
          <div className="px-4 py-3 shrink-0 flex justify-end items-center gap-3 border-t"
            style={{ borderColor: 'rgba(255,255,255,0.05)', background: 'transparent' }}
          >
            <button
              onClick={() => {
                cozyAudio.playClick();
                const currentIndex = TALK_CHARACTERS.findIndex(c => c.id === selectedCharId);
                if (currentIndex !== -1 && currentIndex < TALK_CHARACTERS.length - 1) {
                  setSelectedCharId(TALK_CHARACTERS[currentIndex + 1].id);
                } else {
                  onClose();
                }
              }}
              className="px-5 py-2.5 rounded-xl text-[12px] font-black uppercase tracking-wider transition hover:scale-105 active:scale-95 font-sans flex items-center gap-2 cursor-pointer"
              style={{
                fontFamily: '"Josefin Sans", sans-serif',
                background: 'linear-gradient(135deg, #f59e0b 0%, #ea580c 100%)',
                boxShadow: '0 4px 20px rgba(245,158,11,0.35)',
                color: '#000'
              }}
            >
              {TALK_CHARACTERS.findIndex(c => c.id === selectedCharId) === TALK_CHARACTERS.length - 1
                ? '🏁 Finish Meeting'
                : 'Meet Next Neighbour →'}
            </button>
          </div>
        </div>

        {/* ── RIGHT: Bonds, Directory & Gifting Panel Accordions (25%) ── */}
        {showBondsDrawer && (
          <div className="w-full md:w-[25%] border-l flex flex-col shrink-0 h-full overflow-hidden relative"
            style={{ borderColor: 'rgba(251,191,36,0.08)', background: 'rgba(0, 0, 0, 0.60)' }}
          >
            {/* Right Hide button moved to center panel */}
            <div className="flex-grow flex flex-col min-h-0 divide-y divide-white/5">
              {/* Accordion 1: Town Directory */}
              <div className={`flex flex-col min-h-0 ${activeAccordion === 'directory' ? 'flex-grow' : 'shrink-0'}`}>
                <button
                  type="button"
                  onClick={() => { cozyAudio.playClick(); setActiveAccordion(activeAccordion === 'directory' ? null : 'directory'); }}
                  className="w-full px-4 py-3.5 flex items-center justify-between bg-black/40 hover:bg-black/60 text-left border-none cursor-pointer select-none transition-all duration-200"
                >
                  <span className="text-[12px] font-brand uppercase tracking-wider text-cyan-300" style={{ fontFamily: FONT }}>
                    👥 Town Directory
                  </span>
                  <span className="text-[10px] text-cyan-400">{activeAccordion === 'directory' ? '▼' : '▶'}</span>
                </button>
                {activeAccordion === 'directory' && (
                  <div className="flex-grow min-h-0 overflow-y-auto custom-scrollbar p-2 space-y-1 bg-black/20">
                    {TALK_CHARACTERS.map(c => {
                      const isSelected = c.id === selectedCharId;
                      const itemFriendship = getFriendship(c.id);
                      const lvl = itemFriendship.level;
                      const hearts = ['🤍', '💛', '🧡', '❤️', '💖'][Math.min(lvl - 1, 4)];
                      return (
                        <button
                          key={c.id}
                          type="button"
                          onClick={() => {
                            cozyAudio.playClick();
                            setSelectedCharId(c.id);
                            setInputText('');
                            setIsTyping(false);
                          }}
                          className={`w-full p-2.5 rounded-2xl flex items-center gap-3 border transition-all duration-200 ${
                            isSelected
                              ? 'border-amber-400/40 bg-amber-400/10 shadow-[0_0_12px_rgba(251,191,36,0.08)] scale-[1.02]'
                              : 'border-transparent bg-transparent hover:border-white/8 hover:bg-white/4'
                          }`}
                        >
                          <div className={`w-10 h-10 rounded-full overflow-hidden bg-black shrink-0 transition-all ${
                            isSelected ? 'ring-2 ring-amber-400/50 shadow-[0_0_12px_rgba(251,191,36,0.3)]' : 'ring-1 ring-white/10'
                          }`}>
                            <img
                              src={c.avatar}
                              alt={c.name}
                              className="w-full h-full object-contain"
                              onError={(e) => { (e.target as HTMLImageElement).src = '/Assets/Ganache Grove/Scene_0.1.png'; }}
                            />
                          </div>
                          <div className="min-w-0 text-left flex-grow">
                            <h4 className={`text-[15px] font-brand truncate leading-tight ${isSelected ? 'text-amber-300' : 'text-yellow-100/60'}`}>
                              {c.name}
                            </h4>
                            <span className="text-[15px] text-white/40 block truncate font-sans">{c.role}</span>
                          </div>
                          <span className="text-sm shrink-0 select-none" title={`Friendship Level ${lvl}`}>{hearts}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
 
              {/* Accordion 2: Cottage Bonds */}
              <div className={`flex flex-col min-h-0 ${activeAccordion === 'bonds' ? 'flex-grow' : 'shrink-0'}`}>
                <button
                  type="button"
                  onClick={() => { cozyAudio.playClick(); setActiveAccordion(activeAccordion === 'bonds' ? null : 'bonds'); }}
                  className="w-full px-4 py-3.5 flex items-center justify-between bg-black/40 hover:bg-black/60 text-left border-none cursor-pointer select-none transition-all duration-200"
                >
                  <span className="text-[12px] font-brand uppercase tracking-wider text-pink-300" style={{ fontFamily: FONT }}>
                    🏡 Cottage Bonds
                  </span>
                  <span className="text-[10px] text-pink-400">{activeAccordion === 'bonds' ? '▼' : '▶'}</span>
                </button>
                {activeAccordion === 'bonds' && (
                  <div className="flex-grow min-h-0 overflow-y-auto custom-scrollbar p-4 flex flex-col justify-center bg-black/20 text-center">
                    <div className="w-full">
                      <span className="text-[15px] font-black uppercase tracking-[0.1em] text-rose-400 block mb-1">Relationship Standing</span>
                      <div className="rounded-2xl p-3 relative overflow-hidden border border-rose-500/15 text-left font-sans"
                        style={{ background: 'linear-gradient(135deg, rgba(244,63,94,0.08) 0%, rgba(251,191,36,0.05) 100%)' }}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-[15px] text-rose-200/50 font-sans uppercase tracking-wider">Current Bond</span>
                            <div className="text-[15px] font-brand text-rose-300 mt-0.5">{levelNames[friendship.level] || 'Acquaintance 🏡'}</div>
                          </div>
                          <div className="text-3xl select-none">{'❤️'.repeat(Math.min(friendship.level, 3))}</div>
                        </div>
                        {/* XP progress bar */}
                        <div className="mt-2.5">
                          <div className="flex justify-between text-[15px] text-white/30 font-sans mb-1">
                            <span>Friendship XP</span>
                            <span>{friendship.xp} / 100</span>
                          </div>
                          <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                            <div className="h-full rounded-full transition-all duration-700"
                              style={{
                                width: `${Math.min(100, friendship.xp)}%`,
                                background: 'linear-gradient(90deg, #f43f5e, #fb7185)',
                                boxShadow: '0 0 10px rgba(244,63,94,0.5)'
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Accordion 3: Ganache Gazette */}
              <div className={`flex flex-col min-h-0 ${activeAccordion === 'gazette' ? 'flex-grow' : 'shrink-0'}`}>
                <button
                  type="button"
                  onClick={() => { cozyAudio.playClick(); setActiveAccordion(activeAccordion === 'gazette' ? null : 'gazette'); }}
                  className="w-full px-4 py-3.5 flex items-center justify-between bg-black/40 hover:bg-black/60 text-left border-none cursor-pointer select-none transition-all duration-200"
                >
                  <span className="text-[12px] font-brand uppercase tracking-wider text-amber-300" style={{ fontFamily: FONT }}>
                    📰 Ganache Gazette
                  </span>
                  <span className="text-[10px] text-amber-400">{activeAccordion === 'gazette' ? '▼' : '▶'}</span>
                </button>
                {activeAccordion === 'gazette' && (
                  <div className="flex-grow min-h-0 overflow-y-auto custom-scrollbar p-4 flex flex-col justify-center bg-black/20 text-center">
                    <div className="p-4 rounded-2xl bg-[#faf5e6] text-[#4c2d07] border border-[#cfb682] shadow-md relative overflow-hidden font-serif">
                      {/* Vintage Newspaper header */}
                      <div className="text-center border-b border-[#cfb682]/40 pb-2 mb-2">
                        <h4 className="text-[14px] tracking-[0.25em] font-brand uppercase text-[#6f420d] leading-none" style={{ fontFamily: FONT }}>THE GANACHE GAZETTE</h4>
                        <div className="flex justify-between items-center text-[10px] text-[#8c5e23] uppercase tracking-wider mt-1 px-1 font-sans font-bold">
                          <span>Vol. XII · No. 8</span>
                          <span>Daily Flash</span>
                        </div>
                      </div>

                      {/* News content with fade transition */}
                      <div className="min-h-[85px] flex flex-col justify-between py-1 transition-opacity duration-300">
                        <p className="text-[15px] leading-relaxed italic text-[#3f2505] font-serif font-semibold">
                          "{FLASH_NEWS_DATA[activeNewsIdx].news}"
                        </p>
                        <div className="mt-2.5 pt-2 border-t border-[#cfb682]/30 flex flex-col gap-1 font-sans">
                          <span className="text-[12px] font-brand uppercase tracking-wider text-[#8c5e23]" style={{ fontFamily: FONT }}>Recommended Action:</span>
                          <p className="text-[15px] font-semibold text-[#6f420d] leading-snug text-left">
                            🎯 {FLASH_NEWS_DATA[activeNewsIdx].recommendedActions[0]}
                          </p>
                        </div>
                      </div>

                      {/* Manual cycle controls */}
                      <div className="flex justify-between items-center mt-2.5 pt-2 border-t border-[#cfb682]/40 font-sans">
                        <span className="text-[13px] text-[#8c5e23] font-bold">
                          {activeNewsIdx + 1} / {FLASH_NEWS_DATA.length}
                        </span>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => setActiveNewsIdx((prev) => (prev === 0 ? FLASH_NEWS_DATA.length - 1 : prev - 1))}
                            className="px-2 py-0.5 rounded bg-[#ebdcb7] hover:bg-[#decfa7] active:scale-95 text-[#4c2d07] text-[13px] font-black transition-all cursor-pointer border-none"
                          >
                            ◀
                          </button>
                          <button
                            type="button"
                            onClick={() => setActiveNewsIdx((prev) => (prev + 1) % FLASH_NEWS_DATA.length)}
                            className="px-2 py-0.5 rounded bg-[#ebdcb7] hover:bg-[#decfa7] active:scale-95 text-[#4c2d07] text-[13px] font-black transition-all cursor-pointer border-none"
                          >
                            ▶
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Accordion 4: Gossip Exchange */}
              <div className={`flex flex-col min-h-0 ${activeAccordion === 'gossip' ? 'flex-grow' : 'shrink-0'}`}>
                <button
                  type="button"
                  onClick={() => { cozyAudio.playClick(); setActiveAccordion(activeAccordion === 'gossip' ? null : 'gossip'); }}
                  className="w-full px-4 py-3.5 flex items-center justify-between bg-black/40 hover:bg-black/60 text-left border-none cursor-pointer select-none transition-all duration-200"
                >
                  <span className="text-[12px] font-brand uppercase tracking-wider text-purple-300" style={{ fontFamily: FONT }}>
                    💬 Gossip Exchange
                  </span>
                  <span className="text-[10px] text-purple-400">{activeAccordion === 'gossip' ? '▼' : '▶'}</span>
                </button>
                {activeAccordion === 'gossip' && (
                  <div className="flex-grow min-h-0 overflow-y-auto custom-scrollbar p-4 flex flex-col justify-center bg-black/20 text-center">
                    <div className="w-full space-y-3">
                      <button
                        type="button"
                        disabled={!checkGossipAvailable()}
                        onClick={handleShareGossip}
                        className={`w-full py-2.5 rounded-xl text-[15px] font-black uppercase tracking-wider transition flex items-center justify-center gap-2 cursor-pointer ${
                          checkGossipAvailable()
                            ? 'hover:scale-102 active:scale-97 hover:brightness-110'
                            : 'opacity-40 cursor-not-allowed'
                        }`}
                        style={{
                          fontFamily: '"Josefin Sans", sans-serif',
                          background: checkGossipAvailable()
                            ? 'linear-gradient(135deg, #e11d48, #be185d)'
                            : 'rgba(50,30,30,0.6)',
                          border: checkGossipAvailable() ? 'none' : '1px solid rgba(100,50,50,0.4)',
                          boxShadow: checkGossipAvailable() ? '0 4px 16px rgba(225, 29, 72, 0.4)' : 'none'
                        }}
                      >
                        📣 Share Gossip (+10 Coins, +10 XP)
                      </button>
                      <p className="text-[15px] text-pink-200/50 font-sans italic">
                        Gossip refreshes every day — keep the rumours flowing! 🍃
                      </p>
                    </div>
                  </div>
                )}
              </div>
 
              {/* Accordion 5: Gift Exchange */}
              <div className={`flex flex-col min-h-0 ${activeAccordion === 'gifting' ? 'flex-grow' : 'shrink-0'}`}>
                <button
                  type="button"
                  onClick={() => { cozyAudio.playClick(); setActiveAccordion(activeAccordion === 'gifting' ? null : 'gifting'); }}
                  className="w-full px-4 py-3.5 flex items-center justify-between bg-black/40 hover:bg-black/60 text-left border-none cursor-pointer select-none transition-all duration-200"
                >
                  <span className="text-[12px] font-brand uppercase tracking-wider text-emerald-300" style={{ fontFamily: FONT }}>
                    🎁 Gift Exchange
                  </span>
                  <span className="text-[10px] text-emerald-400">{activeAccordion === 'gifting' ? '▼' : '▶'}</span>
                </button>
                {activeAccordion === 'gifting' && (
                  <div className="flex-grow min-h-0 overflow-y-auto custom-scrollbar p-4 space-y-4 bg-black/20">
                    {/* Liked / disliked gifts */}
                    <div className="space-y-2">
                      <span className="text-[15px] font-black uppercase tracking-wider text-emerald-400 block text-left">Preferences</span>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="rounded-xl p-2.5 bg-emerald-500/5 border border-emerald-500/15 text-left font-sans">
                          <span className="text-[15px] font-black uppercase tracking-wider text-emerald-400 block mb-0.5">💚 Loved (+20)</span>
                          <span className="text-[15px] text-emerald-300 font-sans font-semibold leading-tight block">
                            {currentChar.lovedItems.map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' · ')}
                          </span>
                        </div>
                        <div className="rounded-xl p-2.5 bg-rose-500/5 border border-rose-500/15 text-left font-sans">
                          <span className="text-[15px] font-black uppercase tracking-wider text-rose-400 block mb-0.5">💔 Disliked (+2)</span>
                          <span className="text-[15px] text-rose-350 font-sans font-semibold leading-tight block">
                            {currentChar.dislikedItems.map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' · ')}
                          </span>
                        </div>
                      </div>
                    </div>
 
                    {/* Gift backpack inventory grid */}
                    <div className="space-y-2">
                      <span className="text-[15px] font-black uppercase tracking-wider text-yellow-400 block text-left">Backpack Inventory</span>
                      <div className="grid grid-cols-2 gap-1.5 font-sans">
                        {[
                          { key: 'wood', label: '🪵 Timber', count: inventory.wood || 0 },
                          { key: 'bolts', label: '🔩 Bolts', count: inventory.bolts || 0 },
                          { key: 'moss', label: '🌿 Moss', count: inventory.moss || 0 },
                          { key: 'mucus', label: '🧪 Mucus', count: inventory.mucus || 0 },
                          { key: 'parchment', label: '📄 Vellum', count: inventory.parchment || 0 },
                          { key: 'ink', label: '✒️ Ink', count: inventory.ink || 0 },
                        ].map(item => {
                          const hasStock = item.count > 0;
                          const isLoved = currentChar.lovedItems.includes(item.key);
                          return (
                            <button
                              key={item.key}
                              disabled={!hasStock}
                              onClick={() => handleGiftItem(item.key)}
                              className={`p-2 rounded-xl flex flex-col justify-between transition-all text-left ${
                                hasStock ? 'hover:scale-[1.03] active:scale-95 cursor-pointer' : 'cursor-not-allowed opacity-35'
                              }`}
                              style={{
                                background: hasStock
                                  ? isLoved
                                    ? 'linear-gradient(135deg, rgba(16,185,129,0.14) 0%, rgba(5,150,105,0.08) 100%)'
                                    : 'rgba(255,255,255,0.06)'
                                  : 'rgba(255,255,255,0.02)',
                                border: hasStock
                                  ? isLoved
                                    ? '1px solid rgba(16,185,129,0.3)'
                                    : '1px solid rgba(255,255,255,0.1)'
                                    : '1px solid rgba(255,255,255,0.04)',
                                minHeight: '52px'
                              }}
                            >
                              <span className="text-[15px] font-bold text-white/90 block">{item.label}</span>
                              <div className="flex items-center justify-between mt-1">
                                <span className={`text-[15px] font-mono font-bold ${
                                  hasStock ? (isLoved ? 'text-emerald-400' : 'text-amber-400') : 'text-white/20'
                                }`}>×{item.count}</span>
                                {isLoved && hasStock && <span className="text-[15px] text-emerald-400 font-bold">★ Loved</span>}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
 
            {/* Footer tip */}
            <div className="px-4 py-2.5 border-t shrink-0 text-center" style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
              <p className="text-[15px] text-white/20 font-sans italic leading-snug">
                🎁 Gifting loved items builds bonds faster!<br />Level 5 = Town Soulmate status ✨
              </p>
            </div>
          </div>
        )}
      </div>
      )}

      {showPenaltyCard && (
        <div className="absolute inset-0 bg-black/85 z-[500] flex items-center justify-center p-6 animate-fade-in">
          <div className="bg-neutral-900 border-2 border-rose-500/40 rounded-3xl p-8 max-w-md w-full text-center space-y-4 shadow-2xl relative text-white">
            <div className="w-16 h-16 rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-4xl mx-auto select-none animate-bounce">
              ⚠️
            </div>
            <div>
              <span className="text-[11px] font-black uppercase tracking-[0.25em] text-rose-400 block font-sans">Politeness Infraction</span>
              <h2 className="text-2xl font-brand text-rose-500 uppercase mt-1" style={{ fontFamily: FONT }}>
                Rude Conduct Fine!
              </h2>
            </div>
            <p className="text-sm text-neutral-300 leading-relaxed font-sans text-center">
              {penaltyMessage || "A town marshal has issued a fine for rude or inappropriate conduct. Please treat all residents with respect."}
            </p>
            <div className="p-4 bg-rose-950/20 border border-rose-500/25 rounded-2xl font-sans">
              <span className="text-[11px] font-black text-neutral-400 uppercase tracking-widest block">Penalty Deducted</span>
              <span className="text-xl font-brand text-rose-400 block mt-1" style={{ fontFamily: FONT }}>
                -50 Cocoa Coins 🪙
              </span>
            </div>
            <div className="text-[10px] text-neutral-500 italic font-sans animate-pulse text-center">
              Closing chat window in a moment...
            </div>
          </div>
        </div>
      )}
    </div>
  );
};