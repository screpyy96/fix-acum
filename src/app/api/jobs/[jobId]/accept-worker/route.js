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

    // Verifică dacă utilizatorul este un client
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single();

    if (profileError || profile.role !== 'client') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Obține workerId din corpul cererii
    const { workerId } = await request.json();

    // Obține jobul
    const { data: job, error: jobError } = await supabase
      .from('jobs')
      .select('status, title')
      .eq('id', jobId)
      .single();

    if (jobError || !job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    // Verifică dacă jobul este deschis
    if (job.status !== 'open') {
      return NextResponse.json({ error: 'Cannot accept workers for jobs that are not open' }, { status: 400 });
    }

    // Actualizează statusul aplicației muncitorului
    const { error: updateError } = await supabase
      .from('job_applications')
      .update({ status: 'accepted' })
      .eq('job_id', jobId)
      .eq('worker_id', workerId);

    if (updateError) {
      throw updateError;
    }

    // Actualizează statusul jobului
    const { error: jobUpdateError } = await supabase
      .from('jobs')
      .update({ status: 'in-progress' })
      .eq('id', jobId);

    if (jobUpdateError) {
      throw jobUpdateError;
    }

    // Creează notificarea pentru muncitor
    const { data: notificationData, error: notificationError } = await supabase
      .from('notifications')
      .insert({
        user_id: workerId,
        message: `You have been accepted for the job: ${job.title}.`,
        created_at: new Date()
      });

    if (notificationError) {
      throw notificationError;
    }

    return NextResponse.json({ message: 'Worker accepted successfully', notification: notificationData }, { status: 200 });
  } catch (error) {
    console.error('Error accepting worker:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}