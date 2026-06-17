import { GENERATED_WALLPAPERS } from './generated_wallpapers';

export const DYNAMIC_WALLPAPERS = GENERATED_WALLPAPERS;

export const PAGE_ORDER: string[] = [
  'landing',
  'town-theatre',
  'sparrow-theatre',
  'story-chapters',
  'characters',
  'games-arena',
  'leaderboard',
  'badges',
  'synopsis',
  'coin-store',
  'whats-next',
  'gallery-3d',
  'chuckle-memory',
  'chuckle-mojo',
  'chuckle-tycoon',
  'chuckle-debate',
  'chuckle-town',
  'chuckle-kingdom',
  'town-connect',
  'dummy'
];

const ROTATION_INTERVAL_MS = 1000 * 60 * 10; // Frequent Rotation (10 Minutes)
const ROTATION_BASE_TIME = new Date('2026-04-13T00:00:00Z').getTime(); // Updated for current context

const gcd = (a: number, b: number): number => {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y !== 0) {
    const t = y;
    y = x % y;
    x = t;
  }
  return x || 1;
};

const getPageSeed = (pageId: string): number => {
  const fromOrder = PAGE_ORDER.indexOf(pageId);
  if (fromOrder >= 0) return fromOrder;
  return pageId.split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
};

const getCoprimeStride = (length: number): number => {
  if (length <= 1) return 1;
  let candidate = Math.max(5, Math.floor(length / 2) + 1);
  while (candidate < length * 2) {
    if (gcd(candidate, length) === 1) return candidate;
    candidate += 1;
  }
  return 1;
};

export const pickRotatingWallpaper = (pageId: string, now = Date.now()): string => {
  if (!DYNAMIC_WALLPAPERS.length) return '';
  
  const pool = DYNAMIC_WALLPAPERS;
  
  const slot = Math.floor((now - ROTATION_BASE_TIME) / ROTATION_INTERVAL_MS);
  const pageSeed = getPageSeed(pageId);
  const stride = getCoprimeStride(pool.length);
  // Using direct addition ensures that since pageSeed is strictly unique 0-19,
  // and pool.length > 20, no two pages will ever collide mathematically at any given slot.
  const wallIndex = (pageSeed + (slot * stride)) % pool.length;
  
  return pool[wallIndex] || pool[0];
};
