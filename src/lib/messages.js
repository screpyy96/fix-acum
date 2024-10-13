// lib/messages.js
import { supabase } from './supabase';

export const sendMessage = async (jobId, workerId, content, userId) => {
  const { data, error } = await supabase
    .from('messages')
    .insert([
      {
        job_id: jobId,
        worker_id: workerId,
        sender_id: userId,
        content: content
      }
    ]);

  if (error) {
    console.error('Error sending message:', error);
    return null;
  }
  return data;
};

// Adăugați aici și alte funcții legate de mesaje, cum ar fi getMessages

