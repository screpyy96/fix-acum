'use client';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

const trades = [
  "Instalator", "Fierar", "Zidar", "Constructor", "Tâmplar", "Curățenie", 
  "Drenaj", "Pavator", "Electrician", "Montator", "Grădinar", "Inginer", 
  "Meșter", "Bucătării", "Lăcătuș", "Mansardări", "Zugrav", "Dezinsecție", 
  "Tencuitor", "Mutare", "Energie", "Acoperișuri", "Securitate", 
  "Specialist", "Pietrar", "Piscine", "Faianțar", "Meșteșugar", "Arborist", 
  "Ferestre"
];

const schema = yup.object().shape({
  name: yup.string().required('Numele este obligatoriu'),
  email: yup.string().email('Email invalid').required('Email-ul este obligatoriu'),
  password: yup.string().min(6, 'Parola trebuie să aibă cel puțin 6 caractere').required('Parola este obligatorie'),
  confirmPassword: yup.string().oneOf([yup.ref('password'), null], 'Parolele trebuie să coincidă'),
  trade: yup.string().required('Meseria este obligatorie'),
});

export default function RegisterWorker() {
  const [error, setError] = useState('');
  const router = useRouter();
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
  });

  const onSubmit = async (data) => {
    try {
      // Înregistrează utilizatorul cu Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            name: data.name,
            role: 'worker',
            trade: data.trade
          }
        }
      });

      if (authError) throw authError;

      // Creează profilul muncitorului în tabela 'profiles'
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: authData.user.id,
          name: data.name,
          role: 'worker',
          trade: data.trade
        });

      if (profileError) throw profileError;

      console.log('Registration successful');
      router.push('/login');
    } catch (error) {
      console.error('Registration error:', error);
      setError(error.message || 'A apărut o eroare la înregistrarea muncitorului.');
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
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="name" className="sr-only">Nume</label>
              <input
                id="name"
                {...register('name')}
                type="text"
                placeholder="Nume"
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
            </div>
            <div>
              <label htmlFor="email" className="sr-only">Email</label>
              <input
                id="email"
                {...register('email')}
                type="email"
                placeholder="Email"
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Parolă</label>
              <input
                id="password"
                {...register('password')}
                type="password"
                placeholder="Parolă"
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
              />
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
            </div>
            <div>
              <label htmlFor="confirmPassword" className="sr-only">Confirmă Parolă</label>
              <input
                id="confirmPassword"
                {...register('confirmPassword')}
                type="password"
                placeholder="Confirmă Parolă"
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
              />
              {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>}
            </div>
            <div>
              <label htmlFor="trade" className="block text-sm font-medium text-gray-700">
                Meserie
              </label>
              <select
                id="trade"
                {...register('trade')}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option value="">Vă rugăm să selectați</option>
                {trades.map((trade) => (
                  <option key={trade} value={trade}>{trade}</option>
                ))}
              </select>
              {errors.trade && <p className="text-red-500 text-sm mt-1">{errors.trade.message}</p>}
            </div>
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