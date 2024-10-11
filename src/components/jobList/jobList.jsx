import React from 'react'
import { FaEdit, FaTrash, FaUserCheck, FaUserCircle } from 'react-icons/fa'
import Link from 'next/link'

export default function JobList({ jobs, onEditJob, onDeleteJob, onAcceptWorker }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {jobs.map((job) => (
        <div key={job.id} className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-2 text-gray-800">{job.title}</h2>
            <p className="text-gray-600 mb-4 line-clamp-2">{job.description}</p>
            <div className="flex justify-between items-center mb-4">
              <span className="text-green-600 font-semibold">${job.budget}</span>
              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                job.status === 'open' ? 'bg-green-100 text-green-800' :
                job.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {job.status}
              </span>
            </div>
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2 text-gray-700">Applicants:</h3>
              {job.applicants && job.applicants.length > 0 ? (
                <ul className="space-y-2">
                  {job.applicants.map((applicant) => (
                    <li key={applicant.id} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                      <Link href={`/workers/${applicant.worker?.id}`} className="flex items-center text-blue-600 hover:text-blue-800">
                        <FaUserCircle className="mr-2" />
                        <span>{applicant.worker?.name || 'Unknown'}</span>
                      </Link>
                      {applicant.status === 'pending' && (
                        <button
                          onClick={() => onAcceptWorker(job.id, applicant.worker?.id)}
                          className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-full text-sm flex items-center"
                        >
                          <FaUserCheck className="mr-1" /> Accept
                        </button>
                      )}
                      {applicant.status === 'accepted' && (
                        <span className="text-green-600 font-semibold">Accepted</span>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 italic">No applicants yet.</p>
              )}
            </div>
          </div>
          <div className="bg-gray-50 px-6 py-3 flex justify-end space-x-2">
            <button
              onClick={() => onEditJob(job)}
              className="text-blue-600 hover:text-blue-800"
            >
              <FaEdit />
            </button>
            <button
              onClick={() => onDeleteJob(job.id)}
              className="text-red-600 hover:text-red-800"
            >
              <FaTrash />
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}