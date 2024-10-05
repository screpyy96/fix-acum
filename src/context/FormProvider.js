"use client"

import React, { createContext, useState, useContext, useCallback, useEffect } from 'react';

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
      startTime: '', // New field for question 1
      projectStage: '', // New field for question 2
      isAuthorized: '', // New field for question 3
    },
    clientData: {
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

  return (
    <FormContext.Provider value={{ step, formData, handleInputChange, nextStep, prevStep }}>
      {children}
    </FormContext.Provider>
  );
};