import React from 'react';
import MultiStepsForm from '@/components/hero/multiStepsForm';
import { FormProvider } from '@/context/FormProvider';

export default function PostAJobPage({ params }) {
  const trade = decodeURIComponent(params.trade);
  const jobType = decodeURIComponent(params.jobType);

  return (
    <FormProvider initialTradeType={trade} initialJobType={jobType}>
      <div className="min-h-screen bg-gray-50   sm:px-6 lg:px-0">
        <div className=" mx-auto">
          <div className="bg-white ">
            <div className="p-8">
              <header className="text-center mb-8">
                <h1 className="text-3xl font-semibold text-gray-900">
                  Postează o lucrare
                </h1>
                <div className="flex justify-center mt-4">
                  <div className="flex items-center text-sm text-gray-600 space-x-4">
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span>{trade}</span>
                    </div>
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <span>{jobType}</span>
                    </div>
                  </div>
                </div>
              </header>

              <div className="text-center mb-8">
                <p className="text-gray-700 text-lg">
                  Completează formularul pentru a găsi profesioniști calificați pentru nevoile tale.
                </p>
              </div>

              <div>
                <MultiStepsForm tradeType={trade} jobType={jobType} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </FormProvider>
  );
}

export async function generateMetadata({ params }) {
  const trade = decodeURIComponent(params.trade);
  const jobType = decodeURIComponent(params.jobType);
  return {
    title: `Postează: ${trade} - ${jobType} | Fix Acum`,
    description: `Postează o lucrare de ${trade} - ${jobType}. Găsește profesioniști calificați rapid și ușor.`,
  };
}
