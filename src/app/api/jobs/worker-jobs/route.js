import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Job from '@/models/Job';
import { getCurrentUser } from '@/lib/auth';

export async function GET(request) {
  try {
    await connectToDatabase();
    const user = await getCurrentUser(request);

    if (!user || user.type !== 'worker') {
      console.log('Worker not found or not authorized');
      return NextResponse.json({ error: 'Worker not found or not authorized' }, { status: 401 });
    }
console.log('Worker:', user);
console.log('User trade:', user.trade);
    // Fetch jobs that match the worker's trade type
    const jobs = await Job.find({ tradeType: { $exists: true }, status: 'open' });

    console.log('Jobs found for worker:', jobs.length);
    return NextResponse.json(jobs);
  } catch (error) {
    console.error('Error fetching jobs for worker:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}