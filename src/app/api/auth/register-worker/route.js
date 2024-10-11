import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Inițializează clientul Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function POST(request) {
  try {
    const { name, email, password, trade } = await request.json();

    // Înregistrează utilizatorul cu Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          role: 'worker',
          trade
        }
      }
    });

    if (authError) throw authError;

    // Creează profilul muncitorului în tabela 'profiles'
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: authData.user.id,
        name,
        role: 'worker',
        trade
      });

    if (profileError) throw profileError;

    return NextResponse.json({ message: 'Worker registered successfully' }, { status: 201 });
  } catch (error) {
    console.error('Error registering worker:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}