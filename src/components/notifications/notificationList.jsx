// components/notifications/notificationList.js
import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import useAuth from '@/hooks/useAuth';

export default function NotificationsList() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (user) {
      const fetchNotifications = async () => {
        const { data, error } = await supabase
          .from('notifications')
          .select('*')
          .eq('user_id', user.id);

        if (error) {
          console.error('Error fetching notifications:', error);
        } else {
          console.log('Fetched notifications:', data); // Log pentru debugging
          setNotifications(data);
        }
      };

      fetchNotifications();

      const notificationSubscription = supabase
        .channel(`public:notifications:user_id=eq.${user.id}`)
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'notifications' }, payload => {
          console.log('New notification received:', payload.new); // Log pentru debugging
          setNotifications((current) => [payload.new, ...current]);
        })
        .subscribe();

      return () => {
        supabase.removeChannel(notificationSubscription);
      };
    }
  }, [user]);

  const markAsRead = async (notificationId) => {
    await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', notificationId);

    setNotifications((current) =>
      current.map((notif) =>
        notif.id === notificationId ? { ...notif, is_read: true } : notif
      )
    );
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 max-w-md mx-auto">
      <h2 className="text-lg font-semibold mb-4">Notifications</h2>
      {notifications.length === 0 ? (
        <p className="text-gray-500">No notifications</p>
      ) : (
        <ul className="space-y-2">
          {notifications.map((notification) => (
            <li
              key={notification.id}
              className={`p-2 rounded cursor-pointer ${
                notification.is_read ? 'bg-gray-100' : 'bg-blue-50'
              }`}
              onClick={() => markAsRead(notification.id)}
            >
              <p className="text-sm text-gray-800">{notification.content}</p>
              <p className="text-xs text-gray-500">{new Date(notification.created_at).toLocaleString()}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
