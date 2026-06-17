// ============================================================
// TOWN POLITICS DATA — Problem/Politics Lens (Story File: Politics Files)
// Covers: unfair laws, rebels, victims, enforcers, whistleblowers
// Used by: SparrowXTheatre, TownConflictSection
// ============================================================

export const TOWN_PROBLEM_CAST: Record<string, { rebel: string; victim: string; enforcer: string; whistleblower: string }> = {
    'toffee-town': { rebel: 'Nella Nudgepot', victim: 'Sticky Steve', enforcer: 'Sheriff Bumblewood', whistleblower: 'Tina Taffywhisper' },
    'eclair-square': { rebel: 'Whiskerton', victim: 'Baker Blanche', enforcer: 'Sir Goldwhistle', whistleblower: 'Puff Pierre' },
    'hazelnut-terrace': { rebel: 'Nella Nudgepot', victim: 'Old Nutkin', enforcer: 'Crumblewise', whistleblower: 'Roasted Rita' },
    'peanut-butter-falls': { rebel: 'Bounce McDrizzle', victim: 'Young Skippy', enforcer: 'Marshal Frill', whistleblower: 'Rapid Rina' },
    'sprinkle-sands': { rebel: 'Bounce McDrizzle', victim: 'Rainbow Ray Jr.', enforcer: 'Marshal Frill', whistleblower: 'Sandy Sparks' },
    'nougat-node': { rebel: 'Bounce McDrizzle', victim: 'Farmer Vanilla', enforcer: 'Marshal Frill', whistleblower: 'Chewy Charlie' },
    'honeycomb-heights': { rebel: 'Lanternella Glowfern', victim: 'Climber Cleo', enforcer: 'Crumblewise', whistleblower: 'Wax Wendy' },
    'butterscotch-bay': { rebel: 'Fisherman Whimsley', victim: 'Dock Danny', enforcer: 'Captain Goldpour', whistleblower: 'Syrup Sue' },
    'brownie-crossroads': { rebel: 'Fisherman Whimsley', victim: 'Caravan Cal', enforcer: 'Marshal Frill', whistleblower: 'Crumb Cassie' },
    'ganache-grove': { rebel: 'Tibbin Quickstep', victim: 'Night Nurse Nina', enforcer: 'Marshal Qrill', whistleblower: 'Gloss Gloria' },
    'peppermint-peak': { rebel: 'Lanternella Glowfern', victim: 'Courier Kit', enforcer: 'Sheriff Bumblewood', whistleblower: 'Frosty Faye' },
    'lava-cake-lake': { rebel: 'Bounce McDrizzle', victim: 'Burned Bobby', enforcer: 'Marshal Qrill', whistleblower: 'Ember Ellie' },
    'cocoa-canyon': { rebel: 'Fisherman Whimsley', victim: 'Canyon Healer Cal', enforcer: 'Professor Finley', whistleblower: 'Cocoa Clara' },
    'creme-tunnels': { rebel: 'Tibbin Quickstep', victim: 'Guide Greta', enforcer: 'Permit Pete', whistleblower: 'Glow-Bug Gina' },
    'praline-port': { rebel: 'Nella Nudgepot', victim: 'Small Trader Sam', enforcer: 'Sir Goldwhistle', whistleblower: 'Dock Daisy' },
    'caramel-cove': { rebel: 'Tibbin Quickstep', victim: 'Young Surfer Syd', enforcer: 'Madam Grimshade', whistleblower: 'Wave Wally' },
};

export const PROBLEM_FUN_FACTS: Record<string, string[]> = {
    'toffee-town': ['The Morning Stretch Parade was supposed to last 10 minutes. It now lasts 47. Nobody knows who extended it—even the Mayor looks confused.', 'Sheriff Bumblewood once stamped 14 people NO WAGES for yawning. He later admitted his clipboard slipped and he did it by complete accident.', 'Sticky Steve tried to skip the parade by hiding inside a toffee barrel. He was found three days later, perfectly preserved.'],
    'eclair-square': ['The Glaze Queue Rule was written on a napkin during a brunch. The napkin is now framed in the courthouse.', 'Baker Blanche once created an eclair so perfect that Sir Goldwhistle skipped his own queue to taste it.', 'The public ovens were once accidentally set to "decorative mode" for a month. Nobody noticed because the eclairs still looked amazing.'],
    'hazelnut-terrace': ['The Harvest First Decree has a clause that allows elite terraces to reject premium nuts if they are "too round." Nobody has ever explained what that means.', 'Old Nutkin cracked a hazelnut so perfectly that it was mistaken for a jewel and briefly stored in the town vault.', 'Crumblewise once sealed an entire terrace because a squirrel looked at him funny. The squirrel was hired as security the next week.'],
    'peanut-butter-falls': ['The Raft Permit Lock requires a 12-page application for a permit that is literally a sticker.', 'Young Skippy once navigated the rapids backward on a dare and arrived faster than the permit boats.', 'The "premium launch lanes" are guarded by collectors who also sell sandwiches — leading to the longest lines in town.'],
    'sprinkle-sands': ['The Color Purity Rule bans mixing sprinkle colors. A child once made a rainbow and was given a formal warning.', 'Rainbow Ray Jr. made a "protest rainbow" out of permitted single-color sprinkles placed very close together. Technically legal, somehow more colorful.', 'Marshal Frill once confiscated a sunset because it had too many colors. He returned it after receiving 400 formal complaints.'],
    'nougat-node': ['The Gold Lane Protocol has blocked a single wagon carrying birthday cake supplies for three consecutive birthdays.', 'Farmer Vanilla\'s crops spoiled so often behind the barricade that he started selling them as "vintage vegetables." They sold out.', 'Bounce McDrizzle flipped exactly one route sign and freed 14 supply wagons. The sign now has its own fan club.'],
    'honeycomb-heights': ['The High Climb Permit costs more than what the honey it lets you collect is worth. It\'s literally a net loss to buy one.', 'Climber Cleo once climbed to a restricted chamber using only her lunch rope and two hairpins. She was fined and also given a medal.', 'Crumblewise sold permits at gala prices so high that the gala itself couldn\'t afford admission to the gala.'],
    'butterscotch-bay': ['The Sunset Dock Fee triples at exactly 6:01 PM. The town clocks are all set to different times, making everyone late for everything.', 'Dock Danny once calculated he spent more on dock fees than on his actual boat. The boat cost twelve Bay Doubloons.', 'Fisherman Whimsley\'s lantern boat parade was so beautiful that the noble ships came to watch—leaving the best berths empty, exactly as planned.'],
    'brownie-crossroads': ['The Crossroad Gate Clock has been wrong since installation. Nobody fixes it because fixing it would prove it was always wrong.', 'Caravan Cal was fined for be "late" but his wagon hadn\'t actually moved yet. The clock was just fast.', 'Marshal Frill once doubled the penalty on a wagon, then realized it was his own resupply delivery. He fined himself and reported himself to himself.'],
    'ganache-grove': ['The Twilight Curfew technically bans owls from hooting after dark. No owl has complied; none have been fined.', 'Night Nurse Nina was stopped for carrying glowing medicine bottles. The patrol thought she was smuggling moonlight.', 'Marshal Qrill once sounded the curfew siren so loudly it woke up the Mayor, who was napping past curfew. Neither acknowledged the irony.'],
    'peppermint-peak': ['The Sled Tax generated enough coins last winter to fill an entire sled. The sled was then taxed.', 'Courier Kit once delivered thirty packages using one sled, paid thirty separate taxes, and received zero receipts.', 'Sheriff Bumblewood posted armed collectors at snow gates. One collector accidentally taxed a snowman. The snowman did not pay.'],
    'lava-cake-lake': ['The Heat License costs more than the healing it grants access to. Getting sick is cheaper than getting treated.', 'Burned Bobby was turned away from the hot springs for not having a heat license. He was literally on fire at the time.', 'Marshal Qrill once sold gold steam bands to tourists who used them as fancy bracelets and never entered the springs.'],
    'cocoa-canyon': ['Rescue rafts pay double toll while VIP pleasure boats glide by in velvet-roped lanes. The rope is literal velvet.', 'Canyon Healer Cal waited so long at the toll that he healed two patients in line before reaching the gate.', 'Professor Finley once granted a toll waiver to his own parrot. The parrot did not need medical attention but was wearing a very small hat.'],
    'creme-tunnels': ['The Vein Access Decree requires premium permits for central routes. The permits are printed on cream-colored paper, which dissolves in the cream tunnels.', 'Guide Greta memorized every blocked route and now gives tours of the blockades themselves. They are surprisingly popular.', 'Tibbin Quickstep published a map of blocked lanes that became the town\'s best-selling souvenir. The authorities couldn\'t ban it because it listed only their own checkpoints.'],
    'praline-port': ['Import tax waivers require a signature from Sir Goldwhistle, who is famously never at his desk. His desk has a permanent "Out for Payday" sign.', 'Small Trader Sam once tried to reduce his customs fee by declaring his pralines as "nut-shaped art." It worked until someone ate one.', 'Nella Nudgepot compiled a fee-gap ledger so detailed that even Sir Goldwhistle said, "Well, THAT\'s embarrassing."'],
    'caramel-cove': ['The Surf Permit Lottery uses a golden wheel that has never once stopped on a non-noble name. The wheel might be magnetic. Nobody has checked.', 'Young Surfer Syd won a practice slot by pretending to be a noble\'s pet dolphin trainer. He surfed for 47 minutes before being discovered.', 'Tibbin Quickstep recorded the full draw and played it backward. It spelled out "we pick winners in advance." Nobody has confirmed this.'],
    'dark-bliss-borough': ['The Midnight Curfew Pass requires a moon-stamped badge. The moon stamp is available only during the day, when you don\'t need it.', 'Night Baker Ned was fined for baking bread at night. His defense: "When else would a NIGHT baker bake?" The judge had no answer.', 'Lanternella Glowfern\'s playful lantern march attracted so many spectators that the patrol couldn\'t get through the crowd to stop it.'],
};

export const TROUBLE_HEADLINES = ['Breaking Drama', 'Emergency Meeting Called', 'Citizens Outraged', 'Council in Chaos', 'New Rule Backfires', 'Whispers of Revolt', 'Town Hall Panic', 'The Great Dispute', 'Law Under Review', 'Rally at the Square', 'Petition Filed', 'Rebel Spark', 'Tension Rising', 'Order vs Freedom', 'The People Speak', 'Frontline Report', 'Justice Delayed', 'The Last Straw'];

import { TOWN_CONFLICTS } from './townConflicts';

export interface TheatreCastMember {
    role: string;
    name: string;
    color: string;
    textColor: string;
    icon: string;
}

export const POLITICS_THEATRE_DATA: Record<string, {
    cast: TheatreCastMember[];
    synopsis: string;
    sneakPeek: { speaker: string; text: string }[];
}> = Object.keys(TOWN_PROBLEM_CAST).reduce((acc, townId) => {
    const pCast = TOWN_PROBLEM_CAST[townId];
    const facts = PROBLEM_FUN_FACTS[townId] || [];
    const conflict = TOWN_CONFLICTS[townId];
    const townName = townId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

    acc[townId] = {
        cast: [
            { role: 'The Rebel',      name: pCast.rebel,         color: 'from-rose-400 to-red-500',     textColor: 'text-rose-300',   icon: '✊' },
            { role: 'The Victim',     name: pCast.victim,        color: 'from-orange-400 to-amber-500', textColor: 'text-orange-300', icon: '😢' },
            { role: 'The Enforcer',   name: pCast.enforcer,      color: 'from-violet-400 to-purple-500',textColor: 'text-violet-300', icon: '🛡' },
            { role: 'Whistleblower',  name: pCast.whistleblower, color: 'from-cyan-400 to-teal-500',   textColor: 'text-cyan-300',   icon: '📢' },
        ],
        synopsis: conflict?.unfairLaw || `A pressing conflict shapes daily life in ${townName}. The people are rising.`,
        sneakPeek: [
            { speaker: pCast.rebel,         text: facts[0] || 'The rules here have gone too far.' },
            { speaker: pCast.whistleblower, text: facts[1] || 'Someone needs to speak the truth.' },
        ],
    };
    return acc;
}, {} as Record<string, any>);
