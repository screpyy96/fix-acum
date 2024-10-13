'use client'


import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Menu, X, User, Settings, LogOut, Briefcase, Users, Hammer, Bell } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import useAuth from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import { getNotifications, markNotificationAsRead } from '@/lib/notifications';

const Navbar = () => {
  const { user, loading } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (user) {
      const fetchNotifications = async () => {
        const data = await getNotifications(user.id);
        if (data) setNotifications(data);
      };

      fetchNotifications();

      const channel = supabase
        .channel(`public:notifications:user_id=eq.${user.id}`)
        .on('postgres_changes', { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'notifications',
          filter: `user_id=eq.${user.id}`
        }, payload => {
          setNotifications(current => [payload.new, ...current]);
        })
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user]);

  const handleDashboardRedirect = (e) => {
    e.preventDefault();
    if (user?.role === 'client') {
      router.push('/dashboard/client');
    } else if (user?.role === 'worker') {
      router.push('/dashboard/worker');
    }
    setIsOpen(false);
  };

  const handleLogout = async (e) => {
    e.preventDefault();
    await supabase.auth.signOut();
    setIsOpen(false);
    router.push('/');
  };

  const navItems = [
    { name: 'Joburi', href: '/', icon: Briefcase },
    { name: 'Muncitori', href: '/workers', icon: Users },
  ];

  const renderNavItems = (isMobile = false) => (
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
          <motion.span
            className="ml-4 whitespace-nowrap"
            initial={isMobile ? { opacity: 1, width: 'auto' } : { opacity: 0, width: 0 }}
            animate={{ opacity: isMobile || isHovered ? 1 : 0, width: isMobile || isHovered ? 'auto' : 0 }}
            transition={{ duration: 0.2 }}
          >
            {item.name}
          </motion.span>
        </Link>
      ))}
    </div>
  );

  const renderAuthItems = (isMobile = false) => {
    if (loading || !user) {
      return (
        <div className="flex flex-col space-y-4">
          <div className="w-9 h-9 bg-white bg-opacity-20 rounded-full"></div>
          <div className="w-9 h-9 bg-white bg-opacity-20 rounded-full"></div>
          <div className="w-9 h-9 bg-white bg-opacity-20 rounded-full"></div>
        </div>
      );
    }

    const authItems = user
      ? [
          { name: 'Dashboard', icon: User, onClick: handleDashboardRedirect },
          { name: 'Setări', icon: Settings, onClick: (e) => { e.preventDefault(); router.push('/settings'); setIsOpen(false); } },
          { name: 'Logout', icon: LogOut, onClick: handleLogout },
        ]
      : [ 
          { name: 'Log In', icon: User, href: '/login' },
          { name: 'Sign Up', icon: Users, href: '/register/client' },
        ];

    return (
      <div className={`flex flex-col ${isMobile ? "space-y-4" : "space-y-2"}`}>
        {authItems.map((item, index) => (
          <div 
            key={index} 
            className="group flex items-center text-white hover:text-yellow-300 transition-colors duration-200"
          >
            {item.onClick ? (
              <button 
                className="flex items-center w-full py-1" 
                onClick={item.onClick}
              >
                <div className="w-9 h-9 rounded-full bg-white bg-opacity-10 group-hover:bg-opacity-20 flex items-center justify-center flex-shrink-0">
                  <item.icon className="h-6 w-6" />
                </div>
                <motion.span
                  className="ml-4 whitespace-nowrap"
                  initial={isMobile ? { opacity: 1, width: 'auto' } : { opacity: 0, width: 0 }}
                  animate={{ opacity: isMobile || isHovered ? 1 : 0, width: isMobile || isHovered ? 'auto' : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {item.name}
                </motion.span>
              </button>
            ) : (
              <Link
                href={item.href}
                className="flex items-center w-full py-2"
                onClick={() => setIsOpen(false)}
              >
                <div className="w-9 h-9 rounded-full bg-white bg-opacity-10 group-hover:bg-opacity-20 flex items-center justify-center flex-shrink-0">
                  <item.icon className="h-6 w-6" />
                </div>
                <motion.span
                  className="ml-4 whitespace-nowrap"
                  initial={isMobile ? { opacity: 1, width: 'auto' } : { opacity: 0, width: 0 }}
                  animate={{ opacity: isMobile || isHovered ? 1 : 0, width: isMobile || isHovered ? 'auto' : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {item.name}
                </motion.span>
              </Link>
            )}
          </div>
        ))}
      </div>
    );
  };


  const handleNotificationClick = async (notification) => {
    try {
      await markNotificationAsRead(notification.id);
      setNotifications(current =>
        current.map(notif =>
          notif.id === notification.id ? { ...notif, is_read: true } : notif
        )
      );
      setShowNotifications(false);
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const renderNotifications = () => (
    <div className="relative">
      <button
        onClick={() => setShowNotifications(!showNotifications)}
        className="flex items-center text-white hover:text-yellow-300 transition-colors duration-200"
      >
        <div className="w-8 h-8 rounded-full bg-white bg-opacity-10 flex items-center justify-center">
          <Bell className="h-5 w-5" />
        </div>
        {notifications.filter(n => !n.is_read).length > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
            {notifications.filter(n => !n.is_read).length}
          </span>
        )}
      </button>
      {showNotifications && (
        <div className="absolute right-0 mt-2 w-64 bg-white shadow-lg rounded-lg overflow-hidden z-50">
          {notifications.length > 0 ? (
            notifications.map(notification => (
              <div
                key={notification.id}
                className={`p-2 hover:bg-gray-100 cursor-pointer ${notification.is_read ? 'bg-gray-50' : 'bg-blue-50'}`}
                onClick={() => handleNotificationClick(notification)}
              >
                <p className="text-sm text-gray-800">{notification?.content}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(notification.created_at).toLocaleString()}
                </p>
              </div>
            ))
          ) : (
            <div className="p-2 text-center text-gray-500">Nu există notificări</div>
          )}
        </div>
      )}
    </div>
  );



  return (
    <>
      <motion.nav 
        className="fixed left-0 top-0 h-full bg-gradient-to-b from-purple-600 via-pink-500 to-red-500 z-40 overflow-hidden navbar hidden md:block"
        initial={{ width: '5rem' }}
        animate={{ width: isHovered ? '16rem' : '4.3rem' }}
        transition={{ duration: 0.3 }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
      >
        <div className="flex flex-col h-full p-4">
          <Link href="/" className="text-2xl font-bold text-white hover:text-yellow-300 transition-colors duration-200 mb-8 block">
            <div className="flex items-center relative">
              <div className="w-10 h-10 rounded-full bg-white bg-opacity-10 flex items-center justify-center absolute mr-3">
                <Hammer size={30} />
              </div>
              <motion.span
                className="ml-12 whitespace-nowrap"
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: isHovered ? 1 : 0, width: isHovered ? 'auto' : 0 }}
                transition={{ duration: 0.2 }}
              >
                Fix Acum
              </motion.span>
            </div>
          </Link>
          <div className="flex-grow">
            {renderNavItems()}
          </div>
          <div className="mt-auto">
            {renderAuthItems()}
            {user && renderNotifications()}
          </div>
        </div>
      </motion.nav>

      {/* Mobile menu button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-4 right-4 z-50 p-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-full shadow-lg"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </motion.button>

      {/* Mobile menu */}
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
              <Link href="/" className="text-2xl font-bold text-white hover:text-yellow-300 transition-colors duration-200 mb-8 block">
                FA
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
  );
};

export default Navbar;