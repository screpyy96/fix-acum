import { supabase } from './supabase';
import { createNotification } from './notifications';

export async function applyToJob(jobId, workerId) {
  // Logica existentă pentru aplicare la job
  const { data, error } = await supabase
    .from('job_applications')
    .insert({ job_id: jobId, worker_id: workerId });

  if (error) {
    console.error('Error applying to job:', error);
    return null;
  }

  // Obțineți ID-ul clientului pentru acest job
  const { data: job } = await supabase
    .from('jobs')
    .select('client_id')
    .eq('id', jobId)
    .single();

  if (job) {
    await createNotification(
      job.client_id,
      'job_application',
      `Un nou worker a aplicat la jobul tău.`
    );
  }

  return data;
}
