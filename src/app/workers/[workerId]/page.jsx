"use client"

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function WorkerProfile({ params }) {
  const { workerId } = params;
  const [worker, setWorker] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchWorkerProfile = async () => {
      try {
        const response = await fetch(`/api/workers/${workerId}`);
        if (response.ok) {
          const data = await response.json();
          setWorker(data);
        } else {
          const errorData = await response.json();
          setError(errorData.error || 'Failed to fetch worker profile');
        }
      } catch (err) {
        setError('Error fetching worker profile');
      }
    };

    fetchWorkerProfile();
  }, [workerId]);

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (!worker) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1>Nume: {worker.name}</h1>
      <p>Email: {worker.email}</p>
      <p>Ocupatie: {worker.trade}</p>
      <p>Jobs Applied: {worker.rating}</p>
      <p>Jobs Hired: {worker.mobile}</p>
      {/* Adaugă alte detalii relevante despre lucrător */}
    </div>
  );
}
