import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Worker from '@/models/Worker';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET;

export async function POST(request) {
  try {
    const { email, password } = await request.json();
    
    await connectToDatabase();
    
    const worker = await Worker.findOne({ email });
    if (!worker) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 400 });
    }

    const isPasswordValid = await bcrypt.compare(password, worker.password);
    if (!isPasswordValid) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 400 });
    }

    const token = jwt.sign({ id: worker._id, email: worker.email, type: 'worker' }, SECRET_KEY, { expiresIn: '1d' });

    const response = NextResponse.json({ message: 'Logged in successfully', token });
    response.cookies.set('auth_token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });

    return response;
  } catch (error) {
    return NextResponse.json({ error: 'Error logging in' }, { status: 500 });
  }
}
