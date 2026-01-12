import { useState, useEffect, createContext, useContext } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface User {
  id: string;
  name: string;
  email: string;
  created_at: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string, name: string) => Promise<{ error: string | null }>;
  signOut: () => void;
}

const AUTH_STORAGE_KEY = 'catalog_auth';

export const useAuth = (): AuthContextType => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load persisted session on mount
  useEffect(() => {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY);
    if (stored) {
      try {
        const { user: storedUser } = JSON.parse(stored);
        setUser(storedUser);
      } catch (e) {
        localStorage.removeItem(AUTH_STORAGE_KEY);
      }
    }
    setIsLoading(false);
  }, []);

  const signIn = async (email: string, password: string): Promise<{ error: string | null }> => {
    try {
      const response = await supabase.functions.invoke('auth', {
        body: { action: 'login', email, password },
      });

      if (response.error) {
        return { error: response.error.message || 'Login failed' };
      }

      if (response.data?.error) {
        return { error: response.data.error };
      }

      const { user: authUser, token } = response.data;
      setUser(authUser);
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ user: authUser, token }));
      
      return { error: null };
    } catch (e) {
      console.error('Sign in error:', e);
      return { error: 'Failed to connect to server' };
    }
  };

  const signUp = async (email: string, password: string, name: string): Promise<{ error: string | null }> => {
    try {
      const response = await supabase.functions.invoke('auth', {
        body: { action: 'signup', email, password, name },
      });

      if (response.error) {
        return { error: response.error.message || 'Signup failed' };
      }

      if (response.data?.error) {
        return { error: response.data.error };
      }

      const { user: authUser, token } = response.data;
      setUser(authUser);
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ user: authUser, token }));
      
      return { error: null };
    } catch (e) {
      console.error('Sign up error:', e);
      return { error: 'Failed to connect to server' };
    }
  };

  const signOut = () => {
    setUser(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
  };

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    signIn,
    signUp,
    signOut,
  };
};
