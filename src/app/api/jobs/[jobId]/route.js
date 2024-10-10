import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Job from '@/models/Job';

export async function GET(request, { params }) {
  const { jobId } = params;
  console.log('Fetching job with ID:', jobId);

  try {
    await connectToDatabase();
    const job = await Job.findById(jobId).populate('applicants._id', 'name email trade');

    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    return NextResponse.json(job, { status: 200 });
  } catch (error) {
    console.error('Error fetching job details:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}