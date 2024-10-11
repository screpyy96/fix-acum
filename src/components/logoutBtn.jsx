import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

const LogoutButton = () => {
  const { signOut } = useAuth(); // Schimbăm logout cu signOut
  const router = useRouter();

  const handleLogout = async () => {
    await signOut(); // Folosim signOut în loc de logout
    router.push('/'); // Redirecționează utilizatorul la pagina de login
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
