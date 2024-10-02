'use client';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

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
      const response = await fetch('/api/auth/register-worker', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        router.push('/login');
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'A apărut o eroare la înregistrare');
      }
    } catch (error) {
      setError('A apărut o eroare la înregistrare');
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
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {error && <p className="text-red-500 text-center">{error}</p>}
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="name" className="sr-only">Nume</label>
              <input
                id="name"
                name="name"
                type="text"
                {...register('name')}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Nume"
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
            </div>
            <div>
              <label htmlFor="email-address" className="sr-only">Adresă de email</label>
              <input
                id="email-address"
                name="email"
                type="email"
                {...register('email')}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Adresă de email"
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Parolă</label>
              <input
                id="password"
                name="password"
                type="password"
                {...register('password')}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Parolă"
              />
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>
            <div>
              <label htmlFor="confirm-password" className="sr-only">Confirmă parola</label>
              <input
                id="confirm-password"
                name="confirmPassword"
                type="password"
                {...register('confirmPassword')}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Confirmă parola"
              />
              {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>}
            </div>
            <div>
              <label htmlFor="trade" className="sr-only">Meserie</label>
              <select
                id="trade"
                name="trade"
                {...register('trade')}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              >
                <option value="">Selectează meseria</option>
                {trades.map((trade, index) => (
                  <option key={index} value={trade}>{trade}</option>
                ))}
              </select>
              {errors.trade && <p className="text-red-500 text-xs mt-1">{errors.trade.message}</p>}
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Înregistrare
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}