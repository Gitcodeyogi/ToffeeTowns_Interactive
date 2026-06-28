export interface ResidencyRiddle {
  question: string;
  options: string[];
  answer: string;
  hint: string;
}

export interface ResidencyTaskDetails {
  instructions: string;
  reviewer: string;
  reviewResponse: string;
  funFact: string;
  riddle: ResidencyRiddle;
}

export const RESIDENCY_TASK_DATABASE: Record<string, ResidencyTaskDetails> = {
  // ─── CLASSROOM / SEMINARS ───
  'Structural Carpentry': {
    instructions: 'Study the load bearing limits of various timber types and learn key joining techniques used to secure structural joints.',
    reviewer: 'Rowan the Carpenter',
    reviewResponse: 'Superb carpentry work! The joint stability matches the designs of the High Belfry. You have a great hand for timber.',
    funFact: 'Glazed Redwood trees absorb sugar deposits from the forest floor, making their wood exceptionally dense and naturally resistant to rot!',
    riddle: {
      question: 'What is the most stable wood-to-wood joint for load-bearing frameworks without using metal bolts?',
      options: [
        'Mortise and Tenon joint',
        'Simple butt joint with wood glue',
        'Overlapping rope lashings',
        'Splice joint with tree sap'
      ],
      answer: 'Mortise and Tenon joint',
      hint: 'This traditional joint interlocking male and female wood components distributes shear stress naturally across the grain.'
    }
  },
  'Valley Navigation': {
    instructions: 'Learn to read celestial maps, decipher compass anomalies caused by ore deposits, and identify safe travel paths through the deep bogs.',
    reviewer: 'Professor Crumblewise',
    reviewResponse: 'Excellent calculations! You navigated the anomalies and plotted a path that trims travel times by nearly a quarter.',
    funFact: 'Toffee Town\'s magnetic fields fluctuate based on the caramel flow under the crust, sometimes shifting north by up to three degrees!',
    riddle: {
      question: 'To plot a straight route across the valley and preserve exact local bearings on a map, which projection is best?',
      options: [
        'Conformal Mercator projection',
        'Equal-area cylindrical sketch',
        'Polar stereographic projection',
        'Isometric landscape grid'
      ],
      answer: 'Conformal Mercator projection',
      hint: 'Navigators rely on conformal maps because they preserve angles locally, ensuring compass headings point in the right direction.'
    }
  },
  'Geothermal Sanitizer': {
    instructions: 'Study clinical hygiene principles, calculate safe dilution ratios of forest sanitizing acids, and prepare recovery herbal baths.',
    reviewer: 'Dr. Cedric Oakenhart',
    reviewResponse: 'Meticulous work! The clinic cots are fully sterilized, and the sanitizing mixture has no harsh chemical residue.',
    funFact: 'Citric sanitizing acid is derived from wild sour limes that grow near the bubbling soda springs of Banoffee Valley!',
    riddle: {
      question: 'To sterilize clinical cots safely without damaging organic canvas threads, what is the maximum recommended concentration of citric acid in water?',
      options: [
        '20% acid dilution (4 parts water, 1 part acid)',
        '80% acid dilution (1 part water, 4 parts acid)',
        '100% pure undiluted citric acid',
        '1% acid dilution (99 parts water, 1 part acid)'
      ],
      answer: '20% acid dilution (4 parts water, 1 part acid)',
      hint: 'The Academy guidebook warns that anything stronger than a 1:4 acid ratio will erode organic canvas fibers.'
    }
  },

  // ─── LANDMARKS / PLACES ACTIVITIES ───
  'Submit Civic Request': {
    instructions: 'File expansion plans at the Town Hall. Lay down blueprints for the municipal plaza and verify foundation alignments.',
    reviewer: 'Sir Goldwhistle',
    reviewResponse: 'The blueprint filings are clean and registered. Our planning committee is impressed by your neat drafting lines.',
    funFact: 'Toffee Town\'s original layout was drafted by a baker who used sugar cubes to model the cottage blocks!',
    riddle: {
      question: 'When submitting civic blueprints, which indicator shows the correct load-bearing alignment for stone arches?',
      options: [
        'The keystone center-line alignment',
        'The foundation outer baseline',
        'The decorative cornice layout',
        'The mortar thickness ratio'
      ],
      answer: 'The keystone center-line alignment',
      hint: 'Arches distribute weight outward and downward from their highest central stone, making it the critical alignment marker.'
    }
  },
  'Attend Builder Basics': {
    instructions: 'Participate in structural workshops to master chocolate mortar mixing, timber framing, and drafting essentials.',
    reviewer: 'Winston the Foreman',
    reviewResponse: 'You matched the mortar consistency perfectly today. You are ready for high-strength bricklaying.',
    funFact: 'Chocolate mortar uses powdered cocoa butter as a binding agent, allowing it to remain flexible during frost!',
    riddle: {
      question: 'What binder is added to traditional chocolate mortar to prevent cracking during winter frost cycles?',
      options: [
        'Pulverized cocoa butter powder',
        'Granulated white cane sugar',
        'Extracted glow-spore nectar',
        'Damp swamp mud'
      ],
      answer: 'Pulverized cocoa butter powder',
      hint: 'High-fat binders provide elasticity, allowing the mortar joints to expand and contract without shearing.'
    }
  },
  'Help Unload Cargo': {
    instructions: 'Assist Nigel at the Forest Rail Station. Log cargo manifests, handle heavy storage containers, and stack supplies.',
    reviewer: 'Nigel the Station Master',
    reviewResponse: 'Thanks for the muscle! The railway schedule is back on track, and all cacao crates are verified.',
    funFact: 'Cocoawood County\'s cargo trains run on steam generated by filtering hot spring water through toasted hazelnut shells!',
    riddle: {
      question: 'To secure heavy cargo crates on the flatbed wagons against side-slips, what is the optimal tie-down angle for straps?',
      options: [
        '45 degrees from horizontal',
        '90 degrees (straight vertical)',
        '10 degrees (almost flat)',
        'Loose loop wrapping'
      ],
      answer: '45 degrees from horizontal',
      hint: 'A 45-degree angle distributes tension evenly between vertical hold-down force and horizontal slip resistance.'
    }
  },
  'Deliver Medical Herbs': {
    instructions: 'Harvest fresh medical herbs and prepare clean deliveries for Dr. Cedric Oakenhart\'s healing clinic.',
    reviewer: 'Dr. Cedric Oakenhart',
    reviewResponse: 'Ah, this lavender and mint is of premium grade! My patients will sleep soundly tonight. Thank you.',
    funFact: 'Wild lavender blossoms glow slightly in the dark when they reach full potency, making nocturnal harvesting popular!',
    riddle: {
      question: 'At what time of day do wild medicinal herbs contain the highest concentration of volatile healing oils?',
      options: [
        'Early morning, just as the dew dries',
        'Scorching midday heat',
        'Heavy evening downpours',
        'Dusk, right as the sun sets'
      ],
      answer: 'Early morning, just as the dew dries',
      hint: 'Sunlight and heat evaporate delicate aromatic oils, while night moisture dilutes them. The morning sweet-spot is ideal.'
    }
  },
  'Clean Medical Cots': {
    instructions: 'Prepare clean linen, sanitize the recovery room cots, and brew warm honey-chamomile tea for recovering patients.',
    reviewer: 'Hazel the Apothecary',
    reviewResponse: 'A very tidy clinic! The patients are resting peacefully in a clean, dust-free environment.',
    funFact: 'Honey-chamomile tea has been shown to reduce Moss Sneezle recovery times by almost two days!',
    riddle: {
      question: 'Which compound in honey serves as a natural antiseptic to soothe patient throats during recover?',
      options: [
        'Organic hydrogen peroxide enzymes',
        'Saccharin sugar crystals',
        'Citric cleaning acid',
        'Fungal spore extracts'
      ],
      answer: 'Organic hydrogen peroxide enzymes',
      hint: 'Bees secrete glucose oxidase into honey, which slowly releases tiny germ-killing concentrations of hydrogen peroxide.'
    }
  },
  'Study Herbalism': {
    instructions: 'Study the botanical properties of forest flora in old academy archives to identify antidote plants.',
    reviewer: 'Professor Crumblewise',
    reviewResponse: 'A brilliant botanical report! Your catalog of antidote roots is a valuable addition to our library.',
    funFact: 'The Academy archives contain scrolls that are over three centuries old, written on dried giant palm leaves!',
    riddle: {
      question: 'To counteract the spores of the glowing forest mushroom, which botanical root is the most effective antidote?',
      options: [
        'Dried Licorice Orchid root',
        'Glowcap mushroom stem',
        'Damp pine needles',
        'Toasted hazelnut husks'
      ],
      answer: 'Dried Licorice Orchid root',
      hint: 'Licorice Orchid compounds bind to the fungal spore coatings, neutralizing their respiratory irritation.'
    }
  },
  'Help Clear Trails': {
    instructions: 'Prune wild forest thickets, repair broken guideposts, and inspect path walkways in Mossberry Park.',
    reviewer: 'Ranger Olive Pine',
    reviewResponse: 'Great work! The trails are safe and clear for the hikers. No more mud-sink incidents today.',
    funFact: 'Mossberry guideposts are painted with a glow-in-the-dark sugar paste that feeds birds while guiding hikers!',
    riddle: {
      question: 'What is the standard clearance width for county hiking trails to ensure multi-person safety passes?',
      options: [
        '5 feet (60 inches)',
        '2 feet (24 inches)',
        '12 feet (144 inches)',
        '8 inches'
      ],
      answer: '5 feet (60 inches)',
      hint: 'This width allows two hikers wearing cargo backpacks to pass each other comfortably without stepping off the trail.'
    }
  },

  // ─── RESIDENCY HOME MATTERS / PROJECTS ───
  'Support Walkway Project': {
    instructions: 'Contribute resources to build a solid wooden walkway over the deep chocolate mud pits at East Canopy.',
    reviewer: 'Sir Goldwhistle',
    reviewResponse: 'Brilliant bridge construction! The planks are secure, and visitors are crossing safely.',
    funFact: 'Canopy squirrels communicate by thumping cocoa pods against hollow tree trunks in rhythmic beats!',
    riddle: {
      question: 'What is the main engineering challenge when building wooden walkways over wet chocolate clay?',
      options: [
        'Soil shifting and pile settling',
        'Wood dry-rot from hot air',
        'High wind speeds at ground level',
        'Lack of building timber'
      ],
      answer: 'Soil shifting and pile settling',
      hint: 'The clay is highly plastic and shifts when wet, requiring vertical anchor piles to reach deep solid shale.'
    }
  },
  'Relocate Canopy Squirrels': {
    instructions: 'Safely trap the squirrels on the handrails using soft moss baskets and carry them to the lower grove.',
    reviewer: 'Ranger Olive Pine',
    reviewResponse: 'Thank you! The squirrels are happy in their new home, and the handrails are completely clear.',
    funFact: 'Canopy squirrels are hoarders by nature, often keeping shiny metals, keys, and glossy marbles in their tree-hollow nests!',
    riddle: {
      question: 'Which food bait is most attractive to canopy squirrels to lure them into relocation baskets?',
      options: [
        'Toasted sugared hazelnut kernels',
        'Fresh damp green moss',
        'Sour citric berries',
        'Dry pine bark'
      ],
      answer: 'Toasted sugared hazelnut kernels',
      hint: 'These squirrels are highly motivated by high-energy, sweet, oil-rich nuts over basic forest foliage.'
    }
  },
  'Unlock the Forgotten Hatch': {
    instructions: 'Use the key dropped by the squirrels to open the heavy ancient hatch under the roots of the Great Canopy.',
    reviewer: 'Professor Crumblewise',
    reviewResponse: 'A legendary find! The ancient baking records inside the belfry are completely readable and intact.',
    funFact: 'The Forgotten Hatch was sealed during the Great Molasses Flood to protect the town\'s original archives!',
    riddle: {
      question: 'How were historical scrolls in the Forgotten Hatch protected from humidity and rot over the centuries?',
      options: [
        'Sealed in beeswax-coated leather pouches',
        'Submerged in liquid sugar syrups',
        'Wrapped in basic forest leaves',
        'Kept in iron cages open to the damp air'
      ],
      answer: 'Sealed in beeswax-coated leather pouches',
      hint: 'Beeswax creates an airtight, water-resistant seal that prevents damp air and fungal spores from decaying parchment.'
    }
  },
  'Moss Sneezles Campaign': {
    instructions: 'Print informative flyers warning the townsfolk about hugging damp, spore-ridden cocoa trees.',
    reviewer: 'Dr. Cedric Oakenhart',
    reviewResponse: 'Excellent layout and delivery! The community is now well-informed and taking precautions.',
    funFact: 'Moss Sneezle spores attach to clothing fibers and are triggered by the warmth of home fireplaces!',
    riddle: {
      question: 'When printing community warnings, what color ink is historically reserved for medical alerts in Cocoawood County?',
      options: [
        'Vibrant Amber-Yellow',
        'Dark Coal-Black',
        'Deep Forest-Green',
        'Bright Cherry-Red'
      ],
      answer: 'Vibrant Amber-Yellow',
      hint: 'Yellow ink on dark parchment mimics the glowing warning patterns of forest fireflies, drawing immediate attention.'
    }
  },
  'Neutralize Glow-Spore Clusters': {
    instructions: 'Use snail mucus coagulant to sweep and neutralize glowing spore clusters in Sector 4.',
    reviewer: 'Hazel the Apothecary',
    reviewResponse: 'Outstanding decontamination! The glow-spores have been clumped together and safely disposed of.',
    funFact: 'Glowcap Snails consume neutralized spore clusters, transforming them into a brilliant, non-toxic glowing slime!',
    riddle: {
      question: 'Why does snail mucus serve as an effective coagulant for sweeping fine airborne spores?',
      options: [
        'It has sticky glycoprotein chains that trap particles',
        'It is highly acidic and dissolves the spores',
        'It evaporates quickly, leaving dry powder',
        'It repels spores magnetically'
      ],
      answer: 'It has sticky glycoprotein chains that trap particles',
      hint: 'Glycoproteins form a thick, gelatinous lattice that physically binds small particles on contact.'
    }
  },
  'Establish Snail Refuge': {
    instructions: 'Build fences and organic shelters to guide the migrating Glowcap Snails to a safe forest sanctuary.',
    reviewer: 'Winston the Foreman',
    reviewResponse: 'The sanctuary is beautiful! The snails are settling in, and Baker Mortimer\'s flour is completely safe.',
    funFact: 'Glowcap Snails move at a top speed of 3 meters per hour, making relocation an exercise in extreme patience!',
    riddle: {
      question: 'Which fence material prevents snails from climbing over without harming their soft bodies?',
      options: [
        'Corrugated copper sheeting strips',
        'Raw splintery cedar planks',
        'Rough granite gravel blocks',
        'Iron spikes with vinegar coatings'
      ],
      answer: 'Corrugated copper sheeting strips',
      hint: 'Copper reacts chemically with snail mucus, creating a tiny, harmless electrostatic charge that causes them to turn back.'
    }
  },
  'Dredge River Route': {
    instructions: 'Clear underwater logs and heavy silt deposits blocking cargo barges downstream on the Cocoa River.',
    reviewer: 'Sir Goldwhistle',
    reviewResponse: 'The channels are fully cleared. The cargo boats are flowing downstream with zero delays!',
    funFact: 'Cocoa River silt contains fine cocoa nib dust, making the riverbeds rich in nutrients and sweet-smelling!',
    riddle: {
      question: 'To clear heavy submerged timber from the shipping lane, which tool offers the greatest mechanical advantage?',
      options: [
        'A dual-pulley block and tackle system',
        'A straight iron lever bar',
        'A hand-operated hemp rope tug',
        'A wooden shovel blade'
      ],
      answer: 'A dual-pulley block and tackle system',
      hint: 'Pulleys distribute the weight of the load across multiple rope loops, reducing the pulling force required to lift it.'
    }
  },
  'Reinforce Molasses Locks': {
    instructions: 'Install heavy-duty bolts and braces on the molasses lock gates to withstand increased flow pressure.',
    reviewer: 'Winston the Foreman',
    reviewResponse: 'Superb steel reinforcing! The locks are holding firm against the molasses rush.',
    funFact: 'Molasses lock gates are lined with a secret blend of hazelnut wax that prevents the syrup from sticking!',
    riddle: {
      question: 'When bolting steel plates to wood lock gates, what component prevents the steel from crushing the wood fibers?',
      options: [
        'Wide flat steel washers',
        'Thick adhesive liquid glue',
        'Additional metal nuts',
        'Tapered lock washers'
      ],
      answer: 'Wide flat steel washers',
      hint: 'Washers distribute the clamping force of the bolt over a larger surface area, preventing damage to the soft wood.'
    }
  },
  'Express Pod Delivery': {
    instructions: 'Load the backlogged cargo and deliver fresh Ganache Cocoa Pods to the Toffee Town confection market.',
    reviewer: 'Rowan the Carpenter',
    reviewResponse: 'Prompt delivery! The confectioners have already started melting the beans for the holiday batches.',
    funFact: 'Fresh Ganache Cocoa Pods ferment in the cart during travel, developing their rich chocolate flavor on the road!',
    riddle: {
      question: 'What is the optimal storage humidity inside cargo wagons to prevent cocoa pods from growing mold during travel?',
      options: [
        '55% to 65% relative humidity',
        '95% relative humidity (very damp)',
        '10% relative humidity (bone dry)',
        'No humidity controls'
      ],
      answer: '55% to 65% relative humidity',
      hint: 'Cocoa beans require a dry but not desiccating atmosphere to maintain flavor quality without triggering mold.'
    }
  }
};

/**
 * Returns task details based on the task name.
 * If not found, falls back to a dynamically generated task details based on the category or defaults.
 */
export const getResidencyTaskDetails = (taskName: string, xpCategory = 'builder'): ResidencyTaskDetails => {
  // Try to clean name (e.g. "Attend Seminar: Structural Carpentry" -> "Structural Carpentry")
  let cleanName = taskName.replace('Attend Seminar: ', '').replace('Attend: ', '').replace('Travel to ', '');
  if (cleanName.endsWith(' Site')) {
    cleanName = cleanName.substring(0, cleanName.length - 5);
  }
  cleanName = cleanName.trim();

  if (RESIDENCY_TASK_DATABASE[cleanName]) {
    return RESIDENCY_TASK_DATABASE[cleanName];
  }

  // Fallback generation based on category
  const cat = xpCategory?.toLowerCase() || 'builder';
  
  if (cat === 'healer' || taskName.toLowerCase().includes('clinic') || taskName.toLowerCase().includes('herb') || taskName.toLowerCase().includes('health')) {
    return {
      instructions: `Sanitize medical facilities, assist patients, or prepare herbal remedies for the community.`,
      reviewer: 'Dr. Cedric Oakenhart',
      reviewResponse: `Your care and attention to detail has greatly helped our patients. The clinic looks excellent!`,
      funFact: 'Did you know? Chamomile flowers sleep at night, closing their petals to protect their essential oils.',
      riddle: {
        question: 'Which natural ingredient is most commonly used to soothe local patients recovering from a Moss Sneezles outbreak?',
        options: [
          'Warm honey-chamomile infusion',
          'Damp glowing forest fungus',
          'Raw spring water with acid',
          'Pulverized pine bark paste'
        ],
        answer: 'Warm honey-chamomile infusion',
        hint: 'Dr. Oakenhart recommends a soothing, hot herbal tea mixed with local honey to coat the throat.'
      }
    };
  }

  if (cat === 'explorer' || taskName.toLowerCase().includes('survey') || taskName.toLowerCase().includes('meeting') || taskName.toLowerCase().includes('notice') || taskName.toLowerCase().includes('rumour')) {
    return {
      instructions: `Survey the local land, compile notice board requests, or investigate anomalies for the town registry.`,
      reviewer: 'Sir Goldwhistle',
      reviewResponse: `Your survey notes have been logged in the county archives. A splendid job keeping the trails mapped!`,
      funFact: 'Did you know? The Mossberry firefly glows in three colors depending on the humidity of the air.',
      riddle: {
        question: 'When mapping new forest trails, which natural marker is the most reliable indicator of pointing north?',
        options: [
          'Moss growth on the north side of old oak bark',
          'The direction of high-frequency firefly flights',
          'The slope of wet mud-slides near geysers',
          'The tilt of wild mushroom stems'
        ],
        answer: 'Moss growth on the north side of old oak bark',
        hint: 'In shaded humid forests, moss grows more thickly on the side that receives less direct sunlight (the north side in this hemisphere).'
      }
    };
  }

  // Builder / Architect default fallback
  return {
    instructions: `Assist with structure reinforcement, joinery work, or foundation planning for the town square.`,
    reviewer: 'Rowan the Carpenter',
    reviewResponse: `Superb craftsmanship! These structures are solid and fully comply with Toffee Town standards.`,
    funFact: 'Did you know? The wood of the Glazed Redwood tree is naturally fireproof and smells like toasted sugar.',
    riddle: {
      question: 'Sir Goldwhistle requests a quick audit: If Toffee Town\'s public treasury has 120 coins and we invest 25% in walkway timber, how many coins are left for other municipal projects?',
      options: [
        '90 Coins',
        '30 Coins',
        '95 Coins',
        '85 Coins'
      ],
      answer: '90 Coins',
      hint: 'Deduct 25% of 120 (which is 30) from the total amount of 120.'
    }
  };
};
