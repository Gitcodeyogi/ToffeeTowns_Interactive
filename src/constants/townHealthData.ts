// ============================================================
// CHOCOBROOK TOWN HEALTH DATA
// Each town has a unique disease tied to its environment/DNA,
// rare healing species, treatment plants, an appointed doctor,
// and a daily health dossier headline.
// ============================================================

export interface TownDoctor {
  name: string;
  title: string;
  specialty: string;
  personality: string;
  avatar: string;
}

export interface TownHealthEntry {
  disease: string;
  diseaseCause: string;
  symptoms: string;
  rareSpecies: string;
  rareSpeciesNote: string;
  healingPlant: string;
  healingPlantNote: string;
  treatment: string;
  doctor: TownDoctor;
  healthNews: string;
  wellbeingTip: string;
  severity: 'mild' | 'moderate' | 'severe';
}

export const TOWN_HEALTH_DATA: Record<string, TownHealthEntry> = {
  'toffee-town': {
    disease: 'Grand Leyline Pressure Migraine',
    diseaseCause: 'The intersection of ChocoBrook\'s most powerful sugar leylines beneath Toffee Town generates invisible pressure fluctuations that trigger neurological sensitivity in residents over years of exposure.',
    symptoms: 'Intense pressure headaches that smell faintly of burnt caramel, temporary vision of golden geometric patterns, heightened emotional sensitivity to politics, and an uncontrollable craving for governance.',
    rareSpecies: 'Amber-Winged Harbour Moth',
    rareSpeciesNote: 'Found only near the Grand Caramel Blvd gas-lamp posts at night. Its wing dust, when dissolved in warm cream, neutralises leyline-induced neural pressure patterns in long-term residents.',
    healingPlant: 'Goldenrod Toffee Lily',
    healingPlantNote: 'Grows along the harbour seawall in clusters. Its distilled bulb tonic restores equilibrium in leyline-sensitive patients when taken regularly over a fortnight.',
    treatment: 'Goldenrod Toffee Lily tonic morning and evening for fourteen days. Amber-Winged Moth wing dust in warm cream as a sleep aid. Mandatory quiet time away from the harbour leyline zone each afternoon.',
    doctor: {
      name: 'Dr. Caramella Voss',
      title: 'Chief Physician of Toffee Town',
      specialty: 'Leyline Neurology, Crystalline Metabolic Disorders & Sugar Leyline Medicine',
      personality: 'Stern but deeply caring. Known for prescribing therapeutic caramel baths that happen to smell wonderful, and for ordering mandatory afternoon walks away from City Hall.',
      avatar: '👩‍⚕️'
    },
    healthNews: 'Dr. Voss advises residents within three blocks of Grand Harbour: the leyline is elevated today. Protect your headspace with cooling wraps and reduce news consumption for 24 hours.',
    wellbeingTip: 'Spend one afternoon per week away from the leyline district. Wear a copper-lined headband during peak political debates to reduce pressure sensitivity.',
    severity: 'moderate'
  },

  'ganache-grove': {
    disease: 'Cocoa Spore Fever',
    diseaseCause: 'The glowing mushrooms in the deep forest canopy release microscopic cocoa spores during new moon nights. Inhaling concentrated spore clouds causes a distinctive fever unique to Ganache Grove.',
    symptoms: 'High temperature with a faint chocolatey body odour, vivid dreams involving jazz music, temporary bioluminescent spots on the shoulders and wrists.',
    rareSpecies: 'Luminous Truffle Beetle',
    rareSpeciesNote: 'Lives deep under rotting cocoa root clusters. Its secreted amber oil has powerful anti-inflammatory properties that calm spore reactions.',
    healingPlant: 'Silver Bark Root',
    healingPlantNote: 'A climbing vine on the oldest grove trees. Its inner bark is moonlit silver and yields a cooling extract when crushed with morning dew.',
    treatment: 'Brew of Silver Bark Root and Moonlit Mint, boiled at exactly low heat for one hour, administered in clay cups at dusk for five nights. Truffle Beetle amber oil is applied to the glowing spots.',
    doctor: {
      name: 'Dr. Fernwick',
      title: 'Forest Physician & Mycologist',
      specialty: 'Forest Mycology, Spore Medicine & Bioluminescent Disorders',
      personality: 'Quiet, methodical, and deeply in love with the forest. He takes notes by candlelight and hums while examining patients.',
      avatar: '🧙‍♂️'
    },
    healthNews: 'Dr. Fernwick reports 3 new Cocoa Spore Fever cases near the eastern canopy trail. He advises wearing sealed hoods after midnight.',
    wellbeingTip: 'Never sleep near glowing mushroom clusters during new moon nights. Keep a sprig of Silver Bark Root in your pocket while foraging.',
    severity: 'moderate'
  },

  'lava-cake-lake': {
    disease: 'Volcanic Chocolate Fever',
    diseaseCause: 'The geothermal bubbling springs occasionally release chocolate steam laced with sulphur-cocoa compounds. Prolonged exposure overwhelms the body\'s temperature regulation.',
    symptoms: 'Extreme heat in the core of the body, skin turning faintly reddish-brown, heavy perspiration smelling of dark chocolate, and dizziness near open springs.',
    rareSpecies: 'Cooling Frost Salamander',
    rareSpeciesNote: 'Lives in the cold underground streams beneath the lake. Its scales emit a natural cooling mucus used for centuries by local healers.',
    healingPlant: 'Cooling Mint Moss',
    healingPlantNote: 'Grows only in the shade of the stone arches at the lake\'s edge. Its oily leaves reduce body heat when pressed against the neck and temples.',
    treatment: 'Cold compress of Cooling Mint Moss leaves soaked in spring water applied for two hours, followed by a Frost Salamander mucus ointment rubbed along the spine. Patient must rest in a cool stone room.',
    doctor: {
      name: 'Dr. Fudge',
      title: 'Geothermal Medicine Specialist',
      specialty: 'Thermal Medicine, Chocolate Steam Toxicology & Burn Recovery',
      personality: 'Loud, enthusiastic, slightly chaotic. He\'s been cured of Volcanic Chocolate Fever himself three times and considers it a badge of honour.',
      avatar: '🔴'
    },
    healthNews: 'Dr. Fudge warns: the central spring is releasing double the usual steam today. Visitors should stay on the marked path and not approach the bubbling centre.',
    wellbeingTip: 'Always carry a wrapped packet of Cooling Mint Moss when visiting the lake springs. Never swim in the geothermal pools.',
    severity: 'severe'
  },

  'peppermint-peak': {
    disease: 'Glacial Mint Lung Frost',
    diseaseCause: 'The ultra-fine peppermint ice crystals at high altitude penetrate the lungs during strong frost winds, causing inflammation and a distinct icy sensation in the chest.',
    symptoms: 'Sharp chest pain when breathing cold air, breath that visibly mints the air even indoors, and temporary loss of smell replaced by constant peppermint sensation.',
    rareSpecies: 'White Summit Snow Hare',
    rareSpeciesNote: 'Found only at the peak\'s highest trails. Its fur, when boiled into a restorative broth, coats the lungs and provides a protective warm film.',
    healingPlant: 'Warm-Heart Heather',
    healingPlantNote: 'A stubborn violet-leafed shrub found in sheltered cliff crevices. Its root yields a warming oil that counters ice crystal inflammation.',
    treatment: 'Warm Heather root oil inhaled as steam for twenty minutes, three times daily. Snow Hare fur broth taken as a nightly drink. Patient is wrapped in heated wool blankets for the duration of treatment.',
    doctor: {
      name: 'Dr. Isadora Frost',
      title: 'Mountain Physician & Respiratory Specialist',
      specialty: 'Glacial Medicine, High-Altitude Respiratory Care & Frostbite Recovery',
      personality: 'Precise, calm, and always overdressed in warm layers even indoors. She speaks slowly and deliberately as if every word is measured.',
      avatar: '❄️'
    },
    healthNews: 'Dr. Frost issues altitude advisory: winds above the third ridge are carrying concentrated ice crystals today. Only experienced climbers should proceed beyond the second shelter.',
    wellbeingTip: 'Wrap a warm scarf soaked in Heather oil around your face before ascending above the frost line. Never breathe through your mouth in high winds.',
    severity: 'severe'
  },

  'creme-tunnels': {
    disease: 'Luminous Dairy Vapour Syndrome',
    diseaseCause: 'The pressurised cream veins beneath the tunnels occasionally release invisible dairy vapour clouds. Chronic inhalation causes a metabolic condition where the body processes nutrients abnormally.',
    symptoms: 'Faint inner glow visible in darkness, unusual lightness of body, excessive energy at night and extreme sleepiness at noon, and a craving for crystalline sugar.',
    rareSpecies: 'Glow-bug Queen',
    rareSpeciesNote: 'The rarest of the glow-bugs, found only at the deepest crystal hall. Her blue bioluminescence when harvested gently provides a grounding agent that stabilises the metabolic rhythm.',
    healingPlant: 'Crystal Cave Fern',
    healingPlantNote: 'Grows on the walls of the oldest tunnel sections. Its silver-veined fronds absorb cream vapour and neutralise its metabolic effects when brewed into tea.',
    treatment: 'Crystal Cave Fern tea taken twice daily for ten days. A single Glow-bug Queen light session — sitting in the presence of the queen for thirty minutes — rebalances the body\'s internal clock.',
    doctor: {
      name: 'Dr. Luminara Pip',
      title: 'Subterranean Health & Vapour Medicine Physician',
      specialty: 'Dairy Vapour Toxicology, Bioluminescent Biology & Underground Wellbeing',
      personality: 'Soft-spoken and ethereal. She works by glow-bug lantern light and is known to glow faintly herself after years of exposure — which she insists is intentional.',
      avatar: '🌌'
    },
    healthNews: 'Dr. Pip reports that the eastern cream vein is showing elevated pressure today. Residents of Corridor 4 are advised to use vapour masks until pressure normalises.',
    wellbeingTip: 'Sleep above ground level twice a week to reset your body\'s rhythm. Never inhale near cracked cream vein walls without a sealed mask.',
    severity: 'moderate'
  },

  'banoffee-valley': {
    disease: 'Banana-Caramel Fermentation Sickness',
    diseaseCause: 'Overripe banana-toffee residues ferment in the valley soil during warm months, releasing a sweet gas that affects digestion and creates unusual metabolic shifts.',
    symptoms: 'Persistent sweet taste in the mouth, bloating shaped like a banana, temporary yellow tint to the skin, and uncontrollable humming of folk tunes.',
    rareSpecies: 'Spotted Orchard Ladybug',
    rareSpeciesNote: 'Found only on the oldest banana trees. Its spotted shell, ground into a fine powder, neutralises banana-gas fermentation in the gut.',
    healingPlant: 'Tamarind Bark Root',
    healingPlantNote: 'Grows along the valley\'s riverside embankments. Its tart bark counters excessive sweetness in the system and restores digestive balance.',
    treatment: 'Tamarind Bark Root tea three times daily for one week. Spotted Orchard Ladybug powder mixed with warm water as a daily tonic. Avoid the valley floor after dusk during warm months.',
    doctor: {
      name: 'Dr. Basil Peel',
      title: 'Valley Agricultural Health Specialist',
      specialty: 'Fermentation Sickness, Digestive Disorders & Orchard Toxicology',
      personality: 'Cheerful and always slightly amused by his patients\' banana-related ailments. He prescribes sour foods enthusiastically and bakes his own medicinal tarts.',
      avatar: '🍌'
    },
    healthNews: 'Dr. Peel confirms: three cases of Fermentation Sickness reported this week near the lower orchard. Residents are advised to keep orchard windows closed after sunset.',
    wellbeingTip: 'Eat a sour plum before entering the valley floor during summer evenings. Avoid sleeping near ripening banana groves.',
    severity: 'mild'
  },

  'eclair-square': {
    disease: 'Glaze Crystalline Eye Syndrome',
    diseaseCause: 'The ultra-fine pastry glaze particles that float permanently in the Eclair Square air eventually settle in the tear ducts of long-term residents, causing a distinctive glittery eye condition.',
    symptoms: 'Eyes that literally sparkle in dim light, blurred vision at dawn, sensitivity to direct sunlight, and occasional craving for sugar-dusted foods.',
    rareSpecies: 'Golden Pastry Moth',
    rareSpeciesNote: 'Attracted to the glaze vapour, this moth collects glaze crystals in its abdomen. Its collected secretion, when diluted, acts as a solvent for glaze deposits in the eye.',
    healingPlant: 'Dew-Drop Chamomile',
    healingPlantNote: 'Found in planter boxes on the shadiest streets. Its morning dew, collected at 5am specifically, gently dissolves crystalline deposits in delicate tissues.',
    treatment: 'Daily eye rinse with morning-collected Dew-Drop Chamomile dew for fourteen days. Golden Pastry Moth secretion eye drops twice daily under medical supervision.',
    doctor: {
      name: 'Dr. Clarice Glaze',
      title: 'Pastry District Physician & Ocular Specialist',
      specialty: 'Confection Particle Medicine, Ocular Health & Glaze Toxicology',
      personality: 'Extremely precise. She wears thick-lensed spectacles and frequently complains about the glaze particles affecting her own eyes while treating others.',
      avatar: '👓'
    },
    healthNews: 'Dr. Glaze reports increased Glaze Crystalline Eye cases after the pastry duelling season. She urges all participants to wear protective goggles during competitive glazing.',
    wellbeingTip: 'Rinse your eyes with clean spring water every evening if you spend time near the glazing workshops. Always wear goggles during gusty days.',
    severity: 'mild'
  },

  'hazelnut-terrace': {
    disease: 'Nut-Crag Sedimentation Disease',
    diseaseCause: 'Hazelnut shell dust from the terrace grinding mills settles into the respiratory system of workers and residents over years, forming small hard sediment clusters.',
    symptoms: 'A persistent dry cough with occasional nut-scented breath, slight hardening of the fingernails, and a tendency to hear faint cracking sounds when moving.',
    rareSpecies: 'Hazel-Brown Mountain Sparrow',
    rareSpeciesNote: 'Nests only in the oldest nut trees on the highest terrace. Its feathers contain a natural anti-inflammatory oil used by local healers for generations.',
    healingPlant: 'Creamy Elderflower Bush',
    healingPlantNote: 'Grows in clusters near the nut elevator shafts. Its flower blossoms brewed into a thick cream coat the throat and respiratory passages, flushing out nut sediment.',
    treatment: 'Creamy Elderflower tea three times daily for two weeks. A warm compress of Mountain Sparrow feather oil applied to the chest each night. Dust masks mandatory during mill work.',
    doctor: {
      name: 'Dr. Nutmeg Harrow',
      title: 'Terrace Occupational Health Physician',
      specialty: 'Respiratory Sediment Medicine, Nut Dust Toxicology & Terrace Worker Health',
      personality: 'Practical and no-nonsense. She spends half her time at the mills monitoring workers and the other half arguing with mill owners about safety standards.',
      avatar: '🌰'
    },
    healthNews: 'Dr. Harrow urges all mill workers to use new-issue dust masks following yesterday\'s elevated nut-shell particulate readings at the upper terrace.',
    wellbeingTip: 'Always wear a dust mask during hazelnut harvest and processing seasons. Eat creamy soups weekly to protect your respiratory lining.',
    severity: 'moderate'
  },

  'peanut-butter-falls': {
    disease: 'Peanut Rapids Whiplash Condition',
    diseaseCause: 'The repeated force of peanut-cream river current exposure during raft racing and riverside work creates a compounding neck and spine condition unique to the Falls.',
    symptoms: 'Neck stiffness with a faint peanut scent during movement, joint pops that smell oddly of roasted nuts, and a sudden loss of balance near flowing water.',
    rareSpecies: 'River Otter of the Cream Falls',
    rareSpeciesNote: 'Found sunbathing on flat rocks mid-rapids. Its natural cream secretion, harvested ethically, forms the base of the most effective joint lubricant known in ChocoBrook.',
    healingPlant: 'Smooth-Stone Watercress',
    healingPlantNote: 'Grows on the wet stones at the base of the falls. Rich in minerals that rebuild cartilage and joint fluid when eaten raw daily.',
    treatment: 'Daily raw Smooth-Stone Watercress eaten for twelve days. River Otter cream secretion applied as a joint massage twice daily. Patients must rest from all rafting for one week.',
    doctor: {
      name: 'Dr. Pippa Creamy',
      title: 'Riverside Sports Medicine Physician',
      specialty: 'Aquatic Trauma, Joint Recovery & Raft-Related Injuries',
      personality: 'Sporty, fast-talking, and impossible to keep still. She often examines patients while jogging alongside them. Secretly loves raft racing herself.',
      avatar: '🌊'
    },
    healthNews: 'Dr. Creamy issues post-race advisory: six cases of Whiplash Condition reported after yesterday\'s rapids race. She reminds competitors that helmets are medicinal, not optional.',
    wellbeingTip: 'Stretch your neck and spine every morning. Eat Watercress before any physical activity near the rapids.',
    severity: 'moderate'
  },

  'nougat-node': {
    disease: 'Logistical Strain Syndrome',
    diseaseCause: 'The constant noise, vibration, and mechanical smell of the Nougat Node rail yards — combined with the chewy nougat vapour that permeates the air — creates a chronic stress-and-fatigue disorder.',
    symptoms: 'Constant ringing in the ears shaped like a train whistle, muscle tension that feels like dried nougat under the skin, insomnia, and compulsive list-making behaviour.',
    rareSpecies: 'Calm-Winged Cargo Pigeon',
    rareSpeciesNote: 'Roosting on the oldest signal towers, these pigeons naturally emit low-frequency calming vibrations. Their presence near a patient for thirty minutes is medically recognised as therapeutic.',
    healingPlant: 'Velvet Chamomile Root',
    healingPlantNote: 'Found growing between the old rail ties at the edge of the yard. Its velvet root brewed into a deep amber tea is the most effective tension-release tonic in the Node.',
    treatment: 'Velvet Chamomile Root tea each evening for ten days. Cargo Pigeon proximity therapy thirty minutes per morning. Complete rest from rail yard proximity at least one day per week.',
    doctor: {
      name: 'Dr. Nigel Steady',
      title: 'Logistical District Physician & Stress Medicine Specialist',
      specialty: 'Occupational Fatigue, Noise Medicine & Rail Worker Wellbeing',
      personality: 'Unnervingly calm. He speaks in a measured, deliberate tone and never rushes — which frustrates logistical workers enormously and somehow heals them simultaneously.',
      avatar: '🧭'
    },
    healthNews: 'Dr. Steady confirms that three dispatchers from the Northern Yard have been admitted for acute Logistical Strain following last week\'s double-cargo day. Rest is non-negotiable.',
    wellbeingTip: 'Spend at least one hour away from all mechanical sounds daily. A cup of Velvet Chamomile before your shift will carry you through the noise.',
    severity: 'mild'
  },

  'praline-port': {
    disease: 'Salt-Nut Coastal Skin Brine',
    diseaseCause: 'The combination of sea-salt air and airborne praline sugar particles at the port docks creates a unique skin condition where the outer dermis becomes crystallised and stiff over years.',
    symptoms: 'Skin that feels like lightly salted praline to the touch, salt crust formation at the elbows and knees, sensitivity to fresh water, and a constant mild thirst.',
    rareSpecies: 'Port Hermit Crab',
    rareSpeciesNote: 'Found in the crevices of the dock\'s oldest nut-crag stones. Its natural shell secretion softens crystallised skin tissue and restores hydration.',
    healingPlant: 'Harbour Kelp Blossom',
    healingPlantNote: 'Grows on the submerged dock supports at low tide. Its blossom oil, when applied to skin, dissolves the salt-praline crystalline layer gently over two weeks.',
    treatment: 'Twice-daily application of Harbour Kelp Blossom oil mixed with Port Hermit Crab secretion. Fresh water baths with kelp added. Reduce port dock exposure to mornings only.',
    doctor: {
      name: 'Dr. Marina Crag',
      title: 'Coastal Medicine & Dermatology Physician',
      specialty: 'Maritime Dermatology, Salt Disorders & Port Worker Skin Health',
      personality: 'Weather-beaten and direct. She\'s been at the port thirty years and considers herself part of the dock\'s natural ecosystem.',
      avatar: '⚓'
    },
    healthNews: 'Dr. Crag advises dock workers: the combination of today\'s high tide salt spray and overnight praline cargo dust requires all workers to apply their kelp oil treatment before starting shifts.',
    wellbeingTip: 'Apply Harbour Kelp oil to exposed skin before starting any dock work. Drink fresh water — not seawater-diluted — every hour on the port.',
    severity: 'mild'
  },

  'sprinkle-sands': {
    disease: 'Rainbow Dune Dehydration Disorder',
    diseaseCause: 'The neon sugar sands of Sprinkle Sands reflect intense light at all hours. Combined with the coastal heat, this causes rapid mineral depletion and a rare chromatic dehydration where the body\'s colour perception shifts.',
    symptoms: 'Everything appearing in slightly the wrong colour, excessive thirst despite drinking, fine sprinkle crystals forming at the hairline, and an irresistible urge to bounce.',
    rareSpecies: 'Iridescent Shore Beetle',
    rareSpeciesNote: 'Lives only at the boundary where sand meets sea. Its natural iridescent oil balances light-sensitivity and restores normal colour perception when applied to the temples.',
    healingPlant: 'Coconut-Sugar Shore Grass',
    healingPlantNote: 'Grows in dense clusters at the dune base. Its roots contain a mineral-rich gel that rapidly restores chromatic dehydration when consumed as a cold brew.',
    treatment: 'Cold Coconut-Sugar Shore Grass root brew twice daily for one week. Iridescent Shore Beetle oil applied to the temples each morning. Patients must wear wide-brimmed hats and reduce sand surface time.',
    doctor: {
      name: 'Dr. Coral Sparkle',
      title: 'Coastal Wellness & Chromatic Medicine Physician',
      specialty: 'Light-Induced Disorders, Mineral Dehydration & Rainbow Beach Medicine',
      personality: 'Vibrant, colourful, and slightly exhausting to be around. She treats patients with as much colour as possible, convinced that more colour cures colour problems.',
      avatar: '🏖'
    },
    healthNews: 'Dr. Sparkle warns: peak summer midday light from the neon dunes today is at its annual highest. All beachgoers must use the shade shelters between noon and 3pm.',
    wellbeingTip: 'Never lie directly on the neon sand during midday. Carry a cold Shore Grass brew in a sealed flask when spending full days at the beach.',
    severity: 'mild'
  },

  'butterscotch-bay': {
    disease: 'Golden Tide Fog Sickness',
    diseaseCause: 'The dense sweet fog that rolls in from the caramel-hued bay carries microscopic butterscotch particulates. Chronic inhalation causes a distinctive respiratory and neurological condition.',
    symptoms: 'Sweet-smelling breath at all hours, slight golden tint to the whites of the eyes, vivid butterscotch-flavoured dreams, and an inexplicable desire to sail without destination.',
    rareSpecies: 'Bay-Lantern Jellyfish',
    rareSpeciesNote: 'Glows softly near the bay surface on foggy nights. Its luminescent gel, when collected carefully, acts as an antidote to butterscotch particulate accumulation in the lungs.',
    healingPlant: 'Silver Sea-Mint',
    healingPlantNote: 'Grows on the rocks near the bay\'s tidal zones. Its sharp-smelling leaves clear the respiratory system of sweet fog particulates when inhaled as steam.',
    treatment: 'Daily Silver Sea-Mint steam inhalation for fifteen minutes each morning. Bay-Lantern Jellyfish gel consumed in capsule form twice daily for two weeks under medical supervision.',
    doctor: {
      name: 'Dr. Barnacle Finn',
      title: 'Maritime Fog Medicine Physician',
      specialty: 'Sea Fog Toxicology, Marine Respiratory Health & Golden Tide Medicine',
      personality: 'A sailor turned doctor. He examines patients on the dock and frequently falls asleep mid-afternoon from his own mild case of Golden Tide Fog Sickness that he refuses to treat.',
      avatar: '⛵'
    },
    healthNews: 'Dr. Finn reports: this morning\'s fog was exceptionally thick with butterscotch particulate. He advises all outdoor workers to use fog masks until the afternoon sea breeze clears the bay.',
    wellbeingTip: 'Inhale Silver Sea-Mint before heading outdoors on foggy mornings. Keep bay-facing windows closed overnight during fog season.',
    severity: 'moderate'
  },

  'caramel-cove': {
    disease: 'Sticky Wave Skin Submersion Syndrome',
    diseaseCause: 'Extended surfing and swimming in the high-density caramel surf exposes the skin to concentrated sugar adhesion that penetrates the outer skin layers and affects circulation.',
    symptoms: 'Skin that remains slightly tacky even after bathing, reduced sensation in the fingertips and toes, a constant mild warmth across the back, and a tendency to attract sand particles.',
    rareSpecies: 'Caramel-Clam of the Shore',
    rareSpeciesNote: 'Found wedged in the cliff base rocks at the cove\'s southern end. Its anti-adhesive shell secretion is the only known natural solvent for caramel skin adhesion.',
    healingPlant: 'Sea-Salt Rosemary Weed',
    healingPlantNote: 'Grows in thick bunches on the cliff edges. Its briny oil, combined with warm fresh water, restores normal skin permeability and clears sugar adhesion.',
    treatment: 'Full body wash with Sea-Salt Rosemary Weed oil once daily for ten days. Caramel-Clam secretion applied as a full body mask twice weekly. Reduce surf time to one hour per day during treatment.',
    doctor: {
      name: 'Dr. Sandy Reef',
      title: 'Surf & Coastal Dermatology Physician',
      specialty: 'Sugar Adhesion Disorders, Surf Medicine & Tidal Skin Health',
      personality: 'Laid-back and tanned. He surfs between patient appointments and considers sticky wave syndrome a right of passage rather than an illness — while still treating it professionally.',
      avatar: '🌊'
    },
    healthNews: 'Dr. Reef confirms the recent wave sets are producing particularly high caramel density. He recommends all surfers apply anti-adhesive pre-surf oil before entering the water this week.',
    wellbeingTip: 'Never surf more than two consecutive hours in the cove without a fresh water rinse. Apply Rosemary Weed oil every morning if you live near the shore.',
    severity: 'mild'
  },

  'honeycomb-heights': {
    disease: 'Golden Amber Sting Sensitisation',
    diseaseCause: 'Prolonged exposure to the concentrated honeycomb amber air and repeated minor honey-moth contact creates a cumulative sensitisation where the immune system overreacts to natural sweeteners.',
    symptoms: 'Hives shaped like hexagons appearing after eating sweet foods, a humming sensation in the ears, mild swelling near the neck, and a dramatic increase in sweet food rejection.',
    rareSpecies: 'Silverstripe Honey-Moth',
    rareSpeciesNote: 'The rarest variant of the heights\' honey-moths. Its silver wing dust has anti-sensitisation properties that calm the immune overreaction when dissolved in filtered water.',
    healingPlant: 'Clover Amber Herb',
    healingPlantNote: 'Grows in the sheltered gardens of the cliff-hanging terraces. Its amber-coloured leaves brewed into an unsweetened tea desensitise the immune system to natural sugars over time.',
    treatment: 'Daily unsweetened Clover Amber Herb tea for three weeks. Silverstripe Honey-Moth wing dust drops in filtered water as a morning drink under physician supervision. Avoid all sweet foods during treatment.',
    doctor: {
      name: 'Dr. Hobie Amber',
      title: 'Heights Immunology & Sensitisation Physician',
      specialty: 'Immunological Disorders, Sweet-Sensitivity Medicine & Apiary Health',
      personality: 'Measured and almost apologetic — he knows telling heights residents to avoid sweet foods is tantamount to exile. He delivers bad news with elaborate philosophical preambles.',
      avatar: '🍯'
    },
    healthNews: 'Dr. Amber reports five new sensitisation cases this season, all linked to the recent royal jelly harvest. He urges handlers to wear full protective suits and gloves.',
    wellbeingTip: 'Rotate your sweet food intake throughout the week rather than daily consumption of honey products. Drink Clover Herb tea weekly as a preventive measure.',
    severity: 'moderate'
  },

  'cocoa-canyon': {
    disease: 'Deep Mocha Miners\' Lung',
    diseaseCause: 'Extended time in the deep mining shafts exposes workers to concentrated dark-chocolate ore dust. The particulates bind to the lung lining and create a distinctive flavoured respiratory condition.',
    symptoms: 'A deep chocolate cough, mocha-scented breath at all hours, dark colouring inside the nasal passages, and an ability to taste ore quality by smell alone.',
    rareSpecies: 'Canyon Crystal Moth',
    rareSpeciesNote: 'Found deep in shaft #7 near the pure dark-chocolate vein. Its cocoa-crystal encrusted wings, when brewed, produce a solution that binds ore particles and flushes them from lung tissue.',
    healingPlant: 'White Cocoa Stem Root',
    healingPlantNote: 'Grows at the canyon ridge where sunlight first reaches. Its white inner root is rich in cleansing compounds that counteract dark ore particulate binding in the lungs.',
    treatment: 'White Cocoa Stem Root tea twice daily for three weeks. Canyon Crystal Moth wing brew as a monthly deep-cleanse tonic. Full respiratory rest from mining for at least two weeks per quarter.',
    doctor: {
      name: 'Dr. Mickey Mocha',
      title: 'Mining District Physician & Respiratory Specialist',
      specialty: 'Ore Particle Medicine, Mining Lung Disease & Deep-Vein Worker Health',
      personality: 'Always covered in a fine layer of cocoa dust despite best efforts. He\'s deeply respected by miners and has the strongest chocolate-scented handshake in ChocoBrook.',
      avatar: '🍫'
    },
    healthNews: 'Dr. Mocha confirms: shaft #9 dust readings are at this season\'s highest. All workers below level 3 must use dual-filter ore masks effective immediately.',
    wellbeingTip: 'Always enter shafts with a sealed face filter. Drink White Cocoa Root tea weekly if you spend regular time near the canyon ore face.',
    severity: 'severe'
  },

  'brownie-crossroads': {
    disease: 'Junction Steam Fatigue Disorder',
    diseaseCause: 'The Crossroads sits at the convergence of four major trade routes and rail lines. The constant mechanical vibration and warm brownie-crust steam from the bakery district creates a chronic fatigue and disorientation condition.',
    symptoms: 'An inability to choose a direction when standing still, extreme tiredness precisely at junction crossing times, faint smell of warm brownies from the skin, and dreams entirely about crossroads.',
    rareSpecies: 'Crossroads Navigator Bee',
    rareSpeciesNote: 'A large, unhurried bee species that always knows exactly where it\'s going. Its honey, collected from the crossroads wildflower patches, has proven orienting and fatigue-reducing properties.',
    healingPlant: 'Iron Root Turmeric Weed',
    healingPlantNote: 'Grows in the gravelled verges between the rail lines. Its bright orange root reduces chronic fatigue and restores decisional clarity when consumed as a daily tonic.',
    treatment: 'Iron Root Turmeric Weed tonic each morning. Crossroads Navigator Bee honey in warm water before bed for two weeks. Patients must take one complete day of rest away from any junction or crossing point.',
    doctor: {
      name: 'Dr. Betty Baker',
      title: 'Junction Medicine & Fatigue Specialist',
      specialty: 'Chronic Fatigue Disorders, Vibration Medicine & Crossroads Worker Health',
      personality: 'Indecisive about everything except medicine. She famously took forty-five minutes to decide where to put her office, then prescribed herself her own Junction Fatigue remedy.',
      avatar: '🚂'
    },
    healthNews: 'Dr. Baker advises: the new triple-train morning schedule is producing increased vibration stress. Crossroads residents should use anti-vibration sleeping pads and avoid early morning platform standing.',
    wellbeingTip: 'Rest one day per week entirely away from the crossroads district. Eat Iron Root Turmeric every morning during peak train season.',
    severity: 'mild'
  }
};

// Helper: Get health entry for a town (with fallback)
export const getTownHealth = (townId: string): TownHealthEntry => {
  return TOWN_HEALTH_DATA[townId] || {
    disease: 'General Sweet Exposure Fatigue',
    diseaseCause: 'Prolonged exposure to ChocoBrook\'s ambient confectionery atmosphere.',
    symptoms: 'Mild sweetness in the breath, occasional sugar-induced energy spikes, and pleasant but vivid dessert dreams.',
    rareSpecies: 'Common Honey Bee',
    rareSpeciesNote: 'Found throughout ChocoBrook. Its honey has mild restorative properties.',
    healingPlant: 'Common Chamomile',
    healingPlantNote: 'Available everywhere. A calming tea taken each evening.',
    treatment: 'Chamomile tea each evening and adequate rest.',
    doctor: {
      name: 'Dr. Local Care',
      title: 'District General Practitioner',
      specialty: 'General Medicine & Sweet Exposure Care',
      personality: 'Warm, friendly, and always available.',
      avatar: '👨‍⚕️'
    },
    healthNews: 'Local health conditions are stable. Residents are advised to stay hydrated.',
    wellbeingTip: 'Stay hydrated, eat varied foods, and rest well.',
    severity: 'mild'
  };
};
