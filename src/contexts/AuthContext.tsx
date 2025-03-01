
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase, getCurrentUser, createOrUpdateUserProfile } from '../lib/supabase';
import { UserGameStats } from '../types/supabase';

interface AuthContextType {
  user: any; // Supabase user object
  userStats: UserGameStats | null;
  loading: boolean;
  error: string | null;
  sessionId: string | null;
  setSessionId: (id: string | null) => void;
  setUsername: (username: string) => Promise<void>;
  username: string | null;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [userStats, setUserStats] = useState<UserGameStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(
    localStorage.getItem('globetrotter_session_id')
  );
  const [username, setUsernameState] = useState<string | null>(
    localStorage.getItem('globetrotter_username')
  );

  // Listen for auth changes
  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // Check for current user on mount
    const checkUser = async () => {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser || null);
        
        // If we have a user and a username, fetch their stats
        if (currentUser && username) {
          try {
            const { data, error } = await supabase
              .from('user_profiles')
              .select('score, games_played, username')
              .eq('id', currentUser.id)
              .single();
            
            if (!error && data) {
              setUserStats({
                correct_answers: data.score,
                total_games: data.games_played,
                username: data.username
              });
            }
          } catch (err) {
            console.error('Error fetching user stats:', err);
          }
        }
      } catch (err) {
        setError('Error checking authentication status');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    checkUser();

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [username]);

  // Save session ID to localStorage when it changes
  useEffect(() => {
    if (sessionId) {
      localStorage.setItem('globetrotter_session_id', sessionId);
    } else {
      localStorage.removeItem('globetrotter_session_id');
    }
  }, [sessionId]);

  const setUsername = async (newUsername: string) => {
    try {
      if (user) {
        // Update the user profile in Supabase
        await createOrUpdateUserProfile(user.id, newUsername);
      }
      
      // Always store username locally for a more seamless experience
      localStorage.setItem('globetrotter_username', newUsername);
      setUsernameState(newUsername);
    } catch (err) {
      console.error('Error setting username:', err);
      setError('Failed to set username');
    }
  };

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setUserStats(null);
      localStorage.removeItem('globetrotter_username');
      localStorage.removeItem('globetrotter_session_id');
      setUsernameState(null);
      setSessionId(null);
    } catch (err) {
      console.error('Error signing out:', err);
      setError('Failed to sign out');
    }
  };

  const value = {
    user,
    userStats,
    loading,
    error,
    sessionId,
    setSessionId,
    setUsername,
    username,
    signOut: handleSignOut
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
