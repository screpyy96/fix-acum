"use client"

import { useEffect, useState } from 'react';
import { FaStar, FaTools, FaEnvelope, FaUser } from 'react-icons/fa';

export default function WorkerProfile({ params }) {
  const { workerId } = params;
  const [worker, setWorker] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchWorkerProfile = async () => {
      try {
        const response = await fetch(`/api/workers/${workerId}`);
        if (response.ok) {
          const data = await response.json();
          setWorker(data);
        } else {
          const errorData = await response.json();
          setError(errorData.error || 'Failed to fetch worker profile');
        }
      } catch (err) {
        setError('Error fetching worker profile');
      }
    };

    fetchWorkerProfile();
  }, [workerId]);

  if (error) {
    return <p className="text-red-500 text-center mt-10">{error}</p>;
  }

  if (!worker) {
    return <p className="text-center mt-10">Loading...</p>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="bg-blue-600 text-white p-4">
          <h1 className="text-3xl font-bold flex items-center">
            <FaUser className="mr-2" /> {worker.name}
          </h1>
        </div>
        <div className="p-6">
          <div className="mb-4 flex items-center">
            <FaEnvelope className="mr-2 text-gray-600" />
            <p className="text-gray-700">{worker.email}</p>
          </div>
          <div className="mb-4 flex items-center">
            <FaTools className="mr-2 text-gray-600" />
            <p className="text-gray-700 font-semibold">{worker.trade}</p>
          </div>
          <div className="mb-6 flex items-center">
            <FaStar className="mr-2 text-yellow-400" />
            <p className="text-gray-700">Average Rating: {worker.averageRating} / 5</p> {/* Afișează rating-ul mediu */}
          </div>
          
          {worker.skills && worker.skills.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Skills</h2>
              <div className="flex flex-wrap">
                {worker.skills.map((skill, index) => (
                  <span key={index} className="bg-blue-100 text-blue-800 text-sm font-medium mr-2 mb-2 px-2.5 py-0.5 rounded">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {worker.experience && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Experience</h2>
              <p className="text-gray-700">{worker.experience}</p>
            </div>
          )}
          
          {worker.completedJobs && worker.completedJobs > 0 && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Completed Jobs</h2>
              <p className="text-gray-700">{worker.completedJobs} jobs completed successfully</p>
            </div>
          )}
          
          {worker.availability && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Availability</h2>
              <p className="text-gray-700">{worker.availability}</p>
            </div>
          )}

          {/* Afișarea review-urilor */}
          {worker.reviews && worker.reviews.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Reviews</h2>
              {worker.reviews.map((review, index) => (
                <div key={index} className="border-t mt-2 pt-2">
                  <p><strong>Review:</strong> {review.review}</p>
                  <p><strong>Rating:</strong> {review.rating} / 5</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}