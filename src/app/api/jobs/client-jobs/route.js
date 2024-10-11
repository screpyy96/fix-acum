import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request) {
  try {
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;

    const { data: jobs, error: jobsError } = await supabase
      .from('jobs')
      .select('*')
      .eq('client_id', userId)
      .order('created_at', { ascending: false });

    if (jobsError) {
      throw jobsError;
    }

    return NextResponse.json(jobs);
  } catch (error) {
    console.error('Error in client jobs route:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}
