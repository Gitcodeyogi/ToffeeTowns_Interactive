// ============================================================
// TOFFEE TOWN — Drama Stage Story Content
// World 2: The full cinematic expansion of what World 1 previews.
//
// ARCHITECTURE RULE:
//   - Synopsis/description = pulled LIVE from World 1 constants.
//   - Scene dialogues     = funny expanded narratives that DEEPEN World 1.
//   - imageUrl            = ONLY thing unique to World 2 (Firebase URL or local dev path).
//
// HOW TO ADD YOUR IMAGES:
//   Dev:  imageUrl: '/assets/stories/toffee-town/legend/01.png'
//   Prod: imageUrl: 'https://firebasestorage.googleapis.com/v0/b/YOUR_APP/o/...?alt=media&token=...'
//   Replace the placeholder string per scene as you illustrate and upload each image.
// ============================================================

import type { TownStories } from '../storyTypes';
import { TOWN_LEGENDS, TOWN_CAST } from '../townLegends';
import { TOWN_CONFLICTS, TOWN_GOSSIPS } from '../town_details';
import { TOWN_ECONOMY_NOTES } from '../economy';
import { TOWN_TRANSPORT_LORE } from '../transport_lore';
import { TOWN_LEGEND_LORE } from '../legend_lore';
import { CHOCOBROOK_TOWNS } from '../towns';

// Pull World 1 data — if any of these change in World 1, World 2 automatically reflects it
const townId   = 'toffee-town';
const town     = CHOCOBROOK_TOWNS.find(t => t.id === townId)!;
const cast     = TOWN_CAST[townId];
const legend   = TOWN_LEGENDS[townId] || '';
const legendL  = TOWN_LEGEND_LORE[townId];
const conflict = TOWN_CONFLICTS[townId];
const gossips  = TOWN_GOSSIPS[townId] || [];
const eco      = TOWN_ECONOMY_NOTES[town?.name || 'Toffee Town'];
const transL   = TOWN_TRANSPORT_LORE[townId];

// Placeholder image — used for all scenes until you add real Firebase URLs.
// Replace per-scene as you create and upload your illustrations.
const IMG = town?.image || '/wallpapers/toffee-town-main.png';

export const toffeeTownStories: TownStories = {

    // ─── LEGEND ──────────────────────────────────────────────────────────────
    // World 1 preview: Town Legend section shows the TOWN_LEGENDS text + Sacred Tree + motto
    // World 2 expansion: The FULL animated story of how the fountain was born
    legend: {
        title: 'Grand Fountain Origins',
        // Synopsis pulled live from World 1 — change TOWN_LEGENDS['toffee-town'] and this updates automatically
        description: legendL
            ? `${legend} ${legendL.pastStruggle} Yet today — ${legendL.modernTriumph}`
            : legend || 'The legend of Toffee Town begins with a single, glorious Tuesday.',
        scenes: [
            {
                imageUrl: IMG, // Replace: '/assets/stories/toffee-town/legend/01.png'
                title: 'Scene 01 — The Barren Plains',
                description: 'Before Toffee Town, there was nothing sweet here at all.',
                dialogues: [
                    { speaker: 'Town Narrator', text: 'Before Toffee Town had its famous Grand Caramel Fountain, it was just... rock. Boring, grey, completely flavorless rock. The pigeons had evaluated the situation and relocated to a nice patch of peanut brittle two provinces over.' }
                ]
            },
            {
                imageUrl: IMG, // Replace: '/assets/stories/toffee-town/legend/02.png'
                title: 'Scene 02 — The Sugar-Mage Arrives',
                description: 'A stranger arrives with a spoon and a plan.',
                dialogues: [
                    { speaker: cast?.head?.split(' ')[0] || 'Mayor', text: `The ancient records say she arrived on a Tuesday. A very unremarkable Tuesday. She had one chipped wooden spoon, a pocket full of raw cane seeds, and the calm expression of someone who had absolutely figured something out.` }
                ]
            },
            {
                imageUrl: IMG, // Replace: '/assets/stories/toffee-town/legend/03.png'
                title: 'Scene 03 — Three Strikes',
                description: 'A wooden spoon changes everything.',
                dialogues: [
                    { speaker: cast?.carpenter?.split(' ')[0] || 'Pella', text: 'She walked to the EXACT centre of the plains and struck the rock three times with her spoon! Three! I have been using hammers my whole career and never once considered a spoon. I am professionally embarrassed and personally inspired.' }
                ]
            },
            {
                imageUrl: IMG, // Replace: '/assets/stories/toffee-town/legend/04.png'
                title: 'Scene 04 — The Golden Geyser',
                description: 'The ground cracks and the world changes forever.',
                dialogues: [
                    { speaker: 'Town Narrator', text: 'On the third strike, the ground CRACKED. From beneath the grey, flavorless crust erupted a geyser of pure golden caramel — warm, sweet, and smelling of something that could only be described as "buttered happiness with a hint of everything being okay."' }
                ]
            },
            {
                imageUrl: IMG, // Replace: '/assets/stories/toffee-town/legend/05.png'
                title: 'Scene 05 — The First Dance',
                description: 'A town is born in a shower of golden sweetness.',
                dialogues: [
                    { speaker: cast?.painter?.split(' ')[0] || 'Bo', text: 'The citizens RAN out and danced in the golden rain! I was not there — I was not born yet — but I have painted seventeen versions of this moment, and they are all masterpieces. The Fountain is proof that sometimes, glory starts with one person, one spoon, and one very stubborn Tuesday.' }
                ]
            },
        ]
    },

    // ─── GOSSIP ──────────────────────────────────────────────────────────────
    // World 1 preview: TownGossipSection shows the gossip lines from TOWN_GOSSIPS + character portraits
    // World 2 expansion: The full scene-by-scene drama of The Great Mayor Tea Incident
    gossip: {
        title: 'Mayor\'s Salted Secret',
        // Synopsis pulled live from World 1 gossip data
        description: gossips[0] || 'The kind of morning secret that reshapes a town\'s entire understanding of its leadership.',
        scenes: [
            {
                imageUrl: IMG, // Replace: '/assets/stories/toffee-town/gossip/01.png'
                title: 'Scene 01 — An Ordinary Morning',
                description: 'Every great secret begins with someone seeing something they absolutely should not have seen.',
                dialogues: [
                    { speaker: cast?.carpenter?.split(' ')[0] || 'Pella', text: 'I was just a carpenter doing perfectly normal carpenter things at 11 AM. ELEVEN AM. An entirely reasonable hour. Nobody can morally blame me for what I witnessed next.' }
                ]
            },
            {
                imageUrl: IMG, // Replace: '/assets/stories/toffee-town/gossip/02.png'
                title: 'Scene 02 — The Decanter Disaster',
                description: 'The Mayor reaches for his morning sugar... and grabs something else entirely.',
                dialogues: [
                    { speaker: cast?.carpenter?.split(' ')[0] || 'Pella', text: 'He grabbed the SEA-SALT. The artisan crystallised sea-salt the Tide-Merchants brought in yesterday. Three HEAPS of it. Into his chamomile. I watched with the frozen expression of someone who knows they absolutely cannot un-see what they are currently seeing.' }
                ]
            },
            {
                imageUrl: IMG, // Replace: '/assets/stories/toffee-town/gossip/03.png'
                title: 'Scene 03 — The First Sip',
                description: 'The moment of impact.',
                dialogues: [
                    { speaker: cast?.carpenter?.split(' ')[0] || 'Pella', text: 'He took a MASSIVE gulp. His face did something I can only describe as "internal architecture failing." His moustache appeared to rotate clockwise by approximately forty degrees. I hid behind the pillar and held my breath for seven entire minutes.' }
                ]
            },
            {
                imageUrl: IMG, // Replace: '/assets/stories/toffee-town/gossip/04.png'
                title: 'Scene 04 — The Recovery Operation',
                description: 'Emergency sugarcane deployment.',
                dialogues: [
                    { speaker: gossips[0] ? cast?.head?.split(' ')[0] || 'Mayor' : 'Town Narrator', text: 'The Mayor retreated to his office with an entire stick of raw sugarcane to "recalibrate his tastebuds." The official town record notes he was "conducting taste-based quality research." The pigeons outside his window knew the truth. They always do.' }
                ]
            },
            {
                imageUrl: IMG, // Replace: '/assets/stories/toffee-town/gossip/05.png'
                title: 'Scene 05 — The Secret Spreads',
                description: 'A secret in Toffee Town never stays secret very long.',
                dialogues: [
                    { speaker: 'Town Narrator', text: gossips[1] || 'By afternoon, the entire bakery district had somehow heard every detail. Nobody knew how. That\'s the thing about whispers in Toffee Town — they travel faster than the delivery carts and arrive even stickier.' }
                ]
            },
        ]
    },

    // ─── POLITICS ────────────────────────────────────────────────────────────
    // World 1 preview: TownConflictSection shows conflict.unfairLaw, harmedCitizen, rebels
    // World 2 expansion: The full comedy-drama of The Morning Stretch Tax and the people's glorious revolt
    politics: {
        title: 'The Stretch Revolt',
        // Synopsis pulled live from World 1 — change conflict.unfairLaw and this updates automatically
        description: conflict?.unfairLaw
            ? `${conflict.unfairLaw} ${conflict.harmedCitizen || ''}`
            : 'A regulation so baffling it united an entire town in cheerful defiance.',
        scenes: [
            {
                imageUrl: IMG, // Replace: '/assets/stories/toffee-town/politics/01.png'
                title: 'Scene 01 — A Normal Wednesday',
                description: 'It started, as so many things do, with a notice board.',
                dialogues: [
                    { speaker: 'Town Narrator', text: 'It was a perfectly normal Wednesday morning in Toffee Town. The birds were singing. The canals were flowing. And then someone pinned a new notice to the board, and nothing was ever perfectly normal again.' }
                ]
            },
            {
                imageUrl: IMG, // Replace: '/assets/stories/toffee-town/politics/02.png'
                title: 'Scene 02 — The Notice',
                description: 'The regulation in full.',
                dialogues: [
                    // Directly uses World 1 conflict data — change it there, changes here automatically
                    { speaker: 'Town Narrator', text: `The notice read: "${conflict?.unfairLaw || 'A new tax has been introduced. Please do not panic.'}". Below it, in tiny letters: "This is for the good of everyone." Below THAT, in even tinier letters: "Please do not panic."` }
                ]
            },
            {
                imageUrl: IMG, // Replace: '/assets/stories/toffee-town/politics/03.png'
                title: 'Scene 03 — The Outrage',
                description: 'The citizens have opinions. Loud ones.',
                dialogues: [
                    // Uses harmedCitizen from World 1 — change it there, changes here automatically
                    { speaker: 'Old Baker Millicent', text: conflict?.harmedCitizen || 'I have stretched every morning for sixty-seven years! My back REQUIRES it! My spine is not a luxury item!' },
                    { speaker: 'Old Baker Millicent', text: 'I will stretch. I will stretch MAGNIFICENTLY. And if they come for my coins, they will have to catch me first — which, given my excellent morning stretch routine, they absolutely will NOT.' }
                ]
            },
            {
                imageUrl: IMG, // Replace: '/assets/stories/toffee-town/politics/04.png'
                title: 'Scene 04 — The Mayor\'s Explanation',
                description: 'The Mayor attempts to explain. It does not go well.',
                dialogues: [
                    { speaker: cast?.head?.split(' ')[0] || 'Mayor', text: conflict?.mayorAction || 'Someone stretched VERY dramatically near the Toffee Vats during Batch 7. There was a sound. Fourteen workers were startled. The Batch 7 spillage cost us eight hundred coins. I maintain this regulation is entirely proportionate.' },
                    { speaker: cast?.head?.split(' ')[0] || 'Mayor', text: 'The policy is sound. The policy is reasonable. The policy is—' },
                    { speaker: 'Pella', text: '...currently being ignored by eight hundred and forty-seven people?' }
                ]
            },
            {
                imageUrl: IMG, // Replace: '/assets/stories/toffee-town/politics/05.png'
                title: 'Scene 05 — The Great 7:59 AM Stretch',
                description: 'The town responds with perfect choreography.',
                dialogues: [
                    // Uses rebels from World 1 data
                    { speaker: conflict?.rebels?.split(' ')[0] || 'Rebel Leader', text: conflict?.chucklebopAction || 'We shall STRETCH AT DAWN. All of us. Together. With choreography. They cannot tax all of us. Probably.' },
                    { speaker: 'Town Narrator', text: 'The following morning, 847 citizens stretched simultaneously at 7:59 AM. The tax collector\'s quill snapped clean in half. By lunchtime, the Morning Stretch Tax was gone. By dinner, everyone stretched at 8:01 in celebration. Nobody was taxed. It was the finest minute in Toffee Town history.' }
                ]
            },
        ]
    },

    // ─── ECONOMY ────────────────────────────────────────────────────────────
    // World 1 preview: TownEconomySection shows localTrade, currency, trade stability
    // World 2 expansion: The full documentary comedy of the Sugar-Bond financial system
    economy: {
        title: 'Gilded Caramel Bonds',
        // Synopsis pulled live from World 1 — change eco.localTrade and this updates automatically
        description: eco?.localTrade || 'Where every bar of toffee is a financial instrument, and the auditors check for teeth marks.',
        scenes: [
            {
                imageUrl: IMG, // Replace: '/assets/stories/toffee-town/economy/01.png'
                title: 'Scene 01 — The Market at 4 AM',
                description: 'The Toffee Town Market never sleeps. Or rather, the traders never sleep.',
                dialogues: [
                    { speaker: 'Town Narrator', text: 'The Toffee Town Market opens at 4 AM. Why 4 AM? Because the best traders wake up early, the caramel is freshest before sunrise, and the competitive merchants of this town simply cannot nap. Sleeping in is economically inefficient and they all know it.' }
                ]
            },
            {
                imageUrl: IMG, // Replace: '/assets/stories/toffee-town/economy/02.png'
                title: 'Scene 02 — The Sugar-Bond',
                description: 'The world\'s stickiest financial instrument.',
                dialogues: [
                    // Uses World 1 economy data
                    { speaker: cast?.head?.split(' ')[0] || 'Carrow', text: 'Every bar of premium hard-crack toffee is serialised, gold-leafed, and stored in the Mint Vault as a financial instrument. We call it the Sugar-Bond. It is genius. It is also delicious. There are teeth marks on precisely zero of them. The auditors check.' }
                ]
            },
            {
                imageUrl: IMG, // Replace: '/assets/stories/toffee-town/economy/03.png'
                title: 'Scene 03 — The Hazelnut Deal',
                description: 'The stickiest deal in provincial history.',
                dialogues: [
                    { speaker: cast?.head?.split(' ')[0] || 'Carrow', text: 'Five hundred crates of slow-roasted hazelnuts per month, in exchange for storing Hazelnut Terrace\'s entire wealth in liquid caramel assets. The accountants called it "the stickiest deal in provincial history." I had that put on a plaque.' }
                ]
            },
            {
                imageUrl: IMG, // Replace: '/assets/stories/toffee-town/economy/04.png'
                title: 'Scene 04 — A Confused New Investor',
                description: 'Modern finance, explained in toffee.',
                dialogues: [
                    { speaker: 'New Investor', text: 'So... my retirement savings are... a candy bar. In a vault. That I cannot touch. That is wrapped in gold. That has its own serial number. And I receive a quarterly certificate with a scratch-and-sniff caramel sticker attached.' },
                    { speaker: cast?.head?.split(' ')[0] || 'Carrow', text: 'Several clients have framed their certificates. We call the returns "emotionally adequate." The sticker smells wonderful.' }
                ]
            },
            {
                imageUrl: IMG, // Replace: '/assets/stories/toffee-town/economy/05.png'
                title: 'Scene 05 — The Closing Bell',
                description: 'Every market day ends the same delicious way.',
                dialogues: [
                    { speaker: 'Town Narrator', text: `At 3 PM, the Market bell rings three times. All trading stops. Everyone eats something sweet. The ${eco?.currency || 'Cocoa Coin'} is the official currency — but everyone in this town has silently agreed that caramel is worth more. Nobody has written this down. Nobody needs to.` }
                ]
            },
        ]
    },

    // ─── TRANSPORT ───────────────────────────────────────────────────────────
    // World 1 preview: TownTransportSection shows CHOCOBROOK_TRANSPORT_ATLAS routes + transport lore
    // World 2 expansion: The full comic documentary of the Caramel Canal system
    transport: {
        title: 'Cinnamon Gondola Crossings',
        // Synopsis pulled live from World 1 transport lore — change transport_lore.ts and this updates
        description: transL?.overview || 'The stickiest, most serene way to travel through the province.',
        scenes: [
            {
                imageUrl: IMG, // Replace: '/assets/stories/toffee-town/transport/01.png'
                title: 'Scene 01 — The Canal System',
                description: 'An engineering marvel. Also a personal learning experience.',
                dialogues: [
                    { speaker: cast?.scientist?.split(' ')[0] || 'Rumi', text: 'The Caramel Canal system spans four point seven kilometres. The caramel is maintained at exactly 115 degrees — warm enough to flow smoothly, not warm enough to be immediately dangerous. I have tested both thresholds personally. The second threshold was not voluntary.' }
                ]
            },
            {
                imageUrl: IMG, // Replace: '/assets/stories/toffee-town/transport/02.png'
                title: 'Scene 02 — The Gondola',
                description: 'Engineering. Definitely engineering.',
                dialogues: [
                    { speaker: 'Gondolier Otto', text: 'These gondolas are hollowed fossilised wafers, treated with hydrophobic glaze. The poles are cinnamon. This is NOT whimsy. This is engineering. Stop smiling. The poles work perfectly and happen to smell wonderful, which is a COINCIDENTAL benefit of good material science.' }
                ]
            },
            {
                imageUrl: IMG, // Replace: '/assets/stories/toffee-town/transport/03.png'
                title: 'Scene 03 — The Lane Warning',
                description: 'A public safety announcement from Dr. Rumi.',
                dialogues: [
                    { speaker: cast?.scientist?.split(' ')[0] || 'Rumi', text: 'Do NOT trail your fingers in the water. The Sleep-Ducks have claimed this lane. They have very strong opinions about personal space and lane etiquette. I have the bite marks to prove it. The full medical report is classified, for everyone\'s dignity, including mine.' }
                ]
            },
            {
                imageUrl: IMG, // Replace: '/assets/stories/toffee-town/transport/04.png'
                title: 'Scene 04 — The Sleep-Duck',
                description: 'The canal\'s unofficial authority.',
                dialogues: [
                    { speaker: 'The Sleep-Duck', text: '...' },
                    { speaker: 'Town Narrator', text: 'The Sleep-Duck has registered your presence. The Sleep-Duck finds your presence acceptable — for now. The Sleep-Duck requests that you do not splash.' }
                ]
            },
            {
                imageUrl: IMG, // Replace: '/assets/stories/toffee-town/transport/05.png'
                title: 'Scene 05 — Journey\'s End',
                description: 'The dock. Slightly sticky. Intentionally.',
                dialogues: [
                    { speaker: 'Gondolier Otto', text: 'Welcome to the Toffee Town Dock. Watch your step — the dock is slightly sticky. Always has been. Engineers classified it as "structurally intentional adhesion." We disagreed. We submitted a report. They submitted a counter-report. The dock remains sticky. It is probably fine. Please enjoy your visit.' }
                ]
            },
        ]
    },

};
