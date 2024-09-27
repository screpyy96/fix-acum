import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Job from '@/models/Job';

export async function POST(request) {
  try {
    const { title, description, clientId } = await request.json();
    
    await connectToDatabase();
    
    const newJob = new Job({
      title,
      description,
      clientId,
      createdAt: new Date()
    });

    await newJob.save();

    return NextResponse.json({ message: 'Job creat cu succes', job: newJob }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Eroare la crearea job-ului' }, { status: 500 });
  }
}