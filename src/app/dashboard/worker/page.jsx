'use client';

import { useState, useEffect } from 'react';
import useAuth from '@/hooks/useAuth';
import Link from 'next/link';
import { FaUserCircle, FaBriefcase, FaBuilding, FaStar, FaImages, FaCog } from 'react-icons/fa';
import CompanyDescription from '@/components/worker/CompanyDescription';
import Reviews from '@/components/worker/Reviews';
import Portfolio from '@/components/worker/Portfolio';
import Settings from '@/components/worker/Settings';

export default function WorkerDashboard() {
  const { user, loading } = useAuth();
  const [jobs, setJobs] = useState([]);
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

  if (loading || isLoading) return <div className="flex justify-center items-center h-screen">Loading...</div>;

  const filteredJobs = jobs.filter(job => job.tradeType === user.trade);

  const renderContent = () => {
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
            <div>
              <h2 className="text-2xl font-semibold mb-4 flex items-center">
                <FaBriefcase className="mr-2 text-blue-500" /> Available Jobs
              </h2>
              {filteredJobs.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {filteredJobs.map(job => (
                    <div key={job._id.toString()} className="bg-white shadow-lg rounded-lg overflow-hidden">
                      <div className="bg-blue-100 p-4">
                        <h3 className="text-xl font-semibold text-blue-800">{job.title}</h3>
                      </div>
                      <div className="p-4">
                        <p className="mb-2"><strong>Trade Type:</strong> {job.tradeType}</p>
                        <p className="mb-2"><strong>Job Type:</strong> {job.jobType}</p>
                        <p className="mb-4"><strong>Status:</strong> {job.status}</p>
                        <Link href={`/jobs/${job._id.toString()}`} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300">
                          View Details
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-600 mt-4">No available jobs matching your trade.</p>
              )}
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