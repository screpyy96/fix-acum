"use client";
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const initializeSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        console.error('Error fetching session:', error);
      }
      setUser(session?.user ?? null);
      setLoading(false);
    };

    initializeSession();

    const { data: listener } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event);
      await updateUserState(session?.user ?? null);
    });

    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  const fetchUserProfile = useCallback(async (userId) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('role, trade')
        .eq('id', userId)
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  }, []);

  const updateUserState = useCallback(async (authUser) => {
    if (authUser) {
      const profileData = await fetchUserProfile(authUser.id);
      if (profileData) {
        const updatedUser = { 
          ...authUser, 
          user_metadata: { 
            ...authUser.user_metadata, 
            role: profileData.role, 
            trade: profileData.trade 
          } 
        };
        setUser(updatedUser);
        saveUserToLocalStorage(updatedUser);
        console.log('User state updated:', updatedUser);
      } else {
        // Dacă nu se obține profileData, curăță utilizatorul
        setUser(null);
        localStorage.removeItem('user');
        console.log('Profile data missing, user state cleared');
        // Eliminare redirect din context
      }
    } else {
      setUser(null);
      localStorage.removeItem('user');
      console.log('User state cleared');
      // Eliminare redirect din context
    }
    setLoading(false);
  }, [fetchUserProfile]);

  const checkUser = useCallback(async () => {
    try {
      const { data: { user: authUser }, error } = await supabase.auth.getUser();
      if (error) throw error;
      console.log('Auth user from checkUser:', authUser); // Log pentru debugging
      await updateUserState(authUser);
    } catch (error) {
      console.error('Error in checkUser:', error);
      setUser(null);
      localStorage.removeItem('user');
      // Eliminare redirect din context
    } finally {
      setLoading(false);
    }
  }, [updateUserState]);

  const handleAuthChange = useCallback(async (event, session) => {
    console.log('Auth state changed:', event);
    if (event === 'SIGNED_IN' && session) {
      console.log('Session on sign in:', session); // Log pentru debugging
      await updateUserState(session.user);
    } else if (event === 'SIGNED_OUT') {
      setUser(null);
      localStorage.removeItem('user');
      console.log('User signed out');
      router.push('/'); // Este acceptabil să redirecționezi la homepage la sign-out
    }
    setLoading(false);
  }, [updateUserState, router]);

  const signUp = async ({ email, password, options }) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({ email, password, options });
      if (error) throw error;

      const { user } = data;
      if (user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            {
              id: user.id,
              name: options.data.name,
              role: options.data.role,
              trade: options.data.trade,
            }
          ]);

        if (profileError) {
          console.error('Error saving profile:', profileError);
          throw profileError;
        }

        await updateUserState(user);
      }

      return { user };
    } catch (error) {
      console.error('Error in signUp:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signIn = async ({ email, password }) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;

      console.log('User data after sign in:', data.user);
      const profileData = await fetchUserProfile(data.user.id);
      if (profileData) {
        const updatedUser = { 
          ...data.user, 
          user_metadata: { 
            ...data.user.user_metadata, 
            role: profileData.role, 
            trade: profileData.trade 
          } 
        };
        setUser(updatedUser);
        saveUserToLocalStorage(updatedUser);
        console.log('User signed in and profile updated:', updatedUser);
      } else {
        throw new Error('Profile data missing after sign in');
      }
      return data;
    } catch (error) {
      console.error('Error in signIn:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      await supabase.auth.signOut();
      setUser(null);
      localStorage.removeItem('user');
      console.log('User signed out successfully');
      router.push('/');
    } catch (error) {
      console.error('Error in signOut:', error);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    signUp,
    signOut,
    signIn,
    setUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

const saveUserToLocalStorage = (userData) => {
  localStorage.setItem('user', JSON.stringify(userData));
};

export const loadUserFromLocalStorage = () => {
  if (typeof window !== 'undefined') {
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
  }
  return null;
};
