import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Inițializează clientul Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function POST(request, { params }) {
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

    const workerTrade = profile.trade;

    // Obține jobul
    const { data: job, error: jobError } = await supabase
      .from('jobs')
      .select('trade_type, status')
      .eq('id', jobId)
      .single();

    if (jobError || !job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    // Verifică dacă tradeType-ul muncitorului se potrivește cu cel al jobului
    if (workerTrade !== job.trade_type) {
      return NextResponse.json({ error: 'Your trade does not match the job requirements' }, { status: 400 });
    }

    // Verifică dacă muncitorul a aplicat deja la acest job
    const { data: existingApplication, error: existingAppError } = await supabase
      .from('job_applications')
      .select('*')
      .eq('job_id', jobId)
      .eq('worker_id', userId)
      .single();

    if (existingAppError && existingAppError.code !== 'PGRST116') { // PGRST116 = # NO_DATA_FOUND
      throw existingAppError;
    }

    if (existingApplication) {
      return NextResponse.json({ error: 'You have already applied to this job' }, { status: 400 });
    }

    // Adaugă aplicația muncitorului la job
    const { error: insertError } = await supabase
      .from('job_applications')
      .insert({
        job_id: jobId,
        worker_id: userId,
        status: 'pending',
        applied_at: new Date()
      });

    if (insertError) {
      throw insertError;
    }

    return NextResponse.json({ message: 'Applied to job successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error applying to job:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}