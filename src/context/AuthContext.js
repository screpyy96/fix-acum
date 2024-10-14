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

  const signUp = async ({ email, password, options }) => {
    const { data, error } = await supabase.auth.signUp({ email, password, options });
    if (error) throw error;

    // După înregistrare, salvează datele în tabelul profiles
    const { user } = data;

    // Asigură-te că user este definit
    if (user) {
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([
          {
            id: user.id, // Asigură-te că folosești ID-ul corect
            name: options.data.name, // Numele utilizatorului
            role: options.data.role, // Rolul utilizatorului
            trade: options.data.trade, // Meseria utilizatorului (dacă este necesar)
			
          }
        ]);

      if (profileError) {
        console.error('Error saving profile:', profileError);
        throw profileError; // Aruncă eroarea pentru a fi gestionată mai sus
      }
    }

    setUser(user);
    await fetchUserRole(user.id); // Obține rolul utilizatorului
    return { user };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    console.log('User signed out, checking session...');
    const { data: { session } } = await supabase.auth.getSession();
    console.log('Current session after sign out:', session);
    setUser(null);
    setUserRole(null);
    router.push('/');
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
