// ============================================================
// HAZELNUT TERRACE — Drama Stage Story Content
//
// Gossip lens: 11 real scene images from public/stories/Nutwood County/hazelnut_terrace/Gossipfiles/images/
// Other lenses: fallback to town image until illustrations are created.
// ============================================================

import type { TownStories } from '../storyTypes';
import { CHOCOBROOK_TOWNS } from '../towns';
import { TOWN_CAST } from '../townLegends';
import { TOWN_CONFLICTS } from '../town_details';
import { TOWN_ECONOMY_NOTES } from '../economy';
import { TOWN_TRANSPORT_LORE } from '../transport_lore';
import { TOWN_LEGEND_LORE } from '../legend_lore';
import { TOWN_LEGENDS } from '../townLegends';

const townId = 'hazelnut-terrace';
const town   = CHOCOBROOK_TOWNS.find(t => t.id === townId)!;
const cast   = TOWN_CAST[townId];
const IMG    = town?.image || '/towns/hazelnut-terrace.png';

// ─── Gossip-specific image base path ──────────────────────────────────────────
const G = (n: number) =>
    `/stories/Nutwood%20County/hazelnut_terrace/Gossipfiles/images/Scene_${n}.png`;

const conflict  = TOWN_CONFLICTS[townId];
const eco       = TOWN_ECONOMY_NOTES[town?.name || 'Hazelnut Terrace'];
const transL    = TOWN_TRANSPORT_LORE[townId];
const legendL   = TOWN_LEGEND_LORE?.[townId];
const legendTxt = TOWN_LEGENDS[townId] || '';

export const hazelnutTerraceStories: TownStories = {

    // ─── LEGEND ──────────────────────────────────────────────────────────────
    legend: {
        title: 'Ancient Oak Echoes',
        description: legendL
            ? `${legendTxt} ${legendL.pastStruggle || ''} Yet today — ${legendL.modernTriumph || ''}`
            : legendTxt || 'A sacred oak that cracks its own nuts by moonlight. No one has ever caught it in the act — but everyone has heard it.',
        scenes: [
            {
                imageUrl: IMG,
                title: 'Scene 01 — The Ancient Summit',
                description: 'At the crest of the highest terrace stands a tree unlike any other.',
                dialogues: [{ speaker: 'Folklore Records', text: "At the very summit of Hazelnut Terrace stands the Golden Praline Oak — older than the county, wider than a market stall, and possessed of an attitude the locals describe as 'dignified but smug.'" }],
            },
            {
                imageUrl: IMG,
                title: 'Scene 02 — The Harvest Moon',
                description: 'Once a year, something remarkable happens.',
                dialogues: [{ speaker: cast?.head?.split(' ')[0] || 'Brann', text: "Every harvest moon, the old tree creaks. Then a sound — CRACK — like a whip. By morning, perfectly roasted hazelnuts are scattered across all four terraces. No one has ever seen it happen. I have sat on that hill all night, twice. I always fall asleep at the exact wrong moment." }],
            },
            {
                imageUrl: IMG,
                title: 'Scene 03 — The Roasted Blessing',
                description: 'The gift that built a town.',
                dialogues: [{ speaker: cast?.carpenter?.split(' ')[0] || 'Nix', text: 'The first settlers found the terraces bare. Nothing grew. Then the Oak cracked open its first batch. The settlers built their homes where the nuts landed. That is why Hazelnut Terrace has the exact peculiar layout it does. Town planning by falling nut.' }],
            },
            {
                imageUrl: IMG,
                title: 'Scene 04 — The Modern Terrace',
                description: 'From a single tree, an industry was born.',
                dialogues: [{ speaker: cast?.scientist?.split(' ')[0] || 'Opal', text: 'I have tested the soil composition under the Oak. The underground caramel seam feeds its roots. The tree does not merely grow hazelnuts — it roasts them internally. We have published four papers. The Oak has not commented.' }],
            },
            {
                imageUrl: IMG,
                title: 'Scene 05 — The Unbroken Tradition',
                description: 'A legend that still keeps its secrets.',
                dialogues: [{ speaker: 'Folklore Records', text: 'The Golden Praline Oak is the quiet guardian of these terraces. It asks nothing. It takes nothing. And every harvest moon, it gives everything. The story of Hazelnut Terrace is, in many ways, the story of a very generous, remarkably mysterious tree.' }],
            },
        ],
    },

    // ─── GOSSIP ─────────────────────────────────────────────────────────────
    // Full 11-scene story with real images from /public/stories/...
    gossip: {
        title: 'Nutcracker\'s Secret Whispers',
        description: "A high-stakes whisper in the breezy terraces of Nutwood County. Someone knows where the golden acorns are buried.",
        scenes: [
            {
                imageUrl: G(1),
                title: 'Scene 01 — The Whispering Orchards',
                description: 'An introduction to the heart of Nutwood County.',
                dialogues: [
                    { speaker: 'Provincial Guide', text: "In the rolling green heart of Nutwood County, Hazelnut Terrace doesn't just grow crops; it powers the Chocolate Era." },
                    { speaker: 'Provincial Guide', text: 'Cradled in terraced hills, the town gathers around a grand hazelnut fountain alive with trade.' },
                ],
            },
            {
                imageUrl: G(2),
                title: 'Scene 02 — The Basement Vault',
                description: 'Deep within the roots of the terrace, a secret is revealed.',
                dialogues: [{ speaker: 'Shadow Paw', text: "Look here. This isn't just a map of the grove. It's the entire County layout." }],
            },
            {
                imageUrl: G(3),
                title: 'Scene 03 — The Balcony Reveal',
                description: 'The true scale of the Nut Elevator is finally seen.',
                dialogues: [{ speaker: 'The Great Nutcracker', text: 'You thought you could hide from the laws of sweetness?' }],
            },
            {
                imageUrl: G(4),
                title: 'Scene 04 — The Golden Grove',
                description: 'Searching for the legendary crop foundations.',
                dialogues: [{ speaker: 'Haze the Squirrel', text: 'The light is different here. It feels like the ground itself is breathing sweetness.' }],
            },
            {
                imageUrl: G(5),
                title: 'Scene 05 — The Shadow Market',
                description: "Trading whispers in the dark corners of the square.",
                dialogues: [{ speaker: 'The Whisperer', text: "The economy isn't built on nuts alone, traveler. It's built on who knows who is hungry." }],
            },
            {
                imageUrl: G(6),
                title: 'Scene 06 — Terrace Turmoil',
                description: 'The Bosses exert their influence over the harvest.',
                dialogues: [{ speaker: 'Clan Rebel', text: "The Bosses think they own the sun because they own the silos. We say the sweetness belongs to the terrace!" }],
            },
            {
                imageUrl: G(7),
                title: 'Scene 07 — The Nut Elevator',
                description: 'Witnessing the massive vertical transport system.',
                dialogues: [{ speaker: 'Engineer Oak', text: "She's at full capacity tonight. Every nut is a ticket to Toffee Town." }],
            },
            {
                imageUrl: G(8),
                title: 'Scene 08 — Canal Crossing',
                description: 'Dangerous waters and precious cargo.',
                dialogues: [{ speaker: 'Boatman Barley', text: "Keep your head down. The water has ears, and the Bosses have boats." }],
            },
            {
                imageUrl: G(9),
                title: 'Scene 09 — The Vault Entrance',
                description: 'Cracking the code of the Hazelnut Foundation.',
                dialogues: [{ speaker: 'Shadow Paw', text: "One more click and the history of this town changes forever." }],
            },
            {
                imageUrl: G(10),
                title: 'Scene 10 — The Great Reveal',
                description: 'The hidden hoard of the Nutcracker is found.',
                dialogues: [{ speaker: 'The Great Nutcracker', text: "You've finally arrived. But knowing the secret is only half the battle." }],
            },
            {
                imageUrl: G(11),
                title: 'Scene 11 — Conclusion of Whispers',
                description: 'The Terrace returns to its sunlit quiet, for now.',
                dialogues: [{ speaker: 'Provincial Guide', text: "The story rests, but the roots remain. Hazelnut Terrace continues to power the world's sweetness." }],
            },
        ],
    },

    // ─── POLITICS ───────────────────────────────────────────────────────────
    politics: {
        title: 'The Shelling Dispute',
        description: conflict?.unfairLaw
            ? `${conflict.unfairLaw} ${conflict.harmedCitizen || ''}`
            : 'A decree so absurd it united the most stoic nut-farmers in the province.',
        scenes: [
            { imageUrl: IMG, title: 'Scene 01 — The Notice Board', description: 'An ordinary morning. A devastating notice.', dialogues: [{ speaker: 'Town Narrator', text: `The Harvest First Decree arrived on a perfectly bright Tuesday. It was four paragraphs long and managed to be simultaneously confusing, infuriating, and completely unverifiable.` }] },
            { imageUrl: IMG, title: 'Scene 02 — The Decree', description: 'The regulation in full.', dialogues: [{ speaker: 'Town Narrator', text: `"${conflict?.unfairLaw || 'The top crates go to elite terraces first. Always.'}"` }] },
            { imageUrl: IMG, title: 'Scene 03 — Old Nutkin Speaks', description: 'The veteran farmer refuses to be silent.', dialogues: [{ speaker: 'Old Nutkin', text: conflict?.harmedCitizen || "I have farmed this terrace for forty years. My nuts are not a lower tier. My nuts have won awards. The kind with ribbons." }] },
            { imageUrl: IMG, title: 'Scene 04 — The Enforcer', description: 'Crumblewise takes the situation personally.', dialogues: [{ speaker: 'Crumblewise', text: conflict?.mayorAction || "The Decree is clear. The elite terraces must receive first allocation. Squirrels who disagree may file form HR-7 in triplicate." }] },
            { imageUrl: IMG, title: "Scene 05 — Nella's Rebellion", description: 'The rebel farmers organize.', dialogues: [{ speaker: 'Nella Nudgepot', text: conflict?.chucklebopAction || "We deliver everything simultaneously, at exactly the same moment, from every terrace. They cannot sort what arrives all at once. It is not defiance. It is logistics." }] },
        ],
    },

    // ─── ECONOMY ─────────────────────────────────────────────────────────────
    economy: {
        title: 'Gilded Harvest Fortune',
        description: eco?.localTrade || 'Where every crate of hazelnuts carries a barcode, a story, and a faint scent of the underground caramel seam.',
        scenes: [
            { imageUrl: IMG, title: 'Scene 01 — Dawn at the Terrace Market', description: 'The market that never waits for sunrise.', dialogues: [{ speaker: 'Market Narrator', text: "The Hazelnut Terrace market opens before the birds. The birds have tried to complain. The market simply opens earlier." }] },
            { imageUrl: IMG, title: 'Scene 02 — The Crate System', description: 'Precision logistics powered by centuries of tradition.', dialogues: [{ speaker: 'Rollo Crunchwell', text: "Every crate is weighed, graded, stamped, and given a personality rating. Grade A is 'Excellent.' Grade B is 'Dependable.' Grade C is labeled 'Character-Rich' and sells surprisingly well to artisan shops." }] },
            { imageUrl: IMG, title: 'Scene 03 — The Nut Elevator Deal', description: 'The single route that built an economy.', dialogues: [{ speaker: 'Hazel Barterdale', text: "The Nut Elevator to Nougat Node moves three thousand crates a week. Toffee Town is on the line Tuesdays and Thursdays. We send nuts. They send caramel. It is the sweetest trade deal in provincial history and nobody wrote a song about it, which is a genuine cultural failure." }] },
            { imageUrl: IMG, title: 'Scene 04 — Terri Nutgrove on the Underground Seam', description: 'The geological secret.', dialogues: [{ speaker: 'Terri Nutgrove', text: "The oldest trees on this terrace tap an underground caramel seam. Their roots go down forty metres. We do not touch the seam. We do not need to. We simply plant near it and let the earth do what it has always done." }] },
            { imageUrl: IMG, title: 'Scene 05 — The Harvest Bell', description: "Evening. The day's trade tallied.", dialogues: [{ speaker: 'Market Narrator', text: `The Harvest Bell rings at sunset. Traders pack up. Farmers count crates. And somewhere beneath the terraces, the caramel seam continues its ancient, sweet, entirely unbothered work.` }] },
        ],
    },

    // ─── TRANSPORT ───────────────────────────────────────────────────────────
    transport: {
        title: 'Highland Crane Ascents',
        description: transL?.overview || 'The single most reliable piece of infrastructure in the province, according to everyone who depends on it and maintains anxious feelings about it.',
        scenes: [
            { imageUrl: IMG, title: 'Scene 01 — Arrival at the Terrace', description: 'Getting here is already an achievement.', dialogues: [{ speaker: 'Route Narrator', text: "To reach Hazelnut Terrace, you travel by rail along the Praline Pass. The scenery is magnificent. The bends are aggressive. The engineer has confirmed the track is perfectly safe. The engineer has also confirmed she has not looked down in twelve years." }] },
            { imageUrl: IMG, title: 'Scene 02 — The Nut Elevator', description: 'Legend in engineering form.', dialogues: [{ speaker: 'Station Master', text: "The Nut Elevator is one hundred and fourteen metres of vertical rail, powered by a counterweight system that has not been updated since the Caramel Compression of 1887. It works flawlessly. We have decided not to discuss why." }] },
            { imageUrl: IMG, title: 'Scene 03 — Capacity', description: 'A system under pressure.', dialogues: [{ speaker: 'Engineer Oak', text: "She runs at full capacity Tuesday through Friday. The crates know their schedule. I have seen crates arrive at the platform independently. I filed a report. The crates were not available for comment." }] },
            { imageUrl: IMG, title: 'Scene 04 — The River Gorge Road', description: 'The road less travelled, for good reason.', dialogues: [{ speaker: 'Local Guide', text: `"${transL?.travelerSightseeing || 'The gorge road offers the finest views in the province and the worst road surface in three counties. Bring good wheels, better nerves, and approximately double the travel time you believe is necessary.'}"` }] },
            { imageUrl: IMG, title: 'Scene 05 — Departure at Midnight', description: "The convoy rolls.", dialogues: [{ speaker: 'Station Master', text: "The midnight convoy leaves from Platform Two. The express leaves at dawn. Miss both, and you are welcome to enjoy Hazelnut Terrace for another day. Most visitors who have been delayed agree it is not the worst outcome imaginable." }] },
        ],
    },

};
