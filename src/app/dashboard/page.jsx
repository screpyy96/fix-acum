'use client';

import { useState, useEffect } from 'react';
import useAuth from '@/hooks/useAuth';
import Link from 'next/link';

export default function Dashboard() {
  const { user, isClient, isWorker, loading, isAuthenticated } = useAuth();
  const [recentJobs, setRecentJobs] = useState([]);
  const [dashboardData, setDashboardData] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (isAuthenticated && (isClient || isWorker)) {
        setIsLoading(true);
        try {
          if (isClient) {
            const jobsResponse = await fetch('/api/jobs/client-jobs');
            if (!jobsResponse.ok) {
              throw new Error('Failed to fetch client jobs');
            }
            const jobsData = await jobsResponse.json();
            console.log('Fetched jobsData:', jobsData);
            setRecentJobs(jobsData || []);

            const clientDataResponse = await fetch('/api/client/dashboard');
            if (!clientDataResponse.ok) {
              throw new Error('Failed to fetch client dashboard data');
            }
            const clientData = await clientDataResponse.json();
            setDashboardData(clientData);
          } else if (isWorker) {
            // Fetch worker specific data here
          }
        } catch (error) {
          console.error('Error fetching dashboard data:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchDashboardData();
  }, [isAuthenticated, isClient, isWorker]);

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
                    <p className="text-gray-600">Job Type: {job?.jobType}</p>
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
            <h2 className="text-xl font-semibold mb-4">Your Applied Jobs</h2>
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
                    <p className="text-gray-600 mt-2">{job.description}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No jobs applied to yet.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}