'use client';

import { useState, useEffect } from 'react';
import useAuth from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';

export default function Profile() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return null; // Acest return nu ar trebui să fie atins datorită redirectării din useEffect
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Profilul Meu</h1>
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="mb-4">
          <h2 className="text-xl font-semibold">Informații Personale</h2>
          <p>Nume: {user.name}</p>
          <p>Email: {user.email}</p>
          <p>Meserie: {user.trade || 'Nespecificat'}</p>
        </div>
        <div className="mb-4">
          <h2 className="text-xl font-semibold">Statistici</h2>
          <p>Rating: N/A</p>
          <p>Joburi finalizate: 0</p>
          <p>Membru din: {new Date().toLocaleDateString()}</p>
        </div>
        {/* Aici puteți adăuga mai multe secțiuni în funcție de datele disponibile */}
        <button className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Editează Profilul
        </button>
      </div>
    </div>
  );
}