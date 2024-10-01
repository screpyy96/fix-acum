'use client';

import { useState, useEffect } from 'react';
import useAuth from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';

export default function JobDetails({ params }) {
  const { jobId } = params;
  const { user, isWorker, isAuthenticated, loading } = useAuth();
  const [job, setJob] = useState(null);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await fetch(`/api/jobs/${jobId}`);
        if (response.ok) {
          const data = await response.json();
          setJob(data);
        } else {
          setError('Job not found');
        }
      } catch (err) {
        console.error('Error fetching job:', err);
        setError('Error fetching job details');
      }
    };

    fetchJob();
  }, [jobId]);

  const handleApply = async () => {
    try {
      const response = await fetch(`/api/jobs/${jobId}/apply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        alert('Applied to job successfully');
        router.refresh(); // Reîncarcă pagina pentru a actualiza lista de aplicanți
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'Failed to apply to job');
      }
    } catch (err) {
      console.error('Error applying to job:', err);
      alert('Something went wrong');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!job) {
    return <div>{error || 'Loading job details...'}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">{job.title}</h1>
      <p className="mb-2"><strong>Description:</strong> {job.description}</p>
      <p className="mb-2"><strong>Trade Type:</strong> {job.tradeType}</p>
      <p className="mb-2"><strong>Job Type:</strong> {job.jobType}</p>
      <p className="mb-2"><strong>Status:</strong> {job.status}</p>

      {isAuthenticated && isWorker && (
        <button
          onClick={handleApply}
          className="mt-4 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          disabled={job.applicants.includes(user.id)}
        >
          {job.applicants.includes(user.id) ? 'Already Applied' : 'Apply to this Job'}
        </button>
      )}

      {!isAuthenticated && (
        <p className="mt-4 text-red-500">Please log in to apply to this job.</p>
      )}
    </div>
  );
}