import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

export async function GET(request, { params }) {
  const { workerId } = params;

  try {
    const { data, error } = await supabase
      .from('profiles')
      .select(`
        *,
        reviews:reviews!reviews_worker_id_fkey(rating)
      `)
      .eq('id', workerId)
      .single();

    if (error) throw error;

    if (!data) {
      return NextResponse.json({ error: 'Worker not found' }, { status: 404 });
    }

    // Calculați media rating-urilor
    if (data.reviews && data.reviews.length > 0) {
      const ratings = data.reviews.map(review => review.rating);
      data.averageRating = ratings.reduce((a, b) => a + b) / ratings.length;
    } else {
      data.averageRating = null;
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching worker profile:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
