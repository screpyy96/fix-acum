import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Notification from '@/models/Notification';
import { getCurrentUser } from '@/lib/auth';

export async function GET(request) {
  try {
    await connectToDatabase();
    const user = await getCurrentUser(request);

    if (!user || user.type !== 'worker') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const notifications = await Notification.find({ userId: user.id }).sort({ createdAt: -1 });
    return NextResponse.json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}