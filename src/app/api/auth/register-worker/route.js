import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Worker from '@/models/Worker';
import bcrypt from 'bcryptjs';

export async function POST(request) {
  try {
    const { name, email, password, trade } = await request.json();
    
    await connectToDatabase();
    
    const existingWorker = await Worker.findOne({ email });
    if (existingWorker) {
      return NextResponse.json({ error: 'Email already in use' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newWorker = new Worker({
      name,
      email,
      password: hashedPassword,
      trade,
      type: 'worker' // Set the user type here
    });

    await newWorker.save();

    return NextResponse.json({
      message: 'Worker registered successfully',
      user: {
        id: newWorker._id,
        name: newWorker.name,
        email: newWorker.email,
        trade: newWorker.trade,
        type: 'worker' // Include the user type in the response
      }
    }, { status: 201 });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: 'Error registering worker' }, { status: 500 });
  }
}
