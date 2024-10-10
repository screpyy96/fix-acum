'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { FaUserCircle, FaBriefcase, FaEdit, FaTrash, FaCheck, FaStar } from 'react-icons/fa'
import useAuth from '@/hooks/useAuth'

export default function ClientDashboard() {
  const { user, loading } = useAuth()
  const [jobs, setJobs] = useState([])
  const [completedJobs, setCompletedJobs] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  useEffect(() => {
    if (user) {
      fetchClientJobs()
    }
  }, [user])

  const fetchClientJobs = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/jobs/client-jobs-with-applicants', {
        credentials: 'include'
      })
      if (response.ok) {
        const data = await response.json()
        setJobs(data)
        const completed = data.filter(job => job.status === 'completed')
        setCompletedJobs(completed)
      } else {
        console.error('Failed to fetch jobs:', response.statusText)
      }
    } catch (error) {
      console.error('Error fetching client jobs:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCloseJob = async (jobId) => {
    if (window.confirm('Are you sure you want to close this job?')) {
      try {
        const response = await fetch(`/api/jobs/close/${jobId}`, {
          method: 'PATCH',
          credentials: 'include'
        })
        if (response.ok) {
          const { job } = await response.json()
          setJobs(prevJobs => prevJobs.map(j => j._id === jobId ? job : j))
        } else {
          const errorData = await response.json()
          console.error('Failed to close job:', errorData.error)
        }
      } catch (error) {
        console.error('Error closing job:', error)
      }
    }
  }

  const handleDeleteJob = async (jobId) => {
    if (window.confirm('Are you sure you want to delete this job? This action cannot be undone.')) {
      try {
        const response = await fetch(`/api/jobs/delete/${jobId}`, {
          method: 'DELETE',
          credentials: 'include'
        })
        if (response.ok) {
          setJobs(prevJobs => prevJobs.filter(job => job._id !== jobId))
        } else {
          const errorData = await response.json()
          console.error('Failed to delete job:', errorData.error)
        }
      } catch (error) {
        console.error('Error deleting job:', error)
      }
    }
  }

  const handleAcceptWorker = async (jobId, workerId) => {
    try {
      const response = await fetch(`/api/jobs/${jobId}/accept-worker`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ workerId }),
        credentials: 'include'
      })
      if (response.ok) {
        const { job } = await response.json()
        setJobs(prevJobs => prevJobs.map(j => j._id === jobId ? job : j))
      } else {
        const errorData = await response.json()
        console.error('Failed to accept worker:', errorData.error)
      }
    } catch (error) {
      console.error('Error accepting worker:', error)
    }
  }

  const handleCompleteJob = async (jobId) => {
    const review = prompt("Please enter your review for the worker:")
    const rating = prompt("Please enter your rating (1-5):")
    
    if (!review || !rating || rating < 1 || rating > 5) return

    try {
      const response = await fetch(`/api/jobs/${jobId}/complete`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ review, rating }),
        credentials: 'include'
      })

      if (response.ok) {
        const updatedJob = await response.json()
        setJobs(prevJobs => prevJobs.map(job => job._id === jobId ? updatedJob : job))
        console.log('Job marked as completed:', updatedJob)
      } else {
        const errorData = await response.json()
        console.error('Failed to complete job:', errorData.error)
        alert(`Error: ${errorData.error}`)
      }
    } catch (error) {
      console.error('Error completing job:', error)
      alert('An error occurred while completing the job. Please try again.')
    }
  }

  const renderJobs = () => {
    return jobs.map((job) => (
      <div key={job._id} className="bg-white shadow-lg rounded-lg p-6 mb-4 transition-all duration-300 hover:shadow-xl">
        <h3 className="text-xl font-semibold mb-2">{job.title}</h3>
        <p className="text-gray-600 mb-2">{job.description}</p>
        <p className="text-sm text-gray-500 mb-2">Status: {job.status}</p>
        <p className="text-sm text-gray-500 mb-4">Posted on: {new Date(job.createdAt).toLocaleDateString()}</p>
        
        {job.status === 'open' && (
          <div className="flex space-x-2">
            <Link href={`/edit-job/${job._id}`} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300 flex items-center">
              <FaEdit className="mr-2" /> Edit
            </Link>
            <button
              onClick={() => handleCloseJob(job._id)}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-300 flex items-center"
            >
              <FaTrash className="mr-2" /> Close Job
            </button>
          </div>
        )}
        
        {job.status === 'in-progress' && (
          <button
            onClick={() => handleCompleteJob(job._id)}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-300 flex items-center"
          >
            <FaCheck className="mr-2" /> Mark as Completed
          </button>
        )}
        
        {job.status === 'completed' && (
          <p className="text-green-600 font-semibold">This job has been completed</p>
        )}
        
        {job.applicants && job.applicants.length > 0 && (
          <div className="mt-4">
            <h4 className="text-lg font-semibold mb-2">Applicants:</h4>
            {job.applicants.map((applicant) => (
              <div key={applicant._id} className="flex items-center justify-between bg-gray-100 p-2 rounded mb-2">
                <span>{applicant.workerDetails?.name || 'Unknown Worker'}</span>
                {job.status === 'open' && (
                  <button
                    onClick={() => handleAcceptWorker(job._id, applicant.workerId)}
                    className="bg-green-500 text-white px-2 py-1 rounded text-sm hover:bg-green-600 transition duration-300"
                  >
                    Accept
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    ))
  }

  if (loading || isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

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
              <Link href="/post-job" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-300">
                Post New Job
              </Link>
            </div>
            {jobs.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {renderJobs()}
              </div>
            ) : (
              <p className="text-center text-gray-600 mt-4">You haven't posted any jobs yet.</p>
            )}
          </div>

          <h2 className="text-2xl font-semibold mb-4 flex items-center">
            <FaStar className="mr-2 text-yellow-500" /> Completed Jobs
          </h2>
          <div className="mb-6">
            {completedJobs.length > 0 ? (
              completedJobs.map(job => (
                <div key={job._id} className="border p-4 mb-4 bg-white rounded shadow transition-all duration-300 hover:shadow-lg">
                  <h3 className="text-xl font-bold">{job.title}</h3>
                  <p>{job.description}</p>
                  <p className="text-gray-600">Status: {job.status}</p>
                  <h4 className="font-semibold mt-2">Reviews:</h4>
                  {job.reviews && job.reviews.length > 0 ? (
                    job.reviews.map(review => (
                      <div key={review._id} className="border-t mt-2 pt-2">
                        <p><strong>Review:</strong> {review.review}</p>
                        <p><strong>Rating:</strong> {review.rating} / 5</p>
                      </div>
                    ))
                  ) : (
                    <p>No reviews yet.</p>
                  )}
                </div>
              ))
            ) : (
              <p>No completed jobs found.</p>
            )}
          </div>
        </>
      ) : (
        <p className="text-center text-xl mt-10">Please <Link href="/login" className="text-blue-500 hover:underline">log in</Link> to view your dashboard.</p>
      )}
    </div>
  )
}