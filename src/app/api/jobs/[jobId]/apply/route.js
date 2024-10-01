import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Job from '@/models/Job';
import Worker from '@/models/Worker';
import { verify } from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET;

export async function POST(request, { params }) {
  const { jobId } = params;

  // Extrage token-ul din cookies
  const token = request.cookies.get('auth_token')?.value;

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Verifică și decodează token-ul
    const decoded = verify(token, SECRET_KEY);
    if (decoded.type !== 'worker') {
      return NextResponse.json({ error: 'Only workers can apply to jobs' }, { status: 403 });
    }

    await connectToDatabase();

    // Găsește jobul
    const job = await Job.findById(jobId);
    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    // Găsește workerul
    const worker = await Worker.findById(decoded.id);
    if (!worker) {
      return NextResponse.json({ error: 'Worker not found' }, { status: 404 });
    }

    // Verifică dacă trade-ul workerului se potrivește cu trade-ul jobului
    if (worker.trade !== job.tradeType) {
      return NextResponse.json({ error: 'Your trade does not match the job requirements' }, { status: 400 });
    }

    // Verifică dacă workerul a aplicat deja la acest job
    if (job.applicants.includes(worker._id)) {
      return NextResponse.json({ error: 'You have already applied to this job' }, { status: 400 });
    }

    // Adaugă workerul la lista de aplicanți
    job.applicants.push(worker._id);
    await job.save();

    return NextResponse.json({ message: 'Applied to job successfully' }, { status: 200 });

  } catch (error) {
    console.error('Error applying to job:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}