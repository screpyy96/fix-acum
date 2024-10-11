import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
export async function GET(request, { params }) {
const supabase = createRouteHandlerClient({ cookies: request.cookies });
try {
const { data: { session }, error: sessionError } = await supabase.auth.getSession();
if (sessionError || !session) {
return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}
const { jobId } = params;
const { data: job, error } = await supabase
.from('jobs')
.select('')
.eq('id', jobId)
.single();
if (error) throw error;
return NextResponse.json(job);
} catch (error) {
console.error('Error fetching job:', error);
return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
}
}