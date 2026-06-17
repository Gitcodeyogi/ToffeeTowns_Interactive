// ============================================================
// TOWN LEGEND DATA — Legend Lens (Story File: Legend Files)
// Used by: SparrowXTheatre (Step 5 intro cast, synopsis, sneak-peek)
// Source constants: townLegends.ts
// ============================================================

export { TOWN_CAST, CHARACTER_BIOS, TOWN_LEGENDS } from './townLegends';

import { CHARACTER_BIOS, TOWN_LEGENDS, TOWN_CAST } from './townLegends';

export interface TheatreCastMember {
    role: string;
    name: string;
    color: string;
    textColor: string;
    icon: string;
}

export const LEGEND_THEATRE_DATA: Record<string, {
    cast: TheatreCastMember[];
    synopsis: string;
    sneakPeek: { speaker: string; text: string }[];
}> = Object.keys(TOWN_CAST).reduce((acc, townId) => {
    const c = TOWN_CAST[townId];
    const bio1 = CHARACTER_BIOS[c.head] || 'A legendary figure shaping this town.';
    const bio2 = CHARACTER_BIOS[c.carpenter] || 'Craftsperson of the province.';
    const legend = TOWN_LEGENDS[townId] || '';
    acc[townId] = {
        cast: [
            { role: 'Town Head',  name: c.head,       color: 'from-amber-400 to-orange-500',  textColor: 'text-amber-300',   icon: '👑' },
            { role: 'Carpenter',  name: c.carpenter,  color: 'from-cyan-400 to-sky-500',    textColor: 'text-cyan-300',    icon: '🔨' },
            { role: 'Painter',    name: c.painter,    color: 'from-pink-400 to-rose-500',    textColor: 'text-pink-300',    icon: '🎨' },
            { role: 'Scientist',  name: c.scientist,  color: 'from-emerald-400 to-teal-500', textColor: 'text-emerald-300', icon: '🔬' },
        ],
        synopsis: legend || `${bio1} Together they shape the living legend of this town.`,
        sneakPeek: [
            { speaker: c.head,       text: bio1 },
            { speaker: c.carpenter,  text: bio2 },
        ],
    };
    return acc;
}, {} as Record<string, any>);
