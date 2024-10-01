import React, { useState } from 'react';
import { useForm } from '@/context/FormProvider';

const RegisterClient = ({ onRegister }) => {
  const { formData, handleInputChange, prevStep } = useForm();
  const [passwordError, setPasswordError] = useState('');

  const handleChange = (e) => {
    handleInputChange('clientData', { [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.clientData.password !== formData.clientData.confirmPassword) {
      setPasswordError('Parolele nu se potrivesc');
      return;
    }
    setPasswordError('');
    onRegister();
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Înregistrare Client</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          value={formData.clientData.name || ''}
          onChange={handleChange}
          placeholder="Nume complet"
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="email"
          name="email"
          value={formData.clientData.email || ''}
          onChange={handleChange}
          placeholder="Email"
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="password"
          name="password"
          value={formData.clientData.password || ''}
          onChange={handleChange}
          placeholder="Parolă"
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="password"
          name="confirmPassword"
          value={formData.clientData.confirmPassword || ''}
          onChange={handleChange}
          placeholder="Confirmă parola"
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {passwordError && <p className="text-red-500">{passwordError}</p>}
        <div className="flex justify-between">
          <button type="button" onClick={prevStep} className="bg-gray-300 text-black px-4 py-2 rounded">
            Înapoi
          </button>
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Înregistrează-te</button>
        </div>
      </form>
    </div>
  );
};

export default RegisterClient;