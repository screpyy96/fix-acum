import React from 'react';

const ReviewSubmit = ({ formData, onPrev, onSubmit }) => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Revizuire și Trimitere</h2>
      <div>
        <h3 className="font-semibold">Detalii Job:</h3>
        <p>Titlu: {formData.jobDetails.title}</p>
        <p>Descriere: {formData.jobDetails.description}</p>
        <p>Tip de meserie: {formData.tradeType}</p>
        <p>Tip de job: {formData.jobType}</p>
      </div>
      <div>
        <h3 className="font-semibold">Informații Client:</h3>
        <p>Nume: {formData.clientData.name}</p>
        <p>Email: {formData.clientData.email}</p>
      </div>
      <div className="flex justify-between">
        <button
          onClick={onPrev}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
        >
          Înapoi
        </button>
        <button
          onClick={onSubmit}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Trimite
        </button>
      </div>
    </div>
  );
};

export default ReviewSubmit;