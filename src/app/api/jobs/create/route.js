import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Inițializează clientul Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function POST(request) {
  try {
    const { title, description, trade_type, job_type, budget, location, start_date, end_date } = await request.json();

    // Obține sesiunea utilizatorului
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;

    // Verifică dacă utilizatorul este un client
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single();

    if (profileError || profile.role !== 'client') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Inserează jobul în tabela 'jobs'
    const { data: job, error: jobInsertError } = await supabase
      .from('jobs')
      .insert({
        client_id: userId,
        title,
        description,
        trade_type,
        job_type,
        status: 'open',
        budget: budget || null,
        location: location || null,
        start_date: start_date || null,
        end_date: end_date || null
      })
      .select()
      .single();

    if (jobInsertError) {
      throw jobInsertError;
    }

    return NextResponse.json({ message: 'Job created successfully', job }, { status: 201 });
  } catch (error) {
    console.error('Error creating job:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}