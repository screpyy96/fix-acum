"use client";
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

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
      const updatedUser = { ...authUser, role: profileData?.role, trade: profileData?.trade };
      setUser(updatedUser);
      console.log('User state updated:', updatedUser);
    } else {
      setUser(null);
      console.log('User state cleared');
    }
    setLoading(false);
  }, [fetchUserProfile]);

  const checkUser = useCallback(async () => {
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      await updateUserState(authUser);
    } catch (error) {
      console.error('Error in checkUser:', error);
      setUser(null);
      setLoading(false);
    }
  }, [updateUserState]);

  const handleAuthChange = useCallback(async (event, session) => {
    console.log('Auth state changed:', event);
    if (event === 'SIGNED_IN' && session) {
      await updateUserState(session.user);
    } else if (event === 'SIGNED_OUT') {
      setUser(null);
      console.log('User signed out');
      router.push('/');
    }
    setLoading(false);
  }, [updateUserState, router]);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(handleAuthChange);
    checkUser();
    return () => subscription.unsubscribe();
  }, [checkUser, handleAuthChange]);

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

      await updateUserState(data.user);
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

  console.log('Current auth context value:', value);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);