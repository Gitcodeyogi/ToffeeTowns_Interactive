// ============================================================
// STORY REGISTRY — Maps townId to its drama stage story content.
//
// PRIORITY ORDER (highest to lowest):
//  1. Manual story file (e.g. toffee-town.ts) — handcrafted, real images + funny dialogues
//  2. Auto-generated fallback (townStoryScripts.ts) — built from World 1 data, no blank screens
//
// TO ADD A NEW TOWN:
//   1. Create constants/stories/{town-id}.ts  (copy toffee-town.ts as template)
//   2. Import it below and add to MANUAL_STORIES
//   3. The registry automatically uses it — auto-gen fallback stops for that town
// ============================================================

import type { TownStories } from '../storyTypes';
import { getStoryPackage } from '../townStoryScripts';
import { CHOCOBROOK_TOWNS } from '../towns';

// ─── Manual story files — add each town here as you create them ──────────────
import { toffeeTownStories } from './toffee-town';
import { hazelnutTerraceStories } from './hazelnut-terrace';
// import { ganacheGroveStories } from './ganache-grove';   // ← uncomment when ready
// import { cocoaCanyonStories  } from './cocoa-canyon';
// ... add all 17 towns + capital gradually

const MANUAL_STORIES: Partial<Record<string, TownStories>> = {
    'toffee-town':      toffeeTownStories,
    'hazelnut-terrace': hazelnutTerraceStories,
    // 'ganache-grove': ganacheGroveStories,
};

// ─── Convert auto-gen LensStoryPackage → TownStories shape ──────────────────
function buildFallbackStories(townId: string): TownStories {
    const lenses = ['legend', 'gossip', 'politics', 'economy', 'transport'] as const;
    const town = CHOCOBROOK_TOWNS.find(t => t.id === townId);
    const img = town?.image || '';

    const result: any = {};
    for (const lens of lenses) {
        const pkg = getStoryPackage(townId, lens);
        result[lens] = {
            title: pkg.title,
            description: pkg.synopsis,
            scenes: pkg.slides.map((slide: any, i: number) => ({
                // Use Firebase URL when available, fall back to slide.imageUrl, then town image
                imageUrl: slide.imageUrl || img,
                title: `Scene ${String(i + 1).padStart(2, '0')} — ${slide.speaker}`,
                description: pkg.synopsis,
                dialogues: [{ speaker: slide.speaker, dialogue: slide.dialogue }],
            })),
        };
    }
    return result as TownStories;
}

// ─── Public API ──────────────────────────────────────────────────────────────

/**
 * Get the full TownStories for a given townId.
 * Uses manual story file if available; auto-gen fallback otherwise.
 */
export function getTownStories(townId: string): TownStories | null {
    // 1. Manual (handcrafted, preferred)
    if (MANUAL_STORIES[townId]) return MANUAL_STORIES[townId]!;

    // 2. Auto-gen fallback (built from World 1 data — never blank)
    try {
        return buildFallbackStories(townId);
    } catch {
        return null;
    }
}

/**
 * Get one lens story for a town.
 * Returns null if neither manual nor fallback data exists.
 */
export function getLensStory(
    townId: string,
    lensId: 'legend' | 'gossip' | 'politics' | 'economy' | 'transport'
) {
    return getTownStories(townId)?.[lensId] ?? null;
}

/** True if this town has a handcrafted manual story (not just auto-gen) */
export function hasManualStory(townId: string): boolean {
    return townId in MANUAL_STORIES;
}
