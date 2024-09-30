import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Worker from '@/models/Worker';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET;

export async function POST(request) {
  try {
    const { email, password } = await request.json();
    console.log('Worker Login attempt:', { email, password });

    await connectToDatabase();
    
    const worker = await Worker.findOne({ email });
    if (!worker) {
      console.log('Worker not found');
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 400 });
    }
    
    const isPasswordValid = await bcrypt.compare(password, worker.password);
    if (!isPasswordValid) {
      console.log('Invalid password');
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 400 });
    }

    const token = jwt.sign(
      { 
        id: worker._id, 
        email: worker.email, 
        name: worker.name, 
        type: 'worker', // Ensure this is set to 'worker'
        trade: worker.trade 
      },
      SECRET_KEY,
      { expiresIn: '1d' }
    );

    const response = NextResponse.json({
      message: 'Logged in successfully',
      token,
      user: { 
        id: worker._id, 
        name: worker.name, 
        email: worker.email, 
        trade: worker.trade,
        type: 'worker' // Ensure this is set to 'worker'
      }
    });

    response.cookies.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 86400 // 1 day in seconds
    });

    return response;
  } catch (error) {
    console.error('Worker Login error:', error);
    return NextResponse.json({ error: 'Error logging in' }, { status: 500 });
  }
}