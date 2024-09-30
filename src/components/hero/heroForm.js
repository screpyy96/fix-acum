import React, { useState, useEffect } from 'react';
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
    "Instalator", "Fierar / Prelucrător-metal", "Zidar", "Constructor",
    "Tâmplar / Dulgher", "Instalator sisteme CCTV / Satelit / Alarme", "Curățenie",
    "Specialist în drenaj", "Pavator-alei", "Electrician", "Montator-pardoseli",
    "Grădinar / Peisagist", "Inginer-gaze / Termice", "Meșter-universal",
     "Servicii de mutare", "Specialist în energie regenerabilă",
    "Acoperișuri", "Sisteme de securitate / Alarme", "Meșter-specialist",
    "Pietrar / Cioplitor-în-piatră", "Specialist-în-piscine", "Faianțar",
    "Meșteșugar tradițional", "Arborist", "Montator ferestre / Instalator verande"
  ];

  const jobTypes = [
    { value: "installation", label: "Instalare" },
    { value: "repair", label: "Reparație" },
    { value: "maintenance", label: "Întreținere" }
  ];

  useEffect(() => {
    if (formData.tradeType && formData.jobType) {
      setError('');
    }
  }, [formData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log(`${name} changed:`, value);
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    console.log('Form submitted. Data:', formData);

    if (!formData.tradeType || !formData.jobType) {
      setError('Vă rugăm să selectați ambele câmpuri pentru a continua.');
      setIsSubmitting(false);
      return;
    }

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      const dynamicLink = `/post-a-job/${encodeURIComponent(formData.tradeType)}/${encodeURIComponent(formData.jobType)}`;
      console.log('Link generat:', dynamicLink);

      if (typeof window !== 'undefined') {
        router.push(dynamicLink);
      }
    } catch (error) {
      console.error('Eroare la trimiterea formularului:', error);
      setError('A apărut o eroare la trimiterea formularului. Vă rugăm să încercați din nou.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 opacity-75"></div>
      <div className="relative z-10 p-8">
        <h2 className="text-3xl font-bold text-white mb-6 text-center">Postează lucrarea ta gratuit. Obține cotații. Citește recenzii.</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-white mb-2" htmlFor="tradeType">Ce tip de meșter ai nevoie?</label>
            <select
              id="tradeType"
              name="tradeType"
              className="w-full p-2 rounded-md text-black"
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
            <label className="block text-white mb-2" htmlFor="jobType">Ce tip de lucrare este?</label>
            <select
              id="jobType"
              name="jobType"
              className="w-full p-2 rounded-md text-black"
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
        <div className="mt-4 text-center text-white">
          <span className="font-bold">Excelent</span>
          <img src="/stars.svg" alt="Trustpilot rating" className="inline-block mx-2 h-5" />
          <span>17,558 recenzii pe Trustpilot</span>
        </div>
      </div>
    </div>
  );
};

export default HeroForm;