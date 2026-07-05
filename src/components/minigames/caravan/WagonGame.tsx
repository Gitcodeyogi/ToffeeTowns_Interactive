import React, { useState, useEffect, useCallback, useRef } from 'react';
import { SoundSynth } from '../shared/SoundSynth';
import {
  type GameProps, GameWrapper, TopBar, useEffects, EffectLayer, WinBanner, FailBanner, SVGGear
} from '../core/GameWorkbench';

export function WagonGame({ onWin, onScoreChange }: GameProps) {
  // 5 rows x 6 columns grid puzzle matching Wagongame_Gameplayarea.png
  // Winding path coordinates: (2,0) -> (2,1) -> (2,2) -> (1,2) -> (1,3) -> (2,3) -> (3,3) -> (3,4) -> (2,4) -> (1,4) -> (1,5)
  const PATH = [
    { r: 2, c: 0 },
    { r: 2, c: 1 },
    { r: 2, c: 2 },
    { r: 1, c: 2 },
    { r: 1, c: 3 },
    { r: 2, c: 3 },
    { r: 3, c: 3 },
    { r: 3, c: 4 },
    { r: 2, c: 4 },
    { r: 1, c: 4 },
    { r: 1, c: 5 },
  ];

  const PITS = [
    { r: 3, c: 2, targetCrateId: 1 },
    { r: 0, c: 3, targetCrateId: 2 },
    { r: 4, c: 4, targetCrateId: 3 },
  ];

  const [crates, setCrates] = useState([
    { id: 1, r: 2, c: 2, startR: 2, startC: 2, pitR: 3, pitC: 2, color: '#b45309' },
    { id: 2, r: 1, c: 3, startR: 1, startC: 3, pitR: 0, pitC: 3, color: '#d97706' },
    { id: 3, r: 3, c: 4, startR: 3, startC: 4, pitR: 4, pitC: 4, color: '#b45309' },
  ]);

  const [boatIndex, setBoatIndex] = useState(0);
  const [moves, setMoves] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(293); // Starts at 04:53
  const [won, setWon] = useState(false);
  const { effects, addEffect } = useEffects();
  const wonRef = useRef(false);

  useEffect(() => {
    onScoreChange?.(score);
  }, [score, onScoreChange]);

  // Timer Tick
  useEffect(() => {
    if (won || timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft(p => p - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [won, timeLeft]);

  // Win condition & Boat sailing animation
  const allCleared = crates.every(crate => crate.r === crate.pitR && crate.c === crate.pitC);

  useEffect(() => {
    if (allCleared && !won) {
      setWon(true);
      setScore(p => p + Math.max(100, 300 - moves * 10));
      addEffect('🚢 PATH UNLOCKED!', '#34d399', 50, 30, true);
    }
  }, [allCleared, won, moves, addEffect]);

  useEffect(() => {
    if (won && boatIndex < PATH.length - 1) {
      const timer = setTimeout(() => {
        setBoatIndex(p => p + 1);
      }, 200);
      return () => clearTimeout(timer);
    } else if (won && boatIndex === PATH.length - 1 && !wonRef.current) {
      wonRef.current = true;
      addEffect('🏆 DUTY COMPLETE!', '#fbbf24', 50, 45, true);
      setTimeout(onWin, 1800);
    }
  }, [won, boatIndex, onWin, addEffect]);

  const handleCrateClick = (crateId: number) => {
    if (won) return;
    setCrates(prev => {
      const next = prev.map(crate => {
        if (crate.id === crateId) {
          const coords = getIsoCoords(crate.r, crate.c);
          // If at start, push to pit
          if (crate.r === crate.startR && crate.c === crate.startC) {
            // Check if pit is empty
            const isPitOccupied = prev.some(o => o.r === crate.pitR && o.c === crate.pitC);
            if (!isPitOccupied) {
              setMoves(m => m + 1);
              setShake(true);
              setTimeout(() => setShake(false), 300);
              addEffect('*creak!*', '#fbbf24', coords.x, coords.y - 15);
              return { ...crate, r: crate.pitR, c: crate.pitC };
            }
          } else {
            // Pull back from pit
            const isStartOccupied = prev.some(o => o.r === crate.startR && o.c === crate.startC);
            if (!isStartOccupied) {
              setMoves(m => m + 1);
              setShake(true);
              setTimeout(() => setShake(false), 300);
              addEffect('*puff!*', '#60a5fa', coords.x, coords.y - 15);
              return { ...crate, r: crate.startR, c: crate.startC };
            }
          }
        }
        return crate;
      });
      return next;
    });
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const resetBoard = () => {
    setCrates([
      { id: 1, r: 2, c: 2, startR: 2, startC: 2, pitR: 3, pitC: 2, color: '#b45309' },
      { id: 2, r: 1, c: 3, startR: 1, startC: 3, pitR: 0, pitC: 3, color: '#d97706' },
      { id: 3, r: 3, c: 4, startR: 3, startC: 4, pitR: 4, pitC: 4, color: '#b45309' },
    ]);
    setMoves(0);
    setBoatIndex(0);
    setWon(false);
    wonRef.current = false;
    setTimeLeft(293);
  };

  // Helper SVGs
  const SVGBarge = () => (
    <svg width="46" height="30" viewBox="0 0 52 34" className="overflow-visible filter drop-shadow-[0_4px_6px_rgba(0,0,0,0.6)]">
      <path d="M 4,22 L 44,22 L 48,10 L 8,10 Z" fill="#065f46" stroke="#34d399" strokeWidth="2.5" />
      <polygon points="8,10 44,10 40,8 12,8" fill="#78350f" />
      <rect x="14" y="6" width="18" height="10" rx="2.5" fill="#ecfdf5" stroke="#065f46" strokeWidth="2" />
      <rect x="18" y="9" width="4" height="4" rx="0.5" fill="#22d3ee" />
      <rect x="24" y="9" width="4" height="4" rx="0.5" fill="#22d3ee" />
      <rect x="28" y="2" width="3" height="5" fill="#374151" />
      <circle cx="29.5" cy="1" r="1.5" fill="#ef4444" className="animate-pulse" />
    </svg>
  );

  const SVGCrate = () => (
    <svg width="38" height="38" viewBox="0 0 44 44" className="overflow-visible filter drop-shadow-[0_4px_6px_rgba(0,0,0,0.65)]">
      <rect x="2" y="2" width="40" height="40" rx="5" fill="#b45309" stroke="#78350f" strokeWidth="3" />
      <line x1="2" y1="12" x2="42" y2="12" stroke="#78350f" strokeWidth="2" />
      <line x1="2" y1="22" x2="42" y2="22" stroke="#78350f" strokeWidth="2" />
      <line x1="2" y1="32" x2="42" y2="32" stroke="#78350f" strokeWidth="2" />
      <line x1="6" y1="6" x2="38" y2="38" stroke="#78350f" strokeWidth="4" />
      <polygon points="2,2 10,2 2,10" fill="#4b5563" stroke="#1f2937" strokeWidth="1" />
      <polygon points="42,2 34,2 42,10" fill="#4b5563" stroke="#1f2937" strokeWidth="1" />
      <polygon points="2,42 10,42 2,34" fill="#4b5563" stroke="#1f2937" strokeWidth="1" />
      <polygon points="42,42 34,42 42,34" fill="#4b5563" stroke="#1f2937" strokeWidth="1" />
    </svg>
  );

  const getPipinText = () => {
    if (won) return "Awesome! Path is completely cleared! Safe travels, Captain! 🎉";
    if (moves >= 20) return "Oops, maximum moves exceeded! Let's replay the duty.";
    if (moves === 0) return "Help the steam barge pass by pushing these blocking cogs/crates into the ditch locks! 🚢";
    const clearedCount = crates.filter(c => c.r === c.pitR && c.c === c.pitC).length;
    if (clearedCount === 1) return "Great work! One obstacle pushed away! Keep it going!";
    if (clearedCount === 2) return "Only one crate left! Push it into the lock ditch!";
    return "Great maneuvering! You've got this!";
  };

  // Stomping and shaking head animations for the wagon horses
  const [stomp, setStomp] = useState(false);
  const [shake, setShake] = useState(false);
  const [dustClouds, setDustClouds] = useState<{ id: number; x: number; y: number }[]>([]);
  const [birds, setBirds] = useState<{ id: number; x: number; y: number; delay: number }[]>([]);

  useEffect(() => {
    if (won) return;
    const stompInterval = setInterval(() => {
      setStomp(true);
      setTimeout(() => setStomp(false), 250);
    }, 3200);

    const shakeInterval = setInterval(() => {
      setShake(true);
      setTimeout(() => setShake(false), 300);
    }, 4500);

    return () => {
      clearInterval(stompInterval);
      clearInterval(shakeInterval);
    };
  }, [won]);

  // Generate success animations (dust clouds + birds flying) when won
  useEffect(() => {
    if (won) {
      // Dust clouds puffing
      const dustInterval = setInterval(() => {
        const coords = getIsoCoords(PATH[boatIndex].r, PATH[boatIndex].c);
        setDustClouds(prev => [
          ...prev.slice(-10),
          { id: Date.now() + Math.random(), x: coords.x - 20, y: coords.y + 12 }
        ]);
      }, 250);

      // Birds fleeing from trees
      setBirds([
        { id: 1, x: 180, y: 140, delay: 0.1 },
        { id: 2, x: 210, y: 120, delay: 0.3 },
        { id: 3, x: 620, y: 180, delay: 0.2 },
        { id: 4, x: 650, y: 160, delay: 0.5 },
      ]);

      return () => clearInterval(dustInterval);
    }
  }, [won, boatIndex]);

  const getIsoCoords = (r: number, c: number) => {
    // Scaled coordinates mapping (140x70) to fill the 780x430 area beautifully
    const startX = 380;
    const startY = 70;
    const tileW = 140;
    const tileH = 70;
    const x = startX + (c - r) * (tileW / 2);
    const y = startY + (c + r) * (tileH / 2);
    return { x, y };
  };

  // Helper SVGs inside the layout
  const RoadTile = ({ x, y }: { x: number; y: number }) => (
    <g>
      {/* 3D raised block extrusion */}
      <polygon points={`${x - 70},${y} ${x},${y + 35} ${x},${y + 44} ${x - 70},${y + 9}`} fill="url(#stoneSideLeft)" stroke="#111" strokeWidth="0.8" />
      <polygon points={`${x},${y + 35} ${x + 70},${y} ${x + 70},${y + 9} ${x},${y + 44}`} fill="url(#stoneSideRight)" stroke="#111" strokeWidth="0.8" />
      
      {/* Top surface diamond */}
      <polygon points={`${x},${y - 35} ${x + 70},${y} ${x},${y + 35} ${x - 70},${y}`} fill="url(#stoneGrad)" stroke="#475569" strokeWidth="1.5" />
      
      {/* Cobblestone cracks & bricks lines */}
      <path d={`M ${x - 30},${y - 10} L ${x - 15},${y + 5} M ${x + 15},${y - 10} L ${x + 30},${y + 5} M ${x},${y - 20} L ${x},${y + 20}`} stroke="#334155" strokeWidth="1.2" opacity="0.4" />
      <path d={`M ${x - 45},${y - 5} L ${x - 35},${y} M ${x + 35},${y} L ${x + 45},${y - 5}`} stroke="#334155" strokeWidth="1" opacity="0.4" />
      
      {/* Moss patches on stone */}
      <path d={`M ${x - 10},${y - 15} Q ${x - 5},${y - 18} ${x},${y - 15} Q ${x + 5},${y - 12} ${x - 10},${y - 15} Z`} fill="#15803d" opacity="0.75" />
    </g>
  );

  const PitTile = ({ x, y, label }: { x: number; y: number; label: string }) => {
    const isMud = label === 'MUD';
    const isSand = label === 'SAND';
    const pitColor = isMud ? '#451a03' : isSand ? '#ca8a04' : '#14532d';
    return (
      <g>
        {/* Sunken pit walls */}
        <polygon points={`${x},${y - 35} ${x + 70},${y} ${x},${y + 35} ${x - 70},${y}`} fill="#09090b" stroke="#000" strokeWidth="2.5" />
        <polygon points={`${x - 70},${y} ${x},${y + 35} ${x},${y + 12} ${x - 70},${y - 23}`} fill="#000000" opacity="0.9" />
        <polygon points={`${x},${y + 35} ${x + 70},${y} ${x + 70},${y - 23} ${x},${y + 12}`} fill="#09090b" opacity="0.85" />
        
        {/* Pit floor filled with sand, mud, or grass */}
        <polygon points={`${x},${y - 10} ${x + 40},${y + 10} ${x},${y + 30} ${x - 40},${y + 10}`} fill={pitColor} opacity="0.9" />
        
        <text x={x} y={y + 16} textAnchor="middle" fill="#f59e0b" fontSize="8" fontWeight="black" fontFamily="Fredoka One" opacity="0.7" style={{ filter: 'drop-shadow(0 0 4px rgba(0,0,0,0.8))' }}>{label}</text>
      </g>
    );
  };

  const WaterTile = ({ x, y, hasLotus }: { x: number; y: number; hasLotus?: boolean }) => (
    <g>
      <polygon points={`${x},${y - 35} ${x + 70},${y} ${x},${y + 35} ${x - 70},${y}`} fill="url(#waterGrad)" stroke="#0284c7" strokeWidth="0.5" />
      
      {/* Shimmer wave ripples */}
      <path d={`M ${x - 40},${y} Q ${x - 20},${y - 8} ${x},${y} Q ${x + 20},${y + 8} ${x + 40},${y}`} fill="none" stroke="#38bdf8" strokeWidth="1" opacity="0.3" className="animate-pulse" />
      <path d={`M ${x - 25},${y - 12} Q ${x - 12},${y - 16} ${x},${y - 12}`} fill="none" stroke="#e0f2fe" strokeWidth="0.8" opacity="0.2" />

      {/* Lily Pad */}
      <path d={`M ${x - 12},${y - 5} A 11 11 0 1 1 ${x + 10},${y - 2} L ${x - 3},${y - 2} Z`} fill="#166534" stroke="#14532d" strokeWidth="0.8" opacity="0.9" />
      {hasLotus && (
        <g transform={`translate(${x}, ${y - 5})`}>
          <path d="M 0,-8 Q 4,-3 0,0 Q -4,-3 0,-8" fill="#f472b6" />
          <path d="M -6,-5 Q -1,-1 -3,3 Q -7,2 -6,-5" fill="#ec4899" />
          <path d="M 6,-5 Q 1,-1 3,3 Q 7,2 6,-5" fill="#ec4899" />
          <circle cx="0" cy="-3" r="1.5" fill="#fbbf24" />
        </g>
      )}
    </g>
  );

  const SVGCaravanWagon = ({ stomping, shaking, moving }: { stomping: boolean; shaking: boolean; moving: boolean }) => {
    const headRot = shaking ? 'rotate(10)' : 'rotate(0)';
    const hoofTrans = stomping ? 'translate(0, -4)' : 'translate(0, 0)';
    const wheelAnimation = moving ? 'mgSpin 0.9s linear infinite' : 'none';
    return (
      <g transform="translate(0, -22) scale(1.4)" className="overflow-visible">
        {/* Metal harnesses links */}
        <line x1="6" y1="12" x2="26" y2="12" stroke="#451a03" strokeWidth="3" />
        <line x1="6" y1="16" x2="26" y2="16" stroke="#451a03" strokeWidth="3" />
        <line x1="12" y1="12" x2="12" y2="16" stroke="#a16207" strokeWidth="1.5" />

        {/* 1. WOODEN WAGON */}
        <g transform="translate(-24, 0)">
          {/* Bed Box wood planks */}
          <rect x="-17" y="1" width="34" height="15" rx="2" fill="url(#woodLog)" stroke="#451a03" strokeWidth="2.5" />
          <line x1="-17" y1="6" x2="17" y2="6" stroke="#451a03" strokeWidth="1.2" />
          <line x1="-17" y1="11" x2="17" y2="11" stroke="#451a03" strokeWidth="1.2" />
          
          {/* Gold corner brackets */}
          <rect x="-17" y="1" width="4" height="4" fill="url(#goldGrad)" stroke="#451a03" strokeWidth="0.8" />
          <rect x="13" y="1" width="4" height="4" fill="url(#goldGrad)" stroke="#451a03" strokeWidth="0.8" />

          {/* Cargo: Cocoa sacks, Honey Jar, Flour barrels */}
          {/* Sacks */}
          <path d="M -13,1 Q -6,-9 1,1 Z" fill="#b45309" stroke="#451a03" strokeWidth="1.5" />
          <path d="M -13,1 L -13,-2 M 1,1 L 1,-2" stroke="#451a03" strokeWidth="1" />
          {/* Flour Barrel */}
          <rect x="-5" y="-5" width="12" height="10" rx="1.5" fill="#d97706" stroke="#451a03" strokeWidth="1.8" />
          <line x1="-5" y1="-2" x2="7" y2="-2" stroke="#451a03" strokeWidth="0.8" />
          <line x1="-5" y1="2" x2="7" y2="2" stroke="#451a03" strokeWidth="0.8" />
          {/* Honey Jar */}
          <circle cx="8" cy="1" r="4" fill="#fbbf24" stroke="#7e22ce" strokeWidth="1" />
          <rect x="6" y="-3" width="4" height="2" fill="#7e22ce" rx="0.5" />
          
          {/* Wheels (Wood & Brass rims) */}
          <g style={{ transformOrigin: '-10px 18px', animation: wheelAnimation }}>
            <circle cx="-10" cy="18" r="8" fill="#451a03" stroke="#000" strokeWidth="2" />
            <circle cx="-10" cy="18" r="5" fill="url(#goldGrad)" stroke="#451a03" strokeWidth="1" />
            <circle cx="-10" cy="18" r="2" fill="#000" />
            <line x1="-18" y1="18" x2="-2" y2="18" stroke="#451a03" strokeWidth="1" />
            <line x1="-10" y1="10" x2="-10" y2="26" stroke="#451a03" strokeWidth="1" />
          </g>
          <g style={{ transformOrigin: '10px 18px', animation: wheelAnimation }}>
            <circle cx="10" cy="18" r="8" fill="#451a03" stroke="#000" strokeWidth="2" />
            <circle cx="10" cy="18" r="5" fill="url(#goldGrad)" stroke="#451a03" strokeWidth="1" />
            <circle cx="10" cy="18" r="2" fill="#000" />
            <line x1="2" y1="18" x2="18" y2="18" stroke="#451a03" strokeWidth="1" />
            <line x1="10" y1="10" x2="10" y2="26" stroke="#451a03" strokeWidth="1" />
          </g>
        </g>

        {/* 2. TWO HORSES (Impatient stomping) */}
        <g transform="translate(18, 0)">
          {/* Body */}
          <ellipse cx="-4" cy="11" rx="9" ry="6.5" fill="#a16207" stroke="#451a03" strokeWidth="1.5" />
          <ellipse cx="3" cy="11" rx="9.5" ry="6.5" fill="#d97706" stroke="#451a03" strokeWidth="1.5" />
          
          {/* Leg structures */}
          <rect x="-10" y="16.5" width="2" height="6.5" fill="#451a03" />
          <rect x="-2" y="16.5" width="2" height="6.5" fill="#451a03" style={{ transform: hoofTrans }} />
          <rect x="4" y="16.5" width="2" height="6.5" fill="#451a03" />
          <rect x="8" y="16.5" width="2" height="6.5" fill="#451a03" style={{ transform: hoofTrans }} />

          {/* Head & Neck */}
          <g style={{ transformOrigin: '0px 12px', transform: headRot }}>
            <path d="M 0,8 L 6,-3 L 13,0 L 4,12 Z" fill="#b45309" stroke="#451a03" strokeWidth="1.8" />
            <polygon points="5,-3 8,-7 7,-3" fill="#78350f" />
            <polygon points="8,-2 10,-6 9,-2" fill="#78350f" />
            <circle cx="8.5" cy="1.5" r="1.5" fill="#fff" />
            <circle cx="9" cy="1.5" r="0.7" fill="#000" />
            <line x1="3" y1="3" x2="11" y2="3" stroke="#000" strokeWidth="1.2" />
          </g>
        </g>
      </g>
    );
  };

  const SVGLog = () => (
    <g transform="translate(0, -10) scale(1.3)">
      {/* Wood log cylinder */}
      <path d="M -18,-4 L 18,-4 A 6 6 0 0 1 18,8 L -18,8 A 6 6 0 0 1 -18,-4 Z" fill="url(#woodLog)" stroke="#451a03" strokeWidth="2.2" />
      
      {/* Cut ring surface on the left */}
      <ellipse cx="-18" cy="2" rx="4.5" ry="6" fill="#d97706" stroke="#451a03" strokeWidth="1.5" />
      <circle cx="-18" cy="2" r="1.5" fill="#78350f" />
      
      {/* Bark splits and moss details */}
      <line x1="-12" y1="-1" x2="12" y2="-1" stroke="#451a03" strokeWidth="1.2" />
      <line x1="-8" y1="5" x2="8" y2="5" stroke="#166534" strokeWidth="2.8" opacity="0.85" strokeLinecap="round" />
      
      {/* Twig with tiny green leaves */}
      <path d="M 6,-4 Q 10,-10 14,-8" fill="none" stroke="#451a03" strokeWidth="1.5" />
      <circle cx="14" cy="-8" r="2.2" fill="#22c55e" />
      <circle cx="10" cy="-9" r="1.8" fill="#4ade80" />
    </g>
  );

  const SVGBoulder = () => (
    <g transform="translate(0, -10) scale(1.3)">
      {/* Faceted 3D shading */}
      <polygon points="-16,4 0,-15 16,-5 12,12 -8,14" fill="#78716c" stroke="#292524" strokeWidth="2.5" />
      <polygon points="-16,4 0,-15 2,-4 -8,14" fill="#e2e8f0" stroke="#475569" strokeWidth="0.5" />
      <polygon points="0,-15 16,-5 2,-4" fill="#64748b" stroke="#334155" strokeWidth="0.5" />
      <polygon points="16,-5 12,12 2,-4" fill="#334155" stroke="#1e293b" strokeWidth="0.5" />
      
      {/* Moss patch */}
      <path d="M -8,-6 C -4,-11 4,-11 6,-5 C 2,-4 -4,-4 -8,-6 Z" fill="#15803d" opacity="0.85" />
      {/* Shading cracks */}
      <line x1="2" y1="-4" x2="2" y2="8" stroke="#1e293b" strokeWidth="1.5" opacity="0.4" />
    </g>
  );

  const SVGGate = () => (
    <g transform="translate(0, -38) scale(1.3)" className="overflow-visible">
      {/* Stone Pillars with brick texture */}
      <rect x="-38" y="-14" width="13" height="46" rx="2" fill="url(#pillarGrad)" stroke="#1c1917" strokeWidth="2.5" />
      <rect x="25" y="-14" width="13" height="46" rx="2" fill="url(#pillarGrad)" stroke="#1c1917" strokeWidth="2.5" />
      
      <line x1="-38" y1="2" x2="-25" y2="2" stroke="#1c1917" strokeWidth="1.5" />
      <line x1="-38" y1="18" x2="-25" y2="18" stroke="#1c1917" strokeWidth="1.5" />
      <line x1="25" y1="2" x2="38" y2="2" stroke="#1c1917" strokeWidth="1.5" />
      <line x1="25" y1="18" x2="38" y2="18" stroke="#1c1917" strokeWidth="1.5" />

      {/* Heavy wooden arch */}
      <path d="M -32,-10 Q 0,-36 32,-10" fill="none" stroke="#78350f" strokeWidth="7" strokeLinecap="round" />
      <path d="M -32,-10 Q 0,-36 32,-10" fill="none" stroke="url(#goldGrad)" strokeWidth="2.5" strokeDasharray="4,4" opacity="0.8" />

      {/* Two Hanging Burning Lanterns */}
      <g transform="translate(-25, -2)">
        <line x1="0" y1="-4" x2="0" y2="4" stroke="#000" strokeWidth="2" />
        <rect x="-3" y="4" width="6" height="9" fill="#fbbf24" stroke="#000" strokeWidth="1" className="animate-pulse" style={{ filter: 'drop-shadow(0 0 8px #fbbf24)' }} />
        <polygon points="0,2 -4,5 4,5" fill="#451a03" />
      </g>
      <g transform="translate(25, -2)">
        <line x1="0" y1="-4" x2="0" y2="4" stroke="#000" strokeWidth="2" />
        <rect x="-3" y="4" width="6" height="9" fill="#fbbf24" stroke="#000" strokeWidth="1" className="animate-pulse" style={{ filter: 'drop-shadow(0 0 8px #fbbf24)' }} />
        <polygon points="0,2 -4,5 4,5" fill="#451a03" />
      </g>

      {/* Green exit arrow */}
      <g transform="translate(0, 18)" className="animate-bounce">
        <path d="M -8,0 L 8,0 L 8,-4 L 14,2 L 8,8 L 8,4 L -8,4 Z" fill="#10b981" stroke="#064e3b" strokeWidth="1.5" style={{ filter: 'drop-shadow(0 0 10px #10b981)' }} />
      </g>

      {/* Smiling Gold Star as seen in reference image */}
      <g transform="translate(18, 18)" className="animate-spin" style={{ animationDuration: '4s' }}>
        <polygon points="0,-7 2.1,-2 7,-2 3.5,1 4.9,6 0,3 -4.9,6 -3.5,1 -7,-2 -2.1,-2" fill="url(#goldGrad)" stroke="#ca8a04" strokeWidth="1.2" />
        <circle cx="-1.8" cy="-1.5" r="0.8" fill="#000" />
        <circle cx="1.8" cy="-1.5" r="0.8" fill="#000" />
        <path d="M -1.8,1.5 Q 0,3.5 1.8,1.5" fill="none" stroke="#000" strokeWidth="0.8" strokeLinecap="round" />
      </g>
    </g>
  );

  return (
    <GameWrapper>
      <EffectLayer effects={effects} />

      <div className="w-full h-full relative select-none bg-neutral-950 overflow-hidden flex flex-col justify-between">
        
        {/* 1. MINIMAL HUD OVERLAY (TOP) */}
        <div className="absolute top-4 inset-x-4 flex justify-between items-center z-30 pointer-events-none">
          {/* Mission plaque */}
          <div className="px-5 py-2.5 rounded-2xl bg-neutral-900/90 border-2 border-amber-950/40 text-white shadow-xl pointer-events-auto flex items-center gap-3 backdrop-blur-md">
            <span className="text-xl">🚚</span>
            <div>
              <span className="pgf-fredoka text-xs text-amber-400 block uppercase tracking-wider">Mission</span>
              <span className="pgf-fredoka text-sm text-neutral-100 font-bold block">Merchant Caravan Rescue</span>
            </div>
          </div>

          {/* Time & Moves HUD */}
          <div className="flex gap-3 pointer-events-auto">
            {/* Timer */}
            <div className="px-5 py-2 rounded-2xl bg-neutral-900/95 border border-white/10 text-white shadow-lg flex items-center gap-2 backdrop-blur-md">
              <span className="text-amber-400 animate-pulse text-sm">⏱</span>
              <span className="pgf-fredoka text-md text-amber-300 font-black mt-0.5">{formatTime(timeLeft)}</span>
            </div>
            
            {/* Moves count */}
            <div className="px-5 py-2 rounded-2xl bg-neutral-900/95 border border-white/10 text-white shadow-lg flex items-center gap-2 backdrop-blur-md">
              <span className="pgf-fredoka text-xs text-neutral-400 uppercase tracking-wider block">Moves</span>
              <span className="pgf-fredoka text-md text-emerald-400 font-black mt-0.5">{moves} <span className="text-xs text-neutral-500">/ 20</span></span>
            </div>

            {/* Quick Restart control */}
            <button onClick={resetBoard} title="Reset patrol path"
              className="w-10 h-10 rounded-2xl border border-white/15 bg-neutral-900/95 hover:bg-neutral-800 flex items-center justify-center text-white text-md cursor-pointer active:scale-95 shadow-lg backdrop-blur-md transition-colors"
            >
              🔄
            </button>
          </div>
        </div>

        {/* 2. FULLSCREEN DIORAMA PLAY AREA */}
        <div className="w-full h-full relative z-10 flex items-center justify-center">
          
          <svg className="w-full h-full z-10" viewBox="0 0 780 430">
            <defs>
              {/* Stone gradients for road tiles */}
              <linearGradient id="stoneGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#78716c" />
                <stop offset="50%" stopColor="#57534e" />
                <stop offset="100%" stopColor="#44403c" />
              </linearGradient>
              <linearGradient id="stoneSideLeft" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#44403c" />
                <stop offset="100%" stopColor="#292524" />
              </linearGradient>
              <linearGradient id="stoneSideRight" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#292524" />
                <stop offset="100%" stopColor="#1c1917" />
              </linearGradient>

              {/* Water gradients */}
              <linearGradient id="waterGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#0284c7" />
                <stop offset="50%" stopColor="#0369a1" />
                <stop offset="100%" stopColor="#075985" />
              </linearGradient>

              {/* Grass meadow background gradient */}
              <linearGradient id="meadowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#14532d" />
                <stop offset="55%" stopColor="#166534" />
                <stop offset="100%" stopColor="#0f5127" />
              </linearGradient>

              {/* Gold shiny gradients */}
              <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fde047" />
                <stop offset="50%" stopColor="#eab308" />
                <stop offset="100%" stopColor="#ca8a04" />
              </linearGradient>
              
              {/* Wood logs gradient */}
              <linearGradient id="woodLog" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#78350f" />
                <stop offset="50%" stopColor="#92400e" />
                <stop offset="100%" stopColor="#78350f" />
              </linearGradient>

              {/* Stone pillar gradient */}
              <linearGradient id="pillarGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#78716c" />
                <stop offset="50%" stopColor="#a8a29e" />
                <stop offset="100%" stopColor="#57534e" />
              </linearGradient>

              {/* Soft sky sunset gradient */}
              <linearGradient id="skyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#fdba74" />
                <stop offset="100%" stopColor="#7c2d12" />
              </linearGradient>
            </defs>

            {/* 1. Scenery Backdrop (Forest meadow grass field) */}
            <rect x="0" y="0" width="780" height="430" fill="url(#meadowGrad)" />
            
            {/* Sunset sky header */}
            <rect x="0" y="0" width="780" height="55" fill="url(#skyGrad)" opacity="0.25" />

            {/* Curvy River / Stream decorative flow */}
            <path d="M 0,150 Q 80,180 140,160 T 260,200 T 360,250 T 480,240 T 600,320 T 780,340" 
              fill="none" stroke="url(#waterGrad)" strokeWidth="32" strokeLinecap="round" opacity="0.65" style={{ filter: 'blur(3px)' }} />

            {/* Tree Roots and Moss Details around background edges */}
            <g opacity="0.75">
              {/* Pine tree silhouettes */}
              <polygon points="40,65 55,25 70,65" fill="#022c22" />
              <polygon points="50,60 62,30 74,60" fill="#047857" />
              <polygon points="120,55 135,15 150,55" fill="#022c22" />
              
              <polygon points="630,70 645,35 660,70" fill="#022c22" />
              <polygon points="680,65 692,30 704,65" fill="#047857" />

              {/* Wooden fences */}
              <line x1="250" y1="50" x2="310" y2="70" stroke="#451a03" strokeWidth="3.5" />
              <line x1="250" y1="42" x2="310" y2="62" stroke="#451a03" strokeWidth="2" />
              <line x1="270" y1="40" x2="270" y2="65" stroke="#451a03" strokeWidth="3.5" />
              <line x1="295" y1="48" x2="295" y2="73" stroke="#451a03" strokeWidth="3.5" />

              <line x1="560" y1="360" x2="620" y2="380" stroke="#451a03" strokeWidth="3.5" />
              <line x1="580" y1="350" x2="580" y2="385" stroke="#451a03" strokeWidth="3.5" />
            </g>

            {/* Green entrance arrow pointing to the road start */}
            <g transform="translate(170, 95)" className="animate-bounce" style={{ filter: 'drop-shadow(0 0 8px #10b981)' }}>
              <path d="M -12,-4 L 4,-4 L 4,-10 L 16,-2 L 4,6 L 4,0 L -12,0 Z" fill="#10b981" stroke="#064e3b" strokeWidth="1.5" />
            </g>

            {/* Winding path cobblestone target line */}
            <path d="M 240,140 L 310,175 L 380,210 L 450,175 L 520,210 L 450,245 L 380,280 L 450,315 L 520,280 L 590,245 L 660,280"
              fill="none" stroke="#047857" strokeWidth="7" strokeLinecap="round" opacity="0.5" />
            <path d="M 240,140 L 310,175 L 380,210 L 450,175 L 520,210 L 450,245 L 380,280 L 450,315 L 520,280 L 590,245 L 660,280"
              fill="none" stroke="url(#goldGrad)" strokeWidth="3.5" strokeDasharray="12,12" strokeLinecap="round" opacity="0.85" className="animate-[pulse_1.5s_infinite]" />

            {/* Draw isometric grid tiles */}
            {Array.from({ length: 5 }).map((_, r) => (
              Array.from({ length: 6 }).map((_, c) => {
                const coords = getIsoCoords(r, c);
                const isPath = PATH.some(p => p.r === r && p.c === c);
                const isPit = PITS.some(p => p.r === r && p.c === c);
                const isGate = r === 1 && c === 5;
                
                if (isGate) {
                  return (
                    <g key={`${r}-${c}`} transform={`translate(${coords.x}, ${coords.y})`}>
                      <RoadTile x={0} y={0} />
                      <SVGGate />
                    </g>
                  );
                }
                if (isPath) {
                  return <RoadTile key={`${r}-${c}`} x={coords.x} y={coords.y} />;
                }
                if (isPit) {
                  const label = r === 3 ? 'MUD' : r === 0 ? 'GRASS' : 'SAND';
                  return <PitTile key={`${r}-${c}`} x={coords.x} y={coords.y} label={label} />;
                }
                
                const hasLotus = (r === 2 && c === 5) || (r === 3 && c === 0) || (r === 0 && c === 2);
                return <WaterTile key={`${r}-${c}`} x={coords.x} y={coords.y} hasLotus={hasLotus} />;
              })
            ))}

            {/* Render moving Wagon at calculated coords */}
            <g transform={`translate(${getIsoCoords(PATH[boatIndex].r, PATH[boatIndex].c).x}, ${getIsoCoords(PATH[boatIndex].r, PATH[boatIndex].c).y})`} className="transition-all duration-300 ease-out z-20">
              <SVGCaravanWagon stomping={stomp} shaking={shake} moving={won && boatIndex < PATH.length - 1} />
            </g>

            {/* Render Obstacles absolutely using translation coords */}
            {crates.map(c => {
              const coords = getIsoCoords(c.r, c.c);
              return (
                <g key={c.id} transform={`translate(${coords.x}, ${coords.y})`} onClick={() => handleCrateClick(c.id)}
                  className="cursor-pointer transition-all duration-300 ease-out hover:scale-105 active:scale-95"
                >
                  {c.id === 1 && <SVGLog />}
                  {c.id === 2 && <SVGBoulder />}
                  {c.id === 3 && <SVGCrate />}
                </g>
              );
            })}

            {/* Dust clouds success particles */}
            {dustClouds.map(d => (
              <circle key={d.id} cx={d.x} cy={d.y} r="4" fill="#ffffff" opacity="0.6" className="animate-[ping_0.8s_ease-out_infinite]" />
            ))}

            {/* Flying birds fleeing from trees */}
            {birds.map(b => (
              <g key={b.id} transform={`translate(${b.x}, ${b.y})`} className="animate-[floatUp_3s_ease-out_both]" style={{ animationDelay: `${b.delay}s` }}>
                <path d="M -4,-2 L 0,2 L 4,-2 M -4,-2 L -1,1 M 4,-2 L 1,1" fill="none" stroke="#292524" strokeWidth="1.5" />
              </g>
            ))}
          </svg>

          {/* HUD Mini Map in Bottom Right overlay */}
          <div className="absolute bottom-4 right-4 w-[125px] h-[95px] bg-neutral-950/85 backdrop-blur-md border-2 border-amber-500/35 rounded-2xl p-2 z-30 shadow-[0_8px_16px_rgba(0,0,0,0.85)] flex flex-col justify-between select-none">
            <span className="pgf-fredoka text-[7.5px] uppercase tracking-widest text-amber-400 block text-center mb-0.5">CARAVAN RADAR</span>
            
            <div className="flex-1 bg-black/60 rounded-xl relative border border-white/5 p-1 overflow-hidden">
              <svg className="w-full h-full" viewBox="0 0 100 80">
                {/* Grid Lines background */}
                <line x1="0" y1="20" x2="100" y2="20" stroke="#ffffff" strokeWidth="0.5" opacity="0.05" />
                <line x1="0" y1="40" x2="100" y2="40" stroke="#ffffff" strokeWidth="0.5" opacity="0.05" />
                <line x1="0" y1="60" x2="100" y2="60" stroke="#ffffff" strokeWidth="0.5" opacity="0.05" />
                
                {/* 2D path wireframe */}
                <path d="M 12,48 L 28,48 L 44,48 L 44,28 L 60,28 L 60,48 L 60,68 L 76,68 L 76,48 L 76,28 L 92,28" 
                  fill="none" stroke="#34d399" strokeWidth="2.5" strokeLinecap="round" opacity="0.8" />
                
                {/* Current Position Indicator */}
                {(() => {
                  const currentTile = PATH[boatIndex];
                  const mapX = 12 + currentTile.c * 16;
                  const mapY = 12 + currentTile.r * 13;
                  return (
                    <g>
                      <circle cx={mapX} cy={mapY} r="5" fill="#34d399" className="animate-ping" />
                      <circle cx={mapX} cy={mapY} r="3" fill="#4ade80" stroke="#fff" strokeWidth="1" />
                    </g>
                  );
                })()}

                {/* Destination Golden Star */}
                <g transform={`translate(${12 + 5 * 16}, ${12 + 1 * 13})`}>
                  <polygon points="0,-4 1.2,-1 4.5,-1 1.8,1 2.8,4 0,2 -2.8,4 -1.8,1 -4.5,-1 -1.2,-1" fill="#fbbf24" stroke="#d97706" strokeWidth="0.5" className="animate-pulse" />
                </g>
              </svg>
            </div>
          </div>
        </div>
      </div>

      {won && <WinBanner message="CARAVAN RESCUED!" score={score} />}
    </GameWrapper>
  );
}
