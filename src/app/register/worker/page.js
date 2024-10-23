'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase'; // Ensure this import is from the single instance
import { allTrades } from '@/data/serviceCategories'; // Importăm allTrades

export default function RegisterWorker() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [trade, setTrade] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const validateForm = () => {
    if (!name) return 'Numele este obligatoriu';
    if (!email) return 'Email-ul este obligatoriu';
    if (!/\S+@\S+\.\S+/.test(email)) return 'Email invalid';
    if (!password) return 'Parola este obligatorie';
    if (password.length < 6) return 'Parola trebuie să aibă cel puțin 6 caractere';
    if (password !== confirmPassword) return 'Parolele trebuie să coincidă';
    if (!trade) return 'Meseria este obligatorie';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Previne reîncărcarea paginii
    
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            role: 'worker',
            trade
          }
        }
      });

      if (error) throw error;

      if (data) {
        console.log('Înregistrare reușită! Te rugăm să-ți verifici emailul pentru confirmare.');
        
        // Asigură-te că utilizatorul nu este autentificat
        await supabase.auth.signOut();

        // Redirecționează utilizatorul la pagina de login
        router.push('/login');
      }
    } catch (error) {
      console.error('Eroare la înregistrare:', error);
      setError('A apărut o eroare neașteptată. Te rugăm să încerci din nou.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Înregistrare Worker
          </h2>
        </div>
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="name" className="sr-only">Nume</label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Nume"
              />
            </div>
            <div>
              <label htmlFor="email-address" className="sr-only">Email</label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Email"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Parolă</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Parolă"
              />
            </div>
            <div>
              <label htmlFor="confirm-password" className="sr-only">Confirmă Parolă</label>
              <input
                id="confirm-password"
                name="confirm-password"
                type="password"
                autoComplete="new-password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Confirmă Parolă"
              />
            </div>
          </div>

          <div>
            <label htmlFor="trade" className="block text-sm font-medium text-gray-700">
              Meserie
            </label>
            <select
              id="trade"
              name="trade"
              required
              value={trade}
              onChange={(e) => setTrade(e.target.value)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
              <option value="">Vă rugăm să selectați</option>
              {allTrades.map((trade) => (
                <option key={trade} value={trade}>{trade}</option>
              ))}
            </select>
          </div>

          {error && <p className="text-red-500 text-center">{error}</p>}

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Înregistrează-te
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
