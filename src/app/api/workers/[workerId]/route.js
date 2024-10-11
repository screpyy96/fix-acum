import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request, { params }) {
  const { workerId } = params;

  try {
    const { data: worker, error } = await supabase
      .from('profiles')
      .select(`
        *,
        reviews:reviews(*)
      `)
      .eq('id', workerId)
      .single();

    if (error) throw error;

    if (!worker) {
      return NextResponse.json({ error: 'Worker not found' }, { status: 404 });
    }

    // Calculează rating-ul mediu
    const reviews = worker.reviews || [];
    const averageRating = reviews.length > 0
      ? reviews.reduce((acc, review) => acc + (review.rating || 0), 0) / reviews.length
      : 0;

    // Formatează datele pentru a se potrivi cu structura așteptată de componenta de profil
    const formattedWorker = {
      ...worker,
      averageRating,
      completedJobs: worker.completed_jobs || 0,
      availability: worker.availability || 'Not specified',
      skills: worker.skills || [],
      experience: worker.experience || 'Not specified',
      reviews: reviews
    };

    return NextResponse.json(formattedWorker);
  } catch (error) {
    console.error('Error fetching worker profile:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
