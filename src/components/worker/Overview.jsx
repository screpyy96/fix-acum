// components/worker/Overview.js
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function Overview({ workerData }) {
  const [stats, setStats] = useState({
    appliedJobs: 0,
    activeJobs: 0,
    completedJobs: 0,
  });

  useEffect(() => {
    fetchStats();
  }, [workerData]);

  const fetchStats = async () => {
    if (!workerData || !workerData.id) return;

    // Fetch applied jobs
    const { data: appliedJobs, error: appliedJobsError } = await supabase
      .from('job_applications')
      .select('job_id')
      .eq('worker_id', workerData.id);

    if (appliedJobsError) {
      console.error('Error fetching applied jobs:', appliedJobsError);
      return;
    }

    // Fetch jobs details
    const { data: jobsDetails, error: jobsDetailsError } = await supabase
      .from('jobs')
      .select('id, status')
      .in('id', appliedJobs.map(job => job.job_id));

    if (jobsDetailsError) {
      console.error('Error fetching jobs details:', jobsDetailsError);
      return;
    }

    const activeJobs = jobsDetails.filter(job => job.status === 'active');
    const completedJobs = jobsDetails.filter(job => job.status === 'completed');

    setStats({
      appliedJobs: appliedJobs.length,
      activeJobs: activeJobs.length,
      completedJobs: completedJobs.length,
    });
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-purple-100 p-4 rounded-lg">
          <h3 className="text-lg font-semibold">Applied Jobs</h3>
          <p className="text-3xl font-bold">{stats.appliedJobs}</p>
        </div>
        <div className="bg-blue-100 p-4 rounded-lg">
          <h3 className="text-lg font-semibold">Active Jobs</h3>
          <p className="text-3xl font-bold">{stats.activeJobs}</p>
        </div>
        <div className="bg-green-100 p-4 rounded-lg">
          <h3 className="text-lg font-semibold">Completed Jobs</h3>
          <p className="text-3xl font-bold">{stats.completedJobs}</p>
        </div>
      </div>
    </div>
  );
}
