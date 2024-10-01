'use client';

import { useEffect } from 'react';
import { useForm } from '@/context/FormProvider';
import Step1JobDetails from './steps/jobDetails';
import Step2ContactInfo from './steps/contactInfo';
import Step3ClientRegistration from './steps/registerClient';
import Step4ReviewSubmit from './steps/reviewSubmit';
import { useRouter } from 'next/navigation';
import useAuth from '@/hooks/useAuth';
import { v4 as uuidv4 } from 'uuid';

const MultiStepsForm = ({tradeType, jobType}) => {
  const { step, formData, handleInputChange, nextStep } = useForm();
  const router = useRouter();
  const { login, isAuthenticated, user } = useAuth();

  useEffect(() => {
    handleInputChange('clientId', uuidv4());
    handleInputChange('jobDetails', { tradeType, jobType });
  }, []);

  const handleRegisterClient = async (e) => {
   
    try {
      const clientData = {
        name: formData.clientData.name,
        email: formData.clientData.email,
        password: formData.clientData.password,
        clientId: formData.clientId.toString(),
      };

      const response = await fetch('/api/auth/register-client', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(clientData),
      });

      if (response.ok) {
        const userData = await response.json();
        console.log('Client registered successfully:', userData);
        nextStep();
      } else {
        const errorData = await response.json();
        console.error('Error registering client:', errorData);
        // Aici poți adăuga o notificare pentru utilizator cu detaliile erorii
      }
    } catch (error) {
      console.error('Error:', error);
      // Aici poți adăuga o notificare generală de eroare pentru utilizator
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const submitData = {
        job: {
          title: formData.jobDetails.title || `${formData.jobDetails.tradeType} - ${formData.jobDetails.jobType}`,
          description: formData.jobDetails.description || 'Fără descriere',
          tradeType: formData.jobDetails.tradeType,
          jobType: formData.jobDetails.jobType,
        },
        client: isAuthenticated ? {
          id: user.id,
          name: user.name,
          email: user.email,
        } : {
          ...formData.clientData,
          clientId: formData.clientId || uuidv4(), // Asigură-te că clientId este un string
        },
      };

      const response = await fetch('/api/jobs/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Job și client creați cu succes:', result);
        if (!isAuthenticated) {
          login({
            token: result.token,
            user: {
              id: result.client.id,
              name: result.client.name,
              email: result.client.email,
              type: 'client',
            }
          });
        }
        router.push('/dashboard');
      } else {
        const errorData = await response.json();
        console.error('Eroare la crearea job-ului și a clientului:', errorData);
      }
    } catch (error) {
      console.error('Eroare:', error);
    }
  };

  console.log('Current form data:', formData);
  console.log('Current step:', step);

  const renderStep = () => {
    switch(step) {
      case 1: return <Step1JobDetails />;
      case 2: return <Step2ContactInfo />;
      case 3: 
        return isAuthenticated ? <Step4ReviewSubmit onSubmit={handleSubmit} /> : <Step3ClientRegistration onRegister={handleRegisterClient} />;
      case 4: return <Step4ReviewSubmit onSubmit={handleSubmit} />;
      default: return <div>Pas necunoscut</div>;
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">Crează un Job</h2>
      {renderStep()}
    </div>
  );
};

export default MultiStepsForm;
