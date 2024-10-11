import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Inițializează clientul Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function GET(request, { params }) {
  const { jobId } = params;

  try {
    // Obține sesiunea utilizatorului
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;

    // Verifică dacă utilizatorul este un muncitor
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role, trade')
      .eq('id', userId)
      .single();

    if (profileError || profile.role !== 'worker') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Obține jobul
    const { data: job, error: jobFetchError } = await supabase
      .from('jobs')
      .select('*')
      .eq('id', jobId)
      .single();

    if (jobFetchError || !job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    // Verifică dacă muncitorul se potrivește cu tradeType-ul jobului
    if (profile.trade !== job.trade_type) {
      return NextResponse.json({ error: 'Your trade does not match the job requirements' }, { status: 400 });
    }

    // Inserează aplicația muncitorului la job
    const { data: application, error: applicationError } = await supabase
      .from('job_applications')
      .insert({
        job_id: jobId,
        worker_id: userId,
        status: 'pending',
        applied_at: new Date()
      })
      .select()
      .single();

    if (applicationError) {
      throw applicationError;
    }

    return NextResponse.json({ message: 'Applied to job successfully', application }, { status: 200 });
  } catch (error) {
    console.error('Error in job route:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}