'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Menu, X, User, Settings, LogOut, Home, Briefcase, Users } from 'lucide-react'
import useAuth from '@/hooks/useAuth'
import { supabase } from '@/lib/supabase'
import { motion, AnimatePresence } from 'framer-motion'

export default function Navbar() {
  const { user, loading } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
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
    setIsOpen(false)
  }

  const navItems = [
    { name: 'Acasă', href: '/', icon: Home },
    { name: 'Joburi', href: '/jobs', icon: Briefcase },
    { name: 'Muncitori', href: '/workers', icon: Users },
  ]

  const renderNavItems = (isMobile = false) => (
    <div className={isMobile ? "mb-8" : "space-y-6"}>
      {navItems.map((item) => (
        <Link
          key={item.name}
          href={user ? item.href : '/login'}
          className={`group flex items-center text-white hover:text-yellow-300 transition-colors duration-100 ${isMobile ? 'py-4' : ''}`}
          onClick={() => setIsOpen(false)}
        >
          <div className="w-8 h-8 rounded-full bg-white bg-opacity-10 group-hover:bg-opacity-20 flex items-center justify-center">
            <item.icon className="h-5 w-5" />
          </div>
          <motion.span 
            className="ml-4"
            initial={isMobile ? { opacity: 1 } : { opacity: 0 }}
            animate={{ opacity: isMobile || isHovered ? 1 : 0 }}
            transition={{ duration: 0.2 }}
          >
            {item.name}
          </motion.span>
        </Link>
      ))}
    </div>
  )

  const renderAuthItems = (isMobile = false) => {
    if (loading || !isClient) {
      return (
        <div className="flex flex-col space-y-2">
          <div className="w-8 h-8 bg-white bg-opacity-20 animate-pulse rounded-full"></div>
          <div className="w-8 h-8 bg-yellow-300 bg-opacity-20 animate-pulse rounded-full"></div>
        </div>
      )
    }

    if (user) {
      return (
        <div className={isMobile ? "space-y-4" : "space-y-6"}>
          <button
            onClick={handleDashboardRedirect}
            className={`group flex items-center text-white hover:text-yellow-300 transition-colors duration-100 w-full ${isMobile ? 'py-4' : ''}`}
          >
            <div className="w-8 h-8 rounded-full bg-white bg-opacity-10 group-hover:bg-opacity-20 flex items-center justify-center">
              <User className="h-5 w-5" />
            </div>
            <motion.span 
              className="ml-4"
              initial={isMobile ? { opacity: 1 } : { opacity: 0 }}
              animate={{ opacity: isMobile || isHovered ? 1 : 0 }}
              transition={{ duration: 0.1 }}
            >
              Dashboard
            </motion.span>
          </button>
          <button
            onClick={() => { router.push('/settings'); setIsOpen(false); }}
            className={`group flex items-center text-white hover:text-yellow-300 transition-colors duration-100 w-full ${isMobile ? 'py-4' : ''}`}
          >
            <div className="w-8 h-8 rounded-full bg-white bg-opacity-10 group-hover:bg-opacity-20 flex items-center justify-center">
              <Settings className="h-5 w-5" />
            </div>
            <motion.span 
              className="ml-4"
              initial={isMobile ? { opacity: 1 } : { opacity: 0 }}
              animate={{ opacity: isMobile || isHovered ? 1 : 0 }}
              transition={{ duration: 0.1 }}
            >
              Setări
            </motion.span>
          </button>
          <button
            onClick={async () => { 
              await supabase.auth.signOut(); 
              setIsOpen(false);
              router.push('/');
            }}
            className={`group flex items-center text-white hover:text-yellow-300 transition-colors duration-100 w-full ${isMobile ? 'py-4' : ''}`}
          >
            <div className="w-8 h-8 rounded-full bg-white bg-opacity-10 group-hover:bg-opacity-20 flex items-center justify-center">
              <LogOut className="h-5 w-5" />
            </div>
            <motion.span 
              className="ml-4"
              initial={isMobile ? { opacity: 1 } : { opacity: 0 }}
              animate={{ opacity: isMobile || isHovered ? 1 : 0 }}
              transition={{ duration: 0.2 }}
            >
              Logout
            </motion.span>
          </button>
        </div>
      )
    }

    return (
      <div className={isMobile ? "space-y-4" : "space-y-6"}>
        <Link
          href="/login"
          className={`group flex items-center text-white hover:text-yellow-300 transition-colors duration-100 ${isMobile ? 'py-4' : ''}`}
          onClick={() => setIsOpen(false)}
        >
          <div className="w-8 h-8 rounded-full bg-white bg-opacity-10 group-hover:bg-opacity-20 flex items-center justify-center">
            <User className="h-5 w-5" />
          </div>
          <motion.span 
            className="ml-4"
            initial={isMobile ? { opacity: 1 } : { opacity: 0 }}
            animate={{ opacity: isMobile || isHovered ? 1 : 0 }}
            transition={{ duration: 0.2 }}
          >
            Log In
          </motion.span>
        </Link>
        <Link
          href="/register/worker"
          className={`group flex items-center text-purple-700 hover:text-purple-900 transition-colors duration-100 ${isMobile ? 'py-4' : ''}`}
          onClick={() => setIsOpen(false)}
        >
          <div className="w-8 h-8 rounded-full bg-yellow-400 hover:bg-yellow-300 flex items-center justify-center">
            <Users className="h-5 w-5" />
          </div>
          <motion.span 
            className="ml-4"
            initial={isMobile ? { opacity: 1 } : { opacity: 0 }}
            animate={{ opacity: isMobile || isHovered ? 1 : 0 }}
            transition={{ duration: 0.2 }}
          >
            Sign Up
          </motion.span>
        </Link>
      </div>
    )
  }

  return (
    <>
      <motion.nav 
        className="fixed left-0 top-0 h-full bg-gradient-to-b from-purple-600 via-pink-500 to-red-500 z-40 overflow-hidden navbar hidden md:block"
        initial={{ width: '4rem' }}
        animate={{ width: isHovered ? '16rem' : '4rem' }}
        transition={{ duration: 0.3 }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
      >
        <div className="flex flex-col h-full p-4 justify-between">
          <div>
            <Link href="/" className="text-2xl font-bold text-white hover:text-yellow-300 transition-colors duration-100 mb-8 block">
              FA
            </Link>
            {renderNavItems()}
          </div>
          <div>
            {renderAuthItems()}
          </div>
        </div>
      </motion.nav>

      {/* Mobile menu button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-4 right-4 z-50 p-2 bg-purple-600 text-white rounded-full shadow-lg"
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-gradient-to-b from-purple-600 via-pink-500 to-red-500 z-40 md:hidden"
          >
            <div className="flex flex-col h-full p-4 justify-between">
              <div>
                <Link href="/" className="text-2xl font-bold text-white hover:text-yellow-300 transition-colors duration-100 mb-8 block">
                  FA
                </Link>
                {renderNavItems(true)}
              </div>
              <div>
                {renderAuthItems(true)}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}