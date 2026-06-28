// ============================================================
// SERIES 1: THE HONEYBERRY LOAF INCIDENT
// Ganache Grove · Civic Story Arc
// ============================================================

export interface AssignmentOption {
  icon: string;
  label: string;
  /** skill XP category for this option */
  xpSkill?: string;
}

export interface CanalSeriesStep {
  id: string;
  stepNumber: number;
  /** How many days after series start date this step becomes available */
  dayOffset: number;
  category: string;
  title: string;
  headline: string;
  /** 2-3 sentence context paragraph — what the town professionals are doing */
  storyContext: string;
  /** Relative path under /public/Assets/ */
  imagePath: string;
  /** Aspect ratio hint for the image slot */
  imageAspect: '3/2' | '16/9';
  /** Town professionals actively involved in this step */
  professionals: string[];
  playerAssignment: {
    title: string;
    description: string;
    /** Used when there are no options — single big CTA button label */
    ctaLabel?: string;
    /** Multiple contribution options (player picks one) */
    options?: AssignmentOption[];
  };
  rewards: {
    xp: number;
    xpSkill: string;
    coins: number;
    influence?: number;
    badgeProgress?: string;
    badgeId?: string;
  };
  /** Short personal note from Rowan Thistle at the bottom of the popup */
  rowanNote: string;
  /** Short personal note from Julie Frost at the bottom of the popup */
  julieNote: string;
}

// ── Series Definition ──────────────────────────────────────
export const CANAL_SERIES: CanalSeriesStep[] = [

  // ─── STEP 1 ───────────────────────────────────────────────
  {
    id: 'canal-s1-1',
    stepNumber: 1,
    dayOffset: 0,
    category: 'Breaking News · The Honeyberry Loaf Incident',
    title: 'The Missing Masterpiece',
    headline: 'BAKER BRAMBLE MORTIMER’S HONEYBERRY LOAF STOLEN FROM THE WINDOW SILL — PIPKIN NUTTERBY FLEES',
    storyContext:
      'Baker Bramble Mortimer left his newly glazed Honeyberry Loaf cooling on the window sill of the bakery. In a flash, it disappeared! Only a few sticky purple glaze drips remain. Eyewitnesses reported seeing Pipkin Nutterby running with a suspicious round cloth bundle towards the East Canopy. Rowan Thistle has mobilized the volunteer group to investigate.',
    imagePath: '/Assets/Ganache Grove/Story_Series1/Scene_01.1.png',
    imageAspect: '3/2',
    professionals: [
      'Baker Bramble Mortimer · Master Baker',
      'Rowan Thistle · Volunteer Coordinator',
      'Julie Frost · Gazette Reporter',
    ],
    playerAssignment: {
      title: 'Witness Statements & Tracks',
      description:
        'Rowan and Julie need community feedback immediately. Go to Gossip Corner and Market Square, collect opinions from 3 residents, and report their statements to help organize the meeting. You must complete this task to move forward.',
      ctaLabel: 'Report Witness Statements to Rowan 🗣️',
    },
    rewards: { xp: 50, xpSkill: 'explorer', coins: 15, influence: 10 },
    rowanNote:
      "Baker Bramble Mortimer spent three hours making that glaze. We have to recover it before Pipkin eats the evidence!",
    julieNote:
      "I'm writing up a front-page piece for the Ganache Gazette. Your resident survey results will be featured in the broadsheet!",
  },

  // ─── STEP 2 ───────────────────────────────────────────────
  {
    id: 'canal-s1-2',
    stepNumber: 2,
    dayOffset: 1,
    category: 'Canopy Alert · The Honeyberry Loaf Incident',
    title: 'Canopy Confrontation',
    headline: 'PIPKIN NUTTERBY CORNERED IN HIGH CANOPY — SQUIRRELS MOBILIZED FOR DEFENSE',
    storyContext:
      'Search volunteers cornered Pipkin in the high branch canopy. Instead of surrendering, Pipkin whistled and mobilized a troop of hyperactive squirrels (led by Biglet) who began pelting the volunteers with hard cocoa pods! Percival Tinkersprocket has called for immediate tactical decisions to bypass the squirrel barrage.',
    imagePath: '/Assets/Ganache Grove/Story_Series1/Scene_02.png',
    imageAspect: '3/2',
    professionals: [
      'Percival Tinkersprocket · Inventor',
      'Rowan Thistle · Community Coordinator',
      'Julie Frost · Gazette Reporter',
    ],
    playerAssignment: {
      title: 'Assess Strategy & Submit Decision',
      description:
        'The search crew needs your direction. Select which method we should prioritize to bypass the squirrel bombardment so we can retrieve the loaf.',
      options: [
        { icon: '🪵', label: 'Offer Sweet Acorns to pacify Biglet and the squirrels', xpSkill: 'builder' },
        { icon: '🪓', label: 'Create a Slingshot Distraction', xpSkill: 'explorer' },
        { icon: '⚖️', label: 'Deploy Sticky Mud Barriers', xpSkill: 'healer' },
      ],
    },
    rewards: { xp: 50, xpSkill: 'builder', coins: 15, influence: 15 },
    rowanNote:
      "Those squirrels have surprisingly good aim! Make a quick decision so we can clear the path.",
    julieNote:
      "I'm capturing this chaotic scene. Let me know which method you choose for my write-up!",
  },

  // ─── STEP 3 ───────────────────────────────────────────────
  {
    id: 'canal-s1-3',
    stepNumber: 3,
    dayOffset: 2,
    category: 'Pursuit Loop · The Honeyberry Loaf Incident',
    title: 'Slippery Pursuit',
    headline: 'PIPKIN NUTTERBY FLEES ACROSS MOSSWAY NETWORKS — CHASE MOVES TO SLUICE GATES',
    storyContext:
      'While the team was distracted by Biglet and the squirrels, Pipkin slipped away across the slippery elevated mossway bridges. He is heading towards the central water sluice gates. Percival Tinkersprocket and Miss Page Bumblewick have prepared safety nets and need you to coordinate intercept spots.',
    imagePath: '/Assets/Ganache Grove/Story_Series1/Scene_03.png',
    imageAspect: '3/2',
    professionals: [
      'Percival Tinkersprocket · Town Head',
      'Miss Page Bumblewick · Amateur Investigator',
      'Rowan Thistle · Community Coordinator',
    ],
    playerAssignment: {
      title: 'Register Chase Position',
      description:
        'Select your team\'s intercept track on the map. We must coordinate multiple angles to trap him without damage to the loaf.',
      options: [
        { icon: '🔨', label: 'Guard the Sluice Gate Semicircle', xpSkill: 'builder' },
        { icon: '📦', label: 'Deploy Netting at lower bridge junctions', xpSkill: 'healer' },
        { icon: '📏', label: 'Track footprints with Miss Page Bumblewick', xpSkill: 'explorer' },
      ],
    },
    rewards: { xp: 50, xpSkill: 'healer', coins: 20, influence: 15 },
    rowanNote:
      "The moss is very slippery today. Make sure our runners are placed correctly so he has nowhere to run!",
    julieNote:
      "I've sent a Gazette runner to the sluice gate bridge. We'll get a clear shot of the final confrontation!",
  },

  // ─── STEP 4 ───────────────────────────────────────────────
  {
    id: 'canal-s1-4',
    stepNumber: 4,
    dayOffset: 3,
    category: 'Canopy Climax · The Honeyberry Loaf Incident',
    title: 'Elder Tree Resolution',
    headline: 'PIPKIN CORNERED AT SACRED ELDER TREE — LOAF RECOVERED UNHARMED',
    storyContext:
      'The chase ended at the base of the sacred Elder Tree. Caught by the volunteer cordon, Pipkin finally stopped and revealed he didn\'t steal the loaf to eat it—he wanted to use the sweet honeyberry scent to heal a family of sick forest wood-sprites nested in the hollow roots! Baker Bramble Mortimer is touched by the gesture.',
    imagePath: '/Assets/Ganache Grove/Story_Series1/Scene_04.png',
    imageAspect: '3/2',
    professionals: [
      'Baker Bramble Mortimer · Master Baker',
      'Rowan Thistle · Volunteer Coordinator',
      'Julie Frost · Gazette Reporter',
    ],
    playerAssignment: {
      title: 'Inspect Hollow & Safe Passage',
      description:
        'Evaluate the root hollow conditions and help Baker Bramble Mortimer set up a healing cream sharing station for the sprites.',
      options: [
        { icon: '🪓', label: 'Use Blacksmith Crumblewise\'s tools to clear root debris', xpSkill: 'builder' },
        { icon: '🌊', label: 'Divert fresh water to the root spring', xpSkill: 'explorer' },
        { icon: '🤝', label: 'Distribute honeyberry portions to sprites', xpSkill: 'healer' },
      ],
    },
    rewards: { xp: 50, xpSkill: 'builder', coins: 20, influence: 20 },
    rowanNote:
      "Well, this changes everything. Pipkin actually had a good intention for once!",
    julieNote:
      "What a heart-warming twist! I'm editing the front page to showcase this act of kindness.",
  },

  // ─── STEP 5 ───────────────────────────────────────────────
  {
    id: 'canal-s1-5',
    stepNumber: 5,
    dayOffset: 4,
    category: 'Celebration · The Honeyberry Loaf Incident',
    title: 'The Honeyberry Feast',
    headline: 'GROVE CELEBRATES HONEYBERRY RECONCILIATION — PIPKIN HONORED AS ACCIDENTAL HERO',
    storyContext:
      'To celebrate the healing of the forest sprites, Captain Winston Butterfield hosted a special Honeyberry Feast in the town square. Baker Bramble Mortimer baked a giant communal loaf, and Pipkin was officially named the "Accidental Hero of the Week". The town is filled with joy, music, and the sweet aroma of honeyberries!',
    imagePath: '/Assets/Ganache Grove/Story_Series1/Pipkin_Nutterby.png',
    imageAspect: '3/2',
    professionals: [
      'Captain Winston Butterfield · Ribbon Cutter',
      'Baker Bramble Mortimer · Master Baker',
      'Julie Frost · Gazette Reporter',
    ],
    playerAssignment: {
      title: 'Claim Recognition Medallion',
      description:
        'The Town Explorer & Detective Winston has signed your certificate of volunteer services. Collect your Honeyberry Hero badge and complete your Series 1 training.',
      ctaLabel: 'Claim Badge & Complete Series 🏅',
    },
    rewards: {
      xp: 100,
      xpSkill: 'builder',
      coins: 30,
      influence: 50,
      badgeProgress: 'Honeyberry Hero · COMPLETE',
      badgeId: 'honeyberry-hero',
    },
    rowanNote:
      "We did it! The sprites are healthy, the loaf was delicious, and Pipkin promises to ask next time.",
    julieNote:
      "Here is your souvenir Gazette Celebration Edition. Your name is prominent on the community honor roll!",
  },
];

// ── Helper: get step by ID ─────────────────────────────────
export const getCanalStep = (id: string): CanalSeriesStep | undefined =>
  CANAL_SERIES.find(s => s.id === id);

// ── Helper: get active step for today ─────────────────────
// Progression is strictly milestone-based.
// Returns the first step in order that the player hasn't completed yet.
export const getActiveCanalStep = (
  _series1StartDate: string | null,
  completedSeriesSteps: string[]
): CanalSeriesStep | null => {
  // Find the first uncompleted step
  const next = CANAL_SERIES.find(s => !completedSeriesSteps.includes(s.id));
  if (next) return next;

  // All steps completed — return the last step
  return CANAL_SERIES[CANAL_SERIES.length - 1];
};

// ── Helper: series completion percentage ──────────────────
export const getCanalProgressPct = (completedSeriesSteps: string[]): number => {
  const completed = CANAL_SERIES.filter(s => completedSeriesSteps.includes(s.id)).length;
  return Math.round((completed / CANAL_SERIES.length) * 100);
};
