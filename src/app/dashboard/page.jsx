'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useAuth from '@/hooks/useAuth';

export default function DashboardRedirect() {
  const { user, isClient, isWorker, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (isClient) {
        router.push('/dashboard/client');
      } else if (isWorker) {
        router.push('/dashboard/worker');
      } else {
        router.push('/login');
      }
    }
  }, [isClient, isWorker, loading, router]);

  return <div>Redirecting...</div>;
}