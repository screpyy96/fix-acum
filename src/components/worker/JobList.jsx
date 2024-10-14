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
        .select(`
          *,
          job_applications (
            worker_id
          )
        `);

      if (error) {
        console.error('Error fetching jobs:', error);
        return;
      }

      console.log(data, 'data');

      // Filtrăm joburile la care utilizatorul NU a aplicat
      const filteredJobs = data.filter(job => {
        // Verificăm dacă există `job_applications`
        if (!job.job_applications || job.job_applications.length === 0) {
          return true; // Dacă nu există aplicații, jobul este disponibil
        }

        // Verificăm dacă utilizatorul a aplicat la job
        const hasApplied = job.job_applications.some(application => application.worker_id === user.id);
        return !hasApplied; // Returnăm true doar dacă utilizatorul NU a aplicat
      });

      setJobs(filteredJobs);
      setLoading(false);
    };

    console.log(jobs, 'jobs');
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
              <p className="text-sm text-gray-500">Price: ${job.budget}</p>
              <p className="text-sm text-gray-500">Status: {job.status}</p>
              
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
