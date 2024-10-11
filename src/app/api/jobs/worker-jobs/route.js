import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request) {
  try {
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single();

    if (profileError || profile.role !== 'worker') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: applications, error: applicationsError } = await supabase
      .from('job_applications')
      .select('job_id, status, jobs(title, description, trade_type, job_type, status)')
      .eq('worker_id', userId);

    if (applicationsError) {
      throw applicationsError;
    }

    const workerJobs = applications.map(app => ({
      jobId: app.job_id,
      status: app.status,
      jobDetails: app.jobs
    }));

    return NextResponse.json(workerJobs, { status: 200 });
  } catch (error) {
    console.error('Error in worker jobs route:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}