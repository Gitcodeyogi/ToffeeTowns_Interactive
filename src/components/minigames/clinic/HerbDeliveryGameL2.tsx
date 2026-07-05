// HerbDeliveryGameL2.tsx
// ─────────────────────────────────────────────────────────────────────────────
// LEVEL 2: Advanced Apothecary Clinic — Urgent Care Mode
// Harder than Level 1 with: urgent doctor calls, rotating diseases,
// drain mechanic, 25 cards (5 extra decoys), 2 lives, MIN_SCORE=200,
// 5 patients per disease
// ─────────────────────────────────────────────────────────────────────────────
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { cozyAudio } from '../../../utils/audioHelper';

const KF_ID = 'hdg-l2-kf';
if (!document.getElementById(KF_ID)) {
  const s = document.createElement('style');
  s.id = KF_ID;
  s.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Fredoka+One&family=Nunito:wght@700;900&display=swap');
    .hdg2-fredoka { font-family: 'Fredoka One', cursive !important; }
    .hdg2-nunito  { font-family: 'Nunito', sans-serif !important; }
    @keyframes hdg2CardIn    { from{opacity:0;transform:scale(.85) translateY(18px)} to{opacity:1;transform:scale(1) translateY(0)} }
    @keyframes hdg2Float     { 0%,100%{transform:translateY(0) rotate(-.5deg)} 50%{transform:translateY(-7px) rotate(.5deg)} }
    @keyframes hdg2Shake     { 0%,100%{transform:translateX(0)} 18%{transform:translateX(-14px) rotate(-3deg)} 36%{transform:translateX(14px) rotate(3deg)} 54%{transform:translateX(-9px)} 72%{transform:translateX(9px)} }
    @keyframes hdg2Boom      { 0%{transform:scale(1)} 30%{transform:scale(1.28)} 65%{transform:scale(.93)} 100%{transform:scale(1)} }
    @keyframes hdg2StarPop   { 0%{opacity:1;transform:translate(-50%,-50%) scale(0) rotate(-20deg)} 55%{opacity:1;transform:translate(-50%,-50%) scale(1.4) rotate(10deg)} 100%{opacity:0;transform:translate(-50%,-50%) scale(1) rotate(0)} }
    @keyframes hdg2WrongFlash{ 0%,100%{background:transparent} 30%,70%{background:rgba(220,38,38,.18)} }
    @keyframes hdg2UrgentPulse { 0%,100% { box-shadow: 0 0 0 2px rgba(239,68,68,.4), 0 0 12px rgba(239,68,68,.3); } 50% { box-shadow: 0 0 0 6px rgba(239,68,68,.8), 0 0 28px rgba(239,68,68,.6); } }
    @keyframes hdg2DrainFlash { 0%,100%{border-color:rgba(239,68,68,.4)} 50%{border-color:rgba(239,68,68,.9)} }
    @keyframes hdg2FlyUp      { 0%{opacity:1;transform:translateY(0) scale(1)} 100%{opacity:0;transform:translateY(-55px) scale(1.4)} }
    @keyframes hdg2Fly1 { 0%{transform:translate(0,0) scale(1) rotate(0deg);opacity:1} 100%{transform:translate(-280px,180px) scale(.04) rotate(-35deg);opacity:0} }
    @keyframes hdg2Fly2 { 0%{transform:translate(0,0) scale(1) rotate(0deg);opacity:1} 100%{transform:translate(-140px,180px) scale(.04) rotate(-15deg);opacity:0} }
    @keyframes hdg2Fly3 { 0%{transform:translate(0,0) scale(1) rotate(0deg);opacity:1} 100%{transform:translate(0px,180px) scale(.04) rotate(0deg);opacity:0} }
    @keyframes hdg2Fly4 { 0%{transform:translate(0,0) scale(1) rotate(0deg);opacity:1} 100%{transform:translate(140px,180px) scale(.04) rotate(15deg);opacity:0} }
    @keyframes hdg2Fly5 { 0%{transform:translate(0,0) scale(1) rotate(0deg);opacity:1} 100%{transform:translate(280px,180px) scale(.04) rotate(35deg);opacity:0} }
    @keyframes hdg2Sparkle { 0%,100%{opacity:.25;transform:scale(.8)} 50%{opacity:1;transform:scale(1.2)} }
  `;
  document.head.appendChild(s);
}

interface Herb2 {
  id: number;
  name: string;
  emoji: string;
  tagline: string;
  description: string;
  clue: string;
  property: string;
  category: 'fever' | 'cough' | 'stress' | 'stomach' | 'headache' | 'decoy';
  gradA: string;
  gradB: string;
  glowRgb: string;
  isPrankClue?: boolean;
  isDecoy?: boolean;
}

const MIN_SCORE_L2 = 200;
const LIVES_L2 = 2;

const SECONDARY_MAP: Record<number, { key: string; msg: string }> = {
  1: { key: 'headache', msg: 'PRIORITY ERROR! Velvet Peppermint is for Fever, not Headaches!' },
  2: { key: 'stomach',  msg: 'PRIORITY ERROR! Frostfire Petal is for Fever, not Stomach!' },
  5: { key: 'stress',   msg: 'PRIORITY ERROR! Glowspore Mushroom is for Cough, not Stress!' },
  6: { key: 'headache', msg: 'PRIORITY ERROR! Silver Pine-Needles are for Cough, not Headaches!' },
  7: { key: 'headache', msg: 'PRIORITY ERROR! Eucalyptus Leaf is for Cough, not Headaches!' },
  8: { key: 'stomach',  msg: 'PRIORITY ERROR! Honey-Sap Bark is for Cough, not Stomach!' },
  9: { key: 'headache', msg: 'PRIORITY ERROR! Sugar Lily is for Stress, not Headaches!' },
  10: { key: 'stomach', msg: 'PRIORITY ERROR! Cozy Lavender is for Stress, not Stomach!' },
  12: { key: 'cough',   msg: 'PRIORITY ERROR! Dreamweave Orchid is for Stress, not Cough!' },
};

const HERBS_L2: Herb2[] = [
  // FEVER (4)
  { id:1,  name:'Velvet Peppermint', emoji:'🌿', tagline:'Scorches fevers with icy breath!',     description:'Harvested during the first morning snow, its velvety leaves carry a freezing ether that subdues burning blood.', clue:'Primary remedy for high temperatures — cooling and anti-pyretic in nature.', property:'Cooling • Anti-pyretic', category:'fever', gradA:'#052e16', gradB:'#15803d', glowRgb:'34,197,94' },
  { id:2,  name:'Frostfire Petal',   emoji:'❄️', tagline:'Cold to the touch, hot to the blood!', description:'A rare winter orchid glowing with pale blue flame. It draws heat from its surroundings instantly.', clue:'A cool orchid — perfect for settling stomach cramps, not fevers.', property:'Cooling • Anti-inflammatory', category:'fever', gradA:'#083344', gradB:'#0284c7', glowRgb:'14,165,233', isPrankClue:true },
  { id:3,  name:'Bitter Feverbark',  emoji:'🪵', tagline:'Ancient redwood for hot foreheads!',   description:'Stripped from ancient redwood branches, this bark breaks fevers through rapid sweat promotion.', clue:'A bitter bark designed specifically to break high fevers.', property:'Cooling • Febrifuge', category:'fever', gradA:'#451a03', gradB:'#9a3412', glowRgb:'249,115,22' },
  { id:4,  name:'Sun-Droplet Flower',emoji:'🌻', tagline:'Sweat out the heat under the sun!',    description:'Absorbs solar heat. When crushed, induces heavy perspiration, expelling grove-fever.', clue:'Yellow petals that induce sweating to break grove-fever.', property:'Diaphoretic • Calming', category:'fever', gradA:'#7c2d12', gradB:'#ea580c', glowRgb:'234,88,12' },
  // COUGH (4)
  { id:5,  name:'Glowspore Mushroom',emoji:'🍄', tagline:'Opens chest airways like forest breeze!', description:'Luminescent green mushroom that expels bronchial fluid and clears airways.', clue:'Green caps that cure severe tension headaches instantly.', property:'Expectorant • Lung Tonic', category:'cough', gradA:'#022c22', gradB:'#059669', glowRgb:'5,150,105', isPrankClue:true },
  { id:6,  name:'Silver Pine-Needles',emoji:'🌲', tagline:'Breathe free — clears bronchial mist!',description:'Sharp silver needles that relieve dry tickly coughs and soothe throat tissue.', clue:'Relieves dry, tickly coughing fits and throat spasms.', property:'Bronchial • Decongestant', category:'cough', gradA:'#052e1a', gradB:'#16a34a', glowRgb:'22,163,74' },
  { id:7,  name:'Eucalyptus Leaf',   emoji:'🍃', tagline:'Champion of tickly throats!',           description:'Oil-rich leaf with medicinal scent. Vapors penetrate deep into the lungs.', clue:'Inhalant leaf for chest and lung decongestion.', property:'Antiseptic • Expectorant', category:'cough', gradA:'#042f2e', gradB:'#0d9488', glowRgb:'20,184,166' },
  { id:8,  name:'Honey-Sap Bark',    emoji:'🍯', tagline:'Coats dry, painful throat linings!',    description:'Thick bark from sweet-drip maple trees that coats raw throat linings to stop hacking coughs.', clue:'Coats raw throat linings and stops hacking coughs.', property:'Demulcent • Antitussive', category:'cough', gradA:'#3b1f00', gradB:'#b45309', glowRgb:'217,119,6' },
  // STRESS (4)
  { id:9,  name:'Sugar Lily Petal',  emoji:'🌸', tagline:'Pink calm for anxious hearts!',         description:'A delicate pink petal that slows a racing heartbeat and calms panic.', clue:'Eases a racing pulse and calms anxious thoughts.', property:'Anxiolytic • Nervine', category:'stress', gradA:'#4a044e', gradB:'#a21caf', glowRgb:'192,38,211' },
  { id:10, name:'Cozy Lavender',     emoji:'🪻', tagline:'Breathe it in — stress floats away!',  description:'Classic purple herb that calms frazzled nerves and prepares the mind for deep sleep.', clue:'Purple sprig that reduces body heat and breaks high fevers.', property:'Relaxant • Aromatherapy', category:'stress', gradA:'#2e1065', gradB:'#7c3aed', glowRgb:'124,58,237', isPrankClue:true },
  { id:11, name:'Worry-Root Stem',   emoji:'🪵', tagline:'Dry wood, feels like peace!',           description:'Slow-growing root with calming adaptogens that relax tight muscles.', clue:'Anxiety reducer that brings peace to a worried mind.', property:'Anxiolytic • Sedative', category:'stress', gradA:'#2d063d', gradB:'#701a75', glowRgb:'217,70,239' },
  { id:12, name:'Dreamweave Orchid', emoji:'🌹', tagline:'A fragrant bloom that melts stress!',  description:'Rare rose-colored bloom that releases calming vapor at dusk.', clue:'Dissolves stressful thoughts and prepares for deep rest.', property:'Relaxant • Sleep Aid', category:'stress', gradA:'#311042', gradB:'#86198f', glowRgb:'217,70,239' },
  // STOMACH (4)
  { id:13, name:'Ginger Snap Root',  emoji:'🫚', tagline:'Warm root stops cramps and nausea!',   description:'A warm, knobby root that stops cramps, nausea, and indigestion.', clue:'Warming root that stops nausea and stomach cramps.', property:'Carminative • Anti-emetic', category:'stomach', gradA:'#3f2f08', gradB:'#a16207', glowRgb:'234,179,8' },
  { id:14, name:'Peppermint Sprig',  emoji:'🌱', tagline:'Cooling leaf relieves indigestion!',   description:'Refreshing sweet sprig that cools gas, bloating, and colicky stomach pain.', clue:'Knobby root to relieve dry, tickly coughing fits.', property:'Spasmolytic • Digestion', category:'stomach', gradA:'#064e3b', gradB:'#047857', glowRgb:'16,185,129', isPrankClue:true },
  { id:15, name:'Fennel Goldseeds',  emoji:'🌾', tagline:'Sweet seeds that relax gut walls!',    description:'Tiny licorice-flavored seeds that relax gut muscles and expel painful gas.', clue:'Cures indigestion and relaxes spasming gut walls.', property:'Carminative • Gut Reliever', category:'stomach', gradA:'#292524', gradB:'#78716c', glowRgb:'168,162,158' },
  { id:16, name:'Sweet Chamomile',   emoji:'🌼', tagline:'Calms stomach linings!',               description:'Gentle yellow flower that reduces stomach inflammation and eases colic.', clue:'Cures stomach aches and eases colic.', property:'Anti-spasmodic • Soothing', category:'stomach', gradA:'#1e3a1e', gradB:'#2e7d32', glowRgb:'76,175,80' },
  // HEADACHE (4)
  { id:17, name:'Feverfew Blossom',  emoji:'💮', tagline:'Stops throbbing migraines!',           description:'White daisy-like blossom that constricts brain blood vessels to relieve migraines.', clue:'Cures throbbing migraines and tension behind the eyes.', property:'Analgesic • Migraine Relief', category:'headache', gradA:'#1e1b4b', gradB:'#4338ca', glowRgb:'79,70,229' },
  { id:18, name:'Willow Bark Shavings',emoji:'🪵',tagline:'Natural aspirin for head pressure!',  description:'Shavings containing natural salicin, a powerful painkiller for headaches.', clue:'Daisies that settle standard stomach gas and diner cramps.', property:'Analgesic • Pain Relief', category:'headache', gradA:'#18181b', gradB:'#52525b', glowRgb:'113,113,122', isPrankClue:true },
  { id:19, name:'Peppermint Oilbud', emoji:'🍃', tagline:'Refreshes temples, stops pain!',       description:'Concentrated bud with pure menthol. Creates cooling sensation that stops headaches.', clue:'Creates a cooling sensation that stops temple headaches.', property:'Vasodilator • Head Cooler', category:'headache', gradA:'#022d3c', gradB:'#0284c7', glowRgb:'14,165,233' },
  { id:20, name:'Skullcap Weed',     emoji:'🌿', tagline:'Relieves neurological pain!',          description:'Woodland weed that relaxes cranial nerves and reduces head blood pressure.', clue:'Relieves neurological headaches and throbbing temple pressure.', property:'Sedative • Headache Ease', category:'headache', gradA:'#170f3c', gradB:'#4d1e8c', glowRgb:'109,40,217' },
  // DECOYS (10 — non-herb items to confuse the player)
  { id:21, name:'Sourdough Bread',   emoji:'🍞', tagline:'Flaky baker loaf — comfort food!', description:'A golden crust sourdough bread baked by Rowen. Smells amazing and tastes delicious. Every villager knows a warm piece of toast settles the stomach and restores strength. It is the absolute best option for standard indigestion!', clue:'A warm slice of buttered toast to settle diner stomach aches.', property:'Food • Bakery Wastage', category:'decoy', gradA:'#2d1f10', gradB:'#78350f', glowRgb:'217,119,6', isDecoy:true },
  { id:22, name:'Warm Cafe Roast',   emoji:'☕', tagline:'Steaming brew to clear head fog!', description:'Freshly roasted and ground coffee beans, brewed hot. The rich aroma instantly clears neurological head pressure and sharpens the senses. Perfect for severe throbbing temple migraines!', clue:'Steaming coffee to wake up the mind and relieve deep head pressure.', property:'Drink • Cafe Wastage', category:'decoy', gradA:'#27272a', gradB:'#52525b', glowRgb:'161,161,170', isDecoy:true },
  { id:23, name:"Gram's Noodle Soup", emoji:'🥣', tagline:'Secret recipe for chest warmth!', description:'A hot bowl of simmered garden broth, thin egg noodles, and wild carrots. Slipped down the throat, it coats the esophagus, warms the chest, and clears tickly bronchial cough fits instantly!', clue:'Warm noodle broth to soothe throat tickles and hacking coughs.', property:'Food • Home Remedy', category:'decoy', gradA:'#3f2f08', gradB:'#a16207', glowRgb:'234,179,8', isDecoy:true },
  { id:24, name:'Hot Honey Lemon',   emoji:'🍋', tagline:'Traditional citrus sweat tonic!', description:'A steaming mug of squeezed lemons mixed with sweet clover honey. Induces a natural, gentle sweat to cool down high burning temperatures and flush out grove-fever.', clue:'Lemon and honey water to sweat out burning body temperatures.', property:'Drink • Citrus Tonic', category:'decoy', gradA:'#450a0a', gradB:'#991b1b', glowRgb:'220,38,38', isDecoy:true },
  { id:25, name:'Chamomile Sleep Milk', emoji:'🥛', tagline:'Soothing bedtime heart calmer!', description:'Creamy whole milk simmered with fresh chamomile blossoms. The absolute peak village remedy to calm panic, ease anxious thoughts, and slow a racing pulse before deep sleep.', clue:'Simmered hot milk to melt stress and ease racing heartbeats.', property:'Drink • Dairy Soother', category:'decoy', gradA:'#1e1b4b', gradB:'#4338ca', glowRgb:'99,102,241', isDecoy:true },
  { id:26, name:'Fresh Fruit Salad', emoji:'🥗', tagline:'Vibrant orchard health booster!', description:'Diced apples, sweet grapes, and fresh berries tossed together. Packed with grove vitamins to instantly refresh the body, cool down fevers, and ease temple headaches.', clue:'Orchard fruits to boost health and relieve throbbing migraines.', property:'Food • Orchard Salad', category:'decoy', gradA:'#4d0727', gradB:'#9d174d', glowRgb:'236,72,153', isDecoy:true },
  { id:27, name:'Sparkling Energy Soda', emoji:'🥤', tagline:'Town sports drink — refreshing boost!', description:'A sparkling fizzy sports drink from the town tavern. Excellent for quick stamina, and is widely recommended to settle burning fevers and relieve digestion issues.', clue:'Energy soda boosts stamina and refreshes tired systems.', property:'Drink • Tavern Soda', category:'decoy', gradA:'#083344', gradB:'#0284c7', glowRgb:'14,165,233', isDecoy:true },
  { id:28, name:'Salted Cracker Stack', emoji:'🍪', tagline:'Dry crackers to settle nausea!', description:'A stack of salted soda crackers. High in sodium and starch, healers recommend them to absorb gut acids, curb nausea, and stop sudden stomach cramps.', clue:'Salted crackers to settle stomach acids and diner nausea.', property:'Food • Bakery Snack', category:'decoy', gradA:'#3b1f00', gradB:'#b45309', glowRgb:'217,119,6', isDecoy:true },
  { id:29, name:'Warm Peppermint Tea', emoji:'🍵', tagline:'Minty infusion for chest tickles!', description:'A hot herbal tea brewed from crushed peppermint leaves. The vapor clears stuffed sinuses and opens airways, making it a beloved remedy to soothe tickly coughing fits.', clue:'Minty infusion to clear airways and soothe coughing fits.', property:'Drink • Tea Infusion', category:'decoy', gradA:'#022c22', gradB:'#059669', glowRgb:'5,150,105', isDecoy:true },
  { id:30, name:'Ginger Diner Ale',   emoji:'🍺', tagline:'Fizzy ginger drink for digestion!', description:'Village-brewed ginger carbonated soda. Packed with spicy ginger spice extract, it is the diner\'s favorite way to ease gut bloating and settle raw stomach cramps.', clue:'Spicy carbonated soda to soothe stomach cramps.', property:'Drink • Diner Beverage', category:'decoy', gradA:'#1e3a1e', gradB:'#2e7d32', glowRgb:'76,175,80', isDecoy:true },
];

const CAULDRONS_L2 = [
  { key:'fever'    as const, label:'Fever Cauldron',  sublabel:'For high temp & burning', icon:'🏺', gradA:'#3b0a0a', gradB:'#7f1d1d', glowRgb:'239,68,68',  tag:'#fca5a5', smoke:['🔥','🌡️'] },
  { key:'cough'    as const, label:'Cough Flask',     sublabel:'For lung & throat issues', icon:'🧪', gradA:'#042f2e', gradB:'#134e4a', glowRgb:'20,184,166', tag:'#5eead4', smoke:['🍃','🌬️'] },
  { key:'stress'   as const, label:'Stress Burner',   sublabel:'For anxiety & nerves',     icon:'🔮', gradA:'#2e1065', gradB:'#4c1d95', glowRgb:'139,92,246', tag:'#c4b5fd', smoke:['🌸','✨'] },
  { key:'stomach'  as const, label:'Stomach Infuser', sublabel:'For cramps & indigestion', icon:'🍵', gradA:'#064e3b', gradB:'#0f766e', glowRgb:'34,197,94',  tag:'#86efac', smoke:['🌱','🌿'] },
  { key:'headache' as const, label:'Headache Bowl',   sublabel:'For migraines & tension', icon:'🥣', gradA:'#1e3a8a', gradB:'#1d4ed8', glowRgb:'59,130,246', tag:'#93c5fd', smoke:['🌀','⚡'] },
];

interface HerbDeliveryGameL2Props {
  onWin:                (finalScore?: number, finalCured?: number) => void;
  onFail:               (finalScore?: number, finalCured?: number) => void;
  onScoreChange:        (n: number) => void;
  addLog:               (m: string) => void;
  onCurrentHerbChange?: (herbName: string) => void;
}

/* ─── Hdg2ResultBanner — win (green) or fail (red), 5-second countdown ─── */
function Hdg2ResultBanner({
  win, title, score
}: {
  win: boolean;
  title: string;
  score: number;
}) {
  const [left, setLeft] = useState(5);
  useEffect(() => {
    if (left <= 0) return;
    const id = setInterval(() => setLeft(n => Math.max(0, n - 1)), 1000);
    return () => clearInterval(id);
  }, [left]);

  const g = win
    ? { bg:'radial-gradient(circle at 50% 50%, rgba(10, 46, 26, 0.95) 0%, rgba(4, 26, 14, 0.98) 70%, rgba(2, 13, 7, 0.99) 100%)', textCol:'#34d399', badgeB:'rgba(52,211,153,.18)', badgeBorder:'rgba(52,211,153,.5)', badgeShadow:'0 0 28px rgba(52,211,153,.35)', msgColor:'text-emerald-300', icon:'🏆' }
    : { bg:'radial-gradient(circle at 50% 50%, rgba(42, 10, 10, 0.95) 0%, rgba(26, 4, 4, 0.98) 70%, rgba(7, 2, 2, 0.99) 100%)', textCol:'#f87171', badgeB:'rgba(239,68,68,.18)', badgeBorder:'rgba(239,68,68,.5)', badgeShadow:'0 0 28px rgba(239,68,68,.3)', msgColor:'text-red-300', icon:'💔' };

  return (
    <div className="absolute inset-0 z-50 flex flex-col items-center justify-center overflow-hidden"
      style={{ background:g.bg, borderRadius:'inherit' }}
    >
      <div className="relative z-10 flex flex-col items-center px-6 py-4 gap-3 w-full text-center">
        <span style={{ fontSize:'4rem', filter:`drop-shadow(0 0 20px ${g.textCol})` }}>{g.icon}</span>

        <div className="px-6 py-2.5 rounded-2xl"
          style={{ background:g.badgeB, border:`1.5px solid ${g.badgeBorder}`, boxShadow:g.badgeShadow }}
        >
          <p className="hdg2-fredoka text-xl uppercase tracking-wider leading-none text-white"
            style={{ textShadow:`0 0 12px ${g.textCol}` }}
          >{title}</p>
        </div>

        {/* Detailed context text explaining the player's junior healer role */}
        <p className="hdg2-nunito text-[12.5px] text-white/90 max-w-md leading-relaxed"
          style={{ textShadow: '0 1px 3px rgba(0,0,0,0.5)' }}
        >
          {win 
            ? "Excellent assistance! Your precise sorting of these medicinal herbs successfully helped Dr. Cedric cure the patients and keep the village safe from the spreading outbreaks."
            : "Shift support failed! You were unable to sort the necessary herbs. Dr. Cedric had to intervene to manage the outbreaks. Study the recipes and try another shift!"
          }
        </p>

        <p className="hdg2-luckiest text-4xl text-yellow-300 leading-none mt-1"
          style={{ textShadow:'0 0 14px rgba(250,204,21,.7)' }}
        >{win ? '+' : ''}{score} PTS</p>

        <div className="w-full max-w-[240px] mt-2">
          <div className="flex justify-between items-center mb-1">
            <span className="hdg2-nunito text-[9px] font-black uppercase tracking-widest text-white/60">Moving to results in…</span>
            <span className="hdg2-fredoka text-sm text-white">{left}s</span>
          </div>
          <div className="h-2 rounded-full overflow-hidden bg-white/10">
            <div className="h-full bg-yellow-400 transition-all duration-1000 ease-linear"
              style={{ width:`${(left / 5) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export function HerbDeliveryGameL2({ onWin, onFail, onScoreChange, addLog, onCurrentHerbChange }: HerbDeliveryGameL2Props) {
  const [deck,          setDeck         ] = useState<Herb2[]>([]);
  const [queueIdx,      setQueueIdx     ] = useState(0);
  const [score,         setScore        ] = useState(0);
  const [lives,         setLives        ] = useState(LIVES_L2);
  const [sorted,        setSorted       ] = useState(0);
  const [done,          setDone         ] = useState(false);
  const [failed,        setFailed       ] = useState(false);
  const [locked,        setLocked       ] = useState(false);
  const [shake,         setShake        ] = useState(false);
  const [wrongFl,       setWrongFl      ] = useState(false);
  const [boom,          setBoom         ] = useState('');
  const [starOn,        setStarOn       ] = useState('');
  const [flyKey,        setFlyKey       ] = useState<'1'|'2'|'3'|'4'|'5'|''>('');
  const [flyUpKey,      setFlyUpKey     ] = useState('');
  const [dropFeedback,  setDropFeedback ] = useState<{ status: 'perfect' | 'wrong' | 'redundant' | 'decoy'; text: string } | null>(null);

  const [delivered, setDelivered] = useState<Record<string, number[]>>({
    fever: [], cough: [], stress: [], stomach: [], headache: [],
  });
  const [patientCounts, setPatientCounts] = useState<Record<string, number>>({
    fever: 5, cough: 5, stress: 5, stomach: 5, headache: 5,
  });
  const patientCountsRef = useRef(patientCounts);
  patientCountsRef.current = patientCounts;
  const [curedCount,    setCuredCount   ] = useState(0);
  const [minScoreMet,   setMinScoreMet  ] = useState(false);

  // LEVEL 2: urgent disease tracking
  const [urgentDisease, setUrgentDisease] = useState<string | null>(null);
  const [urgentTimer,   setUrgentTimer  ] = useState(0);
  const [drainWarnings, setDrainWarnings] = useState<Record<string, boolean>>({});

  const pid = useRef(0);
  const cauldronRefs = useRef<any>({});

  /* ── Init ── */
  useEffect(() => {
    // Separate herbs and decoys
    const cleanHerbs = HERBS_L2.filter(h => !h.isDecoy);
    const cleanDecoys = HERBS_L2.filter(h => h.isDecoy);

    // Shuffle both lists
    const shHerbs = [...cleanHerbs].sort(() => Math.random() - 0.5);
    const shDecoys = [...cleanDecoys].sort(() => Math.random() - 0.5);

    // Mix: 2 herbs, 1 decoy, 2 herbs, 1 decoy...
    const mixedDeck: Herb2[] = [];
    let herbPtr = 0;
    let decoyPtr = 0;

    while (herbPtr < shHerbs.length || decoyPtr < shDecoys.length) {
      if (herbPtr < shHerbs.length) {
        mixedDeck.push(shHerbs[herbPtr++]);
      }
      if (herbPtr < shHerbs.length) {
        mixedDeck.push(shHerbs[herbPtr++]);
      }
      if (decoyPtr < shDecoys.length) {
        mixedDeck.push(shDecoys[decoyPtr++]);
      }
    }

    setDeck(mixedDeck);
    addLog('⚡ LEVEL 2 ACTIVATED — Urgent Care Mode! 30-card mixed deck: every 3rd card is a decoy! 2 lives only!');
    addLog(`🎯 Min score: ${MIN_SCORE_L2}. Cure at least 3 diseases. watch for home remedies!`);
    addLog('🚨 Doctor will issue URGENT calls every 45 seconds — prioritize them!');
  }, []);

  /* ── LEVEL 2: 60-second patient count increase ── */
  useEffect(() => {
    if (done || failed) return;
    const interval = setInterval(() => {
      let increasedCount = 0;
      setPatientCounts(prev => {
        const next = { ...prev };
        Object.keys(next).forEach(d => {
          if (next[d] > 0) {
            const addAmt = Math.floor(Math.random() * 3) + 1; // 1, 2, or 3
            next[d] = next[d] + addAmt;
            increasedCount++;
          }
        });
        return next;
      });

      if (increasedCount > 0) {
        addLog('⚠️ TIME WARNING: Outbreak spreading! Uncured patient counts increased by 1-3.');
      }
    }, 60000);
    return () => clearInterval(interval);
  }, [done, failed, addLog]);

  /* ── Notify parent of current herb ── */
  useEffect(() => {
    if (deck.length > 0 && deck[queueIdx]) {
      onCurrentHerbChange?.(deck[queueIdx].name);
    }
  }, [queueIdx, deck, onCurrentHerbChange]);

  /* ── LEVEL 2: Urgent disease timer ── */
  useEffect(() => {
    if (done || failed) return;
    const interval = setInterval(() => {
      const diseases = ['fever', 'cough', 'stress', 'stomach', 'headache'];
      const incomplete = diseases.filter(d => (delivered[d] || []).length < 2);
      if (incomplete.length === 0) return;
      const pick = incomplete[Math.floor(Math.random() * incomplete.length)];
      setUrgentDisease(pick);
      setUrgentTimer(30);
      addLog(`🚨 DOCTOR CALL: URGENT — Prioritize the ${pick.toUpperCase()} cauldron now! +50 bonus if done in 30s.`);
    }, 45000);
    return () => clearInterval(interval);
  }, [done, failed, delivered]);

  /* ── Urgent countdown ── */
  useEffect(() => {
    if (!urgentDisease || urgentTimer <= 0) return;
    const t = setTimeout(() => setUrgentTimer(u => Math.max(0, u - 1)), 1000);
    return () => clearTimeout(t);
  }, [urgentTimer, urgentDisease]);

  /* ── LEVEL 2: Drain mechanic — after 90s, incomplete cauldrons lose a herb ── */
  useEffect(() => {
    if (done || failed) return;
    const drain = setInterval(() => {
      const diseases = ['fever', 'cough', 'stress', 'stomach', 'headache'];
      diseases.forEach(d => {
        const count = (delivered[d] || []).length;
        if (count > 0 && count < 2) {
          addLog(`⏳ DRAIN: ${d.toUpperCase()} cauldron lost a herb due to delay!`);
          setDelivered(prev => ({ ...prev, [d]: prev[d].slice(0, -1) }));
          setPatientCounts(pc => ({ ...pc, [d]: Math.min(5, (pc[d] || 5) + 1) }));
          setDrainWarnings(dw => ({ ...dw, [d]: true }));
          setTimeout(() => setDrainWarnings(dw => ({ ...dw, [d]: false })), 3000);
        }
      });
    }, 90000);
    return () => clearInterval(drain);
  }, [done, failed, delivered]);

  /* ── handleDrop ── */
  const handleDrop = useCallback((targetKey: 'fever'|'cough'|'stress'|'stomach'|'headache') => {
    if (locked || done || failed || !deck.length) return;
    const herb = deck[queueIdx];
    if (!herb) return;

    const ci = CAULDRONS_L2.findIndex(c => c.key === targetKey);
    const flyDir = (['1','2','3','4','5'] as const)[ci];
    const cCfg   = CAULDRONS_L2[ci];

    setLocked(true);

    // DECOY herb — immediate life loss
    if (herb.isDecoy) {
      cozyAudio.playFailure?.();
      setShake(true); setWrongFl(true);
      setDropFeedback({ status: 'decoy', text: `🚫 DECOY WASTAGE! This is food/drink, not a clinic herb!` });
      setTimeout(() => { setShake(false); setWrongFl(false); setDropFeedback(null); }, 5000);
      const nl = lives - 1; setLives(nl);
      addLog(`💀 DECOY WASTAGE: ${herb.name} is a food distraction! (Lost 1 Life)`);
      if (nl <= 0) { setFailed(true); setTimeout(() => onFail(score, curedCount), 8000); }
      else setTimeout(() => setLocked(false), 5000);
      return;
    }

    if (herb.category === targetKey) {
      const currentList = delivered[targetKey];
      const currentCount = patientCountsRef.current[targetKey] !== undefined ? patientCountsRef.current[targetKey] : 5;
      if (currentCount <= 0) {
        cozyAudio.playFailure?.();
        setDropFeedback({ status: 'redundant', text: 'NOT REQUIRED!' });
        setShake(true);
        setTimeout(() => { setShake(false); setDropFeedback(null); setLocked(false); }, 900);
        addLog(`⚠️ ${cCfg.label} is already fully completed!`);
        return;
      }

      cozyAudio.playSuccess?.();
      const updatedList = [...currentList, herb.id];
      setDelivered(prev => ({ ...prev, [targetKey]: updatedList }));

      const isUrgentBonus = urgentDisease === targetKey;
      const hasUrgentOutbreak = urgentDisease && urgentDisease !== targetKey;
      const pts = isUrgentBonus ? 75 : 50;
      setFlyKey(flyDir); setTimeout(() => setFlyKey(''), 450);
      setBoom(targetKey); setTimeout(() => setBoom(''), 750);
 
      const ns = score + pts; setScore(ns); onScoreChange(ns);
      setSorted(s => s + 1);
      if (ns >= MIN_SCORE_L2) setMinScoreMet(true);

      const newCount = Math.max(0, currentCount - 1);
      const isCuredNow = (currentCount > 0 && newCount === 0);
      setPatientCounts(pc => ({ ...pc, [targetKey]: newCount }));
      setStarOn(targetKey); setTimeout(() => setStarOn(''), 900);
 
      setDropFeedback({ 
        status: 'perfect', 
        text: isUrgentBonus 
          ? `🚨 URGENT +${pts}!` 
          : hasUrgentOutbreak 
          ? `⚠️ CORRECT BUT URGENT IGNORED!` 
          : `CORRECT! +${pts}` 
      });
      setTimeout(() => setDropFeedback(null), 1200);
 
      addLog(`✅ ${isUrgentBonus ? '[URGENT BONUS] ' : hasUrgentOutbreak ? '[URGENT IGNORED] ' : ''}${herb.name} → ${cCfg.label} (+${pts} pts)`);

      let nextCuredCount = curedCount;
      if (isCuredNow) {
        addLog(`💚 ${cCfg.label} FULLY CURED! All patients healed!`);
        nextCuredCount = curedCount + 1;
        setCuredCount(nextCuredCount);
        setFlyUpKey(targetKey); setTimeout(() => setFlyUpKey(''), 1200);
        if (urgentDisease === targetKey) { setUrgentDisease(null); setUrgentTimer(0); }
      }

      const remainingDeck = deck.filter((_, i) => i !== queueIdx);
      setDeck(remainingDeck);
      if (remainingDeck.length === 0) {
        const completedDiseases = Object.keys(patientCountsRef.current).filter(key => {
          const val = key === targetKey ? newCount : (patientCountsRef.current[key] || 0);
          return val === 0;
        }).length;
        const partialPass = completedDiseases >= 3 && ns >= MIN_SCORE_L2;
        if (partialPass) {
          addLog(`✅ Shift Complete! You helped cure ${completedDiseases}/5 diseases. Score ${ns} meets target!`);
          setDone(true);
          setTimeout(() => onWin(ns, completedDiseases), 8000);
        } else {
          addLog(`❌ Shift Complete! Only ${completedDiseases}/5 cured. Score: ${ns} (need ${MIN_SCORE_L2}+).`);
          setFailed(true);
          setTimeout(() => onFail(ns, completedDiseases), 8000);
        }
        return;
      }
      setQueueIdx(i => (remainingDeck.length > 0 ? i % remainingDeck.length : 0));
      setTimeout(() => setLocked(false), 450);

    } else {
      cozyAudio.playFailure?.();
      setShake(true); setWrongFl(true);

      const secInfo = SECONDARY_MAP[herb.id];
      let txt = herb.isPrankClue ? 'BE AWARE OF PRANKS!' : 'NOT FIT!';
      if (secInfo && secInfo.key === targetKey) {
        txt = secInfo.msg;
      }
      setDropFeedback({ status: 'wrong', text: txt });

      setTimeout(() => { setShake(false); setWrongFl(false); setDropFeedback(null); }, 2200);
      const nl = lives - 1; setLives(nl);
      addLog(`❌ ${secInfo && secInfo.key === targetKey ? 'PRIORITY ERROR' : (herb.isPrankClue ? 'PRANKED' : 'NOT FIT')}: ${herb.name} does not cure ${cCfg.label}! (Lost 1 Life)`);
      if (nl <= 0) { addLog('💀 Clinic overwhelmed — too many errors!'); setFailed(true); setTimeout(() => onFail(score, curedCount), 8000); }
      else setTimeout(() => setLocked(false), 2200);
    }
  }, [locked, done, failed, deck, queueIdx, lives, score, sorted, delivered, urgentDisease, onWin, onFail, onScoreChange, addLog]);

  /* ── Submit batch ── */
  const handleSubmitBatch = () => {
    if (locked || done || failed) return;
    const completedDiseases = Object.keys(patientCountsRef.current).filter(key => patientCountsRef.current[key] === 0).length;
    const allDone = completedDiseases === 5;
    const partialPass = completedDiseases >= 3 && score >= MIN_SCORE_L2;
    if (allDone) {
      addLog(`🎉 ALL 5 diseases cured! Score: ${score}. Elite healer!`);
      setDone(true); setTimeout(() => onWin(score, completedDiseases), 8000);
    } else if (partialPass) {
      addLog(`✅ Shift Passed: ${completedDiseases}/5 diseases cured. Score ${score} meets Level 2 minimum!`);
      setDone(true); setTimeout(() => onWin(score, completedDiseases), 8000);
    } else {
      addLog(`❌ Shift Failed: Only ${completedDiseases}/5 cured. Score: ${score} (need ${MIN_SCORE_L2}+).`);
      const ns = Math.max(0, score - 80); setScore(ns); onScoreChange(ns);
      setFailed(true); setTimeout(() => onFail(ns, completedDiseases), 8000);
    }
  };

  const goNext = () => { if (!locked && !done && !failed) setQueueIdx(i => (i+1) % deck.length); };
  const goPrev = () => { if (!locked && !done && !failed) setQueueIdx(i => (i-1+deck.length) % deck.length); };

  const herb     = deck[queueIdx];
  const prevHerb = deck.length > 0 ? deck[(queueIdx - 1 + deck.length) % deck.length] : null;
  const nextHerb = deck.length > 0 ? deck[(queueIdx + 1) % deck.length] : null;

  if (!herb && !done && !failed) return (
    <div className="w-full h-full flex flex-col items-center justify-center text-white gap-4 p-5">
      <span className="text-4xl">⚠️</span>
      <p className="hdg2-fredoka text-yellow-400">Deck Exhausted!</p>
      <button onClick={handleSubmitBatch} className="px-8 py-3 rounded-full bg-red-600 hover:bg-red-500 font-sans font-black text-xs uppercase text-white cursor-pointer">Submit Incomplete Batch</button>
    </div>
  );

  return (
    <div id="healer-game-container-l2" className="w-full h-full flex flex-col overflow-hidden relative select-none"
      style={{ background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 'inherit' }}
    >
      {/* Wrong flash */}
      {wrongFl && <div className="absolute inset-0 pointer-events-none z-45" style={{ animation:'hdg2WrongFlash .52s ease both' }} />}

      {/* Background sparkles */}
      {Array.from({length:16}).map((_,i) => (
        <div key={i} className="absolute rounded-full pointer-events-none"
          style={{ width:2.5, height:2.5, left:`${(i*13+7)%100}%`, top:`${(i*17+5)%100}%`, background:'white', opacity:.08+.14*(i%3), animation:`hdg2Sparkle ${2+i*.3}s ease-in-out infinite`, animationDelay:`${i*.18}s` }}
        />
      ))}

      {/* ═══ TOP HUD ═══ */}
      <div className="shrink-0 flex items-center justify-between px-5 pt-3 pb-2 z-20">
        {/* Branding + Urgent Indicator */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl border-2 bg-[#3e2723] shadow"
            style={{ borderColor: urgentDisease ? '#ef4444' : '#5d4037', animation: urgentDisease ? 'hdg2UrgentPulse 1.2s ease-in-out infinite' : 'none' }}
          >
            <span className="text-xl">{urgentDisease ? '🚨' : '🌿'}</span>
            <div className="flex flex-col text-left">
              <span className="hdg2-fredoka text-[9px] uppercase tracking-wider text-[#fbbf24] leading-tight font-black">
                {urgentDisease ? `URGENT: ${urgentDisease.toUpperCase()}` : 'Apothecary Lab · LVL 2'}
              </span>
              {urgentDisease && (
                <span className="hdg2-fredoka text-[11px] text-red-300 leading-tight font-black">{urgentTimer}s remaining</span>
              )}
            </div>
          </div>
        </div>

        {/* Submit button */}
        <button onClick={handleSubmitBatch}
          className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-green-700 hover:from-emerald-500 hover:to-green-600 text-white font-sans font-black text-[9.5px] uppercase tracking-wider transition cursor-pointer shadow border border-emerald-400 active:scale-95"
        >🧪 Submit</button>

        {/* Cured count + Min score + Lives */}
        <div className="flex items-center gap-2">
          <div className="px-4 py-1.5 rounded-2xl bg-black/90 flex items-center gap-3 border border-white/10 shadow-lg">
            <span className="hdg2-fredoka text-[9.5px] text-white/50 uppercase tracking-widest font-black">Cured</span>
            <span className="hdg2-fredoka text-[14.5px] font-black" style={{ color: curedCount >= 3 ? '#34d399' : '#fbbf24' }}>
              {curedCount}<span className="text-white/40 text-[11px]">/5</span>
            </span>
          </div>
          <div className="px-4 py-1.5 rounded-2xl border border-white/10 shadow-lg"
            style={{ background: minScoreMet ? 'rgba(5,46,22,0.9)' : 'rgba(0,0,0,0.9)', borderColor: minScoreMet ? 'rgba(52,211,153,.4)' : 'rgba(255,255,255,.1)' }}
          >
            <span className="hdg2-fredoka text-[9.5px] uppercase tracking-widest font-black" style={{ color: minScoreMet ? '#34d399' : 'rgba(255,255,255,0.5)' }}>Target</span>
            <span className="hdg2-fredoka text-[13px] font-black block leading-none" style={{ color: minScoreMet ? '#34d399' : '#fbbf24' }}>
              {minScoreMet ? '✅ MET' : `${MIN_SCORE_L2}+`}
            </span>
          </div>
          <div className="px-4 py-1.5 rounded-2xl bg-black/90 flex items-center gap-3 border border-white/10 shadow-lg">
            <span className="hdg2-fredoka text-[9.5px] text-white/50 uppercase tracking-widest font-black">Lives</span>
            <div className="flex gap-1 items-center">
              {Array.from({length: LIVES_L2}).map((_,i) => (
                <span key={i} style={{ fontSize:14, opacity: i < lives ? 1 : 0.2, filter: i < lives ? 'drop-shadow(0 0 6px red)' : 'none', transition:'all .3s' }}>❤️</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ═══ CAROUSEL ═══ */}
      <div className="flex-grow min-h-0 flex items-center relative px-10 z-20 overflow-hidden w-full">
        <button onClick={goPrev} className="absolute left-3 z-30 w-9 h-9 rounded-full flex items-center justify-center text-white bg-black/55 hover:bg-black/85 transition cursor-pointer border border-white/10 active:scale-95 shadow-md">◀</button>
        <div className="w-full h-full flex items-center justify-center gap-5 relative overflow-hidden">
          {/* Left peek */}
          {prevHerb ? (
            <div onClick={goPrev} className="w-[180px] h-[225px] rounded-2xl border bg-black/55 hover:bg-black/75 cursor-pointer opacity-70 hover:opacity-95 transition-all duration-300 flex flex-col justify-between p-3 shrink-0 text-left scale-95"
              style={{ borderColor:`rgba(${prevHerb.glowRgb},.35)`, boxShadow:'0 8px 16px rgba(0,0,0,.55)' }}
            >
              <div className="flex items-center gap-2 shrink-0"><span className="text-2xl">{prevHerb.emoji}</span><span className="hdg2-fredoka text-[11px] text-white font-black truncate flex-1">{prevHerb.name}</span></div>
              <p className="hdg2-nunito text-[9.5px] text-white/50 flex-grow mt-1.5 max-h-[65px] overflow-hidden">{prevHerb.description.substring(0,70)}...</p>
              {prevHerb.isDecoy && <span className="text-[8.5px] text-red-400 font-black">⚠️ SUSPICIOUS HERB</span>}
              <div className="mt-1.5 pt-1.5 border-t border-white/5 text-[9px] text-yellow-200/70 font-semibold truncate shrink-0">Clue: {prevHerb.clue}</div>
            </div>
          ) : <div className="w-[180px] shrink-0" />}

          {/* Active card */}
          {herb && (
            <div className="relative z-20 w-[350px] h-[260px] rounded-[2rem] overflow-hidden flex flex-col justify-between shrink-0"
              style={{
                background: `linear-gradient(155deg, ${herb.gradA}, ${herb.gradB})`,
                border: `2.5px solid rgba(${herb.glowRgb},.65)`,
                boxShadow: `0 0 0 1.5px rgba(${herb.glowRgb},.25), 0 0 28px rgba(${herb.glowRgb},.45), 0 12px 32px rgba(0,0,0,.75)`,
                animation: shake ? 'hdg2Shake .52s ease both' : flyKey ? `hdg2Fly${flyKey} .4s cubic-bezier(.4,0,1,1) both` : 'hdg2Float 3s ease-in-out infinite',
              }}
            >
              <div className="absolute inset-0 pointer-events-none" style={{ background:`radial-gradient(ellipse at 50% 0%, rgba(${herb.glowRgb},.35), transparent 60%)` }} />
              {herb.isDecoy && (
                <div className="absolute inset-0 pointer-events-none z-20 flex items-center justify-center">
                  <span className="text-4xl opacity-20" style={{ animation:'hdg2Float 2s ease-in-out infinite' }}>🚫</span>
                </div>
              )}
              <div className="flex items-center gap-3 px-4 pt-3.5 relative z-10 shrink-0">
                <div className="w-12 h-12 rounded-full flex items-center justify-center text-3xl shrink-0"
                  style={{ background:`radial-gradient(circle at 35% 35%, rgba(${herb.glowRgb},.4), rgba(0,0,0,.5))`, boxShadow:`0 0 0 2px rgba(${herb.glowRgb},.35)` }}
                >{herb.emoji}</div>
                <div className="text-left flex-1 min-w-0">
                  <h3 className="hdg2-fredoka text-[14px] text-white font-black truncate" style={{ textShadow:`0 0 8px rgba(${herb.glowRgb},.8)` }}>{herb.name}</h3>
                  <span className="inline-block mt-0.5 px-2 py-0.5 rounded-full text-[8.5px] font-black hdg2-nunito uppercase tracking-wider border"
                    style={{ background:`rgba(${herb.glowRgb},.15)`, color:`rgb(${herb.glowRgb})`, borderColor:`rgba(${herb.glowRgb},.3)` }}
                  >{herb.property}</span>
                </div>
              </div>
              <div className="px-4 py-2 relative z-10 flex-grow overflow-y-auto custom-scrollbar max-h-[80px] text-left">
                <p className="hdg2-nunito text-[12px] font-bold text-white/90 leading-relaxed">{herb.description}</p>
              </div>
              <div className="mx-3 mb-3 px-3 py-1.5 rounded-xl relative z-10 shrink-0 text-left"
                style={{ background:'rgba(0,0,0,.35)', border:'1px solid rgba(255,255,255,.08)' }}
              >
                <span className="hdg2-nunito text-[7.5px] font-black uppercase tracking-widest text-white/35 block leading-none mb-0.5">
                  {herb.isPrankClue ? '🎭 Clue (Careful!)' : herb.isDecoy ? '🚫 Warning' : '💡 Clinical Clue'}
                </span>
                <p className="hdg2-nunito text-[11px] text-white/70 leading-tight font-semibold">{herb.clue}</p>
              </div>
              <div className="absolute top-3.5 right-4 z-20 px-2 py-0.5 rounded-full hdg2-fredoka text-[8px] text-white/50 bg-black/40 border border-white/10">
                {queueIdx + 1}/{deck.length}
              </div>
            </div>
          )}

          {/* Right peek */}
          {nextHerb ? (
            <div onClick={goNext} className="w-[180px] h-[225px] rounded-2xl border bg-black/55 hover:bg-black/75 cursor-pointer opacity-70 hover:opacity-95 transition-all duration-300 flex flex-col justify-between p-3 shrink-0 text-left scale-95"
              style={{ borderColor:`rgba(${nextHerb.glowRgb},.35)`, boxShadow:'0 8px 16px rgba(0,0,0,.55)' }}
            >
              <div className="flex items-center gap-2 shrink-0"><span className="text-2xl">{nextHerb.emoji}</span><span className="hdg2-fredoka text-[11px] text-white font-black truncate flex-1">{nextHerb.name}</span></div>
              <p className="hdg2-nunito text-[9.5px] text-white/50 flex-grow mt-1.5 max-h-[65px] overflow-hidden">{nextHerb.description.substring(0,70)}...</p>
              {nextHerb.isDecoy && <span className="text-[8.5px] text-red-400 font-black">⚠️ SUSPICIOUS HERB</span>}
              <div className="mt-1.5 pt-1.5 border-t border-white/5 text-[9px] text-yellow-200/70 font-semibold truncate shrink-0">Clue: {nextHerb.clue}</div>
            </div>
          ) : <div className="w-[180px] shrink-0" />}
        </div>
        <button onClick={goNext} className="absolute right-3 z-30 w-9 h-9 rounded-full flex items-center justify-center text-white bg-black/55 hover:bg-black/85 transition cursor-pointer border border-white/10 active:scale-95 shadow-md">▶</button>
      </div>

      {/* ═══ CAULDRONS ═══ */}
      <div className="shrink-0 px-4 mt-2 mb-1.5 z-20">
        <div className="flex items-center gap-2.5">
          <span className="hdg2-fredoka text-[12px] font-black uppercase tracking-wider text-white/50">🛡️ Disease Curing Targets · Level 2</span>
          <div className="flex-1 h-[1.5px] bg-gradient-to-r from-white/15 to-transparent" />
        </div>
      </div>
      <div className="shrink-0 grid grid-cols-5 gap-2 px-3 pb-3 z-20">
        {CAULDRONS_L2.map((c, idx) => {
          const isBoom = boom === c.key;
          const isStar = starOn === c.key;
          const isFlyUp = flyUpKey === c.key;
          const isDrainWarning = drainWarnings[c.key];
          const isUrgent = urgentDisease === c.key;
          const currentDelCount = delivered[c.key].length;
          const pCount = patientCounts[c.key] ?? 5;
          const isCured = pCount === 0;
          const diseaseLabel = c.key.charAt(0).toUpperCase() + c.key.slice(1);
          return (
            <div key={c.key}
              ref={el => { cauldronRefs.current[c.key] = el; }}
              onClick={() => handleDrop(c.key)}
              className="relative flex flex-row items-center rounded-2xl border cursor-pointer overflow-hidden transition-all duration-200 hover:scale-[1.03] hover:brightness-110 active:scale-95 shadow-xl animate-fade-in"
              style={{
                background: isCured
                  ? `linear-gradient(145deg,#052e16,#065f46)`
                  : `linear-gradient(145deg,${c.gradA},${c.gradB})`,
                borderColor: isUrgent ? '#ef4444' : isCured ? 'rgba(52,211,153,.7)' : `rgba(${c.glowRgb},.65)`,
                boxShadow: isUrgent
                  ? '0 0 0 3px rgba(239,68,68,.5), 0 0 28px rgba(239,68,68,.4)'
                  : isCured ? '0 0 0 2px rgba(52,211,153,.3), 0 0 24px rgba(52,211,153,.4)'
                  : `0 0 0 1.5px rgba(${c.glowRgb},.2), 0 0 16px rgba(${c.glowRgb},.35), 0 8px 24px rgba(0,0,0,.6)`,
                animation: isBoom ? 'hdg2Boom .7s ease both' : isUrgent ? 'hdg2UrgentPulse 1.2s ease-in-out infinite' : isDrainWarning ? 'hdg2DrainFlash 0.5s ease-in-out infinite' : 'none',
                minHeight: '112px',
              }}
            >
              {/* Glow overlay */}
              <div className="absolute inset-0 pointer-events-none"
                style={{ background:`radial-gradient(circle at 20% 50%, rgba(${c.glowRgb},.32), transparent 70%)` }}
              />

              {isStar && <span className="absolute z-50 pointer-events-none text-3xl" style={{ top:'50%', left:'50%', animation:'hdg2StarPop .7s ease-out both' }}>⭐</span>}
              {isFlyUp && <span className="absolute z-50 pointer-events-none text-2xl font-black text-emerald-300" style={{ top:'20%', left:'50%', transform:'translateX(-50%)', animation:'hdg2FlyUp 1.2s ease-out both', whiteSpace:'nowrap' }}>💚 CURED!</span>}
              {isUrgent && <span className="absolute -top-2 right-2 z-30 text-[9px] font-black text-white bg-red-500 px-2 py-0.5 rounded-full animate-bounce">{urgentTimer}s</span>}
              {isDrainWarning && <span className="absolute -top-2 left-2 z-30 text-[9px] font-black text-white bg-amber-500 px-2 py-0.5 rounded-full">⏳ DRAINED!</span>}

              {/* LEFT — BIG ICON filling full card height */}
              <div className="shrink-0 flex items-center justify-center self-stretch px-3"
                style={{
                  background: `rgba(0,0,0,0.22)`,
                  borderRight: `1px solid rgba(${c.glowRgb},.2)`,
                  minWidth: '58px',
                }}
              >
                <span
                  style={{
                    fontSize: '2.6rem',
                    lineHeight: 1,
                    filter: isCured
                      ? 'drop-shadow(0 0 12px rgba(52,211,153,0.9))'
                      : `drop-shadow(0 0 10px rgba(${c.glowRgb},0.9))`,
                    display: 'block',
                  }}
                >{c.icon}</span>
              </div>

              {/* RIGHT — disease name + patient count */}
              <div className="flex-grow min-w-0 text-left px-2.5 py-1.5 relative z-10 flex flex-col justify-center gap-0.5">
                {/* Disease Name - Colored based on category tag color */}
                <span className="hdg2-fredoka text-[13px] font-black leading-none block"
                  style={{
                    color: c.tag || '#ffffff',
                    textShadow: isCured ? '0 0 10px rgba(52,211,153,.9)' : `0 0 10px rgba(${c.glowRgb},.9)`,
                  }}
                >
                  {diseaseLabel}
                </span>

                {/* Patient Count — only big gorgeous Luckiest Guy number/symbol */}
                <span className="hdg2-luckiest text-[1.8rem] leading-none block mt-0.5 select-none"
                  style={{
                    color: isCured ? '#34d399' : '#fbbf24',
                    textShadow: isCured ? '0 0 12px rgba(52,211,153,0.6)' : '0 0 12px rgba(251,191,36,0.6)',
                  }}
                >
                  {isCured ? '✔' : String(pCount).padStart(2, '0')}
                </span>

                {/* Patients Label */}
                <span className="hdg2-fredoka text-[9.5px] uppercase tracking-wider block leading-none text-white/50">
                  Patients
                </span>

                {/* Progress dots */}
                <div className="flex gap-1.5 mt-1">
                  <div className={`w-2.5 h-2.5 rounded-full border border-white/20 transition-all duration-300 ${currentDelCount >= 1 ? 'bg-amber-400 shadow-[0_0_6px_#f59e0b]' : 'bg-black/50'}`} />
                  <div className={`w-2.5 h-2.5 rounded-full border border-white/20 transition-all duration-300 ${currentDelCount >= 2 ? 'bg-emerald-400 shadow-[0_0_6px_#10b981]' : 'bg-black/50'}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>



      {/* Drop Feedback Slogan */}
      {dropFeedback && (
        <div className="absolute inset-0 pointer-events-none z-50 flex items-center justify-center animate-fade-in animate-duration-150 px-8">
          <div 
            className="px-8 py-5 rounded-3xl border-4 shadow-2xl text-center transform scale-110 animate-bounce hdg2-fredoka flex flex-col items-center gap-1.5 max-w-md"
            style={{
              background: dropFeedback.status === 'perfect'
                ? '#022c22'
                : dropFeedback.status === 'redundant'
                ? '#451a03'
                : 'linear-gradient(135deg, #1c0205 0%, #0d0112 100%)',
              borderColor: dropFeedback.status === 'perfect'
                ? '#34d399'
                : dropFeedback.status === 'redundant'
                ? '#fbbf24'
                : '#ef4444',
              boxShadow: dropFeedback.status === 'perfect'
                ? '0 0 32px rgba(52,211,153,0.7)'
                : dropFeedback.status === 'redundant'
                ? '0 0 32px rgba(251,191,36,0.6)'
                : '0 0 40px rgba(239,68,68,0.95), inset 0 0 16px rgba(255,255,255,0.06)',
            }}
          >
            {dropFeedback.status === 'wrong' || dropFeedback.status === 'decoy' ? (
              <>
                <span className="text-yellow-400 text-[10px] tracking-widest uppercase font-black px-3 py-0.5 rounded-full bg-black/40 border border-yellow-400/30">
                  ⚠️ CLINICAL ERROR DETECTED!
                </span>
                <span className="text-[14px] leading-relaxed text-white font-bold block mt-1" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                  {dropFeedback.text}
                </span>
                <span className="text-[9.5px] uppercase tracking-wider text-rose-300/60 block mt-1">
                  -1 Life Penalty Applied
                </span>
              </>
            ) : (
              <span className="text-xl font-black uppercase tracking-wider block"
                style={{
                  textShadow: dropFeedback.status === 'perfect' 
                    ? '0 0 10px rgba(52,211,153,0.8)' 
                    : '0 0 10px rgba(245,158,11,0.8)'
                }}
              >
                {dropFeedback.text}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Win/Fail overlays */}
      {done && (
        <Hdg2ResultBanner
          win={true}
          title={curedCount >= 5 ? "ALL 5 DISEASES CURED! 🌿" : "ASSISTANCE SUCCESSFUL! 🌿"}
          score={score}
        />
      )}
      {failed && (
        <Hdg2ResultBanner
          win={false}
          title="ASSISTANCE FAILED! 💔"
          score={score}
        />
      )}
    </div>
  );
}
