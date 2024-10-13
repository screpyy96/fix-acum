// src/components/NotificationBell.js
import React, { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { getNotifications } from '@/lib/notifications';
import useAuth from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';

export default function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const { user } = useAuth();
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

  const handleBellClick = () => {
    if (user?.role === 'client') {
      router.push('/dashboard/client');
    } else if (user?.role === 'worker') {
      router.push('/dashboard/worker');
    }
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <div className="relative">
      <button
        onClick={handleBellClick}
        className="flex items-center text-white hover:text-yellow-300 transition-colors duration-200"
      >
        <div className="w-8 h-8 rounded-full bg-white bg-opacity-10 flex items-center justify-center">
          <Bell className="h-5 w-5" />
        </div>
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>
    </div>
  );
}