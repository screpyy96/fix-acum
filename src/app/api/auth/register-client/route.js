import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Client from '@/models/Client';
import bcrypt from 'bcryptjs';
import {uuidv4} from 'uuid';

export async function POST(request) {
  try {
    const { name, email, password, clientId } = await request.json();
    
    await connectToDatabase();
    
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
      clientId: clientId || uuidv4(), // Generează un nou UUID dacă clientId nu este furnizat
    });

    await newClient.save();

    return NextResponse.json({ message: 'Client registered successfully' }, { status: 201 });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: 'Error registering client' }, { status: 500 });
  }
}
