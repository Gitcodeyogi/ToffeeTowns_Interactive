// ============================================================
// TOWN GOSSIP DATA — Gossip Lens (Story File: Gossip Files)
// Used by: SparrowXTheatre (Step 5 intro cast, synopsis, sneak-peek)
// Source constants: town_details.ts
// ============================================================

export { TOWN_SPOTLIGHT_FACTS, TOWN_GOSSIPS } from './town_details';

import { TOWN_SPOTLIGHT_FACTS } from './town_details';

export interface TheatreCastMember {
    role: string;
    name: string;
    color: string;
    textColor: string;
    icon: string;
}

export const GOSSIP_THEATRE_DATA: Record<string, {
    cast: TheatreCastMember[];
    synopsis: string;
    sneakPeek: { speaker: string; text: string }[];
}> = Object.keys(TOWN_SPOTLIGHT_FACTS).reduce((acc, townId) => {
    const facts = TOWN_SPOTLIGHT_FACTS[townId];
    const gossips = facts.gossip || [];
    const g0 = gossips[0] || 'Whispers move quickly through the streets.';
    const g1 = gossips[1] || 'Every corner holds a secret worth knowing.';
    const g2 = gossips[2] || 'The rumour mill never stops turning here.';
    const tree = facts.tree || 'Ancient Tree';

    acc[townId] = {
        cast: [
            { role: 'Town Gossip',  name: 'The Whisperer',     color: 'from-pink-400 to-fuchsia-500',  textColor: 'text-pink-300',   icon: '🤟' },
            { role: 'The Witness',  name: 'Market Bystander',  color: 'from-lime-400 to-green-500',    textColor: 'text-lime-300',   icon: '👀' },
            { role: 'Sacred Tree',  name: tree,                color: 'from-amber-400 to-yellow-500',  textColor: 'text-amber-300',  icon: '🌳' },
            { role: 'The Town',     name: townId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()), color: 'from-cyan-400 to-sky-500', textColor: 'text-cyan-300', icon: '🏙' },
        ],
        synopsis: g0,
        sneakPeek: [
            { speaker: 'Overheard at the market', text: g1 },
            { speaker: 'A second whisper',        text: g2 },
        ],
    };
    return acc;
}, {} as Record<string, any>);
