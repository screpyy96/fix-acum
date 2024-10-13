"use client"
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
	const [session, setSession] = useState(null);
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);
	const [userRole, setUserRole] = useState(null);

	useEffect(() => {
		console.log('AuthProvider useEffect started');
		let mounted = true;

		const getSession = async () => {
			console.log('Getting session...');
			try {
				const { data: { session }, error } = await supabase.auth.getSession();
				console.log('Session received:', session);
				if (error) throw error;
				
				if (mounted) {
					setSession(session);
					
					if (session?.user) {
						const { role, trade } = session.user.user_metadata;
						setUser({ 
							...session.user, 
							role: role || 'user', // Setăm un rol implicit dacă nu există
							trade: trade || null 
						});
						fetchUserRole(session.user.id);
					} else {
						setUser(null);
						setUserRole(null);
					}
				}
			} catch (error) {
				console.error('Error fetching session:', error);
			} finally {
				if (mounted) {
					console.log('Setting loading to false');
					setLoading(false);
				}
			}
		};

		getSession();

		const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
			if (mounted) {
				setSession(session);
				if (session?.user) {
					await fetchUserRole(session.user.id);
				} else {
					setUser(null);
					setUserRole(null);
				}
				setLoading(false);
			}
		});

		return () => {
			mounted = false;
			authListener.subscription.unsubscribe();
		};
	}, []);

	const fetchUserRole = async (userId) => {
		const { data, error } = await supabase
			.from('profiles')
			.select('role')
			.eq('id', userId)
			.single();
		if (data && data.role) {
			setUserRole(data.role);
			// Actualizăm și user-ul cu noul rol
			setUser(prevUser => ({ ...prevUser, role: data.role }));
		} else if (error) {
			console.error('Error fetching user role:', error);
		}
	};

	const value = {
		session,
		user,
		userRole,
		loading,
		signOut: async () => {
			await supabase.auth.signOut();
			setUser(null);
			setSession(null);
			setUserRole(null);
		},
		refreshSession: async () => {
			const { data: { session }, error } = await supabase.auth.getSession();
			if (error) {
				console.error('Error refreshing session:', error);
				return;
			}
			setSession(session);
			if (session?.user) {
				const { role, trade } = session.user.user_metadata;
				setUser({ 
					...session.user, 
					role: role || 'user',
					trade: trade || null 
				});
				fetchUserRole(session.user.id);
			} else {
				setUser(null);
				setUserRole(null);
			}
		},
		signIn: async ({ email, password }) => {
			try {
				const { data, error } = await supabase.auth.signInWithPassword({
					email,
					password,
				});
				if (error) throw error;
				
				// Preluăm rolul din profilul utilizatorului
				await fetchUserRole(data.user.id);
				
				return { user: data.user };
			} catch (error) {
				console.error('Error signing in:', error);
				throw error;
			}
		},
		setUserRole // Adăugăm setUserRole în valoarea contextului
	};

	return (
		<AuthContext.Provider value={value}>
			{loading ? <div className="flex space-x-4">
          <div className="w-16 h-8 bg-gray-200 animate-pulse rounded"></div>
          <div className="w-16 h-8 bg-green-200 animate-pulse rounded"></div>
        </div> : children}
		</AuthContext.Provider>
	);
}

export const useAuth = () => {
	return useContext(AuthContext);
};
