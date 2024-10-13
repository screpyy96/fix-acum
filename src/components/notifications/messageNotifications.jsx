// src/components/notifications/MessageNotifications.js
import React, { useState, useEffect } from 'react';
import { MessageCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

const MessageNotifications = () => {
  const [unreadCount, setUnreadCount] = useState(0);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      fetchUnreadCount();
      const channel = supabase
        .channel('message_notifications')
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, handleNewMessage)
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user]);

  const fetchUnreadCount = async () => {
    const { count, error } = await supabase
      .from('messages')
      .select('*', { count: 'exact', head: true })
      .eq('is_read', false)
      .neq('sender_id', user.id);

    if (error) {
      console.error('Error fetching unread count:', error);
    } else {
      setUnreadCount(count || 0);
    }
  };

  const handleNewMessage = (payload) => {
    if (payload.new.sender_id !== user.id) {
      setUnreadCount((prevCount) => prevCount + 1);
    }
  };

  const handleClick = async () => {
    const { data, error } = await supabase
      .from('messages')
      .select('job_id')
      .eq('is_read', false)
      .neq('sender_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error) {
      console.error('Error fetching latest unread message:', error);
    } else if (data) {
      router.push(`/messages/${data.job_id}`);
    }
  };

  return (
    <div className="relative cursor-pointer" onClick={handleClick}>
      <MessageCircle className="h-6 w-6" />
      {unreadCount > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
          {unreadCount}
        </span>
      )}
    </div>
  );
};

export default MessageNotifications;
