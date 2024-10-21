// src/app/post-a-job/[trade]/[jobType]/page.jsx

import MultiStepsForm from '@/components/hero/multiStepsForm';
import { FormProvider } from '@/context/FormProvider';

export async function generateMetadata({ params }) {
  const trade = decodeURIComponent(params.trade);
  const jobType = decodeURIComponent(params.jobType);
  return {
    title: `Postează job: ${trade} - ${jobType} | Fix Acum`,
    description: `Postează un job pentru ${trade} - ${jobType}. Găsește profesioniști calificați rapid și ușor pe Fix Acum.`,
  };
}

export default function PostJobPage({ params }) {
  const trade = decodeURIComponent(params.trade);
  const jobType = decodeURIComponent(params.jobType);

  return (
    <FormProvider>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-center">
          Postează un Job: {trade} - {jobType}
        </h1>
        <MultiStepsForm tradeType={trade} jobType={jobType} />
      </div>
    </FormProvider>
  );
}
