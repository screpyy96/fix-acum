// src/pages/notifications.js
"use client"

import React from 'react';
import NotificationsList from '@/components/notifications/notificationList';
import useAuth from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';

export default function NotificationsPage() {
  const { user } = useAuth();
  const router = useRouter();

  // Redirect to login if not authenticated
  React.useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Notificări</h1>
      <NotificationsList />
    </div>
  );
}

