'use client';

import { useState, useEffect } from 'react';
import useAuth from '@/hooks/useAuth';
import Link from 'next/link';
import { FaUserCircle, FaBriefcase, FaBuilding, FaStar, FaImages, FaCog, FaCheckCircle } from 'react-icons/fa';
import CompanyDescription from '@/components/worker/CompanyDescription';
import Reviews from '@/components/worker/Reviews';
import Portfolio from '@/components/worker/Portfolio';
import Settings from '@/components/worker/Settings';

export default function WorkerDashboard() {
  const { user, loading } = useAuth();
  const [jobs, setJobs] = useState({ newJobs: [], appliedJobs: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    const fetchWorkerJobs = async () => {
      if (user && user.trade) {
        try {
          const response = await fetch('/api/jobs/worker-jobs', {
            credentials: 'include'
          });
          if (response.ok) {
            const data = await response.json();
            console.log('Jobs data received:', data);
            
            // Filtrează joburile după tradeType și apoi separă-le în noi și aplicate
            const relevantJobs = data.filter(job => job.tradeType === user.trade);
            
            const newJobs = [];
            const appliedJobs = [];
            
            relevantJobs.forEach(job => {
              const hasApplied = job.applicants.some(applicant => 
                applicant.workerId === user.id && applicant.appliedAt
              );

              console.log(user)
              
              if (hasApplied) {
                appliedJobs.push(job);
              } else {
                newJobs.push(job);
              }
            });
            
            setJobs({
              newJobs: newJobs,
              appliedJobs: appliedJobs
            });
            
            console.log('Filtered and separated jobs:', { newJobs, appliedJobs });
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

  if (loading || isLoading) return <div className="flex justify-center items-center h-screen">Loading...</div>;

  const renderJobList = (jobList, isApplied) => {
    console.log(`Rendering job list. Is applied: ${isApplied}. Job count: ${jobList?.length}`);
    if (!jobList || jobList.length === 0) {
      return <p className="text-center text-gray-600 mt-4">No jobs to display.</p>;
    }
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {jobList.map(job => (
          <div key={job._id.toString()} className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div className={`p-4 ${isApplied ? 'bg-green-100' : 'bg-blue-100'}`}>
              <h3 className="text-xl font-semibold text-blue-800">{job.title}</h3>
              {isApplied && <FaCheckCircle className="text-green-500 float-right" />}
            </div>
            <div className="p-4">
              <p className="mb-2"><strong>Trade Type:</strong> {job.tradeType}</p>
              <p className="mb-2"><strong>Job Type:</strong> {job.jobType}</p>
              <p className="mb-2"><strong>Description:</strong> {job.description}</p>
              <p className="mb-2"><strong>Project Stage:</strong> {job.projectStage}</p>
              <p className="mb-4"><strong>Status:</strong> {job.status}</p>
              <Link href={`/jobs/${job._id.toString()}`} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300">
                {isApplied ? 'View Application' : 'View Details'}
              </Link>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderContent = () => {
    console.log('Rendering content. Current jobs state:', jobs);
    switch (activeTab) {
      case 'dashboard':
        return (
          <div>
            <h1 className="text-3xl font-bold mb-6 text-blue-600">Worker Dashboard</h1>
            <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
              <h2 className="text-2xl font-semibold mb-4 flex items-center">
                <FaUserCircle className="mr-2 text-blue-500" /> Your Information
              </h2>
              {user ? (
                <>
                  <p className="text-lg"><strong>Name:</strong> {user.name}</p>
                  <p className="text-lg"><strong>Email:</strong> {user.email}</p>
                  <p className="text-lg"><strong>Trade:</strong> {user.trade}</p>
                </>
              ) : (
                <p className="text-red-500">Please complete your profile in the Settings tab.</p>
              )}
            </div>
            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 flex items-center">
                <FaBriefcase className="mr-2 text-blue-500" /> New Available Jobs
              </h2>
              {renderJobList(jobs.newJobs, false)}
            </div>
            <div>
              <h2 className="text-2xl font-semibold mb-4 flex items-center">
                <FaCheckCircle className="mr-2 text-green-500" /> Jobs You've Applied To
              </h2>
              {renderJobList(jobs.appliedJobs, true)}
            </div>
          </div>
        );
      case 'company-description':
        return <CompanyDescription />;
      case 'reviews':
        return <Reviews />;
      case 'portfolio':
        return <Portfolio />;
      case 'settings':
        return <Settings />;
      default:
        return <div>Unknown tab</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <nav className="bg-white shadow-md rounded-lg p-4 mb-8">
        <ul className="flex space-x-4 justify-center">
          <li><button onClick={() => setActiveTab('dashboard')} className={`flex items-center px-4 py-2 rounded ${activeTab === 'dashboard' ? 'bg-blue-500 text-white' : 'hover:bg-gray-200'}`}><FaUserCircle className="mr-2" /> Dashboard</button></li>
          <li><button onClick={() => setActiveTab('company-description')} className={`flex items-center px-4 py-2 rounded ${activeTab === 'company-description' ? 'bg-blue-500 text-white' : 'hover:bg-gray-200'}`}><FaBuilding className="mr-2" /> Company</button></li>
          <li><button onClick={() => setActiveTab('reviews')} className={`flex items-center px-4 py-2 rounded ${activeTab === 'reviews' ? 'bg-blue-500 text-white' : 'hover:bg-gray-200'}`}><FaStar className="mr-2" /> Reviews</button></li>
          <li><button onClick={() => setActiveTab('portfolio')} className={`flex items-center px-4 py-2 rounded ${activeTab === 'portfolio' ? 'bg-blue-500 text-white' : 'hover:bg-gray-200'}`}><FaImages className="mr-2" /> Portfolio</button></li>
          <li><button onClick={() => setActiveTab('settings')} className={`flex items-center px-4 py-2 rounded ${activeTab === 'settings' ? 'bg-blue-500 text-white' : 'hover:bg-gray-200'}`}><FaCog className="mr-2" /> Settings</button></li>
        </ul>
      </nav>
      {renderContent()}
    </div>
  );
}