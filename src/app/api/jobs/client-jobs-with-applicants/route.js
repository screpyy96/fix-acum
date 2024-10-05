import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Job from '@/models/Job';
import Worker from '@/models/Worker'; // Importă modelul Worker
import { getCurrentUser } from '@/lib/auth';

export async function GET(request) {
  console.log('Client jobs with applicants API route called');
  try {
    await connectToDatabase();

    const user = await getCurrentUser(request);
    if (!user || user.type !== 'client') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Obține joburile clientului
    const clientJobs = await Job.find({ clientId: user.id })
                                .sort({ createdAt: -1 });

    // Populează informațiile despre aplicanți
    const jobsWithApplicants = await Promise.all(clientJobs.map(async (job) => {
      const applicants = await Worker.find({ _id: { $in: job.applicants.map(applicant => applicant.workerId) } }, 'name email trade');
      return {
        ...job.toObject(),
        applicants: applicants // Adaugă informațiile despre aplicanți
      };
    }));

    console.log('Client jobs with applicants found:', jobsWithApplicants.length);
    return NextResponse.json(jobsWithApplicants);
  } catch (error) {
    console.error('Error in client jobs with applicants route:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}
