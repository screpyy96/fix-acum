import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Client from '@/models/Client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET;

export async function POST(request) {
  try {
    const { email, password } = await request.json();
    
    await connectToDatabase();
    
    const client = await Client.findOne({ email });
    if (!client) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 400 });
    }

    const isPasswordValid = await bcrypt.compare(password, client.password);
    if (!isPasswordValid) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 400 });
    }

    const token = jwt.sign({ id: client._id, email: client.email, type: 'client' }, SECRET_KEY, { expiresIn: '1d' });

    const response = NextResponse.json({ message: 'Logged in successfully', token });
    response.cookies.set('auth_token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });

    return response;
  } catch (error) {
    return NextResponse.json({ error: 'Error logging in' }, { status: 500 });
  }
}
