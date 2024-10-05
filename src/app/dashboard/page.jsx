'use client';

import { useState, useEffect } from 'react';
import useAuth from '@/hooks/useAuth';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const { user, isClient, isWorker, loading, isAuthenticated } = useAuth();
  const [recentJobs, setRecentJobs] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchDashboardData = async () => {
      console.log('Fetching dashboard data. isAuthenticated:', isAuthenticated, 'isClient:', isClient);
      console.log('User:', user);
      console.log('Token in localStorage:', localStorage.getItem('token'));
      if (isAuthenticated && isClient) {
        setIsLoading(true);
        try {
          console.log('Fetching client jobs');
          const jobsResponse = await fetch('/api/jobs/client-jobs', {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          });
          console.log('Client jobs response:', jobsResponse);
          if (!jobsResponse.ok) {
            const errorData = await jobsResponse.json();
            console.error('Error response:', errorData);
            throw new Error(`Failed to fetch client jobs: ${errorData.error}`);
          }
          const jobsData = await jobsResponse.json();
          console.log('Fetched jobsData:', jobsData);
          setRecentJobs(jobsData || []);
        } catch (error) {
          console.error('Error fetching dashboard data:', error);
          setRecentJobs([]);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchDashboardData();
  }, [isAuthenticated, isClient, user]);

  // Adăugați acest console.log pentru a verifica starea recentJobs
  console.log('Current recentJobs:', recentJobs);

  const handleApply = async (jobId) => {
    try {
      const response = await fetch(`/api/jobs/${jobId}/apply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const result = await response.json();
        alert(result.message || 'Applied successfully!');
        setRecentJobs(prevJobs => prevJobs.map(job => 
          job._id === jobId ? { ...job, hasApplied: true } : job
        ));

        // Creează o notificare pentru client
        await fetch('/api/notifications/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            recipient: result.job.clientId,
            recipientModel: 'Client',
            message: `A new worker has applied to your job: ${result.job.title}`,
            type: 'newApplication',
            relatedJob: jobId,
          }),
        });
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'Failed to apply for the job');
      }
    } catch (error) {
      console.error('Error applying to job:', error);
      alert('An error occurred while applying for the job');
    }
  };

  if (loading || isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <div>Please log in to view the dashboard.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-black">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {user && (
          <div className="col-span-1 md:col-span-2 mb-6 p-4 bg-gray-100 rounded">
            <h2 className="text-xl font-semibold mb-2">Your Information</h2>
            <p className="text-black"><strong>Name:</strong> {user.name}</p>
            <p className="text-black"><strong>Email:</strong> {user.email}</p>
            <p className="text-black"><strong>Type:</strong> {user.type}</p>
            {isWorker && <p className="text-black"><strong>Trade:</strong> {user.trade}</p>}
          </div>
        )}

        {isClient && (
          <div className="col-span-1 md:col-span-2">
            <h2 className="text-xl font-semibold mb-4">Your Posted Jobs</h2>
            {recentJobs.length > 0 ? (
              <ul className="space-y-4">
                {recentJobs.map(job => (
                  <li key={job._id} className="bg-white p-4 rounded shadow">
                    <Link href={`/jobs/${job._id}`} className="text-blue-500 hover:underline text-lg font-semibold">
                      {job.title}
                    </Link>
                    <p className="text-gray-600">Status: {job.status}</p>
                    <p className="text-gray-600">Trade Type: {job.tradeType}</p>
                    <p className="text-gray-600">Job Type: {job.jobType}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No jobs posted yet.</p>
            )}
          </div>
        )}

        {isWorker && (
          <div className="col-span-1 md:col-span-2">
            <h2 className="text-xl font-semibold mb-4">Available Jobs for Your Trade</h2>
            {recentJobs.length > 0 ? (
              <ul className="space-y-4">
                {recentJobs.map(job => (
                  <li key={job._id} className="bg-white p-4 rounded shadow">
                    <Link href={`/jobs/${job._id}`} className="text-blue-500 hover:underline text-lg font-semibold">
                      {job.title}
                    </Link>
                    <p className="text-gray-600">Status: {job.status}</p>
                    <p className="text-gray-600">Trade Type: {job.tradeType}</p>
                    <p className="text-gray-600">Job Type: {job.jobType}</p>
                    {job.hasApplied ? (
                      <span className="mt-2 inline-block bg-green-100 text-green-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded">
                        Applied
                      </span>
                    ) : (
                      <button
                        onClick={() => handleApply(job._id)}
                        className="mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded"
                      >
                        Apply
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No available jobs matching your trade.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}