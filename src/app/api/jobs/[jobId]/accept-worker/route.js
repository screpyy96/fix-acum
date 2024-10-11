import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
export async function POST(request, { params }) {
const supabase = createRouteHandlerClient({ cookies: request.cookies });
const { jobId } = params;
try {
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
// Obține workerId din corpul cererii
const { workerId } = await request.json();
// Continuă cu logica ta specifică...
// Exemplu de actualizare job și aplicație
const { error: jobError } = await supabase
.from('jobs')
.update({ status: 'in-progress' })
.eq('id', jobId);
if (jobError) throw jobError;
const { error: applicationError } = await supabase
.from('job_applications')
.update({ status: 'accepted' })
.eq('job_id', jobId)
.eq('worker_id', workerId);
if (applicationError) throw applicationError;
return NextResponse.json({ message: 'Worker accepted successfully' }, { status: 200 });
} catch (error) {
console.error('Error accepting worker:', error);
return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
}
}