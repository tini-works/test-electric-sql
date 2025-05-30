import { createContext, useEffect, useState, ReactNode } from 'react';
import { 
  User as FirebaseUser, 
  onAuthStateChanged, 
  signInWithPopup, 
  signOut as firebaseSignOut 
} from 'firebase/auth';
import { auth, googleProvider } from '../services/firebase';
import axios from 'axios';

// Define the User type
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'EMPLOYEE' | 'MANAGER' | 'FINANCE' | 'ADMIN';
  departmentId?: string;
  departmentName?: string;
  managerId?: string;
  managerName?: string;
  avatarUrl?: string;
  isActive: boolean;
}

// Define the AuthContext type
interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  error: string | null;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

// Create the AuthContext
export const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  loading: true,
  error: null,
  signInWithGoogle: async () => {},
  signOut: async () => {},
});

// Create the AuthProvider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Function to fetch user data from the API
  const fetchUserData = async (firebaseUser: FirebaseUser) => {
    try {
      // Get the ID token from Firebase
      const idToken = await firebaseUser.getIdToken();
      
      // Set the token in the Authorization header for all future requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${idToken}`;
      
      // Fetch the user data from the API
      const response = await axios.get('/api/users/me');
      
      // Set the user data
      setCurrentUser(response.data);
      setError(null);
    } catch (error) {
      console.error('Error fetching user data:', error);
      setError('Failed to fetch user data. Please try again.');
      setCurrentUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // User is signed in
        await fetchUserData(firebaseUser);
      } else {
        // User is signed out
        setCurrentUser(null);
        setLoading(false);
        // Remove the Authorization header
        delete axios.defaults.headers.common['Authorization'];
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  // Sign in with Google
  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      setError(null);
      await signInWithPopup(auth, googleProvider);
      // The user data will be fetched by the onAuthStateChanged listener
    } catch (error) {
      console.error('Error signing in with Google:', error);
      setError('Failed to sign in with Google. Please try again.');
      setLoading(false);
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      setLoading(true);
      await firebaseSignOut(auth);
      setCurrentUser(null);
      setError(null);
    } catch (error) {
      console.error('Error signing out:', error);
      setError('Failed to sign out. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Create the auth context value
  const value = {
    currentUser,
    loading,
    error,
    signInWithGoogle,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

