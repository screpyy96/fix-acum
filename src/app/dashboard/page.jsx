'use client';

import { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const { isAuthenticated, isLoading, isClient, isWorker } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    } else if (!isLoading) {
      if (isClient) {
        router.push('/dashboard/client');
      } else if (isWorker) {
        router.push('/dashboard/worker');
      }
    }
  }, [isAuthenticated, isLoading, isClient, isWorker, router]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Acest return nu ar trebui să fie niciodată atins datorită redirectărilor de mai sus
  return null;
}