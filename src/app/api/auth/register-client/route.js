import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request) {
  const { name, email, password } = await request.json();

  try {
    // Înregistrează utilizatorul
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          role: 'client',
        },
      },
    });

    if (error) throw error;

    // Creează profilul
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: data.user.id,
        name,
        email,
        role: 'client',
      });

    if (profileError) throw profileError;

    return NextResponse.json({ message: 'Client registered successfully' }, { status: 201 });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}