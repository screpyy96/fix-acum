import React from 'react';

const JobDetails = ({ formData, onChange, onNext }) => {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Detalii Job</h2>
      <form onSubmit={(e) => { e.preventDefault(); onNext(); }}>
        <div className="mb-4">
          <label htmlFor="title" className="block mb-2">Titlu Job</label>
          <input
            type="text"
            id="title"
            value={formData.title || ''}
            onChange={(e) => onChange({ title: e.target.value })}
            className="w-full p-2 border rounded placeholder-black"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="description" className="block mb-2">Descriere</label>
          <textarea
            id="description"
            value={formData.description || ''}
            onChange={(e) => onChange({ description: e.target.value })}
            className="w-full p-2 border rounded placeholder-black"
            rows="4"
            required
          ></textarea>
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Următorul Pas
        </button>
      </form>
    </div>
  );
};

export default JobDetails;