"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userTrade, setUserTrade] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Verifică cookie-ul la inițializare
    const userCookie = Cookies.get('user');
    if (userCookie) {
      const parsedUser = JSON.parse(userCookie);
      setUser(parsedUser);
      setUserRole(parsedUser.role); // Asumăm că rolul este stocat în cookie
      setUserTrade(parsedUser.trade); // Setează și trade din cookie
      console.log(parsedUser.trade, 'userTrade din cookie');
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange(handleAuthChange);
    checkUser();
    return () => subscription.unsubscribe();
  }, []);

  async function checkUser() {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
  
    setUser(user);
    if (user) {
      const { data } = await supabase
        .from('profiles')
        .select('role, trade')
        .eq('id', user.id)
        .single();
      
      setUserRole(data?.role);
      setUserTrade(data?.trade);
    }
    setLoading(false);
  }

  async function handleAuthChange(event, session) {
    setLoading(true);
    if (event === 'SIGNED_IN') {
      setUser(session.user);
      const { data } = await supabase.from('profiles').select('role, trade').eq('id', session.user.id).single();
      setUserRole(data?.role);
      setUserTrade(data?.trade);

      // Setează cookie-ul la autentificare cu toate datele necesare
      Cookies.set('user', JSON.stringify({
        id: session.user.id, 
        email: session.user.email, 
        role: data?.role, 
        trade: data?.trade
      }), { expires: 7 });
    } else if (event === 'SIGNED_OUT') {
      setUser(null);
      setUserRole(null);
      setUserTrade(null);
      Cookies.remove('user'); // Șterge cookie-ul la deconectare
      router.push('/');
    }
    setLoading(false);
  }

  const signUp = async ({ email, password, options }) => {
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

      // Setează cookie-ul după înregistrare
      Cookies.set('user', JSON.stringify({
        id: user.id, 
        email, 
        role: options.data.role, 
        trade: options.data.trade
      }), { expires: 7 });
    }

    setUser(user);
    setUserTrade(options.data.trade); // Setează trade-ul după înregistrare
    await fetchUserRole(user.id);
    return { user };
  };

  const signIn = async ({ email, password }) => {
    setLoading(true);
    console.log('Încercare de autentificare pentru:', email);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      setUser(data.user);

      const { data: profileData } = await supabase
        .from('profiles')
        .select('role, trade')
        .eq('id', data.user.id)
        .single();
      
      setUserRole(profileData?.role);
      setUserTrade(profileData?.trade); // Setează și `trade`

      // Setează cookie-ul la autentificare cu toate datele necesare
      Cookies.set('user', JSON.stringify({
        id: data.user.id, 
        email, 
        role: profileData?.role, 
        trade: profileData?.trade
      }), { expires: 7 });

      return data;
    } catch (error) {
      console.error('Eroare la autentificare:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    console.log('User signed out, checking session...');
    setUser(null);
    setUserRole(null);
    setUserTrade(null);
    Cookies.remove('user'); // Șterge cookie-ul la deconectare
    router.push('/');
  };

  const value = {
    user,
    userRole,
    userTrade,
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
