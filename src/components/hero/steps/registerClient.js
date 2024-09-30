import React, { useState } from 'react';

const RegisterClient = ({ formData, onChange, onNext }) => {
  const [passwordError, setPasswordError] = useState('');

  const handleChange = (e) => {
    onChange({ [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setPasswordError('Parolele nu se potrivesc');
      return;
    }
    setPasswordError('');
    onNext(); // Trecem la următorul pas
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        name="name"
        value={formData.name || ''}
        onChange={handleChange}
        placeholder="Nume complet"
        required
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black placeholder-black"
      />
      <input
        type="email"
        name="email"
        value={formData.email || ''}
        onChange={handleChange}
        placeholder="Email"
        required
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black placeholder-black"
      />
      <input
        type="password"
        name="password"
        value={formData.password || ''}
        onChange={handleChange}
        placeholder="Parolă"
        required
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black placeholder-black"
      />
      <input
        type="password"
        name="confirmPassword"
        value={formData.confirmPassword || ''}
        onChange={handleChange}
        placeholder="Confirmă parola"
        required
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black placeholder-black"
      />
      {passwordError && <p className="text-red-500">{passwordError}</p>}
      <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded">Înregistrează-te</button>
    </form>
  );
};

export default RegisterClient;
