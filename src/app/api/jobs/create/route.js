import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Job from '@/models/Job';
import Client from '@/models/Client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request) {
  try {
    const { job, client } = await request.json();
    console.log('Received job data:', JSON.stringify(job, null, 2));
    console.log('Received client data:', JSON.stringify(client, null, 2));

    await connectToDatabase();
    console.log('Connected to database');

    let existingClient = await Client.findOne({ email: client.email });
    
    if (!existingClient) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(client.password, salt);
      
      existingClient = new Client({
        name: client.name,
        email: client.email,
        password: hashedPassword,
        clientId: uuidv4(),
      });
      
      await existingClient.save();
      console.log('New client created:', JSON.stringify(existingClient, null, 2));
    }

    const newJob = new Job({
      title: job.title,
      description: job.description,
      tradeType: job.tradeType,
      jobType: job.jobType,
      clientId: existingClient._id,
    });

    console.log('Attempting to save new job:', JSON.stringify(newJob, null, 2));
    await newJob.save();
    console.log('New job saved successfully:', JSON.stringify(newJob, null, 2));

    // Generare token
    const token = jwt.sign(
      { 
        id: existingClient._id,
        email: existingClient.email,
        name: existingClient.name,
        type: 'client',
      },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    return NextResponse.json({ 
      message: 'Job și client creați cu succes',
      token,
      client: {
        id: existingClient._id,
        name: existingClient.name,
        email: existingClient.email,
        type: 'client',
      },
      job: newJob,
    }, { status: 201 });

  } catch (error) {
    console.error('Error in job creation:', error);
    return NextResponse.json({ 
      error: 'Eroare la crearea job-ului și a clientului', 
      details: error.message,
      stack: error.stack,
    }, { status: 500 });
  }
}