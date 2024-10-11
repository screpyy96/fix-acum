import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Inițializează clientul Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    // Autentificare utilizator cu Supabase Auth
    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) throw authError;

    const userId = data.session.user.id;

    // Obține informații suplimentare despre utilizator din tabela 'profiles'
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single();

    if (profileError) throw profileError;

    // Redirecționează utilizatorul în funcție de rolul său
    let redirectPath = '/';
    if (profile.role === 'client') {
      redirectPath = '/dashboard/client';
    } else if (profile.role === 'worker') {
      redirectPath = '/dashboard/worker';
    }

    return NextResponse.json({ message: 'Login successful', redirect: redirectPath }, { status: 200 });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}