import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Job from '@/models/Job';
import Worker from '@/models/Worker'; // Asigurați-vă că importați modelul Worker
import { getCurrentUser } from '@/lib/auth';

export async function GET(request) {
  try {
    await connectToDatabase();
    const user = await getCurrentUser(request);

    if (!user || user.type !== 'worker') {
      console.log('Worker not found or not authorized');
      return NextResponse.json({ error: 'Worker not found or not authorized' }, { status: 401 });
    }

    const jobs = await Job.find({ tradeType: user.trade });

    const newJobs = [];
    const activeJobs = [];
    const appliedJobs = [];
    const completedJobs = [];

    // Folosim Promise.all pentru a aștepta toate promisiunile
    await Promise.all(jobs.map(async job => {
      const hasApplied = job.applicants.some(applicant => applicant.workerId.toString() === user.id);
      
      if (hasApplied) {
        const applicant = job.applicants.find(applicant => applicant.workerId.toString() === user.id);
        
        if (applicant.status === 'accepted') {
          // Verificăm dacă jobul este completat
          if (job.status === 'completed') {
            completedJobs.push(job); // Adăugăm jobul la completedJobs
          } else {
            activeJobs.push(job); // Adăugăm jobul la activeJobs doar dacă nu este completat
          }
        } else {
          appliedJobs.push(job); // Jobul este aplicat, dar nu acceptat
        }
      } else {
        // Dacă lucrătorul nu a aplicat, clasificăm joburile în funcție de status
        if (job.status === 'open') {
          newJobs.push(job);
        } else if (job.status === 'completed') {
          completedJobs.push(job); // Joburile completate sunt acum adăugate la completedJobs
        }
      }
    }));

    return NextResponse.json({ newJobs, activeJobs, appliedJobs, completedJobs });
  } catch (error) {
    console.error('Error fetching jobs for worker:', error);
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
