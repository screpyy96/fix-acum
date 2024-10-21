'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import LoadingSpinner from '@/components/LoadingSpinner';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function Settings() {
  return (
    <ProtectedRoute>
      <SettingsContent />
    </ProtectedRoute>
  );
}

function SettingsContent() {
  const { user, loading, setUser } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [trade, setTrade] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (user && user.user_metadata) {
      setName(user.user_metadata.name || '');
      setEmail(user.email || '');
      setTrade(user.user_metadata.trade || '');
      console.log('User data initialized:', { name, email, trade });
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const currentUser = user || loadUserFromLocalStorage();
      console.log('Updating profile for user:', currentUser);
      
      if (!currentUser) {
        throw new Error('User not found');
      }

      const userRole = currentUser.user_metadata?.role;
      if (!userRole || !['client', 'worker'].includes(userRole)) {
        throw new Error('Invalid user role');
      }

      // Actualizare date în tabela 'profiles'
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ name, trade: userRole === 'worker' ? trade : null })
        .eq('id', currentUser.id);

      if (profileError) throw profileError;

      // Actualizare email în autentificare (dacă s-a schimbat)
      if (email !== currentUser.email) {
        const { error: emailError } = await supabase.auth.updateUser({ email });
        if (emailError) throw emailError;
      }

      // Actualizare metadata utilizator
      const { data, error: metadataError } = await supabase.auth.updateUser({
        data: { name, trade: userRole === 'worker' ? trade : null }
      });

      if (metadataError) throw metadataError;

      // Actualizare stare utilizator în context și localStorage
      const updatedUser = { 
        ...currentUser, 
        email, 
        user_metadata: { 
          ...currentUser.user_metadata, 
          name, 
          trade: userRole === 'worker' ? trade : null 
        } 
      };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));

      setSuccess('Profile updated successfully');
      console.log('Profile updated successfully');
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Failed to update profile: ' + err.message);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Settings</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {success && <p className="text-green-500 mb-4">{success}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block mb-1">Name</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label htmlFor="email" className="block mb-1">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
        {user && user.user_metadata?.role === 'worker' && (
          <div>
            <label htmlFor="trade" className="block mb-1">Trade</label>
            <input
              type="text"
              id="trade"
              value={trade}
              onChange={(e) => setTrade(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
        )}
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Update Profile
        </button>
      </form>
    </div>
  );
}
