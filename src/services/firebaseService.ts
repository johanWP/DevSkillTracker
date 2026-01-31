// FIX: Switched to Firebase v8 compat API to resolve module errors.
// This assumes the project has an older version of the Firebase SDK (< v9) installed.
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

import { Developer } from '../types';

// Re-export User type for compatibility with other components
export type User = firebase.User;


// Load Firebase config from environment variables
const firebaseConfig = {
  // FIX: Cast import.meta to any to avoid TypeScript errors when vite/client types are not found.
  apiKey: (import.meta as any).env.VITE_API_KEY,
  authDomain: (import.meta as any).env.VITE_AUTH_DOMAIN,
  projectId: (import.meta as any).env.VITE_PROJECT_ID,
  storageBucket: (import.meta as any).env.VITE_STORAGE_BUCKET,
  messagingSenderId: (import.meta as any).env.VITE_MESSAGING_SENDER_ID,
  appId: (import.meta as any).env.VITE_APP_ID
};

// Basic validation to ensure environment variables are loaded
if (!firebaseConfig.apiKey || firebaseConfig.apiKey === "YOUR_API_KEY") {
  throw new Error("Firebase configuration is missing. Please create a .env file and add your Firebase project credentials. See .env.example for details.");
}


// Initialize Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
export const auth = firebase.auth();
export const db = firebase.firestore();

// --- Auth Functions ---

export const signIn = (email: string, password: string) => {
  return auth.signInWithEmailAndPassword(email, password);
};

export const signOutUser = () => {
  return auth.signOut();
};

// Shim to provide v9-style onAuthStateChanged for compatibility with App.tsx
export const onAuthStateChanged = (
    authInstance: firebase.auth.Auth, 
    callback: (user: User | null) => void
) => {
    return authInstance.onAuthStateChanged(callback);
};

// --- Firestore Functions ---

const devsCollection = db.collection('devs');
const configCollection = db.collection('config');

export const getDevelopers = async (): Promise<Developer[]> => {
  const snapshot = await devsCollection.get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Developer));
};

export const getSkillsCatalog = async (): Promise<string[]> => {
  try {
    const docRef = configCollection.doc('skillsCatalog');
    const docSnap = await docRef.get();
    if (docSnap.exists) {
      return (docSnap.data()?.skills || []) as string[];
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
    const docRef = db.collection('devs').doc(normalizedEmail);
    const docSnap = await docRef.get();
    return docSnap.exists;
};

export const addDeveloper = async (developerData: Omit<Developer, 'id'>): Promise<void> => {
  const normalizedEmail = developerData.email.trim().toLowerCase();
  const docRef = db.collection('devs').doc(normalizedEmail);
  return docRef.set(developerData);
};
