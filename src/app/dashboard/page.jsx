'use client';

import { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const { user, userRole, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        console.log('User not authenticated, redirecting to login');
        router.push('/login');
      } else {
        console.log('User authenticated:', user);
        console.log('User role:', userRole);
        
        if (userRole === 'client') {
          console.log('Redirecting to client dashboard');
          router.push('/dashboard/client');
        } else if (userRole === 'worker') {
          console.log('Redirecting to worker dashboard');
          router.push('/dashboard/worker');
        } else {
          console.error('Unrecognized user role:', userRole);
          router.push('/');
        }
      }
    }
  }, [user, userRole, loading, router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  // Acest return nu ar trebui să fie niciodată atins datorită redirectărilor de mai sus
  return null;
}
