'use client';

import { useState, useEffect } from 'react';
import useAuth from '@/hooks/useAuth';
import Link from 'next/link';
import { FaEdit, FaTrash, FaUserCircle, FaBriefcase, FaTools, FaClock } from 'react-icons/fa';


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

  const handleCloseJob = async (jobId) => {
    if (window.confirm('Are you sure you want to close this job?')) {
      try {
        const response = await fetch(`/api/jobs/delete/${jobId}`, {
          method: 'PATCH',
          credentials: 'include'
        });
        if (response.ok) {
          const { job } = await response.json();
          setJobs(prevJobs => prevJobs.map(j => 
            j._id === jobId ? job : j
          ));
        } else {
          const errorData = await response.json();
          console.error('Failed to close job:', errorData.error);
        }
      } catch (error) {
        console.error('Error closing job:', error);
      }
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (window.confirm('Are you sure you want to delete this job? This action cannot be undone.')) {
      try {
        const response = await fetch(`/api/jobs/delete/${jobId}`, {
          method: 'DELETE',
          credentials: 'include'
        });

        if (response.ok) {
          setJobs(prevJobs => prevJobs.filter(job => job._id !== jobId));
        } else {
          const errorData = await response.json();
          console.error('Failed to delete job:', errorData.error);
        }
      } catch (error) {
        console.error('Error deleting job:', error);
      }
    }
  };

  if (loading || isLoading) return <div className="flex justify-center items-center h-screen">Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      {user ? (
        <>
          <h1 className="text-3xl font-bold mb-6 text-blue-600">Client Dashboard</h1>
          <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-semibold mb-4 flex items-center">
              <FaUserCircle className="mr-2 text-blue-500" /> Your Information
            </h2>
            <p className="text-lg"><strong>Name:</strong> {user.name}</p>
            <p className="text-lg"><strong>Email:</strong> {user.email}</p>
          </div>

          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold flex items-center">
                <FaBriefcase className="mr-2 text-blue-500" /> Your Jobs
              </h2>
              <Link href="/" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-300">
                Post New Job
              </Link>
            </div>
            {jobs.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {jobs.map(job => (
                  <div key={job._id.toString()} className="bg-white shadow-lg rounded-lg overflow-hidden">
                    <div className="bg-blue-100 p-4">
                      <h3 className="text-xl font-semibold text-blue-800">{job.title}</h3>
                    </div>
                    <div className="p-4">
                      <p className="flex items-center mb-2"><FaTools className="mr-2 text-gray-600" /> <strong>Trade Type:</strong> {job.tradeType}</p>
                      <p className="flex items-center mb-2"><FaBriefcase className="mr-2 text-gray-600" /> <strong>Job Type:</strong> {job.jobType}</p>
                      <p className="flex items-center mb-2"><FaClock className="mr-2 text-gray-600" /> <strong>Status:</strong> {job.status}</p>
                      <p className="mb-4"><strong>Applicants:</strong> {job.applicants.length}</p>
                      {job.applicants.length > 0 && (
                        <div className="mb-4">
                          <h4 className="font-semibold mb-2">Applicant Details:</h4>
                          <ul className="list-disc list-inside">
                            {job.applicants.map(applicant => (
                              <li key={applicant._id}>
                                <Link href={`/workers/${applicant._id}`} className="text-blue-500 hover:underline">{applicant.name}</Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      <div className="flex justify-between mt-4">
                        <Link href={`/edit-job/${job._id}`} className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition duration-300 flex items-center">
                          <FaEdit className="mr-1" /> Edit
                        </Link>
                        {job.status !== 'closed' ? (
                          <button
                            onClick={() => handleCloseJob(job._id)}
                            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition duration-300"
                          >
                            Close Job
                          </button>
                        ) : (
                          <button
                            onClick={() => handleDeleteJob(job._id)}
                            className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600 transition duration-300 flex items-center"
                          >
                            <FaTrash className="mr-1" /> Delete
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-600 mt-4">You haven't posted any jobs yet.</p>
            )}
          </div>
        </>
      ) : (
        <p className="text-center text-xl mt-10">Please <Link href="/login" className="text-blue-500 hover:underline">log in</Link> to view your dashboard.</p>
      )}
    </div>
  );
}