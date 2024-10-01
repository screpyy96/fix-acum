import React from 'react';
import { useForm } from '@/context/FormProvider';

const ContactInfo = () => {
  const { formData, handleInputChange, nextStep, prevStep } = useForm();

  const handleSubmit = (e) => {
    e.preventDefault();
    nextStep();
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Informații de Contact</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="name" className="block mb-2">Nume</label>
          <input
            type="text"
            id="name"
            value={formData.clientData.name || ''}
            onChange={(e) => handleInputChange('clientData', { name: e.target.value })}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block mb-2">Email</label>
          <input
            type="email"
            id="email"
            value={formData.clientData.email || ''}
            onChange={(e) => handleInputChange('clientData', { email: e.target.value })}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="flex justify-between">
          <button type="button" onClick={prevStep} className="bg-gray-300 text-black px-4 py-2 rounded">
            Înapoi
          </button>
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
            Următorul Pas
          </button>
        </div>
      </form>
    </div>
  );
};

export default ContactInfo;