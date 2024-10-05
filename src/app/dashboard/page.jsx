'use client';

import { useState, useEffect } from 'react';
import useAuth from '@/hooks/useAuth';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const { user, isClient, isWorker, loading, isAuthenticated } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchDashboardData = async () => {
      console.log('Fetching dashboard data. isAuthenticated:', isAuthenticated, 'isClient:', isClient, 'isWorker:', isWorker);
      console.log('User:', user);
      if (isAuthenticated) {
        setIsLoading(true);
        try {
          let jobsResponse;
          if (isClient) {
            console.log('Fetching client jobs');
            jobsResponse = await fetch('/api/jobs/client-jobs', {
              credentials: 'include' // This ensures cookies are sent with the request
            });
          } else if (isWorker) {
            console.log('Fetching worker jobs');
            jobsResponse = await fetch('/api/jobs/worker-jobs', {
              credentials: 'include' // This ensures cookies are sent with the request
            });
          }

          console.log('Jobs response:', jobsResponse);
          if (!jobsResponse.ok) {
            const errorData = await jobsResponse.json();
            console.error('Error response:', errorData);
            throw new Error(`Failed to fetch jobs: ${errorData.error}`);
          }
          const jobsData = await jobsResponse.json();
          console.log('Fetched jobsData:', jobsData);
          setJobs(jobsData || []);
        } catch (error) {
          console.error('Error fetching dashboard data:', error);
          setJobs([]);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchDashboardData();
  }, [isAuthenticated, isClient, isWorker, user]);

  console.log('Current jobs:', jobs);

  const handleApply = async (jobId) => {
    try {
      const response = await fetch(`/api/jobs/${jobId}/apply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include' // This ensures cookies are sent with the request
      });

      if (response.ok) {
        const result = await response.json();
        alert(result.message || 'Applied successfully!');
        setJobs(prevJobs => prevJobs.map(job => 
          job._id === jobId ? { ...job, hasApplied: true } : job
        ));

        // Create a notification for the client
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
          credentials: 'include' // This ensures cookies are sent with the request
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

        <div className="col-span-1 md:col-span-2">
          <h2 className="text-xl font-semibold mb-4">
            {isClient ? "Your Posted Jobs" : "Available Jobs for Your Trade"}
          </h2>
          {jobs.length > 0 ? (
            <ul className="space-y-4">
              {jobs.map(job => (
                <li key={job._id} className="bg-white p-4 rounded shadow">
                  <Link href={`/jobs/${job._id}`} className="text-blue-500 hover:underline text-lg font-semibold">
                    {job.title}
                  </Link>
                  <p className="text-gray-600">Status: {job.status}</p>
                  <p className="text-gray-600">Trade Type: {job.tradeType}</p>
                  <p className="text-gray-600">Job Type: {job.jobType}</p>
                  {isWorker && (
                    job.hasApplied ? (
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
                    )
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p>{isClient ? "No jobs posted yet." : "No available jobs matching your trade."}</p>
          )}
        </div>
      </div>
    </div>
  );
}