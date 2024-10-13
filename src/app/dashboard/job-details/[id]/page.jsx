'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaTools, FaMoneyBillWave, FaMapMarkerAlt, FaClock, FaUser } from 'react-icons/fa';
import { createNotification } from '@/lib/notifications';

export default function JobDetails({ params }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [job, setJob] = useState(null);
  const [hasApplied, setHasApplied] = useState(false);
  const [isApplying, setIsApplying] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/login');
      } else {
        fetchJobDetails();
        checkApplicationStatus();
      }
    }
  }, [user, loading, router]);

  const fetchJobDetails = async () => {
    try {
      const { data, error } = await supabase
        .from('jobs')
        .select(`
          *,
          client:profiles!jobs_client_id_fkey(*)
        `)
        .eq('id', params.id)
        .single();

      if (error) throw error;
      setJob(data);
    } catch (error) {
      console.error('Error fetching job details:', error);
      toast.error('Failed to load job details');
    }
  };

  const checkApplicationStatus = async () => {
    try {
      const { data: existingApplications, error: checkError } = await supabase
        .from('job_applications')
        .select('*')
        .eq('job_id', params.id)
        .eq('worker_id', user.id);

      const existingApplication = existingApplications && existingApplications.length > 0 ? existingApplications[0] : null;

      if (checkError && checkError.code !== 'PGRST116') throw checkError;
      setHasApplied(!!existingApplication);
    } catch (error) {
      console.error('Error checking application status:', error);
    }
  };

  const handleApply = async () => {
    if (hasApplied) return;
    setIsApplying(true);
    try {
      // Verifică dacă utilizatorul a aplicat deja
      const { data: existingApplication, error: checkError } = await supabase
        .from('job_applications')
        .select('*')
        .eq('job_id', params.id)
        .eq('worker_id', user.id)
        .single()
        .then(response => {
          if (response.error && response.error.code === 'PGRST116') {
            // No result found, which is fine in this case
            return { data: null, error: null };
          }
          return response;
        });

      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError;
      }

      if (existingApplication) {
        toast.info('You have already applied to this job');
        setHasApplied(true);
        return;
      }

      // Aplicare la job
      const { data: applicationData, error: applicationError } = await supabase
        .from('job_applications')
        .insert([
          { job_id: params.id, worker_id: user.id, status: 'pending' }
        ])
        .select()
        .single();

      if (applicationError) throw applicationError;

      // Crearea notificării pentru client
      await createNotification(
        job.client_id,
        'new_application',
        `Un nou worker a aplicat la jobul tău: ${job.title}`
      );

      setHasApplied(true);
      toast.success('Application submitted successfully!');
    } catch (error) {
      console.error('Error applying for job:', error);
      toast.error('Failed to submit application: ' + error.message);
    } finally {
      setIsApplying(false);
    }
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (!user) return null;
  if (!job) return <div className="text-center py-10">Loading job details...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="p-6">
          <h1 className="text-3xl font-bold mb-4">{job.title}</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="flex items-center">
              <FaTools className="text-blue-500 mr-2" />
              <span><strong>Trade:</strong> {job.tradeType}</span>
            </div>
            <div className="flex items-center">
              <FaMoneyBillWave className="text-green-500 mr-2" />
              <span><strong>Budget:</strong> ${job.budget}</span>
            </div>
            <div className="flex items-center">
              <FaMapMarkerAlt className="text-red-500 mr-2" />
              <span><strong>Location:</strong> {job.location}</span>
            </div>
            <div className="flex items-center">
              <FaClock className="text-yellow-500 mr-2" />
              <span><strong>Posted:</strong> {new Date(job.created_at).toLocaleDateString()}</span>
            </div>
          </div>
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Description:</h2>
            <p className="text-gray-700">{job.description}</p>
          </div>
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Client Information:</h2>
            <div className="flex items-center">
              <FaUser className="text-indigo-500 mr-2" />
              <span>{job.client.full_name}</span>
            </div>
          </div>
          <div className="mt-6">
            <button
              onClick={handleApply}
              disabled={hasApplied || isApplying}
              className={`px-6 py-2 rounded-full text-white font-semibold ${
                hasApplied
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-500 hover:bg-blue-600'
              }`}
            >
              {hasApplied ? 'Applied' : isApplying ? 'Applying...' : 'Apply for This Job'}
            </button>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}
