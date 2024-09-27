import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Client from '@/models/Client';
import bcrypt from 'bcryptjs';

export async function POST(request) {
  try {
    const { name, email, password } = await request.json();
    
    await connectToDatabase();
    
    const existingClient = await Client.findOne({ email });
    if (existingClient) {
      return NextResponse.json({ error: 'Email already in use' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    const newClient = new Client({
      name,
      email,
      password: hashedPassword,
    });

    await newClient.save();

    return NextResponse.json({ message: 'Client registered successfully' }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Error registering client' }, { status: 500 });
  }
}
