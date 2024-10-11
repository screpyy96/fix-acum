// src/hooks/useAuth.js

"use client"

import { useContext } from 'react';
import { AuthContext } from '@/context/AuthContext';

export default function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  const { user, loading, signIn, signOut, updateUser } = context;
  
  const isAuthenticated = !!user;
  const userRole = user?.role;

  return { 
    user, 
    loading, 
    signIn,
    signOut,
    updateUser,
    isAuthenticated,
    userRole,
    isClient: userRole === 'client',
    isWorker: userRole === 'worker',
    // ... restul codului rămâne neschimbat
  };
}