import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Inițializează clientul Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function GET(request) {
  try {
    // Obține sesiunea utilizatorului
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;

    // Verifică dacă utilizatorul este un client
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single();

    if (profileError || profile.role !== 'client') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Obține joburile clientului
    const { data: jobs, error: jobsError } = await supabase
      .from('jobs')
      .select('*')
      .eq('client_id', userId)
      .order('created_at', { ascending: false });

    if (jobsError) {
      throw jobsError;
    }

    // Pentru fiecare job, obține aplicanții
    const jobsWithApplicants = await Promise.all(jobs.map(async (job) => {
      const { data: applicants, error: applicantsError } = await supabase
        .from('job_applications')
        .select('worker_id, status, applied_at, profiles(name, email, trade)')
        .eq('job_id', job.id);

      if (applicantsError) {
        throw applicantsError;
      }

      return {
        ...job,
        applicants: applicants.map(app => ({
          workerId: app.worker_id,
          status: app.status,
          appliedAt: app.applied_at,
          workerDetails: app.profiles
        }))
      };
    }));

    return NextResponse.json(jobsWithApplicants, { status: 200 });
  } catch (error) {
    console.error('Error in client jobs with applicants route:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}