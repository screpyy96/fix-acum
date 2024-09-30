import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Job from '@/models/Job';
import { getCurrentUser } from '@/lib/auth';

export async function GET(request) {
  try {
    const user = await getCurrentUser(request);
    if (!user || user.type !== 'worker') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();
    
    // Presupunem că avem un câmp 'applicants' în modelul Job
    // care conține ID-urile workerilor care au aplicat
    const appliedJobs = await Job.find({ applicants: user.id })
                                 .sort({ createdAt: -1 })
                                 .limit(10); // Limităm la ultimele 10 joburi aplicate

    return NextResponse.json(appliedJobs);
  } catch (error) {
    console.error('Error fetching applied jobs:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
