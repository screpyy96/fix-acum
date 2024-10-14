import React, { useState } from 'react'
import Link from 'next/link'
import { FaEdit, FaTrash, FaCheck } from 'react-icons/fa'
import ReviewModal from '../reviews/reviewModal' // Vom crea acest component

export default function JobList({ jobs, onEditJob, onDeleteJob, onAcceptWorker, onCompleteJob, onReviewWorker }) {
  const [showReviewModal, setShowReviewModal] = useState(false)
  const [selectedJob, setSelectedJob] = useState(null)

  const handleCompleteJob = (job) => {
    setSelectedJob(job)
    setShowReviewModal(true)
  }

  return (
    <div className="space-y-4">
      {jobs.map((job) => (
        <div key={job.id} className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-2">{job.title}</h3>
          <p className="text-gray-600 mb-4">{job.description}</p>
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm text-gray-500">Budget: ${job.budget}</span>
            <span className={`text-sm font-semibold ${job.status === 'open' ? 'text-green-500' : job.status === 'in-progress' ? 'text-blue-500' : 'text-purple-500'}`}>
              {job.status}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <div>
              <button
                onClick={() => onEditJob(job)}
                className="text-blue-500 hover:text-blue-700 mr-2"
              >
                <FaEdit />
              </button>
              <button
                onClick={() => onDeleteJob(job.id)}
                className="text-red-500 hover:text-red-700"
              >
                <FaTrash />
              </button>
            </div>
            
            {job.status === 'in-progress' && (
              <button
                onClick={() => handleCompleteJob(job)}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
              >
                <FaCheck className="mr-2" />
                Complete Job
              </button>
            )}
          </div>
          
          {job.job_applications && job.job_applications.length > 0 ? (
            <div className="mt-4">
              <h4 className="text-lg font-semibold mb-2">Aplicanți:</h4>
              <ul className="space-y-2">
                {job.job_applications.map((application) => (
                 
                  <li key={application.job_id} className="flex items-center justify-between bg-gray-100 p-2 rounded">
                    <Link href={`/workers/${application.worker.id}`} className="text-blue-600 hover:underline">
                      {application.worker.name}
                    </Link>
                    <span className="text-sm text-gray-600">Status: {application.status}</span>
                    {job.status === 'open' && application.status !== 'accepted' && (
                      <button
                        onClick={() => onAcceptWorker(job.id, application.worker.id)}
                        className="bg-green-500 hover:bg-green-600 text-white font-bold py-1 px-3 rounded text-sm"
                      >
                        Accept
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="mt-4 text-gray-600 italic">Nu există aplicanți pentru acest job.</p>
          )}
        </div>
      ))}
      {showReviewModal && (
        <ReviewModal
          job={selectedJob}
          onClose={() => setShowReviewModal(false)}
          onSubmitReview={(rating, comment) => {
            console.log('Review data in JobList:', { rating, comment }); // Pentru debugging
            onCompleteJob(selectedJob.id);
            onReviewWorker(selectedJob.id, selectedJob.job_applications[0].worker.id, rating, comment);
            setShowReviewModal(false);
          }}
        />
      )}
    </div>
  )
}
