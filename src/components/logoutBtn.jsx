import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

const LogoutButton = () => {
  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/'); // Redirectează utilizatorul la pagina de login după logout
  };

  return (
    <button
      onClick={handleLogout}
      className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
    >
      Delogare
    </button>
  );
};

export default LogoutButton;
