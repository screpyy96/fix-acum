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
  const { formData, step, nextStep, prevStep, convertDateValue } = useForm()
  const [error, setError] = useState('')
  const router = useRouter()
  const { isAuthenticated } = useAuth()
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    try {
      if (!isAuthenticated) {
        // Înregistrarea utilizatorului folosind Supabase
        const { data: { user }, error: signUpError } = await supabase.auth.signUp({
          email: formData.userDetails.email,
          password: formData.userDetails.password,
        });

        if (signUpError) throw signUpError;

        // Crearea profilului utilizatorului
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: user.id,
            name: formData.userDetails.name,
            email: formData.userDetails.email,
            role: 'client'
          });

        if (profileError) throw profileError;
      }

      // Obținem ID-ul utilizatorului curent
      const { data: { user } } = await supabase.auth.getUser();

      // Crearea job-ului
      const { error: jobError } = await supabase
        .from('jobs')
        .insert({
          client_id: user.id,
          title: formData.jobDetails.title,
          description: formData.jobDetails.description,
          tradeType: tradeType,
          jobType: jobType,
          status: 'open',
          budget: formData.jobDetails.budget || null,
          location: formData.jobDetails.location || null,
          startDate: convertDateValue(formData.jobDetails.startDate),
          endDate: convertDateValue(formData.jobDetails.endDate)
        });

      if (jobError) throw jobError;

      // Succes - redirecționare către dashboard
      router.push('/dashboard/client');
    } catch (error) {
      console.error('Error during registration or job creation:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  const renderStep = () => {
    switch (step) {
      case 1:
        return <Step1JobDetails />
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
          <RegisterClient />
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
