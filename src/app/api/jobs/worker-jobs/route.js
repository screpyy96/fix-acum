import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Job from '@/models/Job';
import Worker from '@/models/Worker';
import { verify } from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET;

export async function GET(request) {
  const token = request.cookies.get('auth_token')?.value;

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const decoded = verify(token, SECRET_KEY);
    if (decoded.type !== 'worker') {
      return NextResponse.json({ error: 'Only workers can view available jobs' }, { status: 403 });
    }

    await connectToDatabase();

    const worker = await Worker.findById(decoded.id);
    if (!worker) {
      return NextResponse.json({ error: 'Worker not found' }, { status: 404 });
    }

    // Găsește joburile care sunt deschise și se potrivesc cu trade-ul workerului
    const jobs = await Job.find({
      tradeType: worker.trade,
      status: 'open',
    }).sort({ createdAt: -1 });

    return NextResponse.json(jobs, { status: 200 });
  } catch (error) {
    console.error('Error fetching worker jobs:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}