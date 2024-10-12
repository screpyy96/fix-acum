// components/worker/Messages.js
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function Messages({ workerId }) {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('conversations')
      .select('*, client:clients(*)')
      .eq('worker_id', workerId)
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('Error fetching conversations:', error);
    } else {
      setConversations(data);
    }
    setLoading(false);
  };

  if (loading) {
    return <div>Loading messages...</div>;
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Messages</h2>
      {conversations.length === 0 ? (
        <p>No messages found.</p>
      ) : (
        <ul className="space-y-4">
          {conversations.map((conversation) => (
            <li key={conversation.id} className="border-b pb-4">
              <h3 className="text-xl font-semibold">{conversation.client.name}</h3>
              <p className="text-gray-600">Last message: {conversation.last_message}</p>
              <p className="text-sm text-gray-500">
                Updated: {new Date(conversation.updated_at).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}