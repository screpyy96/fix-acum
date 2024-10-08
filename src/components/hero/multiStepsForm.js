'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useForm } from '@/context/FormProvider'
import useAuth from '@/hooks/useAuth'
import Step1JobDetails from './steps/jobDetails'
import RegisterClient from './steps/registerClient'
import { FaArrowLeft, FaCheck } from 'react-icons/fa'

const MultiStepsForm = ({ tradeType, jobType }) => {
  const { formData, setFormData, step, nextStep, prevStep } = useForm()
  const [error, setError] = useState('')
  const router = useRouter()
  const { isAuthenticated, login } = useAuth()

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
      })

      const result = await response.json()

      if (response.ok) {
        login({
          token: result.token,
          user: result.user
        })
        handleSubmit()
      } else {
        setError(result.error || 'A apărut o eroare la înregistrarea clientului.')
      }
    } catch (error) {
      console.error('Eroare la înregistrare:', error)
      setError('A apărut o eroare la trimiterea datelor.')
    }
  }

  const handleSubmit = async () => {
    try {
      const submitData = {
        job: {
          ...formData.jobDetails,
          clientId: formData.clientId,
          status: 'open',
        },
      }

      const response = await fetch('/api/jobs/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        },
        body: JSON.stringify(submitData),
      })

      if (response.ok) {
        const result = await response.json()
        router.push('/dashboard/client')
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Failed to create job.')
      }
    } catch (error) {
      console.error('Error submitting job:', error)
      setError('An error occurred while submitting the job.')
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
        {/* Eliminat butonul "Următorul" */}
      </div>
    </div>
  )
}

export default MultiStepsForm