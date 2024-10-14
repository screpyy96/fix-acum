"use client"

import React, { createContext, useState, useContext, useCallback, useEffect } from 'react';
import { supabase } from '@/lib/supabase'; // Asigurați-vă că aveți această importare

const FormContext = createContext();

export const useForm = () => useContext(FormContext);

export const FormProvider = ({ children, initialTradeType, initialJobType }) => {
  console.log('FormProvider initialized with:', { initialTradeType, initialJobType });

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    jobDetails: {
      tradeType: initialTradeType || '',
      jobType: initialJobType || '',
      title: '',
      description: '',
      startDate: '',
      endDate: '',
      projectStage: '',
      isAuthorized: '',
    },
    userDetails: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    clientId: '',
  });

  useEffect(() => {
    setFormData(prevData => ({
      ...prevData,
      jobDetails: {
        ...prevData.jobDetails,
        tradeType: initialTradeType,
        jobType: initialJobType,
      }
    }));
    console.log('FormData updated with initial values:', formData.jobDetails);
  }, [initialTradeType, initialJobType]);

  const nextStep = useCallback(() => {
    setStep(prevStep => prevStep + 1);
  }, []);

  const prevStep = useCallback(() => {
    setStep(prevStep => Math.max(prevStep - 1, 1));
  }, []);

  const handleInputChange = useCallback((section, field, value) => {
    setFormData(prevData => ({
      ...prevData,
      [section]: {
        ...prevData[section],
        [field]: value,
      },
    }));
    console.log(`Updated ${section} field ${field} with value:`, value);
  }, []);

  const convertDateValue = (value) => {
    const today = new Date();
    switch(value) {
      case 'urgent':
        return today.toISOString().split('T')[0]; // Returnează data de azi
      case '2days':
        today.setDate(today.getDate() + 2);
        return today.toISOString().split('T')[0];
      case '1week':
        today.setDate(today.getDate() + 7);
        return today.toISOString().split('T')[0];
      case '2weeks':
        today.setDate(today.getDate() + 14);
        return today.toISOString().split('T')[0];
      case '1month':
        today.setMonth(today.getMonth() + 1);
        return today.toISOString().split('T')[0];
      case 'flexible':
        return null; // Sau o altă valoare implicită
      default:
        return value; // Returnează valoarea originală dacă nu se potrivește cu niciun caz
    }
  };

  const submitFormData = async () => {
    const convertedJobData = {
      ...formData.jobDetails,
      startDate: convertDateValue(formData.jobDetails.startDate),
      endDate: convertDateValue(formData.jobDetails.endDate)
    };

    try {
      const { data, error } = await supabase
        .from('jobs')
        .insert([
          {
            ...convertedJobData,
            client_id: formData.clientId,
            // Adăugați alte câmpuri necesare aici
          }
        ]);

      if (error) throw error;
      console.log('Job postat cu succes:', data);
      // Aici puteți adăuga logica pentru ce se întâmplă după postarea cu succes
    } catch (error) {
      console.error('Eroare la postarea jobului:', error);
      // Aici puteți adăuga logica pentru gestionarea erorilor
    }
  };

  return (
    <FormContext.Provider value={{ 
      step, 
      formData, 
      handleInputChange, 
      nextStep, 
      prevStep,
      submitFormData,
      convertDateValue,
      setStep
    }}>
      {children}
    </FormContext.Provider>
  );
};
