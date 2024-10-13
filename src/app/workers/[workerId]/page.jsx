"use client"

import { useEffect, useState } from 'react';
import { FaStar, FaTools, FaEnvelope, FaUser, FaBriefcase, FaCalendarAlt, FaPhone } from 'react-icons/fa';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function WorkerProfile() {
  const { workerId } = useParams();
  const [worker, setWorker] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWorkerProfile = async () => {
      try {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', workerId)
          .single();

        if (profileError) throw profileError;

        const { data: reviews, error: reviewsError } = await supabase
          .from('reviews')
          .select(`
            id,
            rating,
            comment,
            created_at,
            job:jobs(id, title),
            client:profiles!reviews_client_id_fkey(id, name)
          `)
          .eq('worker_id', workerId);

        if (reviewsError) throw reviewsError;

        // Calculăm average rating
        let averageRating = 0;
        if (reviews && reviews.length > 0) {
          const totalRating = reviews.reduce((sum, review) => sum + (review.rating || 0), 0);
          averageRating = totalRating / reviews.length;
        }

        console.log('Worker profile:', JSON.stringify(profile, null, 2));
        console.log('Worker reviews:', JSON.stringify(reviews, null, 2));
        console.log('Average rating:', averageRating);

        setWorker({ ...profile, reviews, averageRating });
      } catch (err) {
        console.error('Error fetching worker profile:', err);
        setError('Error fetching worker profile');
      }
    };

    if (workerId) {
      fetchWorkerProfile();
    }
  }, [workerId]); // Dependența este workerId



  if (error) {
    return <p className="text-red-500 text-center mt-10">{error}</p>;
  }

  if (!worker) {
    return <p className="text-center mt-10">Loading...</p>;
  }
  console.log(worker);
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold flex items-center">
              <FaUser className="mr-2" /> {worker.name}
            </h1>
            {worker && worker.averageRating != null && (
              <div className="flex items-center">
                <FaStar className="text-yellow-300 mr-1" />
                <span className="text-xl font-semibold">
                  {worker.averageRating.toFixed(1)}
                </span>
              </div>
            )}
          </div>
          <p className="mt-2 flex items-center">
            <FaTools className="mr-2" /> {worker.trade}
          </p>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
              <p className="flex items-center mb-2">
                <FaEnvelope className="mr-2 text-gray-600" /> {worker.email}
              </p>
              {worker.phone && (
                <p className="flex items-center mb-2">
                  <FaPhone className="mr-2 text-gray-600" /> {worker.phone}
                </p>
              )}
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-4">Work Information</h2>
              <p className="flex items-center mb-2">
                <FaBriefcase className="mr-2 text-gray-600" /> {worker.completedJobs} jobs completed
              </p>
              <p className="flex items-center mb-2">
                <FaCalendarAlt className="mr-2 text-gray-600" /> {worker.availability}
              </p>
            </div>
          </div>
          
          {worker.skills && worker.skills.length > 0 && (
            <div className="mt-6">
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
            <div className="mt-6">
              <h2 className="text-xl font-semibold mb-2">Experience</h2>
              <p className="text-gray-700">{worker.experience}</p>
            </div>
          )}

          {worker.reviews && worker.reviews.length > 0 ? (
            <div className="mt-6">
              <h3 className="text-xl font-semibold mb-4">Reviews</h3>
              {worker.reviews.map((review, index) => (
                <div key={index} className="bg-white p-4 rounded-lg shadow mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <FaStar
                          key={i}
                          className={i < Math.round(review.rating || 0) ? "text-yellow-400" : "text-gray-300"}
                        />
                      ))}
                      <span className="ml-2 text-gray-600">
                        {review.rating != null ? review.rating.toFixed(1) : 'N/A'} / 5
                      </span>
                    </div>
                    <span className="text-sm text-gray-500">
                      {new Date(review.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-700 mb-2">{review.comment || 'No comment provided.'}</p>
                  <div className="text-sm text-gray-600">
                    <p>Client: {review.client?.name || 'Anonymous'}</p>
                    <p>Job: {review.job?.title || 'Untitled Job'}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-6 text-gray-600">No reviews yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
