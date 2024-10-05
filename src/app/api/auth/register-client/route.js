import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Client from '@/models/Client';
import bcrypt from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

const SECRET_KEY = process.env.JWT_SECRET;

export async function POST(request) {
  console.log('Register client route called');
  try {
    const { name, email, password } = await request.json();
    console.log('Received data:', { name, email });

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await connectToDatabase();
    console.log('Connected to database');

    const existingClient = await Client.findOne({ email });
    if (existingClient) {
      return NextResponse.json({ error: 'Email already in use' }, { status: 400 });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    const newClient = new Client({
      name,
      email,
      password: hashedPassword,
      clientId: uuidv4() // Generăm un nou UUID pentru clientId
    });

    console.log('Saving new client');
    await newClient.save();
    console.log('New client saved');

    const token = sign(
      { 
        id: newClient._id, 
        email: newClient.email, 
        name: newClient.name, 
        type: 'client',
        clientId: newClient.clientId
      },
      SECRET_KEY,
      { expiresIn: '1d' }
    );

    const response = NextResponse.json({ 
      message: 'Client registered successfully',
      token,
      user: {
        id: newClient._id,
        name: newClient.name,
        email: newClient.email,
        type: 'client',
        clientId: newClient.clientId
      }
    }, { status: 201 });

    response.cookies.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 86400, // 1 day in seconds
    });

    return response;
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ 
      error: 'Error registering client', 
      details: error.message,
    }, { status: 500 });
  }
}
