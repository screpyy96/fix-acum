"use client"

import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { FaTools, FaPaintRoller, FaBolt, FaWrench, FaStar, FaApple, FaGooglePlay } from 'react-icons/fa';

const ModernJobPlatform2024 = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const categories = [
    { icon: <FaTools />, name: "Reparații generale" },
    { icon: <FaPaintRoller />, name: "Zugrăvit" },
    { icon: <FaBolt />, name: "Electrician" },
    { icon: <FaWrench />, name: "Instalator" },
  ];

  const testimonials = [
    { name: "Ana Popescu", image: "https://randomuser.me/api/portraits/women/1.jpg", text: "Am găsit un zugrav excelent în doar câteva minute!" },
    { name: "Mihai Ionescu", image: "https://randomuser.me/api/portraits/men/2.jpg", text: "Platforma a simplificat enorm procesul de renovare a casei mele." },
    { name: "Elena Dumitrescu", image: "https://randomuser.me/api/portraits/women/3.jpg", text: "Calitatea serviciilor a fost impecabilă. Recomand cu încredere!" },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-purple-900 via-pink-800 to-red-900">
        <div 
          className="absolute inset-0 z-0 opacity-20" 
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            transform: `translateY(${scrollY * 0.5}px)`,
          }}
        />
        <div className="container mx-auto px-6 relative z-20 text-center">
          <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 animate-fade-in-down">
            Conectăm Talentul cu Oportunitățile
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 mb-12 animate-fade-in-up max-w-3xl mx-auto">
            Găsiți profesioniști de top pentru orice proiect de casă, rapid și ușor
          </p>
          <button className="bg-white text-purple-900 text-lg font-semibold py-4 px-8 rounded-lg hover:bg-gray-100 transition duration-300 transform hover:scale-105 shadow-lg">
            Începeți Căutarea
          </button>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">Categorii Populare</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {categories.map((category, index) => (
              <div 
                key={index} 
                className="bg-gradient-to-br from-purple-200 to-pink-200 rounded-xl p-6 text-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-pink-300"
              >
                <div className="text-5xl mb-4 text-purple-800">{category.icon}</div>
                <div className="font-semibold text-gray-900 text-lg">{category.name}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-to-br from-purple-100 to-pink-100">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">Ce Spun Clienții Noștri</h2>
          <div className="grid md:grid-cols-3 gap-12">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index} 
                className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <div className="flex items-center mb-6">
                  <img src={testimonial.image} alt={testimonial.name} className="w-16 h-16 rounded-full mr-4 border-4 border-pink-300" />
                  <div>
                    <div className="font-semibold text-lg text-gray-900">{testimonial.name}</div>
                    <div className="text-pink-700 flex">
                      {[...Array(5)].map((_, i) => (
                        <FaStar key={i} className="mr-1" />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-700">{testimonial.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA for Professionals */}
      <section className="py-20 bg-gradient-to-b from-purple-900 via-pink-800 to-red-900 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-6">Sunteți un Profesionist?</h2>
          <p className="text-xl mb-12 max-w-2xl mx-auto text-gray-200">
            Alăturați-vă platformei noastre și descoperiți noi oportunități de lucru în fiecare zi!
          </p>
          <Link href="/register/worker" className="bg-white text-purple-900 font-bold text-lg py-4 px-10 rounded-lg hover:bg-gray-100 transition duration-300 transform hover:scale-105 shadow-lg">
            Înregistrați-vă Acum
          </Link>
        </div>
      </section>

      {/* App Download Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between">
          <div className="md:w-1/2 mb-12 md:mb-0">
            <h2 className="text-4xl font-bold mb-6 text-gray-900">Descărcați Aplicația Noastră</h2>
            <p className="text-xl mb-8 text-gray-700">
              Găsiți profesioniști și gestionați proiectele direct de pe telefonul dvs., oriunde v-ați afla.
            </p>
            <div className="flex space-x-4">
              <button className="bg-purple-800 text-white font-semibold py-3 px-6 rounded-lg flex items-center hover:bg-purple-900 transition duration-300 shadow-lg">
                <FaApple className="mr-2 text-2xl" /> App Store
              </button>
              <button className="bg-pink-700 text-white font-semibold py-3 px-6 rounded-lg flex items-center hover:bg-pink-800 transition duration-300 shadow-lg">
                <FaGooglePlay className="mr-2 text-2xl" /> Google Play
              </button>
            </div>
          </div>
          <div className="md:w-1/2">
            <img 
              src="https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80" 
              alt="Mobile App" 
              className="rounded-xl shadow-2xl"
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default ModernJobPlatform2024;