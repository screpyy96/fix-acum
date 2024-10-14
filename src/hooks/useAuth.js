"use client"
import { useContext } from 'react';
import { AuthContext } from '@/context/AuthContext';
export default function useAuth() {
const context = useContext(AuthContext);
if (context === undefined) {
throw new Error('useAuth must be used within an AuthProvider');
}
const { user, loading, signIn, signOut, userTrade, setUser, setUserRole } = context; // Adaugă setUser și setUserRole
const isAuthenticated = !!user;
const userRole = user?.role;
return {
user,
loading,
signIn,
signOut,
isAuthenticated,
userRole,
userTrade,
setUser,
setUserRole,
isClient: userRole === 'client',
isWorker: userRole === 'worker',
};
}
