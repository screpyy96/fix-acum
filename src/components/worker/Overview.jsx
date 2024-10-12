// components/worker/Overview.js
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function Overview({ workerData }) {
  const [stats, setStats] = useState({
    activeJobs: 0,
    totalEarnings: 0,
    averageRating: 0,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    // Fetch active jobs
    const { data: activeJobs, error: jobsError } = await supabase
      .from('jobs')
      .select('id')
      .eq('worker_id', workerData.id)
      .eq('status', 'active');

    // Fetch total earnings
    const { data: earnings, error: earningsError } = await supabase
      .from('jobs')
      .select('price')
      .eq('worker_id', workerData.id)
      .eq('status', 'completed');

    // Fetch average rating
    const { data: ratings, error: ratingsError } = await supabase
      .from('reviews')
      .select('rating')
      .eq('worker_id', workerData.id);

    if (jobsError || earningsError || ratingsError) {
      console.error('Error fetching stats:', jobsError || earningsError || ratingsError);
    } else {
      setStats({
        activeJobs: activeJobs.length,
        totalEarnings: earnings.reduce((sum, job) => sum + job.price, 0),
        averageRating: ratings.length > 0 ? ratings.reduce((sum, review) => sum + review.rating, 0) / ratings.length : 0,
      });
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-100 p-4 rounded-lg">
          <h3 className="text-lg font-semibold">Active Jobs</h3>
          <p className="text-3xl font-bold">{stats.activeJobs}</p>
        </div>
        <div className="bg-green-100 p-4 rounded-lg">
          <h3 className="text-lg font-semibold">Total Earnings</h3>
          <p className="text-3xl font-bold">${stats.totalEarnings.toFixed(2)}</p>
        </div>
        <div className="bg-yellow-100 p-4 rounded-lg">
          <h3 className="text-lg font-semibold">Average Rating</h3>
          <p className="text-3xl font-bold">{stats.averageRating.toFixed(1)}/5</p>
        </div>
      </div>
    </div>
  );
}

