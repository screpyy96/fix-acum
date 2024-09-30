"use client"

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid'; // Ensure 'uuid' is installed
import useAuth from '@/hooks/useAuth';

const MultiStepsForm = () => {
  const router = useRouter();
  const { login } = useAuth(); // Use 'login' from AuthContext
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    jobDetails: {},
    contactInfo: {},
    clientData: {
      name: '',
      email: '',
      password: '',
    },
    tradeType: '',
    jobType: '',
    tempClientId: null
  });

  useEffect(() => {
    console.log('useEffect called, generating tempClientId'); // Add this log
    setFormData(prevData => ({
      ...prevData,
      tempClientId: uuidv4()
    }));
  }, []);

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  const handleInputChange = (stepName, data) => {
    console.log(`Updating ${stepName} with data:`, data); // Add this log
    setFormData(prevData => ({
      ...prevData,
      [stepName]: { ...prevData[stepName], ...data }
    }));
  };

  const handleRegisterClient = async () => {
    try {
      const clientId = uuidv4(); // Generate a unique client ID
      const response = await fetch('/api/auth/register-client', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData.clientData,
          clientId, // Include clientId in the request body
        }),
      });

      if (response.ok) {
        const userData = await response.json();
        console.log('Client registered successfully:', userData);

        // Automatic login
        const loginResponse = await fetch('/api/auth/login-client', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: formData.clientData.email,
            password: formData.clientData.password,
          }),
        });

        if (loginResponse.ok) {
          const loginData = await loginResponse.json();
          console.log('Client login data:', loginData); // Debug log
          login(loginData); // Pass the entire response to the login function
          nextStep(); // Move to the next step instead of redirecting
        } else {
          const errorData = await loginResponse.json();
          console.error('Authentication error:', errorData);
          // Display an error message to the user as needed
        }
      } else {
        throw new Error('Client registration failed');
      }
    } catch (error) {
      console.error('Error registering client:', error);
      // Display an error message to the user as needed
    }
  }

  const handleSubmit = async () => {
    try {
      const submitData = {
        job: {
          title: formData.jobDetails.title || `${formData.jobDetails.tradeType} - ${formData.jobDetails.jobType}`,
          description: formData.jobDetails.description || 'Fără descriere',
          tradeType: formData.jobDetails.tradeType,
          jobType: formData.jobDetails.jobType,
        },
        client: {
          name: formData.clientData.name,
          email: formData.clientData.email,
          password: formData.clientData.password,
        }
      };

      console.log('Datele care vor fi trimise:', submitData);

      const response = await fetch('/api/jobs/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      });

      console.log('Response status:', response.status);

      if (response.ok) {
        const result = await response.json();
        console.log('Job și client creați cu succes:', result);
        login({
          token: result.token,
          user: {
            id: result.client.id,
            name: result.client.name,
            email: result.client.email,
            type: 'client',
          }
        });
        router.push('/dashboard');
      } else {
        const errorData = await response.json();
        console.error('Eroare la crearea job-ului și a clientului:', errorData);
      }
    } catch (error) {
      console.error('Eroare:', error);
    }
  };

  const renderStep = () => {
    switch(step) {
      case 1:
        return (
          <div>
            <h2 className="text-xl font-semibold mb-4">Detalii Job</h2>
            <form onSubmit={(e) => { e.preventDefault(); nextStep(); }}>
              <div className="mb-4">
                <label htmlFor="title" className="block mb-2">Titlu Job</label>
                <input
                  type="text"
                  id="title"
                  value={formData.jobDetails.title || ''}
                  onChange={(e) => handleInputChange('jobDetails', { title: e.target.value })}
                  className="w-full p-2 border rounded placeholder-black"
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
                  rows="4"
                  required
                ></textarea>
              </div>
              <div className="mb-4">
                <label htmlFor="tradeType" className="block mb-2">Tip de Meserie</label>
                <input
                  type="text"
                  id="tradeType"
                  value={formData.jobDetails.tradeType || ''}
                  onChange={(e) => handleInputChange('jobDetails', { tradeType: e.target.value })}
                  className="w-full p-2 border rounded placeholder-black"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="jobType" className="block mb-2">Tip de Job</label>
                <input
                  type="text"
                  id="jobType"
                  value={formData.jobDetails.jobType || ''}
                  onChange={(e) => handleInputChange('jobDetails', { jobType: e.target.value })}
                  className="w-full p-2 border rounded placeholder-black"
                  required
                />
              </div>
              <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
                Următorul Pas
              </button>
            </form>
          </div>
        );
      case 2:
        return (
          <div>
            <h2 className="text-xl font-semibold mb-4">Informații de Contact</h2>
            <form onSubmit={(e) => { e.preventDefault(); nextStep(); }}>
              <div className="mb-4">
                <label htmlFor="name" className="block mb-2">Nume</label>
                <input
                  type="text"
                  id="name"
                  value={formData.contactInfo.name || ''}
                  onChange={(e) => handleInputChange('contactInfo', { name: e.target.value })}
                  className="w-full p-2 border rounded placeholder-black"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="email" className="block mb-2">Email</label>
                <input
                  type="email"
                  id="email"
                  value={formData.contactInfo.email || ''}
                  onChange={(e) => handleInputChange('contactInfo', { email: e.target.value })}
                  className="w-full p-2 border rounded placeholder-black"
                  required
                />
              </div>
              <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
                Următorul Pas
              </button>
            </form>
          </div>
        );
      case 3:
        return (
          <div>
            <h2 className="text-xl font-semibold mb-4">Înregistrare Client</h2>
            <form onSubmit={(e) => { e.preventDefault(); handleRegisterClient(); }}>
              <div className="mb-4">
                <label htmlFor="name" className="block mb-2">Nume</label>
                <input
                  type="text"
                  id="name"
                  value={formData.clientData.name || ''}
                  onChange={(e) => handleInputChange('clientData', { name: e.target.value })}
                  className="w-full p-2 border rounded placeholder-black"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="email" className="block mb-2">Email</label>
                <input
                  type="email"
                  id="email"
                  value={formData.clientData.email || ''}
                  onChange={(e) => handleInputChange('clientData', { email: e.target.value })}
                  className="w-full p-2 border rounded placeholder-black"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="password" className="block mb-2">Parolă</label>
                <input
                  type="password"
                  id="password"
                  value={formData.clientData.password || ''}
                  onChange={(e) => handleInputChange('clientData', { password: e.target.value })}
                  className="w-full p-2 border rounded placeholder-black"
                  required
                />
              </div>
              <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
                Înregistrează-ți Contul
              </button>
            </form>
          </div>
        );
      case 4:
        return (
          <div>
            <h2 className="text-xl font-semibold mb-4">Revizuire și Trimitere</h2>
            <p>Titlu Job: {formData.jobDetails.title || `${formData.tradeType} - ${formData.jobType}`}</p>
            <p>Descriere: {formData.jobDetails.description || 'Fără descriere'}</p>
            <p>Nume Client: {formData.clientData.name}</p>
            <p>Email Client: {formData.clientData.email}</p>
            <button onClick={prevStep} className="bg-blue-500 text-white px-4 py-2 rounded mr-2">
              Înapoi
            </button>
            <button onClick={handleSubmit} className="bg-green-500 text-white px-4 py-2 rounded">
              Trimite
            </button>
          </div>
        );
      default:
        return <div>Pas necunoscut</div>;
    }
  };

  return (
    <div>
      <h2>Formular pentru {formData.tradeType} - {formData.jobType}</h2>
      {renderStep()}
    </div>
  );
};

export default MultiStepsForm;