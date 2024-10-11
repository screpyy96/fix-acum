'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase'; // presupunând că ai configurat deja Supabase
import { useAuth } from '@/context/AuthContext'; // pentru a seta utilizatorul după autentificare

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false); // stare pentru a gestiona butonul de loading
  const router = useRouter();
  const { session } = useAuth(); // metoda pentru a seta autentificarea utilizatorului

  useEffect(() => {
    if (session) {
      // Redirecționează utilizatorul în funcție de rol
      fetch('/api/get-user-role')
        .then(res => res.json())
        .then(data => {
          if (data.role === 'client') {
            router.push('/dashboard/client')
          } else if (data.role === 'worker') {
            router.push('/dashboard/worker')
          } else {
            router.push('/')
          }
        })
    }
  }, [session])

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(''); // Resetează erorile la fiecare submit
    setIsLoading(true); // Activează loading-ul la trimiterea formularului

    try {
      // Autentificare utilizator cu Supabase
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError; // Aruncă eroare dacă autentificarea eșuează

      // Obține informații suplimentare despre utilizator din tabela 'profiles'
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user.id)
        .single();

      if (profileError) throw profileError; // Aruncă eroare dacă nu găsește profilul

      // Setează utilizatorul în contextul de autentificare
      signIn({ user: { ...data.user, role: profile.role } });

      // Redirecționează utilizatorul în funcție de rolul său
      switch (profile.role) {
        case 'client':
          router.push('/dashboard/client');
          break;
        case 'worker':
          router.push('/dashboard/worker');
          break;
        default:
          router.push('/'); // fallback dacă rolul este necunoscut
      }
    } catch (error) {
      setError(error.message); // Setează mesajul de eroare
    } finally {
      setIsLoading(false); // Dezactivează loading-ul indiferent de rezultat
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md max-w-md w-full space-y-6">
        <h1 className="text-2xl font-bold text-center">Login</h1>

        {/* Formular de login */}
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Parolă
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm">
              {error}
            </p>
          )}

          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              disabled={isLoading} // Dezactivează butonul dacă este în proces de trimitere
            >
              {isLoading ? 'Logging in...' : 'Log in'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}