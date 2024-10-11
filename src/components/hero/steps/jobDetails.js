import { useForm } from '@/context/FormProvider';
import { useState } from 'react';

const Step1JobDetails = () => {
  const { formData, handleInputChange, nextStep } = useForm();
  const [currentQuestion, setCurrentQuestion] = useState(0);

  const questions = [
    {
      id: 'title',
      question: 'Titlul jobului',
      type: 'text',
    },
    {
      id: 'description',
      question: 'Descrierea jobului',
      type: 'textarea',
    },
    {
      id: 'startDate',
      question: 'Când vrei să înceapă jobul?',
      type: 'select',
      options: [
        { value: 'urgent', label: 'Urgent' },
        { value: '2days', label: 'În 2 zile' },
        { value: '1week', label: 'În 1 săptămână' },
        { value: '2weeks', label: 'În 2 săptămâni' },
        { value: '1month', label: 'În 1 lună' },
        { value: 'flexible', label: 'Flexibil' },
      ],
    },
    {
      id: 'endDate',
      question: 'Când vrei să se termine jobul?',
      type: 'select',
      options: [
        { value: 'urgent', label: 'Urgent' },
        { value: '2days', label: 'În 2 zile' },
        { value: '1week', label: 'În 1 săptămână' },
        { value: '2weeks', label: 'În 2 săptămâni' },
        { value: '1month', label: 'În 1 lună' },
        { value: 'flexible', label: 'Flexibil' },
      ],
    },
    {
      id: 'projectStage',
      question: 'În ce stadiu este proiectul?',
      type: 'select',
      options: [
        { value: 'readyToHire', label: 'Gata să angajez' },
        { value: 'planningBudgeting', label: 'Planificare și bugetare' },
        { value: 'gatheringQuotes', label: 'Adunare oferte' },
        { value: 'researchingOptions', label: 'Cercetare opțiuni' },
      ],
    },
    {
      id: 'isAuthorized',
      question: 'Ești proprietarul sau autorizat să faci modificări?',
      type: 'radio',
      options: [
        { value: 'yes', label: 'Da' },
        { value: 'no', label: 'Nu' },
      ],
    },
  ];

  const convertToDate = (option) => {
    const now = new Date();
    switch (option) {
      case 'urgent':
        return now; // Imediat
      case '2days':
        return new Date(now.setDate(now.getDate() + 2)); // În 2 zile
      case '1week':
        return new Date(now.setDate(now.getDate() + 7)); // În 1 săptămână
      case '2weeks':
        return new Date(now.setDate(now.getDate() + 14)); // În 2 săptămâni
      case '1month':
        return new Date(now.setMonth(now.getMonth() + 1)); // În 1 lună
      case 'flexible':
        return null; // Flexibil
      default:
        return null;
    }
  };

  const handleAnswer = (answer) => {
    const value = questions[currentQuestion].id === 'startDate' || questions[currentQuestion].id === 'endDate' ? convertToDate(answer) : answer;
    handleInputChange('jobDetails', questions[currentQuestion].id, value);
    console.log('Updated formData:', formData);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      nextStep();
    }
  };

  const renderQuestion = () => {
    const question = questions[currentQuestion];
    switch (question.type) {
      case 'text':
        return (
          <input
            type="text"
            value={formData.jobDetails[question.id] || ''}
            onChange={(e) => handleAnswer(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder={question.question}
          />
        );
      case 'textarea':
        return (
          <textarea
            value={formData.jobDetails[question.id] || ''}
            onChange={(e) => handleAnswer(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder={question.question}
          />
        );
      case 'select':
        return (
          <select
            value={formData.jobDetails[question.id] || ''}
            onChange={(e) => handleAnswer(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="">Selectează o opțiune</option>
            {question.options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
      case 'radio':
        return (
          <div>
            {question.options.map((option) => (
              <label key={option.value} className="block mb-2">
                <input
                  type="radio"
                  value={option.value}
                  checked={formData.jobDetails[question.id] === option.value}
                  onChange={() => handleAnswer(option.value)}
                  className="mr-2"
                />
                {option.label}
              </label>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  const isAnswered = formData.jobDetails[questions[currentQuestion].id] !== undefined &&
                     formData.jobDetails[questions[currentQuestion].id] !== '';

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Detalii Job</h2>
      <div className="mb-4">
        <p><strong>Tip de Meserie:</strong> {formData.jobDetails.tradeType || 'Nespecificat'}</p>
        <p><strong>Tip de Job:</strong> {formData.jobDetails.jobType || 'Nespecificat'}</p>
      </div>
      <div className="mb-4">
        <h3 className="text-lg font-medium mb-2">{questions[currentQuestion].question}</h3>
        {renderQuestion()}
      </div>
      <div className="flex justify-between mt-4">
        {currentQuestion > 0 && (
          <button
            type="button"
            onClick={() => setCurrentQuestion(currentQuestion - 1)}
            className="bg-gray-500 text-white px-4 py-2 rounded"
          >
            Înapoi
          </button>
        )}
        {isAnswered && (
          <button
            type="button"
            onClick={handleNext}
            className="bg-blue-500 text-white px-4 py-2 rounded ml-auto"
          >
            {currentQuestion === questions.length - 1 ? 'Finalizare' : 'Următoarea Întrebare'}
          </button>
        )}
      </div>
    </div>
  );
};

export default Step1JobDetails;