'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useForm } from '@/context/FormProvider'
import useAuth from '@/hooks/useAuth'
import Step1JobDetails from './steps/jobDetails'
import Step2Location from './steps/location'
import RegisterClient from './steps/registerClient'
import { FaArrowLeft } from 'react-icons/fa'
import { supabase } from '@/lib/supabase'
import ReviewSubmit from './steps/reviewSubmit'

const MultiStepsForm = ({ tradeType, jobType }) => {
  const { formData, step, nextStep, prevStep, convertDateValue } = useForm()
  const [error, setError] = useState('')
  const router = useRouter()
  const { isAuthenticated, setIsAuthenticated } = useAuth()
  const [loading, setLoading] = useState(false)

  const handleRegisterSuccess = () => {
    setIsAuthenticated(true)
    nextStep()
  }

  const handleJobCreation = async () => {
    setLoading(true)
    setError(null)

    try {
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        throw new Error('User not authenticated')
      }

      const { error: jobError } = await supabase
        .from('jobs')
        .insert({
          client_id: user.id,
          title: formData.jobDetails.title,
          description: formData.jobDetails.description,
          tradeType: tradeType,
          jobType: jobType,
          city: formData.location.city,
          address: formData.location.address,
          status: 'open',
          budget: formData.jobDetails.budget || null,
          startDate: convertDateValue(formData.jobDetails.startDate),
          endDate: convertDateValue(formData.jobDetails.endDate)
        })

      if (jobError) throw jobError

      router.push('/dashboard/client')
    } catch (error) {
      console.error('Error creating job:', error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const renderStep = () => {
    switch (step) {
      case 1:
        return <Step1JobDetails />
      case 2:
        return <Step2Location />
      case 3:
        return isAuthenticated ? (
          <ReviewSubmit onSubmit={handleJobCreation} />
        ) : (
          <RegisterClient onRegisterSuccess={handleRegisterSuccess} />
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
