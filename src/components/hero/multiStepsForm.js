'use client';

import { useEffect } from 'react';
import { useForm } from '@/context/FormProvider';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import useAuth from '@/hooks/useAuth';
import Step1JobDetails from './steps/jobDetails';
import RegisterClient from './steps/registerClient';

const MultiStepsForm = ({tradeType, jobType}) => {
  const { formData, setFormData, step, nextStep, prevStep } = useForm();
  const [error, setError] = useState('');
  const router = useRouter();
  const { isAuthenticated, login } = useAuth();

  const handleInputChange = (field, value) => {
    setFormData(prevData => ({
      ...prevData,
      jobDetails: {
        ...prevData.jobDetails,
        [field]: value,
      },
    }));
  };

  const handleRegister = async (clientData) => {
    try {
      console.log('Sending registration data:', clientData);
      const response = await fetch('/api/auth/register-client', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: clientData.name,
          email: clientData.email,
          password: clientData.password
        }),
      });

      console.log('Registration response status:', response.status);
      const result = await response.json();
      console.log('Registration response:', result);

      if (response.ok) {
        console.log('Client înregistrat cu succes:', result);
        
        login({
          token: result.token,
          user: result.user
        });

        handleSubmit();
      } else {
        console.error('Eroare la înregistrarea clientului:', result);
        setError(result.error || 'A apărut o eroare la înregistrarea clientului.');
      }
    } catch (error) {
      console.error('Eroare la înregistrare:', error);
      setError('A apărut o eroare la trimiterea datelor.');
    }
  };

  const handleSubmit = async () => {
    try {
      const submitData = {
        job: {
          ...formData.jobDetails,
          tradeType: formData.jobDetails.tradeType,
          jobType: formData.jobDetails.jobType,
          clientId: formData.clientId,
          title: formData.jobDetails.title,
          description: formData.jobDetails.description,
          startTime: formData.jobDetails.startTime,
          projectStage: formData.jobDetails.projectStage,
          isAuthorized: formData.jobDetails.isAuthorized,
          status: 'open', // Use a valid enum value
        },
      };
      console.log('Submitting job data:', submitData);

      const response = await fetch('/api/jobs/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        },
        body: JSON.stringify(submitData),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Job created successfully:', result);
        alert('Job created successfully!');
        router.push('/dashboard/client');
      } else {
        const errorData = await response.json();
        console.error('Error creating job:', errorData);
        setError(errorData.error || 'Failed to create job.');
      }
    } catch (error) {
      console.error('Error submitting job:', error);
      setError('An error occurred while submitting the job.');
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return <Step1JobDetails onInputChange={handleInputChange} />;
      case 2:
        return isAuthenticated ? (
          <button onClick={handleSubmit} className="bg-blue-500 text-white px-4 py-2 rounded">
            Creează Job
          </button>
        ) : (
          <RegisterClient onRegister={handleRegister} />
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      {error && <div className="text-red-500 mb-4">{error}</div>}
      {renderStep()}
    </div>
  );
};

export default MultiStepsForm;

