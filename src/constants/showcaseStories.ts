import { CHOCOBROOK_TOWNS, CHOCOBROOK_ZONES, TOWN_ZONE_BY_ID } from './towns';

type ShowcaseSlide = {
    id: string;
    title: string;
    description: string;
    imageUrl: string;
    infoLines: { label: string; value: string; colorClass: string }[];
};

type LandingStoryRow = {
    id: string;
    townId: string;
    townName: string;
    countyName: string;
    title: string;
    status: string;
};

type LandingTheatreRow = {
    id: string;
    countyName: string;
    title: string;
    lens: string;
    runtime: string;
};

const TOWN_STORY_LABELS = [
    'The Lantern Ledger',
    'The Sugarline Secret',
    'The Midnight Procession',
    'The Whispering Market',
    'The Velvet Oath',
    'The Borderlight Chronicle',
    'The Ember Dispatch',
    'The Moonlit Decree',
];

const COUNTY_THEATRE_TITLES: Record<number, { title: string; lens: string; runtime: string }> = {
    1: { title: 'The Orchard Crown', lens: 'Chronicle', runtime: '8:10' },
    2: { title: 'The Frostmint Accord', lens: 'Ballad', runtime: '7:35' },
    3: { title: 'The Molten Banner', lens: 'Epic', runtime: '8:45' },
    4: { title: 'The Golden Tide Decree', lens: 'Showcase', runtime: '7:58' },
};

export const townStorySlides: ShowcaseSlide[] = CHOCOBROOK_TOWNS.map((town, index) => {
    const countyName = TOWN_ZONE_BY_ID[town.id]?.zoneName ?? 'ChocoBrook Province';
    const storyLabel = TOWN_STORY_LABELS[index % TOWN_STORY_LABELS.length];

    return {
        id: town.id,
        title: `${town.name}: ${storyLabel}`,
        description: `${town.miniCaption}. ${town.description}`,
        imageUrl: town.image,
        infoLines: [
            { label: 'County', value: countyName.replace(' County', ''), colorClass: 'text-amber-300' },
            { label: 'Story Pulse', value: town.activity, colorClass: 'text-cyan-300' },
        ],
    };
});

export const countyTheatreSlides: ShowcaseSlide[] = CHOCOBROOK_ZONES.map((zone) => {
    const zoneTownIds = zone.townIds as readonly string[];
    const leadTown = CHOCOBROOK_TOWNS.find((town) => zoneTownIds.includes(town.id)) ?? CHOCOBROOK_TOWNS[0];
    const config = COUNTY_THEATRE_TITLES[zone.zoneNumber];
    const highlightedTowns = CHOCOBROOK_TOWNS
        .filter((town) => zoneTownIds.includes(town.id))
        .slice(0, 3)
        .map((town) => town.name)
        .join(' • ');

    return {
        id: String(zone.zoneNumber),
        title: `${zone.zoneName}: ${config.title}`,
        description: `${zone.zoneDescription}. Featuring ${highlightedTowns}.`,
        imageUrl: leadTown.image,
        infoLines: [
            { label: 'Format', value: config.lens, colorClass: 'text-pink-300' },
            { label: 'Focus', value: zone.zoneDescription, colorClass: 'text-yellow-300' },
        ],
    };
});

export const landingStoryRows: LandingStoryRow[] = townStorySlides.map((slide) => ({
    id: slide.id,
    townId: slide.id,
    townName: CHOCOBROOK_TOWNS.find((town) => town.id === slide.id)?.name ?? slide.title,
    countyName: TOWN_ZONE_BY_ID[slide.id]?.zoneName ?? 'ChocoBrook Province',
    title: slide.title,
    status: 'Live',
}));

export const landingTheatreRows: LandingTheatreRow[] = CHOCOBROOK_ZONES.map((zone) => {
    const config = COUNTY_THEATRE_TITLES[zone.zoneNumber];
    return {
        id: String(zone.zoneNumber),
        countyName: zone.zoneName,
        title: config.title,
        lens: config.lens,
        runtime: config.runtime,
    };
});
