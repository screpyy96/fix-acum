'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { FaUserCircle, FaBuilding, FaStar, FaImages, FaCog, FaSync, FaCheckCircle } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaTools, FaMoneyBillWave, FaMapMarkerAlt, FaClock, FaUser } from 'react-icons/fa';


export default function WorkerDashboard() {
  const { user, loading } = useAuth();
  const [jobs, setJobs] = useState({ newJobs: [], appliedJobs: [], completedJobs: [], activeJobs: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user || user.role !== 'worker' || !user.trade) {
        
      } else {
        fetchWorkerJobs();
      }
    }
  }, [user, loading, router]);


  const fetchWorkerJobs = async () => {
    if (!user || !user.trade) return;

    setIsLoading(true);
    setError(null);
    try {
      const [newJobsResponse, appliedJobsResponse, activeJobsResponse, completedJobsResponse] = await Promise.all([
        supabase.from('jobs').select('*').eq('status', 'open').eq('tradeType', user.trade),
        supabase.from('job_applications').select('job_id, status, jobs(*)').eq('worker_id', user.id).eq('status', 'applied'),
        supabase.from('job_applications').select('job_id, status, jobs(*)').eq('worker_id', user.id).eq('status', 'accepted'),
        supabase.from('job_applications').select('job_id, status, jobs(*)').eq('worker_id', user.id).eq('status', 'completed')
      ]);

      if (newJobsResponse.error) throw new Error(newJobsResponse.error.message);
      if (appliedJobsResponse.error) throw new Error(appliedJobsResponse.error.message);
      if (activeJobsResponse.error) throw new Error(activeJobsResponse.error.message);
      if (completedJobsResponse.error) throw new Error(completedJobsResponse.error.message);

      setJobs({
        newJobs: newJobsResponse.data || [],
        appliedJobs: appliedJobsResponse.data || [],
        activeJobs: activeJobsResponse.data || [],
        completedJobs: completedJobsResponse.data || []
      });
    } catch (error) {
      console.error('Error fetching worker jobs:', error);
      setError('Failed to load jobs. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderJobList = (jobList, isApplied) => {
    if (!jobList || jobList.length === 0) {
      return <p className="text-center text-gray-600 mt-4">No jobs to display.</p>;
    }
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {jobList.map(job => {
          const jobData = isApplied ? job.jobs : job;
          
          return (
            <div key={jobData.id} className="bg-white shadow-lg rounded-lg overflow-hidden transition-transform duration-300 hover:scale-105">
              <div className={`p-4 ${isApplied ? 'bg-green-100' : 'bg-blue-100'}`}>
                <h3 className="text-xl font-semibold text-blue-800">{jobData.title}</h3>
                {isApplied && <FaCheckCircle className="text-green-500 float-right" />}
              </div>
              <div className="p-4">
                <p className="mb-2"><strong>Trade Type:</strong> {jobData.tradeType}</p>
                <p className="mb-2"><strong>Description:</strong> {jobData.description}</p>
                <p className="mb-2"><strong>Budget:</strong> ${jobData.budget}</p>
                <Link 
                  href={`/dashboard/job-details/${jobData.id}`}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
                >
                  View Details
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return renderJobList(jobs.newJobs, false);
      case 'appliedJobs':
        return renderJobList(jobs.appliedJobs, true);
      case 'activeJobs':
        return renderJobList(jobs.activeJobs, true);
      case 'completedJobs':
        return renderJobList(jobs.completedJobs, true);
      case 'company-description':
        return <div>Company Description Content</div>;
      case 'reviews':
        return <div>Reviews Content</div>;
      case 'portfolio':
        return <div>Portfolio Content</div>;
      case 'settings':
        return <div>Settings Content</div>;
      default:
        return <div>Unknown tab</div>;
    }
  };

  if (loading || isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user || user.role !== 'worker' || !user.trade) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p>You must be logged in as a worker with a specified trade to view this page.</p>
          <Link href="/login" className="mt-4 inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300">
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <nav className="bg-white shadow-md rounded-lg p-4 mb-8">
        <ul className="flex flex-wrap justify-center space-x-2 md:space-x-4">
          {['dashboard', 'appliedJobs', 'activeJobs', 'completedJobs', 'company-description', 'reviews', 'portfolio', 'settings'].map(tab => (
            <li key={tab}>
              <button
                onClick={() => setActiveTab(tab)}
                aria-label={`Switch to ${tab} tab`}
                className={`flex items-center px-4 py-2 rounded transition-colors duration-300 ${activeTab === tab ? 'bg-blue-500 text-white' : 'hover:bg-gray-200'}`}
              >
                {tab === 'dashboard' && <FaUserCircle className="mr-2" />}
                {tab === 'company-description' && <FaBuilding className="mr-2" />}
                {tab === 'reviews' && <FaStar className="mr-2" />}
                {tab === 'portfolio' && <FaImages className="mr-2" />}
                {tab === 'settings' && <FaCog className="mr-2" />}
                {tab.charAt(0).toUpperCase() + tab.slice(1).replace(/-/g, ' ')}
              </button>
            </li>
          ))}
        </ul>
      </nav>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-blue-600">Worker Dashboard</h1>
        <button
          onClick={fetchWorkerJobs}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300 flex items-center"
        >
          <FaSync className="mr-2" /> Refresh Jobs
        </button>
      </div>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      )}
      {renderContent()}
      <ToastContainer />
    </div>
  );
}