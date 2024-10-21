'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Importă useRouter
import { useAuth } from '@/context/AuthContext';
import Loading from '@/components/LoadingSpinner'; // Importă componentul de încărcare

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { signIn, user, loading } = useAuth();
  const router = useRouter(); // Inițializează router-ul

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await signIn({ email, password });
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'An error occurred during login');
    }
  };

  useEffect(() => {
    if (!loading && user) {
      // Redirecționează utilizatorul în funcție de rol
      if (user.role === 'client') {
        router.push('/dashboard/client');
      } else if (user.role === 'worker') {
        router.push('/dashboard/worker');
      }
    }
  }, [user, loading, router]); // Adaugă user, loading și router ca dependențe

  if (loading) {
    return <Loading />; // Utilizează componentul de încărcare
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md max-w-md w-full space-y-6">
        <h1 className="text-2xl font-bold text-center">Login</h1>
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {loading ? 'Logging in...' : 'Log in'}
          </button>
        </form>
      </div>
    </div>
  );
}
