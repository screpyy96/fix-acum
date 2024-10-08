import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Job from '@/models/Job';
import { getCurrentUser } from '@/lib/auth';
import Worker from '@/models/Worker';
import Notification from '@/models/Notification';

export async function POST(request, { params }) {
  const { jobId } = params;
  const { workerId } = await request.json();

  console.log('Received workerId:', workerId); // Log pentru a verifica ID-ul

  try {
    await connectToDatabase();  // Conectare la baza de date
    const user = await getCurrentUser(request);

    if (!user || user.type !== 'client') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const job = await Job.findById(jobId);
    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    // Verificăm dacă workerul a aplicat la job
    const applicant = job.applicants.find(applicant => applicant.workerId === workerId);
    if (!applicant) {
      return NextResponse.json({ error: 'Worker has not applied for this job' }, { status: 400 });
    }

    // Verificăm dacă tradeType-ul workerului se potrivește cu cel al jobului
    const worker = await Worker.findById(workerId);
    if (!worker) {
      return NextResponse.json({ error: 'Worker not found' }, { status: 404 });
    }

    if (worker.trade !== job.tradeType) {
      return NextResponse.json({ error: 'Worker trade does not match job requirements' }, { status: 400 });
    }

    // Actualizează jobul pentru a accepta workerul
    const updatedApplicants = job.applicants.map(applicant => 
      applicant.workerId === workerId ? { ...applicant, accepted: true } : applicant
    );
    job.applicants = updatedApplicants;

    console.log('Before saving job:', job); // Log pentru a verifica jobul înainte de salvare

    const savedJob = await job.save();  // Salvează modificările

    console.log('Saved job:', savedJob); // Verifică dacă jobul a fost salvat corect

    if (!savedJob) {
      return NextResponse.json({ error: 'Failed to save the job' }, { status: 500 });
    }

    // După ce ai acceptat workerul, trimite notificarea
    const notification = new Notification({
      userId: worker._id, // ID-ul workerului
      message: `You have been accepted for the job: ${job.title}.`,
    });

    await notification.save();

    return NextResponse.json({ message: 'Worker accepted successfully', job: savedJob }, { status: 200 });
  } catch (error) {
    console.error('Error accepting worker:', error); // Log detaliat în caz de eroare
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}
