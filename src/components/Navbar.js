"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Menu, X, ChevronDown, User, Settings, LogOut } from 'lucide-react'
import useAuth from '@/hooks/useAuth'
import { supabase } from '@/lib/supabase'

export default function Navbar() {
  const { user, loading } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setIsClient(true)
  }, [])

  const handleDashboardRedirect = () => {
    if (user?.role === 'client') {
      router.push('/dashboard/client')
    } else if (user?.role === 'worker') {
      router.push('/dashboard/worker')
    }
    setIsDropdownOpen(false)
  }

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen)

  const renderAuthButtons = () => {
    if (loading || !isClient) {
      return (
        <div className="flex space-x-4">
          <div className="w-16 h-8 bg-gray-200 animate-pulse rounded"></div>
          <div className="w-16 h-8 bg-green-200 animate-pulse rounded"></div>
        </div>
      )
    }

    if (user) {
      return (
        <div className="relative">
          <button
            onClick={toggleDropdown}
            className="flex items-center space-x-1 text-gray-800 hover:text-gray-600 focus:outline-none"
          >
            <span>Bine ai venit, {user.email}</span>
            <ChevronDown className="h-4 w-4" />
          </button>
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md overflow-hidden shadow-xl z-10">
              <button
                onClick={handleDashboardRedirect}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
              >
                <User className="inline-block mr-2 h-4 w-4" />
                Dashboard
              </button>
              <button
                onClick={() => { router.push('/settings'); setIsDropdownOpen(false); }}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
              >
                <Settings className="inline-block mr-2 h-4 w-4" />
                Setari
              </button>
              <button
                onClick={async () => { 
                  await supabase.auth.signOut(); 
                  setIsDropdownOpen(false);
                  router.push('/');
                }}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
              >
                <LogOut className="inline-block mr-2 h-4 w-4" />
                Logout
              </button>
            </div>
          )}
        </div>
      )
    }

    return (
      <>
        <Link
          href="/login"
          className="text-gray-600 hover:text-gray-800 transition-colors"
        >
          Log In
        </Link>
        <Link
          href="/register/worker"
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md transition-colors"
        >
          Sign Up
        </Link>
      </>
    )
  }

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-semibold text-gray-800">
              Fix Acum
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <Link href="/jobs" className="text-gray-600 hover:text-gray-800 transition-colors">
              Joburi
            </Link>
            <Link href="/workers" className="text-gray-600 hover:text-gray-800 transition-colors">
              Muncitori
            </Link>
            {renderAuthButtons()}
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-500 hover:text-gray-600 focus:outline-none"
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              href="/jobs"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
              onClick={() => setIsOpen(false)}
            >
              Joburi
            </Link>
            <Link
              href="/workers"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
              onClick={() => setIsOpen(false)}
            >
              Muncitori
            </Link>
            {loading || !isClient ? (
              <div className="px-3 py-2">
                <div className="w-24 h-8 bg-gray-200 animate-pulse rounded"></div>
              </div>
            ) : user ? (
              <>
                <button
                  onClick={() => { handleDashboardRedirect(); setIsOpen(false); }}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                >
                  Dashboard
                </button>
                <button
                  onClick={() => { router.push('/settings'); setIsOpen(false); }}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                >
                  Setari
                </button>
                <button
                  onClick={async () => { 
                    await supabase.auth.signOut(); 
                    setIsOpen(false);
                    router.push('/');
                  }}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                  onClick={() => setIsOpen(false)}
                >
                  Log In
                </Link>
                <Link
                  href="/register/worker"
                  className="block px-3 py-2 rounded-md text-base font-medium text-white bg-green-500 hover:bg-green-600"
                  onClick={() => setIsOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}