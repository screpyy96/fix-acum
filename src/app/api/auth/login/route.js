import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Worker from '@/models/Worker';
import Client from '@/models/Client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { sign } from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET;

export async function POST(request) {
  try {
    const { email, password } = await request.json();
    console.log('Login attempt:', { email, password });

    await connectToDatabase();

    // Încearcă să găsești utilizatorul în colecția Worker
    let user = await Worker.findOne({ email });
    let userType = 'worker';

    // Dacă nu găsește în Worker, încearcă în Client
    if (!user) {
      user = await Client.findOne({ email });
      userType = 'client';
    }

    if (!user) {
      console.log('User not found');
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 400 });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      console.log('Invalid password');
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 400 });
    }

    const token = sign(
      { 
        id: user._id, 
        email: user.email, 
        name: user.name, 
        type: userType,
        trade: user.trade || '', // Asigură-te că 'trade' este definit
      },
      SECRET_KEY,
      { expiresIn: '1d' }
    );

    const response = NextResponse.json({
      message: 'Logged in successfully',
      token,
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email, 
        trade: user.trade || '',
        type: userType,
      }
    });

    response.cookies.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 86400, // 1 day in seconds
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Error logging in' }, { status: 500 });
  }
}