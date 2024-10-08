// src/hooks/useAuth.js

"use client"

import { useContext, useEffect } from 'react';
import { AuthContext } from '@/context/AuthContext';

export default function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  const { user, loading, login, logout, updateUser } = context;
  
  const isAuthenticated = !!user; // Simplificat
  const userType = user ? user.type : null;


  return { 
    user, 
    loading, 
    login,
    logout,
    updateUser,
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