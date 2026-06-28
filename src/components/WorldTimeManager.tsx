/**
 * WorldTimeManager
 * ─────────────────
 * • Refreshes global worldTime from the real clock every 60 s.
 * • Plays subtle location-aware ambient sounds via Web Audio API
 *   (no external audio files needed — synthesised tones).
 * • Renders a slim floating time-of-day badge (top-right corner).
 */

import React, { useEffect, useRef, useCallback, useState } from 'react';
import { useTTStore, LOCATION_AMBIENT } from '../store/useTTStore';
import type { AmbientKey } from '../store/useTTStore';
import { getChocoDate } from '../utils/chocoCalendar';

// ─── Ambient Sound Synthesiser ───────────────────────────────────────────────
// We use Web Audio oscillators / noise to produce 5-second looped ambient clips.
// These are very quiet (gain ~0.04) so they never distract.

type SoundSource = {
  nodes: AudioNode[];
  gain: GainNode;
};

function buildAmbientSound(ctx: AudioContext, key: AmbientKey): SoundSource | null {
  if (key === 'none') return null;

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0, ctx.currentTime);
  gain.connect(ctx.destination);

  const nodes: AudioNode[] = [gain];

  if (key === 'birds') {
    // Layered high-freq chirps using FM synthesis
    const createChirp = (freq: number, offset: number) => {
      const carrier = ctx.createOscillator();
      const mod = ctx.createOscillator();
      const modGain = ctx.createGain();
      const env = ctx.createGain();

      carrier.type = 'sine';
      carrier.frequency.setValueAtTime(freq, ctx.currentTime);
      mod.type = 'sine';
      mod.frequency.setValueAtTime(freq * 2.5, ctx.currentTime);
      modGain.gain.setValueAtTime(60, ctx.currentTime);

      mod.connect(modGain);
      modGain.connect(carrier.frequency);
      carrier.connect(env);
      env.connect(gain);

      env.gain.setValueAtTime(0, ctx.currentTime + offset);
      env.gain.linearRampToValueAtTime(0.35, ctx.currentTime + offset + 0.05);
      env.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + offset + 0.4);

      mod.start(ctx.currentTime + offset);
      carrier.start(ctx.currentTime + offset);
      mod.stop(ctx.currentTime + offset + 0.5);
      carrier.stop(ctx.currentTime + offset + 0.5);

      nodes.push(carrier, mod, modGain, env);
    };

    createChirp(1800, 0.1);
    createChirp(2100, 0.7);
    createChirp(1600, 1.5);
    createChirp(2200, 2.3);
    createChirp(1900, 3.5);
  }

  if (key === 'hammering') {
    // Percussive thud with low rumble
    const createThud = (offset: number) => {
      const osc = ctx.createOscillator();
      const env = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(120, ctx.currentTime + offset);
      osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + offset + 0.15);
      env.gain.setValueAtTime(0.5, ctx.currentTime + offset);
      env.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + offset + 0.2);
      osc.connect(env);
      env.connect(gain);
      osc.start(ctx.currentTime + offset);
      osc.stop(ctx.currentTime + offset + 0.25);
      nodes.push(osc, env);
    };
    createThud(0.2);
    createThud(0.6);
    createThud(1.4);
    createThud(1.8);
    createThud(2.8);
  }

  if (key === 'water') {
    // Pink-noise style water using multiple oscillators + filter
    const bufferSize = ctx.sampleRate * 2;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      data[i] = (b0 + b1 + b2) * 0.11;
    }
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(800, ctx.currentTime);
    filter.Q.setValueAtTime(0.5, ctx.currentTime);
    source.connect(filter);
    filter.connect(gain);
    source.start();
    nodes.push(source, filter);
  }

  if (key === 'applause' || key === 'crowd') {
    // White noise burst shaping to simulate crowd murmur
    const bufferSize = ctx.sampleRate * 3;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.3;
    }
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(key === 'applause' ? 3000 : 1200, ctx.currentTime);
    source.connect(filter);
    filter.connect(gain);
    source.start();
    nodes.push(source, filter);
  }

  if (key === 'train-bell') {
    // A sine bell at ~880 Hz with decay
    const createBell = (offset: number) => {
      const osc = ctx.createOscillator();
      const env = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime + offset);
      env.gain.setValueAtTime(0.6, ctx.currentTime + offset);
      env.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + offset + 1.5);
      osc.connect(env);
      env.connect(gain);
      osc.start(ctx.currentTime + offset);
      osc.stop(ctx.currentTime + offset + 1.6);
      nodes.push(osc, env);
    };
    createBell(0.0);
    createBell(0.25);
    createBell(0.5);
    createBell(3.0);
  }

  if (key === 'crickets') {
    // High-frequency rapid oscillation — night crickets
    const createCricket = (freq: number, offset: number) => {
      const osc = ctx.createOscillator();
      const am = ctx.createOscillator();
      const amGain = ctx.createGain();
      const env = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + offset);
      am.type = 'sine';
      am.frequency.setValueAtTime(30, ctx.currentTime + offset);
      amGain.gain.setValueAtTime(0.5, ctx.currentTime + offset);

      am.connect(amGain);
      amGain.connect(env.gain);
      osc.connect(env);
      env.connect(gain);
      env.gain.setValueAtTime(0.3, ctx.currentTime + offset);

      am.start(ctx.currentTime + offset);
      osc.start(ctx.currentTime + offset);
      am.stop(ctx.currentTime + offset + 2);
      osc.stop(ctx.currentTime + offset + 2);
      nodes.push(osc, am, amGain, env);
    };
    createCricket(4200, 0.1);
    createCricket(4400, 0.5);
    createCricket(4100, 1.5);
    createCricket(4300, 2.5);
  }

  return { nodes, gain };
}

// ─── Sky overlay colours per phase ───────────────────────────────────────────
const SKY_STYLES: Record<string, { bg: string; border: string; text: string; glow: string }> = {
  morning:   { bg: 'from-amber-400/20 to-orange-300/10', border: 'border-amber-400/40', text: 'text-amber-200', glow: 'shadow-amber-400/30' },
  afternoon: { bg: 'from-sky-400/15 to-blue-300/10',    border: 'border-sky-400/40',   text: 'text-sky-200',   glow: 'shadow-sky-400/30'   },
  sunset:    { bg: 'from-orange-500/25 to-rose-500/15',  border: 'border-orange-400/50', text: 'text-orange-200', glow: 'shadow-orange-500/40' },
  night:     { bg: 'from-indigo-900/35 to-violet-900/20', border: 'border-indigo-400/30', text: 'text-indigo-200', glow: 'shadow-indigo-400/25' },
};

// ─── Component ────────────────────────────────────────────────────────────────
interface Props {
  currentSubPage: string;
  /** Whether to show the floating time badge */
  showBadge?: boolean;
}

export const WorldTimeManager: React.FC<Props> = ({ currentSubPage, showBadge = true }) => {
  const worldTime = useTTStore(state => state.worldTime);
  const refreshWorldTime = useTTStore(state => state.refreshWorldTime);
  const [ambientEnabled, setAmbientEnabled] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  const ctxRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<SoundSource | null>(null);
  const ambientKeyRef = useRef<AmbientKey>('none');

  // ── Tick world time every minute ──
  useEffect(() => {
    const id = setInterval(refreshWorldTime, 60_000);
    return () => clearInterval(id);
  }, [refreshWorldTime]);

  // ── Fade helpers ──
  const fadeOut = useCallback((src: SoundSource, duration = 1.5) => {
    if (!ctxRef.current) return;
    const now = ctxRef.current.currentTime;
    src.gain.gain.cancelScheduledValues(now);
    src.gain.gain.setValueAtTime(src.gain.gain.value, now);
    src.gain.gain.linearRampToValueAtTime(0, now + duration);
  }, []);

  const fadeIn = useCallback((src: SoundSource, targetGain = 0.04, duration = 2) => {
    if (!ctxRef.current) return;
    const now = ctxRef.current.currentTime;
    src.gain.gain.cancelScheduledValues(now);
    src.gain.gain.setValueAtTime(0, now);
    src.gain.gain.linearRampToValueAtTime(targetGain, now + duration);
  }, []);

  // ── Switch ambient when location changes ──
  const switchAmbient = useCallback(
    async (newKey: AmbientKey) => {
      if (!ambientEnabled) return;
      if (newKey === ambientKeyRef.current) return;

      // Ensure AudioContext exists (must be created after user gesture)
      if (!ctxRef.current) {
        ctxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }

      const ctx = ctxRef.current;
      if (ctx.state === 'suspended') await ctx.resume();

      // Fade out old
      if (sourceRef.current) {
        const old = sourceRef.current;
        fadeOut(old, 1);
        setTimeout(() => {
          old.nodes.forEach((n) => {
            try { (n as any).stop?.(); } catch (e) { /* ignore stop errors */ }
            try { n.disconnect(); } catch (e) { /* ignore disconnect errors */ }
          });
        }, 1600);
        sourceRef.current = null;
      }

      ambientKeyRef.current = newKey;

      // Build new sound
      const newSrc = buildAmbientSound(ctx, newKey);
      if (newSrc) {
        sourceRef.current = newSrc;
        fadeIn(newSrc, 0.04, 2);
      }
    },
    [ambientEnabled, fadeOut, fadeIn]
  );

  // Watch for location changes
  useEffect(() => {
    const key: AmbientKey = LOCATION_AMBIENT[currentSubPage] ?? 'none';
    switchAmbient(key);
  }, [currentSubPage, switchAmbient]);

  // When ambient toggled ON, start current location's sound
  useEffect(() => {
    if (ambientEnabled) {
      ambientKeyRef.current = 'none'; // force a switch
      const key: AmbientKey = LOCATION_AMBIENT[currentSubPage] ?? 'none';
      switchAmbient(key);
    } else {
      // Fade out and kill context
      if (sourceRef.current) {
        fadeOut(sourceRef.current, 0.8);
        setTimeout(() => {
          try { ctxRef.current?.close(); } catch (e) { /* ignore context close errors */ }
          ctxRef.current = null;
          sourceRef.current = null;
          ambientKeyRef.current = 'none';
        }, 1000);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ambientEnabled]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      try { ctxRef.current?.close(); } catch (e) { /* ignore close errors */ }
    };
  }, []);

  if (!showBadge) return null;

  const style = SKY_STYLES[worldTime.skyGradient] || SKY_STYLES.morning;
  const ambientLabel = LOCATION_AMBIENT[currentSubPage] ?? 'none';
  const chocoDate = getChocoDate();

  return (
    <div
      className="relative"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {/* ── Time Badge ── */}
      <button
        onClick={() => setAmbientEnabled(!ambientEnabled)}
        className={`
          flex items-center gap-2 px-3 py-1.5 rounded-2xl
          bg-gradient-to-r ${style.bg}
          border ${style.border}
          shadow-lg ${style.glow}
          transition-all duration-500 cursor-pointer
          hover:scale-105 active:scale-95
        `}
        title="Toggle ambient town sounds"
      >
        <span className="text-base leading-none">{worldTime.emoji}</span>
        <div className="flex flex-col items-start leading-none">
          <span className={`text-[10px] font-black uppercase tracking-wider ${style.text}`}>
            {chocoDate.month} {chocoDate.day}
          </span>
          <span className="text-[9px] text-white/50 font-mono mt-0.5">
            {chocoDate.timeBell}
          </span>
        </div>
        <span className={`text-[11px] transition-all ${ambientEnabled ? 'opacity-100' : 'opacity-30'}`}>
          🔔
        </span>
      </button>

      {/* ── Tooltip ── */}
      {showTooltip && (
        <div className="absolute top-full right-0 mt-2 w-60 z-[500] animate-fade-in">
          <div className="bg-black/60 border border-white/10 rounded-2xl p-3.5 text-[10px] text-white/80 space-y-2 shadow-2xl">
            <div className="text-white font-bold text-[11px] mb-2 border-b border-white/10 pb-1 flex justify-between items-center">
              <span>🌍 ChocoBrook Time</span>
              <span className="text-[9px] text-amber-400">{chocoDate.weekday}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/55">Era:</span>
              <span className="text-white font-bold">{chocoDate.era}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/55">Year:</span>
              <span className="text-amber-300 font-bold">{chocoDate.yearText}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/55">Season:</span>
              <span className="text-orange-300 font-bold">{chocoDate.seasonName} ({chocoDate.season})</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/55">Pulse:</span>
              <span className="text-cyan-300 font-bold">{chocoDate.pulse}</span>
            </div>
            <div className="border-t border-white/10 pt-2 mt-1 space-y-1.5">
              <div className="flex justify-between">
                <span className="text-white/55">Theatre:</span>
                <span className={worldTime.isTheatreOpen ? 'text-emerald-400 font-bold' : 'text-red-400'}>
                  {worldTime.isTheatreOpen ? '🎭 Open' : '🔒 Closed'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/55">Clinic:</span>
                <span className={worldTime.isClinicOpen ? 'text-emerald-400 font-bold' : 'text-red-400'}>
                  {worldTime.isClinicOpen ? '🏥 Open' : '🔒 Closed'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/55">Market:</span>
                <span className={worldTime.isMarketBusy ? 'text-amber-400 font-bold' : 'text-white/60'}>
                  {worldTime.isMarketBusy ? '🛒 Busy!' : '🛒 Quiet'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/55">Ambient:</span>
                <span className="text-cyan-400 font-bold capitalize">{ambientLabel}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
