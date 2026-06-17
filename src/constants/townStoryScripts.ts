// ============================================================
// DYNAMIC STORY PACKAGE BUILDER
// Generates all 5 lens stories for every town using existing data.
// Manual story overrides (from TownTheaterDirectory.ts) take precedence.
// ============================================================

import { CHOCOBROOK_TOWNS } from './towns';
import { TOWN_CONFLICTS, TOWN_GOSSIPS, TOWN_SPOTLIGHT_FACTS } from './town_details';
import { TOWN_LEGENDS, TOWN_CAST } from './townLegends';
import { TOWN_ECONOMY_NOTES } from './economy';
import { TOWN_ECONOMY_CAST } from './townEconomyData';
import { TOWN_TRANSPORT_LORE } from './transport_lore';
import { TOWN_LEGEND_LORE } from './legend_lore';
import { TOWN_THEATER_DIRECTORY } from '../components/TownTheaterDirectory';

// ─── Story item shape used by the drama-stage viewer ─────────────────────────
export interface StorySlide {
    /** lazy import fn, e.g. () => import('../assets/stories/toffee-town/legend/01.png') */
    imageImport?: () => Promise<{ default: string }>;
    /** Fallback static URL if no image import provided yet */
    imageUrl?: string;
    /** Character name / label shown above the dialogue */
    speaker: string;
    /** The actual narrative line */
    dialogue: string;
}

export interface LensStoryPackage {
    title: string;
    synopsis: string;
    narratorName: string;
    narratorRole: string;
    /** Up to 25 slides */
    slides: StorySlide[];
}

export interface FullTownStoryPackage {
    townId: string;
    townName: string;
    legend: LensStoryPackage;
    gossip: LensStoryPackage;
    politics: LensStoryPackage;
    economy: LensStoryPackage;
    transport: LensStoryPackage;
}

// ─── Manual overrides registry ───────────────────────────────────────────────
// Add per-town per-lens manual scripts here as you create them.
// Format: MANUAL_STORY_SCRIPTS[townId][lensId] = LensStoryPackage
export const MANUAL_STORY_SCRIPTS: Partial<Record<string, Partial<Record<'legend' | 'gossip' | 'politics' | 'economy' | 'transport', LensStoryPackage>>>> = {
    // Example — Toffee Town politics (from TownTheaterDirectory):
    // 'toffee-town': {
    //   politics: {
    //     title: 'The Sugar Pipe Clog',
    //     synopsis: '...',
    //     narratorName: 'Bo',
    //     narratorRole: 'Toffee Painter',
    //     slides: [
    //       { imageUrl: '/assets/stories/toffee-town/politics/01.png', speaker: 'Bo', dialogue: '...' },
    //       ...
    //     ]
    //   }
    // }
};

// ─── Dynamic story builder ────────────────────────────────────────────────────
function buildDynamicPackage(town: typeof CHOCOBROOK_TOWNS[number]): FullTownStoryPackage {
    const cast        = TOWN_CAST[town.id]        || { head: 'The Elder', carpenter: 'A Craftsperson', painter: 'An Artist', scientist: 'A Scholar' };
    const ecoCast     = TOWN_ECONOMY_CAST[town.id] || { trader: 'A Trader', farmer: 'A Farmer', merchant: 'A Merchant', banker: 'A Banker' };
    const conflict    = TOWN_CONFLICTS[town.id];
    const gossips     = TOWN_GOSSIPS[town.id]      || [];
    const facts       = TOWN_SPOTLIGHT_FACTS[town.id];
    const legend      = TOWN_LEGENDS[town.id]      || '';
    const legendLore  = TOWN_LEGEND_LORE[town.id];
    const ecoNote     = TOWN_ECONOMY_NOTES[town.name];
    const transportL  = TOWN_TRANSPORT_LORE[town.id];

    const fallback    = (s: string | undefined, fb: string) => s && s.trim() ? s : fb;

    // ─── LOVELIER TITLE GENERATOR ────────────────────────────
    const getLovelierTitle = (lens: 'legend' | 'gossip' | 'politics' | 'economy' | 'transport') => {
        const charCode = town.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        const templates = {
            legend: [
                `${town.name} Ancient Origin`,
                `Shadows of ${town.name}`,
                `${town.name} Starlit Legend`,
                `Echoes of ${town.name}`
            ],
            gossip: [
                `Whispers from ${town.name}`,
                `The ${town.name} Secret`,
                `Midnight ${town.name} Tales`,
                `${town.name} Hidden Rumors`
            ],
            politics: [
                `The ${town.name} Decree`,
                `${town.name} Grand Resolve`,
                `Justice in ${town.name}`,
                `${town.name} Frontier Law`
            ],
            economy: [
                `${town.name} Rich Fortune`,
                `Gilded ${town.name} Trade`,
                `${town.name} Golden Harvest`,
                `Prosperity of ${town.name}`
            ],
            transport: [
                `The ${town.name} Express`,
                `Across ${town.name} Rails`,
                `${town.name} Scenic Routes`,
                `The ${town.name} Expedition`
            ]
        };
        const list = templates[lens];
        return list[charCode % list.length];
    };

    // ── Legend ────────────────────────────────────────────────
    const legendStory: LensStoryPackage = {
        title:       getLovelierTitle('legend'),
        synopsis:    fallback(legend, `The ancient story of ${town.name} carries secrets older than the province itself.`),
        narratorName: 'Folklore Records',
        narratorRole: 'System Narrator',
        slides: [
            {
                imageUrl: town.image,
                speaker:  'Folklore Records',
                dialogue: fallback(legendLore?.origin, `Long before the first settlement, ${town.name} was a barren stretch of flavorless earth — until the day everything changed.`)
            },
            {
                imageUrl: town.image,
                speaker:  cast.head,
                dialogue: fallback(legendLore?.pastStruggle, `"Our ancestors didn't have it easy. The first years here tested every soul in this town. But they held on, the way ${facts?.tree || 'the ancient tree'} holds on — roots deep, heart steady."`)
            },
            {
                imageUrl: town.image,
                speaker:  'Folklore Records',
                dialogue: fallback(legendLore?.modernTriumph, `Today, ${town.name} stands as proof that what was once barren can be made extraordinary.`)
            },
            {
                imageUrl: town.image,
                speaker:  cast.carpenter,
                dialogue: `"Every beam I carve in this town carries a bit of that old magic. You can feel it in the wood — it hums. I swear it hums."`
            },
            {
                imageUrl: town.image,
                speaker:  'Folklore Records',
                dialogue: fallback(legendLore?.boldFuture, `And the story of ${town.name}? It is far from over. The next chapter is being written right now — by the people living in its streets today.`)
            },
        ]
    };

    // ── Gossip ────────────────────────────────────────────────
    const gossipText  = gossips[0] || `The streets of ${town.name} are never quiet. Something is always brewing between the stalls and alleys.`;
    const gossipText2 = gossips[1] || `"You didn't hear it from me, but the whole bakery district is talking about what happened last Thursday."`;
    const gossipStory: LensStoryPackage = {
        title:       getLovelierTitle('gossip'),
        synopsis:    `Every town has its whisper network. In ${town.name}, the rumours travel faster than the morning delivery carts.`,
        narratorName: cast.head.split(' ')[0],
        narratorRole: 'Town Head',
        slides: [
            {
                imageUrl: town.image,
                speaker:  cast.head.split(' ')[0],
                dialogue: `"Listen closely, and keep this between us — the things that happen in this town before sunrise would make your hat spin."`
            },
            {
                imageUrl: town.image,
                speaker:  cast.carpenter.split(' ')[0],
                dialogue: `"${gossipText}"`
            },
            {
                imageUrl: town.image,
                speaker:  cast.head.split(' ')[0],
                dialogue: `"${gossipText2}"`
            },
            {
                imageUrl: town.image,
                speaker:  cast.painter.split(' ')[0],
                dialogue: fallback(gossips[2], `"The thing about rumours is — they're only half true. The other half is usually even better."`)
            },
            {
                imageUrl: town.image,
                speaker:  cast.carpenter.split(' ')[0],
                dialogue: `"And before you ask — yes, I confirmed it with two separate pigeons. They're very reliable sources."`
            },
        ]
    };

    // ── Politics ──────────────────────────────────────────────
    const unfairLaw     = fallback(conflict?.unfairLaw,     `A controversial regulation has been pressing hard on the daily life of residents in ${town.name}.`);
    const harmedCitizen = fallback(conflict?.harmedCitizen, `Honest citizens are bearing the weight of decisions made without their voice.`);
    const mayorAction   = fallback(conflict?.mayorAction,   `The town authority insists the policy is for the greater good — but the streets tell a different story.`);
    const rebelLine     = fallback(conflict?.chucklebopAction, `A group of determined residents has decided that silence is not an option.`);

    const politicsStory: LensStoryPackage = {
        title:       getLovelierTitle('politics'),
        synopsis:    `${unfairLaw} ${harmedCitizen}`,
        narratorName: cast.head,
        narratorRole: 'Town Head',
        slides: [
            {
                imageUrl: town.image,
                speaker:  'Town Narrator',
                dialogue: `In ${town.name}, the law has a heavy hand this season. Here is what is really happening behind the official notices.`
            },
            {
                imageUrl: town.image,
                speaker:  'Concerned Citizen',
                dialogue: `"${unfairLaw}"`
            },
            {
                imageUrl: town.image,
                speaker:  'Affected Resident',
                dialogue: `"${harmedCitizen}"`
            },
            {
                imageUrl: town.image,
                speaker:  cast.head,
                dialogue: `"${mayorAction}"`
            },
            {
                imageUrl: town.image,
                speaker:  conflict?.rebels?.split(' ')[0] || 'The Resistance',
                dialogue: `"${rebelLine}"`
            },
        ]
    };

    // ── Economy ───────────────────────────────────────────────
    const localTrade = fallback(ecoNote?.localTrade, `The local economy of ${town.name} thrives on a delicate balance of skill, trust, and seasonal trade.`);
    const currency   = ecoNote?.currency || 'Cocoa Coins';

    const economyStory: LensStoryPackage = {
        title:       getLovelierTitle('economy'),
        synopsis:    localTrade,
        narratorName: ecoCast.trader,
        narratorRole: 'Lead Trader',
        slides: [
            {
                imageUrl: town.image,
                speaker:  'Market Narrator',
                dialogue: `Every morning in ${town.name}, the market square fills before dawn. Here is how the economy of this town truly works.`
            },
            {
                imageUrl: town.image,
                speaker:  ecoCast.trader.split(' ')[0],
                dialogue: `"${localTrade}"`
            },
            {
                imageUrl: town.image,
                speaker:  ecoCast.farmer.split(' ')[0],
                dialogue: `"We do it all in ${currency}. Everything you see here — grown, made, and traded — right here in town."`
            },
            {
                imageUrl: town.image,
                speaker:  ecoCast.merchant.split(' ')[0],
                dialogue: `"Last season broke records. The provincial buyers were lining up before we even opened the stalls. I had to turn three away."`
            },
            {
                imageUrl: town.image,
                speaker:  ecoCast.banker.split(' ')[0],
                dialogue: `"Stability rating: ${ecoNote?.tradeStability ?? 94}%. That means we sleep well. Very, very well."`
            },
        ]
    };

    // ── Transport ─────────────────────────────────────────────
    const overview      = fallback(transportL?.overview, `The routes in and out of ${town.name} have shaped its character as much as its people have.`);
    const primaryMode   = transportL?.primaryMode   || 'Local road and rail lines';
    const sightseeing   = transportL?.travelerSightseeing || `the scenic routes through ${town.name}`;

    const transportStory: LensStoryPackage = {
        title:       getLovelierTitle('transport'),
        synopsis:    overview,
        narratorName: 'Station Master',
        narratorRole: 'Route Dispatch',
        slides: [
            {
                imageUrl: town.image,
                speaker:  'Route Narrator',
                dialogue: `Getting in and out of ${town.name} is half the adventure. Here is how the province moves through this station.`
            },
            {
                imageUrl: town.image,
                speaker:  'Station Master',
                dialogue: `"${overview}"`
            },
            {
                imageUrl: town.image,
                speaker:  'Traveller',
                dialogue: `"Primary mode of travel: ${primaryMode}. It's reliable. Sometimes surprisingly fast."`
            },
            {
                imageUrl: town.image,
                speaker:  'Local Guide',
                dialogue: `"If you have time, don't miss ${sightseeing}. Worth every minute of the detour."`
            },
            {
                imageUrl: town.image,
                speaker:  'Station Master',
                dialogue: `"The convoy rolls at midnight, the express at dawn. Miss either and you're staying for a very long breakfast."`
            },
        ]
    };

    return {
        townId:    town.id,
        townName:  town.name,
        legend:    legendStory,
        gossip:    gossipStory,
        politics:  politicsStory,
        economy:   economyStory,
        transport: transportStory,
    };
}

// ─── Build the full registry for all towns ───────────────────────────────────
const _dynamicRegistry = CHOCOBROOK_TOWNS.reduce((acc, town) => {
    acc[town.id] = buildDynamicPackage(town);
    return acc;
}, {} as Record<string, FullTownStoryPackage>);

// ─── Merge manual overrides on top ───────────────────────────────────────────
// Also pull in legacy TownTheaterDirectory entries for backward compatibility
const _legacyMap: Partial<Record<string, Partial<Record<string, LensStoryPackage>>>> = {};
TOWN_THEATER_DIRECTORY.forEach((pkg) => {
    _legacyMap[pkg.townId] = {};
    (['gossip', 'politics', 'economy', 'transport', 'legend'] as const).forEach((lens) => {
        const legacyKey = lens === 'politics' ? 'politics' : lens;
        const story = (pkg.stories as any)[legacyKey] || (pkg.stories as any)['problem'];
        if (!story) return;
        const slides: StorySlide[] = story.paragraphs.map((p: string) => ({
            imageUrl: undefined,
            speaker:  story.narratorName,
            dialogue: p,
        }));
        _legacyMap[pkg.townId]![lens] = {
            title:        story.title,
            synopsis:     story.description,
            narratorName: story.narratorName,
            narratorRole: story.narratorRole,
            slides,
        };
    });
});

// Final merged registry: dynamic base → legacy override → manual override
export const TOWN_STORY_SCRIPTS: Record<string, FullTownStoryPackage> = Object.fromEntries(
    CHOCOBROOK_TOWNS.map((town) => {
        const base   = _dynamicRegistry[town.id];
        const legacy = _legacyMap[town.id] || {};
        const manual = MANUAL_STORY_SCRIPTS[town.id] || {};
        return [town.id, {
            ...base,
            legend:    manual.legend    || legacy.legend    || base.legend,
            gossip:    manual.gossip    || legacy.gossip    || base.gossip,
            politics:  manual.politics  || legacy.politics  || base.politics,
            economy:   manual.economy   || legacy.economy   || base.economy,
            transport: manual.transport || legacy.transport || base.transport,
        }];
    })
);

/** Get the story package for a specific town + lens. Always returns data. */
export function getStoryPackage(townId: string, lensId: 'legend' | 'gossip' | 'politics' | 'economy' | 'transport'): LensStoryPackage {
    const pkg = TOWN_STORY_SCRIPTS[townId];
    if (!pkg) {
        // Deep fallback — town not found
        return {
            title: 'Story Not Found',
            synopsis: 'This story is being written. Check back soon.',
            narratorName: 'The Narrator',
            narratorRole: 'Province Records',
            slides: [{ imageUrl: undefined, speaker: 'The Narrator', dialogue: 'This story has not yet been committed to the chronicles.' }]
        };
    }
    return pkg[lensId];
}
