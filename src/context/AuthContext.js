"use client"
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
	const [user, setUser] = useState(null);
	const [userRole, setUserRole] = useState(null);
	const router = useRouter();

	useEffect(() => {
		const { data: { subscription } } = supabase.auth.onAuthStateChange(handleAuthChange);
		checkUser();
		return () => subscription.unsubscribe();
	}, []);

	async function checkUser() {
		const { data: { user } } = await supabase.auth.getUser();
		setUser(user);
		if (user) {
			const { data } = await supabase.from('profiles').select('role').eq('id', user.id).single();
			setUserRole(data?.role);
		}
	}

	async function handleAuthChange(event, session) {
		if (event === 'SIGNED_IN') {
			setUser(session.user);
			const { data } = await supabase.from('profiles').select('role').eq('id', session.user.id).single();
			setUserRole(data?.role);
		} else if (event === 'SIGNED_OUT') {
			setUser(null);
			setUserRole(null);
			router.push('/');
		}
	}

	const signOut = async () => {
		await supabase.auth.signOut();
		setUser(null);
		setUserRole(null);
		router.push('/');
	};

	const value = {
		user,
		userRole,
		signOut,
		signIn: async ({ email, password }) => {
			const { data, error } = await supabase.auth.signInWithPassword({ email, password });
			if (error) throw error;
			setUser(data.user);
			const { data: profileData } = await supabase.from('profiles').select('role').eq('id', data.user.id).single();
			setUserRole(profileData?.role);
			return data;
		},
	};

	return (
		<AuthContext.Provider value={value}>
			{children}
		</AuthContext.Provider>
	);
}

export const useAuth = () => useContext(AuthContext);
