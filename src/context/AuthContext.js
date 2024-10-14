"use client"
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(handleAuthChange);
    checkUser();
    return () => subscription.unsubscribe();
  }, []);

  async function checkUser() {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
    if (user) {
      const { data } = await supabase.from('profiles').select('role').eq('id', user.id).single();
      setUserRole(data?.role);
    }
    setLoading(false);
  }

  async function handleAuthChange(event, session) {
    setLoading(true);
    if (event === 'SIGNED_IN') {
      setUser(session.user);
      const { data } = await supabase.from('profiles').select('role').eq('id', session.user.id).single();
      setUserRole(data?.role);
    } else if (event === 'SIGNED_OUT') {
      setUser(null);
      setUserRole(null);
      router.push('/');
    }
    setLoading(false);
  }

  const signUp = async (data) => {
    setLoading(true);
    const { error } = await supabase.auth.signUp(data);
    if (!error) {
      console.log('Înregistrare reușită. Verifică emailul pentru confirmare.');
    }
    setLoading(false);
    return { error };
  };

  const signOut = async () => {
    setLoading(true);
    await supabase.auth.signOut();
    setUser(null);
    setUserRole(null);
    router.push('/');
    setLoading(false);
  };

  const signIn = async ({ email, password }) => {
    setLoading(true);
    console.log('Încercare de autentificare pentru:', email);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      setUser(data.user);
      const { data: profileData } = await supabase.from('profiles').select('role').eq('id', data.user.id).single();
      setUserRole(profileData?.role);
      return data;
    } catch (error) {
      console.error('Eroare la autentificare:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    userRole,
    loading,
    signUp,
    signOut,
    signIn,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);