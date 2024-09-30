import React from 'react';
import MultiStepsForm from '@/components/hero/multiStepsForm';

export default function PostAJobPage({ params }) {
  const trade = decodeURIComponent(params.trade);
  const jobType = decodeURIComponent(params.jobType);

  console.log('Trade:', trade); // Pentru debugging
  console.log('Job Type:', jobType); // Pentru debugging

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Postează o lucrare: {trade} - {jobType}
      </h1>
      <MultiStepsForm tradeType={trade} jobType={jobType} />
    </div>
  );
}

export async function generateMetadata({ params }) {
  const trade = decodeURIComponent(params.trade);
  const jobType = decodeURIComponent(params.jobType);
  return {
    title: `Postează o lucrare: ${trade} - ${jobType} | Fix Acum`,
    description: `Completează formularul pentru a posta o lucrare de ${trade} - ${jobType}.`,
  };
}
