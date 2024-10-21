"use client"

import React, { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { FaTools, FaHardHat, FaSearch } from 'react-icons/fa'

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
    setFormData(prevData => ({ ...prevData, [name]: value }))
    setError('')
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    if (!formData.tradeType || !formData.jobType) {
      setError('Vă rugăm să completați toate câmpurile.')
      setIsSubmitting(false)
      return
    }
    try {
      const dynamicLink = `/post-a-job/${encodeURIComponent(formData.tradeType)}/${encodeURIComponent(formData.jobType)}`
      router.push(dynamicLink)
    } catch (error) {
      console.error('Eroare:', error)
      setError('A apărut o eroare. Încercați din nou.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-3xl mx-auto"
    >
      <form onSubmit={handleSubmit} className="flex flex-col md:flex-row items-center gap-4">
        <div className="w-full md:w-1/3 relative">
          <select
            name="tradeType"
            value={formData.tradeType}
            onChange={handleInputChange}
            className="w-full p-4 pr-10 text-gray-700 bg-white border-2 border-gray-300 rounded-lg appearance-none focus:outline-none focus:border-blue-500"
            required
          >
            <option value="">Selectați meșterul</option>
            {trades.map((trade) => (
              <option key={trade} value={trade}>{trade}</option>
            ))}
          </select>
          <FaTools className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
        <div className="w-full md:w-1/3 relative">
          <select
            name="jobType"
            value={formData.jobType}
            onChange={handleInputChange}
            className="w-full p-4 pr-10 text-gray-700 bg-white border-2 border-gray-300 rounded-lg appearance-none focus:outline-none focus:border-blue-500"
            required
          >
            <option value="">Selectați lucrarea</option>
            {jobTypes.map((jobType) => (
              <option key={jobType.value} value={jobType.value}>{jobType.label}</option>
            ))}
          </select>
          <FaHardHat className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
        <motion.button 
          type="submit"
          className="w-full md:w-1/3 bg-blue-600 text-white p-4 rounded-lg font-bold hover:bg-blue-700 transition duration-300 flex items-center justify-center"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <motion.span
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              ⏳
            </motion.span>
          ) : (
            <>
              <FaSearch className="mr-2" />
              Caută
            </>
          )}
        </motion.button>
      </form>
      <AnimatePresence>
        {error && (
          <motion.p 
            className="text-red-500 text-sm text-center mt-2"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default HeroForm
