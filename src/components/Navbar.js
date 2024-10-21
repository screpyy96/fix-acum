"use client"

import React, { useState, useCallback, useMemo, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Menu, X, User, MessageCircle, Settings, LogOut, Briefcase, Users, Hammer, Bell } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/context/AuthContext'


export default function Navbar() {
  const { signOut } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [localUser, setLocalUser] = useState(null)
  const router = useRouter()

  useEffect(() => {
    const checkUser = () => {
      const storedUser = localStorage.getItem('user')
      if (storedUser) {
        setLocalUser(JSON.parse(storedUser))
      } else {
        setLocalUser(null)
      }
    }

    checkUser()
    window.addEventListener('storage', checkUser)

    return () => {
      window.removeEventListener('storage', checkUser)
    }
  }, [])

  const navItems = useMemo(() => [
    { name: 'Joburi', href: '/', icon: Briefcase },
    { name: 'Muncitori', href: '/', icon: Users },
  ], [])

  const renderNavItems = useCallback((isMobile = false) => (
    <div className={isMobile ? "mb-8" : "space-y-2"}>
      {navItems.map((item) => (
        <Link
          key={item.name}
          href={item.href}
          className={`group flex items-center text-white hover:text-yellow-300 transition-colors duration-200 ${isMobile ? 'py-4' : 'py-2'}`}
          onClick={() => setIsOpen(false)}
        >
          <div className="w-9 h-9 rounded-full bg-white bg-opacity-10 group-hover:bg-opacity-20 flex items-center justify-center flex-shrink-0">
            <item.icon className="h-6 w-6" />
          </div>
          {(isMobile || isHovered) && (
            <motion.span
              className="ml-4 whitespace-nowrap"
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              transition={{ duration: 0.2 }}
            >
              {item.name}
            </motion.span>
          )}
        </Link>
      ))}
    </div>
  ), [navItems, isHovered])

  const authItems = useMemo(() => 
    localUser?.role && ['client', 'worker'].includes(localUser.role)
      ? [
          { 
            name: 'Dashboard', 
            icon: User, 
            onClick: () => {
              const dashboardRoute = localUser.role === 'client' ? '/dashboard/client' : '/dashboard/worker';
              router.push(dashboardRoute);
            }
          },
          { name: 'Setări', icon: Settings, onClick: () => router.push('/settings') },
          { name: 'Notificări', icon: Bell, onClick: () => router.push('/notifications') },
          { name: 'Mesaje', icon: MessageCircle, href: '/messages' },
          { name: 'Logout', icon: LogOut, onClick: async () => {
            try {
              await signOut();
              localStorage.removeItem('user');
              setLocalUser(null);
              router.push('/');
            } catch (error) {
              console.error('Error signing out:', error);
            }
          }},
        ]
      : [],
    [localUser, router, signOut]
  );

  const renderAuthItems = useCallback((isMobile = false) => {
    if (!localUser) {
      return (
        <div className={`flex flex-col space-y-2 ${isMobile ? '' : 'mt-auto'}`}>
          <AuthLink href="/login" icon={User} text="Log In" isMobile={isMobile} isHovered={isHovered} onClick={() => setIsOpen(false)} />
          <AuthLink href="/register/worker" icon={Users} text="Sign Up" isMobile={isMobile} isHovered={isHovered} onClick={() => setIsOpen(false)} />
        </div>
      )
    }

    return (
      <div className={`flex flex-col space-y-2 ${isMobile ? '' : 'mt-auto'}`}>
        {authItems.map((item, index) => (
          <AuthItem key={index} item={item} isMobile={isMobile} isHovered={isHovered} onClick={() => setIsOpen(false)} />
        ))}
      </div>
    )
  }, [localUser, authItems, isHovered, setIsOpen])

  return (
    <>
      <motion.nav 
        className="fixed left-0 top-0 h-full bg-gradient-to-b from-purple-600 via-pink-500 to-red-500 z-40 overflow-hidden navbar hidden md:block group"
        initial={false}
        animate={{ width: isHovered ? '16rem' : '4.3rem' }}
        transition={{ duration: 0.3 }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
      >
        <div className="flex flex-col h-full p-4">
          <Link href="/" className="text-2xl font-bold text-white hover:text-yellow-300 transition-colors duration-200 mb-8 block">
            <div className="flex items-center h-10 relative"> {/* Adăugat relative pentru poziționare absolută a textului */}
              <div className="w-10 h-10 rounded-full bg-white bg-opacity-10 flex items-center justify-center flex-shrink-0">
                <Hammer size={24} />
              </div>
              {isHovered && (
                <motion.span
                  className="absolute left-12 whitespace-nowrap" // Poziționare absolută
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  transition={{ duration: 0.2 }}
                >
                  Fix Acum
                </motion.span>
              )}
            </div>
          </Link>
          <div className="flex-grow">
            {renderNavItems()}
          </div>
          <div className="mt-auto">
            {renderAuthItems()}
          </div>
        </div>
      </motion.nav>

      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-4 right-4 z-50 p-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-full shadow-lg"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        aria-label={isOpen ? "Close menu" : "Open menu"}
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed inset-y-0 right-0 w-64 bg-gradient-to-b from-purple-600 via-pink-500 to-red-500 z-40 md:hidden"
          >
            <div className="flex flex-col h-full p-4 pt-16">
              <Link href="/" className="text-2xl font-bold text-white hover:text-yellow-300 transition-colors duration-200 mb-8 flex items-center">
                <div className="w-10 h-10 rounded-full bg-white bg-opacity-10 flex items-center justify-center mr-3">
                  <Hammer size={24} />
                </div>
                <span>Fix Acum</span>
              </Link>
              <div className="flex-grow">
                {renderNavItems(true)}
              </div>
              <div className="mt-auto">
                {renderAuthItems(true)}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

const AuthLink = React.memo(({ href, icon: Icon, text, isMobile, isHovered, onClick }) => (
  <Link
    href={href}
    className="group flex items-center text-white hover:text-yellow-300 transition-colors duration-200 h-10" // Adăugat h-10
    onClick={onClick}
  >
    <div className="w-9 h-9 rounded-full bg-white bg-opacity-10 group-hover:bg-opacity-20 flex items-center justify-center flex-shrink-0">
      <Icon className="h-6 w-6" />
    </div>
    <motion.span
      className="ml-4 whitespace-nowrap"
      initial={false}
      animate={{ opacity: isMobile || isHovered ? 1 : 0, width: isMobile || isHovered ? 'auto' : 0 }}
      transition={{ duration: 0.2 }}
    >
      {text}
    </motion.span>
  </Link>
))

const AuthItem = React.memo(({ item, isMobile, isHovered, onClick }) => (
  <div className="group flex items-center text-white hover:text-yellow-300 transition-colors duration-200 h-10"> {/* Adăugat h-10 */}
    {item.onClick ? (
      <button 
        className="flex items-center w-full cursor-pointer" 
        onClick={() => {
          item.onClick()
          onClick()
        }}
      >
        <AuthItemContent item={item} isMobile={isMobile} isHovered={isHovered} />
      </button>
    ) : (
      <Link
        href={item.href}
        className="flex items-center w-full"
        onClick={onClick}
      >
        <AuthItemContent item={item} isMobile={isMobile} isHovered={isHovered} />
      </Link>
    )}
  </div>
))

const AuthItemContent = React.memo(({ item, isMobile, isHovered }) => (
  <>
    <div className="w-9 h-9 rounded-full bg-white bg-opacity-10 group-hover:bg-opacity-20 flex items-center justify-center flex-shrink-0">
      <item.icon className="h-6 w-6" />
    </div>
    <motion.span
      className="ml-4 whitespace-nowrap"
      initial={false}
      animate={{ opacity: isMobile || isHovered ? 1 : 0, width: isMobile || isHovered ? 'auto' : 0 }}
      transition={{ duration: 0.2 }}
    >
      {item.name}
    </motion.span>
  </>
))
