import React from 'react';
import { useForm } from '@/context/FormProvider';

const ReviewSubmit = ({ onSubmit }) => {
  const { formData, prevStep } = useForm();

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Revizuire și Trimitere</h2>
      <p>Titlu Job: {formData.jobDetails.title || `${formData.jobDetails.tradeType} - ${formData.jobDetails.jobType}`}</p>
      <p>Descriere: {formData.jobDetails.description || 'Fără descriere'}</p>
      <p>Tip de Meserie: {formData.jobDetails.tradeType}</p>
      <p>Tip de Job: {formData.jobDetails.jobType}</p>
      <p>Nume Client: {formData.userDetails.name}</p>
      <p>Email Client: {formData.userDetails.email}</p>
      <div className="flex justify-between mt-4">
        <button onClick={prevStep} className="bg-gray-300 text-black px-4 py-2 rounded">
          Înapoi
        </button>
        <button onClick={onSubmit} className="bg-green-500 text-white px-4 py-2 rounded">
          Trimite
        </button>
      </div>
    </div>
  );
};

export default ReviewSubmit;
