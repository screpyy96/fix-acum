import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

const LogoutButton = () => {
  const { signOut } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut();
    // Adăugăm o mică întârziere înainte de redirecționare
   
      router.push('/');
      // Forțăm o reîncărcare completă a paginii
  
  };

  return (
    <button
      onClick={handleLogout}
      className="text-white hover:text-yellow-300 transition-colors duration-200"
    >
      Delogare
    </button>
  );
};

export default LogoutButton;
