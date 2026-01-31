import React, { useState, useEffect } from 'react';
// FIX: Import User and onAuthStateChanged from firebaseService to centralize firebase logic
import { type User, onAuthStateChanged, auth, signOutUser } from './services/firebaseService';
import { ADMIN_EMAILS } from './constants';
import LoginScreen from './components/LoginScreen';
import Dashboard from './components/Dashboard';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        if (ADMIN_EMAILS.includes(currentUser.email?.toLowerCase() ?? '')) {
          setUser(currentUser);
          setAuthError(null);
        } else {
          // Non-admin user logged in, log them out immediately.
          await signOutUser();
          setUser(null);
          setAuthError("You are not authorized to access this application.");
        }
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {user ? <Dashboard user={user} /> : <LoginScreen authError={authError} />}
    </div>
  );
};

export default App;