import { useEffect, useState, useCallback } from 'react';
import {
  type User,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { auth } from '../lib/firebase';
import { syncUserProgressWithCloud, clearLocalProgressOnLogout } from '../services/cloudProgress';
import { AuthContext } from './AuthContextCore';

// Pre-instantiated Google Auth Provider for zero-latency instant popup
const googleProvider = new GoogleAuthProvider();

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(() => Boolean(auth && typeof onAuthStateChanged === 'function'));
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncedAt, setLastSyncedAt] = useState<Date | null>(null);

  // Helper to sync all user progress (typing speed, level record, stats) with Firestore
  const triggerSync = useCallback(async (currentUser: User) => {
    try {
      setIsSyncing(true);
      const res = await syncUserProgressWithCloud(currentUser);
      if (res.success) {
        setLastSyncedAt(new Date());
      }
    } catch (err) {
      console.warn('Background sync warning:', err);
    } finally {
      setIsSyncing(false);
    }
  }, []);

  const syncNow = useCallback(async () => {
    if (user) {
      await triggerSync(user);
    }
  }, [user, triggerSync]);

  useEffect(() => {
    let unsubscribe = () => {};
    try {
      if (auth && typeof onAuthStateChanged === 'function') {
        getRedirectResult(auth)
          .then((result) => {
            if (result?.user) {
              setUser(result.user);
              setTimeout(() => triggerSync(result.user).catch(() => {}), 500);
            }
          })
          .catch((error) => {
            if (error?.code && error.code !== 'auth/null-user') {
              console.warn('Redirect sign-in check error:', error);
            }
          });

        unsubscribe = onAuthStateChanged(
          auth,
          (currentUser) => {
            setUser(currentUser);
            setLoading(false);
            if (currentUser) {
              // Run full cloud sync so all levels, speed, and history are restored
              setTimeout(() => triggerSync(currentUser).catch(() => {}), 300);
            }
          },
          (error) => {
            console.warn('Auth state subscription warning:', error);
            setLoading(false);
          }
        );
      }
    } catch (err) {
      console.warn('Auth setup warning:', err);
      queueMicrotask(() => setLoading(false));
    }

    return () => {
      try {
        unsubscribe();
      } catch {}
    };
  }, [triggerSync]);

  const loginWithGoogleRedirect = async () => {
    await signInWithRedirect(auth, googleProvider);
  };

  const loginWithGoogle = async (): Promise<void> => {
    const result = await signInWithPopup(auth, googleProvider);
    if (result?.user) {
      setUser(result.user);
    }
  };

  const loginWithEmail = async (email: string, pass: string) => {
    const cred = await signInWithEmailAndPassword(auth, email, pass);
    if (cred.user) {
      setTimeout(() => triggerSync(cred.user).catch(() => {}), 300);
    }
  };

  const signupWithEmail = async (email: string, pass: string) => {
    const cred = await createUserWithEmailAndPassword(auth, email, pass);
    if (cred.user) {
      setTimeout(() => triggerSync(cred.user).catch(() => {}), 300);
    }
  };

  const sendPasswordReset = async (email: string) => {
    await sendPasswordResetEmail(auth, email);
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } finally {
      setUser(null);
      clearLocalProgressOnLogout();
      try {
        if (typeof sessionStorage !== 'undefined') {
          sessionStorage.clear();
        }
      } catch {}
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        loginWithGoogle,
        loginWithGoogleRedirect,
        loginWithEmail,
        signupWithEmail,
        sendPasswordReset,
        logout,
        isSyncing,
        lastSyncedAt,
        syncNow,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
