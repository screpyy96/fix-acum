import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Worker from '@/models/Worker';
import bcrypt from 'bcryptjs';

export async function POST(request) {
  try {
    const { name, email, password } = await request.json();
    
    await connectToDatabase();
    
    const existingWorker = await Worker.findOne({ email });
    if (existingWorker) {
      return NextResponse.json({ error: 'Email already in use' }, { status: 400 });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    const newWorker = new Worker({
      name,
      email,
      password: hashedPassword,
    });

    await newWorker.save();

    return NextResponse.json({ message: 'Worker registered successfully' }, { status: 201 });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: 'Error registering worker' }, { status: 500 });
  }
}
