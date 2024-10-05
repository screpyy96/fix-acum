import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Job from '@/models/Job';
import { getCurrentUser } from '@/lib/auth';

export async function GET(request) {
  console.log('Client jobs API route called');
  try {
    const user = await getCurrentUser(request);
    console.log('Current user:', user);
    if (!user) {
      console.log('No user found');
      return NextResponse.json({ error: 'Unauthorized - No user found' }, { status: 401 });
    }
    if (user.type !== 'client') {
      console.log('User is not a client. User type:', user.type);
      return NextResponse.json({ error: 'Unauthorized - Not a client' }, { status: 401 });
    }
    await connectToDatabase();
    // Folosim user.id în loc de user.clientId
    const clientJobs = await Job.find({ clientId: user.id })
                                .sort({ createdAt: -1 })
                                .limit(10);
    console.log('Client jobs found:', clientJobs.length);
    return NextResponse.json(clientJobs);
  } catch (error) {
    console.error('Error in client jobs route:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}
