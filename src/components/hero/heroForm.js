"use client"

import React, { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { FaTools, FaHardHat, FaChevronRight } from 'react-icons/fa'

const HeroForm = () => {
  const [formData, setFormData] = useState({
    tradeType: '',
    jobType: ''
  })

  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const trades = [
    "Instalator", "Fierar", "Zidar", "Constructor", "Tâmplar", "Curățenie", 
    "Drenaj", "Pavator", "Electrician", "Montator", "Grădinar", "Inginer", 
    "Meșter", "Bucătării", "Lăcătuș", "Mansardări", "Zugrav", "Dezinsecție", 
    "Tencuitor", "Mutare", "Energie", "Acoperișuri", "Securitate", 
    "Specialist", "Pietrar", "Piscine", "Faianțar", "Meșteșugar", "Arborist", 
    "Ferestre"
  ]

  const jobTypes = [
    { value: "installation", label: "Instalare" },
    { value: "repair", label: "Reparație" },
    { value: "maintenance", label: "Întreținere" }
  ]

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }))
    setError('')
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    if (!formData.tradeType || !formData.jobType) {
      setError('Vă rugăm să selectați ambele câmpuri pentru a continua.')
      setIsSubmitting(false)
      return
    }

    try {
      const dynamicLink = `/post-a-job/${encodeURIComponent(formData.tradeType)}/${encodeURIComponent(formData.jobType)}`
      router.push(dynamicLink)
    } catch (error) {
      console.error('Eroare la trimiterea formularului:', error)
      setError('A apărut o eroare la trimiterea formularului. Vă rugăm să încercați din nou.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <motion.form 
      onSubmit={handleSubmit} 
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700" htmlFor="tradeType">
            Ce tip de meșter ai nevoie?
          </label>
          <div className="relative">
            <select
              id="tradeType"
              name="tradeType"
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              value={formData.tradeType}
              onChange={handleInputChange}
              required
            >
              <option value="">Vă rugăm să selectați</option>
              {trades.map((trade) => (
                <option key={trade} value={trade}>{trade}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <FaTools className="h-4 w-4" />
            </div>
          </div>
        </div>
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700" htmlFor="jobType">
            Ce tip de lucrare este?
          </label>
          <div className="relative">
            <select
              id="jobType"
              name="jobType"
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              value={formData.jobType}
              onChange={handleInputChange}
              required
            >
              <option value="">Vă rugăm să selectați</option>
              {jobTypes.map((jobType) => (
                <option key={jobType.value} value={jobType.value}>{jobType.label}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <FaHardHat className="h-4 w-4" />
            </div>
          </div>
        </div>
      </div>
      <AnimatePresence>
        {error && (
          <motion.p 
            className="text-red-500 text-sm"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
      <div className="flex justify-center">
        <motion.button 
          type="submit" 
          className="flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          disabled={isSubmitting}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isSubmitting ? (
            <motion.span
              className="inline-block"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              ⏳
            </motion.span>
          ) : (
            <>
              Următorul pas <FaChevronRight className="ml-2" />
            </>
          )}
        </motion.button>
      </div>
    </motion.form>
  )
}

export default HeroForm