import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { getServerSession } from 'next-auth/next';

export async function PATCH(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    const { title, tradeType, jobType, description, budget, location } = await request.json();

    const { db } = await connectToDatabase();
    const jobsCollection = db.collection('jobs');

    // Verifică dacă jobul aparține utilizatorului curent
    const existingJob = await jobsCollection.findOne({
      _id: new ObjectId(id.toString()),
      clientId: session.user.id
    });

    if (!existingJob) {
      return NextResponse.json({ error: 'Job not found or you do not have permission to edit it' }, { status: 404 });
    }

    const updatedJob = {
      $set: {
        title,
        tradeType,
        jobType,
        description,
        budget,
        location,
        updatedAt: new Date()
      }
    };

    const result = await jobsCollection.updateOne(
      { _id: new ObjectId(id) },
      updatedJob
    );

    if (result.modifiedCount === 1) {
      const updatedJobDocument = await jobsCollection.findOne({ _id: new ObjectId(id) });
      return NextResponse.json(updatedJobDocument);
    } else {
      return NextResponse.json({ error: 'Failed to update job' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error updating job:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
