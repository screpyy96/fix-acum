"use client"

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import useAuth from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import { MessageSquare, User, Briefcase, Search } from 'lucide-react';

export default function ConversationsPage() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [unreadCounts, setUnreadCounts] = useState({});

  useEffect(() => {
    const fetchConversations = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const { data: workerApps, error: workerError } = await supabase
          .from('job_applications')
          .select(`
            job_id,
            worker_id,
            jobs (
              title,
              client_id
            ),
            profiles!job_applications_worker_id_fkey (
              name
            )
          `)
          .eq('worker_id', user.id);

        const { data: clientApps, error: clientError } = await supabase
          .from('job_applications')
          .select(`
            job_id,
            worker_id,
            jobs (
              title,
              client_id
            ),
            profiles!job_applications_worker_id_fkey (
              name
            )
          `)
          .eq('jobs.client_id', user.id);

        if (workerError || clientError) {
          throw workerError || clientError;
        }

        const allApps = [...(workerApps || []), ...(clientApps || [])];
        const uniqueApps = allApps.filter((app, index, self) =>
          index === self.findIndex((t) => t.job_id === app.job_id)
        );
        setConversations(uniqueApps);

        // Fetch unread message counts using raw SQL
        const { data: unreadData, error: unreadError } = await supabase
          .rpc('get_unread_message_counts', { user_id: user.id });

        if (unreadError) {
          throw unreadError;
        }

        const counts = {};
        unreadData.forEach(item => {
          counts[item.job_id] = parseInt(item.count);
        });
        setUnreadCounts(counts);
      } catch (error) {
        console.error('Error fetching conversations:', error);
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchConversations();
  }, [user]);

  // Render loading state if user is null or loading
  if (isLoading) {
    return <div className="text-center mt-8">Loading conversations...</div>;
  }

  // Render nothing if user is null after loading
  if (!user) return null;

  const filteredConversations = conversations.filter(conv =>
    (conv.jobs && conv.jobs.title && conv.jobs.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (conv.worker && conv.worker.name && conv.worker.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (conv.client && conv.client.name && conv.client.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (error) {
    return <div className="text-red-500 text-center mt-8">Error loading conversations: {error.message}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Your Conversations</h1>
        <div className="mb-6 relative">
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {filteredConversations.map((conv) => (
              <li key={conv.job_id}>
                <Link href={`/messages/${conv.job_id}`}>
                  <div className="block hover:bg-gray-50 transition duration-150 ease-in-out">
                    <div className="flex items-center px-4 py-4 sm:px-6">
                      <div className="min-w-0 flex-1 flex items-center">
                        <div className="flex-shrink-0">
                          {conv.jobs.client_id === user?.id ? (
                            <User className="h-12 w-12 text-gray-400" />
                          ) : (
                            <Briefcase className="h-12 w-12 text-gray-400" />
                          )}
                        </div>
                        <div className="min-w-0 flex-1 px-4 md:grid md:grid-cols-2 md:gap-4">
                          <div>
                            <p className="text-sm font-medium text-blue-600 truncate">{conv.jobs.title}</p>
                            <p className="mt-2 flex items-center text-sm text-gray-500">
                              <MessageSquare className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                              <span className="truncate">{conv.profiles.name}</span>
                            </p>
                          </div>
                          <div className="hidden md:block">
                            <div>
                              <p className="text-sm text-gray-900">
                                {conv.jobs.client_id === user?.id ? 'Worker' : 'Client'}
                              </p>
                              <p className="mt-2 flex items-center text-sm text-gray-500">
                                Job ID: {conv.job_id}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex-shrink-0 ml-2">
                        {unreadCounts[conv.job_id] > 0 && (
                          <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">
                            {unreadCounts[conv.job_id]}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
        {filteredConversations.length === 0 && (
          <p className="text-center text-gray-500 mt-6">No conversations found.</p>
        )}
      </div>
    </div>
  );
}
