import { useEffect, useState } from 'react';
import { FaCheckCircle } from 'react-icons/fa';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      const response = await fetch('/api/notifications/create', {
        credentials: 'include', // Trimite cookie-urile pentru autentificare
      });
      const data = await response.json();
      if (response.ok) {
        setNotifications(data);
      } else {
        console.error('Failed to fetch notifications:', data.error);
      }
    };

    fetchNotifications();
  }, []);

  const markAsRead = async (notificationId) => {
    const response = await fetch(`/api/notifications/${notificationId}`, {
      method: 'PATCH',
      credentials: 'include',
    });

    if (response.ok) {
      // Elimină notificarea din listă
      setNotifications(prev => prev.map(n => 
        n._id === notificationId ? { ...n, isRead: true } : n
      ));
    } else {
      console.error('Failed to mark notification as read:', await response.json());
    }
  };

  return (
    <div className="bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 shadow-lg rounded-lg p-6">
      <h2 className="text-2xl font-bold text-white mb-4">Your Notifications</h2>
      <ul className="space-y-4">
        {notifications.length > 0 ? (
          notifications.map(notification => (
            <li
              key={notification._id}
              className={`flex justify-between items-center p-4 rounded-lg shadow-md transition transform ${
                notification.isRead
                  ? 'bg-gray-200 text-gray-500 scale-95'
                  : 'bg-white text-gray-900 hover:bg-gray-50 hover:scale-105'
              }`}
            >
              <div className="flex items-center">
                <p className="text-lg">{notification.message}</p>
                <span className="ml-4 text-xs text-gray-400">
                  {new Date(notification.createdAt).toLocaleString()}
                </span>
              </div>
              {!notification.isRead && (
                <button
                  onClick={() => markAsRead(notification._id)}
                  className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full transition-all duration-300 shadow-md"
                >
                  <FaCheckCircle className="mr-1" />
                  <span>Mark as read</span>
                </button>
              )}
            </li>
          ))
        ) : (
          <li className="text-center text-white">
            <p className="text-lg">No notifications</p>
          </li>
        )}
      </ul>
    </div>
  );
};

export default Notifications;
