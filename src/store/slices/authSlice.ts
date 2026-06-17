import type { StateCreator } from 'zustand';
import { auth, db } from '../../firebaseConfig';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
  type User as FirebaseUser
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import type { TTStore } from '../useTTStore';
import { defaultState, syncToDb } from '../storeUtils';

export interface AuthSlice {
  user: FirebaseUser | null;
  authLoading: boolean;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  registerWithEmail: (email: string, pass: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  initAuth: () => void;
}

export const createAuthSlice: StateCreator<
  TTStore,
  [],
  [],
  AuthSlice
> = (set, _get) => ({
  user: null,
  authLoading: true,

  loginWithEmail: async (email, pass) => {
    set({ authLoading: true });
    try {
      await signInWithEmailAndPassword(auth, email, pass);
    } catch (e) {
      set({ authLoading: false });
      throw e;
    }
  },

  registerWithEmail: async (email, pass, name) => {
    set({ authLoading: true });
    try {
      const credential = await createUserWithEmailAndPassword(auth, email, pass);
      if (credential.user) {
        await updateProfile(credential.user, { displayName: name });
        // Write initial state to Firestore immediately
        await syncToDb(credential.user.uid, {
          ...defaultState,
          travellerName: name,
          createdAt: new Date().toISOString(),
        });
      }
    } catch (e) {
      set({ authLoading: false });
      throw e;
    }
  },

  logout: async () => {
    set({ authLoading: true });
    try {
      await signOut(auth);
    } finally {
      // reset local storage store
      set({
        user: null,
        currentPage: 'welcome',
        ...defaultState,
        authLoading: false
      });
    }
  },

  initAuth: () => {
    onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        set({ user: firebaseUser, authLoading: true });
        try {
          const docSnap = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (docSnap.exists()) {
            const data = docSnap.data();
            set({
              homeTown: data.homeTown || null,
              welcomeDone: data.welcomeDone || false,
              coins: data.coins ?? 50,
              coinHistory: data.coinHistory || [],
              earnedBadges: data.earnedBadges || [],
              legacyPoints: data.legacyPoints || 0,
              legacyTitles: data.legacyTitles || [],
              skills: data.skills || {},
              completedMissions: data.completedMissions || [],
              mailbox: data.mailbox || [],
              townWelcomeShown: data.townWelcomeShown || false,
              travellerName: data.travellerName || firebaseUser.displayName || '',
              currentPage: 'welcome',
              authLoading: false,
              lastStampedDate: data.lastStampedDate || null,
              claimedStamps: data.claimedStamps || [],
              ownedDecorations: data.ownedDecorations || [],
              equippedDecorations: data.equippedDecorations || [],
              ownedPets: data.ownedPets || [],
              equippedPet: data.equippedPet || null,
              premiumPassport: data.premiumPassport || false,
              activePasses: data.activePasses || [],
              activeTransport: data.activeTransport || 'walk',
              ownedTransports: data.ownedTransports || ['walk'],
              ownedEstates: data.ownedEstates || ['mossberry-cottage'],
              taskQueue: data.taskQueue || [],
              pendingRewards: data.pendingRewards || [],
              currentEncounter: data.currentEncounter || null,
              completedActions: data.completedActions || [],
              walkwayStatus: data.walkwayStatus || 'pending',
              lastFlashNewsShownBlock: data.lastFlashNewsShownBlock || null,
              latestFlashNews: data.latestFlashNews || null,
              completedSeriesSteps: data.completedSeriesSteps || [],
              series1StartDate: data.series1StartDate || null,
            });
          } else {
            // If auth user is created but Firestore document doesn't exist yet
            const initial = {
              ...defaultState,
              travellerName: firebaseUser.displayName || '',
            };
            await syncToDb(firebaseUser.uid, initial);
            set({
              ...initial,
              currentPage: 'welcome',
              authLoading: false,
            });
          }
        } catch (err) {
          console.error('Error hydrating user details from Firestore:', err);
          set({ authLoading: false });
        }
      } else {
        set({
          user: null,
          currentPage: 'welcome',
          ...defaultState,
          authLoading: false,
        });
      }
    });
  },
});
