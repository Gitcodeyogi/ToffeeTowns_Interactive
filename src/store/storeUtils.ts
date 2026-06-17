import { doc, setDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';

export const syncToDb = async (uid: string, data: Record<string, any>) => {
  try {
    await setDoc(doc(db, 'users', uid), data, { merge: true });
  } catch (err) {
    console.error('Firestore sync error:', err);
  }
};

export const saveUserState = (uid: string, s: any) => {
  syncToDb(uid, {
    homeTown: s.homeTown,
    welcomeDone: s.welcomeDone,
    coins: s.coins,
    coinHistory: s.coinHistory,
    earnedBadges: s.earnedBadges,
    legacyPoints: s.legacyPoints,
    legacyTitles: s.legacyTitles,
    skills: s.skills,
    completedMissions: s.completedMissions,
    mailbox: s.mailbox,
    townWelcomeShown: s.townWelcomeShown,
    travellerName: s.travellerName,
    lastStampedDate: s.lastStampedDate,
    claimedStamps: s.claimedStamps,
    ownedDecorations: s.ownedDecorations,
    equippedDecorations: s.equippedDecorations,
    ownedPets: s.ownedPets,
    equippedPet: s.equippedPet,
    premiumPassport: s.premiumPassport,
    activePasses: s.activePasses,
    activeTransport: s.activeTransport,
    ownedTransports: s.ownedTransports,
    ownedEstates: s.ownedEstates,
    taskQueue: s.taskQueue,
    pendingRewards: s.pendingRewards,
    completedActions: s.completedActions,
    walkwayStatus: s.walkwayStatus,
    lastFlashNewsShownBlock: s.lastFlashNewsShownBlock,
    latestFlashNews: s.latestFlashNews,
  });
};

export const defaultState = {
  homeTown: null,
  welcomeDone: false,
  coins: 50,
  coinHistory: [],
  earnedBadges: [],
  legacyPoints: 0,
  legacyTitles: [],
  skills: {},
  completedMissions: [],
  townWelcomeShown: false,
  travellerName: '',
  mailbox: [
    {
      id: 'mail-001',
      from: 'Mayor Pompelmoose',
      subject: 'Welcome to the Province!',
      body: 'Dear Traveller, your arrival has been noted in the Grand Ledger of Toffee Town. Proceed to the Desk and begin building your legacy. The spoon is already 12 feet tall.',
      read: false,
      timestamp: new Date().toISOString(),
    },
    {
      id: 'mail-002',
      from: 'Chucklebop (Rebel HQ)',
      subject: 'Psst... we saw you arrive',
      body: "Don't let the Mayor scare you. We've got room for one more rebel. Come find us near Peanut Butter Falls when you're ready. Bring snacks.",
      read: false,
      timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    },
  ],
  lastStampedDate: null,
  claimedStamps: [],
  ownedDecorations: [],
  equippedDecorations: [],
  ownedPets: [],
  equippedPet: null,
  premiumPassport: false,
  activePasses: [],
  activeTransport: 'walk' as const,
  ownedTransports: ['walk'],
  ownedEstates: ['mossberry-cottage'],
  taskQueue: [],
  pendingRewards: [],
  currentEncounter: null,
  completedActions: [],
  walkwayStatus: 'pending' as const,
  lastFlashNewsShownBlock: null,
  latestFlashNews: null,
  completedSeriesSteps: [],
  series1StartDate: null,
};
