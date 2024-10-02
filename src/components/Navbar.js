"use client"

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useState, useEffect, useRef } from 'react';
import LogoutButton from '@/components/logoutBtn';

export default function Navbar() {
  const { user, loading, logout, userType } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    // No need for separate userName state; use user directly
  }, [user]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between">
          <div className="flex space-x-7">
            <div>
              <Link href="/" className="flex items-center py-4 px-2">
                <span className="font-semibold text-gray-500 text-lg">Fix Acum</span>
              </Link>
            </div>
            <div className="hidden md:flex items-center space-x-1">
              <Link href="/jobs" className="py-4 px-2 text-gray-500 hover:text-green-500 transition duration-300">Joburi</Link>
              <Link href="/workers" className="py-4 px-2 text-gray-500 hover:text-green-500 transition duration-300">Muncitori</Link>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-3">
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button onClick={toggleDropdown} className="flex items-center space-x-1 py-2 px-3 bg-blue-600 hover:bg-blue-300 hover:text-black rounded transition duration-300">
                  <span>
                    Bine ai venit, {user.name} 
                    {user.email && ` (${user.email})`} 
                    {userType && ` [${userType.charAt(0).toUpperCase() + userType.slice(1)}]`}
                  </span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </button>
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md overflow-hidden shadow-xl z-10">
                    <div className="px-4 py-2 border-b">
                      <p className="text-sm font-medium text-gray-700">{user.name}</p>
                      {user.email && <p className="text-xs text-gray-500">{user.email}</p>}
                      {userType && <p className="text-xs text-gray-500 capitalize">{userType}</p>}
                    </div>
                    <Link href="/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Dashboard</Link>
                    <Link href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Profile</Link>
                    <LogoutButton onLogout={logout} />
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link href="/login" className="py-2 px-2 font-medium text-gray-500 rounded hover:bg-green-500 hover:text-white transition duration-300">Log In</Link>
                <Link href="/register/worker" className="py-2 px-2 font-medium text-white bg-green-500 rounded hover:bg-green-400 transition duration-300">Sign Up</Link>
              </>
            )}
          </div>
          <div className="md:hidden flex items-center">
            <button className="outline-none mobile-menu-button" onClick={toggleMenu}>
              <svg className="w-6 h-6 text-gray-500 hover:text-green-500"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
      <div className={`${isMenuOpen ? 'block' : 'hidden'} md:hidden`}>
        <Link href="/jobs" className="block py-2 px-4 text-sm hover:bg-green-500 hover:text-white transition duration-300">Joburi</Link>
        <Link href="/workers" className="block py-2 px-4 text-sm hover:bg-green-500 hover:text-white transition duration-300">Muncitori</Link>
        {user ? (
          <>
            <Link href="/dashboard" className="block py-2 px-4 text-sm hover:bg-green-500 hover:text-white transition duration-300">Dashboard</Link>
            <Link href="/profile" className="block py-2 px-4 text-sm hover:bg-green-500 hover:text-white transition duration-300">Profile</Link>
            <LogoutButton onLogout={logout} />
          </>
        ) : (
          <>
            <Link href="/login" className="block py-2 px-4 text-sm hover:bg-green-500 hover:text-white transition duration-300">Log In</Link>
            <Link href="/register" className="block py-2 px-4 text-sm hover:bg-green-500 hover:text-white transition duration-300">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
}