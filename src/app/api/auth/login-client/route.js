import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Client from '@/models/Client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET;

export async function POST(request) {
  try {
    const { email, password } = await request.json();
    console.log('Client Login attempt:', { email, password });

    await connectToDatabase();
    
    const client = await Client.findOne({ email });
    if (!client) {
      console.log('Client not found');
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 400 });
    }
    
    const isPasswordValid = await bcrypt.compare(password, client.password);
    if (!isPasswordValid) {
      console.log('Invalid password');
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 400 });
    }

    const token = jwt.sign(
      { 
        id: client._id, 
        email: client.email, 
        name: client.name, 
        type: 'client', // Ensure this is set to 'client'
        trade: client.trade 
      },
      SECRET_KEY,
      { expiresIn: '1d' }
    );

    const response = NextResponse.json({
      message: 'Logged in successfully',
      token,
      user: { 
        id: client._id, 
        name: client.name, 
        email: client.email, 
        trade: client.trade,
        type: 'client' // Ensure this is set to 'client'
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
    console.error('Client Login error:', error);
    return NextResponse.json({ error: 'Error logging in' }, { status: 500 });
  }
}