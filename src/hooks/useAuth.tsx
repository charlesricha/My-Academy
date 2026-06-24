"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { User } from "@/types";

interface AuthContextType {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  firebaseUser: null,
  loading: true,
  refreshUser: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = async () => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      try {
        const userDoc = await getDoc(doc(db, "users", currentUser.uid));
        if (userDoc.exists()) {
          setUser(userDoc.data() as User);
        }
      } catch (error) {
        console.error("Error refreshing user in Firestore:", error);
      }
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fUser) => {
      setFirebaseUser(fUser);
      
      if (fUser) {
        try {
          // Fetch custom user data from Firestore
          const userDoc = await getDoc(doc(db, "users", fUser.uid));
          if (userDoc.exists()) {
            setUser(userDoc.data() as User);
          } else {
            // Initialize new user in Firestore if not exists
            const newUser: User = {
              uid: fUser.uid,
              name: fUser.displayName || "Learner",
              email: fUser.email || "",
              startDate: new Date().toISOString(),
              currentPhase: "phase-0",
              currentModule: "week-1",
              passedModules: [],
              streak: 0,
              longestStreak: 0,
              lastSessionDate: new Date().toISOString(),
              totalSessionsCompleted: 0,
              totalAssignmentsAttempted: 0,
            };
            await setDoc(doc(db, "users", fUser.uid), newUser);
            setUser(newUser);
          }
        } catch (error) {
          console.error("Error fetching/initializing user in Firestore:", error);
          // Fallback to local state if Firestore is unreachable
          setUser({
            uid: fUser.uid,
            name: fUser.displayName || "Learner",
            email: fUser.email || "",
            startDate: new Date().toISOString(),
            currentPhase: "phase-0",
            currentModule: "week-1",
            passedModules: [],
            streak: 0,
            longestStreak: 0,
            lastSessionDate: new Date().toISOString(),
            totalSessionsCompleted: 0,
            totalAssignmentsAttempted: 0,
          });
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, firebaseUser, loading, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
