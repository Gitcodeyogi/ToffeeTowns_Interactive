import React, { useEffect, useRef } from 'react';

interface Props {
  bgUrl: string;
}

interface Particle {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  alpha: number;
  decay: number;
  swaySpeed: number;
  swayOffset: number;
}

const BgCanvas: React.FC<Props> = ({ bgUrl }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef<{ x: number; y: number }>({ x: -1000, y: -1000 });

  // Categorize wallpaper theme based on filename to tailor particle style
  const getThemeConfig = (url: string) => {
    const lower = url.toLowerCase();
    if (lower.includes('winter') || lower.includes('lakeview')) {
      return { color: '240, 248, 255', count: 65, type: 'snow' };
    }
    if (lower.includes('blossom') || lower.includes('cherry')) {
      return { color: '255, 182, 193', count: 45, type: 'petal' };
    }
    // Default: Glowcap Fireflies (gold-green)
    return { color: '253, 224, 71', count: 50, type: 'firefly' };
  };

  const config = getThemeConfig(bgUrl);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    const particles: Particle[] = [];

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Mouse Move Listener to repel particles
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Initial Particle Generator
    const createParticle = (initY = false): Particle => {
      const isSnow = config.type === 'snow';
      const isPetal = config.type === 'petal';
      
      return {
        x: Math.random() * canvas.width,
        y: initY ? Math.random() * canvas.height : canvas.height + 20,
        size: isSnow 
          ? 1.5 + Math.random() * 3 
          : isPetal 
            ? 3 + Math.random() * 5 
            : 1.2 + Math.random() * 2.8,
        speedY: isSnow 
          ? 0.4 + Math.random() * 0.8  // Snow falls down
          : -(0.3 + Math.random() * 0.7), // Fireflies and petals drift up
        speedX: (Math.random() - 0.5) * 0.3,
        alpha: 0.1 + Math.random() * 0.6,
        decay: 0.002 + Math.random() * 0.005,
        swaySpeed: 0.01 + Math.random() * 0.02,
        swayOffset: Math.random() * Math.PI * 2,
      };
    };

    // Fill screen with initial particles
    for (let i = 0; i < config.count; i++) {
      particles.push(createParticle(true));
    }

    const drawLoop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const mouse = mouseRef.current;
      const isSnow = config.type === 'snow';
      
      particles.forEach((p, idx) => {
        // Move particle
        p.swayOffset += p.swaySpeed;
        const currentSpeedX = p.speedX + Math.sin(p.swayOffset) * 0.2;
        p.x += currentSpeedX;
        p.y += p.speedY;

        // Mouse repulsion
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          const force = (100 - dist) / 100;
          const angle = Math.atan2(dy, dx);
          p.x += Math.cos(angle) * force * 2.5;
          p.y += Math.sin(angle) * force * 2.5;
        }

        // Draw particle
        ctx.beginPath();
        if (config.type === 'petal') {
          // Petal shapes (oval)
          ctx.ellipse(p.x, p.y, p.size, p.size * 0.6, Math.PI / 4, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${config.color}, ${p.alpha})`;
          ctx.fill();
        } else {
          // Circular glow (fireflies and snowflakes)
          const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 2);
          grad.addColorStop(0, `rgba(${config.color}, ${p.alpha})`);
          grad.addColorStop(1, `rgba(${config.color}, 0)`);
          ctx.arc(p.x, p.y, p.size * 2, 0, Math.PI * 2);
          ctx.fillStyle = grad;
          ctx.fill();
        }

        // Cycle boundaries
        const outOfBounds = isSnow 
          ? p.y > canvas.height + 10 
          : p.y < -10;

        if (outOfBounds || p.x < -10 || p.x > canvas.width + 10) {
          particles[idx] = createParticle(false);
          // if falling down, init at top
          if (isSnow) {
            particles[idx].y = -10;
          }
        }
      });

      animationFrameId = requestAnimationFrame(drawLoop);
    };

    drawLoop();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [config.color, config.type, config.count]);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden bg-neutral-950 select-none pointer-events-none">
      {/* Main wallpaper - original form */}
      <div
        className="absolute inset-0 transition-all duration-[2000ms] ease-in-out"
        style={{
          backgroundImage: `url("${encodeURI(bgUrl)}")`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-10 w-full h-full pointer-events-none"
      />
    </div>
  );
};

export default BgCanvas;
