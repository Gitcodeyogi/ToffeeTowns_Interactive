import { initializeApp, getApps } from "firebase/app";
import { getAuth, setPersistence, browserLocalPersistence } from "firebase/auth";
import { getFirestore, initializeFirestore, persistentLocalCache, Firestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBgEsHW_A91VQQKjfPmDrFsHEGT8wz3qEE",
  authDomain: "adventures-of-chucklebop.firebaseapp.com",
  databaseURL: "https://adventures-of-chucklebop-default-rtdb.firebaseio.com",
  projectId: "adventures-of-chucklebop",
  storageBucket: "adventures-of-chucklebop.firebasestorage.app",
  messagingSenderId: "27918545813",
  appId: "1:27918545813:web:1f66ffa0aff3e711dbfc9c",
  measurementId: "G-Z8Q51FJY0J"
};

const existingApps = getApps();
const app = existingApps.length > 0 ? existingApps[0] : initializeApp(firebaseConfig);

// Initialize Auth
const auth = getAuth(app);
setPersistence(auth, browserLocalPersistence).catch(() => {});

// Initialize Firestore
let db: Firestore;
try {
  db = initializeFirestore(app, { 
    localCache: persistentLocalCache({}) 
  });
} catch (e) {
  console.warn("Firestore persistence failed, falling back to memory:", e);
  db = getFirestore(app);
}

const storage = getStorage(app);

export { app, auth, db, storage };
