import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Job from '@/models/Job';
import { getCurrentUser } from '@/lib/auth';

export async function PATCH(request, { params }) {
  const { id } = params;

  try {
    await connectToDatabase();

    const user = await getCurrentUser(request);
    if (!user || user.type !== 'client') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const updatedJob = await Job.findOneAndUpdate(
      {
        _id: id,
        clientId: user.id
      },
      {
        status: 'closed'
      },
      { new: true }
    );

    if (!updatedJob) {
      return NextResponse.json({ error: 'Job not found or not authorized to close' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Job closed successfully', job: updatedJob }, { status: 200 });
  } catch (error) {
    console.error('Error closing job:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const { id } = params;

  try {
    await connectToDatabase();

    const user = await getCurrentUser(request);
    if (!user || user.type !== 'client') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const deletedJob = await Job.findOneAndDelete({
      _id: id,
      clientId: user.id,
      status: 'closed' // Asigură-te că doar joburile închise pot fi șterse
    });

    if (!deletedJob) {
      return NextResponse.json({ error: 'Job not found, not closed, or not authorized to delete' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Job deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting job:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}
