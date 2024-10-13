import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { getNotifications, markNotificationAsRead } from '@/lib/notifications';
import useAuth from '@/hooks/useAuth';

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      const fetchNotifications = async () => {
        const data = await getNotifications(user.id);
        if (data) setNotifications(data);
      };

      fetchNotifications();

      // Setați un listener pentru notificări noi
      const subscription = supabase
        .from(`notifications:user_id=eq.${user.id}`)
        .on('INSERT', payload => {
          setNotifications(current => [payload.new, ...current]);
        })
        .subscribe();

      return () => {
        supabase.removeSubscription(subscription);
      };
    }
  }, [user]);

  const handleNotificationClick = async (notificationId) => {
    await markNotificationAsRead(notificationId);
    setNotifications(current =>
      current.map(notif =>
        notif.id === notificationId ? { ...notif, is_read: true } : notif
      )
    );
    // Aici puteți adăuga logica pentru a deschide chat-ul sau a naviga la o pagină specifică
  };

  return (
    <div>
      {notifications.map(notification => (
        <div 
          key={notification.id} 
          onClick={() => handleNotificationClick(notification.id)}
          className={`p-2 mb-2 rounded ${notification.is_read ? 'bg-gray-100' : 'bg-blue-100'}`}
        >
          {notification.content}
        </div>
      ))}
    </div>
  );
}
