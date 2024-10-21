// src/app/messages/[jobId]/page.jsx
"use client"

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Messages from '@/components/messages/messages';
import useAuth from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation'; // Import useRouter from 'next/router'

export default function ConversationPage() {
  const params = useParams();
  const jobId = params.jobId;
  const { user, loading } = useAuth();
  const [jobDetails, setJobDetails] = useState(null);
 
  const router = useRouter(); // Initialize useRouter

  useEffect(() => {
    if (!loading && !user?.role) {
      console.log('No user found, redirecting to login');
        return;
        }


    if (jobId && user) {
      const fetchJobDetails = async () => {
        
        const { data, error } = await supabase
          .from('jobs')
          .select(`
            *,
            job_applications (
              worker_id
            )
          `)
          .eq('id', jobId)
          .single();

        if (error) {
          console.error('Error fetching job details:', error);
        } else {
          setJobDetails(data);
        }
        setIsLoading(false);
      };

      fetchJobDetails();
    }
  }, [jobId, user, router]);

  // Render nothing if user is null or jobDetails haven't loaded yet
  if (!user || !jobDetails) return null;

  const workerId = jobDetails.job_applications[0]?.worker_id;
  const isClient = user.id === jobDetails.client_id;

  return (
    <div>
      <h1>Conversation for Job: {jobDetails.title}</h1>
      <p>You are the {isClient ? 'Client' : 'Worker'}</p>
      <Messages jobId={jobId} workerId={workerId} />
    </div>
  );
}
