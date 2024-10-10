import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Job from '@/models/Job';
import { getCurrentUser } from '@/lib/auth';

export async function PATCH(request, { params }) {
  const { jobId } = params;
  const { review, rating } = await request.json(); // Asigură-te că primești rating-ul

  try {
    await connectToDatabase();
    const user = await getCurrentUser(request);

    if (!user || user.type !== 'client') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const job = await Job.findById(jobId);
    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    // Verificăm dacă jobul este deja completat
    if (job.status === 'completed') {
      return NextResponse.json({ error: 'Job is already completed' }, { status: 400 });
    }

    // Actualizăm statusul jobului și adăugăm review-ul
    job.status = 'completed';
    job.reviews = job.reviews || []; // Asigură-te că reviews este un array
    job.reviews.push({ clientId: user.id, review, rating }); // Adăugăm review-ul

    const updatedJob = await job.save(); // Salvează jobul actualizat

    return NextResponse.json(updatedJob, { status: 200 });
  } catch (error) {
    console.error('Error completing job:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}
