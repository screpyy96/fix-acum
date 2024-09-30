import React from 'react';

const ContactInfo = ({ formData, onChange, onNext, onPrev }) => {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Informații de Contact</h2>
      <form onSubmit={(e) => { e.preventDefault(); onNext(); }}>
        <div className="mb-4">
          <label htmlFor="name" className="block mb-2">Nume</label>
          <input
            type="text"
            id="name"
            value={formData.name || ''}
            onChange={(e) => onChange({ name: e.target.value })}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block mb-2">Email</label>
          <input
            type="email"
            id="email"
            value={formData.email || ''}
            onChange={(e) => onChange({ email: e.target.value })}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="flex justify-between">
          <button type="button" onClick={onPrev} className="bg-gray-300 text-black px-4 py-2 rounded">
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