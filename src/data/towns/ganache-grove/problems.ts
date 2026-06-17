export interface TownActivity {
  id: string;
  title: string;
  category: 'project' | 'mystery' | 'health' | 'market' | 'trade';
  description: string;
  requirementsSummary: string;
  costCheck: (inventory: any, coins: number) => boolean;
  execute: (inventory: any, coins: number) => {
    deductions: { coins: number; inventory: Record<string, number> };
    xp: { skill: string; amount: number };
    legacy: number;
    consequenceTitle: string;
    consequenceText: string;
    unlockedIncidentId?: string; // Links to the next evolved stage of the story
  };
  stage?: number; // 1, 2, or 3
  townReactionBefore?: string; // Initial reaction/dialogue from town residents
  parentIncidentId?: string; // Reference to the origin incident in the chain
}

export const problems: TownActivity[] = [
  // ─── CHAIN A: THE GREAT CANOPY WALKWAY & THE STOLEN KEY ───────────────────
  {
    id: 'walkway',
    title: 'Support Walkway Project',
    category: 'project',
    stage: 1,
    townReactionBefore: 'Forester Sir Goldwhistle reports that visitors are sinking into the chocolate mud pits near the East Canopy.',
    description: 'Help rebuild the elevated visitors path over deep mud pits.',
    requirementsSummary: 'Requires 2 Wood or 15 Coins',
    costCheck: (inv, coins) => (inv.wood || 0) >= 2 || coins >= 15,
    execute: (inv, _coins) => {
      const usesWood = (inv.wood || 0) >= 2;
      return {
        deductions: {
          coins: usesWood ? 0 : 15,
          inventory: (usesWood ? { wood: 2 } : {}) as Record<string, number>
        },
        xp: { skill: 'builder', amount: 25 },
        legacy: 20,
        consequenceTitle: 'Walkway Project Supported! 🌲',
        consequenceText: 'You contributed resources to repair the Great Forest Walkway. It is now open, but Sir Goldwhistle notes it cuts through a sacred root where canopy squirrels nest!',
        unlockedIncidentId: 'walkway_squirrels'
      };
    }
  },
  {
    id: 'walkway_squirrels',
    title: 'Relocate Canopy Squirrels',
    category: 'project',
    stage: 2,
    parentIncidentId: 'walkway',
    townReactionBefore: 'Baker Mortimer warns: "Hyperactive squirrels are nesting on the new handrails and pelting visitors with hard cocoa pods!"',
    description: 'Safely trap and relocate the hyperactive squirrels to the lower grove thicket.',
    requirementsSummary: 'Requires 1 Moss or 10 Coins',
    costCheck: (inv, coins) => (inv.moss || 0) >= 1 || coins >= 10,
    execute: (inv, _coins) => {
      const usesMoss = (inv.moss || 0) >= 1;
      return {
        deductions: {
          coins: usesMoss ? 0 : 10,
          inventory: (usesMoss ? { moss: 1 } : {}) as Record<string, number>
        },
        xp: { skill: 'healer', amount: 20 },
        legacy: 15,
        consequenceTitle: 'Squirrels Relocated! 🐿️',
        consequenceText: 'You lured the squirrels into soft moss baskets and carried them to the lower thicket. As they left, they dropped a shiny, ancient key they had been hoarding!',
        unlockedIncidentId: 'stolen_key_mystery'
      };
    }
  },
  {
    id: 'stolen_key_mystery',
    title: 'Unlock the Forgotten Hatch',
    category: 'mystery',
    stage: 3,
    parentIncidentId: 'walkway',
    townReactionBefore: 'Ranger Olive Pine notices: "A heavy golden metal hatch has been uncovered beneath the roots where the squirrels nested."',
    description: 'Investigate the old belfry hatch using the shiny key dropped by the squirrels.',
    requirementsSummary: 'Requires 5 Coins',
    costCheck: (_inv, coins) => coins >= 5,
    execute: () => {
      return {
        deductions: { coins: 5, inventory: {} as Record<string, number> },
        xp: { skill: 'explorer', amount: 30 },
        legacy: 25,
        consequenceTitle: 'Ancient Archives Discovered! 🔑',
        consequenceText: 'The key fits perfectly! Inside the hatch, you find water-resistant archives of pre-flood cocoa recipes. Baker Mortimer is ecstatic!'
      };
    }
  },

  // ─── CHAIN B: THE MOSS SNEEZLES EPIDEMIC ──────────────────────────────────
  {
    id: 'sneezles',
    title: 'Moss Sneezles Campaign',
    category: 'health',
    stage: 1,
    townReactionBefore: 'Dr. Cedric Oakenhart warns: "Moss Sneezles cases are rising! We must warn residents against hugging damp cocoa trees."',
    description: 'Print and distribute pamphlets warning residents against tree hugging.',
    requirementsSummary: 'Requires 1 Parchment or 5 Coins',
    costCheck: (inv, coins) => (inv.parchment || 0) >= 1 || coins >= 5,
    execute: (inv) => {
      const usesParchment = (inv.parchment || 0) >= 1;
      return {
        deductions: {
          coins: usesParchment ? 0 : 5,
          inventory: (usesParchment ? { parchment: 1 } : {}) as Record<string, number>
        },
        xp: { skill: 'healer', amount: 25 },
        legacy: 15,
        consequenceTitle: 'Pamphlet Campaign Completed! 💊',
        consequenceText: 'Pamphlets distributed! However, Dr. Oakenhart reports the sneezles aren\'t standard allergies—they are caused by a glowing spore cluster!',
        unlockedIncidentId: 'fungus_control'
      };
    }
  },
  {
    id: 'fungus_control',
    title: 'Neutralize Glow-Spore Clusters',
    category: 'health',
    stage: 2,
    parentIncidentId: 'sneezles',
    townReactionBefore: 'Mayor Truffle is worried: "Spore clouds in Sector 4 are causing residents to sneeze green glowing dust at midnight!"',
    description: 'Help the clinic sweep and neutralize the glowing fungus clusters.',
    requirementsSummary: 'Requires 1 Mucus or 10 Coins',
    costCheck: (inv, coins) => (inv.mucus || 0) >= 1 || coins >= 10,
    execute: (inv, _coins) => {
      const usesMucus = (inv.mucus || 0) >= 1;
      return {
        deductions: {
          coins: usesMucus ? 0 : 10,
          inventory: (usesMucus ? { mucus: 1 } : {}) as Record<string, number>
        },
        xp: { skill: 'healer', amount: 20 },
        legacy: 15,
        consequenceTitle: 'Spores Neutralized! 🍄',
        consequenceText: 'Using snail mucus as a coagulant, you neutralized the spore clusters. But we realize these mushrooms were the main diet of the Glowcap Snails!',
        unlockedIncidentId: 'snail_sanctuary'
      };
    }
  },
  {
    id: 'snail_sanctuary',
    title: 'Establish Snail Refuge',
    category: 'project',
    stage: 3,
    parentIncidentId: 'sneezles',
    townReactionBefore: 'Baker Mortimer screams: "Without their fungi, a massive migration of hungry snails is heading directly for my flour storehouse!"',
    description: 'Construct a fenced organic refuge with relocation signs to divert the snails.',
    requirementsSummary: 'Requires 2 Wood or 15 Coins',
    costCheck: (inv, coins) => (inv.wood || 0) >= 2 || coins >= 15,
    execute: (inv, _coins) => {
      const usesWood = (inv.wood || 0) >= 2;
      return {
        deductions: {
          coins: usesWood ? 0 : 15,
          inventory: (usesWood ? { wood: 2 } : {}) as Record<string, number>
        },
        xp: { skill: 'builder', amount: 30 },
        legacy: 25,
        consequenceTitle: 'Snail Sanctuary Completed! 🐌',
        consequenceText: 'Fences set up and snails relocated! The flour is saved, and the snails are happily eating wild weeds, balancing the local ecosystem.'
      };
    }
  },

  // ─── CHAIN C: CARGO FLOW & MARKET DEMANDS ─────────────────────────────────
  {
    id: 'dredging',
    title: 'Dredge River Route',
    category: 'trade',
    stage: 1,
    townReactionBefore: 'Gondolier Otto complains: "Silt deposits are blocking the cargo boats carrying cocoa butter downstream."',
    description: 'Clear mud silt blocking cargo boats heading to Caramel Cove.',
    requirementsSummary: 'Requires 3 Wood or 20 Coins',
    costCheck: (inv, coins) => (inv.wood || 0) >= 3 || coins >= 20,
    execute: (inv) => {
      const usesWood = (inv.wood || 0) >= 3;
      return {
        deductions: {
          coins: usesWood ? 0 : 20,
          inventory: (usesWood ? { wood: 3 } : {}) as Record<string, number>
        },
        xp: { skill: 'explorer', amount: 30 },
        legacy: 20,
        consequenceTitle: 'River Route Dredged! 🛶',
        consequenceText: 'Silt cleared! Cargo boats flow again, but the rapid clearance has put a massive strain on the lower molasses locks.',
        unlockedIncidentId: 'locks_reinforcement'
      };
    }
  },
  {
    id: 'locks_reinforcement',
    title: 'Reinforce Molasses Locks',
    category: 'project',
    stage: 2,
    parentIncidentId: 'dredging',
    townReactionBefore: 'Operator Crumblewise reports: "The thick molasses lock gate has cracked under the increased cargo pressure!"',
    description: 'Reinforce the heavy lock gate with metal bolts or coins.',
    requirementsSummary: 'Requires 1 Bolts or 10 Coins',
    costCheck: (inv, coins) => (inv.bolts || 0) >= 1 || coins >= 10,
    execute: (inv, _coins) => {
      const usesBolts = (inv.bolts || 0) >= 1;
      return {
        deductions: {
          coins: usesBolts ? 0 : 10,
          inventory: (usesBolts ? { bolts: 1 } : {}) as Record<string, number>
        },
        xp: { skill: 'builder', amount: 20 },
        legacy: 15,
        consequenceTitle: 'Lock Gate Reinforced! ⚙️',
        consequenceText: 'You reinforced the hinges. The water level has stabilized, but we now have a backlog of 3 massive carts of cocoa pods ready for delivery.',
        unlockedIncidentId: 'delivery'
      };
    }
  },
  {
    id: 'delivery',
    title: 'Express Pod Delivery',
    category: 'trade',
    stage: 3,
    parentIncidentId: 'dredging',
    townReactionBefore: 'Capital Representative Tiber Reedwell requests: "Our confectioners are begging for the backlogged cocoa pods. Deliver them now!"',
    description: 'Transport fresh Ganache Pods directly to the Toffee Town confection market.',
    requirementsSummary: 'Requires 2 Wood & 10 Coins',
    costCheck: (inv, coins) => (inv.wood || 0) >= 2 && coins >= 10,
    execute: () => {
      return {
        deductions: { coins: 10, inventory: { wood: 2 } as Record<string, number> },
        xp: { skill: 'builder', amount: 25 },
        legacy: 20,
        consequenceTitle: 'Pods Delivered! 🍫',
        consequenceText: 'Your cargo cart arrived in record time! Capital confectioners are turning out premium holiday batches and praise your diligence.'
      };
    }
  },

  // ─── STANDALONE MATTERS ───────────────────────────────────────────────────
  {
    id: 'bell',
    title: 'Investigate Midnight Bell',
    category: 'mystery',
    description: 'Why is the old forest bell ringing at midnight with nobody nearby?',
    requirementsSummary: 'Requires 5 Coins',
    costCheck: (_inv, coins) => coins >= 5,
    execute: () => {
      return {
        deductions: { coins: 5, inventory: {} as Record<string, number> },
        xp: { skill: 'explorer', amount: 25 },
        legacy: 15,
        consequenceTitle: 'Midnight Bell Mystery Solved! 🔔',
        consequenceText: 'You climbed the old belfry and caught three squirrels playing with the heavy hemp rope! You secured the door and carried them down safely.'
      };
    }
  },
  {
    id: 'festival',
    title: 'Sponsor Harvest Festival',
    category: 'market',
    description: 'Fund the square decoration and velvet cocoa cream tasting stalls.',
    requirementsSummary: 'Requires 25 Coins',
    costCheck: (_inv, coins) => coins >= 25,
    execute: () => {
      return {
        deductions: { coins: 25, inventory: {} as Record<string, number> },
        xp: { skill: 'builder', amount: 30 },
        legacy: 30,
        consequenceTitle: 'Harvest Festival Sponsored! 🥳',
        consequenceText: 'You sponsored the Ganache Harvest Festival! The town square is filled with celebration and the aroma of chocolate cream buns.'
      };
    }
  },
  {
    id: 'glowcap',
    title: 'Glowcap Snail Survey',
    category: 'mystery',
    description: 'Track the trails of glowing slime chewing through ancient roots.',
    requirementsSummary: 'Requires 5 Coins',
    costCheck: (_inv, coins) => coins >= 5,
    execute: () => {
      return {
        deductions: { coins: 5, inventory: {} as Record<string, number> },
        xp: { skill: 'explorer', amount: 25 },
        legacy: 15,
        consequenceTitle: 'Glowcap Snail Sighted! 🐌',
        consequenceText: 'You traced the glowing tracks and found rare forest snails feeding on root bark. You relocated them to the swamp sanctuary.'
      };
    }
  }
];
