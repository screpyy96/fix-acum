"use client"

import React from 'react';
import HeroForm from './heroForm';

const Hero = () => {
  return (
    <div className="bg-gradient-to-r from-blue-500 to-purple-600 min-h-screen flex items-center justify-center">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center text-white mb-12">
          <h1 className="text-5xl font-bold mb-4">Găsiți meșterul potrivit pentru orice lucrare</h1>
          <p className="text-xl mb-8">Conectăm profesioniști de încredere cu clienți ca dumneavoastră</p>
        </div>
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-2xl mx-auto">
          <HeroForm />
        </div>
      </div>
    </div>
  );
};

export default Hero;