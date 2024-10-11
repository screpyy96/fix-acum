'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import useAuth from '@/hooks/useAuth'
import { supabase } from '@/lib/supabase'
import JobList from '@/components/jobList/jobList'
import EditJobModal from '@/components/jobModal/jobModal'
import { FaPlus } from 'react-icons/fa'
import Link from 'next/link'

export default function ClientDashboard() {
  const { user } = useAuth()
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [editingJob, setEditingJob] = useState(null)
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.push('/login')
    }
  }, [user, router])

  useEffect(() => {
    if (user) {
      fetchClientData()
    }
  }, [user])

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        console.error("Session error:", error);
      } else if (session) {
        console.log("User is authenticated:", session.user);
      } else {
        console.log("No active session");
      }
    };
    checkSession();
  }, []);

  const fetchClientData = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('jobs')
        .select(`
          *,
          applicants:job_applications(
            id,
            status,
            worker:profiles(id, name)
          )
        `)
        .eq('client_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      console.log('Fetched jobs data:', data) // Adaugă acest log
      setJobs(data)
    } catch (error) {
      console.error('Error fetching client data:', error)
      setError('Failed to load data')
    } finally {
      setLoading(false)
    }
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
          // Eliminăm updated_at de aici
        })
        .eq('id', updatedJob.id);

      if (error) throw error;

      // Actualizăm starea locală
      setJobs(jobs.map(job => job.id === updatedJob.id ? { ...job, ...updatedJob } : job));
      setEditingJob(null); // Închide modalul

      console.log("Job updated successfully");
    } catch (error) {
      console.error('Error updating job:', error);
      // Aici puteți adăuga logica pentru a afișa o eroare utilizatorului
    }
  };

  const handleDeleteJob = async (jobId) => {
    try {
      const { error } = await supabase
        .from('jobs')
        .delete()
        .eq('id', jobId)

      if (error) throw error

      setJobs(jobs.filter(job => job.id !== jobId))
    } catch (error) {
      console.error('Error deleting job:', error)
      // Handle error (e.g., show error message to user)
    }
  }

  const handleAcceptWorker = async (jobId, workerId) => {
    console.log(`Attempting to accept worker ${workerId} for job ${jobId}`);
    try {
      // Actualizează statusul job-ului
      const { data: jobData, error: jobError } = await supabase
        .from('jobs')
        .update({ status: 'in-progress' })
        .eq('id', jobId)
        .select()

      if (jobError) throw jobError
      console.log('Job status updated:', jobData);

      // Actualizează statusul aplicației pentru job
      const { data: applicationData, error: applicationError } = await supabase
        .from('job_applications')
        .update({ status: 'accepted' })
        .eq('job_id', jobId)
        .eq('worker_id', workerId)
        .select()

      if (applicationError) throw applicationError
      console.log('Application status updated:', applicationData);

      // Reîmprospătează datele job-urilor
      await fetchClientData()
      console.log('Data refreshed');
    } catch (error) {
      console.error('Error accepting worker:', error)
      // Gestionează eroarea (ex: afișează un mesaj de eroare utilizatorului)
    }
  }

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Welcome, {user?.name}</h1>
          <Link 
            href="/"
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full flex items-center"
          >
            <FaPlus className="mr-2" /> New Job
          </Link>
        </div>
        <JobList 
          jobs={jobs} 
          onEditJob={handleEditJob} 
          onDeleteJob={handleDeleteJob}
          onAcceptWorker={handleAcceptWorker}
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