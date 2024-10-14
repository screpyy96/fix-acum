// components/worker/JobsList.js
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import useAuth from '@/hooks/useAuth';

import { useRouter } from 'next/navigation';

export default function JobsList() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, userTrade } = useAuth(); // Asigură-te că userTrade este extras corect
  const router = useRouter();

  useEffect(() => {
    const fetchJobs = async () => {
      if (!user || !userTrade) return;

      setLoading(true);
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('status', 'open')
        .eq('tradeType', userTrade);

      if (error) {
        console.error('Error fetching jobs:', error);
      } else {
        setJobs(data);
      }
      setLoading(false);
    };

    fetchJobs();

    // Set up polling to fetch jobs every 30 seconds
    const interval = setInterval(fetchJobs, 30000);

    // Clean up the interval on component unmount
    return () => clearInterval(interval);
  }, [user, userTrade]);

  const handleJobClick = (jobId) => {
    router.push(`/dashboard/job-details/${jobId}`);
  };

  if (loading) {
    return <div>Loading available jobs...</div>;
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Lucrări pentru {userTrade}</h2>
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
              {job.job_applications && job.job_applications.some(application => application.worker.id === worker.id) && (
                <p className="text-sm text-red-500">You have already applied to this job.</p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
