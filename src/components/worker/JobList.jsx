// components/worker/JobsList.js
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import useAuth from '@/hooks/useAuth';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function JobsList() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      fetchJobs();
    }
  }, [user]);

  const fetchJobs = async () => {
    console.log('Fetching jobs...', user);
    if (!user || !user.trade) {
      console.log('User or trade is missing:', user);
      setLoading(false);  // Adăugați această linie
      return;
    }

    setLoading(true);
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .eq('status', 'open')
      .eq('tradeType', user.trade)
      // .order('created_at', { ascending: false });

    console.log('Supabase query result:', { data, error });

    if (error) {
      console.error('Error fetching jobs:', error);
    } else {
      setJobs(data);
    }
    setLoading(false);
  };

  

  const handleJobClick = (jobId) => {
    router.push(`/dashboard/job-details/${jobId}`);
  };

  if (loading) {
    return <div>Loading available jobs...</div>;
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Lucrari pentru {user?.trade}</h2>
      {jobs.length === 0 ? (
        <p>No available jobs found for your trade type.</p>
      ) : (
        <ul className="space-y-4">
          {jobs.map((job) => (
            <li 
              key={job.id} 
              className="border-b pb-4 cursor-pointer hover:bg-gray-100 transition-colors p-4 rounded"
              onClick={() => handleJobClick(job.id)}
            >
              <h3 className="text-xl font-semibold">{job.title}</h3>
              <p className="text-gray-600">{job.description}</p>
              <p className="text-sm text-gray-500">Price: ${job.price}</p>
              
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
