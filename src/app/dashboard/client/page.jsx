'use client';

import { useState, useEffect } from 'react';
import useAuth from '@/hooks/useAuth';
import Link from 'next/link';

export default function ClientDashboard() {
  const { user, loading } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchClientJobs = async () => {
      if (user) {
        try {
          const response = await fetch('/api/jobs/client-jobs-with-applicants', {
            credentials: 'include'
          });
          if (response.ok) {
            const data = await response.json();
            
            setJobs(data);
          } else {
            console.error('Failed to fetch jobs:', response.statusText);
          }
        } catch (error) {
          console.error('Error fetching client jobs:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchClientJobs();
  }, [user]);

  if (loading || isLoading) return <div>Loading...</div>;
  return (
    <div className="container mx-auto px-4 py-8">
         {user ? (
          <>
             <h1 className="text-2xl font-bold mb-6">Client Dashboard</h1>
      <div className="bg-white shadow-md rounded p-4 mb-6">
        <h2 className="text-xl font-semibold mb-2">Your Information</h2>
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
      </div>
          </>
        ) : (
          <p>Go to Sign up page..</p>
        )}
     
      <div>
        <h2 className="text-xl font-semibold mb-4">Your Jobs</h2>
        {jobs.length > 0 ? (
          <ul className="space-y-4">
            {jobs.map(job => (
              <li key={job._id.toString()} className="bg-white shadow-md rounded p-4">
                <Link href={`/jobs/${job._id.toString()}`} className="text-blue-500 hover:underline">
                  <h3 className="text-lg font-semibold">{job.title}</h3>
                </Link>
                <p><strong>Trade Type:</strong> {job.tradeType}</p>
                <p><strong>Job Type:</strong> {job.jobType}</p>
                <p><strong>Status:</strong> {job.status}</p>
                <p><strong>Applicants:</strong> {job.applicants.length}</p>
                {job.applicants.length > 0 && (
                  <div className="mt-2">
                    <h4 className="font-semibold">Applicant Details:</h4>
                    <ul className="list-disc list-inside">
                      {job.applicants.map(applicant => (
                        <li key={applicant._id}>
                            <Link href={`/workers/${applicant._id}`} className="text-blue-500 hover:underline">{applicant.name}</Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p>You haven't posted any jobs yet.</p>
        )}
      </div>
    </div>
  );
}
