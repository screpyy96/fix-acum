import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';

export async function POST(request) {
  try {
    const { token } = await request.json();
    console.log('Received token for verification:', token);

    if (!token) {
      console.log('No token provided');
      return NextResponse.json({ error: 'No token provided' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    console.log('Decoded token data:', decoded);

    if (!decoded) {
      console.log('Invalid token');
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    return NextResponse.json({
      user: {
        id: decoded.id,
        name: decoded.name,
        email: decoded.email,
        type: decoded.type,
        trade: decoded.trade
      }
    });
  } catch (error) {
    console.error('Token verification error:', error);
    return NextResponse.json({ error: 'Error verifying token' }, { status: 500 });
  }
}