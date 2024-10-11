import { useState, useEffect } from 'react'

export default function EditJobModal({ job, onClose, onUpdate }) {
  const [updatedJob, setUpdatedJob] = useState({
    id: job.id,
    title: job.title || '',
    description: job.description || '',
    budget: job.budget || 0,
  })

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    onUpdate(updatedJob)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setUpdatedJob(prev => ({ ...prev, [name]: value }))
  }

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3 text-center">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Edit Job</h3>
          <form onSubmit={handleSubmit} className="mt-2 text-left">
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
                Title
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="title"
                type="text"
                name="title"
                value={updatedJob.title}
                onChange={handleChange}
                placeholder="Job Title"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
                Description
              </label>
              <textarea
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="description"
                name="description"
                value={updatedJob.description}
                onChange={handleChange}
                placeholder="Job Description"
                rows="3"
              ></textarea>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="budget">
                Budget
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="budget"
                type="number"
                name="budget"
                value={updatedJob.budget}
                onChange={handleChange}
                placeholder="Budget"
              />
            </div>
            <div className="flex items-center justify-between mt-4">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="submit"
              >
                Update Job
              </button>
              <button
                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="button"
                onClick={onClose}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}