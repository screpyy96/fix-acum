'use client';

import { useState, useEffect } from 'react';
import useAuth from '@/hooks/useAuth';
import Link from 'next/link';

export default function WorkerDashboard() {
  const { user, loading } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchWorkerJobs = async () => {
      if (user && user.trade) {
        try {
          const response = await fetch('/api/jobs/worker-jobs', {
            credentials: 'include'
          });
          if (response.ok) {
            const data = await response.json();
            console.log('Jobs:', data);
            setJobs(data);
          } else {
            console.error('Failed to fetch jobs:', response.statusText);
          }
        } catch (error) {
          console.error('Error fetching worker jobs:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchWorkerJobs();
  }, [user]);

  console.log('User:', user);
  if (loading || isLoading) return <div>Loading...</div>;
  console.log('Jobs:', jobs);

  // Filtrarea joburilor în funcție de tradeType
  const filteredJobs = jobs.filter(job => job.tradeType === user.trade);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Worker Dashboard</h1>
      <div className="bg-white shadow-md rounded p-4 mb-6">
        <h2 className="text-xl font-semibold mb-2">Your Information</h2>
        {user ? (
          <>
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Trade:</strong> {user.trade}</p>
          </>
        ) : (
          <p>Go to Sign up page..</p>
        )}
      </div>
      <div>
        <h2 className="text-xl font-semibold mb-4">Available Jobs</h2>
        {filteredJobs.length > 0 ? (
          <ul className="space-y-4">
            {filteredJobs.map(job => (
              <li key={job._id.toString()} className="bg-white shadow-md rounded p-4">
                <Link href={`/jobs/${job._id.toString()}`} className="text-blue-500 hover:underline">
                  <h3 className="text-lg font-semibold">{job.title}</h3>
                </Link>
                <p><strong>Trade Type:</strong> {job.tradeType}</p>
                <p><strong>Job Type:</strong> {job.jobType}</p>
                <p><strong>Status:</strong> {job.status}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No available jobs matching your trade.</p>
        )}
      </div>
    </div>
  );
}
