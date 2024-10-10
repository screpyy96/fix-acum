import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Worker from '@/models/Worker';
import { getCurrentUser } from '@/lib/auth';
import jwt from 'jsonwebtoken';

export async function PATCH(request) {
  try {
    const user = await getCurrentUser(request);
    if (!user || user.type !== 'worker') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, email, trade } = await request.json();

    await connectToDatabase();

    const worker = await Worker.findByIdAndUpdate(
      user.id,
      { $set: { name, email, trade } },
      { new: true, runValidators: true }
    );

    if (!worker) {
      return NextResponse.json({ error: 'Worker not found' }, { status: 404 });
    }

    const token = jwt.sign(
      { id: worker._id, name: worker.name, email: worker.email, type: 'worker', trade: worker.trade },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    return NextResponse.json({ worker: worker.toObject(), token }, { status: 200 });
  } catch (error) {
    console.error('Error updating worker:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(request) {
  try {
    const user = await getCurrentUser(request);
    if (!user || user.type !== 'worker') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();
    const worker = await Worker.findById(user.id);
    if (!worker) {
      return NextResponse.json({ error: 'Worker not found' }, { status: 404 });
    }

    return NextResponse.json({ worker: worker.toObject() }, { status: 200 });
  } catch (error) {
    console.error('Error fetching worker:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
