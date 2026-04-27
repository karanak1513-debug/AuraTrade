import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  signInWithPopup,
  updateProfile,
  GoogleAuthProvider
} from 'firebase/auth';
import { auth, db, googleProvider } from '../firebase/config';
import { doc, getDoc, setDoc, serverTimestamp, onSnapshot, collection, getDocs, writeBatch, deleteDoc } from 'firebase/firestore';
const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  async function signup(email, password, name) {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    const user = res.user;
    
    await updateProfile(user, { displayName: name });

    // Initial user data in Firestore
    const userDoc = {
      uid: user.uid,
      name: name,
      email: email,
      role: 'user',
      balance: 1000000,
      totalPortfolioValue: 0,
      totalProfitLoss: 0,
      joinedAt: serverTimestamp(),
      rank: 'Beginner',
      quizAccuracy: 0,
      totalQuizAttempts: 0,
      totalTrades: 0,
      learningStreak: 0,
      status: 'active'
    };

    await setDoc(doc(db, "users", user.uid), userDoc);
    setUserData(userDoc); // Update local state immediately
    
    // Create settings
    await setDoc(doc(db, "userSettings", user.uid), {
      theme: 'dark',
      notifications: true,
      preferredQuizTopics: []
    });

    return res;
  }

  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  async function loginWithGoogle() {
    const res = await signInWithPopup(auth, googleProvider);
    const user = res.user;
    
    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) {
      // Create new user if first time Google login
      await setDoc(userRef, {
        uid: user.uid,
        name: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        role: 'user',
        balance: 1000000,
        totalPortfolioValue: 0,
        totalProfitLoss: 0,
        joinedAt: serverTimestamp(),
        rank: 'Beginner',
        quizAccuracy: 0,
        totalQuizAttempts: 0,
        totalTrades: 0,
        learningStreak: 0,
        status: 'active'
      });
    }
    return res;
  }

  function logout() {
    return signOut(auth);
  }

  useEffect(() => {
    let unsubscribeUser = null;

    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      setLoading(false);

      if (user) {
        const userRef = doc(db, "users", user.uid);
        // Start listening to the individual user document
        unsubscribeUser = onSnapshot(userRef, (doc) => {
          if (doc.exists()) {
            setUserData(doc.data());
          }
        }, (error) => {
          console.error("Firestore user sync error:", error);
        });
      } else {
        setUserData(null);
        if (unsubscribeUser) unsubscribeUser();
      }
    });

    // Offline Simulation Sync
    const syncMockBalance = () => {
      const mb = localStorage.getItem('mockBalance');
      if (mb) {
        setUserData(prev => ({ ...(prev || {}), balance: Number(mb) }));
      }
    };
    window.addEventListener('mockBalanceUpdate', syncMockBalance);
    syncMockBalance();

    return () => {
      unsubscribeAuth();
      if (unsubscribeUser) unsubscribeUser();
      window.removeEventListener('mockBalanceUpdate', syncMockBalance);
    };
  }, []);

  async function updateUserSettings(settings) {
    if (!currentUser) return;
    await setDoc(doc(db, "userSettings", currentUser.uid), settings, { merge: true });
  }

  async function resetTradingData() {
    if (!currentUser) return;
    
    // 1. Reset Firestore balance and stats
    const userRef = doc(db, "users", currentUser.uid);
    await setDoc(userRef, {
      balance: 1000000,
      totalPortfolioValue: 0,
      totalProfitLoss: 0,
      totalTrades: 0,
      rank: 'Beginner'
    }, { merge: true });

    // 2. Clear holdings (Note: in a real app you'd loop and delete or use a function)
    // For this simulation, we'll assume we just want to reset the balance and the holdings view will refresh
    // Ideally we delete the items in the holdings subcollection
    const holdingsRef = collection(db, `holdings/${currentUser.uid}/items`);
    const holdingsSnap = await getDocs(holdingsRef);
    const batch = writeBatch(db);
    holdingsSnap.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });
    await batch.commit();

    // 3. Clear LocalStorage
    localStorage.removeItem('mockBalance');
    localStorage.removeItem('mockOrders');
    localStorage.removeItem('watchlist');
    
    // Dispatch event to sync UI
    window.dispatchEvent(new Event('mockBalanceUpdate'));
  }

  async function deleteAccount() {
    if (!currentUser) return;
    
    const uid = currentUser.uid;
    
    // 1. Delete Firestore data
    await deleteDoc(doc(db, "users", uid));
    await deleteDoc(doc(db, "userSettings", uid));
    
    // 2. Delete Auth Account
    await currentUser.delete();
  }

  const value = {
    currentUser,
    userData,
    signup,
    login,
    logout,
    loginWithGoogle,
    updateUserSettings,
    resetTradingData,
    deleteAccount
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
