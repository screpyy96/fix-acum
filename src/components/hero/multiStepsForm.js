'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useForm } from '@/context/FormProvider'
import useAuth from '@/hooks/useAuth'
import Step1JobDetails from './steps/jobDetails'
import RegisterClient from './steps/registerClient'
import { FaArrowLeft, FaCheck } from 'react-icons/fa'
import { supabase } from '@/lib/supabase'

const MultiStepsForm = ({ tradeType, jobType }) => {
  const { formData, setFormData, step, nextStep, prevStep } = useForm()
  const [error, setError] = useState('')
  const router = useRouter()
  const { isAuthenticated, signIn } = useAuth()

  const handleInputChange = (field, value) => {
    setFormData(prevData => ({
      ...prevData,
      jobDetails: {
        ...prevData.jobDetails,
        [field]: value,
      },
    }))
  }

  const handleRegister = async (clientData) => {
    try {
      // Înregistrează utilizatorul cu Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email: clientData.email,
        password: clientData.password,
        options: {
          data: {
            name: clientData.name,
            role: 'client'
          }
        }
      });

      if (error) throw error;

      // Creează profilul clientului în tabela 'profiles'
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: data.user.id,
          name: clientData.name,
          role: 'client'
        });

      if (profileError) throw profileError;

      // Autentifică utilizatorul nou creat
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: clientData.email,
        password: clientData.password,
      });

      if (signInError) throw signInError;

      signIn(signInData);
      handleSubmit();
    } catch (error) {
      console.error('Eroare la înregistrare:', error);
      setError(error.message || 'A apărut o eroare la înregistrarea clientului.');
    }
  }

  const handleSubmit = async () => {
    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();

      if (sessionError || !session) throw new Error('Nu sunteți autentificat');

      const { data, error } = await supabase
        .from('jobs')
        .insert({
          client_id: session.user.id,
          title: formData.jobDetails.title,
          description: formData.jobDetails.description,
          trade_type: tradeType,
          job_type: jobType,
          status: 'open',
          budget: formData.jobDetails.budget || null,
          location: formData.jobDetails.location || null,
          start_date: formData.jobDetails.startDate || null,
          end_date: formData.jobDetails.endDate || null
        })
        .select();

      if (error) throw error;

      router.push('/dashboard/client');
    } catch (error) {
      console.error('Error submitting job:', error);
      setError('An error occurred while submitting the job.');
    }
  }

  const renderStep = () => {
    switch (step) {
      case 1:
        return <Step1JobDetails onInputChange={handleInputChange} formData={formData.jobDetails} />
      case 2:
        return isAuthenticated ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <h2 className="text-2xl font-bold mb-4">Confirmare Job</h2>
            <p className="mb-4">Sunteți gata să creați acest job?</p>
            <button 
              onClick={handleSubmit} 
              className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300 flex items-center justify-center"
            >
              <FaCheck className="mr-2" /> Creează Job
            </button>
          </motion.div>
        ) : (
          <RegisterClient onRegister={handleRegister} />
        )
      default:
        return null
    }
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
      <AnimatePresence mode="wait">
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-red-500 mb-4 p-2 bg-red-100 rounded"
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>
      
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {renderStep()}
        </motion.div>
      </AnimatePresence>

      <div className="flex justify-between mt-6">
        {step > 1 && (
          <button 
            onClick={prevStep}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 transition duration-300 flex items-center"
          >
            <FaArrowLeft className="mr-2" /> Înapoi
          </button>
        )}
      </div>
    </div>
  )
}

export default MultiStepsForm