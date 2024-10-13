import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  const supabase = createRouteHandlerClient({ cookies });

  try {
    const { email, password, name } = await request.json();

    // Înregistrarea utilizatorului
    const { data: { user }, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (signUpError) throw signUpError;

    // Crearea sau actualizarea profilului
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .upsert({
        id: user.id,
        name,
        email,
        role: 'client'
      }, {
        onConflict: 'id'
      })
      .select();

    if (profileError) throw profileError;

    return NextResponse.json({ user: profileData[0] });
  } catch (error) {
    console.error('Error during registration:', error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
