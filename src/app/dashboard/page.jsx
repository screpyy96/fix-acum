'use client';

import { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        
      } else {
        const role = user.role || user.user_metadata?.role;
        if (role === 'client') {
          router.push('/dashboard/client');
        } else if (role === 'worker') {
          router.push('/dashboard/worker');
        } else {
          // În cazul în care rolul nu este recunoscut
          console.error('Unrecognized user role:', role);
          router.push('/');
        }
      }
    }
  }, [user, loading, router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  // Acest return nu ar trebui să fie niciodată atins datorită redirectărilor de mai sus
  return null;
}