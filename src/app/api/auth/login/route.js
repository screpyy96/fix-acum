import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';


export async function POST(request) {
  try {
    const { email, password } = await request.json();

    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) throw authError;

    const userId = data.session.user.id;

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single();

    if (profileError) throw profileError;

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