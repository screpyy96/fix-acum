"use client"

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export function useAuthHook() {
  const { state, dispatch } = useAuth();
  const router = useRouter();

  const login = async (email, password, userType) => {
    try {
      const response = await fetch(`/api/auth/login-${userType}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('auth_token', data.token);
        dispatch({ type: 'LOGIN', payload: data.user });
        router.push('/dashboard');
      } else {
        throw new Error('Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      localStorage.removeItem('auth_token');
      dispatch({ type: 'LOGOUT' });
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const register = async (userData, userType) => {
    try {
      const response = await fetch(`/api/auth/register-${userType}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        router.push('/login');
      } else {
        throw new Error('Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
    }
  };

  return { user: state.user, loading: state.loading, login, logout, register };
}