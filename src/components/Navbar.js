"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Menu, X, ChevronDown, User, Settings, LogOut, Home, Briefcase, Users } from 'lucide-react'
import useAuth from '@/hooks/useAuth'
import { supabase } from '@/lib/supabase'
import { motion, AnimatePresence } from 'framer-motion'

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
      console.log(user?.role)
      router.push('/dashboard/client')
    } else if (user?.role === 'worker') {
      router.push('/dashboard/worker')
    }
    setIsDropdownOpen(false)
    setIsOpen(false)
  }

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen)

  const navItems = [
    { name: 'Acasă', href: '/', icon: Home },
    { name: 'Joburi', href: '/jobs', icon: Briefcase },
    { name: 'Muncitori', href: '/workers', icon: Users },
  ]

  const renderAuthButtons = () => {
    if (loading || !isClient) {
      return (
        <div className="flex space-x-4">
          <div className="w-16 h-8 bg-white bg-opacity-20 animate-pulse rounded"></div>
          <div className="w-16 h-8 bg-yellow-300 bg-opacity-20 animate-pulse rounded"></div>
        </div>
      )
    }

    if (user) {
      return (
        <div className="relative">
          <button
            onClick={toggleDropdown}
            className="flex items-center space-x-1 text-white hover:text-yellow-300 focus:outline-none"
          >
            <span>Bine ai venit, {user.role}</span>
            <ChevronDown className="h-4 w-4" />
          </button>
          <AnimatePresence>
            {isDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 mt-2 w-48 bg-white rounded-md overflow-hidden shadow-xl z-10"
              >
                <button
                  onClick={handleDashboardRedirect}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left transition-colors duration-200"
                >
                  <User className="inline-block mr-2 h-4 w-4" />
                  Dashboard
                </button>
                <button
                  onClick={() => { router.push('/settings'); setIsDropdownOpen(false); }}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left transition-colors duration-200"
                >
                  <Settings className="inline-block mr-2 h-4 w-4" />
                  Setări
                </button>
                <button
                  onClick={async () => { 
                    await supabase.auth.signOut(); 
                    setIsDropdownOpen(false);
                    router.push('/');
                  }}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left transition-colors duration-200"
                >
                  <LogOut className="inline-block mr-2 h-4 w-4" />
                  Logout
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )
    }

    return (
      <>
        <Link
          href="/login"
          className="text-white hover:text-yellow-300 transition-colors duration-200"
        >
          Log In
        </Link>
        <Link
          href="/register/worker"
          className="bg-yellow-400 hover:bg-yellow-300 text-purple-700 px-4 py-2 rounded-md transition-colors duration-200"
        >
          Sign Up
        </Link>
      </>
    )
  }

  return (
    <nav className="bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-white hover:text-yellow-300 transition-colors duration-200">
              Fix Acum
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-white hover:text-yellow-300 transition-colors duration-200 flex items-center"
              >
                <item.icon className="h-5 w-5 mr-1" />
                {item.name}
              </Link>
            ))}
            {renderAuthButtons()}
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white hover:text-yellow-300 focus:outline-none transition-colors duration-200"
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

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed right-0 top-0 bottom-0 w-64 bg-gradient-to-b from-purple-600 to-pink-500 shadow-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 flex flex-col h-full">
                <div className="flex justify-end mb-4">
                  <button
                    onClick={() => setIsOpen(false)}
                    className="text-white hover:text-yellow-300 focus:outline-none"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
                <div className="flex-grow overflow-y-auto">
                  {navItems.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="block py-2 px-4 text-white hover:bg-white hover:bg-opacity-20 rounded-md transition-colors duration-200 flex items-center"
                      onClick={() => setIsOpen(false)}
                    >
                      <item.icon className="h-5 w-5 mr-2" />
                      {item.name}
                    </Link>
                  ))}
                  {loading || !isClient ? (
                    <div className="py-2 px-4">
                      <div className="w-24 h-8 bg-white bg-opacity-20 animate-pulse rounded"></div>
                    </div>
                  ) : user ? (
                    <>
                      <button
                        onClick={handleDashboardRedirect}
                        className="block w-full text-left py-2 px-4 text-white hover:bg-white hover:bg-opacity-20 rounded-md transition-colors duration-200"
                      >
                        <User className="inline-block mr-2 h-5 w-5" />
                        Dashboard
                      </button>
                      <button
                        onClick={() => { router.push('/settings'); setIsOpen(false); }}
                        className="block w-full text-left py-2 px-4 text-white hover:bg-white hover:bg-opacity-20 rounded-md transition-colors duration-200"
                      >
                        <Settings className="inline-block mr-2 h-5 w-5" />
                        Setări
                      </button>
                      <button
                        onClick={async () => { 
                          await supabase.auth.signOut(); 
                          setIsOpen(false);
                          router.push('/');
                        }}
                        className="block w-full text-left py-2 px-4 text-white hover:bg-white hover:bg-opacity-20 rounded-md transition-colors duration-200"
                      >
                        <LogOut className="inline-block mr-2 h-5 w-5" />
                        Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        href="/login"
                        className="block py-2 px-4 text-white hover:bg-white hover:bg-opacity-20 rounded-md transition-colors duration-200"
                        onClick={() => setIsOpen(false)}
                      >
                        Log In
                      </Link>
                      <Link
                        href="/register/worker"
                        className="block py-2 px-4 text-purple-700 bg-yellow-400 hover:bg-yellow-300 rounded-md transition-colors duration-200 mt-2"
                        onClick={() => setIsOpen(false)}
                      >
                        Sign Up
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}