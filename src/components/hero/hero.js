"use client"

import React, { useState, useEffect } from 'react'
import { motion, useAnimation } from 'framer-motion'
import { FaTools, FaSearch, FaStar, FaArrowDown } from 'react-icons/fa'
import HeroForm from './heroForm'



const Hero = () => {
  const [scrollY, setScrollY] = useState(0)
  const controls = useAnimation()

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    controls.start({ opacity: 1, y: 0, transition: { duration: 0.8 } })
  }, [controls])

  const features = [
    { icon: FaTools, text: "Profesioniști calificați" },
    { icon: FaSearch, text: "Căutare ușoară" },
    { icon: FaStar, text: "Recenzii verificate" }
  ]

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-blue-900 via-purple-800 to-pink-700">
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: 'url("/pattern.svg")',
          backgroundSize: 'cover',
          transform: `translateY(${scrollY * 0.1}px)`,
        }}
      />
      <div className="relative container mx-auto px-4 py-12 md:py-20 min-h-screen flex flex-col justify-between">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={controls}
          className="max-w-4xl mx-auto text-center text-white mb-8 md:mb-12"
        >
          <h1 className="text-4xl md:text-6xl lg:text-5xl font-extrabold mb-6 leading-tight">
            Găsiți <span className="text-yellow-400">meșterul potrivit</span> pentru orice lucrare
          </h1>
          <p className="text-lg md:text-xl lg:text-2xl mb-8 opacity-90">
            Conectăm profesioniști de încredere cu clienți ca dumneavoastră
          </p>
          <div className="flex flex-wrap justify-center gap-6 md:gap-8 mb-8 md:mb-12">
            {features.map((feature, index) => (
              <motion.div 
                key={index}
                whileHover={{ scale: 1.1 }}
                className="flex flex-col items-center transition-transform duration-300 bg-white bg-opacity-10 rounded-lg p-4 backdrop-blur-sm"
              >
                <feature.icon className="text-3xl md:text-5xl mb-2 text-yellow-400" />
                <span className="text-sm md:text-lg">{feature.text}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="bg-white rounded-lg shadow-2xl p-6 md:p-8 max-w-2xl mx-auto w-full"
        >
          <HeroForm />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center mt-8 md:mt-12"
        >
          <a href="#about" className="text-white hover:text-yellow-400 transition-colors duration-300">
            <FaArrowDown className="text-3xl md:text-4xl animate-bounce" />
            <span className="sr-only">Scroll down</span>
          </a>
        </motion.div>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 0L60 10C120 20 240 40 360 46.7C480 53 600 47 720 43.3C840 40 960 40 1080 46.7C1200 53 1320 67 1380 73.3L1440 80V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V0Z" fill="white"/>
        </svg>
      </div>
    </div>
  )
}

export default Hero
