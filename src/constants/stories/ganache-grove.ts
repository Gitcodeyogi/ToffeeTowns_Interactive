// ============================================================
// GANACHE GROVE — Drama Stage Story Content
// World 2: The full cinematic expansion of Ganache Grove lore.
// ============================================================

import type { TownStories } from '../storyTypes';
import { TOWN_LEGENDS } from '../townLegends';
import { TOWN_CONFLICTS, TOWN_GOSSIPS } from '../town_details';
import { TOWN_ECONOMY_NOTES } from '../economy';
import { TOWN_TRANSPORT_LORE } from '../transport_lore';
import { TOWN_LEGEND_LORE } from '../legend_lore';
import { CHOCOBROOK_TOWNS } from '../towns';

const townId   = 'ganache-grove';
const town     = CHOCOBROOK_TOWNS.find(t => t.id === townId)!;
const legend   = TOWN_LEGENDS[townId] || '';
const legendL  = TOWN_LEGEND_LORE[townId];
const conflict = TOWN_CONFLICTS[townId];
const gossips  = TOWN_GOSSIPS[townId] || [];
const eco      = TOWN_ECONOMY_NOTES[town?.name || 'Ganache Grove'];
const transL   = TOWN_TRANSPORT_LORE[townId];

const IMG = town?.image || '/wallpapers/ganache-grove-main.png';

export const ganacheGroveStories: TownStories = {

    // ─── LEGEND ──────────────────────────────────────────────────────────────
    legend: {
        title: 'The Whispering Silky Canopy',
        description: legendL
            ? `${legend} ${legendL.pastStruggle} Yet today — ${legendL.modernTriumph}`
            : legend || 'A forest where the trees bleed warm chocolate and the leaves are made of wafer.',
        scenes: [
            {
                imageUrl: IMG,
                title: 'Scene 01 — The First Sapling',
                description: 'In the beginning, there was only the Great Cocoa Bean.',
                dialogues: [
                    { speaker: 'Grove Elder', text: 'Before the canopy reached the clouds, a single Cocoa Bean of Light fell from the sky. It took root in the softest cream-soil ever seen.' }
                ]
            },
            {
                imageUrl: IMG,
                title: 'Scene 02 — The Growth',
                description: 'The bean sprouted into a tree of pure, liquid Ganache.',
                dialogues: [
                    { speaker: 'Grove Elder', text: 'It didn\'t grow bark. It grew velvet. It didn\'t grow leaves. It grew wafer-thin sheets of crisp sweetness. The air began to smell like a baker\'s dream.' }
                ]
            },
            {
                imageUrl: IMG,
                title: 'Scene 03 — The Sacred Spring',
                description: 'The core of the Grove began to flow.',
                dialogues: [
                    { speaker: 'Town Narrator', text: 'From the roots of the First Tree, a spring of warm Ganache erupted. It didn\'t drown the land; it nourished it, turning the wild woods into a sanctuary of silk.' }
                ]
            },
            {
                imageUrl: IMG,
                title: 'Scene 04 — The Guardian Archer',
                description: 'Archer Chucklebop takes up his watch.',
                dialogues: [
                    { speaker: 'Archer Chucklebop', text: 'I found this place when I was just a boy with a toy bow. The trees whispered to me. They didn\'t need a King; they needed a guardian. I haven\'t left my post since.' }
                ]
            },
            {
                imageUrl: IMG,
                title: 'Scene 05 — Modern Peace',
                description: 'The Grove remains a secret to those with bitter hearts.',
                dialogues: [
                    { speaker: 'Town Narrator', text: 'Today, the Ganache Grove stands as the heart of Chocobrook. Its secrets are safe, its canopy is eternal, and its chocolate... well, its chocolate is incomparable.' }
                ]
            },
        ]
    },

    // ─── GOSSIP ──────────────────────────────────────────────────────────────
    gossip: {
        title: 'The Great Wafer Rustle',
        description: gossips[0] || 'Whispers of a midnight snack that almost leveled a sector.',
        scenes: [
            {
                imageUrl: IMG,
                title: 'Scene 01 — Midnight Munchies',
                description: 'Someone has been nibbling on the lower branches.',
                dialogues: [
                    { speaker: 'Grove Guard', text: 'I heard it at 2 AM. A "crunch" that echoed through the entire East Sector. Not a normal crunch. A high-stakes, "I shouldn\'t be eating this" crunch.' }
                ]
            },
            {
                imageUrl: IMG,
                title: 'Scene 02 — The Missing Leaves',
                description: 'A whole tree has been stripped of its wafer-foliage.',
                dialogues: [
                    { speaker: 'Grove Guard', text: 'The Sector 4 Willow is... naked. Every single wafer leaf is gone. The tree looks personally offended. It\'s shivering in the night breeze.' }
                ]
            },
            {
                imageUrl: IMG,
                title: 'Scene 03 — The Trail of Crumbs',
                description: 'Evidence is found leading to the Advisor\'s hut.',
                dialogues: [
                    { speaker: 'Town Gossip', text: 'The crumbs lead straight to the Advisor\'s door. But the Advisor claims he has a gluten allergy. The plot thickens like a double-boiled chocolate.' }
                ]
            },
            {
                imageUrl: IMG,
                title: 'Scene 04 — The Confession',
                description: 'A Sleep-Duck is found with a very full belly.',
                dialogues: [
                    { speaker: 'Grove Guard', text: 'It wasn\'t the Advisor. It was a Sleep-Duck. It had used the leaves to make a giant, edible nest. It looks very proud of itself. And very sleepy.' }
                ]
            },
            {
                imageUrl: IMG,
                title: 'Scene 05 — The Lesson',
                description: 'Never underestimate a duck with a vision.',
                dialogues: [
                    { speaker: 'Town Narrator', text: 'The Sector 4 Willow got new leaves by morning. The duck got a citation. And the town got a new story about the time the forest was almost eaten by its own residents.' }
                ]
            },
        ]
    },

    // ─── POLITICS ────────────────────────────────────────────────────────────
    politics: {
        title: 'The Ganache Quota',
        description: conflict?.unfairLaw || 'A decree to limit the flow of chocolate for "security reasons".',
        scenes: [
            {
                imageUrl: IMG,
                title: 'Scene 01 — The Decree',
                description: 'The High Council demands a chocolate ceiling.',
                dialogues: [
                    { speaker: 'Town Narrator', text: 'The news arrived on a parchment that smelled suspiciously of licorice. "To ensure stability, all Ganache extraction is capped at three buckets per citizen." The Grove went silent.' }
                ]
            },
            {
                imageUrl: IMG,
                title: 'Scene 02 — The Resistance',
                description: 'Citizens gather near the Silk-Leaf Pond.',
                dialogues: [
                    { speaker: 'Rebel Baker', text: 'Three buckets? My soufflés alone require four! This isn\'t security; it\'s a culinary catastrophe! We will not stand for a dry dessert table!' }
                ]
            },
            {
                imageUrl: IMG,
                title: 'Scene 03 — Archer\'s Intervention',
                description: 'Chucklebop suggests a compromise.',
                dialogues: [
                    { speaker: 'Archer Chucklebop', text: 'If we tap the Elder Tree, we can double the flow without hurting the Grove. But the Council needs to see that we\'re not wasting it. No more ganache-wrestling matches, okay?' }
                ]
            },
            {
                imageUrl: IMG,
                title: 'Scene 04 — The Demonstration',
                description: 'A show of chocolate-based unity.',
                dialogues: [
                    { speaker: 'Town Narrator', text: 'The town staged a "Quiet Tap." They showed the Council how responsible they could be. Even the Sleep-Ducks behaved. Mostly.' }
                ]
            },
            {
                imageUrl: IMG,
                title: 'Scene 05 — The Repeal',
                description: 'The quota is lifted, and the chocolate flows once more.',
                dialogues: [
                    { speaker: 'Town Narrator', text: 'The Council backed down. The Ganache Quota was replaced by a "Generosity Guideline." The soufflés were saved, and the Grove remained as sticky and prosperous as ever.' }
                ]
            },
        ]
    },

    // ─── ECONOMY ────────────────────────────────────────────────────────────
    economy: {
        title: 'The Silk-Leaf Exchange',
        description: eco?.localTrade || 'Where the currency is measured in sweetness and the banks are made of gingerbread.',
        scenes: [
            {
                imageUrl: IMG,
                title: 'Scene 01 — The Morning Trade',
                description: 'The Grove market opens with a scent of cinnamon.',
                dialogues: [
                    { speaker: 'Town Narrator', text: 'In Ganache Grove, you don\'t trade coins; you trade Silk-Leaves. These rare, iridescent wafers are the gold standard of the forest. They\'re light, valuable, and occasionally delicious.' }
                ]
            },
            {
                imageUrl: IMG,
                title: 'Scene 02 — The Quality Check',
                description: 'An auditor examines the latest harvest.',
                dialogues: [
                    { speaker: 'Trade Auditor', text: 'This batch is too brittle. It won\'t hold its value in a humid climate. We need the "Supple Grade" if we want to trade with the Coastal Towns.' }
                ]
            },
            {
                imageUrl: IMG,
                title: 'Scene 03 — The Ganache Futures',
                description: 'Predicting the next big flow.',
                dialogues: [
                    { speaker: 'Market Analyst', text: 'The Elder Tree is showing high pressure. We expect a 20% increase in ganache production by mid-season. Buy your buckets now, citizens!' }
                ]
            },
            {
                imageUrl: IMG,
                title: 'Scene 04 — The Counterfeit Crisis',
                description: 'Cardboard leaves are found in the market.',
                dialogues: [
                    { speaker: 'Trade Auditor', text: 'Someone is trying to pass off painted cardboard as Silk-Leaves. They even sprayed it with chocolate perfume. The audacity is... almost impressive.' }
                ]
            },
            {
                imageUrl: IMG,
                title: 'Scene 05 — Economic Stability',
                description: 'The real leaves prevail.',
                dialogues: [
                    { speaker: 'Town Narrator', text: 'The fake leaves were recycled into hats. The real Silk-Leaves held their value. The economy of Ganache Grove remains the sweetest and most stable in the entire province.' }
                ]
            },
        ]
    },

    // ─── TRANSPORT ───────────────────────────────────────────────────────────
    transport: {
        title: 'The Ganache Rapids',
        description: transL?.overview || 'The only transport system where the fuel is also the scenery.',
        scenes: [
            {
                imageUrl: IMG,
                title: 'Scene 01 — The Riverbank',
                description: 'Cinnamon Gondolas wait for passengers.',
                dialogues: [
                    { speaker: 'Gondolier Otto', text: 'Boarding for the Northern Falls! Please keep your hands inside the boat. The ganache is at a perfect 110 degrees. Warm enough to flow, cool enough to not cook you.' }
                ]
            },
            {
                imageUrl: IMG,
                title: 'Scene 02 — The Current',
                description: 'Navigating the thick, silky flow.',
                dialogues: [
                    { speaker: 'Gondolier Otto', text: 'It\'s not about speed; it\'s about momentum. If you stop moving, the ganache starts to set. And nobody wants to be stuck in a chocolate block until the next heat wave.' }
                ]
            },
            {
                imageUrl: IMG,
                title: 'Scene 03 — The Waterfall',
                description: 'A spectacular drop of liquid chocolate.',
                dialogues: [
                    { speaker: 'Excited Passenger', text: 'Look at the fall! It\'s like a curtain of silk! Can I dip my finger in? Just a little bit?' },
                    { speaker: 'Gondolier Otto', text: 'I didn\'t see anything. But if you fall in, I\'m not cleaning your shoes.' }
                ]
            },
            {
                imageUrl: IMG,
                title: 'Scene 04 — The Sticky Bridge',
                description: 'A bridge that occasionally needs a spatula.',
                dialogues: [
                    { speaker: 'Town Narrator', text: 'The transport routes often pass under the Sticky Bridge. It\'s called that because it is, in fact, made of semi-set fudge. It\'s structurally sound, but your hair might stick to it if you\'re tall.' }
                ]
            },
            {
                imageUrl: IMG,
                title: 'Scene 05 — Safe Arrival',
                description: 'The boat pulls into the Grove Terminal.',
                dialogues: [
                    { speaker: 'Town Narrator', text: 'Every journey ends with a complimentary wafer. You arrived on time, you\'re slightly stickier than when you started, and the world feels a little bit sweeter. That\'s the Ganache Grove way.' }
                ]
            },
        ]
    },

};
