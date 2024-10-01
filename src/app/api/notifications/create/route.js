import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Notification from '@/models/Notification';

export async function POST(request) {
  try {
    const { recipient, recipientModel, message, type, relatedJob } = await request.json();
    
    await connectToDatabase();
    
    const newNotification = new Notification({
      recipient,
      recipientModel,
      message,
      type,
      relatedJob,
    });

    await newNotification.save();

    return NextResponse.json({ message: 'Notification created successfully' }, { status: 201 });
  } catch (error) {
    console.error('Error creating notification:', error);
    return NextResponse.json({ error: 'Error creating notification' }, { status: 500 });
  }
}
