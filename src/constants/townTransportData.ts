// ============================================================
// TOWN TRANSPORT DATA — Transport Lens (Story File: Transport Files)
// Used by: SparrowXTheatre (Step 5 intro cast, synopsis, sneak-peek)
// Source constants: transport_lore.ts
// ============================================================

export { TOWN_TRANSPORT_LORE } from './transport_lore';
export type { TransportLore } from './transport_lore';

import { TOWN_TRANSPORT_LORE } from './transport_lore';

export interface TheatreCastMember {
    role: string;
    name: string;
    color: string;
    textColor: string;
    icon: string;
}

export const TRANSPORT_THEATRE_DATA: Record<string, {
    cast: TheatreCastMember[];
    synopsis: string;
    sneakPeek: { speaker: string; text: string }[];
}> = Object.keys(TOWN_TRANSPORT_LORE).reduce((acc, townId) => {
    const lore = TOWN_TRANSPORT_LORE[townId];
    const townName = townId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

    acc[townId] = {
        cast: [
            { role: 'Route Master',   name: `${townName} Dispatch`, color: 'from-violet-400 to-indigo-500', textColor: 'text-violet-300', icon: '🚢' },
            { role: 'Primary Mode',   name: lore.primaryMode,       color: 'from-cyan-400 to-sky-500',      textColor: 'text-cyan-300',   icon: '🚂' },
            { role: 'Sightseeing',    name: 'Scenic Stop',          color: 'from-pink-400 to-rose-500',     textColor: 'text-pink-300',   icon: '🗺' },
            { role: 'The Traveler',   name: 'Province Explorer',    color: 'from-amber-400 to-orange-500',  textColor: 'text-amber-300',  icon: '🚶' },
        ],
        synopsis: lore.overview,
        sneakPeek: [
            { speaker: 'Route Dispatch',   text: lore.specialRules?.[0] || 'Keep to the designated lanes at all times.' },
            { speaker: "Traveler's Note",  text: lore.travelerSightseeing || 'A scenic route awaits the curious visitor.' },
        ],
    };
    return acc;
}, {} as Record<string, any>);
