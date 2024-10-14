import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';

export default function Overview({ workerData }) {
  const [stats, setStats] = useState({
    appliedJobs: 0,
    activeJobs: 0,
    completedJobs: 0,
  });
  const [appliedJobsList, setAppliedJobsList] = useState([]);
  const [activeJobsList, setActiveJobsList] = useState([]);
  const [completedJobsList, setCompletedJobsList] = useState([]);
  const [activeTab, setActiveTab] = useState('applied');

  useEffect(() => {
    fetchStats();
  }, [workerData]);

  const fetchStats = async () => {
    if (!workerData || !workerData.id) return;

    const { data: appliedJobs, error: appliedJobsError } = await supabase
      .from('job_applications')
      .select('job_id')
      .eq('worker_id', workerData.id);

    if (appliedJobsError) {
      console.error('Error fetching applied jobs:', appliedJobsError);
      return;
    }

    const { data: jobsDetails, error: jobsDetailsError } = await supabase
      .from('jobs')
      .select('id, title, status, budget')
      .in('id', appliedJobs.map(job => job.job_id));

    if (jobsDetailsError) {
      console.error('Error fetching jobs details:', jobsDetailsError);
      return;
    }

    const activeJobs = jobsDetails.filter(job => job.status === 'in-progress');
    const completedJobs = jobsDetails.filter(job => job.status === 'completed');

    setStats({
      appliedJobs: appliedJobs.length,
      activeJobs: activeJobs.length,
      completedJobs: completedJobs.length,
    });

    setAppliedJobsList(jobsDetails);
    setActiveJobsList(activeJobs);
    setCompletedJobsList(completedJobs);
  };

  const TabButton = ({ name, label, count }) => (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`flex-1 py-3 px-4 text-sm font-medium rounded-lg transition-colors duration-200 ${
        activeTab === name
          ? 'bg-blue-600 text-white shadow-lg'
          : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
      }`}
      onClick={() => setActiveTab(name)}
    >
      {label} ({count})
    </motion.button>
  );

  const JobList = ({ jobs }) => (
    <ul className="space-y-4">
      {jobs.map(job => (
        <motion.li
          key={job.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="p-4 border rounded-lg shadow-md bg-white hover:shadow-lg transition-shadow duration-200"
        >
          <Link href={`/dashboard/job-details/${job.id}`} className="block">
            <h4 className="text-lg font-semibold text-gray-800">{job.title}</h4>
            <div className="flex justify-between items-center mt-2">
              <p className="text-sm text-gray-500">Status: {job.status}</p>
              <p className="text-sm font-medium text-blue-600">${job.budget}</p>
            </div>
          </Link>
        </motion.li>
      ))}
    </ul>
  );

  const chartData = [
    { name: 'Applied', value: stats.appliedJobs },
    { name: 'in-progress', value: stats.activeJobs },
    { name: 'Completed', value: stats.completedJobs },
  ];

  return (
    <div className="p-6 bg-gray-100 rounded-xl shadow-md">
      <h2 className="text-3xl font-bold mb-8 text-gray-800">Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-white p-6 rounded-xl shadow-lg"
        >
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Applied Jobs</h3>
          <p className="text-4xl font-bold text-blue-600">{stats.appliedJobs}</p>
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-white p-6 rounded-xl shadow-lg"
        >
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Active Jobs</h3>
          <p className="text-4xl font-bold text-blue-600">{stats.activeJobs}</p>
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-white p-6 rounded-xl shadow-lg"
        >
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Completed Jobs</h3>
          <p className="text-4xl font-bold text-blue-600">{stats.completedJobs}</p>
        </motion.div>
      </div>

      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">Job Statistics</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <XAxis dataKey="name" stroke="#888888" />
            <YAxis stroke="#888888" />
            <Tooltip />
            <Bar dataKey="value" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-8">
        <div className="flex space-x-4 mb-6">
          <TabButton name="applied" label="Applied Jobs" count={stats.appliedJobs} />
          <TabButton name="in-progress" label="Active Jobs" count={stats.activeJobs} />
          <TabButton name="completed" label="Completed Jobs" count={stats.completedJobs} />
        </div>
        <div className="mt-4">
          {activeTab === 'applied' && <JobList jobs={appliedJobsList} />}
          {activeTab === 'in-progress' && <JobList jobs={activeJobsList} />}
          {activeTab === 'completed' && <JobList jobs={completedJobsList} />}
        </div>
      </div>
    </div>
  );
}
