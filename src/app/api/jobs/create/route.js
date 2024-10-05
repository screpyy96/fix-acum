import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Job from '@/models/Job';
import { getCurrentUser } from '@/lib/auth';

export async function POST(request) {
  try {
    await connectToDatabase();
    const user = await getCurrentUser(request);

    if (!user || user.type !== 'client') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const jobData = await request.json();
    console.log('Received job data:', jobData);

    const newJob = new Job({
      ...jobData.job,
      clientId: user.id,
      isAuthorized: false, // Set a default value
      projectStage: 'Initial', // Set a default value or get from jobData
      startTime: new Date(jobData.job.startTime) || new Date(), // Use provided startTime or current date
    });

    console.log('Saving new job:', newJob);
    await newJob.save();
    console.log('Job saved successfully');

    return NextResponse.json({ message: 'Job created successfully', job: newJob });
  } catch (error) {
    console.error('Error creating job:', error);
    return NextResponse.json({ error: 'Error creating job', details: error.message }, { status: 500 });
  }
}
