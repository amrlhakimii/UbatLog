import { useEffect, useState, type ReactNode } from 'react';
import type { User } from 'firebase/auth';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase/config';
import { signInWithGoogle, signOut } from '../firebase/auth';
import { isWhitelisted } from '../config/whitelist';
import { AuthContext, type AuthContextValue } from './auth-context';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const value: AuthContextValue = {
    user,
    loading,
    authorized: isWhitelisted(user?.email),
    signIn: async () => {
      await signInWithGoogle();
    },
    signOut: async () => {
      await signOut();
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
