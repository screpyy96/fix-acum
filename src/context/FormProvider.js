"use client"

import React, { createContext, useState, useContext, useCallback } from 'react';

const FormContext = createContext();

export const useForm = () => useContext(FormContext);

export const FormProvider = ({ children, initialTradeType, initialJobType }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    jobDetails: {
      tradeType: initialTradeType,
      jobType: initialJobType,
      title: '',
      description: '',
    },
    clientData: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    clientId: '',
  });

  const nextStep = useCallback(() => {
    setStep(prevStep => prevStep + 1);
  }, []);

  const prevStep = useCallback(() => {
    setStep(prevStep => Math.max(prevStep - 1, 1));
  }, []);

  const handleInputChange = useCallback((field, value) => {
    setFormData(prevData => ({
      ...prevData,
      [field]: {
        ...prevData[field],
        ...value,
      },
    }));
  }, []);

  return (
    <FormContext.Provider value={{ step, formData, handleInputChange, nextStep, prevStep }}>
      {children}
    </FormContext.Provider>
  );
};