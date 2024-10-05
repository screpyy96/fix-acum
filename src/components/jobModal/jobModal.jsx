import { useState } from 'react';

export default function EditJobModal({ job, onClose, onUpdate }) {
  const [editedJob, setEditedJob] = useState(job);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedJob(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/jobs/update/${job._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editedJob),
        credentials: 'include' // Adaugă această linie
      });

      if (response.ok) {
        const updatedJob = await response.json();
        onUpdate(updatedJob);
      } else {
        console.error('Failed to update job:', response.statusText);
      }
    } catch (error) {
      console.error('Error updating job:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3 text-center">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Edit Job</h3>
          <form onSubmit={handleSubmit} className="mt-2">
            <input
              type="text"
              name="title"
              value={editedJob.title}
              onChange={handleChange}
              className="mt-2 p-2 w-full border rounded"
              placeholder="Job Title"
            />
            <input
              type="text"
              name="tradeType"
              value={editedJob.tradeType}
              onChange={handleChange}
              className="mt-2 p-2 w-full border rounded"
              placeholder="Trade Type"
            />
            <input
              type="text"
              name="jobType"
              value={editedJob.jobType}
              onChange={handleChange}
              className="mt-2 p-2 w-full border rounded"
              placeholder="Job Type"
            />
            <div className="items-center px-4 py-3">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
              >
                Update Job
              </button>
            </div>
          </form>
          <button
            onClick={onClose}
            className="mt-3 px-4 py-2 bg-gray-300 text-gray-800 text-base font-medium rounded-md w-full shadow-sm hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
