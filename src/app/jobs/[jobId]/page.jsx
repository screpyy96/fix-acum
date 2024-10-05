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
      console.log('Fetching job with ID:', jobId);
      try {
        const response = await fetch(`/api/jobs/${jobId}`);
        console.log('Response status:', response.status);
        if (response.ok) {
          const data = await response.json();
          console.log('Job data:', data);
          setJob(data);
        } else {
          const errorData = await response.json();
          console.error('Error response:', errorData);
          setError(errorData.error || 'Job not found');
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
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        },
        credentials: 'include',
      });

      const data = await response.json();

      if (response.ok) {
        alert('Applied to job successfully');
        router.refresh();
      } else {
        console.error('Error applying to job:', data);
        alert(data.error || 'Failed to apply to job');
      }
    } catch (err) {
      console.error('Error applying to job:', err);
      alert('Something went wrong: ' + err.message);
    }
  };

  const hasApplied = job?.applicants?.some(applicant => applicant.workerId === user.id);

  return (
    <div>
      {/* Arată detaliile jobului */}
      {error && <p className="text-red-500">{error}</p>}
      {job && (
        <div>
          <h1>{job.title}</h1>
          <p>{job.description}</p>
          {/* Alte detalii */}
          <button
            onClick={handleApply}
            className={`mt-4 ${hasApplied ? 'bg-gray-500 cursor-not-allowed' : 'bg-green-500 hover:bg-green-700'} text-white font-bold py-2 px-4 rounded`}
            disabled={hasApplied}
          >
            {hasApplied ? 'Already Applied' : 'Apply to this Job'}
          </button>
        </div>
      )}
    </div>
  );
}