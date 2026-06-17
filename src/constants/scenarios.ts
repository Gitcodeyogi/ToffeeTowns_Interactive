
export const GAME_SCENARIOS = {
    chuckleMemory: {
        rebels: [
            "The Baker hid the pie recipe in the record vault. Match the cards to find it!",
            "Scattered blueprints of the bakery vault. Find the matching halves!",
            "Old legends say the pie recipe is hidden in matching symbols. Decode them.",
            "The cows are hiding in the herd. Identify the matching patterns to calm them down.",
            "Mix and match the cow's favorite snacks to negotiate peace.",
            "The cows have secret demands written in code. Match the symbols to read them."
        ],
        bosses: [
            "Witnesses saw the thief! Match the suspect sketches to catch the culprit.",
            "Clues left behind! Match the footprints to the rebel shoes.",
            "Recover the stolen pie fragments (digitally). Match the pieces!",
            "Organize the cattle records. Duplicate entries are causing chaos!",
            "Match the cow tags to the owner list. Order must be restored.",
            "Identify the rebel cows by matching their unique spots."
        ]
    },
    chuckleTown: {
        rebels: [
            "The bakery is guarded. Who has the stealth to sneak in?",
            "The window is too high. Who is agile enough to climb?",
            "A guard is watching the pie. Who can create a distraction?",
            "The cows demand a negotiator. Who speaks 'Moo' best?",
            "A fence needs jumping. Who has the highest jump?",
            "The bull is angry. Who is brave enough to calm him?"
        ],
        bosses: [
            "The window was forced open. Who has the strength to fix it?",
            "We need a guard for the night shift. Who is the most alert?",
            "Interrogate the witnesses. Who is the most intimidating?",
            "The herd is blocking the road. Who can move them by force?",
            "Repair the fence! Who has the construction skills?",
            "Negotiations failed. Who can wrestle a steer?"
        ]
    },

    // EXPANDED GAME SCENARIOS
    chuckleBall: {
        rebels: ["Score the winning goal for the Rebels!", "Dribble past the Boss defense!", "Precision shot required to hit the target."],
        bosses: ["Block every shot! Defense is key.", "Intercept the Rebel passes.", "Clear the ball from the danger zone."]
    },
    chuckleChase: {
        rebels: ["Outrun the Sheriff's patrol!", "Collect coins while evading capture.", "Reach the safe house before time runs out."],
        bosses: ["Deploy roadblocks to stop the runner.", "Corner the Rebel in the alley.", "Recover the stolen coins!"]
    },
    chuckleNinja: {
        rebels: ["Slice the fruit, not the bombs!", "Master the art of stealth.", "Defeat the Dojo Master."],
        bosses: ["Defend the Dojo from intruders.", "Set traps for the clumsy ninjas.", "Prove your mastery of the blade."]
    },
    chuckleTycoon: {
        rebels: ["Build a pie empire from scratch.", "Outsell the corporate bakery.", "Manage resources to feed the town."],
        bosses: ["Acquire all the small businesses.", "Enforce the pie tax.", "Monopolize the sugar supply."]
    },
    characterCrush: {
        rebels: ["Match 3 brave heroes to attack.", "Create a combo to break the wall.", "Clear the jelly to find the map."],
        bosses: ["Match 3 minions to build a fort.", "Create obstacles for the player.", "Spread the slime to cover the board."]
    },
    characterMatch: {
        rebels: ["Find the matching hero cards.", "Memorize the formation.", "Clear the board quickly!"],
        bosses: ["Confuse the player with decoys.", "Shuffle the deck constantly.", "Hide the boss cards well."]
    },
    characterShuffle: {
        rebels: ["Follow the Ace of Spades.", "Don't lose track of the key card.", "Pick the winner!"],
        bosses: ["Swap the cards faster than the eye can see.", "It's all a sleight of hand.", "Trick the player into picking the Joker."]
    },
    characterSmash: {
        rebels: ["Smash the approaching minions!", "Protect the base from the horde.", "Use the power-up to clear the screen."],
        bosses: ["Overwhelm the defenses.", "Send in the tank units.", "Smash the rebel base!"]
    },
    bubblePopRescue: {
        rebels: ["Pop the bubbles to free the pets!", "Aim for the support beam.", "Clear the ceiling!"],
        bosses: ["Reinforce the bubble trap.", "Add concrete bubbles.", "Don't let them rescue the pets."]
    },
    bubbleArchery: {
        rebels: ["Hit the bullseye!", "Split the arrow for double points.", "Wind is strong, adjust your aim."],
        bosses: ["Move the target!", "Block the arrows with shields.", "Distract the archer."]
    },
    geometryTower: {
        rebels: ["Stack the blocks to reach the moon!", "Balance is key.", "Don't let it topple!"],
        bosses: ["Shake the foundation.", "Throw uneven blocks.", "Knock it down!"]
    },
    guessWho: {
        rebels: ["Ask the right questions to find the spy.", "Is it the one with the hat?", "Narrow down the suspects."],
        bosses: ["Hide your identity.", "Give vague answers.", "Blend in with the crowd."]
    },
    whoSaidIt: {
        rebels: ["Match the quote to the hero.", "Who shouted 'Freedom'?", "Test your lore knowledge."],
        bosses: ["Misquote the heroes.", "Confuse the history books.", "Spread propaganda."]
    },
    royalWhispers: {
        rebels: ["Decipher the King's secret message.", "Pass the message without distortion.", "Spread the truth."],
        bosses: ["Start a rumor.", "Corrupt the message chain.", "Silence the whisperers."]
    },
    sprocketsScramble: {
        rebels: ["Fix the machine before it explodes!", "Connect the gears.", "Oil the rusty parts."],
        bosses: ["Sabotage the engine.", "Remove key gears.", "Throw a wrench in the works."]
    },
    treetopDash: {
        rebels: ["Jump from branch to branch!", "Don't look down.", "Reach the canopy."],
        bosses: ["Shake the tree.", "Send the squirrels to attack.", "Chop it down!"]
    },
    whiskertonsPath: {
        rebels: ["Guide the cat home.", "Avoid the dogs.", "Find the treats."],
        bosses: ["Unleash the hounds.", "Hide the trail.", "Set the mouse trap."]
    },
    coloringGame: {
        rebels: ["Paint the town red... and green!", "Stay inside the lines.", "Express your creativity."],
        bosses: ["Greyscale everything.", "Ban the color yellow.", "Spill the black ink."]
    },
    chuckleDebate: {
        rebels: [
            "Convince the Mayor to lower the pie tax!",
            "Debate Sheriff Stoutwood on the definition of 'loitering'.",
            "Win the crowd's support for the upcoming festival.",
            "Argue for the right to party!"
        ],
        bosses: [
            "Justify the new curfew to the angry mob.",
            "Explain why the bridge toll has doubled.",
            "Convince the town that silence is golden.",
            "Debunk the rebels' 'fun' propaganda."
        ]
    }
};

export const getScenario = (gameKey: string, side: 'bosses' | 'rebels', _level: number) => {
    const pool = GAME_SCENARIOS[gameKey as keyof typeof GAME_SCENARIOS]?.[side];
    if (!pool || pool.length === 0) return "Win the game to advance your cause!";

    // RANDOM SELECTION Logic
    const randomIndex = Math.floor(Math.random() * pool.length);
    return pool[randomIndex];
};
