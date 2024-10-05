// src/hooks/useAuth.js

"use client"

import { useContext, useEffect } from 'react';
import { AuthContext } from '@/context/AuthContext';

export default function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  const { user, loading, login, logout } = context;
  
  const isAuthenticated = !!user; // Simplificat
  const userType = user ? user.type : null;

  useEffect(() => {
    console.log('useAuth effect running');
    console.log('isAuthenticated:', isAuthenticated);
    console.log('isClient:', user?.type === 'client');
    console.log('user:', user);
    console.log('token in localStorage:', localStorage.getItem('token'));
  }, [user, isAuthenticated]);

  return { 
    user, 
    loading, 
    login,
    logout,
    isAuthenticated,
    userType,
    isClient: user?.type === 'client',
    isWorker: user?.type === 'worker',
    getToken: () => localStorage.getItem('token'),
    clearAuth: () => {
      logout();
      localStorage.removeItem('token');
    }
  };
}