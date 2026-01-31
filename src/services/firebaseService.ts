// FIX: Add a triple-slash directive to include Vite's client types. This defines `import.meta.env` for TypeScript and resolves the type errors.
/// <reference types="vite/client" />

import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  signOut,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  getDocs, 
  doc, 
  getDoc, 
  setDoc 
} from 'firebase/firestore';
import { Developer } from '../types';

// Load Firebase config from environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_ID
};

// Basic validation to ensure environment variables are loaded
if (!firebaseConfig.apiKey || firebaseConfig.apiKey === "YOUR_API_KEY") {
  throw new Error("Firebase configuration is missing. Please create a .env file and add your Firebase project credentials. See .env.example for details.");
}


// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// --- Auth Functions ---

export const signIn = (email: string, password: string) => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const signOutUser = () => {
  return signOut(auth);
};

export { onAuthStateChanged };
export type { User };

// --- Firestore Functions ---

const devsCollection = collection(db, 'devs');
const configCollection = collection(db, 'config');

export const getDevelopers = async (): Promise<Developer[]> => {
  const snapshot = await getDocs(devsCollection);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Developer));
};

export const getSkillsCatalog = async (): Promise<string[]> => {
  try {
    const docRef = doc(configCollection, 'skillsCatalog');
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return (docSnap.data().skills || []) as string[];
    }
    console.warn("skillsCatalog document not found in config collection. Using default skills.");
    // Fallback if document doesn't exist
    return ["JavaScript", "TypeScript", "Node.js", "React", "Python", "AWS", "Azure", "GCP", "DevOps", "Kubernetes", "n8n", "QA", "Data Engineering"];
  } catch (error) {
    console.error("Error fetching skills catalog:", error);
    return [];
  }
};

export const developerExists = async (email: string): Promise<boolean> => {
    const normalizedEmail = email.trim().toLowerCase();
    const docRef = doc(db, 'devs', normalizedEmail);
    const docSnap = await getDoc(docRef);
    return docSnap.exists();
};

export const addDeveloper = async (developerData: Omit<Developer, 'id'>): Promise<void> => {
  const normalizedEmail = developerData.email.trim().toLowerCase();
  const docRef = doc(db, 'devs', normalizedEmail);
  return setDoc(docRef, developerData);
};