import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Job from '@/models/Job';
import { getCurrentUser } from '@/lib/auth';

export async function GET(request) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (user.type !== 'worker') {
      return NextResponse.json({ error: 'Unauthorized - Not a worker' }, { status: 401 });
    }

    await connectToDatabase();
    
    // Fetch jobs that match the worker's trade and are still open
    const workerJobs = await Job.find({ 
      tradeType: user.trade,
      status: 'open'
    }).sort({ createdAt: -1 }).limit(10);

    return NextResponse.json(workerJobs);
  } catch (error) {
    console.error('Error in worker jobs route:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}