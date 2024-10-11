import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request) {
  const { name, email, password } = await request.json();

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

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  // Creează profilul
  const { error: profileError } = await supabase
    .from('profiles')
    .insert({
      id: data.user.id,
      name,
      role: 'client',
    });

  if (profileError) {
    return NextResponse.json({ error: profileError.message }, { status: 400 });
  }

  return NextResponse.json({ message: 'Client registered successfully' }, { status: 201 });
}