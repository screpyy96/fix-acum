"use client"

import React, { useState, useEffect } from 'react'
import { motion, useAnimation } from 'framer-motion'
import { FaTools, FaSearch, FaStar } from 'react-icons/fa'
import HeroForm from './heroForm'
import { Canvas } from '@react-three/fiber'
import { useGLTF, OrbitControls, Environment } from '@react-three/drei'

const Model = () => {
  const gltf = useGLTF('/hat.glb')
  return <primitive object={gltf.scene} scale={2} position={[0, -1, 0]} />
}

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
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-r from-blue-800 to-purple-600">
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: 'url("/pattern.svg")',
          backgroundSize: 'cover',
          transform: `translateY(${scrollY * 0.1}px)`,
        }}
      />
      <div className="relative container mx-auto px-4 py-20 min-h-screen flex flex-col justify-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={controls}
          className="max-w-4xl mx-auto text-center text-white mb-12"
        >
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight">
            Găsiți meșterul potrivit pentru orice lucrare
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            Conectăm profesioniști de încredere cu clienți ca dumneavoastră
          </p>
          <div className="flex flex-wrap justify-center gap-8 mb-12">
            {features.map((feature, index) => (
              <motion.div 
                key={index}
                whileHover={{ scale: 1.1 }}
                className="flex flex-col items-center transition-transform duration-300"
              >
                <feature.icon className="text-5xl mb-2" />
                <span className="text-lg">{feature.text}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="bg-white rounded-lg shadow-2xl p-8 max-w-2xl mx-auto"
        >
          <HeroForm />
        </motion.div>
      </div>
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 0L60 10C120 20 240 40 360 46.7C480 53 600 47 720 43.3C840 40 960 40 1080 46.7C1200 53 1320 67 1380 73.3L1440 80V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V0Z" fill="white"/>
        </svg>
      </div>
      <div className="absolute top-10 right-10 w-64 h-64">
        <Canvas>
          <OrbitControls enableZoom={false} />
          <Environment preset="sunset" />
          <Model />
        </Canvas>
      </div>
    </div>
  )
}

export default Hero