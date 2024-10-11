"use client"
import React, { useState } from 'react';
import { useForm } from '@/context/FormProvider';
import { motion, AnimatePresence } from 'framer-motion';
import { FaArrowRight, FaArrowLeft, FaTools, FaCalendarAlt, FaProjectDiagram, FaUserCheck } from 'react-icons/fa';

const Step1JobDetails = () => {
  const { formData, handleInputChange, nextStep } = useForm();
  const [currentQuestion, setCurrentQuestion] = useState(0);

  const questions = [
    { id: 'title', question: 'Titlul jobului', type: 'text' },
    { id: 'description', question: 'Descrierea jobului', type: 'textarea' },
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

  const handleAnswer = (answer) => {
    handleInputChange('jobDetails', questions[currentQuestion].id, answer);
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
    const commonClasses = "w-full p-3 bg-white bg-opacity-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300";

    switch (question.type) {
      case 'text':
        return (
          <input
            type="text"
            value={formData.jobDetails[question.id] || ''}
            onChange={(e) => handleAnswer(e.target.value)}
            className={commonClasses}
            placeholder={question.question}
          />
        );
      case 'textarea':
        return (
          <textarea
            value={formData.jobDetails[question.id] || ''}
            onChange={(e) => handleAnswer(e.target.value)}
            className={`${commonClasses} h-32 resize-none`}
            placeholder={question.question}
          />
        );
      case 'select':
        return (
          <select
            value={formData.jobDetails[question.id] || ''}
            onChange={(e) => handleAnswer(e.target.value)}
            className={commonClasses}
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
          <div className="space-y-2">
            {question.options.map((option) => (
              <label key={option.value} className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  value={option.value}
                  checked={formData.jobDetails[question.id] === option.value}
                  onChange={() => handleAnswer(option.value)}
                  className="form-radio text-blue-500 focus:ring-blue-400"
                />
                <span>{option.label}</span>
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

  const iconComponents = [FaTools, FaCalendarAlt, FaProjectDiagram, FaUserCheck];
  const IconComponent = iconComponents[currentQuestion % iconComponents.length];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-gradient-to-br from-gray-800 to-gray-900 p-10 rounded-2xl shadow-2xl max-w-4xl mx-auto text-white"
    >
      <div className="mb-8 text-center">
        <IconComponent className="text-5xl text-blue-400 mb-4 mx-auto" />
        <h2 className="text-3xl font-light mb-2">Detalii Job</h2>
        <p className="text-gray-400">Pasul {currentQuestion + 1} din {questions.length}</p>
      </div>
      
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ type: "tween", ease: "easeInOut", duration: 0.3 }}
          className="mb-8"
        >
          <h3 className="text-xl font-medium mb-4 text-blue-300">{questions[currentQuestion].question}</h3>
          <div className="bg-white bg-opacity-5 p-6 rounded-lg backdrop-filter backdrop-blur-sm">
            {renderQuestion()}
          </div>
        </motion.div>
      </AnimatePresence>
      
      <div className="flex justify-between mt-12">
        {currentQuestion > 0 && (
          <motion.button
            whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.1)" }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setCurrentQuestion(currentQuestion - 1)}
            className="px-6 py-2 rounded-full flex items-center border border-white border-opacity-30 transition-colors duration-300"
          >
            <FaArrowLeft className="mr-2" /> Înapoi
          </motion.button>
        )}
        {isAnswered && (
          <motion.button
            whileHover={{ scale: 1.05, backgroundColor: "rgba(59, 130, 246, 0.8)" }}
            whileTap={{ scale: 0.95 }}
            onClick={handleNext}
            className="bg-blue-500 px-6 py-2 rounded-full flex items-center ml-auto transition-colors duration-300"
          >
            {currentQuestion === questions.length - 1 ? 'Finalizare' : 'Următoarea'} <FaArrowRight className="ml-2" />
          </motion.button>
        )}
      </div>
      
      <div className="mt-8 flex justify-center">
        {questions.map((_, index) => (
          <motion.div
            key={index}
            className={`h-1 mx-1 rounded-full ${index === currentQuestion ? 'bg-blue-400' : 'bg-gray-600'}`}
            initial={false}
            animate={{ 
              width: index === currentQuestion ? 32 : 20,
              opacity: index === currentQuestion ? 1 : 0.5
            }}
            transition={{ duration: 0.3 }}
          />
        ))}
      </div>
    </motion.div>
  );
};

export default Step1JobDetails;
