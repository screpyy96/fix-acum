'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import useAuth from '@/hooks/useAuth'
import { supabase } from '@/lib/supabase'
import JobList from '@/components/jobList/jobList'
import EditJobModal from '@/components/jobModal/jobModal'
import { FaPlus, FaChartBar, FaUser, FaCheckCircle } from 'react-icons/fa'

import { createNotification } from '@/lib/notifications'
import NotificationBell from '@/components/notifications/notifications'
import NotificationsList from '@/components/notifications/notificationList'
import { toast } from 'react-toastify'

export default function ClientDashboard() {
  const { user } = useAuth()
  const [jobs, setJobs] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [editingJob, setEditingJob] = useState(null)
  const [stats, setStats] = useState({ totalJobs: 0, activeJobs: 0, completedJobs: 0 })
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.push('/login')
    } else {
      fetchClientData()
    }
  }, [user, router])

  const fetchClientData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data: jobsData, error: jobsError } = await supabase
      .from('jobs')
      .select(`
        *,
        job_applications(
          *,
          worker:profiles(*)
        )
      `)
      .eq('client_id', user.id)
      .order('created_at', { ascending: false });

      if (jobsError) throw jobsError;

      const jobsWithReviewStatus = jobsData.map(job => ({
        ...job,
        has_review: job.reviews && job.reviews.length > 0
      }));

      setJobs(jobsWithReviewStatus);
      updateStats(jobsData);
    } catch (error) {
      console.error('Error fetching client data:', error);
      setError('Failed to load data');
    } finally {
      setIsLoading(false);
    }
  }

  const updateStats = (jobsData) => {
    const totalJobs = jobsData.length
    const activeJobs = jobsData.filter(job => job.status === 'in-progress').length
    const completedJobs = jobsData.filter(job => job.status === 'completed').length
    setStats({ totalJobs, activeJobs, completedJobs })
  }

  const handleEditJob = (job) => {
    setEditingJob(job)
  }

  const handleUpdateJob = async (updatedJob) => {
    try {
      const { error } = await supabase
        .from('jobs')
        .update({
          title: updatedJob.title,
          description: updatedJob.description,
          budget: updatedJob.budget
        })
        .eq('id', updatedJob.id)

      if (error) throw error

      setJobs(jobs.map(job => job.id === updatedJob.id ? { ...job, ...updatedJob } : job))
      setEditingJob(null)
      fetchClientData() // Refresh data to update stats
    } catch (error) {
      console.error('Error updating job:', error)
    }
  }

  const handleDeleteJob = async (jobId) => {
    if (!confirm('Are you sure you want to delete this job? This action cannot be undone.')) {
      return;
    }

    setIsLoading(true);
    try {
      // Verifică dacă jobul aparține clientului curent
      const { data: jobData, error: jobError } = await supabase
        .from('jobs')
        .select('client_id, status')
        .eq('id', jobId)
        .single();

      if (jobError) throw jobError;

      if (jobData.client_id !== user.id) {
        throw new Error('You are not authorized to delete this job');
      }

      if (jobData.status !== 'open') {
        throw new Error('You can only delete open jobs');
      }

      // Șterge mai întâi aplicațiile asociate
      const { error: applicationsError } = await supabase
        .from('job_applications')
        .delete()
        .eq('job_id', jobId);

      if (applicationsError) {
        console.error('Error deleting job applications:', applicationsError);
        // Continuăm cu ștergerea jobului chiar dacă ștergerea aplicațiilor eșuează
      }

      // Apoi șterge jobul
      const { error: jobDeleteError } = await supabase
        .from('jobs')
        .delete()
        .eq('id', jobId);

      if (jobDeleteError) throw jobDeleteError;

      setJobs(jobs.filter(job => job.id !== jobId));
      fetchClientData(); // Refresh data to update stats
      toast.success('Job deleted successfully');
    } catch (error) {
      console.error('Error deleting job:', error.message);
      toast.error(`Failed to delete job: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  }

  const handleAcceptWorker = async (jobId, workerId) => {
    try {
      // Actualizare status job
      await supabase
        .from('jobs')
        .update({ status: 'in-progress' })
        .eq('id', jobId);

      // Actualizare status aplicație
      await supabase
        .from('job_applications')
        .update({ status: 'accepted' })
        .eq('job_id', jobId)
        .eq('worker_id', workerId);

      // Obținere detalii job pentru titlu
      const { data: jobData, error: jobError } = await supabase
        .from('jobs')
        .select('title')
        .eq('id', jobId)
        .single();

      if (jobError) throw jobError;

      // Crearea notificării pentru worker
      await createNotification(
        workerId,
        'application_accepted',
        `Aplicația ta pentru jobul "${jobData.title}" a fost acceptată!`
      );

      fetchClientData(); // Refresh data to update job statuses and stats
    } catch (error) {
      console.error('Error accepting worker:', error);
      // Aici puteți adăuga logica pentru afișarea unei erori către utilizator
    }
  }

  const handleJobUpdate = () => {
    fetchClientData();
  };

  const handleCompleteJob = async (jobId) => {
    try {
      const { error } = await supabase
        .from('jobs')
        .update({ status: 'completed' })
        .eq('id', jobId);

      if (error) throw error;

      fetchClientData(); // Reîmprospătăm datele pentru a actualiza starea joburilor
    } catch (error) {
      console.error('Error completing job:', error);
      // Adăugați o notificare de eroare pentru utilizator
    }
  };

  const handleReviewWorker = async (jobId, workerId, rating, comment) => {
    try {
      console.log('Submitting review to Supabase:', { jobId, workerId, rating, comment }); // Pentru debugging

      const { data, error } = await supabase
        .from('reviews')
        .insert({
          job_id: jobId,
          worker_id: workerId,
          client_id: user.id, // Presupunând că ai acces la ID-ul clientului curent
          rating: rating,
          comment: comment,
          created_at: new Date().toISOString()
        });

      if (error) throw error;

      console.log('Review submitted successfully:', data); // Pentru debugging

      // Creăm o notificare pentru worker
      await createNotification(
        workerId,
        'new_review',
        `You've received a new review for the job you completed.`
      );

      fetchClientData(); // Reîmprospătăm datele pentru a include noul review
      toast.success('Review submitted successfully!');
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error('Failed to submit review: ' + error.message);
    }
  };

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Welcome, {user?.name}</h1>
            <p className="text-gray-600">Manage your projects and workers</p>
          </div>
          <NotificationBell />
        </div>

        <NotificationsList /> {/* Add the NotificationsList component here */}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center">
              <FaChartBar className="text-blue-500 mr-2" />
              <h2 className="text-xl font-semibold">Total Jobs</h2>
            </div>
            <p className="text-3xl font-bold mt-2">{stats.totalJobs}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center">
              <FaUser className="text-green-500 mr-2" />
              <h2 className="text-xl font-semibold">Active Jobs</h2>
            </div>
            <p className="text-3xl font-bold mt-2">{stats.activeJobs}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center">
              <FaCheckCircle className="text-purple-500 mr-2" />
              <h2 className="text-xl font-semibold">Completed Jobs</h2>
            </div>
            <p className="text-3xl font-bold mt-2">{stats.completedJobs}</p>
          </div>
        </div>

        <JobList 
          jobs={jobs} 
          onEditJob={handleEditJob} 
          onDeleteJob={handleDeleteJob}
          onAcceptWorker={handleAcceptWorker}
          onCompleteJob={handleCompleteJob}
          onReviewWorker={handleReviewWorker}
        />
        {editingJob && (
          <EditJobModal 
            job={editingJob} 
            onClose={() => setEditingJob(null)} 
            onUpdate={handleUpdateJob} 
          />
        )}
      </div>
    </div>
  )
}
