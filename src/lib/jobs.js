import { supabase } from './supabase';
import { createNotification } from './notifications';

export async function applyToJob(jobId, workerId) {
  const { data, error } = await supabase
    .from('job_applications')
    .insert({ job_id: jobId, worker_id: workerId });

  if (error) {
    console.error('Error applying to job:', error);
    return null;
  }

  const { data: job } = await supabase
    .from('jobs')
    .select('client_id, title')
    .eq('id', jobId)
    .single();

  if (job) {
    await createNotification(
      job.client_id,
      'job_application',
      `Un nou worker a aplicat la jobul tău: ${job.title}`
    );
  }

  return data;
}
