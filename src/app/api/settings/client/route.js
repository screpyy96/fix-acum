import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Client from '@/models/Client'; // Importă modelul Client
import { getCurrentUser } from '@/lib/auth'; // Importă funcția pentru obținerea utilizatorului curent
import jwt from 'jsonwebtoken';

export async function PATCH(request) {
  try {
    const user = await getCurrentUser(request); // Obține utilizatorul curent
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, email } = await request.json(); // Obține datele de actualizare din cerere

    await connectToDatabase(); // Conectează-te la baza de date

    // Verifică dacă clientul există
    const client = await Client.findByIdAndUpdate(
      user.id,
      { $set: { name, email } },
      { new: true, runValidators: true }
    );

    if (!client) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 });
    }

    // Generează un nou token cu datele actualizate
    const token = jwt.sign(
      { id: client._id, name: client.name, email: client.email, type: 'client' },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    // Returnează clientul actualizat și noul token
    return NextResponse.json({ client: client.toObject(), token }, { status: 200 });
  } catch (error) {
    console.error('Error updating client:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(request) {
  try {
    await connectToDatabase();
    const user = await getCurrentUser(request);

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const client = await Client.findById(user.id); // Folosește ID-ul utilizatorului pentru a găsi clientul
    if (!client) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 });
    }

    return NextResponse.json({ client }, { status: 200 });
  } catch (error) {
    console.error('Error fetching client:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();
    await Client.findByIdAndDelete(user.id); // Șterge clientul folosind ID-ul utilizatorului

    return NextResponse.json({ message: 'Client deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting client:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

