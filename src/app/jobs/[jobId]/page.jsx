'use client';

import { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function JobDetails({ params }) {
  const { jobId } = params;

  const [job, setJob] = useState(null);
  const [error, setError] = useState('');
  const [hasApplied, setHasApplied] = useState(false); // Added state to manage application status

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await fetch(`/api/jobs/${jobId}`);
        if (response.ok) {
          const data = await response.json();
          setJob(data);
          // Check if the user has already applied to the job
          const hasApplied = data.applicants.some(applicant => applicant.workerId === applicant.workerId);
          setHasApplied(hasApplied);
        } else {
          const errorData = await response.json();
          setError(errorData.error || 'Job not found');
        }
      } catch (err) {
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

      if (response.ok) {
        setHasApplied(true); // Update the application status
        toast.success('Applied to job successfully');
      } else {
        toast.error('Failed to apply to job');
      }
    } catch (err) {
      toast.error('Something went wrong: ' + err.message);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Error message */}
      {error && <p className="text-red-500 mb-4">{error}</p>}

      {/* Job details */}
      {job && (
        <div className="bg-white shadow-md rounded-lg p-6">
          <h1 className="text-2xl font-bold mb-4">{job.title}</h1>
          <p className="text-sm text-gray-500 mb-2">Location: {job.location}</p>
          <p className="text-sm text-gray-500 mb-4">Job ID: {job.id}</p>

          <div className="mb-6">
            <p className="text-lg font-medium mb-2">Job Description</p>
            <p className="text-gray-700">{job.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-100 p-4 rounded-lg shadow-md">
              <span className="block text-center text-xl font-semibold text-purple-600">{job.interestedCount}</span>
              <p className="text-center text-gray-600">Tradespeople interested</p>
            </div>
            <div className="bg-gray-100 p-4 rounded-lg shadow-md">
              <span className="block text-center text-xl font-semibold text-purple-600">{job.shortlistedCount}</span>
              <p className="text-center text-gray-600">Tradespeople shortlisted</p>
            </div>
          </div>

          {/* Apply button */}
          <button
            onClick={handleApply}
            className={`w-full py-3 px-4 text-white font-bold rounded-lg ${hasApplied ? 'bg-gray-400 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700'}`}
            disabled={hasApplied}
          >
            {hasApplied ? 'Already Applied' : 'Express interest'}
          </button>
        </div>
      )}

      {/* Map placeholder */}
      {job && (
        <div className="mt-6">
          <h2 className="text-xl font-medium mb-4">Location on Map</h2>
          <div className="w-full h-64 bg-gray-300 rounded-lg shadow-md">
            {/* Add your map component here */}
            <p className="text-center pt-24 text-gray-600">Map Placeholder</p>
          </div>
        </div>
      )}

      <ToastContainer /> {/* Toastify container for notifications */}
    </div>
  );
}
