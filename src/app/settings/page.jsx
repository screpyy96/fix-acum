'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function Settings() {
  const { user, updateUser, isLoading } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [trade, setTrade] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setTrade(user.trade || '');
    }
  }, [user]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    router.push('/login');
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const updatedUser = await updateUser({ name, email, ...(user.type === 'worker' ? { trade } : {}) });
      setSuccess('Profile updated successfully');
    } catch (err) {
      setError('Failed to update profile');
    }
  };

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
        {user.type === 'worker' && (
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