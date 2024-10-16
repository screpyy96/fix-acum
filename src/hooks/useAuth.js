"use client"
import { useContext } from 'react';
import { AuthContext } from '@/context/AuthContext';

export default function useAuth() {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  const { user, loading, signIn, signOut, setUser } = context;
  
  const isAuthenticated = !!user;
  const userRole = user?.role;
  const userTrade = user?.trade;

  return {
    user,
    loading,
    signIn,
    signOut,
    isAuthenticated,
    userRole,
    userTrade,
    setUser,
    isClient: userRole === 'client',
    isWorker: userRole === 'worker',
  };
}