'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import LoadingSpinner from '@/components/LoadingSpinner'; // Asigură-te că ai această componentă

export default function Dashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkUserAndRedirect = async () => {
      if (!loading && user) {
        console.log('User authenticated:', user);
        console.log('User role:', user.role);
        
        if (user.user_metadata.role === 'client') {
          console.log('Redirecting to client dashboard');
          router.push('/dashboard/client');
        } else if (user.user_metadata.role === 'worker') {
          console.log('Redirecting to worker dashboard');
          router.push('/dashboard/worker');
        } else {
          console.error('Unrecognized user role:', user.user_metadata.role);
          router.push('/');
        }
      } else if (!loading && !user) {
        console.log('User not authenticated, redirecting to login');
        router.push('/login');
      }
      setIsChecking(false);
    };

    checkUserAndRedirect();
  }, [user, loading, router]);

  if (loading || isChecking) {
    return <LoadingSpinner />;
  }

  return null;
}
