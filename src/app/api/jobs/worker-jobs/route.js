import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import Worker from '@/models/Worker'; // Asigurați-vă că importați modelul Worker
import { getCurrentUser } from '@/lib/auth';

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

    // Verifică dacă utilizatorul este un muncitor
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single();

    if (profileError || profile.role !== 'worker') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Obține joburile muncitorului
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

export async function POST(request, { params }) {
  const { jobId } = params;
  const { workerId } = await request.json(); // Obțineți workerId din corpul cererii

  try {
    await connectToDatabase();
    const user = await getCurrentUser(request);

    if (!user || user.type !== 'client') {
      return NextResponse.json({ error: 'Client not found or not authorized' }, { status: 401 });
    }

    const job = await Job.findById(jobId);
    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    const worker = await Worker.findById(workerId);
    if (!worker) {
      return NextResponse.json({ error: 'Worker not found' }, { status: 404 });
    }

    // Verificăm dacă workerul se potrivește cu tradeType-ul jobului
    if (worker.trade !== job.tradeType) {
      return NextResponse.json({ error: 'Worker trade does not match job requirements' }, { status: 400 });
    }

    // Actualizăm statusul aplicantului și al jobului
    const updatedApplicants = job.applicants.map(app => 
      app.workerId.toString() === workerId ? { ...app, status: 'accepted' } : app
    );

    job.applicants = updatedApplicants;
    job.status = 'in-progress'; // Schimbăm statusul jobului

    const savedJob = await job.save();

    // Trimiteți notificarea muncitorului
    const notification = new Notification({
      userId: worker._id,
      message: `You have been accepted for the job: ${job.title}.`,
    });

    await notification.save();

    return NextResponse.json({ message: 'Worker accepted successfully', job: savedJob }, { status: 200 });
  } catch (error) {
    console.error('Error accepting worker:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}