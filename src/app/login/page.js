'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useAuth from '@/hooks/useAuth';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const { login, isAuthenticated, isClient, isWorker } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      if (isClient) {
        router.push('/dashboard/client');
      } else if (isWorker) {
        router.push('/dashboard/worker');
      } else {
        router.push('/');
      }
    }
  }, [isAuthenticated, isClient, isWorker, router]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        login({ token: data.token, user: data.user });

        // Redirecționează pe baza rolului
        if (data.user.type === 'client') {
          router.push('/dashboard');
        } else if (data.user.type === 'worker') {
          router.push('/dashboard'); // Poți avea un dashboard diferit pentru worker
        } else {
          router.push('/');
        }
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Something went wrong');
      }
    } catch (err) {
      setError('Something went wrong');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Logare
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          {error && <p className="text-red-500 text-center">{error}</p>}
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email-address" className="sr-only">Email</label>
              <input
                id="email-address"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Adresă de email"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Parolă</label>
              <input
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Parolă"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Logare
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}