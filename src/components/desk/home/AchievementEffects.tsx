import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface AchievementEffectsProps {
  isOpen: boolean;
  onClose: () => void;
  fromRoleName: string;
  toRoleName: string;
  badgeIcon: string;
  colorTheme: string;
}

const playPromotionChime = () => {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const now = ctx.currentTime;

    const playTone = (freq: number, startTime: number, duration: number, type: OscillatorType = 'sine', volume = 0.15) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = type;
      osc.frequency.setValueAtTime(freq, startTime);
      
      gain.gain.setValueAtTime(volume, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(startTime);
      osc.stop(startTime + duration);
    };

    // Beautiful arpeggio + bell strike
    playTone(523.25, now, 1.5, 'sine', 0.15); // C5
    playTone(659.25, now + 0.12, 1.2, 'sine', 0.15); // E5
    playTone(783.99, now + 0.24, 1.0, 'sine', 0.12); // G5
    playTone(1046.50, now + 0.36, 2.0, 'triangle', 0.18); // C6
    playTone(1318.51, now + 0.48, 1.5, 'sine', 0.08); // E6

  } catch (e) {
    console.warn('Web Audio API chime blocked or unsupported:', e);
  }
};

export const AchievementEffects: React.FC<AchievementEffectsProps> = ({
  isOpen,
  onClose,
  fromRoleName: _fromRoleName,
  toRoleName,
  badgeIcon,
  colorTheme
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      playPromotionChime();
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Particle class
    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      color: string;
      alpha: number;
      decay: number;
      rotation: number;
      rotationSpeed: number;
      gravity: number;
      drag: number;
      shape: 'confetti' | 'star' | 'circle';

      constructor() {
        this.x = width / 2;
        this.y = height / 2 - 50;
        
        const angle = Math.random() * Math.PI * 2;
        const speed = 5 + Math.random() * 12;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed - 2;
        
        this.size = 5 + Math.random() * 10;
        this.alpha = 1;
        this.decay = 0.008 + Math.random() * 0.012;
        this.rotation = Math.random() * Math.PI;
        this.rotationSpeed = (Math.random() - 0.5) * 0.15;
        this.gravity = 0.15;
        this.drag = 0.98;

        const colors = [
          '#fbbf24', // Amber
          '#f59e0b', // Orange
          '#38bdf8', // Sky Blue
          '#a78bfa', // Lavender
          '#f472b6', // Pink
          '#34d399', // Emerald
          '#ffffff'  // Silver/White
        ];
        this.color = colors[Math.floor(Math.random() * colors.length)];
        
        const shapes: ('confetti' | 'star' | 'circle')[] = ['confetti', 'star', 'circle'];
        this.shape = shapes[Math.floor(Math.random() * shapes.length)];
      }

      draw(c: CanvasRenderingContext2D) {
        c.save();
        c.translate(this.x, this.y);
        c.rotate(this.rotation);
        c.globalAlpha = this.alpha;
        c.fillStyle = this.color;

        if (this.shape === 'confetti') {
          c.fillRect(-this.size / 2, -this.size / 4, this.size, this.size / 2);
        } else if (this.shape === 'star') {
          c.beginPath();
          for (let i = 0; i < 5; i++) {
            c.lineTo(0, -this.size / 2);
            c.rotate(Math.PI / 5);
            c.lineTo(0, -this.size / 5);
            c.rotate(Math.PI / 5);
          }
          c.closePath();
          c.fill();
        } else {
          c.beginPath();
          c.arc(0, 0, this.size / 3, 0, Math.PI * 2);
          c.fill();
        }
        c.restore();
      }

      update() {
        this.vx *= this.drag;
        this.vy *= this.drag;
        this.vy += this.gravity;
        this.x += this.vx;
        this.y += this.vy;
        this.rotation += this.rotationSpeed;
        this.alpha -= this.decay;
      }
    }

    const particles: Particle[] = [];
    const burstCount = 180;
    for (let i = 0; i < burstCount; i++) {
      particles.push(new Particle());
    }

    interface Firefly {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      alpha: number;
      phase: number;
      speed: number;
    }
    const fireflies: Firefly[] = Array.from({ length: 40 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      size: 1 + Math.random() * 3,
      alpha: Math.random(),
      phase: Math.random() * Math.PI * 2,
      speed: 0.01 + Math.random() * 0.02
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      fireflies.forEach(f => {
        f.x += f.vx;
        f.y += f.vy;
        if (f.x < 0) f.x = width;
        if (f.x > width) f.x = 0;
        if (f.y < 0) f.y = height;
        if (f.y > height) f.y = 0;

        f.phase += f.speed;
        const currentAlpha = 0.15 + Math.sin(f.phase) * 0.15;
        
        ctx.save();
        ctx.globalAlpha = currentAlpha;
        ctx.fillStyle = '#fbbf24';
        ctx.beginPath();
        ctx.arc(f.x, f.y, f.size, 0, Math.PI * 2);
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#fbbf24';
        ctx.fill();
        ctx.restore();
      });

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.update();
        if (p.alpha <= 0) {
          particles.splice(i, 1);
        } else {
          p.draw(ctx);
        }
      }

      if (particles.length < 80 && Math.random() < 0.3) {
        particles.push(new Particle());
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isOpen]);

  // Dynamic unlocks list based on rank
  const getRankUnlocks = (rank: string) => {
    switch (rank.toLowerCase()) {
      case 'newcomer':
        return [
          '🌱 Early Chores & Missions',
          '📖 Academy Classroom access',
          '💬 Gossip Corner introductions'
        ];
      case 'resident':
        return [
          '🏡 Cottage Customization & Decor',
          '🛶 River Docks & Wagon Station access',
          '🧑‍🌾 Rowan\'s Workshop chores & repairs'
        ];
      case 'settler':
        return [
          '🚂 Caramel Wagon & Glass Monorail lines',
          '🪙 Market Stall & Confectionery boutique leases',
          '🦉 Bella\'s Gossip network & whispers'
        ];
      case 'townsman':
        return [
          '🏛️ Council Chamber & Town Hall voting rights',
          '🩺 Dr. Cedric\'s Clinic shifts & elixirs',
          '📜 Ganache Gazette opinion columns'
        ];
      case 'citizen':
      case 'grand citizen':
      case 'council citizen':
        return [
          '👑 Town Council Seats & Grand Gala access',
          '🎭 Premium Theatre VIP seats & chronicles',
          '🎁 Imperial Treasury referral allowance bonuses'
        ];
      default:
        return [
          '🏡 Local cottage key',
          '🍪 Daily visit allowance',
          '👥 Meet local townspeople'
        ];
    }
  };

  const unlocks = getRankUnlocks(toRoleName);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[600] flex items-center justify-center select-none overflow-hidden">
          {/* Dark Glass Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/85 cursor-pointer"
          />

          {/* Canvas for particle burst */}
          <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />

          {/* Celebration Card: Town Hall Ceremony */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 50 }}
            animate={{ 
              scale: 1, 
              opacity: 1, 
              y: 0,
              transition: { type: 'spring', damping: 20, stiffness: 100 }
            }}
            exit={{ scale: 0.8, opacity: 0, y: -50 }}
            className="relative z-10 w-[90%] max-w-md p-8 rounded-[2.5rem] border border-white/20 bg-neutral-950/90 shadow-[0_0_80px_rgba(245,158,11,0.3)] text-center flex flex-col items-center gap-5"
          >
            {/* Top gold glow bar */}
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent rounded-t-[2.5rem]" />

            {/* Rotating sunbeams effect */}
            <div className={`absolute -top-16 w-48 h-48 bg-gradient-to-tr ${colorTheme ? colorTheme.replace(/\/80/g, '/20') : 'from-amber-500/20 to-yellow-400/20'} rounded-full blur-2xl animate-pulse pointer-events-none`} />

            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-400 block">
                🏛️ Town Hall Ceremony
              </span>
              <h2 className="text-2xl font-brand text-white uppercase tracking-wider leading-none mt-1" style={{ fontFamily: '"Luckiest Guy", cursive' }}>
                Congratulations!
              </h2>
            </div>

            <p className="text-[11.5px] text-white/80 leading-relaxed font-sans max-w-xs">
              Through your hard work and service to Toffee Town, the Mayor and Town Council have officially granted you the title of:
            </p>

            {/* Large Rank Banner */}
            <div className="bg-white/5 border border-white/10 px-6 py-4 rounded-3xl w-full flex flex-col items-center gap-2 shadow-inner">
              <span className="text-6xl filter drop-shadow-[0_4px_12px_rgba(255,255,255,0.2)] animate-pulse">{badgeIcon}</span>
              <span className="text-xl font-brand text-yellow-300 uppercase tracking-widest mt-1" style={{ fontFamily: '"Luckiest Guy", cursive' }}>
                {toRoleName}
              </span>
            </div>

            <div className="w-full text-left space-y-3 font-sans mt-1">
              <div className="h-px bg-white/10" />
              <p className="text-[10px] font-black uppercase text-amber-400 tracking-wider">
                ✨ A new chapter of your journey begins. Unlocked:
              </p>
              <div className="space-y-1.5 pl-1">
                {unlocks.map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-white/85">
                    <span className="text-emerald-400 font-bold">✦</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Continue Button */}
            <button
              onClick={onClose}
              className="w-full mt-3 py-3.5 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 hover:brightness-110 active:scale-[0.98] text-black font-brand font-black uppercase text-xs tracking-widest rounded-2xl shadow-[0_4px_25px_rgba(245,158,11,0.35)] transition-all duration-200 cursor-pointer"
              style={{ fontFamily: '"Josefin Sans", sans-serif' }}
            >
              🎉 Continue your adventure 🎉
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
