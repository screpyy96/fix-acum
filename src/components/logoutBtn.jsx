import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/router';

const LogoutButton = () => {
  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/login');  // După logout, redirecționează utilizatorul către pagina de login
    } catch (error) {
      console.error("Eroare la logout:", error);
    }
  };

  return (
    <button onClick={handleLogout} className="flex items-center w-full py-2 text-white hover:text-yellow-300 transition-colors duration-200">
      <div className="w-9 h-9 rounded-full bg-white bg-opacity-10 flex items-center justify-center flex-shrink-0">
        <LogOut className="h-6 w-6" />
      </div>
      <span className="ml-4 whitespace-nowrap">Logout</span>
    </button>
  );
};

export default LogoutButton;
