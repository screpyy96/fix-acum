import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

const LogoutButton = () => {
  const { signOut } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut();
    // Adăugăm o mică întârziere înainte de redirecționare
    setTimeout(() => {
      router.push('/');
      // Forțăm o reîncărcare completă a paginii
      window.location.reload();
    }, 100);
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
