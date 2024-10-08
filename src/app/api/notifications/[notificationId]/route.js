import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Notification from '@/models/Notification';
import { getCurrentUser } from '@/lib/auth';

export async function PATCH(request, { params }) {
  const { notificationId } = params;

  try {
    await connectToDatabase();
    const user = await getCurrentUser(request);

    if (!user || user.type !== 'worker') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const notification = await Notification.findById(notificationId);
    if (!notification || notification.userId.toString() !== user.id) {
      return NextResponse.json({ error: 'Notification not found or does not belong to user' }, { status: 404 });
    }

    notification.isRead = true; // Marcare ca citită
    await notification.save(); // Salvează modificările

    return NextResponse.json({ message: 'Notification marked as read' }, { status: 200 });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}
