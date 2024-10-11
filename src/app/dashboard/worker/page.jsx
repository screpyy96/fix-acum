'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { FaUserCircle, FaBriefcase, FaBuilding, FaStar, FaImages, FaCog, FaCheckCircle, FaChartBar, FaLightbulb, FaSync } from 'react-icons/fa'
import useAuth from '@/hooks/useAuth'
import { supabase } from '@/lib/supabase'
import CompanyDescription from '@/components/worker/CompanyDescription'
import Reviews from '@/components/worker/Reviews'
import Portfolio from '@/components/worker/Portfolio'
import Settings from '@/components/worker/Settings'
import Notifications from '@/components/notifications/notifications'

export default function WorkerDashboard() {
  const { user, loading, isWorker } = useAuth()
  const [jobs, setJobs] = useState({ newJobs: [], appliedJobs: [], completedJobs: [], activeJobs: [] })
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('dashboard')
  const router = useRouter()

  useEffect(() => {
    if (!loading && !isWorker) {
      router.push('/login')
    }
  }, [user, loading, isWorker, router])

  useEffect(() => {
    if (user) {
      fetchWorkerJobs()
    }
  }, [user])

  const fetchWorkerJobs = async () => {
    setIsLoading(true)
    try {
      // Fetch new jobs
      const { data: newJobs, error: newJobsError } = await supabase
        .from('jobs')
        .select('*')
        .eq('status', 'open')
        .eq('tradeType', user.trade)

      // Fetch applied jobs
      const { data: appliedJobs, error: appliedJobsError } = await supabase
        .from('job_applications')
        .select('*, job:jobs(*)')
        .eq('worker_id', user.id)

      // Fetch active jobs
      const { data: activeJobs, error: activeJobsError } = await supabase
        .from('job_applications')
        .select('*, job:jobs(*)')
        .eq('worker_id', user.id)
        .eq('status', 'accepted')

      // Fetch completed jobs
      const { data: completedJobs, error: completedJobsError } = await supabase
        .from('job_applications')
        .select('*, job:jobs(*)')
        .eq('worker_id', user.id)
        .eq('status', 'completed')

      if (newJobsError || appliedJobsError || activeJobsError || completedJobsError) {
        throw new Error('Failed to fetch jobs')
      }

      setJobs({
        newJobs: newJobs || [],
        appliedJobs: appliedJobs?.map(app => app.job) || [],
        activeJobs: activeJobs?.map(app => app.job) || [],
        completedJobs: completedJobs?.map(app => app.job) || []
      })
    } catch (error) {
      console.error('Error fetching worker jobs:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const renderJobList = (jobList, isApplied) => {
    if (!jobList || jobList.length === 0) {
      return <p className="text-center text-gray-600 mt-4">No jobs to display.</p>
    }
    
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {jobList.map(job => (
          <div key={job.id} className="bg-white shadow-lg rounded-lg overflow-hidden transition-transform duration-300 hover:scale-105">
            <div className={`p-4 ${isApplied ? 'bg-green-100' : 'bg-blue-100'}`}>
              <h3 className="text-xl font-semibold text-blue-800">{job.title}</h3>
              {isApplied && <FaCheckCircle className="text-green-500 float-right" />}
            </div>
            <div className="p-4">
              <p className="mb-2"><strong>Trade Type:</strong> {job.tradeType}</p>
              <p className="mb-2"><strong>Job Type:</strong> {job.jobType}</p>
              <p className="mb-2"><strong>Description:</strong> {job.description}</p>
              <p className="mb-2"><strong>Project Stage:</strong> {job.projectStage}</p>
              
              {isApplied && (
                <p className="mb-2">
                  <strong>Application Status:</strong> 
                  {job.status === 'completed' ? (
                    <span className="ml-2 text-gray-600 font-semibold">Completed</span>
                  ) : job.status === 'in-progress' ? (
                    <span className="ml-2 text-green-600 font-semibold">Accepted</span>
                  ) : (
                    <span className="ml-2 text-yellow-600">Pending</span>
                  )}
                </p>
              )}
  
              <p className="mb-4"><strong>Posted:</strong> {new Date(job.created_at).toLocaleDateString()}</p>
              <Link href={`/jobs/${job.id}`} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300">
                {isApplied ? 'View Application' : 'View Details'}
              </Link>
            </div>
          </div>
        ))}
      </div>
    )
  }

  const renderStatistics = () => {
    if (!jobs || Object.keys(jobs).length === 0) {
      return <p>No job statistics available.</p>
    }
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white shadow-md rounded-lg p-4 transition-all duration-300 hover:shadow-lg">
          <h3 className="text-xl font-semibold">New Jobs</h3>
          <p className="text-3xl font-bold text-blue-600">{jobs.newJobs.length}</p>
        </div>
        <div className="bg-white shadow-md rounded-lg p-4 transition-all duration-300 hover:shadow-lg">
          <h3 className="text-xl font-semibold">Active Jobs</h3>
          <p className="text-3xl font-bold text-green-600">{jobs.activeJobs.length}</p>
        </div>
        <div className="bg-white shadow-md rounded-lg p-4 transition-all duration-300 hover:shadow-lg">
          <h3 className="text-xl font-semibold">Applied Jobs</h3>
          <p className="text-3xl font-bold text-yellow-600">{jobs.appliedJobs.length}</p>
        </div>
        <div className="bg-white shadow-md rounded-lg p-4 transition-all duration-300 hover:shadow-lg">
          <h3 className="text-xl font-semibold">Completed Jobs</h3>
          <p className="text-3xl font-bold text-gray-600">{jobs.completedJobs.length}</p>
        </div>
      </div>
    )
  }

  const renderTips = () => (
    <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
      <h2 className="text-2xl font-semibold mb-4 flex items-center">
        <FaLightbulb className="mr-2 text-yellow-500" /> Tips for Success
      </h2>
      <ul className="list-disc list-inside space-y-2">
        <li>Keep your profile up to date with your latest skills and experiences.</li>
        <li>Respond promptly to job inquiries and messages from clients.</li>
        <li>Maintain a high-quality portfolio to showcase your best work.</li>
        <li>Always provide professional and courteous service to increase your chances of positive reviews.</li>
      </ul>
    </div>
  )

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div>
          
            {renderStatistics()}
            {renderTips()}
            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 flex items-center">
                <FaBriefcase className="mr-2 text-blue-500" /> New Available Jobs
              </h2>
              {renderJobList(jobs.newJobs, false)}
            </div>
            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 flex items-center">
                <FaCheckCircle className="mr-2 text-green-500" /> Active Jobs
              </h2>
              {renderJobList(jobs.activeJobs, false)}
            </div>
            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 flex items-center">
                <FaCheckCircle className="mr-2 text-green-500" /> Jobs You've Applied To
              </h2>
              {renderJobList(jobs.appliedJobs, true)}
            </div>
            <div>
              <h2 className="text-2xl font-semibold mb-4 flex items-center">
                <FaStar className="mr-2 text-yellow-500" /> Completed Jobs
              </h2>
              {renderJobList(jobs.completedJobs, true)}
            </div>
          </div>
        )
      case 'company-description':
        return <CompanyDescription />
      case 'reviews':
        return <Reviews />
      case 'portfolio':
        return <Portfolio />
      case 'settings':
        return <Settings />
      default:
        return <div>Unknown tab</div>
    }
  }

  if (loading || isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <nav className="bg-white shadow-md rounded-lg p-4 mb-8">
        <ul className="flex flex-wrap justify-center space-x-2 md:space-x-4">
          {['dashboard', 'company-description', 'reviews', 'portfolio', 'settings'].map(tab => (
            <li key={tab}>
              <button
                onClick={() => setActiveTab(tab)}
                className={`flex items-center px-4 py-2 rounded transition-colors duration-300 ${
                  activeTab === tab ? 'bg-blue-500 text-white' : 'hover:bg-gray-200'
                }`}
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
      {renderContent()}
      <Notifications />
    </div>
  )
}