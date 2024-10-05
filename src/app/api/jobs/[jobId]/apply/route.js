import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Job from '@/models/Job';
import Worker from '@/models/Worker';
import { getCurrentUser } from '@/lib/auth';
import mongoose from 'mongoose';

export async function POST(request, { params }) {
  const { jobId } = params;
  console.log('Applying to job with ID:', jobId);

  try {
    await connectToDatabase();
    const user = await getCurrentUser(request);

    if (!user || user.type !== 'worker') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const job = await Job.findById(jobId);
    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    const worker = await Worker.findById(user.id);
    if (!worker) {
      return NextResponse.json({ error: 'Worker not found' }, { status: 404 });
    }

    if (worker.trade !== job.tradeType) {
      return NextResponse.json({ error: 'Your trade does not match the job requirements' }, { status: 400 });
    }

    // Check if the worker has already applied to this job
    if (job.applicants.some(applicant => applicant.workerId === worker._id.toString())) {
      return NextResponse.json({ error: 'You have already applied to this job' }, { status: 400 });
    }

    // Log înainte de adăugare
    console.log('Adding applicant:', {
      workerId: worker._id.toString(),
      appliedAt: new Date()
    });

    // Add the worker to the list of applicants
    const updatedJob = await Job.findByIdAndUpdate(
      jobId,
      {
        $push: {
          applicants: {
            workerId: worker._id.toString(), // Convertit la string
            appliedAt: new Date()
          }
        }
      },
      { new: true, runValidators: true }
    );

    if (!updatedJob) {
      return NextResponse.json({ error: 'Failed to update job' }, { status: 500 });
    }

    return NextResponse.json({ 
      message: 'Applied to job successfully',
      job: {
        _id: updatedJob._id,
        title: updatedJob.title,
        clientId: updatedJob.clientId
      }
    }, { status: 200 });

  } catch (error) {
    console.error('Error applying to job:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}