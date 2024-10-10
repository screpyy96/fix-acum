import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Worker from '@/models/Worker';
import Job from '@/models/Job';

export async function GET(request, { params }) {
  const { workerId } = params;

  try {
    await connectToDatabase();

    const worker = await Worker.findById(workerId);
    if (!worker) {
      return NextResponse.json({ error: 'Worker not found' }, { status: 404 });
    }

    // Obține joburile completate ale lucrătorului
    const completedJobs = await Job.find({ 'applicants.workerId': workerId, status: 'completed' });

    // Extrage review-urile din joburile completate
    const reviews = completedJobs.flatMap(job => job.reviews);

    // Calculează suma rating-urilor și numărul total de review-uri
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = reviews.length > 0 ? (totalRating / reviews.length).toFixed(2) : 0;

    return NextResponse.json({ 
      ...worker.toObject(), 
      completedJobs: completedJobs.length, 
      reviews,
      averageRating // Adaugă rating-ul mediu
    });
  } catch (error) {
    console.error('Error fetching worker profile:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}
