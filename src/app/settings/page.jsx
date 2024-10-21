'use client';

import { useState, useEffect } from 'react';
import { useAuth, loadUserFromLocalStorage } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function Settings() {
  const { user, loading, setUser } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [trade, setTrade] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const initializeUser = async () => {
      let currentUser = user;
      if (!currentUser) {
        currentUser = loadUserFromLocalStorage();
        if (currentUser) {
          setUser(currentUser);
        }
      }

      if (currentUser && (currentUser.role === 'worker' || currentUser.role === 'client')) {
        setName(currentUser.user_metadata?.name || '');
        setEmail(currentUser.email || '');
        setTrade(currentUser.trade || '');
        setIsLoading(false);
      } else {
        console.log('No user found, redirecting to login');
        router.push('/login');
      }
    };

    initializeUser();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const currentUser = user || loadUserFromLocalStorage();
      if (!currentUser) {
        throw new Error('User not found');
      }

      // Actualizare date în tabela 'profiles'
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ name, trade: currentUser.role === 'worker' ? trade : null })
        .eq('id', currentUser.id);

      if (profileError) throw profileError;

      // Actualizare email în autentificare (dacă s-a schimbat)
      if (email !== currentUser.email) {
        const { error: emailError } = await supabase.auth.updateUser({ email });
        if (emailError) throw emailError;
      }

      // Actualizare metadata utilizator
      const { data, error: metadataError } = await supabase.auth.updateUser({
        data: { name, trade: currentUser.role === 'worker' ? trade : null }
      });

      if (metadataError) throw metadataError;

      // Actualizare stare utilizator în context și localStorage
      const updatedUser = { ...currentUser, email, user_metadata: { ...currentUser.user_metadata, name }, trade };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));

      setSuccess('Profile updated successfully');
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Failed to update profile: ' + err.message);
    }
  };

  if (isLoading) {
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
        {user && user.role === 'worker' && (
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
