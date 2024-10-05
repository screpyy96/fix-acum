import React, { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';

const HeroForm = () => {
  const [formData, setFormData] = useState({
    tradeType: '',
    jobType: ''
  });

  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const trades = [
    "Instalator", "Fierar", "Zidar", "Constructor", "Tâmplar", "Curățenie", 
    "Drenaj", "Pavator", "Electrician", "Montator", "Grădinar", "Inginer", 
    "Meșter", "Bucătării", "Lăcătuș", "Mansardări", "Zugrav", "Dezinsecție", 
    "Tencuitor", "Mutare", "Energie", "Acoperișuri", "Securitate", 
    "Specialist", "Pietrar", "Piscine", "Faianțar", "Meșteșugar", "Arborist", 
    "Ferestre"
  ];

  const jobTypes = [
    { value: "installation", label: "Instalare" },
    { value: "repair", label: "Reparație" },
    { value: "maintenance", label: "Întreținere" }
  ];

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    console.log('Handling input change:', { name, value });
    setFormData(prevData => {
      const newData = {
        ...prevData,
        [name]: value,
      };
      console.log('Updated formData:', newData);
      return newData;
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!formData.tradeType || !formData.jobType) {
      setError('Vă rugăm să selectați ambele câmpuri pentru a continua.');
      setIsSubmitting(false);
      return;
    }

    try {
      const dynamicLink = `/post-a-job/${encodeURIComponent(formData.tradeType)}/${encodeURIComponent(formData.jobType)}`;
      router.push(dynamicLink);
    } catch (error) {
      console.error('Eroare la trimiterea formularului:', error);
      setError('A apărut o eroare la trimiterea formularului. Vă rugăm să încercați din nou.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block mb-2" htmlFor="tradeType">Ce tip de meșter ai nevoie?</label>
        <select
          id="tradeType"
          name="tradeType"
          className="w-full p-2 rounded-md text-black bg-white"
          value={formData.tradeType}
          onChange={handleInputChange}
          required
        >
          <option value="">Vă rugăm să selectați</option>
          {trades.map((trade) => (
            <option key={trade} value={trade}>{trade}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block mb-2" htmlFor="jobType">Ce tip de lucrare este?</label>
        <select
          id="jobType"
          name="jobType"
          className="w-full p-2 rounded-md text-black bg-white"
          value={formData.jobType}
          onChange={handleInputChange}
          required
        >
          <option value="">Vă rugăm să selectați</option>
          {jobTypes.map((jobType) => (
            <option key={jobType.value} value={jobType.value}>{jobType.label}</option>
          ))}
        </select>
      </div>
      {error && <p className="text-red-500">{error}</p>}
      <button type="submit" className="w-full bg-yellow-400 text-gray-900 py-2 px-4 rounded-md hover:bg-yellow-500 transition duration-300" disabled={isSubmitting}>
        {isSubmitting ? 'Se trimite...' : 'Următorul pas >'}
      </button>
    </form>
  );
};

export default HeroForm;