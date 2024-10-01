import { useForm } from '@/context/FormProvider';

const Step1JobDetails = () => {
  const { formData, handleInputChange, nextStep } = useForm();

  const handleSubmit = (e) => {
    e.preventDefault();
    nextStep();
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="text-xl font-semibold mb-4">Detalii Job</h2>
      <div className="mb-4">
        <label htmlFor="title" className="block mb-2">Titlu Job</label>
        <input 
          type="text"
          id="title"
          value={formData.jobDetails.title || ''}
          onChange={(e) => handleInputChange('jobDetails', { title: e.target.value })}
          className="w-full p-2 border rounded placeholder-black"
          placeholder={`${formData.jobDetails.tradeType || ''} - ${formData.jobDetails.jobType || ''}`}
          required
        />
      </div>
      <div className="mb-4">
        <label htmlFor="description" className="block mb-2">Descriere</label>
        <textarea
          id="description"
          value={formData.jobDetails.description || ''}
          onChange={(e) => handleInputChange('jobDetails', { description: e.target.value })}
          className="w-full p-2 border rounded placeholder-black"
          placeholder="Descrieți detaliile lucrării"
          required
        ></textarea>
      </div>
      <div className="mb-4">
        <p><strong>Tip de Meserie:</strong> {formData.jobDetails.tradeType || 'Nespecificat'}</p>
      </div>
      <div className="mb-4">
        <p><strong>Tip de Job:</strong> {formData.jobDetails.jobType || 'Nespecificat'}</p>
      </div>
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Următorul Pas</button>
    </form>
  );
};

export default Step1JobDetails;
