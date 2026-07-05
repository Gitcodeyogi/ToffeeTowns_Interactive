import React, { useEffect, useRef, useState } from 'react';

interface AdventureWorldProps {
  onClose: () => void;
}

// ── Physics Constants (Logical 1000x562 space) ──
const GRAVITY = 0.5;
const WALK_SPEED = 4.0;
const JUMP_FORCE = -13;

interface Platform {
  x: number;
  y: number;
  w: number;
  h: number;
}

interface Coin {
  x: number;
  y: number;
  collected: boolean;
}

export const AdventureWorld: React.FC<AdventureWorldProps> = ({ onClose }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const animationFrameId = useRef<number | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // ── RPG State ──
  const [coins, setCoins] = useState<number>(1280);
  const [stars] = useState<number>(3);
  const [xp, setXp] = useState<number>(1250);
  const [hearts, setHearts] = useState<number>(3);
  const [level, setLevel] = useState<number>(12);
  const [activeModal, setActiveModal] = useState<'backpack' | 'map' | 'quests' | 'settings' | 'gameover' | null>(null);
  const [timeOfDay, setTimeOfDay] = useState<string>('07:45 AM');

  // Interactive chests
  const [chest1Opened, setChest1Opened] = useState<boolean>(false);
  const [chest2Opened, setChest2Opened] = useState<boolean>(false);

  // Character & Background Image Loading
  const characterImgRef = useRef<HTMLImageElement | null>(null);
  const bg1ImgRef = useRef<HTMLImageElement | null>(null);
  const bg2ImgRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    const imgChar = new Image();
    imgChar.src = '/Assets/yogesh_character.png';
    imgChar.onload = () => {
      characterImgRef.current = imgChar;
    };

    const imgBg1 = new Image();
    imgBg1.src = '/Assets/Ganache Grove/Games/Images/Game_Scene_01.png';
    imgBg1.onload = () => {
      bg1ImgRef.current = imgBg1;
    };

    const imgBg2 = new Image();
    imgBg2.src = '/Assets/Ganache Grove/Games/Images/Game_Scene_02.png';
    imgBg2.onload = () => {
      bg2ImgRef.current = imgBg2;
    };
  }, []);

  // Keys pressed
  const keys = useRef<{ [key: string]: boolean }>({});

  // Camera X position for smooth scrolling (Logical 1000 width per scene)
  const cameraX = useRef<number>(0);

  // ── Playable Character (scaled up to be prominent and detailed) ──
  const player = useRef({
    x: 280, // Start right next to the "Welcome to Toffee Town" signpost
    y: 200,
    vx: 0,
    vy: 0,
    w: 64,  // Increased width
    h: 140, // Increased height
    isGrounded: false,
    facing: 1, // 1 = right, -1 = left
  });

  // Platforms matching the visual layout of Scene 1 and Scene 2 (Logical 1000x562 space)
  const platforms = useRef<Platform[]>([
    // ── SCENE 1 PLATFORMS (X: 0 to 1000) ──
    // Left Ground (under the signpost)
    { x: 0, y: 500, w: 230, h: 20 },
    // Elevated Bridge (where the cabin sits)
    { x: 390, y: 256, w: 610, h: 15 },
    // Bottom-Right Grass (under the bridge)
    { x: 670, y: 500, w: 330, h: 20 },
    // Cabin Bench (for sitting/standing)
    { x: 805, y: 228, w: 110, h: 10 },

    // ── SCENE 2 PLATFORMS (X: 1000 to 2000) ──
    // Continuing Ground from Scene 1
    { x: 1000, y: 500, w: 420, h: 20 },
    // Middle Elevated Branch / Ledge
    { x: 1160, y: 355, w: 320, h: 15 },
    // High Forest Canopy Platform
    { x: 1520, y: 230, w: 320, h: 15 },
    // Right Exit Ground
    { x: 1800, y: 470, w: 200, h: 20 },
  ]);

  // Spinning Gold Coins distributed across both scenes
  const coinsList = useRef<Coin[]>([
    // Scene 1 Coins
    { x: 280, y: 380, collected: false },
    { x: 360, y: 330, collected: false },
    { x: 480, y: 200, collected: false },
    { x: 560, y: 200, collected: false },
    // Scene 2 Coins
    { x: 1220, y: 290, collected: false },
    { x: 1300, y: 290, collected: false },
    { x: 1580, y: 170, collected: false },
    { x: 1660, y: 170, collected: false },
  ]);

  // Dynamic time-of-day clock
  useEffect(() => {
    let hour = 7;
    let minute = 45;
    const interval = setInterval(() => {
      minute += 1;
      if (minute >= 60) {
        minute = 0;
        hour += 1;
        if (hour > 12) hour = 1;
      }
      const ampm = hour >= 7 && hour < 12 ? 'AM' : 'PM';
      const mStr = minute < 10 ? `0${minute}` : minute;
      const hStr = hour < 10 ? `0${hour}` : hour;
      setTimeOfDay(`${hStr}:${mStr} ${ampm}`);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  // Sound Synthesizer
  const playSound = (type: 'jump' | 'coin' | 'fanfare' | 'hurt') => {
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') ctx.resume();

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === 'jump') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(150, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.12);
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.12);
        osc.start();
        osc.stop(ctx.currentTime + 0.12);
      } else if (type === 'coin') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
        osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.08); // E5
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);
        osc.start();
        osc.stop(ctx.currentTime + 0.25);
      } else if (type === 'fanfare') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(261.63, ctx.currentTime); // C4
        osc.frequency.setValueAtTime(329.63, ctx.currentTime + 0.1); // E4
        osc.frequency.setValueAtTime(392.00, ctx.currentTime + 0.2); // G4
        osc.frequency.setValueAtTime(523.25, ctx.currentTime + 0.3); // C5
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.6);
        osc.start();
        osc.stop(ctx.currentTime + 0.6);
      } else if (type === 'hurt') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(120, ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(60, ctx.currentTime + 0.25);
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);
        osc.start();
        osc.stop(ctx.currentTime + 0.25);
      }
    } catch (e) {
      console.warn(e);
    }
  };

  // Keyboard Event Listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keys.current[e.key.toLowerCase()] = true;
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keys.current[e.key.toLowerCase()] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Main Render & Physics Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const updateAndRender = () => {
      const time = Date.now() * 0.005;
      const p = player.current;

      // Dynamic resize of canvas to fill the glass panel container
      const container = containerRef.current;
      if (container) {
        const rect = container.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;
        if (canvas.width !== rect.width * dpr || canvas.height !== rect.height * dpr) {
          canvas.width = rect.width * dpr;
          canvas.height = rect.height * dpr;
        }
      }

      // ── 1. UPDATE PHYSICS ──
      if (keys.current['a'] || keys.current['arrowleft']) {
        p.vx = -WALK_SPEED;
        p.facing = -1;
      } else if (keys.current['d'] || keys.current['arrowright']) {
        p.vx = WALK_SPEED;
        p.facing = 1;
      } else {
        p.vx = 0;
      }

      // Jump
      if ((keys.current['w'] || keys.current[' '] || keys.current['arrowup']) && p.isGrounded) {
        p.vy = JUMP_FORCE;
        p.isGrounded = false;
        playSound('jump');
      }

      // Apply Gravity
      p.vy += GRAVITY;
      p.x += p.vx;
      p.y += p.vy;

      // Clamp player inside entire 2-Scene world boundaries (0 to 2000)
      if (p.x < 0) p.x = 0;
      if (p.x > 2000 - p.w) p.x = 2000 - p.w;
      
      // Fall off screen (Damage & Respawn)
      if (p.y > 562) {
        playSound('hurt');
        setHearts(prev => {
          const next = prev - 1;
          if (next <= 0) {
            setActiveModal('gameover');
            return 3;
          }
          return next;
        });
        p.x = 280;
        p.y = 200;
        p.vy = 0;
      }

      // Platform & Slope Collisions
      p.isGrounded = false;

      // A. Check sloped cobblestone path in Scene 1 (X: 140 to 440)
      if (p.x >= 140 && p.x <= 440) {
        const slopeY = 500 - (p.x - 140) * 0.52 - p.h;
        // Snap to slope if close and not jumping (moving upwards)
        if (p.vy >= 0 && Math.abs(p.y - slopeY) < 12) {
          p.y = slopeY;
          p.vy = 0;
          p.isGrounded = true;
        }
      }

      // B. Check standard horizontal platforms
      platforms.current.forEach(plat => {
        if (
          p.x + p.w > plat.x &&
          p.x < plat.x + plat.w &&
          p.y + p.h >= plat.y &&
          p.y + p.h - p.vy <= plat.y + 6 &&
          p.vy >= 0
        ) {
          p.y = plat.y - p.h;
          p.vy = 0;
          p.isGrounded = true;
        }
      });

      // Coin Collisions
      coinsList.current.forEach(coin => {
        if (!coin.collected) {
          const dx = Math.abs((p.x + p.w / 2) - coin.x);
          const dy = Math.abs((p.y + p.h / 2) - coin.y);
          if (dx < 32 && dy < 70) {
            coin.collected = true;
            playSound('coin');
            setCoins(prev => prev + 10);
            setXp(prev => {
              const nextXp = prev + 50;
              if (nextXp >= 2500) {
                setLevel(l => l + 1);
                return nextXp - 2500;
              }
              return nextXp;
            });
          }
        }
      });

      // Chest 1 Collision (Scene 1)
      const chest1X = 950;
      const distToChest1 = Math.abs((p.x + p.w / 2) - chest1X);
      const isNearChest1 = distToChest1 < 40 && p.y > 100 && p.y < 260;
      if (keys.current['e'] && isNearChest1 && !chest1Opened) {
        setChest1Opened(true);
        playSound('fanfare');
        setCoins(prev => prev + 150);
        setXp(prev => {
          const nextXp = prev + 300;
          if (nextXp >= 2500) {
            setLevel(l => l + 1);
            return nextXp - 2500;
          }
          return nextXp;
        });
      }

      // Chest 2 Collision (Scene 2)
      const chest2X = 1680;
      const distToChest2 = Math.abs((p.x + p.w / 2) - chest2X);
      const isNearChest2 = distToChest2 < 40 && p.y > 100 && p.y < 230;
      if (keys.current['e'] && isNearChest2 && !chest2Opened) {
        setChest2Opened(true);
        playSound('fanfare');
        setCoins(prev => prev + 250);
        setXp(prev => {
          const nextXp = prev + 400;
          if (nextXp >= 2500) {
            setLevel(l => l + 1);
            return nextXp - 2500;
          }
          return nextXp;
        });
      }

      // ── SMOOTH SCROLLING CAMERA ──
      // Target camera centers on player, clamped between 0 and 1000
      const targetCamX = Math.max(0, Math.min(1000, p.x - 500));
      cameraX.current += (targetCamX - cameraX.current) * 0.08;

      // ── 2. RENDERING ──
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Apply universal resolution scaling (Logical 1000x562 space)
      ctx.save();
      ctx.scale(canvas.width / 1000, canvas.height / 562);

      // Translate camera
      ctx.save();
      ctx.translate(-cameraX.current, 0);

      // Draw Scene 1 Background
      if (bg1ImgRef.current) {
        ctx.drawImage(bg1ImgRef.current, 0, 0, 1000, 562);
      }
      
      // Draw Scene 2 Background
      if (bg2ImgRef.current) {
        ctx.drawImage(bg2ImgRef.current, 1000, 0, 1000, 562);
      }

      // Draw Coins
      coinsList.current.forEach(coin => {
        if (!coin.collected) {
          ctx.save();
          ctx.translate(coin.x, coin.y);
          const scaleX = Math.abs(Math.sin(time * 3));
          ctx.scale(scaleX, 1);

          ctx.fillStyle = '#fbbf24';
          ctx.beginPath();
          ctx.arc(0, 0, 10, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = '#d97706';
          ctx.beginPath();
          ctx.arc(0, 0, 6, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(0, 0, 3, 0, Math.PI * 2);
          ctx.fill();

          ctx.restore();
        }
      });

      // Draw Treasure Chest 1 (Scene 1)
      ctx.save();
      ctx.translate(950, 256);
      if (!chest1Opened) {
        ctx.fillStyle = '#78350f';
        ctx.fillRect(-18, -24, 36, 24);
        ctx.fillStyle = '#b45309';
        ctx.fillRect(-15, -21, 30, 18);
        ctx.fillStyle = '#fbbf24';
        ctx.fillRect(-12, -24, 4, 24);
        ctx.fillRect(8, -24, 4, 24);
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(-3, -11, 6, 6);
      } else {
        ctx.fillStyle = '#78350f';
        ctx.fillRect(-18, -12, 36, 12);
        ctx.fillStyle = '#fbbf24';
        ctx.fillRect(-15, -14, 30, 4);
        ctx.fillStyle = '#b45309';
        ctx.fillRect(-18, -26, 36, 10);
        ctx.fillStyle = '#fbbf24';
        ctx.fillRect(-12, -26, 4, 10);
        ctx.fillRect(8, -26, 4, 10);
      }
      ctx.restore();

      // Draw Treasure Chest 2 (Scene 2)
      ctx.save();
      ctx.translate(1680, 230);
      if (!chest2Opened) {
        ctx.fillStyle = '#78350f';
        ctx.fillRect(-18, -24, 36, 24);
        ctx.fillStyle = '#b45309';
        ctx.fillRect(-15, -21, 30, 18);
        ctx.fillStyle = '#fbbf24';
        ctx.fillRect(-12, -24, 4, 24);
        ctx.fillRect(8, -24, 4, 24);
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(-3, -11, 6, 6);
      } else {
        ctx.fillStyle = '#78350f';
        ctx.fillRect(-18, -12, 36, 12);
        ctx.fillStyle = '#fbbf24';
        ctx.fillRect(-15, -14, 30, 4);
        ctx.fillStyle = '#b45309';
        ctx.fillRect(-18, -26, 36, 10);
        ctx.fillStyle = '#fbbf24';
        ctx.fillRect(-12, -26, 4, 10);
        ctx.fillRect(8, -26, 4, 10);
      }
      ctx.restore();

      // Chest 1 Proximity Prompt
      if (isNearChest1 && !chest1Opened) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
        ctx.beginPath();
        ctx.roundRect(900, 170, 100, 20, 5);
        ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 8px sans-serif';
        ctx.fillText('Press [E] to Open', 912, 182);
      }

      // Chest 2 Proximity Prompt
      if (isNearChest2 && !chest2Opened) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
        ctx.beginPath();
        ctx.roundRect(1630, 150, 100, 20, 5);
        ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 8px sans-serif';
        ctx.fillText('Press [E] to Open', 1642, 162);
      }

      // Draw Playable Character Cutout (scaled up to be prominent)
      if (characterImgRef.current) {
        ctx.save();
        ctx.translate(p.x + p.w / 2, p.y + p.h / 2);
        ctx.scale(p.facing, 1);

        const isWalking = Math.abs(p.vx) > 0.1;
        const bob = isWalking ? Math.abs(Math.sin(time * 12)) * 5 : 0;
        const tilt = isWalking ? Math.sin(time * 12) * 0.04 : 0;
        ctx.rotate(tilt);

        ctx.drawImage(
          characterImgRef.current,
          -p.w / 2,
          -p.h / 2 + 20 + bob,
          p.w,
          p.h
        );

        ctx.restore();
      }

      ctx.restore(); // Restore camera translation
      ctx.restore(); // Restore resolution scaling

      animationFrameId.current = requestAnimationFrame(updateAndRender);
    };

    updateAndRender();

    return () => {
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
    };
  }, [chest1Opened, chest2Opened]);

  // Touch controls helpers
  const handlePressLeft = (active: boolean) => { keys.current['a'] = active; };
  const handlePressRight = (active: boolean) => { keys.current['d'] = active; };
  const handlePressJump = () => {
    if (player.current.isGrounded) {
      player.current.vy = JUMP_FORCE;
      player.current.isGrounded = false;
      playSound('jump');
    }
  };

  return (
    <div ref={containerRef} className="fixed inset-0 w-screen h-screen z-[9999] overflow-hidden font-sans bg-[#070b05]">
      
      {/* ── FULLSCREEN BACKGROUND CANVAS ── */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />

      {/* ── TOP HUD NAVIGATION BAR (Floating) ── */}
      <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10 select-none">
        
        {/* Left: Player Profile Card */}
        <div className="flex items-center gap-3 p-2.5 rounded-3xl bg-black/50 backdrop-blur-md border border-white/10 shadow-lg">
          {/* Avatar frame */}
          <div className="w-11 h-11 rounded-full border-2 border-amber-400 overflow-hidden bg-emerald-950 flex items-center justify-center">
            {characterImgRef.current ? (
              <img src="/Assets/yogesh_character.png" className="w-full h-full object-cover object-top scale-110" alt="Yogesh" />
            ) : (
              <span className="text-xl">👦</span>
            )}
          </div>
          {/* Stats info */}
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black tracking-wide text-white">Yogesh</span>
              <div className="flex gap-0.5 text-xs text-red-500">
                {Array.from({ length: 3 }).map((_, i) => (
                  <span key={i}>{i < hearts ? '❤️' : '🖤'}</span>
                ))}
              </div>
            </div>
            
            {/* Rank / Badge */}
            <div className="flex items-center gap-2 mt-1">
              <span className="px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-wider bg-purple-600/40 text-purple-200 border border-purple-500/30">
                Master Builder
              </span>
            </div>
          </div>
        </div>

        {/* Currency Display (Coins & Stars) */}
        <div className="flex items-center gap-3 p-2.5 rounded-3xl bg-black/50 backdrop-blur-md border border-white/10 shadow-lg text-xs font-black">
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-400">
            <span>🪙</span>
            <span>{coins}</span>
          </div>
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-xl bg-sky-500/20 border border-sky-500/30 text-sky-300">
            <span>⭐</span>
            <span>{stars}/5</span>
          </div>
        </div>

        {/* Center Title: Location Badge */}
        <div className="px-5 py-2 rounded-2xl bg-gradient-to-r from-emerald-900/90 to-emerald-950/90 border border-emerald-500/40 text-xs font-black uppercase tracking-widest text-emerald-300 flex items-center gap-2 shadow-lg">
          <span>🌿</span>
          <span>Mossberry Woods</span>
          <span>🌿</span>
        </div>

        {/* Right: Menu Buttons */}
        <div className="flex items-center gap-2">
          {[
            { id: 'backpack', label: 'Backpack', icon: '🎒' },
            { id: 'map', label: 'Map', icon: '🗺️' },
            { id: 'quests', label: 'Quests', icon: '📜' },
            { id: 'settings', label: 'Settings', icon: '⚙️' },
          ].map(btn => (
            <button
              key={btn.id}
              onClick={() => setActiveModal(btn.id as any)}
              className="w-10 h-10 flex flex-col items-center justify-center rounded-2xl bg-black/50 hover:bg-white/15 border border-white/10 hover:border-white/20 transition cursor-pointer active:scale-95 shadow-lg"
              title={btn.label}
            >
              <span className="text-lg">{btn.icon}</span>
            </button>
          ))}
          <button 
            onClick={onClose}
            className="ml-2 px-4 py-2 bg-rose-950/80 hover:bg-rose-900/90 border border-rose-500/40 text-[10px] font-black uppercase tracking-widest rounded-2xl cursor-pointer transition shadow-lg"
          >
            Exit
          </button>
        </div>
      </div>

      {/* ── BOTTOM HUD CONTROLS & BARS (Floating) ── */}
      
      {/* Bottom Center: XP Bar Overlay */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[350px] p-2.5 rounded-2xl bg-black/85 border border-amber-500/30 shadow-2xl flex flex-col gap-1 z-10 select-none">
        <div className="flex justify-between text-[9px] font-black text-amber-300 uppercase tracking-widest">
          <span>Level {level}</span>
          <span>{xp} / 2500 XP</span>
        </div>
        <div className="w-full h-2.5 rounded-full bg-black/50 overflow-hidden border border-white/5">
          <div 
            className="h-full bg-gradient-to-r from-amber-500 to-yellow-300 transition-all duration-300"
            style={{ width: `${(xp / 2500) * 100}%` }}
          />
        </div>
      </div>

      {/* Bottom-Right: Time & Weather HUD */}
      <div className="absolute bottom-4 right-4 p-2.5 rounded-2xl bg-black/80 border border-white/10 text-[9px] font-bold text-slate-300 font-mono space-y-0.5 shadow-lg z-10 select-none flex flex-col items-end">
        <span className="text-amber-400">☀️ Sunny Day</span>
        <span>🕒 {timeOfDay}</span>
      </div>

      {/* Virtual Joysticks (Touch Controls) */}
      <div className="absolute bottom-4 left-4 flex gap-3 z-10 select-none">
        <button
          onMouseDown={() => handlePressLeft(true)}
          onMouseUp={() => handlePressLeft(false)}
          onMouseLeave={() => handlePressLeft(false)}
          onTouchStart={() => handlePressLeft(true)}
          onTouchEnd={() => handlePressLeft(false)}
          className="w-12 h-12 rounded-full bg-black/60 active:bg-amber-500/40 border border-white/20 active:border-amber-400 flex items-center justify-center text-xl text-white font-black shadow-lg cursor-pointer select-none"
        >
          ◀
        </button>
        <button
          onMouseDown={() => handlePressRight(true)}
          onMouseUp={() => handlePressRight(false)}
          onMouseLeave={() => handlePressRight(false)}
          onTouchStart={() => handlePressRight(true)}
          onTouchEnd={() => handlePressRight(false)}
          className="w-12 h-12 rounded-full bg-black/60 active:bg-amber-500/40 border border-white/20 active:border-amber-400 flex items-center justify-center text-xl text-white font-black shadow-lg cursor-pointer select-none"
        >
          ▶
        </button>
      </div>

      <div className="absolute bottom-4 right-28 z-10 select-none">
        <button
          onClick={handlePressJump}
          onTouchStart={handlePressJump}
          className="w-12 h-12 rounded-full bg-black/60 active:bg-amber-500/40 border border-white/20 active:border-amber-400 flex items-center justify-center text-xl text-white font-black shadow-lg cursor-pointer select-none"
        >
          ▲
        </button>
      </div>

      {/* ── MODALS (Backpack, Map, Quests, Settings, Game Over) ── */}
      {activeModal && (
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in p-6">
          <div className="w-[500px] rounded-[2rem] border border-amber-500/40 bg-gradient-to-b from-[#1c1f1a] to-[#0c0d0a] p-6 shadow-2xl flex flex-col justify-between">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <h3 className="text-base font-black uppercase tracking-wider text-amber-400">
                {activeModal === 'backpack' && '🎒 Backpack Inventory'}
                {activeModal === 'map' && '🗺️ World Map'}
                {activeModal === 'quests' && '📜 Quest Log'}
                {activeModal === 'settings' && '⚙️ Game Settings'}
                {activeModal === 'gameover' && '💀 Game Over'}
              </h3>
              <button 
                onClick={() => setActiveModal(null)}
                className="w-7 h-7 rounded-full bg-white/5 hover:bg-rose-500/20 hover:text-rose-400 flex items-center justify-center font-bold text-xs cursor-pointer transition"
              >
                ✕
              </button>
            </div>

            {/* Modal Content */}
            <div className="my-6 min-h-[180px]">
              {activeModal === 'backpack' && (
                <div className="grid grid-cols-4 gap-3">
                  {[
                    { name: 'Mossberry Honey', icon: '🍯', qty: 2, rarity: 'Common' },
                    { name: 'Caramel Cake', icon: '🍰', qty: 1, rarity: 'Rare' },
                    { name: 'Golden Spoon', icon: '🥄', qty: 1, rarity: 'Legendary' },
                    { name: 'Healing Herbs', icon: '🌿', qty: 5, rarity: 'Common' },
                  ].map((item, idx) => (
                    <div key={idx} className="p-3 rounded-2xl bg-black/40 border border-white/5 flex flex-col items-center justify-center text-center relative hover:border-amber-500/30 transition">
                      <span className="text-3xl mb-2">{item.icon}</span>
                      <span className="text-[10px] font-black block leading-tight">{item.name}</span>
                      <span className="text-[9px] text-slate-400 mt-1">x{item.qty}</span>
                      <span className={`absolute top-2 right-2 text-[6px] uppercase px-1 rounded font-mono ${
                        item.rarity === 'Legendary' ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30' :
                        item.rarity === 'Rare' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' :
                        'bg-slate-500/20 text-slate-300'
                      }`}>
                        {item.rarity}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {activeModal === 'map' && (
                <div className="rounded-2xl border border-emerald-500/20 bg-emerald-950/20 p-4 flex flex-col items-center justify-center text-center">
                  <div className="w-full h-28 bg-black/40 rounded-xl mb-4 relative flex items-center justify-center border border-white/5 overflow-hidden">
                    {/* Retro world map grid */}
                    <div className="absolute inset-0 opacity-10 bg-[linear-gradient(rgba(255,255,255,.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.1)_1px,transparent_1px)] bg-[size:10px_10px]" />
                    <div className="flex gap-4 text-xs font-black">
                      <div className="p-2 bg-emerald-900/80 rounded-lg text-emerald-300 border border-emerald-400/30">🌲 Mossberry Woods (You)</div>
                      <div className="p-2 bg-slate-900/80 rounded-lg text-slate-400">🍞 Caramel Bakery</div>
                      <div className="p-2 bg-slate-900/80 rounded-lg text-slate-400">🏥 Oakenhart Clinic</div>
                    </div>
                  </div>
                  <p className="text-[10px] text-slate-400 leading-relaxed font-serif italic">
                    "Travel to other regions will unlock in the next episode of Toffee Towns!"
                  </p>
                </div>
              )}

              {activeModal === 'quests' && (
                <div className="space-y-2">
                  {[
                    { title: 'Explore Mossberry Woods', desc: 'Jump on branches and explore the forest.', progress: 'Completed', reward: '100 XP' },
                    { title: 'Collect Golden Coins', desc: 'Find and collect all gold coins in the woods.', progress: '8 / 8 Collected', reward: '50 Coins' },
                    { title: 'Find the Treasure Chest', desc: 'Locate the hidden wooden chest near the cabin.', progress: chest1Opened ? 'Opened' : '0 / 1 Found', reward: '150 Coins' },
                  ].map((q, idx) => (
                    <div key={idx} className="p-3 rounded-2xl bg-black/30 border border-white/5 flex justify-between items-center">
                      <div>
                        <span className="text-xs font-black block text-amber-300">{q.title}</span>
                        <span className="text-[9px] text-slate-400 block">{q.desc}</span>
                      </div>
                      <div className="text-right">
                        <span className={`text-[9px] font-mono font-bold block ${q.progress === 'Completed' || q.progress === 'Opened' ? 'text-emerald-400' : 'text-amber-400'}`}>
                          {q.progress}
                        </span>
                        <span className="text-[8px] text-slate-500 block">Reward: {q.reward}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeModal === 'settings' && (
                <div className="space-y-4 text-xs font-semibold">
                  <div className="flex justify-between items-center p-2.5 rounded-xl bg-black/20">
                    <span>🎵 Background Music</span>
                    <button className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-[10px] font-bold cursor-pointer">ON</button>
                  </div>
                  <div className="flex justify-between items-center p-2.5 rounded-xl bg-black/20">
                    <span>🔊 Sound Effects</span>
                    <button className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-[10px] font-bold cursor-pointer">ON</button>
                  </div>
                  <div className="flex justify-between items-center p-2.5 rounded-xl bg-black/20">
                    <span>🎮 Control Layout</span>
                    <span className="text-[10px] text-amber-400 font-bold">Standard D-Pad</span>
                  </div>
                </div>
              )}

              {activeModal === 'gameover' && (
                <div className="flex flex-col items-center justify-center text-center">
                  <span className="text-6xl mb-4">💀</span>
                  <p className="text-sm font-black text-rose-500 uppercase tracking-widest">You fell out of the woods!</p>
                  <p className="text-xs text-slate-400 mt-2">Respawning with full health hearts...</p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <button 
              onClick={() => setActiveModal(null)}
              className="w-full py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-black font-black uppercase tracking-widest text-xs cursor-pointer transition active:scale-98"
            >
              {activeModal === 'gameover' ? 'Try Again' : 'Resume Game'}
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
