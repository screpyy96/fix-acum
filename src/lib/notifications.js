import { supabase } from './supabase';

export async function createNotification(userId, type, content) {
  const { data, error } = await supabase
    .from('notifications')
    .insert({ user_id: userId, type, content });

  if (error) console.error('Error creating notification:', error);
  return data;
}

export async function getNotifications(userId) {
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(10);

  if (error) console.error('Error fetching notifications:', error);
  return data || [];
}

export async function markNotificationAsRead(notificationId) {
  const { data, error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('id', notificationId);

  if (error) console.error('Error marking notification as read:', error);
  return data;
}
