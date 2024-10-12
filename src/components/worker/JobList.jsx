// components/worker/JobsList.js
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function JobsList({ workerId }) {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .eq('worker_id', workerId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching jobs:', error);
    } else {
      setJobs(data);
    }
    setLoading(false);
  };

  if (loading) {
    return <div>Loading jobs...</div>;
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Your Jobs</h2>
      {jobs.length === 0 ? (
        <p>No jobs found.</p>
      ) : (
        <ul className="space-y-4">
          {jobs.map((job) => (
            <li key={job.id} className="border-b pb-4">
              <h3 className="text-xl font-semibold">{job.title}</h3>
              <p className="text-gray-600">{job.description}</p>
              <p className="text-sm text-gray-500">Status: {job.status}</p>
              <p className="text-sm text-gray-500">Price: ${job.price}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

