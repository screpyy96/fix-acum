
"use client"
import React, { useState } from 'react';
import { FaHome, FaTools, FaHandshake, FaStar } from 'react-icons/fa';

const ServiceCard = ({ icon, title, description }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="bg-white rounded-lg shadow-lg p-6 transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-xl"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`mb-4 text-4xl ${isHovered ? 'text-blue-600' : 'text-gray-600'} transition-colors duration-300`}>
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className={`text-gray-600 transition-all duration-300 ${isHovered ? 'text-blue-800' : ''}`}>
        {description}
      </p>
    </div>
  );
};

const ModernJobPlatform = () => {
  const services = [
    {
      icon: <FaHome />,
      title: "Găsiți Profesioniști",
      description: "Conectați-vă cu muncitori calificați pentru proiectele dvs. de acasă."
    },
    {
      icon: <FaTools />,
      title: "Servicii Diverse",
      description: "De la reparații minore la renovări majore, avem experți pentru orice nevoie."
    },
    {
      icon: <FaHandshake />,
      title: "Colaborare Ușoară",
      description: "Platformă intuitivă pentru comunicare și gestionarea proiectelor."
    },
    {
      icon: <FaStar />,
      title: "Calitate Garantată",
      description: "Profesioniști verificați și evaluați pentru cele mai bune rezultate."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-blue-800 mb-4">
          Conectăm Talentul cu Oportunitățile
        </h1>
        <p className="text-xl text-center text-gray-600 mb-12">
          Platforma modernă care aduce împreună proprietarii de case și profesioniștii calificați
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <ServiceCard key={index} {...service} />
          ))}
        </div>

        <div className="mt-16 text-center">
          <button className="bg-blue-600 text-white font-bold py-3 px-8 rounded-full hover:bg-blue-700 transition duration-300 ease-in-out transform hover:scale-105">
            Începeți Acum
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModernJobPlatform;