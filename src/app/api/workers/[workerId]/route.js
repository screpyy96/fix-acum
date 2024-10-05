import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Worker from '@/models/Worker';

export async function GET(request, { params }) {
  const { workerId } = params;
  console.log('Fetching worker profile with ID:', workerId);

  try {
    await connectToDatabase();
    const worker = await Worker.findById(workerId);

    if (!worker) {
      return NextResponse.json({ error: 'Worker not found' }, { status: 404 });
    }

    return NextResponse.json(worker, { status: 200 });
  } catch (error) {
    console.error('Error fetching worker profile:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}
