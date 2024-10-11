'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import { supabase } from '@/lib/supabase'
import { FaUserCircle, FaBuilding, FaStar, FaImages, FaCog, FaSync, FaCheckCircle, FaTools, FaMoneyBillWave, FaMapMarkerAlt, FaClock, FaUser } from 'react-icons/fa'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export default function WorkerDashboard() {
  const { user, loading } = useAuth()
  const [jobs, setJobs] = useState({ newJobs: [], appliedJobs: [], completedJobs: [], activeJobs: [] })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState('dashboard')
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      if (!user || user.role !== 'worker' || !user.trade) {
        router.push('/login')
      } else {
        fetchWorkerJobs()
      }
    }
  }, [user, loading, router])

  const fetchWorkerJobs = async () => {
    if (!user || !user.trade) return

    setIsLoading(true)
    setError(null)
    try {
      const [newJobsResponse, appliedJobsResponse, activeJobsResponse, completedJobsResponse] = await Promise.all([
        supabase.from('jobs').select('*').eq('status', 'open').eq('tradeType', user.trade),
        supabase.from('job_applications').select('job_id, status, jobs(*)').eq('worker_id', user.id).eq('status', 'applied'),
        supabase.from('job_applications').select('job_id, status, jobs(*)').eq('worker_id', user.id).eq('status', 'accepted'),
        supabase.from('job_applications').select('job_id, status, jobs(*)').eq('worker_id', user.id).eq('status', 'completed')
      ])

      if (newJobsResponse.error) throw new Error(newJobsResponse.error.message)
      if (appliedJobsResponse.error) throw new Error(appliedJobsResponse.error.message)
      if (activeJobsResponse.error) throw new Error(activeJobsResponse.error.message)
      if (completedJobsResponse.error) throw new Error(completedJobsResponse.error.message)

      setJobs({
        newJobs: newJobsResponse.data || [],
        appliedJobs: appliedJobsResponse.data || [],
        activeJobs: activeJobsResponse.data || [],
        completedJobs: completedJobsResponse.data || []
      })
    } catch (error) {
      console.error('Error fetching worker jobs:', error)
      setError('Failed to load jobs. Please try again later.')
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
        {jobList.map(job => {
          const jobData = isApplied ? job.jobs : job
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
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300 inline-block mt-2"
                >
                  View Details
                </Link>
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  const renderDashboardOverview = () => (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-gray-500">Total Earnings</h3>
          <FaMoneyBillWave className="h-4 w-4 text-gray-400" />
        </div>
        <div className="text-2xl font-bold">$1,234</div>
        <p className="text-xs text-gray-500">+20.1% from last month</p>
      </div>
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-gray-500">Active Jobs</h3>
          <FaTools className="h-4 w-4 text-gray-400" />
        </div>
        <div className="text-2xl font-bold">{jobs.activeJobs.length}</div>
        <p className="text-xs text-gray-500">+2 new since last week</p>
      </div>
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-gray-500">Completion Rate</h3>
          <FaCheckCircle className="h-4 w-4 text-gray-400" />
        </div>
        <div className="text-2xl font-bold">98%</div>
        <div className="mt-2 h-2 bg-gray-200 rounded-full">
          <div className="h-full bg-green-500 rounded-full" style={{ width: '98%' }}></div>
        </div>
      </div>
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-gray-500">Average Rating</h3>
          <FaStar className="h-4 w-4 text-gray-400" />
        </div>
        <div className="text-2xl font-bold">4.9</div>
        <div className="flex items-center">
          {[...Array(5)].map((_, i) => (
            <FaStar key={i} className={`h-4 w-4 ${i < 4 ? 'text-yellow-400' : 'text-gray-300'}`} />
          ))}
        </div>
      </div>
    </div>
  )

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <>
            {renderDashboardOverview()}
            <h2 className="text-2xl font-bold mt-8 mb-4">New Jobs</h2>
            {renderJobList(jobs.newJobs, false)}
          </>
        )
      case 'appliedJobs':
        return renderJobList(jobs.appliedJobs, true)
      case 'activeJobs':
        return renderJobList(jobs.activeJobs, true)
      case 'completedJobs':
        return renderJobList(jobs.completedJobs, true)

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
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white text-xl font-bold">
              {user.name?.charAt(0) || 'W'}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-blue-600">Welcome, {user.name}</h1>
              <p className="text-gray-600">{user.trade} Specialist</p>
            </div>
          </div>
          <button
            onClick={fetchWorkerJobs}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300 flex items-center"
          >
            <FaSync className="mr-2" /> Refresh Jobs
          </button>
        </div>

        <nav className="bg-white shadow-md rounded-lg p-4 mb-8">
          <ul className="flex flex-wrap justify-center space-x-2 md:space-x-4">
            {['dashboard', 'appliedJobs', 'activeJobs', 'completedJobs'].map(tab => (
              <li key={tab}>
                <button
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded transition-colors duration-300 ${activeTab === tab ? 'bg-blue-500 text-white' : 'hover:bg-gray-200'}`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1).replace(/-/g, ' ')}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {renderContent()}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline"> {error}</span>
          </div>
        )}
      </div>
      <ToastContainer />
    </div>
  )
}

